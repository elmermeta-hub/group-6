/**
 * NutriSafe Streamable HTTP MCP Client
 * Protocol: 2025-11-25
 * Communicates with /api/mcp via JSON-RPC over HTTP.
 */

import { useSyncExternalStore } from 'react';

export class McpNotFoundError extends Error {
  payload?: any;
  constructor(message: string, payload?: any) {
    super(message);
    this.name = 'McpNotFoundError';
    this.payload = payload;
  }
}

export function describeMcpError(err: unknown): string {
  if (err instanceof McpNotFoundError) {
    return err.message;
  }
  if (err instanceof Error) {
    if (err.name === 'AbortError' || err.message.toLowerCase().includes('timeout')) {
      return 'Request to MCP server timed out after 15 seconds. Ensure local server is running.';
    }
    if (err.message.toLowerCase().includes('failed to fetch') || err.message.toLowerCase().includes('network')) {
      return 'MCP server is unreachable. Check network or local dev server connection.';
    }
    return err.message;
  }
  return 'An unexpected error occurred while communicating with the MCP server.';
}

export interface McpStatusState {
  status: 'connected' | 'offline' | 'connecting' | 'idle';
  latency: number | null;
  lastCallTime: number | null;
  lastError: string | null;
  toolCallCount: number;
  serverInfo: {
    name: string;
    title: string;
    version: string;
  } | null;
}

let currentState: McpStatusState = {
  status: 'idle',
  latency: null,
  lastCallTime: null,
  lastError: null,
  toolCallCount: 0,
  serverInfo: null
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function updateStatus(updates: Partial<McpStatusState>) {
  currentState = { ...currentState, ...updates };
  emitChange();
}

export function useMcpStatus(): McpStatusState {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    () => currentState
  );
}

let isInitialized = false;
let initPromise: Promise<string> | null = null;
let activeProtocolVersion = '2025-11-25';
let rpcIdCounter = 1;

/**
 * Executes a fetch request to /api/mcp with a 15-second timeout and required headers
 */
async function fetchMcp(body: any, protocolHeader?: string): Promise<{ res: Response; json: any }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream'
  };

  if (protocolHeader) {
    headers['MCP-Protocol-Version'] = protocolHeader;
  }

  try {
    const res = await fetch('/api/mcp', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // If 202 Accepted (like notifications/initialized with no body)
    if (res.status === 202 || res.headers.get('content-length') === '0') {
      return { res, json: null };
    }

    if (res.status >= 500) {
      throw new Error(`Server returned status ${res.status}: ${res.statusText}`);
    }

    let json = null;
    const text = await res.text();
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error('Received invalid non-JSON response from MCP server.');
      }
    }

    if (!res.ok && res.status !== 200 && res.status !== 202) {
      const errMsg = json?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      throw new Error(errMsg);
    }

    return { res, json };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Initializes the MCP session:
 * 1. POST initialize with protocolVersion "2025-11-25"
 * 2. POST notifications/initialized
 */
async function ensureInitialized(): Promise<string> {
  if (isInitialized) {
    return activeProtocolVersion;
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      // Step 1: initialize
      const initBody = {
        jsonrpc: '2.0',
        id: ++rpcIdCounter,
        method: 'initialize',
        params: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          clientInfo: {
            name: 'nutrisafe-react-client',
            version: '3.0.0'
          }
        }
      };

      const { json: initRes } = await fetchMcp(initBody);
      if (initRes?.error) {
        throw new Error(initRes.error.message || 'MCP initialize failed');
      }

      if (initRes?.result?.serverInfo) {
        updateStatus({
          serverInfo: initRes.result.serverInfo
        });
      }

      activeProtocolVersion = initRes?.result?.protocolVersion || '2025-11-25';

      // Step 2: notifications/initialized
      const notifyBody = {
        jsonrpc: '2.0',
        method: 'notifications/initialized',
        params: {}
      };

      await fetchMcp(notifyBody, activeProtocolVersion);

      isInitialized = true;
      return activeProtocolVersion;
    } catch (err) {
      isInitialized = false;
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

export interface McpCallResult<T = any> {
  data: T;
  rawPayload: any;
  latency: number;
}

/**
 * Call an MCP tool on /api/mcp
 * Resolves to { data, rawPayload, latency } with latency measured in browser.
 * Throws McpNotFoundError when reply has isError with found: false.
 */
export async function callMcp<T = any>(
  tool: 'check_additive' | 'check_ingredient_list' | 'search_additives' | 'check_nutrition' | 'check_pesticide_mrl',
  args: Record<string, any>
): Promise<McpCallResult<T>> {
  const startTime = performance.now();

  try {
    const protoVersion = await ensureInitialized();

    const callBody = {
      jsonrpc: '2.0',
      id: ++rpcIdCounter,
      method: 'tools/call',
      params: {
        name: tool,
        arguments: args
      }
    };

    const { json: rpcRes } = await fetchMcp(callBody, protoVersion);
    const endTime = performance.now();
    const measuredLatency = Math.max(1, Math.round(endTime - startTime));

    if (rpcRes?.error) {
      throw new Error(rpcRes.error.message || `RPC Error code ${rpcRes.error.code}`);
    }

    const toolResult = rpcRes?.result;
    if (!toolResult) {
      throw new Error('MCP server returned empty tool execution result.');
    }

    // Extract structured content if provided
    let structured = toolResult.structuredContent;
    if (!structured && toolResult.content && toolResult.content.length > 0) {
      const textItem = toolResult.content.find((c: any) => c.type === 'text');
      if (textItem?.text) {
        try {
          structured = JSON.parse(textItem.text);
        } catch {
          // keep as string
        }
      }
    }

    // Check for not-found error
    if (toolResult.isError || (structured && structured.found === false)) {
      const notFoundMessage =
        structured?.message ||
        toolResult.content?.[0]?.text ||
        'No matching record in bundled demo dataset.';

      updateStatus({
        status: 'connected',
        latency: measuredLatency,
        lastCallTime: Date.now(),
        lastError: null,
        toolCallCount: currentState.toolCallCount + 1
      });

      throw new McpNotFoundError(notFoundMessage, structured);
    }

    const finalData = structured?.result !== undefined ? structured.result : structured;

    updateStatus({
      status: 'connected',
      latency: measuredLatency,
      lastCallTime: Date.now(),
      lastError: null,
      toolCallCount: currentState.toolCallCount + 1
    });

    return {
      data: finalData as T,
      rawPayload: structured,
      latency: measuredLatency
    };
  } catch (err) {
    if (err instanceof McpNotFoundError) {
      throw err;
    }

    // Network error, 5xx, or timeout -> Mark status offline and latency null
    updateStatus({
      status: 'offline',
      latency: null,
      lastCallTime: Date.now(),
      lastError: err instanceof Error ? err.message : String(err)
    });

    // Reset init state so reconnect attempt is made next call
    isInitialized = false;
    initPromise = null;

    throw err;
  }
}
