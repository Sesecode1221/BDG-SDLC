import React, { useState } from 'react';
import {
  Sprint,
  Ticket,
  Workstream,
  WORKSTREAMS,
  INFRASTRUCTURE_MATRIX,
} from '../data/greenBdgData';
import {
  Monitor,
  Server,
  Database,
  Cloud,
  CheckCircle2,
  Shield,
  FileText,
  Users,
  Layers,
  BarChart3,
  Cpu,
  ChevronRight,
  X,
} from 'lucide-react';

interface WorkstreamMatrixProps {
  sprints: Sprint[];
  selectedSprint: string | null;
  selectedWorkstream: Workstream | null;
  onSelectSprint: (sprintId: string | null) => void;
  onSelectWorkstream: (ws: Workstream | null) => void;
  onSelectTicket: (ticket: Ticket) => void;
  highlightedTicketIds: Set<string>;
}

export const WORKSTREAM_ICONS: Record<Workstream, React.ReactNode> = {
  Frontend: <Monitor className="w-3.5 h-3.5" />,
  Backend: <Server className="w-3.5 h-3.5" />,
  Database: <Database className="w-3.5 h-3.5" />,
  'Infrastructure/DevOps': <Cloud className="w-3.5 h-3.5" />,
  'QA/Testing': <CheckCircle2 className="w-3.5 h-3.5" />,
  'Security/Compliance': <Shield className="w-3.5 h-3.5" />,
  Documentation: <FileText className="w-3.5 h-3.5" />,
  'Stakeholder Management': <Users className="w-3.5 h-3.5" />,
};

