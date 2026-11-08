import React, { useEffect, useState } from 'react';
import {
  Bell,
  Check,
  ChefHat,
  Clock,
  Flame,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { MealOption, MealSlot } from '../types';

interface CookModeModalProps {
  slot: MealSlot;
  option: MealOption;
  onClose: () => void;
  onFinishCooking: (scaledOption: MealOption, scaledServings: number) => void;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({
  slot,
  option,
  onClose,
  onFinishCooking,
}) => {
  const [servings, setServings] = useState<number>(option.servings || 4);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [whistleCount, setWhistleCount] = useState<number>(0);

  // Active step timer
  const currentStep = option.steps[currentStepIndex] || option.steps[0];
  const stepDurationSec = (currentStep.durationMinutes || 5) * 60;
  const [timeLeft, setTimeLeft] = useState<number>(stepDurationSec);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // When step changes, update timer duration
  useEffect(() => {
    setTimeLeft((currentStep.durationMinutes || 5) * 60);
    setIsTimerRunning(false);
  }, [currentStepIndex, currentStep]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Scaler multiplier
  const scaleRatio = servings / (option.servings || 4);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleIngredientCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleFinish = () => {
    onFinishCooking(option, servings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-hearth-modal border border-[#1e293b]/10 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#fdfbf7]/95 backdrop-blur-md px-6 py-4 border-b border-[#1e293b]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d35400] text-white flex items-center justify-center shadow-sm">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#d35400] font-display">
                  Live Cook Mode · {slot.name}
                </span>
                <span className="text-xs text-[#1e293b]/40">·</span>
                <span className="text-xs font-semibold text-[#1e293b]/70">
                  Step {currentStepIndex + 1} of {option.steps.length}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-[#1e293b] leading-tight">
                {option.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#1e293b]/10 flex items-center justify-center text-[#1e293b]/70 border border-[#1e293b]/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Servings Scaler Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#e26d1e]/15 shadow-sm">
            <div>
              <span className="text-xs font-semibold text-[#1e293b] block">
                Portion &amp; Servings Scaler
              </span>
              <p className="text-xs text-[#1e293b]/60">
                Ingredients and spice ratios automatically scale to match your household count.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-[#1e293b]/70 font-medium">Servings:</span>
              <div className="flex items-center bg-[#fdfaf5] border border-[#1e293b]/15 rounded-xl p-1">
                <button
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  className="w-7 h-7 rounded-lg hover:bg-[#1e293b]/10 flex items-center justify-center text-[#1e293b] font-bold cursor-pointer transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center font-bold font-display text-sm text-[#1e293b] tabular-nums">
                  {servings}
                </span>
                <button
                  onClick={() => setServings((s) => Math.min(12, s + 1))}
                  className="w-7 h-7 rounded-lg hover:bg-[#1e293b]/10 flex items-center justify-center text-[#1e293b] font-bold cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Scaled Ingredient Checklist */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-[#1e293b]/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]/5">
                <span className="text-xs font-bold font-display text-[#1e293b]">
                  Mise en Place Checklist ({option.ingredients.length})
                </span>
                <span className="text-[11px] text-[#1e293b]/50">
                  {Object.values(checkedIngredients).filter(Boolean).length} ready
                </span>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {option.ingredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  const scaledQty =
                    Math.round(ing.quantityPerServing * servings * 10) / 10;

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredientCheck(idx)}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50 text-emerald-900 line-through opacity-70'
                          : 'hover:bg-[#fdfaf5] text-[#1e293b]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[9px] ${
                            isChecked
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'border-[#1e293b]/30'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="font-medium">{ing.name}</span>
                      </div>
                      <span className="font-mono font-semibold tabular-nums text-xs">
                        {scaledQty} {ing.unit}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Whistle Counter for Pressure Cookers */}
              <div className="pt-3 border-t border-[#1e293b]/10 flex items-center justify-between bg-amber-50/70 p-2.5 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold font-display">
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>Cooker Whistles:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-amber-900 tabular-nums">
                    {whistleCount}
                  </span>
                  <button
                    onClick={() => setWhistleCount((w) => w + 1)}
                    className="px-2 py-0.5 rounded-md bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs cursor-pointer shadow-xs"
                  >
                    + Whistle
                  </button>
                  {whistleCount > 0 && (
                    <button
                      onClick={() => setWhistleCount(0)}
                      className="text-[10px] text-amber-800 underline ml-1 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Active Cooking Step & Timer */}
            <div className="lg:col-span-7 space-y-4">
              {/* Step Detail Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#e26d1e]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#d35400] tracking-wide font-display uppercase">
                    Step {currentStep.stepNumber}: {currentStep.title}
                  </span>
                  {currentStep.isTadka && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      <Flame className="w-3 h-3 text-[#d35400]" />
                      Tadka Sizzle Stage
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base text-[#1e293b] leading-relaxed font-normal">
                  {currentStep.instruction}
                </p>

                {/* Tadka Spices Helper if applicable */}
                {currentStep.isTadka && currentStep.tadkaSpices && (
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1.5">
                    <span className="text-xs font-bold text-amber-900 block font-display">
                      Blooming Order in Hot Ghee:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {currentStep.tadkaSpices.map((spice, i) => (
                        <span
                          key={spice}
                          className="px-2 py-1 rounded-md bg-white border border-amber-300 text-xs font-semibold text-amber-950 font-display flex items-center gap-1"
                        >
                          <span className="w-4 h-4 rounded-full bg-amber-700 text-white flex items-center justify-center text-[9px]">
                            {i + 1}
                          </span>
                          {spice}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chef Tip if available */}
                {currentStep.chefTip && (
                  <div className="p-3 bg-orange-50/60 rounded-xl border border-[#d35400]/20 text-xs text-[#1e293b]/80 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#d35400] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#d35400] font-semibold">Kitchen Secret: </strong>
                      {currentStep.chefTip}
                    </div>
                  </div>
                )}

                {/* Step Countdown Timer */}
                <div className="pt-2 flex items-center justify-between p-3 bg-[#fdfaf5] rounded-xl border border-[#1e293b]/10">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#d35400]" />
                    <span className="font-mono text-xl font-bold text-[#1e293b] tabular-nums">
                      {formatTimer(timeLeft)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTimerRunning((r) => !r)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-display cursor-pointer transition-colors ${
                        isTimerRunning
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-[#d35400] text-white shadow-xs'
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimeLeft(stepDurationSec);
                      }}
                      className="p-1.5 text-[#1e293b]/60 hover:text-[#1e293b] rounded-lg border border-[#1e293b]/10"
                      title="Reset timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold font-display border border-[#1e293b]/15 bg-white text-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1e293b]/5 transition-colors"
                >
                  ← Previous Step
                </button>

                {currentStepIndex < option.steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStepIndex((i) => i + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-bold font-display bg-[#d35400] text-white hover:bg-[#b84500] shadow-sm transition-all"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold font-display bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete Meal &amp; Update Inventory</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
