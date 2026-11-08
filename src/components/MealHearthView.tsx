import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle,
  ChefHat,
  Clock,
  Flame,
  Heart,
  Plus,
  ShoppingBag,
  Sparkles,
  Users,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import { FamilyMember, MealOption, MealSlot, PantryItem } from '../types';

interface MealHearthViewProps {
  mealSlots: MealSlot[];
  familyMembers: FamilyMember[];
  pantryItems: PantryItem[];
  onToggleVote: (slotId: string, optionId: string, memberId: string) => void;
  onSelectOption: (slotId: string, optionId: string) => void;
  onStartCooking: (slot: MealSlot, option: MealOption) => void;
  onAddMissingToCart: (missingItems: { name: string; amount: number; unit: string; pantryItem?: PantryItem }[]) => void;
}

export const MealHearthView: React.FC<MealHearthViewProps> = ({
  mealSlots,
  familyMembers,
  pantryItems,
  onToggleVote,
  onSelectOption,
  onStartCooking,
  onAddMissingToCart,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('lunch');

  const activeSlot = mealSlots.find((s) => s.id === selectedSlotId) || mealSlots[1];

  // Helper to cross-reference ingredient stock
  const checkStock = (option: MealOption) => {
    const missing: { name: string; amount: number; unit: string; pantryItem?: PantryItem }[] = [];
    let isFullyStocked = true;

    option.ingredients.forEach((ing) => {
      const match = pantryItems.find((p) => p.id === ing.pantryItemId);
      const totalNeeded = ing.quantityPerServing * option.servings;

      if (!match) {
        isFullyStocked = false;
        missing.push({
          name: ing.name,
          amount: totalNeeded,
          unit: ing.unit,
        });
      } else {
        // Compare unit & amount
        let hasEnough = false;
        if (match.unit === ing.unit) {
          hasEnough = match.currentQuantity >= totalNeeded;
        } else if (match.unit === 'kg' && ing.unit === 'g') {
          hasEnough = match.currentQuantity * 1000 >= totalNeeded;
        } else if (match.unit === 'L' && ing.unit === 'ml') {
          hasEnough = match.currentQuantity * 1000 >= totalNeeded;
        } else {
          hasEnough = match.currentQuantity > 0;
        }

        if (!hasEnough) {
          isFullyStocked = false;
          missing.push({
            name: match.name,
            amount: totalNeeded,
            unit: ing.unit,
            pantryItem: match,
          });
        }
      }
    });

    return { isFullyStocked, missing };
  };

  return (
    <div className="space-y-8 pb-16">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#d35400] uppercase tracking-wider font-display">
            Family Kitchen Hearth &amp; Collective Decisions
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] font-display tracking-tight mt-1">
            Daily Meal Hearth
          </h1>
          <p className="text-sm text-[#1e293b]/70 mt-1 max-w-xl">
            Vote on family dishes, harmonize dietary preferences, and verify
            ingredient availability before cooking.
          </p>
        </div>

        {/* Family Member Preference Avatars */}
        <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-[#e26d1e]/15 shadow-sm">
          <span className="text-[11px] font-semibold text-[#1e293b]/60 mr-1 hidden sm:inline">
            Family Hearth:
          </span>
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="group relative cursor-pointer"
              title={`${member.name} (${member.relation}): ${member.preferenceTag}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${member.avatarColor} ring-2 ring-white shadow-xs`}
              >
                {member.avatarText}
              </div>
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-44 p-2 bg-[#1e293b] text-white text-[10px] rounded-lg shadow-lg pointer-events-none">
                <p className="font-bold">{member.name}</p>
                <p className="text-white/80 font-normal">{member.preferenceTag}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Slot Timeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mealSlots.map((slot) => {
          const isSelected = slot.id === activeSlot.id;
          const activeOpt = slot.options.find((o) => o.id === slot.activeOptionId) || slot.options[0];
          const totalVotes = slot.options.reduce((acc, opt) => acc + opt.votes.length, 0);

          return (
            <button
              key={slot.id}
              onClick={() => setSelectedSlotId(slot.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-[#d35400] ring-2 ring-[#d35400]/20 shadow-hearth-2'
                  : 'bg-white/60 hover:bg-white border-[#1e293b]/10'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
                  <div className="bg-[#d35400] text-white text-[9px] font-bold py-0.5 text-center transform rotate-45 translate-x-2 -translate-y-1 w-12">
                    Active
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[#1e293b]/60 mb-1">
                <span className="font-mono text-[11px] font-medium">{slot.scheduledTime}</span>
                <span className="text-[10px] font-bold text-[#d35400]">{slot.hindiLabel}</span>
              </div>

              <h3 className="text-sm font-bold font-display text-[#1e293b] truncate">
                {slot.name}
              </h3>

              <div className="mt-2 pt-2 border-t border-[#1e293b]/5 flex items-center justify-between text-[11px] text-[#1e293b]/70">
                <span className="truncate max-w-[120px] font-medium">{activeOpt?.title}</span>
                <span className="font-mono text-[10px] bg-amber-50 px-1.5 py-0.5 rounded text-amber-900 font-semibold">
                  {totalVotes} votes
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Meal Slot Dish Options Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-[#1e293b]">
              Options for {activeSlot.name} ({activeSlot.scheduledTime})
            </h2>
            <p className="text-xs text-[#1e293b]/60">
              Tap any family member chip to record their vote. The highest voted dish is confirmed.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeSlot.options.map((option) => {
            const isChosen = option.id === activeSlot.activeOptionId;
            const { isFullyStocked, missing } = checkStock(option);

            return (
              <div
                key={option.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-hearth-1 ${
                  isChosen
                    ? 'border-[#d35400] ring-2 ring-[#d35400]/20'
                    : 'border-[#1e293b]/10 hover:border-[#1e293b]/20'
                }`}
              >
                {/* Hero Dish Image */}
                <div className="relative h-48 bg-[#fdfaf5] overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {option.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#1e293b] backdrop-blur-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#1e293b]/80 backdrop-blur-xs text-white">
                      {option.calories} kcal
                    </div>
                  </div>

                  {/* Title & Timing on Scrim */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-3 text-xs text-white/80 mb-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Prep {option.prepTime} · Cook {option.cookTime}
                      </span>
                      <span>·</span>
                      <span className="font-medium">{option.servings} servings</span>
                    </div>
                    <h3 className="text-lg font-bold font-display leading-tight text-white drop-shadow-xs">
                      {option.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content & Family Voting */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-xs text-[#1e293b]/80 leading-relaxed">
                      {option.description}
                    </p>

                    {/* Tactile Meal Vote Chips */}
                    <div className="pt-2 border-t border-[#1e293b]/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-display text-[#1e293b] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#d35400]" />
                          Family Member Votes ({option.votes.length})
                        </span>
                        <span className="text-[11px] text-[#1e293b]/50">
                          Tap avatar to toggle vote
                        </span>
                      </div>

                      {/* Vote Chips Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {familyMembers.map((member) => {
                          const hasVoted = option.votes.includes(member.id);

                          return (
                            <button
                              key={member.id}
                              onClick={() => onToggleVote(activeSlot.id, option.id, member.id)}
                              className={`flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full text-xs font-semibold font-display transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                                hasVoted
                                  ? 'bg-[#d35400] text-white shadow-xs scale-102 ring-1 ring-[#d35400]'
                                  : 'bg-white hover:bg-[#1e293b]/5 text-[#1e293b]/70 border border-[#1e293b]/15'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  hasVoted ? 'bg-white text-[#d35400]' : member.avatarColor
                                }`}
                              >
                                {member.avatarText}
                              </div>
                              <span>{member.name.split(' ')[0]}</span>
                              {hasVoted && <Check className="w-3 h-3 ml-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pantry Inventory Availability Check */}
                    <div className="p-3 rounded-xl bg-[#fdfaf5] border border-[#e26d1e]/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1e293b] flex items-center gap-1.5">
                          <UtensilsCrossed className="w-3.5 h-3.5 text-[#d35400]" />
                          Pantry Inventory Check
                        </span>
                        {isFullyStocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ecfdf5] text-[#059669]">
                            <CheckCircle className="w-3 h-3" />
                            All Ingredients In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef9c3] text-[#854d0e]">
                            <AlertCircle className="w-3 h-3" />
                            {missing.length} Item(s) Needed
                          </span>
                        )}
                      </div>

                      {/* Missing items breakdown if any */}
                      {!isFullyStocked && (
                        <div className="text-xs text-[#854d0e] pt-1 border-t border-[#854d0e]/15 flex items-center justify-between flex-wrap gap-2">
                          <span className="text-[11px]">
                            Missing:{' '}
                            <strong className="font-semibold">
                              {missing.map((m) => m.name).join(', ')}
                            </strong>
                          </span>
                          <button
                            onClick={() => onAddMissingToCart(missing)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#eab308] hover:bg-[#ca8a04] text-[#1e293b] font-display font-bold text-[10px] transition-colors shadow-xs"
                          >
                            <Zap className="w-3 h-3 fill-current" />
                            <span>Add Missing to 11m Cart</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary CTA and Confirmation Controls */}
                  <div className="pt-3 border-t border-[#1e293b]/5 flex items-center gap-3">
                    <button
                      onClick={() => onStartCooking(activeSlot, option)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#d35400] hover:bg-[#b84500] text-white font-display font-bold text-xs shadow-sm shadow-[#d35400]/25 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Cook This Meal (Start Step Guide)</span>
                    </button>

                    <button
                      onClick={() => onSelectOption(activeSlot.id, option.id)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold font-display border transition-colors cursor-pointer shrink-0 ${
                        isChosen
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-white border-[#1e293b]/15 text-[#1e293b]/70 hover:bg-[#1e293b]/5'
                      }`}
                      title="Set as confirmed household choice"
                    >
                      {isChosen ? 'Selected' : 'Set Active'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
