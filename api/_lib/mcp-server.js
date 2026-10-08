/**
 * NutriSafe Food Safety MCP Server
 * Conforms to Model Context Protocol specification 2025-11-25 over Streamable HTTP.
 * Serves bundled demo dataset with strict read-only tool registration.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import {
  checkAdditive,
  scanIngredientList,
  searchAdditives,
  checkNutrition,
  checkPesticideMrl,
  DATASET_COUNTS,
  DEMO_SENTENCE
} from './mcp-engine.js';

export const MCP_PATH = '/api/mcp';

export const SERVER_INFO = {
  name: 'nutrisafe-food-mcp',
  title: 'NutriSafe Food Safety MCP (demo dataset)',
  version: '3.0.0'
};

export const DATASET = {
  additivesCount: DATASET_COUNTS.additivesCount,
  nutritionCount: DATASET_COUNTS.nutritionCount,
  pesticidesCount: DATASET_COUNTS.pesticidesCount,
  demoSentence: DEMO_SENTENCE
};

const SOURCE_STRING = 'NutriSafe demo dataset bundled with this app';

function registerAllTools(server) {
  // 1. check_additive
  server.registerTool(
    'check_additive',
    {
      title: 'Check Food Additive (demo dataset)',
      description:
        'Returns toxicology and safety profile for a specific food additive by name, E-number, or CAS number. Data is read from the demo dataset bundled with this app. Use this tool when evaluating single additive safety, ADI thresholds, or risk levels. It does not cover live regulatory codices or unlisted additives.',
      inputSchema: {
        query: z
          .string()
          .trim()
          .min(1)
          .max(200)
          .describe('An E-number (e.g. E211, E 211, E-211), CAS number, or additive name')
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ query }) => {
      const result = checkAdditive(query);
      if (result) {
        const payload = {
          found: true,
          dataset: 'demo',
          source: SOURCE_STRING,
          result
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(payload) }],
          structuredContent: payload
        };
      }

      const sentence = `No single matching additive found for "${query}" in the bundled demo dataset of ${DATASET.additivesCount} additives.`;
      const payload = {
        found: false,
        dataset: 'demo',
        source: SOURCE_STRING,
        message: sentence
      };
      return {
        isError: true,
        content: [
          { type: 'text', text: sentence },
          { type: 'text', text: JSON.stringify(payload) }
        ],
        structuredContent: payload
      };
    }
  );

  // 2. check_ingredient_list
  server.registerTool(
    'check_ingredient_list',
    {
      title: 'Check Ingredient List Cocktail (demo dataset)',
      description:
        'Analyzes multi-ingredient formulations to flag known additives, allergens, banned substances, and toxic cocktail interactions. Data is read from the demo dataset bundled with this app. Use this tool when checking food product labels or supplement panels. It does not cover unlisted proprietary blends or real-time chemical assays.',
      inputSchema: {
        ingredients: z
          .string()
          .trim()
          .min(1)
          .max(4000)
          .describe('Full ingredient list text separated by commas or spaces (up to 4000 characters)')
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ ingredients }) => {
      const result = scanIngredientList(ingredients);
      const hasFindings =
        result.flaggedCount > 0 ||
        result.allergens.length > 0 ||
        result.combinations.length > 0 ||
        result.bannedAlerts.length > 0 ||
        result.dietaryFlags.length > 0;

      if (hasFindings) {
        const payload = {
          found: true,
          dataset: 'demo',
          source: SOURCE_STRING,
          result
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(payload) }],
          structuredContent: payload
        };
      }

      const sentence = `No regulated additives or allergens detected in the provided ingredients across the bundled demo dataset of ${DATASET.additivesCount} additives.`;
      const payload = {
        found: false,
        dataset: 'demo',
        source: SOURCE_STRING,
        message: sentence
      };
      return {
        isError: true,
        content: [
          { type: 'text', text: sentence },
          { type: 'text', text: JSON.stringify(payload) }
        ],
        structuredContent: payload
      };
    }
  );

  // 3. search_additives
  server.registerTool(
    'search_additives',
    {
      title: 'Search Food Additives Directory (demo dataset)',
      description:
        'Searches and filters the additive database by keyword, spelling variant, or functional category such as banned, color, or preservative. Data is read from the demo dataset bundled with this app. Use this tool when browsing groups of additives or filtering by regulatory status. It does not cover industrial chemicals outside the bundled demo directory.',
      inputSchema: {
        query: z
          .string()
          .trim()
          .min(1)
          .max(200)
          .optional()
          .describe('Search query keyword or spelling variant'),
        category: z
          .string()
          .trim()
          .min(1)
          .max(100)
          .optional()
          .describe('Category filter such as color, preservative, sweetener, or banned')
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ query, category }) => {
      const result = searchAdditives({ query, category });
      // search_additives is the exception: an empty list is a valid answer and comes back found: true with result []
      const payload = {
        found: true,
        dataset: 'demo',
        source: SOURCE_STRING,
        result
      };
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload
      };
    }
  );

  // 4. check_nutrition
  server.registerTool(
    'check_nutrition',
    {
      title: 'Check Athletic Nutrition and Macros (demo dataset)',
      description:
        'Retrieves nutritional values, macronutrients, and pre/post-workout timing recommendations for athletic performance foods. Data is read from the demo dataset bundled with this app. Use this tool when planning athletic meal timing or calculating macro splits. It does not cover brand-specific commercial restaurant menus.',
      inputSchema: {
        query: z
          .string()
          .trim()
          .min(1)
          .max(200)
          .describe('Food name in English or Hebrew (e.g. hummus, חומוס, banana, whey protein)')
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ query }) => {
      const result = checkNutrition(query);
      if (result) {
        const payload = {
          found: true,
          dataset: 'demo',
          source: SOURCE_STRING,
          result
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(payload) }],
          structuredContent: payload
        };
      }

      const sentence = `No single matching food record found for "${query}" in the bundled demo dataset of ${DATASET.nutritionCount} foods.`;
      const payload = {
        found: false,
        dataset: 'demo',
        source: SOURCE_STRING,
        message: sentence
      };
      return {
        isError: true,
        content: [
          { type: 'text', text: sentence },
          { type: 'text', text: JSON.stringify(payload) }
        ],
        structuredContent: payload
      };
    }
  );

  // 5. check_pesticide_mrl
  server.registerTool(
    'check_pesticide_mrl',
    {
      title: 'Check Pesticide Maximum Residue Limits (demo dataset)',
      description:
        'Inspects pesticide chemical profiles, Maximum Residue Limits (MRL), and crop tolerances against demo thresholds. Data is read from the demo dataset bundled with this app. Use this tool when auditing produce safety and agricultural chemical residues. It does not cover live international laboratory assay certificates.',
      inputSchema: {
        query: z
          .string()
          .trim()
          .min(1)
          .max(200)
          .describe('Pesticide name, CAS number, or crop name (e.g. glyphosate, chlorpyrifos, strawberry)')
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ query }) => {
      const result = checkPesticideMrl(query);
      if (result) {
        const payload = {
          found: true,
          dataset: 'demo',
          source: SOURCE_STRING,
          result
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(payload) }],
          structuredContent: payload
        };
      }

      const sentence = `No single matching pesticide record found for "${query}" in the bundled demo dataset of ${DATASET.pesticidesCount} pesticides.`;
      const payload = {
        found: false,
        dataset: 'demo',
        source: SOURCE_STRING,
        message: sentence
      };
      return {
        isError: true,
        content: [
          { type: 'text', text: sentence },
          { type: 'text', text: JSON.stringify(payload) }
        ],
        structuredContent: payload
      };
    }
  );
}

/**
 * Main MCP HTTP Request Handler (compatible with Express and Vercel serverless)
 */
