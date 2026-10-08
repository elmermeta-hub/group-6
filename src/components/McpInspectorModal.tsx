import React, { useState } from 'react';
import { X, Cpu, Radio, Play, CheckCircle2, AlertCircle, Copy, Terminal } from 'lucide-react';
import { useMcpStatus, callMcp } from '../services/mcpClient.js';

interface McpInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetCounts: { additives: number; nutrition: number; pesticides: number };
}

export const McpInspectorModal: React.FC<McpInspectorModalProps> = ({
  isOpen,
  onClose,
  datasetCounts
}) => {
  const mcpStatus = useMcpStatus();
  const [selectedTool, setSelectedTool] = useState<
    'check_additive' | 'check_ingredient_list' | 'search_additives' | 'check_nutrition' | 'check_pesticide_mrl'
  >('check_additive');
  const [customArgs, setCustomArgs] = useState('{"query": "E 211"}');
  const [running, setRunning] = useState(false);
  const [testResponse, setTestResponse] = useState<any | null>(null);
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRunTool = async () => {
    setRunning(true);
    setTestResponse(null);
    setTestLatency(null);

    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(customArgs);
    } catch {
      setTestResponse({ error: 'Invalid JSON in arguments field.' });
      setRunning(false);
      return;
    }

    try {
      const res = await callMcp(selectedTool, parsedArgs);
      setTestResponse({
        success: true,
        data: res.data,
        rawPayload: res.rawPayload
      });
      setTestLatency(res.latency);
    } catch (err: any) {
      setTestResponse({
        success: false,
        error: err.message,
        payload: err.payload || null
      });
    } finally {
      setRunning(false);
    }
  };

  const handleToolChange = (tool: typeof selectedTool) => {
    setSelectedTool(tool);
    switch (tool) {
      case 'check_additive':
        setCustomArgs('{"query": "E 211"}');
        break;
      case 'check_ingredient_list':
        setCustomArgs('{"ingredients": "Water, citric acid, sodium benzoate, ascorbic acid"}');
        break;
      case 'search_additives':
        setCustomArgs('{"category": "banned"}');
        break;
      case 'check_nutrition':
        setCustomArgs('{"query": "hummus"}');
        break;
      case 'check_pesticide_mrl':
        setCustomArgs('{"query": "glyphosate"}');
        break;
    }
  };

  const handleCopyJson = () => {
    if (!testResponse) return;
    navigator.clipboard.writeText(JSON.stringify(testResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const latencyDisplay = mcpStatus.latency !== null ? `${mcpStatus.latency} ms` : '--';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#171f33] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0b1326]/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#222a3d] text-[#4be277]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-white">
                  Model Context Protocol (MCP) Live Inspector
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4be277]/20 text-[#4be277] border border-[#4be277]/30">
                  Protocol 2025-11-25
                </span>
              </div>
              <p className="text-xs text-[#bccbb9]">
                Direct telemetry & real JSON-RPC interaction with <code className="text-[#4be277]">/api/mcp</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-[#bccbb9] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Telemetry Ribbon */}
        <div className="p-4 bg-[#0b1326] border-b border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-mono text-[#869585] uppercase block">Connection State</span>
            <span className="font-bold flex items-center gap-1.5 mt-0.5 text-white">
              <span className={`w-2 h-2 rounded-full ${mcpStatus.status === 'connected' ? 'bg-[#4be277]' : 'bg-red-400'}`}></span>
              {mcpStatus.status === 'connected' ? 'Connected (Live)' : 'Offline / Standby'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#869585] uppercase block">Measured Latency</span>
            <span className="font-mono font-bold text-sm text-[#4be277] mt-0.5 block">
              {latencyDisplay}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#869585] uppercase block">Server Identifier</span>
            <span className="font-mono text-xs text-[#dae2fd] mt-0.5 block truncate">
              nutrisafe-food-mcp v3.0.0
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#869585] uppercase block">Dataset Records</span>
            <span className="font-mono text-xs text-[#dae2fd] mt-0.5 block">
              {datasetCounts.additives} Additives · {datasetCounts.nutrition} Foods · {datasetCounts.pesticides} MRL
            </span>
          </div>
        </div>

        {/* Mandatory Demo sentence banner */}
        <div className="px-4 py-2 bg-[#222a3d]/50 text-[11px] text-[#869585] border-b border-white/5">
          Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.
        </div>

        {/* Modal Body: Tool execution playground */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#869585] mb-2 font-heading">
              Select Registered MCP Tool
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['check_additive', 'check_ingredient_list', 'search_additives', 'check_nutrition', 'check_pesticide_mrl'] as const).map(
                (tool) => (
                  <button
                    key={tool}
                    onClick={() => handleToolChange(tool)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                      selectedTool === tool
                        ? 'bg-[#222a3d] border-[#4be277] text-[#4be277] font-bold shadow-sm'
                        : 'bg-[#0b1326] border-white/5 text-[#dae2fd] hover:border-white/20'
                    }`}
                  >
                    <span className="block font-mono text-[11px] truncate">{tool}</span>
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#869585] font-heading flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#50dfa4]" /> Tool Input Arguments (JSON)
              </label>
            </div>
            <textarea
              rows={2}
              value={customArgs}
              onChange={(e) => setCustomArgs(e.target.value)}
              className="w-full p-3 bg-[#0b1326] border border-white/10 rounded-xl font-mono text-xs text-[#dae2fd] focus:outline-none focus:border-[#4be277]"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleRunTool}
              disabled={running}
              className="px-5 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#4be277] text-[#003915] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{running ? 'Executing...' : 'Invoke Tool Call'}</span>
            </button>

            {testLatency !== null && (
              <span className="font-mono text-xs text-[#869585]">
                Round-trip measured: <strong className="text-[#4be277]">{testLatency} ms</strong>
              </span>
            )}
          </div>

          {/* Response Payload Viewer */}
          {testResponse && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#869585] font-heading flex items-center gap-1.5">
                  {testResponse.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4be277]" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-[#ffb690]" />
                  )}
                  Real Server Response ({testResponse.success ? 'Success' : 'Error / No Match'})
                </span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 text-[11px] text-[#bccbb9] hover:text-white"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#0b1326] border border-white/10 rounded-xl font-mono text-xs text-[#dae2fd] overflow-x-auto max-h-64 scrollbar-thin">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0b1326]/60 flex items-center justify-between text-xs text-[#869585]">
          <span>Endpoint: <code className="text-[#4be277]">/api/mcp</code> · Sessionless Streamable HTTP</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
