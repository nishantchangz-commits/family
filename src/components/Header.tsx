import React from 'react';
import { Flame, ShoppingBag, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: 'pantry' | 'meals' | 'masala' | 'activity';
  setActiveTab: (tab: 'pantry' | 'meals' | 'masala' | 'activity') => void;
  cartCount: number;
  openCart: () => void;
  lowStockCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  lowStockCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#1e293b]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d35400] to-[#f97316] flex items-center justify-center text-white shadow-sm shadow-[#d35400]/30">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight text-[#1e293b] whitespace-nowrap shrink-0 block leading-none">
                Culinary Hearth
              </span>
              <span className="text-[11px] font-medium text-[#d35400] tracking-wide uppercase font-display block mt-1">
                Indian Kitchen &amp; Rasan Logistics
              </span>
            </div>
          </div>

          {/* Zone 2: 4 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => setActiveTab('pantry')}
              className={`pb-1 text-sm font-display whitespace-nowrap shrink-0 transition-colors relative ${
                activeTab === 'pantry'
                  ? 'text-[#d35400] font-semibold border-b-2 border-[#d35400]'
                  : 'text-[#1e293b]/70 hover:text-[#1e293b]'
              }`}
            >
              Pantry &amp; Rasan
              {lowStockCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-100 text-amber-900">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('meals')}
              className={`pb-1 text-sm font-display whitespace-nowrap shrink-0 transition-colors relative ${
                activeTab === 'meals'
                  ? 'text-[#d35400] font-semibold border-b-2 border-[#d35400]'
                  : 'text-[#1e293b]/70 hover:text-[#1e293b]'
              }`}
            >
              Daily Meal Hearth
            </button>

            <button
              onClick={() => setActiveTab('masala')}
              className={`pb-1 text-sm font-display whitespace-nowrap shrink-0 transition-colors relative ${
                activeTab === 'masala'
                  ? 'text-[#d35400] font-semibold border-b-2 border-[#d35400]'
                  : 'text-[#1e293b]/70 hover:text-[#1e293b]'
              }`}
            >
              Masala Dabba
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-1 text-sm font-display whitespace-nowrap shrink-0 transition-colors relative ${
                activeTab === 'activity'
                  ? 'text-[#d35400] font-semibold border-b-2 border-[#d35400]'
                  : 'text-[#1e293b]/70 hover:text-[#1e293b]'
              }`}
            >
              Hearth Journal
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (Quick-Commerce Express Restock Button) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openCart}
              className="group relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-[#1e293b] font-display font-semibold text-xs shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Open Quick-Commerce Express Restock Tray"
            >
              <div className="w-5 h-5 rounded-full bg-[#1e293b] flex items-center justify-center text-[#facc15]">
                <Zap className="w-3 h-3 fill-current" />
              </div>
              <span className="hidden sm:inline">11-Min Restock</span>
              <span className="sm:hidden">Restock</span>
              <div className="flex items-center gap-1 pl-1 border-l border-[#1e293b]/20 font-mono text-[11px] font-bold">
                <ShoppingBag className="w-3.5 h-3.5 inline" />
                <span className="tabular-nums">{cartCount}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-[#1e293b]/5 bg-[#fdfbf7]">
        <button
          onClick={() => setActiveTab('pantry')}
          className={`px-2.5 py-1 text-xs font-display font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'pantry' ? 'bg-[#d35400] text-white' : 'text-[#1e293b]/70'
          }`}
        >
          Pantry ({lowStockCount > 0 ? `${lowStockCount} low` : 'All'})
        </button>
        <button
          onClick={() => setActiveTab('meals')}
          className={`px-2.5 py-1 text-xs font-display font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'meals' ? 'bg-[#d35400] text-white' : 'text-[#1e293b]/70'
          }`}
        >
          Meal Hearth
        </button>
        <button
          onClick={() => setActiveTab('masala')}
          className={`px-2.5 py-1 text-xs font-display font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'masala' ? 'bg-[#d35400] text-white' : 'text-[#1e293b]/70'
          }`}
        >
          Masala Dabba
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-2.5 py-1 text-xs font-display font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'activity' ? 'bg-[#d35400] text-white' : 'text-[#1e293b]/70'
          }`}
        >
          Journal
        </button>
      </div>
    </header>
  );
};
