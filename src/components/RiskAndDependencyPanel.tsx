import React, { useState } from 'react';
import {
  Sprint,
  Ticket,
  RiskItem,
  DependencyItem,
  DependencyStatus,
  RiskSeverity,
} from '../data/greenBdgData';
import {
  AlertTriangle,
  Link2,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

interface RiskAndDependencyPanelProps {
  sprints: Sprint[];
  risks: RiskItem[];
  dependencies: DependencyItem[];
  selectedSprint: string | null;
  onUpdateDependencyStatus: (id: string, status: DependencyStatus) => void;
  onSelectTicket: (ticket: Ticket) => void;
}

const LEVELS: RiskSeverity[] = ['Low', 'Medium', 'High'];

export const RiskAndDependencyPanel: React.FC<RiskAndDependencyPanelProps> = ({
  sprints,
  risks,
  dependencies,
  selectedSprint,
  onUpdateDependencyStatus,
  onSelectTicket,
}) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(
    risks[0] || null
  );
  const [depFilterStatus, setDepFilterStatus] = useState<
    'ALL' | DependencyStatus
  >('ALL');

  const sprintColorMap = Object.fromEntries(
    sprints.map((s) => [s.id, s.color])
  );
  const allTickets = sprints.flatMap((s) => s.tickets);

  const filteredRisks = selectedSprint
    ? risks.filter((r) => r.sprintId === selectedSprint)
    : risks;

  const filteredDependencies = dependencies.filter((d) => {
    if (selectedSprint && d.sprintId !== selectedSprint) return false;
    if (depFilterStatus !== 'ALL' && d.status !== depFilterStatus) return false;
    return true;
  });

  const metCount = dependencies.filter((d) => d.status === 'Met').length;
  const pendingCount = dependencies.filter(
    (d) => d.status === 'Pending'
  ).length;
  const blockedCount = dependencies.filter(
    (d) => d.status === 'Blocked'
  ).length;

  return (
    <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left 7 cols: Risk Heatmap Matrix (Likelihood x Impact) */}
      <div className="xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">
                <span>Proactive Threat Intelligence</span>
                <span aria-hidden="true">·</span>
                <span>{filteredRisks.length} Tracked Risks</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Risk Heatmap (Likelihood × Impact)
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              {sprints.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="font-mono font-medium">{s.id}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 3x3 Risk Grid */}
          <div className="mt-5">
            <div className="grid grid-cols-4 gap-2 items-stretch">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                Impact ↑ / Likelihood →
              </div>
              {LEVELS.map((l) => (
                <div
                  key={l}
                  className="text-center text-xs font-semibold text-slate-600 dark:text-slate-400 py-1"
                >
                  {l} Likelihood
                </div>
              ))}

              {/* Rows from High Impact down to Low Impact */}
              {([...LEVELS].reverse() as RiskSeverity[]).map((impactLevel) => (
                <React.Fragment key={impactLevel}>
                  <div className="flex items-center justify-end pr-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {impactLevel} Impact
                  </div>
                  {LEVELS.map((likelihoodLevel) => {
                    const cellRisks = filteredRisks.filter(
                      (r) =>
                        r.impact === impactLevel &&
                        r.likelihood === likelihoodLevel
                    );
                    const isCriticalZone =
                      (impactLevel === 'High' && likelihoodLevel === 'High') ||
                      (impactLevel === 'High' &&
                        likelihoodLevel === 'Medium') ||
                      (impactLevel === 'Medium' && likelihoodLevel === 'High');

                    return (
                      <div
                        key={`${impactLevel}-${likelihoodLevel}`}
                        className={`min-h-[96px] p-2.5 rounded-xl border flex flex-wrap items-center justify-center gap-2 transition-colors ${
                          isCriticalZone
                            ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200/80 dark:border-red-900/50'
                            : 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800'
                        }`}
                      >
                        {cellRisks.length === 0 ? (
                          <span className="text-[11px] font-mono text-slate-300 dark:text-slate-700">
                            0 risks
                          </span>
                        ) : (
                          cellRisks.map((risk) => {
                            const isSelected = selectedRisk?.id === risk.id;
                            const bubbleSize =
                              28 + Math.min(20, risk.affectedTickets.length * 4);
                            return (
                              <button
                                key={risk.id}
                                type="button"
                                onClick={() => setSelectedRisk(risk)}
                                style={{
                                  width: `${bubbleSize}px`,
                                  height: `${bubbleSize}px`,
                                  backgroundColor:
                                    sprintColorMap[risk.sprintId] || '#3182CE',
                                }}
                                title={`${risk.sprintId}: ${risk.title} (${risk.affectedTickets.length} tickets affected)`}
                                className={`rounded-full text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer ${
                                  isSelected
                                    ? 'ring-3 ring-slate-900 dark:ring-white scale-110'
                                    : 'opacity-90 hover:opacity-100'
                                }`}
                              >
                                {risk.sprintId}
                              </button>
                            );
                          })
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Risk Drill-Down Box */}
        {selectedRisk && (
          <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {selectedRisk.id} ({selectedRisk.sprintId})
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  · Likelihood: {selectedRisk.likelihood} / Impact:{' '}
                  {selectedRisk.impact}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Owner: {selectedRisk.owner}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {selectedRisk.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">
                Mitigation Strategy:
              </strong>{' '}
              {selectedRisk.mitigation}
            </p>
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Affected Tickets:
              </span>
              {selectedRisk.affectedTickets.map((tid) => {
                const ticketObj = allTickets.find((t) => t.id === tid);
                return (
                  <button
                    key={tid}
                    type="button"
                    onClick={() => ticketObj && onSelectTicket(ticketObj)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 transition-colors"
                  >
                    <span>{tid}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right 5 cols: Cross-Sprint Dependency Tracker */}
      <div className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                <span>Stakeholder Input Readiness</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {metCount} Met / {pendingCount} Pending / {blockedCount} Blocked
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Dependency & Input Tracker
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
              {(['ALL', 'Met', 'Pending', 'Blocked'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setDepFilterStatus(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    depFilterStatus === st
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Dependency list */}
          <div className="mt-4 space-y-2.5 max-h-[430px] overflow-y-auto pr-1">
            {filteredDependencies.map((dep) => {
              const statusIcon =
                dep.status === 'Met' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : dep.status === 'Pending' ? (
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                );

              return (
                <div
                  key={dep.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5">{statusIcon}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          {dep.sprintId}
                        </span>
                        <span aria-hidden="true" className="text-slate-400">
                          ·
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 truncate">
                          Owner: {dep.stakeholder}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">
                        {dep.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                        Impacts: {dep.affectedTickets.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Interactive status switcher */}
                  <select
                    aria-label={`Status for ${dep.name}`}
                    value={dep.status}
                    onChange={(e) =>
                      onUpdateDependencyStatus(
                        dep.id,
                        e.target.value as DependencyStatus
                      )
                    }
                    className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border cursor-pointer shrink-0 ${
                      dep.status === 'Met'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : dep.status === 'Pending'
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                        : 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                    }`}
                  >
                    <option value="Met">Met</option>
                    <option value="Pending">Pending</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5" />
            <span>Change any dependency status above to simulate blocker impact</span>
          </span>
          <span className="font-mono tabular-nums">
            {Math.round((metCount / dependencies.length) * 100)}% Inputs Ready
          </span>
        </div>
      </div>
    </section>
  );
};
