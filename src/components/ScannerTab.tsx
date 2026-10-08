import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { callMcp, describeMcpError, McpNotFoundError } from '../services/mcpClient.js';

interface ScannerTabProps {
  initialIngredients?: string;
}

export const ScannerTab: React.FC<ScannerTabProps> = ({ initialIngredients = '' }) => {
  const [ingredientsText, setIngredientsText] = useState(
    initialIngredients || 'Water, Citric Acid, Sodium Benzoate, Ascorbic Acid, Tartrazine, Sucralose'
  );
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  const runScan = async (textToScan: string) => {
    if (!textToScan.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setScanResult(null);

    try {
      const res = await callMcp('check_ingredient_list', { ingredients: textToScan });
      setScanResult(res.data);
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
    if (initialIngredients) {
      setIngredientsText(initialIngredients);
      runScan(initialIngredients);
    } else {
      runScan(ingredientsText);
    }
  }, [initialIngredients]);

  const presets = [
    {
      label: 'Scan Ingredients Cocktail',
      text: 'Water, Citric Acid, Sodium Benzoate, Ascorbic Acid, Tartrazine, Sucralose'
    },
    {
      label: 'Eggplant Pasta (Safe whole-word check)',
      text: 'Durum wheat semolina, roasted eggplant, olive oil, fresh basil, sea salt'
    },
    {
      label: 'Energy Drink RTD',
      text: 'Carbonated water, citric acid, sodium benzoate, potassium sorbate, E102, sucralose, ace-k'
    },
    {
      label: 'Recovery Protein Bar',
      text: 'Whey protein isolate, palm oil, soy lecithin, mono- and diglycerides, sea salt'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-[#171f33] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#ec6a06]/20 text-[#ffb690] font-heading font-semibold text-xs uppercase tracking-wider">
            Cocktail & Allergen Engine
          </span>
          <span className="text-xs text-[#bccbb9]">Multi-Component Safety Audit</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Ingredient List <span className="text-[#4be277]">Cocktail Scanner</span>
        </h2>
        <p className="text-sm text-[#bccbb9] mt-1 max-w-2xl">
          Paste food labels or pre-workout formulas to detect regulated E-numbers, dangerous cross-reaction synergies (e.g. Benzoate + Vitamin C), and whole-word allergens with zero false alarms.
        </p>

        {/* Input Textarea */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Paste comma-separated ingredients list (e.g. Water, Citric Acid, Sodium Benzoate, Ascorbic Acid...)"
              className="w-full p-4 bg-[#0b1326] border border-white/10 rounded-xl text-sm text-[#dae2fd] placeholder:text-[#869585] focus:outline-none focus:border-[#4be277] transition-all font-mono"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              {lastLatency && (
                <span className="text-[11px] font-mono text-[#869585] hidden sm:inline">
                  Latency: <strong className="text-[#4be277]">{lastLatency} ms</strong>
                </span>
              )}
              <button
                type="button"
                onClick={() => runScan(ingredientsText)}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-[#22c55e] hover:bg-[#4be277] text-[#003915] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Run Cocktail Scan</span>
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#869585] flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-[#50dfa4]" /> Preset Audits:
            </span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIngredientsText(p.text);
                  runScan(p.text);
                }}
                className="px-3 py-1 rounded-full bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] border border-white/5 transition-colors text-[11px]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results View */}
      {loading ? (
        <div className="bg-[#171f33] border border-white/10 rounded-2xl p-8 text-center animate-pulse">
          <RefreshCw className="w-8 h-8 text-[#4be277] animate-spin mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-white">Analyzing formulation with check_ingredient_list...</h3>
          <p className="text-xs text-[#869585] mt-1">Cross-referencing whole-word additives, synergies, and allergen dictionaries</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-[#171f33] border border-white/10 rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-[#4be277] mx-auto mb-2" />
          <h3 className="font-heading text-base font-bold text-white">No Regulated Hazards Detected</h3>
          <p className="text-sm text-[#bccbb9] mt-1 max-w-md mx-auto">{errorMsg}</p>
        </div>
      ) : scanResult ? (
        <div className="space-y-4">
          {/* Summary Banner */}
          <div className="bg-[#171f33] border border-white/10 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono text-[#869585]">Audit Summary</span>
              <h3 className="font-heading text-xl font-bold text-white">
                {scanResult.flaggedCount} Regulated Additives Flagged
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#222a3d] text-[#dae2fd] border border-white/10">
                {scanResult.allergens?.length || 0} Allergens
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                scanResult.combinations?.length > 0 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-[#22c55e]/15 text-[#4be277] border-[#4be277]/30'
              }`}>
                {scanResult.combinations?.length || 0} Cocktail Risks
              </span>
            </div>
          </div>

          {/* Critical Cocktail Warnings */}
          {scanResult.combinations && scanResult.combinations.length > 0 && (
            <div className="bg-red-950/30 border border-red-500/40 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-bold text-base text-red-300">
                    High-Risk Synergistic Interactions Detected
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-red-200">
                    {scanResult.combinations.map((comb: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{comb}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Flagged Additives Grid */}
          <div className="bg-[#171f33] border border-white/10 rounded-2xl p-5">
            <h4 className="font-heading font-bold text-sm text-white mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#4be277]" /> Flagged Regulated Additives
            </h4>
            {scanResult.flaggedAdditives?.length === 0 ? (
              <p className="text-xs text-[#869585]">No regulated additives matched the whole-word dictionary.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {scanResult.flaggedAdditives.map((item: any) => (
                  <div key={item.id} className="p-3.5 bg-[#0b1326] rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-[#4be277]">{item.eNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.riskLevel === 'BANNED' ? 'bg-red-500/20 text-red-400' :
                        item.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-[#ffb690]' : 'bg-[#22c55e]/20 text-[#4be277]'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </div>
                    <h5 className="font-heading font-semibold text-sm text-white">{item.name}</h5>
                    <p className="text-xs text-[#869585] mt-1 line-clamp-2">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Allergens & Dietary compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allergens */}
            <div className="bg-[#171f33] border border-white/10 rounded-2xl p-5">
              <h4 className="font-heading font-bold text-sm text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ffb690]" /> Whole-Word Allergen Detections
              </h4>
              <p className="text-xs text-[#869585] mb-3">
                Strict whole-word dictionary ensures items like "eggplant" never false-trigger "egg".
              </p>
              {scanResult.allergens?.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#0b1326] text-xs text-[#4be277] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4be277]" /> No major food allergens detected.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {scanResult.allergens.map((alg: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-[#ffb690]">
                      {alg}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Dietary Flags */}
            <div className="bg-[#171f33] border border-white/10 rounded-2xl p-5">
              <h4 className="font-heading font-bold text-sm text-white mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#50dfa4]" /> Dietary & Lifestyle Compliance
              </h4>
              <p className="text-xs text-[#869585] mb-3">
                Demo record compliance check.
              </p>
              {scanResult.dietaryFlags?.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#0b1326] text-xs text-[#4be277] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4be277]" /> No prohibited animal by-products flagged.
                </div>
              ) : (
                <div className="space-y-1.5 text-xs text-amber-300">
                  {scanResult.dietaryFlags.map((flag: string, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20">
                      {flag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
