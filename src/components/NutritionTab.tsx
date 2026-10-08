import React, { useState, useEffect } from 'react';
import { Zap, Clock, Flame, Dumbbell, ShieldCheck, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { callMcp, describeMcpError, McpNotFoundError } from '../services/mcpClient.js';

interface NutritionTabProps {
  initialQuery?: string;
}

export const NutritionTab: React.FC<NutritionTabProps> = ({ initialQuery = 'hummus' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTiming, setActiveTiming] = useState<'all' | 'pre-workout' | 'post-workout'>('all');
  const [loading, setLoading] = useState(true);
  const [foodData, setFoodData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  const fetchFood = async (targetFood: string) => {
    setLoading(true);
    setErrorMsg(null);
    setFoodData(null);

    try {
      const res = await callMcp('check_nutrition', { query: targetFood });
      setFoodData(res.data);
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
    fetchFood(initialQuery);
  }, [initialQuery]);

  const presetFoods = [
    { name: 'Hummus', timing: 'post-workout', tag: 'Plant Protein & Fats' },
    { name: 'Banana', timing: 'pre-workout', tag: 'Fast Glycogen' },
    { name: 'Rolled Oats', timing: 'pre-workout', tag: 'Sustained Carbs' },
    { name: 'Whey Protein', timing: 'post-workout', tag: 'Rapid MPS Leucine' },
    { name: 'Chicken Breast', timing: 'post-workout', tag: 'Lean Anabolism' },
    { name: 'Sweet Potato', timing: 'post-workout', tag: 'Glycogen Reload' },
    { name: 'Greek Yogurt', timing: 'post-workout', tag: 'Whey + Casein' },
    { name: 'Salmon', timing: 'post-workout', tag: 'Omega-3 Recovery' },
    { name: 'White Rice', timing: 'post-workout', tag: 'Clean Fast Carbs' },
    { name: 'Egg', timing: 'post-workout', tag: 'BV 100 Protein' },
    { name: 'Tart Cherry', timing: 'post-workout', tag: 'Anti-DOMS Polyphenols' }
  ];

  const filteredPresets = activeTiming === 'all'
    ? presetFoods
    : presetFoods.filter(f => f.timing === activeTiming);

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-[#171f33] via-[#131b2e] to-[#0b1326] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#22c55e]/20 text-[#4be277] font-heading font-semibold text-xs uppercase tracking-wider">
                Phase Telemetry
              </span>
              <span className="text-xs text-[#bccbb9]">Exercise Fuel & Recovery</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Pre & Post Workout <span className="text-[#4be277]">Nutrition Engine</span>
            </h2>
            <p className="text-sm text-[#bccbb9] mt-1 max-w-2xl">
              Optimize nutrient timing windows, muscle protein synthesis (MPS), and rapid glycogen replenishment via the built-in MCP <code className="text-[#4be277]">check_nutrition</code> tool.
            </p>
          </div>

          {/* Timing Filter Tabs */}
          <div className="flex items-center bg-[#0b1326] p-1 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTiming('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTiming === 'all'
                  ? 'bg-[#22c55e] text-[#003915]'
                  : 'text-[#bccbb9] hover:text-white'
              }`}
            >
              All Phases
            </button>
            <button
              onClick={() => setActiveTiming('pre-workout')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTiming === 'pre-workout'
                  ? 'bg-[#ec6a06] text-white'
                  : 'text-[#bccbb9] hover:text-white'
              }`}
            >
              Pre-Workout Fuel
            </button>
            <button
              onClick={() => setActiveTiming('post-workout')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTiming === 'post-workout'
                  ? 'bg-[#22c55e] text-[#003915]'
                  : 'text-[#bccbb9] hover:text-white'
              }`}
            >
              Post-Workout Repair
            </button>
          </div>
        </div>

        {/* Athletic Presets Pills */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#869585] uppercase tracking-wider mr-1">
            Athletic Foods:
          </span>
          {filteredPresets.map((f, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(f.name);
                fetchFood(f.name);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                foodData?.name?.toLowerCase() === f.name.toLowerCase()
                  ? 'bg-[#4be277] text-[#003915] border-[#4be277] font-bold shadow-md shadow-[#4be277]/20'
                  : 'bg-[#222a3d] text-[#dae2fd] border-white/10 hover:border-[#4be277]/40 hover:text-[#4be277]'
              }`}
            >
              <span>{f.name}</span>
              <span className="text-[10px] opacity-75 font-normal">({f.tag})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual lookup input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Lookup athletic food by English or Hebrew name (e.g. חומוס, sweet potato, salmon)..."
          className="flex-1 px-4 py-2.5 bg-[#171f33] border border-white/10 rounded-xl text-sm text-[#dae2fd] focus:outline-none focus:border-[#4be277]"
        />
        <button
          onClick={() => fetchFood(query)}
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
          <div className="w-12 h-12 rounded-full bg-[#222a3d] mx-auto mb-3 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-[#4be277] animate-spin" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white">Querying MCP check_nutrition...</h3>
          <p className="text-xs text-[#869585] mt-1">Connecting to /api/mcp Streamable HTTP protocol 2025-11-25</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-[#171f33] border border-amber-500/30 rounded-2xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-[#ffb690] mx-auto mb-2" />
          <h3 className="font-heading text-base font-bold text-white">No Matching Food Record</h3>
          <p className="text-sm text-[#ffb690] mt-1 max-w-md mx-auto">{errorMsg}</p>
          <p className="text-xs text-[#869585] mt-3">
            The MCP server returns null unless exactly one record fits. Try selecting one of the athletic presets above.
          </p>
        </div>
      ) : foodData ? (
        <div className="bg-[#171f33] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header Card */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#222a3d]/50 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-heading text-3xl font-bold text-white tracking-tight">
                  {foodData.name}
                </h3>
                {foodData.hebrewName && (
                  <span className="text-xl font-bold text-[#4be277] px-2 py-0.5 rounded-lg bg-[#4be277]/10 border border-[#4be277]/20">
                    {foodData.hebrewName}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#222a3d] text-[#dae2fd] border border-white/10">
                  {foodData.category}
                </span>
              </div>
              <p className="text-xs text-[#869585] mt-1">
                Standard Serving: <strong className="text-white">{foodData.serving}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-[#0b1326] border border-white/10 text-right">
                <span className="text-[10px] text-[#869585] block uppercase font-mono">Timing Window</span>
                <span className={`text-xs font-bold uppercase ${foodData.exerciseTiming === 'pre-workout' ? 'text-[#ffb690]' : 'text-[#4be277]'}`}>
                  {foodData.exerciseTiming}
                </span>
              </div>
              {lastLatency && (
                <div className="px-3 py-1.5 rounded-xl bg-[#0b1326] border border-white/10 text-right">
                  <span className="text-[10px] text-[#869585] block uppercase font-mono">MCP Latency</span>
                  <span className="text-xs font-mono font-bold text-[#4be277]">{lastLatency} ms</span>
                </div>
              )}
            </div>
          </div>

          {/* Athletic Recommendation Box */}
          <div className="p-5 bg-[#0b1326]/60 border-b border-white/5 flex items-start gap-3">
            <Zap className="w-5 h-5 text-[#ffb690] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffb690] font-heading">
                Exercise Performance Strategy
              </h4>
              <p className="text-sm text-[#dae2fd] mt-0.5 leading-relaxed">
                {foodData.exerciseRecommendation}
              </p>
            </div>
          </div>

          {/* Macro Telemetry Grid */}
          <div className="p-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#869585] mb-3 font-heading flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#4be277]" /> Macronutrient Breakdown ({foodData.serving})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Calories */}
              <div className="bg-[#0b1326] p-4 rounded-xl border border-white/10 text-center">
                <Flame className="w-4 h-4 text-[#ec6a06] mx-auto mb-1" />
                <span className="text-2xl font-bold font-heading text-white">{foodData.calories}</span>
                <span className="block text-[10px] uppercase font-bold text-[#869585] mt-0.5">Calories (kcal)</span>
              </div>

              {/* Protein */}
              <div className="bg-[#0b1326] p-4 rounded-xl border border-[#4be277]/30 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#4be277]"></div>
                <Dumbbell className="w-4 h-4 text-[#4be277] mx-auto mb-1" />
                <span className="text-2xl font-bold font-heading text-[#4be277]">{foodData.protein}g</span>
                <span className="block text-[10px] uppercase font-bold text-[#4be277] mt-0.5">Protein</span>
              </div>

              {/* Carbs */}
              <div className="bg-[#0b1326] p-4 rounded-xl border border-white/10 text-center">
                <Zap className="w-4 h-4 text-[#50dfa4] mx-auto mb-1" />
                <span className="text-2xl font-bold font-heading text-white">{foodData.carbs}g</span>
                <span className="block text-[10px] uppercase font-bold text-[#869585] mt-0.5">Carbohydrates</span>
              </div>

              {/* Fats */}
              <div className="bg-[#0b1326] p-4 rounded-xl border border-white/10 text-center">
                <span className="text-2xl font-bold font-heading text-white">{foodData.fat}g</span>
                <span className="block text-[10px] uppercase font-bold text-[#869585] mt-0.5">Lipids / Fats</span>
              </div>

              {/* Fiber */}
              <div className="bg-[#0b1326] p-4 rounded-xl border border-white/10 text-center col-span-2 sm:col-span-1">
                <span className="text-2xl font-bold font-heading text-white">{foodData.fiber}g</span>
                <span className="block text-[10px] uppercase font-bold text-[#869585] mt-0.5">Dietary Fiber</span>
              </div>
            </div>

            {/* Micronutrients */}
            {foodData.micronutrients && (
              <div className="mt-5 pt-4 border-t border-white/10">
                <h5 className="text-xs font-semibold text-[#869585] uppercase tracking-wider mb-2">
                  Key Athletic Micronutrients & Electrolytes
                </h5>
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(foodData.micronutrients).map(([key, val]) => (
                    <span
                      key={key}
                      className="px-3 py-1.5 rounded-lg bg-[#222a3d] text-[#dae2fd] border border-white/5 font-mono"
                    >
                      <strong className="text-[#50dfa4] capitalize">{key}:</strong> {String(val)} mg
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Traceability & Compliance Notice */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#869585]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4be277]" />
                {foodData.traceability || 'Demo record: no batch or certification data'}
              </span>
              <span className="font-mono text-[11px] text-[#bccbb9]">Source: NutriSafe demo dataset bundled with this app</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