export const WorkstreamMatrix: React.FC<WorkstreamMatrixProps> = ({
  sprints,
  selectedSprint,
  selectedWorkstream,
  onSelectSprint,
  onSelectWorkstream,
  onSelectTicket,
  highlightedTicketIds,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'capacity' | 'infra'>('matrix');
  const [expandedCell, setExpandedCell] = useState<{
    sprintId: string;
    workstream: Workstream;
  } | null>(null);

  // Compute cell data: tickets & effort days per (sprint, workstream)
  const getCellTickets = (sprint: Sprint, ws: Workstream): Ticket[] => {
    return sprint.tickets.filter((t) => t.workstreams.includes(ws));
  };

  const getWorkstreamTotalTickets = (ws: Workstream): Ticket[] => {
    return sprints.flatMap((s) => getCellTickets(s, ws));
  };

  const getSprintTotalWorkstreamTouches = (sprint: Sprint): number => {
    return WORKSTREAMS.reduce((acc, ws) => acc + getCellTickets(sprint, ws).length, 0);
  };

  const grandTotalTouches = sprints.reduce(
    (acc, s) => acc + getSprintTotalWorkstreamTouches(s),
    0
  );

  // Determine heatmap cell styling based on count (0 to 9)
  const getHeatCellStyle = (count: number, isSelected: boolean) => {
    if (isSelected) {
      return 'ring-2 ring-emerald-500 bg-emerald-600 text-white font-semibold';
    }
    if (count === 0) {
      return 'bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600';
    }
    if (count <= 2) {
      return 'bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900/70';
    }
    if (count <= 4) {
      return 'bg-sky-100/90 dark:bg-sky-900/60 text-sky-950 dark:text-sky-100 hover:bg-sky-200 dark:hover:bg-sky-800/80';
    }
    if (count <= 6) {
      return 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-800/80';
    }
    return 'bg-emerald-600 dark:bg-emerald-600 text-white hover:bg-emerald-700';
  };

  const activeExpandedSprint = expandedCell
    ? sprints.find((s) => s.id === expandedCell.sprintId)
    : null;
  const activeExpandedTickets =
    activeExpandedSprint && expandedCell
      ? getCellTickets(activeExpandedSprint, expandedCell.workstream)
      : [];

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors">
      {/* Section Header & Sub-navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
            <span>Multi-Dimensional SDLC Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>5 Sprints × 8 Workstreams</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Workstream Distribution & Infrastructure Matrix
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Click any column header, sprint row, or heatmap cell to cross-filter tickets and inspect SDLC effort concentration.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SDLC Heatmap (5×8)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('capacity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'capacity'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Capacity vs. Scope</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('infra')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'infra'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AWS & DevOps Matrix (15)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 5x8 SDLC WORKSTREAM HEATMAP */}
      {activeTab === 'matrix' && (
        <div className="mt-5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[190px]">
                    Sprint / Theme
                  </th>
                  {WORKSTREAMS.map((ws) => {
                    const isColSelected = selectedWorkstream === ws;
                    return (
                      <th key={ws} className="py-2 px-1.5 text-center min-w-[100px]">
                        <button
                          type="button"
                          onClick={() =>
                            onSelectWorkstream(isColSelected ? null : ws)
                          }
                          className={`w-full flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-xs font-medium ${
                            isColSelected
                              ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={`Filter by ${ws}`}
                        >
                          <span className="opacity-80">{WORKSTREAM_ICONS[ws]}</span>
                          <span className="leading-tight line-clamp-2 text-[11px]">
                            {ws}
                          </span>
                        </button>
                      </th>
                    );
                  })}
                  <th className="py-3 px-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[90px]">
                    Sprint Load
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {sprints.map((sprint) => {
                  const isRowSelected = selectedSprint === sprint.id;
                  const rowTouches = getSprintTotalWorkstreamTouches(sprint);
                  const completedTickets = sprint.tickets.filter(
                    (t) => t.status === 'Complete'
                  ).length;

                  return (
                    <tr
                      key={sprint.id}
                      className={`transition-colors ${
                        isRowSelected
                          ? 'bg-slate-50 dark:bg-slate-800/50'
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                      }`}
                    >
                      <td className="py-3 px-3 align-middle">
                        <button
                          type="button"
                          onClick={() =>
                            onSelectSprint(isRowSelected ? null : sprint.id)
                          }
                          className="text-left group flex items-start gap-2.5 w-full"
                        >
                          <span
                            className="w-2.5 h-8 rounded-xs shrink-0 mt-0.5"
                            style={{ backgroundColor: sprint.color }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {sprint.id}
                              </span>
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {sprint.shortTheme}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                              {sprint.tickets.length} tickets · {completedTickets}/{sprint.tickets.length} done
                            </div>
                          </div>
                        </button>
                      </td>

                      {WORKSTREAMS.map((ws) => {
                        const cellTickets = getCellTickets(sprint, ws);
                        const count = cellTickets.length;
                        const effort = cellTickets.reduce(
                          (sum, t) => sum + t.effortDays,
                          0
                        );
                        const isCellExpanded =
                          expandedCell?.sprintId === sprint.id &&
                          expandedCell?.workstream === ws;
                        const hasSearchMatch = cellTickets.some((t) =>
                          highlightedTicketIds.has(t.id)
                        );

                        return (
                          <td key={ws} className="p-1.5 text-center align-middle">
                            <button
                              type="button"
                              disabled={count === 0}
                              onClick={() =>
                                setExpandedCell(
                                  isCellExpanded
                                    ? null
                                    : { sprintId: sprint.id, workstream: ws }
                                )
                              }
                              title={
                                count > 0
                                  ? `${sprint.id} × ${ws}: ${count} tickets (~${effort} effort-days). Click to inspect.`
                                  : `No ${ws} tickets in ${sprint.id}`
                              }
                              className={`w-full py-2.5 px-2 rounded-lg transition-all flex flex-col items-center justify-center ${getHeatCellStyle(
                                count,
                                isCellExpanded
                              )} ${
                                hasSearchMatch
                                  ? 'ring-2 ring-amber-500 dark:ring-amber-400'
                                  : ''
                              } ${count === 0 ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              <span className="font-mono text-sm font-semibold tabular-nums">
                                {count === 0 ? '—' : count}
                              </span>
                              {count > 0 && (
                                <span className="text-[10px] opacity-75 tabular-nums">
                                  {effort}d est
                                </span>
                              )}
                            </button>
                          </td>
                        );
                      })}

                      <td className="py-3 px-3 text-right align-middle">
                        <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                          {rowTouches}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                          touches
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40">
                  <td className="py-3 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Total Workstream Load
                  </td>
                  {WORKSTREAMS.map((ws) => {
                    const totalTickets = getWorkstreamTotalTickets(ws);
                    const totalEffort = totalTickets.reduce(
                      (sum, t) => sum + t.effortDays,
                      0
                    );
                    const pct = Math.round(
                      (totalTickets.length / grandTotalTouches) * 100
                    );
                    return (
                      <td key={ws} className="py-3 px-2 text-center">
                        <div className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                          {totalTickets.length}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                          {pct}% · {totalEffort}d
                        </div>
                      </td>
                    );
                  })}
                  <td className="py-3 px-3 text-right">
                    <div className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {grandTotalTouches}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      total touches
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Heat Legend & Active Filter Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span>Concentration Scale:</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-sky-50 dark:bg-sky-950 border border-slate-200 dark:border-slate-700" />
                <span>1–2 Low</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-sky-100 dark:bg-sky-900" />
                <span>3–4 Moderate</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-100 dark:bg-emerald-900" />
                <span>5–6 High</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-600" />
                <span>7+ Peak Concentration</span>
              </span>
            </div>

            {(selectedSprint || selectedWorkstream) && (
              <button
                type="button"
                onClick={() => {
                  onSelectSprint(null);
                  onSelectWorkstream(null);
                }}
                className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Active Matrix Filter</span>
              </button>
            )}
          </div>

          {/* Drill-down Drawer when a cell is clicked */}
          {expandedCell && activeExpandedSprint && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: activeExpandedSprint.color }}
                  />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {activeExpandedSprint.name} ({activeExpandedSprint.shortTheme}) ×{' '}
                    {expandedCell.workstream}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    · {activeExpandedTickets.length} tickets
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedCell(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md"
                  aria-label="Close cell details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeExpandedTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => onSelectTicket(ticket)}
                    className="text-left p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                          {ticket.id}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                          {ticket.status} · {ticket.effortDays}d
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {ticket.title}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Owner: {ticket.owner}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SPRINT CAPACITY VS. SCOPE BALANCE ANALYSIS */}
      {activeTab === 'capacity' && (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {sprints.map((sprint) => {
              const scopedDays = sprint.tickets.reduce(
                (sum, t) => sum + t.effortDays,
                0
              );
              const completedDays = sprint.tickets
                .filter((t) => t.status === 'Complete')
                .reduce((sum, t) => sum + t.effortDays, 0);
              const inProgressDays = sprint.tickets
                .filter((t) => t.status === 'In Progress')
                .reduce((sum, t) => sum + t.effortDays, 0);
              const utilizationPct = Math.round(
                (scopedDays / sprint.capacityPoints) * 100
              );

              // Count Frontend vs Backend vs Database vs Infra
              const feCount = getCellTickets(sprint, 'Frontend').length;
              const beCount = getCellTickets(sprint, 'Backend').length;
              const dbCount = getCellTickets(sprint, 'Database').length;
              const qaCount = getCellTickets(sprint, 'QA/Testing').length;

              return (
                <div
                  key={sprint.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm text-white"
                        style={{ backgroundColor: sprint.color }}
                      >
                        {sprint.id} · {sprint.weeks}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        {utilizationPct}% Load
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                      {sprint.theme}
                    </h3>

                    {/* Capacity vs Scope Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                        <span>Scoped Effort</span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          {scopedDays}d / {sprint.capacityPoints}d cap
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-600 h-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              (completedDays / sprint.capacityPoints) * 100
                            )}%`,
                          }}
                          title={`Completed: ${completedDays}d`}
                        />
                        <div
                          className="bg-amber-500 h-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              (inProgressDays / sprint.capacityPoints) * 100
                            )}%`,
                          }}
                          title={`In Progress: ${inProgressDays}d`}
                        />
                        <div
                          className="bg-sky-500/70 h-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              ((scopedDays - completedDays - inProgressDays) /
                                sprint.capacityPoints) *
                                100
                            )}%`,
                          }}
                          title={`Remaining Scope: ${
                            scopedDays - completedDays - inProgressDays
                          }d`}
                        />
                      </div>
                    </div>

                    {/* Workstream Mini Breakdown */}
                    <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/70 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 tabular-nums">
                        <span>Frontend UI</span>
                        <span className="font-mono font-medium text-slate-900 dark:text-white">
                          {feCount} tickets
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 tabular-nums">
                        <span>Backend Services</span>
                        <span className="font-mono font-medium text-slate-900 dark:text-white">
                          {beCount} tickets
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 tabular-nums">
                        <span>Database & Time-Series</span>
                        <span className="font-mono font-medium text-slate-900 dark:text-white">
                          {dbCount} tickets
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 tabular-nums">
                        <span>QA & Verification</span>
                        <span className="font-mono font-medium text-slate-900 dark:text-white">
                          {qaCount} tickets
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-200/80 dark:border-slate-700/70 text-[11px] text-slate-500 dark:text-slate-400">
                    {sprint.backendServices.length} Backend Services ·{' '}
                    {sprint.infrastructure.length} Infra Tasks
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AWS INFRASTRUCTURE & DEVOPS MATRIX */}
      {activeTab === 'infra' && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-3">Infrastructure / DevOps Component</th>
                <th className="py-3 px-3">Category</th>
                {sprints.map((s) => (
                  <th key={s.id} className="py-3 px-3 text-center font-mono">
                    {s.id} ({s.weeks})
                  </th>
                ))}
                <th className="py-3 px-3 text-right">Sprint Span</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {INFRASTRUCTURE_MATRIX.map((row) => (
                <tr
                  key={row.component}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                    {row.component}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-slate-500 dark:text-slate-400">
                    {row.category}
                  </td>
                  {sprints.map((s) => {
                    const active = row.sprints.includes(s.id);
                    return (
                      <td key={s.id} className="py-2.5 px-3 text-center">
                        {active ? (
                          <span
                            className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold text-white"
                            style={{ backgroundColor: s.color }}
                          >
                            Active
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300 dark:text-slate-700 font-mono">
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-2.5 px-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                    {row.sprints.length} / 5 sprints
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