export async function mcpHandler(req, res) {
  // First, for every method: validate Origin header if present
  const origin = req.headers['origin'];
  if (origin) {
    let originHost = '';
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = origin.replace(/^https?:\/\//i, '').split('/')[0];
    }

    const hostHeader = req.headers['host'] || '';
    const xForwardedHost = req.headers['x-forwarded-host'] || '';
    const firstForwardedHost = typeof xForwardedHost === 'string'
      ? xForwardedHost.split(',')[0].trim()
      : Array.isArray(xForwardedHost) ? xForwardedHost[0].trim() : '';

    if (originHost && originHost !== hostHeader && originHost !== firstForwardedHost) {
      res.status(403).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Forbidden: Origin does not match Host.'
        },
        id: null
      });
      return;
    }
  }

  const acceptHeader = req.headers['accept'] || '';

  // GET without "text/event-stream" in Accept header
  if (req.method === 'GET' && !acceptHeader.includes('text/event-stream')) {
    res.status(200).json({
      server: SERVER_INFO,
      mcp_path: MCP_PATH,
      tools: [
        'check_additive',
        'check_ingredient_list',
        'search_additives',
        'check_nutrition',
        'check_pesticide_mrl'
      ],
      dataset: DATASET,
      connection: {
        protocol: '2025-11-25',
        transport: 'Streamable HTTP',
        endpoint: MCP_PATH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        }
      }
    });
    return;
  }

  // Any method except POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET');
    res.status(405).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed. Send MCP messages with POST.'
      },
      id: null
    });
    return;
  }

  // On POST: read req.body inside try block
  let body = req.body;
  try {
    if (typeof body === 'string') {
      body = JSON.parse(body);
    } else if (Buffer.isBuffer(body)) {
      body = JSON.parse(body.toString('utf-8'));
    }
  } catch {
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: 'Parse error: Invalid JSON was received by the server.'
      },
      id: null
    });
    return;
  }

  // Create fresh McpServer and StreamableHTTPServerTransport per request (no sessions kept)
  const server = new McpServer(SERVER_INFO, {
    instructions: DATASET.demoSentence
  });

  registerAllTools(server);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  res.on('close', () => {
    try {
      transport.close();
      server.close();
    } catch {
      // ignore close cleanup errors
    }
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: err instanceof Error ? err.message : 'Internal MCP error'
        },
        id: (body && typeof body === 'object' && body.id) ? body.id : null
      });
    }
  }
}
