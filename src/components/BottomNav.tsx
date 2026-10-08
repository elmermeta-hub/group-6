import React from 'react';
import { Dumbbell, Database, Sparkles, Sprout, Cpu } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'nutrition' | 'additives' | 'scanner' | 'pesticides';
  setActiveTab: (tab: 'nutrition' | 'additives' | 'scanner' | 'pesticides') => void;
  onOpenInspector: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenInspector
}) => {
  const navItems = [
    { id: 'nutrition' as const, label: 'Athletic Fuel', icon: Dumbbell },
    { id: 'additives' as const, label: 'E-Numbers', icon: Database },
    { id: 'scanner' as const, label: 'Cocktail Scan', icon: Sparkles },
    { id: 'pesticides' as const, label: 'Pesticide MRL', icon: Sprout }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b1326]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#4be277] bg-[#171f33]'
                  : 'text-[#869585] hover:text-[#dae2fd]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-heading font-semibold truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* 5th button: MCP Inspector */}
        <button
          onClick={onOpenInspector}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[#50dfa4] hover:bg-[#171f33] transition-all"
        >
          <Cpu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-heading font-semibold">Inspector</span>
        </button>
      </div>
    </nav>
  );
};
