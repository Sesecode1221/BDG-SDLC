import React from 'react';
import {
  SCOPE_LOCK_CLASSIFICATIONS,
  UNIVERSAL_DOD_ITEMS,
  PM_TOOL_COMPARISON,
} from '../data/greenBdgData';
import {
  Lock,
  CheckCircle2,
  Scale,
  ShieldCheck,
} from 'lucide-react';

export const ScopeAndUpdatesPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Scope Lock Panel & Section 9 Definition of Done */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 cols: Static Scope Lock Panel */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Section 1 & Section 13 Contractual Scope Control
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  10-Week / 2.5-Month Scope Lock & Change Classification
                </h3>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                <Lock className="w-3.5 h-3.5" />
                <span>Ceiling Locked: 10 Weeks (2.5 Months Max)</span>
              </div>
            </div>

            {/* Visual 10-Week / 2.5-Month Lock Bar */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-900 dark:text-white">
                  GreenBDG MVP Proposal V1.3 + Pareto Additions = 5 Two-Week Sprints
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  10 Weeks Total · 2½ Months Maximum Delivery Period
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 h-3 w-full">
                <div className="rounded-l-full bg-[#3182CE]" title="Sprint 1 (Weeks 1–2)" />
                <div className="bg-[#38A169]" title="Sprint 2 (Weeks 3–4)" />
                <div className="bg-[#805AD5]" title="Sprint 3 (Weeks 5–6)" />
                <div className="bg-[#DD6B20]" title="Sprint 4 (Weeks 7–8)" />
                <div className="rounded-r-full bg-[#E53E3E]" title="Sprint 5 (Weeks 9–10)" />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                <strong>Core Principle:</strong> The approved MVP must fit within five two-week sprints and must not exceed the two-and-a-half-month development limit. The development team is not expected to absorb additional requirements without assessing their impact on the agreed timeline.
              </p>
            </div>

            {/* 3 Static Classification Pillars */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {SCOPE_LOCK_CLASSIFICATIONS.map((group) => {
                const badgeStyle =
                  group.category === 'Already in Baseline'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : group.category === 'Approved MVP Change'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                    : 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300';

                return (
                  <div
                    key={group.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 flex flex-col justify-between"
                  >
                    <div>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${badgeStyle}`}
                      >
                        {group.category}
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                        {group.ruleDescription}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2.5">
                        {group.items.map((item, i) => (
                          <div key={i} className="text-xs">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {item.title}
                              </span>
                            </div>
                            <div className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                              {item.reference}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                              {item.note}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 cols: Section 9 Definition of Done for Every Sprint */}
        <div className="xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                Section 9 & Section 11 Quality Gate
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Definition of Done & Sprint Review Gate
              </h3>
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                A sprint item is complete when all 7 baseline criteria are satisfied:
              </div>
              <div className="space-y-2.5">
                {UNIVERSAL_DOD_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>End-of-Sprint 30-Minute Review Gate</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              At the end of every sprint, a 30-minute demo and review confirms completed work, demonstrated functionality, outstanding issues, decisions required, sprint acceptance, and readiness for the next sprint.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Value vs. Monday.com / Asana / Jira Comparison Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Strategic Presentation Value</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Value vs. Monday.com / Asana / Jira
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Purpose-built once-off executive baseline board
          </span>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Capability</th>
                <th className="py-3 px-4 text-emerald-600 dark:text-emerald-400">
                  GreenBDG Command Center
                </th>
                <th className="py-3 px-4">Monday.com / Asana / Jira</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {PM_TOOL_COMPARISON.map((row) => (
                <tr
                  key={row.feature}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 text-emerald-700 dark:text-emerald-300 font-semibold">
                    ✓ {row.greenBdg}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    ✕ {row.genericPm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
