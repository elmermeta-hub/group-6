import React from 'react';
import { Activity, Radio, Cpu, ShieldAlert } from 'lucide-react';
import { useMcpStatus } from '../services/mcpClient.js';

interface HeaderProps {
  onOpenInspector: () => void;
  datasetCounts: { additives: number; nutrition: number; pesticides: number };
}

export const Header: React.FC<HeaderProps> = ({ onOpenInspector, datasetCounts }) => {
  const mcpStatus = useMcpStatus();

  const isConnected = mcpStatus.status === 'connected';
  const isOffline = mcpStatus.status === 'offline';
  const latencyDisplay = mcpStatus.latency !== null ? `${mcpStatus.latency} ms` : '--';

  return (
    <header className="sticky top-0 z-30 bg-[#0b1326]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#004b1e] p-0.5 flex items-center justify-center shadow-lg shadow-[#22c55e]/20">
            <div className="w-full h-full bg-[#0b1326] rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#4be277]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg text-white tracking-tight">
                NutriSafe <span className="text-[#4be277]">ToxiScan</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#22c55e]/15 text-[#4be277] border border-[#4be277]/30 hidden sm:inline-block">
                Kinetic Pulse
              </span>
            </div>
            <p className="text-xs text-[#bccbb9] hidden sm:block">
              Pre & Post Exercise Nutrition · Real Model Context Protocol Engine
            </p>
          </div>
        </div>

        {/* Real MCP Status & Latency Telemetry */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicator */}
          <button
            onClick={onOpenInspector}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              isConnected
                ? 'bg-[#171f33] border-[#4be277]/40 text-[#4be277] hover:bg-[#222a3d]'
                : isOffline
                ? 'bg-red-950/40 border-red-500/40 text-red-400 hover:bg-red-900/40'
                : 'bg-[#171f33] border-white/15 text-[#bccbb9] hover:bg-[#222a3d]'
            }`}
            title="Click to open MCP Live Inspector"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected ? 'bg-[#4be277]' : isOffline ? 'bg-red-400' : 'bg-slate-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-[#4be277]' : isOffline ? 'bg-red-500' : 'bg-slate-400'
                }`}
              ></span>
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              {isConnected ? 'MCP Live' : isOffline ? 'MCP Offline' : 'MCP Standby'}
            </span>
            <span className="text-white/20">|</span>
            <span className="font-mono font-bold text-[11px] text-[#dae2fd]">
              {latencyDisplay}
            </span>
          </button>

          {/* Inspector trigger button */}
          <button
            onClick={onOpenInspector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] border border-white/10 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-[#50dfa4]" />
            <span className="hidden md:inline">Inspector</span>
          </button>
        </div>
      </div>

      {/* Mandatory Demo Dataset Notice Banner */}
      <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-[#869585] gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#ffb690] shrink-0" />
          <span>Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span>{datasetCounts.additives} Additives</span>
          <span className="text-white/20">•</span>
          <span>{datasetCounts.nutrition} Athletic Foods</span>
          <span className="text-white/20">•</span>
          <span>{datasetCounts.pesticides} Residues</span>
        </div>
      </div>
    </header>
  );
};
