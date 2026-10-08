import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, RefreshCw, Sprout, Biohazard, CheckCircle } from 'lucide-react';
import { callMcp, describeMcpError, McpNotFoundError } from '../services/mcpClient.js';

interface PesticidesTabProps {
  initialQuery?: string;
}

export const PesticidesTab: React.FC<PesticidesTabProps> = ({ initialQuery = 'glyphosate' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [pesticideData, setPesticideData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  const fetchPesticide = async (targetQuery: string) => {
    setLoading(true);
    setErrorMsg(null);
    setPesticideData(null);

    try {
      const res = await callMcp('check_pesticide_mrl', { query: targetQuery });
      setPesticideData(res.data);
      setLastLatency(res.latency);
    } catch (err: unknown) {
      if (err instanceof McpNotFoundError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg(describeMcpError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesticide(initialQuery);
  }, [initialQuery]);

  const presets = [
    { label: 'Glyphosate', query: 'glyphosate', desc: 'Herbicide (Barley, Oats, Wheat)' },
    { label: 'Chlorpyrifos', query: 'chlorpyrifos', desc: 'Organophosphate (Above demo limit)' },
    { label: 'Mancozeb', query: 'mancozeb', desc: 'Dithiocarbamate (Potatoes, Tomatoes)' },
    { label: 'Imidacloprid', query: 'imidacloprid', desc: 'Neonicotinoid (Lettuce, Peppers)' },
    { label: 'Strawberry (Crop)', query: 'strawberry', desc: 'Crop check (Boscalid)' },
    { label: 'Wheat (Multi-pesticide test)', query: 'wheat', desc: 'Returns null (Multiple pesticides)' }
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#171f33] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#50dfa4]/20 text-[#50dfa4] font-heading font-semibold text-xs uppercase tracking-wider">
            Agricultural Toxicology
          </span>
          <span className="text-xs text-[#bccbb9]">Maximum Residue Limits (MRL)</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Pesticide MRL & <span className="text-[#4be277]">Produce Tolerances</span>
        </h2>
        <p className="text-sm text-[#bccbb9] mt-1 max-w-2xl">
          Audit agricultural chemical tolerances across crops and fresh athletic produce using the MCP <code className="text-[#4be277]">check_pesticide_mrl</code> tool. Evaluates WHO toxicity classifications and plain residue limits.
        </p>

        {/* Preset Chips */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#869585] text-[11px] font-semibold uppercase tracking-wider mr-1">
            Presets:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p.query);
                fetchPesticide(p.query);
              }}
              className={`px-3 py-1.5 rounded-full border transition-all text-xs flex items-center gap-1.5 ${
                pesticideData?.name?.toLowerCase() === p.query.toLowerCase()
                  ? 'bg-[#4be277] text-[#003915] border-[#4be277] font-bold shadow-md shadow-[#4be277]/20'
                  : 'bg-[#222a3d] text-[#dae2fd] border-white/10 hover:border-[#4be277]/40 hover:text-[#4be277]'
              }`}
            >
              <span>{p.label}</span>
              <span className="text-[10px] opacity-75 font-normal">({p.desc})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Query pesticide name (chlorpyrifos), CAS (1071-83-6), or crop (strawberry)..."
          className="flex-1 px-4 py-2.5 bg-[#171f33] border border-white/10 rounded-xl text-sm text-[#dae2fd] focus:outline-none focus:border-[#4be277]"
        />
        <button
          onClick={() => fetchPesticide(query)}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#50dfa4] ${loading ? 'animate-spin' : ''}`} />
          <span>Query MCP</span>
        </button>
      </div>

      {/* Results View */}
      {loading ? (
        <div className="bg-[#171f33] border border-white/10 rounded-2xl p-8 text-center animate-pulse">
          <RefreshCw className="w-8 h-8 text-[#4be277] animate-spin mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-white">Querying check_pesticide_mrl...</h3>
          <p className="text-xs text-[#869585] mt-1">Inspecting demo dataset MRL thresholds</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-[#171f33] border border-amber-500/30 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-[#ffb690] mx-auto mb-2" />
          <h3 className="font-heading text-base font-bold text-white">No Matching Pesticide Record</h3>
          <p className="text-sm text-[#ffb690] mt-1 max-w-md mx-auto">{errorMsg}</p>
          <p className="text-xs text-[#869585] mt-3">
            Note: If multiple pesticides list the crop (e.g. wheat), or if a pesticide does not cover the requested crop (e.g. mancozeb wheat), the MCP server strictly returns null.
          </p>
        </div>
      ) : pesticideData ? (
        <div className="bg-[#171f33] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
          {/* Main Dossier Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#222a3d] text-[#50dfa4] border border-white/10">
                  CAS: {pesticideData.casNumber}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#222a3d] text-[#bccbb9] border border-white/10">
                  {pesticideData.chemicalFamily}
                </span>
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mt-1.5">
                {pesticideData.name}
              </h3>
            </div>

            {/* Plain Status Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-[#869585] uppercase block font-mono">Limit Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  pesticideData.gaugeStatus === 'Above demo limit'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-[#22c55e]/20 text-[#4be277] border border-[#4be277]/30'
                }`}>
                  {pesticideData.gaugeStatus === 'Above demo limit' ? (
                    <Biohazard className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  {pesticideData.gaugeStatus}
                </span>
              </div>
              {lastLatency && (
                <div className="px-3 py-1.5 rounded-xl bg-[#0b1326] border border-white/10 text-right">
                  <span className="text-[10px] text-[#869585] block uppercase font-mono">Latency</span>
                  <span className="text-xs font-mono font-bold text-[#4be277]">{lastLatency} ms</span>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0b1326] border border-white/5">
              <span className="text-[11px] font-mono text-[#869585] uppercase block">
                Maximum Residue Limit (MRL)
              </span>
              <span className="text-2xl font-heading font-bold text-white mt-1 block">
                {pesticideData.mrlMgKg} <span className="text-sm font-normal text-[#bccbb9]">mg/kg (ppm)</span>
              </span>
              <span className="text-[11px] text-[#869585] mt-1 block">
                Standard baseline threshold in bundled demo codex.
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1326] border border-white/5">
              <span className="text-[11px] font-mono text-[#869585] uppercase block">
                WHO Hazard Classification
              </span>
              <span className="text-base font-heading font-bold text-[#ffb690] mt-1 block">
                {pesticideData.toxicityClass}
              </span>
              <span className="text-[11px] text-[#869585] mt-1 block">
                International program on chemical safety evaluation.
              </span>
            </div>
          </div>

          {/* Athletic Impact & Fitness Note */}
          <div className="p-4 rounded-xl bg-[#0b1326] border border-white/5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#ffb690] font-heading flex items-center gap-1.5 mb-1">
              <Biohazard className="w-3.5 h-3.5" /> Athletic Toxicology & Metabolism Note
            </h5>
            <p className="text-sm text-[#dae2fd] leading-relaxed">
              {pesticideData.fitnessNote}
            </p>
          </div>

          {/* Covered Agricultural Crops */}
          <div>
            <h5 className="text-xs font-semibold text-[#869585] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-[#50dfa4]" /> Crops Monitored in Codex
            </h5>
            <div className="flex flex-wrap gap-2">
              {pesticideData.crops.map((crop: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-[#222a3d] text-xs font-medium text-[#dae2fd] border border-white/5 capitalize"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>

          {/* Traceability Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#869585]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4be277]" />
              Demo record: no batch or certification data
            </span>
            <span className="font-mono text-[11px] text-[#bccbb9]">Source: NutriSafe demo dataset bundled with this app</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
