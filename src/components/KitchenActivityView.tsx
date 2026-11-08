import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Flame,
  Heart,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { FamilyMember } from '../types';

interface ActivityLogItem {
  id: string;
  type: 'cook' | 'restock' | 'vote' | 'note';
  title: string;
  timestamp: string;
  detail: string;
  author?: string;
}

interface KitchenActivityViewProps {
  familyMembers: FamilyMember[];
  activityLogs: ActivityLogItem[];
  onAddNote: (note: string, author: string) => void;
}

export const KitchenActivityView: React.FC<KitchenActivityViewProps> = ({
  familyMembers,
  activityLogs,
  onAddNote,
}) => {
  const [newNote, setNewNote] = useState('');
  const [noteAuthor, setNoteAuthor] = useState(familyMembers[1]?.name || 'Mummy');
  const [isJainMode, setIsJainMode] = useState(false);
  const [isLowOilMode, setIsLowOilMode] = useState(false);

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote.trim(), noteAuthor);
    setNewNote('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#d35400] uppercase tracking-wider font-display">
            The Family Kitchen Memory &amp; Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] font-display tracking-tight mt-1">
            Hearth Kitchen Journal
          </h1>
          <p className="text-sm text-[#1e293b]/70 mt-1 max-w-xl">
            Communal cooking diary, household member dietary guidelines, and
            traditional culinary wisdom.
          </p>
        </div>

        {/* Quick Household Dietary Switches */}
        <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-[#1e293b]/10 shadow-sm text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isJainMode}
              onChange={(e) => setIsJainMode(e.target.checked)}
              className="rounded text-[#d35400] focus:ring-[#d35400]"
            />
            <span className="font-semibold text-[#1e293b]">Jain (No Onion/Garlic)</span>
          </label>
          <span className="text-[#1e293b]/20">|</span>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isLowOilMode}
              onChange={(e) => setIsLowOilMode(e.target.checked)}
              className="rounded text-[#d35400] focus:ring-[#d35400]"
            />
            <span className="font-semibold text-[#1e293b]">Low-Oil / Heart Smart</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Chronological Hearth Log & Sticky Kitchen Notes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Post a Note to the Kitchen Board */}
          <div className="bg-white rounded-2xl p-5 border border-[#e26d1e]/15 shadow-hearth-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-display text-[#1e293b] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#d35400]" />
                Write a Note for Today&apos;s Cook
              </span>
              <span className="text-[11px] text-[#1e293b]/50">Kitchen notice board</span>
            </div>

            <form onSubmit={handleSubmitNote} className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g., Dadi has fasting today, please keep roasted makhana and curd ready. Aarav has football practice at 6pm."
                rows={2}
                className="w-full p-3 text-xs border border-[#1e293b]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d35400] bg-[#fdfaf5]"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#1e293b]/60 font-medium">From:</span>
                  <select
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    className="text-xs p-1 rounded-lg border border-[#1e293b]/15 bg-white font-medium"
                  >
                    {familyMembers.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#d35400] hover:bg-[#b84500] text-white font-display font-semibold text-xs shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  Pin Note
                </button>
              </div>
            </form>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-[#1e293b]/10 shadow-hearth-1 space-y-4">
            <h3 className="text-sm font-bold font-display text-[#1e293b] pb-2 border-b border-[#1e293b]/5">
              Recent Hearth Timeline &amp; Actions
            </h3>

            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      log.type === 'cook'
                        ? 'bg-amber-100 text-[#d35400]'
                        : log.type === 'restock'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {log.type === 'cook' ? (
                      <Flame className="w-3.5 h-3.5" />
                    ) : log.type === 'restock' ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Heart className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1e293b] font-display">{log.title}</span>
                      <span className="text-[10px] text-[#1e293b]/50 font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-[#1e293b]/70 mt-0.5">{log.detail}</p>
                    {log.author && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-[#d35400]">
                        — {log.author}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Family Profiles & Hearth Culinary Wisdom */}
        <div className="lg:col-span-5 space-y-6">
          {/* Family Profiles Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#e26d1e]/15 shadow-hearth-1 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]/5">
              <span className="text-xs font-bold font-display text-[#1e293b] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#d35400]" />
                Family Hearth Members ({familyMembers.length})
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                All Active
              </span>
            </div>

            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#fdfaf5] border border-[#1e293b]/5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${member.avatarColor}`}
                    >
                      {member.avatarText}
                    </div>
                    <div>
                      <h4 className="font-bold font-display text-[#1e293b] leading-tight">
                        {member.name}
                      </h4>
                      <span className="text-[10px] text-[#1e293b]/60">{member.relation}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-[#d35400] max-w-[140px] text-right truncate">
                    {member.preferenceTag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hearth Culinary Wisdom */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl p-6 border border-amber-200/80 shadow-sm space-y-3">
            <span className="text-xs font-bold text-amber-950 font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#d35400]" />
              Hearth Kitchen Wisdom
            </span>

            <div className="space-y-3 text-xs text-amber-900/90 leading-relaxed">
              <div className="p-3 bg-white/80 rounded-xl border border-amber-200/50">
                <strong className="text-amber-950 block font-display mb-0.5">
                  1. The Kasuri Methi Secret
                </strong>
                Warm the dried fenugreek leaves on a switched-off tawa for 20 seconds.
                Crush between dry palms directly over hot gravies right before serving.
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-200/50">
                <strong className="text-amber-950 block font-display mb-0.5">
                  2. Tadka Splutter Sequence
                </strong>
                Mustard seeds must crackle completely before cumin is added, or they remain
                bitter. Add Kashmiri chili off direct heat to maintain brilliant ruby red color.
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-200/50">
                <strong className="text-amber-950 block font-display mb-0.5">
                  3. Restoring Cooled Dal
                </strong>
                Never add cold tap water to thicken or loosen cooled dal. Whisk in boiling
                water with a pinch of rock salt to preserve velvety emulsion.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
