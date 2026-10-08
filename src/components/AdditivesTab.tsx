import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, ShieldCheck, RefreshCw, AlertOctagon, Info } from 'lucide-react';
import { callMcp, describeMcpError, McpNotFoundError } from '../services/mcpClient.js';

interface AdditivesTabProps {
  initialSearch?: string;
}

export const AdditivesTab: React.FC<AdditivesTabProps> = ({ initialSearch = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [additivesList, setAdditivesList] = useState<any[]>([]);
  const [selectedAdditive, setSelectedAdditive] = useState<any | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  // Load initial list from search_additives tool via MCP
  const loadAdditivesList = async (cat: string, queryStr: string) => {
    setLoadingList(true);
    setListError(null);

    const params: { query?: string; category?: string } = {};
    if (queryStr.trim()) params.query = queryStr.trim();
    if (cat !== 'all') params.category = cat;

    try {
      const res = await callMcp('search_additives', params);
      setAdditivesList(res.data || []);
      setLastLatency(res.latency);

      // If we don't have a selected additive or current one is not in list, select the first
      if ((!selectedAdditive || !res.data.some((a: any) => a.id === selectedAdditive.id)) && res.data.length > 0) {
        loadSingleAdditive(res.data[0].eNumber || res.data[0].name);
      }
    } catch (err: unknown) {
      if (err instanceof McpNotFoundError) {
        setListError(err.message);
      } else {
        setListError(describeMcpError(err));
      }
      setAdditivesList([]);
    } finally {
      setLoadingList(false);
    }
  };

  // Inspect single additive via check_additive tool
  const loadSingleAdditive = async (identifier: string) => {
    setLoadingDetail(true);
    setDetailError(null);

    try {
      const res = await callMcp('check_additive', { query: identifier });
      setSelectedAdditive(res.data);
      setLastLatency(res.latency);
    } catch (err: unknown) {
      if (err instanceof McpNotFoundError) {
        setDetailError(err.message);
      } else {
        setDetailError(describeMcpError(err));
      }
      setSelectedAdditive(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadAdditivesList(selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAdditivesList(selectedCategory, searchQuery);
  };

  const categories = [
    { id: 'all', label: 'All Additives' },
    { id: 'color', label: 'Colors' },
    { id: 'preservative', label: 'Preservatives' },
    { id: 'antioxidant', label: 'Antioxidants' },
    { id: 'emulsifier', label: 'Emulsifiers' },
    { id: 'sweetener', label: 'Sweeteners' },
    { id: 'banned', label: 'Banned / Restricted' }
  ];

  const getRiskBadge = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'BANNED':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-[#ffb690] border-amber-500/40';
      case 'MODERATE':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-[#22c55e]/20 text-[#4be277] border-[#4be277]/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-[#171f33] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#869585]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search additives by E-number (E 211), CAS, or name (Vitamin C)..."
              className="w-full pl-10 pr-24 py-2.5 bg-[#0b1326] border border-white/10 rounded-xl text-sm text-[#dae2fd] focus:outline-none focus:border-[#4be277]"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#222a3d] hover:bg-[#31394d] text-xs font-bold text-white rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Refresh from MCP button */}
          <button
            onClick={() => {
              if (selectedAdditive) {
                loadSingleAdditive(selectedAdditive.eNumber || selectedAdditive.name);
              } else {
                loadAdditivesList(selectedCategory, searchQuery);
              }
            }}
            disabled={loadingDetail || loadingList}
            className="px-4 py-2.5 rounded-xl bg-[#222a3d] hover:bg-[#31394d] text-white text-xs font-bold border border-white/10 flex items-center justify-center gap-2 transition-all shrink-0 active:scale-[0.98]"
            title="Re-run check_additive on the MCP server"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#50dfa4] ${(loadingDetail || loadingList) ? 'animate-spin' : ''}`} />
            <span>Refresh from MCP</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-[#869585] shrink-0 mr-1" />
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? c.id === 'banned'
                    ? 'bg-red-500 text-white font-bold'
                    : 'bg-[#22c55e] text-[#003915] font-bold shadow-md shadow-[#22c55e]/20'
                  : 'bg-[#0b1326] text-[#bccbb9] hover:text-white border border-white/5'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Directory List & Detailed Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Additive List */}
        <div className="lg:col-span-5 bg-[#171f33] border border-white/10 rounded-2xl p-4 flex flex-col max-h-[700px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <span className="font-heading font-bold text-sm text-white">
              Directory Results ({additivesList.length})
            </span>
            {lastLatency && (
              <span className="font-mono text-[11px] text-[#4be277]">
                {lastLatency} ms
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loadingList ? (
              <div className="p-8 text-center text-xs text-[#869585] animate-pulse">
                <RefreshCw className="w-5 h-5 text-[#4be277] animate-spin mx-auto mb-2" />
                Loading additives from MCP search_additives...
              </div>
            ) : listError ? (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-red-300">
                {listError}
              </div>
            ) : additivesList.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#869585]">
                No additives matched the filter or query.
              </div>
            ) : (
              additivesList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadSingleAdditive(item.eNumber || item.name)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedAdditive?.id === item.id
                      ? 'bg-[#222a3d] border-[#4be277]/50 shadow-md'
                      : 'bg-[#0b1326] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-[#4be277]">
                      {item.eNumber}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(item.riskLevel)}`}>
                      {item.riskLevel}
                    </span>
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-white mt-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#869585] line-clamp-1 mt-0.5">
                    {item.category} · {item.description}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Additive Dossier */}
        <div className="lg:col-span-7 bg-[#171f33] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          {loadingDetail ? (
            <div className="py-20 text-center animate-pulse">
              <RefreshCw className="w-8 h-8 text-[#4be277] animate-spin mx-auto mb-3" />
              <h4 className="font-heading font-bold text-lg text-white">Querying check_additive...</h4>
              <p className="text-xs text-[#869585] mt-1">Calling /api/mcp with protocol 2025-11-25</p>
            </div>
          ) : detailError ? (
            <div className="py-16 text-center">
              <AlertTriangle className="w-10 h-10 text-[#ffb690] mx-auto mb-3" />
              <h4 className="font-heading font-bold text-base text-white">No Single Match Found</h4>
              <p className="text-sm text-[#ffb690] mt-1 max-w-sm mx-auto">{detailError}</p>
            </div>
          ) : selectedAdditive ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-bold text-[#4be277] bg-[#4be277]/10 px-2.5 py-0.5 rounded-lg border border-[#4be277]/20">
                      {selectedAdditive.eNumber}
                    </span>
                    <span className={`text-xs uppercase font-bold px-2.5 py-1 rounded-full border ${getRiskBadge(selectedAdditive.riskLevel)}`}>
                      {selectedAdditive.riskLevel} Risk
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mt-2">
                    {selectedAdditive.name}
                  </h3>
                  {selectedAdditive.chemicalName && (
                    <p className="font-mono text-xs text-[#869585] mt-0.5">
                      CAS: {selectedAdditive.casNumber || 'N/A'} · {selectedAdditive.chemicalName}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#869585] uppercase block font-mono">Acceptable Daily Intake (ADI)</span>
                  <span className="text-xs font-mono font-bold text-[#dae2fd]">{selectedAdditive.adi}</span>
                </div>
              </div>

              {/* Athletic & Fitness Context */}
              <div className="p-4 rounded-xl bg-[#0b1326] border border-white/5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#50dfa4] font-heading flex items-center gap-1.5 mb-1">
                  <Info className="w-3.5 h-3.5" /> Athletic & Fitness Context
                </h5>
                <p className="text-sm text-[#dae2fd] leading-relaxed">
                  {selectedAdditive.fitnessContext || selectedAdditive.description}
                </p>
              </div>

              {/* Warnings and Banned Alerts */}
              {selectedAdditive.riskLevel === 'BANNED' && (
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 flex items-start gap-3">
                  <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-red-400">
                      Banned Substance Alert
                    </h5>
                    <p className="text-xs text-red-200 mt-1">
                      {selectedAdditive.warningNotes?.[0] || 'This substance is restricted or banned under international food safety codices.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Allergens & Cross-Reactivity */}
              {selectedAdditive.allergens && selectedAdditive.allergens.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-[#869585] uppercase tracking-wider mb-2">
                    Sensitivities & Allergen Flags
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedAdditive.allergens.map((alg: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-[#ffb690]">
                        {alg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Compliance */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 ${selectedAdditive.dietary?.vegan ? 'text-[#4be277]' : 'text-[#869585]'}`}>
                    <ShieldCheck className="w-4 h-4" /> Vegan: {selectedAdditive.dietary?.vegan ? 'Yes' : 'No / Unknown'}
                  </span>
                  <span className={`flex items-center gap-1 ${selectedAdditive.dietary?.kosher ? 'text-[#4be277]' : 'text-[#869585]'}`}>
                    Kosher: {selectedAdditive.dietary?.kosher ? 'Yes' : 'Check'}
                  </span>
                </div>

                {/* Mandatory plain traceability */}
                <span className="text-[#869585] font-mono text-[11px]">
                  {selectedAdditive.dietary?.traceability || 'Demo record: no batch or certification data'}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-[#869585]">
              Select an additive from the list or search above to view safety dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
