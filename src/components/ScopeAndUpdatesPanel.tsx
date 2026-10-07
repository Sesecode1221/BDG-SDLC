import React, { useState } from 'react';
import {
  ProgressUpdate,
  ScopeChangeRequest,
  PM_TOOL_COMPARISON,
} from '../data/greenBdgData';
import {
  Lock,
  Plus,
  AlertOctagon,
  CheckCircle2,
  CalendarClock,
  Sparkles,
  Scale,
} from 'lucide-react';

interface ScopeAndUpdatesPanelProps {
  progressUpdates: ProgressUpdate[];
  scopeChanges: ScopeChangeRequest[];
  onAddProgressUpdate: (update: ProgressUpdate) => void;
  onAddScopeChange: (change: ScopeChangeRequest) => void;
}

export const ScopeAndUpdatesPanel: React.FC<ScopeAndUpdatesPanelProps> = ({
  progressUpdates,
  scopeChanges,
  onAddProgressUpdate,
  onAddScopeChange,
}) => {
  // New Progress Update Form State
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [sprintAndDay, setSprintAndDay] = useState('Sprint 2, Day 3 of 10');
  const [completedText, setCompletedText] = useState(
    'S2-T01: Completed Admin First-Time Setup workflow\nS2-T02: Created Building schema and CRUD endpoints'
  );
  const [inProgressText, setInProgressText] = useState(
    'S2-T04: Implementing CSV/XLSX parser and row validator'
  );
  const [plannedText, setPlannedText] = useState(
    'S2-T05: Connect S3 upload presigned URLs for Document Management'
  );
  const [blockersText, setBlockersText] = useState(
    'Awaiting final representative Staff CSV sample from HR stakeholder'
  );
  const [riskStatus, setRiskStatus] = useState<'Green' | 'Amber' | 'Red'>(
    'Green'
  );
  const [riskExplanation, setRiskExplanation] = useState(
    'Sprint 2 velocity is on track within the 2-week boundary.'
  );
  const [demoNotes, setDemoNotes] = useState(
    'Dev Demo Link: Admin Building Setup & CSV Validator Preview'
  );

  // Scope Creep Simulator State
  const [simTitle, setSimTitle] = useState('');
  const [simDays, setSimDays] = useState<number>(5);
  const [simClassification, setSimClassification] = useState<
    | 'Already Included in MVP'
    | 'Approved MVP Change'
    | 'Future-Phase Requirement'
  >('Approved MVP Change');
  const [simSprint, setSimSprint] = useState('S4');

  // Calculate total approved extra days added to MVP
  const approvedExtraDays = scopeChanges
    .filter((c) => c.classification === 'Approved MVP Change')
    .reduce((acc, c) => acc + c.estimatedDaysImpact, 0);

  const projectedWeeks = +(10 + approvedExtraDays / 5).toFixed(1);
  const isTimelineBreached = projectedWeeks > 10.0;

  const handleCreateUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const newUpdate: ProgressUpdate = {
      id: `PU-${Date.now()}`,
      sprintAndDay,
      timestamp: 'Mon/Wed/Fri 16:00 SAST',
      completedSinceLast: completedText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      inProgress: inProgressText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      plannedBeforeNext: plannedText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      blockersAndDecisions: blockersText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      riskStatus,
      riskExplanation,
      demoLinkOrNotes: demoNotes,
    };
    onAddProgressUpdate(newUpdate);
    setShowUpdateForm(false);
  };

  const handleAddScopeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simTitle.trim()) return;
    const newChange: ScopeChangeRequest = {
      id: `CR-0${scopeChanges.length + 1}`,
      title: simTitle.trim(),
      requestedBy: 'Stakeholder Change Request',
      date: 'Live Scope Evaluation',
      classification: simClassification,
      estimatedDaysImpact:
        simClassification === 'Already Included in MVP' ? 0 : simDays,
      targetSprint:
        simClassification === 'Future-Phase Requirement'
          ? 'Post-MVP Phase 2'
          : simSprint,
      rationale:
        simClassification === 'Future-Phase Requirement'
          ? 'Deferred to Phase 2 to protect the 10-week / 2.5-month MVP delivery ceiling.'
          : simClassification === 'Approved MVP Change'
          ? `Approved change adding ${simDays} dev days; requires equal scope trade-off to protect the 2.5-month limit.`
          : 'Verified as part of GreenBDG MVP Proposal V1.3 baseline.',
    };
    onAddScopeChange(newChange);
    setSimTitle('');
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 6 cols: Section 10 Progress Update Feed (Mon/Wed/Fri 16:00) */}
        <div className="xl:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                <span>Contractual Cadence: Mon · Wed · Fri by 16:00</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Structured Progress Update Feed
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowUpdateForm(!showUpdateForm)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showUpdateForm ? 'Cancel' : 'Log 16:00 Update'}</span>
            </button>
          </div>

          {showUpdateForm && (
            <form
              onSubmit={handleCreateUpdate}
              className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sprint and Day
                  </label>
                  <input
                    type="text"
                    value={sprintAndDay}
                    onChange={(e) => setSprintAndDay(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Risk Status (Green / Amber / Red)
                  </label>
                  <select
                    value={riskStatus}
                    onChange={(e) =>
                      setRiskStatus(e.target.value as 'Green' | 'Amber' | 'Red')
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Green">Green — On Track</option>
                    <option value="Amber">Amber — Manageable Risk</option>
                    <option value="Red">Red — Blocker / Escalation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Completed since the last update (one per line)
                </label>
                <textarea
                  rows={2}
                  value={completedText}
                  onChange={(e) => setCompletedText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    In progress
                  </label>
                  <textarea
                    rows={2}
                    value={inProgressText}
                    onChange={(e) => setInProgressText(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Planned before next update
                  </label>
                  <textarea
                    rows={2}
                    value={plannedText}
                    onChange={(e) => setPlannedText(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blockers and decisions needed
                  </label>
                  <input
                    type="text"
                    value={blockersText}
                    onChange={(e) => setBlockersText(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Risk Explanation & Demo Notes
                  </label>
                  <input
                    type="text"
                    value={riskExplanation}
                    onChange={(e) => setRiskExplanation(e.target.value)}
                    placeholder="Short risk explanation"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Demo link or screenshots note
                </label>
                <input
                  type="text"
                  value={demoNotes}
                  onChange={(e) => setDemoNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                >
                  Publish Progress Update
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {progressUpdates.map((pu) => (
              <article
                key={pu.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {pu.sprintAndDay}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      · {pu.timestamp}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                      pu.riskStatus === 'Green'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : pu.riskStatus === 'Amber'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                    }`}
                  >
                    Risk: {pu.riskStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Completed since last update:
                    </div>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {pu.completedSinceLast.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      In progress:
                    </div>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {pu.inProgress.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Planned before next update:
                    </div>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {pu.plannedBeforeNext.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                      Blockers & decisions needed:
                    </div>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                      {pu.blockersAndDecisions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Risk Note:
                    </strong>{' '}
                    {pu.riskExplanation}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                    {pu.demoLinkOrNotes}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Section 13 Scope & Timeline Control Simulator */}
        <div className="xl:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                  <span>Section 13 Governance</span>
                  <span aria-hidden="true">·</span>
                  <span>Proposal V1.3 Baseline Protection</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Scope Control & 2.5-Month Timeline Lock
                </h2>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Max: 10 Weeks (2.5 Mo)</span>
              </div>
            </div>

            {/* Locked Timeline Visual Gauge */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Contractual Delivery Ceiling: 5 Sprints (10.0 Weeks Max)
                </span>
                <span
                  className={`font-mono font-bold tabular-nums ${
                    isTimelineBreached
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  Projected: {projectedWeeks} Weeks (
                  {isTimelineBreached ? 'BREACH WARNING' : 'PROTECTED'})
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-600 h-full transition-all"
                  style={{ width: `${Math.min(100, (10 / projectedWeeks) * 100)}%` }}
                />
                {isTimelineBreached && (
                  <div
                    className="bg-red-600 h-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        ((projectedWeeks - 10) / projectedWeeks) * 100
                      )}%`,
                    }}
                  />
                )}
              </div>

              {isTimelineBreached ? (
                <div className="mt-2.5 flex items-start gap-2 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 p-2.5 rounded-lg border border-red-200 dark:border-red-900">
                  <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Scope Creep Alert:</strong> Approved mid-sprint changes
                    have added +{approvedExtraDays} dev days (+
                    {(approvedExtraDays / 5).toFixed(1)} weeks), exceeding the
                    2.5-month limit. Per Section 13, an equivalent effort ticket
                    must be swapped out or moved to Future-Phase.
                  </span>
                </div>
              ) : (
                <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Baseline V1.3 + Pareto Stakeholder Review additions fit within
                    the 5 two-week sprints (10 weeks).
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Scope Change Simulator Form */}
            <form
              onSubmit={handleAddScopeItem}
              className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Simulate New Requirement / Scope Change Request
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <input
                  type="text"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  placeholder="Enter proposed requirement (e.g., Live ERP Billing Integration)..."
                  className="sm:col-span-6 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
                <select
                  value={simClassification}
                  onChange={(e) =>
                    setSimClassification(
                      e.target.value as ScopeChangeRequest['classification']
                    )
                  }
                  className="sm:col-span-4 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Future-Phase Requirement">
                    Future-Phase Requirement (Safe)
                  </option>
                  <option value="Approved MVP Change">
                    Approved Change to MVP (+Days)
                  </option>
                  <option value="Already Included in MVP">
                    Already Included in MVP (0d)
                  </option>
                </select>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={simDays}
                  onChange={(e) => setSimDays(Number(e.target.value))}
                  title="Estimated Effort Days"
                  className="sm:col-span-2 px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Target Sprint:</span>
                  <select
                    value={simSprint}
                    onChange={(e) => setSimSprint(e.target.value)}
                    className="px-2 py-1 text-xs font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="S4">S4</option>
                    <option value="S5">S5</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors"
                >
                  Evaluate & Log Requirement
                </button>
              </div>
            </form>

            {/* Change Request Log */}
            <div className="mt-4 space-y-2 max-h-[230px] overflow-y-auto pr-1">
              {scopeChanges.map((cr) => (
                <div
                  key={cr.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {cr.id}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {cr.title}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {cr.rationale}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-medium text-[11px] ${
                        cr.classification === 'Already Included in MVP'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : cr.classification === 'Future-Phase Requirement'
                          ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {cr.classification}
                    </span>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                      {cr.targetSprint} · +{cr.estimatedDaysImpact}d impact
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Value Proposition Comparison vs Monday.com / Asana / Jira */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Executive Architecture Benchmark</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Why GreenBDG Sprint Command Center Transcends Generic PM Tools
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Purpose-built for GreenBDG MVP Proposal V1.3 & Pareto Alignment
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3">Intelligence Capability</th>
                <th className="py-2.5 px-3 text-emerald-700 dark:text-emerald-400">
                  GreenBDG Sprint Command Center
                </th>
                <th className="py-2.5 px-3">Monday.com / Asana / Jira</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {PM_TOOL_COMPARISON.map((row) => (
                <tr
                  key={row.feature}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-800 dark:text-emerald-300 font-medium">
                    ✓ {row.greenBdg}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                    ✕ {row.genericPm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
