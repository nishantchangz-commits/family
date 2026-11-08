import React, { useState } from 'react';
import {
  Check,
  Compass,
  Droplet,
  Flame,
  Info,
  RotateCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { MasalaSpice } from '../types';

interface MasalaDabbaViewProps {
  spices: MasalaSpice[];
  onRefillSpice: (spiceId: string) => void;
}

export const MasalaDabbaView: React.FC<MasalaDabbaViewProps> = ({
  spices,
  onRefillSpice,
}) => {
  const [selectedSpiceId, setSelectedSpiceId] = useState<string>('haldi');

  const selectedSpice = spices.find((s) => s.id === selectedSpiceId) || spices[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#d35400] uppercase tracking-wider font-display">
            The Sacred Aromatics of the Indian Kitchen
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] font-display tracking-tight mt-1">
            Masala Dabba (मसाला दानी)
          </h1>
          <p className="text-sm text-[#1e293b]/70 mt-1 max-w-xl">
            The beating heart of Indian tempering. Tap each brass katori to inspect
            essential oils, Ayurvedic virtues, and blooming sequences.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Pure Brass 7-Katori Traditional Layout</span>
        </div>
      </div>

      {/* Main Dual Presentation: Interactive Circular Brass Dabba + Spice Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 Cols: Brass Container Representation */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#f8f5ee] to-[#ece5d4] rounded-3xl p-6 sm:p-10 border border-[#b49861]/40 shadow-hearth-1 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle brass sheen rings */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-stone-400/10 pointer-events-none" />

          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950 font-display">
              Heavy Brass Masala Dabba
            </span>
            <p className="text-[11px] text-[#1e293b]/60">
              Click any katori to view aroma notes &amp; refill levels
            </p>
          </div>

          {/* Interactive Dabba Circular Katoris */}
          <div className="relative w-72 h-72 sm:w-84 sm:h-84 rounded-full bg-gradient-to-br from-[#dfc896] via-[#cbb07a] to-[#9e834e] p-3 shadow-2xl border-4 border-[#8e723c] flex items-center justify-center">
            {/* Center Katori: Hing & Amchur */}
            {(() => {
              const centerSpice = spices.find((s) => s.id === 'amchur-hing') || spices[6];
              const isSelected = selectedSpice.id === centerSpice.id;
              return (
                <button
                  key={centerSpice.id}
                  onClick={() => setSelectedSpiceId(centerSpice.id)}
                  className={`w-24 h-24 rounded-full transition-all duration-200 z-10 flex flex-col items-center justify-center text-center p-2 cursor-pointer shadow-inner border-2 ${
                    isSelected
                      ? 'ring-4 ring-[#d35400] scale-108 border-white'
                      : 'border-[#735928] hover:scale-103'
                  }`}
                  style={{
                    backgroundColor: centerSpice.color,
                    color: centerSpice.textColor,
                  }}
                  title={centerSpice.name}
                >
                  <span className="text-xs font-bold font-display drop-shadow-xs">
                    {centerSpice.name}
                  </span>
                  <span className="text-[10px] opacity-90">{centerSpice.hindiName}</span>
                  <div className="mt-1 w-10 h-1.5 rounded-full bg-black/20 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${centerSpice.fillPercentage}%` }}
                    />
                  </div>
                </button>
              );
            })()}

            {/* Outer 6 Katoris */}
            {spices
              .filter((s) => s.id !== 'amchur-hing')
              .map((spice, idx) => {
                const angle = (idx * 60 - 90) * (Math.PI / 180);
                // Radius distance from center
                const radius = 100;
                const x = Math.round(Math.cos(angle) * radius);
                const y = Math.round(Math.sin(angle) * radius);
                const isSelected = selectedSpice.id === spice.id;

                return (
                  <button
                    key={spice.id}
                    onClick={() => setSelectedSpiceId(spice.id)}
                    className={`absolute w-20 h-20 rounded-full transition-all duration-200 flex flex-col items-center justify-center text-center p-1.5 cursor-pointer shadow-md border-2 ${
                      isSelected
                        ? 'ring-4 ring-[#d35400] scale-110 z-20 border-white'
                        : 'border-[#735928] hover:scale-105 z-10'
                    }`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      backgroundColor: spice.color,
                      color: spice.textColor,
                    }}
                    title={spice.name}
                  >
                    <span className="text-[11px] font-bold font-display drop-shadow-xs leading-tight">
                      {spice.name}
                    </span>
                    <span className="text-[9px] opacity-90">{spice.hindiName}</span>
                    <div className="mt-1 w-8 h-1 rounded-full bg-black/20 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${spice.fillPercentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-[#1e293b]/70 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" /> Optimal Level (&gt;50%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" /> Low Fill (&lt;50%)
            </span>
          </div>
        </div>

        {/* Right 6 Cols: Selected Spice Dossier */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#e26d1e]/15 shadow-hearth-1 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold font-display shadow-md border-2 border-white"
                style={{
                  backgroundColor: selectedSpice.color,
                  color: selectedSpice.textColor,
                }}
              >
                {selectedSpice.hindiName}
              </div>
              <div>
                <span className="text-xs font-semibold text-[#d35400] tracking-wider uppercase font-display">
                  Spices of the Hearth
                </span>
                <h2 className="text-2xl font-bold font-display text-[#1e293b]">
                  {selectedSpice.name} ({selectedSpice.englishMeaning})
                </h2>
              </div>
            </div>

            <button
              onClick={() => onRefillSpice(selectedSpice.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold font-display transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Refill katori to 100%"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Refill Katori</span>
            </button>
          </div>

          {/* Fill Gauge */}
          <div className="p-4 bg-[#fdfaf5] rounded-2xl border border-[#1e293b]/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-[#1e293b]">
              <span>Katori Fill Level</span>
              <span className="font-bold font-mono text-sm tabular-nums">
                {selectedSpice.fillPercentage}% Full
              </span>
            </div>
            <div className="h-2.5 w-full bg-[#1e293b]/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedSpice.fillPercentage < 50 ? 'bg-[#eab308]' : 'bg-[#059669]'
                }`}
                style={{ width: `${selectedSpice.fillPercentage}%` }}
              />
            </div>
          </div>

          {/* Deep Sensory & Science Breakdown */}
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-[#1e293b]/5 bg-white space-y-1">
              <span className="text-xs font-bold font-display text-[#1e293b] flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-[#d35400]" />
                Sensory Aroma Profile
              </span>
              <p className="text-xs text-[#1e293b]/80 leading-relaxed">
                {selectedSpice.aroma}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1">
              <span className="text-xs font-bold font-display text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Ayurvedic &amp; Health Virtues
              </span>
              <p className="text-xs text-emerald-900/90 leading-relaxed">
                {selectedSpice.ayurveda}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
              <span className="text-xs font-bold font-display text-amber-950 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#d35400]" />
                Tadka Tempering Science
              </span>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                {selectedSpice.tadkaRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
