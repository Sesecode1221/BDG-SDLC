import React, { useState } from 'react';
import {
  Sprint,
  Ticket,
  Workstream,
  WORKSTREAMS,
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
  Frontend: <Monitor className="w-4 h-4" />,
  Backend: <Server className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  'Infrastructure/DevOps': <Cloud className="w-4 h-4" />,
  'QA/Testing': <CheckCircle2 className="w-4 h-4" />,
  'Security/Compliance': <Shield className="w-4 h-4" />,
  Documentation: <FileText className="w-4 h-4" />,
  'Stakeholder Management': <Users className="w-4 h-4" />,
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
  const [expandedCell, setExpandedCell] = useState<{
    sprintId: string;
    workstream: Workstream;
  } | null>(null);

  const getCellTickets = (sprint: Sprint, ws: Workstream): Ticket[] =>
    sprint.tickets.filter((t) => t.workstreams.includes(ws));

  const getWorkstreamTotalTickets = (ws: Workstream): Ticket[] =>
    sprints.flatMap((s) => getCellTickets(s, ws));

  const getSprintTotalWorkstreamTouches = (sprint: Sprint): number =>
    WORKSTREAMS.reduce((acc, ws) => acc + getCellTickets(sprint, ws).length, 0);

  const grandTotalTouches = sprints.reduce(
    (acc, s) => acc + getSprintTotalWorkstreamTouches(s),
    0
  );

  const getHeatCellStyle = (count: number, isSelected: boolean) => {
    if (isSelected) {
      return 'ring-2 ring-emerald-500 bg-emerald-600 text-white font-bold shadow-xs';
    }
    if (count === 0) {
      return 'bg-slate-50/70 dark:bg-slate-900/40 text-slate-300 dark:text-slate-700';
    }
    if (count <= 2) {
      return 'bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900/70';
    }
    if (count <= 4) {
      return 'bg-sky-100 dark:bg-sky-900/60 text-sky-950 dark:text-sky-100 hover:bg-sky-200 dark:hover:bg-sky-800/80';
    }
    if (count <= 6) {
      return 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-100 hover:bg-emerald-200';
    }
    return 'bg-emerald-600 text-white hover:bg-emerald-500';
  };

  const activeExpandedSprint = expandedCell
    ? sprints.find((s) => s.id === expandedCell.sprintId)
    : null;
  const activeExpandedTickets =
    activeExpandedSprint && expandedCell
      ? getCellTickets(activeExpandedSprint, expandedCell.workstream)
      : [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            Multi-Dimensional SDLC Workload Distribution
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            5×8 SDLC Workstream Heatmap
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Every baseline ticket is categorized across the 8 SDLC workstreams. Click any column header, sprint row, or heatmap cell to highlight and filter affected tickets.
          </p>
        </div>

        {(selectedSprint || selectedWorkstream || expandedCell) && (
          <button
            type="button"
            onClick={() => {
              onSelectSprint(null);
              onSelectWorkstream(null);
              setExpandedCell(null);
            }}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Heatmap Selection</span>
          </button>
        )}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[200px]">
                Sprint (2 Weeks Each)
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
                      className={`w-full flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-colors text-xs font-medium cursor-pointer ${
                        isColSelected
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="opacity-85">{WORKSTREAM_ICONS[ws]}</span>
                      <span className="leading-tight line-clamp-2 text-[11px]">
                        {ws}
                      </span>
                    </button>
                  </th>
                );
              })}
              <th className="py-3 px-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-[100px]">
                Sprint Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {sprints.map((sprint) => {
              const isRowSelected = selectedSprint === sprint.id;
              const rowTouches = getSprintTotalWorkstreamTouches(sprint);

              return (
                <tr
                  key={sprint.id}
                  className={`transition-colors ${
                    isRowSelected
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/25'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/20'
                  }`}
                >
                  <td className="py-3.5 px-3 align-middle">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectSprint(isRowSelected ? null : sprint.id)
                      }
                      className="text-left group flex items-center gap-3 w-full cursor-pointer"
                    >
                      <span
                        className="w-3 h-9 rounded-xs shrink-0"
                        style={{ backgroundColor: sprint.color }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {sprint.id}
                          </span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {sprint.shortTheme}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                          {sprint.weeks} · {sprint.tickets.length} tickets
                        </div>
                      </div>
                    </button>
                  </td>

                  {WORKSTREAMS.map((ws) => {
                    const cellTickets = getCellTickets(sprint, ws);
                    const count = cellTickets.length;
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
                          onClick={() => {
                            if (isCellExpanded) {
                              setExpandedCell(null);
                            } else {
                              setExpandedCell({
                                sprintId: sprint.id,
                                workstream: ws,
                              });
                            }
                          }}
                          className={`w-full py-3 px-2 rounded-xl transition-all flex flex-col items-center justify-center ${getHeatCellStyle(
                            count,
                            isCellExpanded
                          )} ${
                            hasSearchMatch ? 'ring-2 ring-amber-500' : ''
                          } ${count === 0 ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className="font-mono text-sm font-bold tabular-nums">
                            {count === 0 ? '—' : count}
                          </span>
                          {count > 0 && (
                            <span className="text-[10px] opacity-75 tabular-nums">
                              {count === 1 ? 'ticket' : 'tickets'}
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}

                  <td className="py-3.5 px-3 text-right align-middle">
                    <div className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      {rowTouches}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      touches
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40">
              <td className="py-3.5 px-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                Total Workstream Load
              </td>
              {WORKSTREAMS.map((ws) => {
                const totalTickets = getWorkstreamTotalTickets(ws);
                const pct = Math.round(
                  (totalTickets.length / grandTotalTouches) * 100
                );
                return (
                  <td key={ws} className="py-3.5 px-2 text-center">
                    <div className="font-mono text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      {totalTickets.length}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {pct}%
                    </div>
                  </td>
                );
              })}
              <td className="py-3.5 px-3 text-right">
                <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
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

      {/* Cell Drill-down Drawer */}
      {expandedCell && activeExpandedSprint && (
        <div className="mt-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeExpandedSprint.color }}
              />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeExpandedSprint.name} ({activeExpandedSprint.shortTheme}) ×{' '}
                {expandedCell.workstream} ({activeExpandedTickets.length} Tickets)
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setExpandedCell(null)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md"
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
                className="text-left p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {ticket.id}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {ticket.riskLevel} Risk
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {ticket.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Inspect Baseline Scope</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
