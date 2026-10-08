/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header.js';
import { GlobalSearch } from './components/GlobalSearch.js';
import { NutritionTab } from './components/NutritionTab.js';
import { AdditivesTab } from './components/AdditivesTab.js';
import { ScannerTab } from './components/ScannerTab.js';
import { PesticidesTab } from './components/PesticidesTab.js';
import { McpInspectorModal } from './components/McpInspectorModal.js';
import { BottomNav } from './components/BottomNav.js';
import { Dumbbell, Database, Sparkles, Sprout } from 'lucide-react';
import { DATASET_COUNTS } from '../api/_lib/ingredients-data.js';

type TabType = 'nutrition' | 'additives' | 'scanner' | 'pesticides';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('nutrition');
  const [inspectorOpen, setInspectorOpen] = useState(false);

  // Tab query carriers when routed from GlobalSearch
  const [nutritionQuery, setNutritionQuery] = useState('hummus');
  const [additiveSearch, setAdditiveSearch] = useState('');
  const [scannerIngredients, setScannerIngredients] = useState('');
  const [pesticideQuery, setPesticideQuery] = useState('glyphosate');

  const datasetCounts = {
    additives: DATASET_COUNTS.additivesCount,
    nutrition: DATASET_COUNTS.nutritionCount,
    pesticides: DATASET_COUNTS.pesticidesCount
  };

  const handleRouteQuery = (tab: TabType, query: string) => {
    setActiveTab(tab);
    if (tab === 'nutrition') {
      setNutritionQuery(query);
    } else if (tab === 'additives') {
      setAdditiveSearch(query);
    } else if (tab === 'scanner') {
      setScannerIngredients(query);
    } else if (tab === 'pesticides') {
      setPesticideQuery(query);
    }
  };

  const desktopTabs = [
    {
      id: 'nutrition' as const,
      label: 'Pre & Post Fuel',
      sublabel: 'Athletic Nutrition & Timing',
      icon: Dumbbell
    },
    {
      id: 'additives' as const,
      label: 'E-Number Directory',
      sublabel: 'Toxicology & Safety Codices',
      icon: Database
    },
    {
      id: 'scanner' as const,
      label: 'Cocktail Scanner',
      sublabel: 'Formulation Synergy & Allergens',
      icon: Sparkles
    },
    {
      id: 'pesticides' as const,
      label: 'Pesticide MRL',
      sublabel: 'Residue Limits & Produce',
      icon: Sprout
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col pb-20 md:pb-8">
      {/* Top Header */}
      <Header
        onOpenInspector={() => setInspectorOpen(true)}
        datasetCounts={datasetCounts}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 flex-1">
        {/* Global Smart Search */}
        <GlobalSearch onRouteQuery={handleRouteQuery} />

        {/* Desktop Tab Switcher */}
        <div className="hidden md:grid grid-cols-4 gap-3 mb-6">
          {desktopTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isActive
                    ? 'bg-[#171f33] border-[#4be277]/60 shadow-lg shadow-[#4be277]/10'
                    : 'bg-[#131b2e] border-white/5 hover:border-white/20 hover:bg-[#171f33]'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#22c55e] to-[#4be277]"></div>
                )}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive ? 'bg-[#22c55e] text-[#003915]' : 'bg-[#222a3d] text-[#dae2fd] group-hover:text-[#4be277]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3
                      className={`font-heading font-bold text-sm tracking-tight ${
                        isActive ? 'text-white' : 'text-[#dae2fd]'
                      }`}
                    >
                      {tab.label}
                    </h3>
                    <p className="text-[11px] text-[#869585] line-clamp-1">{tab.sublabel}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'nutrition' && <NutritionTab initialQuery={nutritionQuery} />}
        {activeTab === 'additives' && <AdditivesTab initialSearch={additiveSearch} />}
        {activeTab === 'scanner' && <ScannerTab initialIngredients={scannerIngredients} />}
        {activeTab === 'pesticides' && <PesticidesTab initialQuery={pesticideQuery} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInspector={() => setInspectorOpen(true)}
      />

      {/* MCP Live Inspector Pop-up Modal */}
      <McpInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        datasetCounts={datasetCounts}
      />
    </div>
  );
}
