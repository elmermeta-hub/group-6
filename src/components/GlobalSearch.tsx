import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

interface GlobalSearchProps {
  onRouteQuery: (tab: 'nutrition' | 'additives' | 'scanner' | 'pesticides', query: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onRouteQuery }) => {
  const [query, setQuery] = useState('');

  const suggestions = [
    { label: 'Hummus (Athletic Fuel)', query: 'hummus', target: 'nutrition' as const },
    { label: 'Scan Ingredients Cocktail', query: 'water, citric acid, sodium benzoate, ascorbic acid, tartrazine', target: 'scanner' as const },
    { label: 'Glyphosate MRL', query: 'glyphosate', target: 'pesticides' as const },
    { label: 'Chlorpyrifos Tolerance', query: 'chlorpyrifos', target: 'pesticides' as const },
    { label: 'Tartrazine (E102)', query: 'E102', target: 'additives' as const },
    { label: 'Whey Protein (MPS)', query: 'whey protein', target: 'nutrition' as const }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Check routing rules:
    // 1. Two or more ', ' separators, but never chemical names where comma is between digits like '2,4-Hexadienoic Acid'
    // Count occurrences of comma followed by whitespace: ', '
    const commaSpaceMatches = trimmed.match(/,\s+/g);
    const hasTwoOrMoreCommaSpaces = commaSpaceMatches && commaSpaceMatches.length >= 2;

    if (hasTwoOrMoreCommaSpaces || trimmed.toLowerCase().includes('cocktail')) {
      onRouteQuery('scanner', trimmed);
      return;
    }

    const lower = trimmed.toLowerCase();
    if (lower === 'glyphosate' || lower === 'chlorpyrifos' || lower.includes('mrl') || lower.includes('pesticide')) {
      onRouteQuery('pesticides', trimmed);
      return;
    }

    if (lower === 'hummus' || lower === 'חומוס' || lower.includes('banana') || lower.includes('oat') || lower.includes('whey') || lower.includes('protein')) {
      onRouteQuery('nutrition', trimmed);
      return;
    }

    // Default to additives
    onRouteQuery('additives', trimmed);
  };

  return (
    <div className="bg-[#171f33] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 mb-6">
      <form onSubmit={handleSearch} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#869585]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search E-numbers (E 211), foods (hummus), pesticides (glyphosate), or paste cocktails..."
            className="w-full pl-10 pr-4 py-3 bg-[#0b1326] border border-white/10 rounded-xl text-sm text-[#dae2fd] placeholder:text-[#869585] focus:outline-none focus:border-[#4be277] focus:ring-1 focus:ring-[#4be277] transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 rounded-xl bg-[#22c55e] hover:bg-[#4be277] text-[#003915] font-heading font-bold text-sm flex items-center gap-2 transition-all active:scale-[0.98] shrink-0"
        >
          <span>Query</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Suggested Quick Lookups */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[#869585] flex items-center gap-1 shrink-0 text-[11px] font-medium">
          <Sparkles className="w-3 h-3 text-[#50dfa4]" /> Quick MCP presets:
        </span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onRouteQuery(s.target, s.query)}
            className="px-2.5 py-1 rounded-full bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] hover:text-[#4be277] border border-white/5 whitespace-nowrap transition-colors text-[11px]"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
