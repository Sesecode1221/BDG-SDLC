import React, { useState } from 'react';
import {
  Sprint,
  Ticket,
  TicketStatus,
  RiskItem,
  DependencyItem,
  WORKSTREAMS,
} from '../data/greenBdgData';
import {
  X,
  CheckCircle2,
  Download,
  Printer,
  FileSpreadsheet,
  ShieldCheck,
  Server,
  Cloud,
  AlertTriangle,
  Link2,
} from 'lucide-react';

interface TicketModalProps {
  ticket: Ticket | null;
  sprint: Sprint | undefined;
  onClose: () => void;
  onUpdateTicket: (
    ticketId: string,
    updates: Partial<Pick<Ticket, 'status' | 'owner'>>
  ) => void;
}

export const TicketDetailModal: React.FC<TicketModalProps> = ({
  ticket,
  sprint,
  onClose,
  onUpdateTicket,
}) => {
  if (!ticket || !sprint) return null;

  const dodItems = [
    'Agreed functionality has been implemented',
    'Code has been reviewed and merged',
    'Required testing has been completed',
    'Functionality has been deployed to Dev',
    'Acceptance criteria have been met',
    'Functionality can be demonstrated',
    'Known issues are documented',
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1">
              <span
                className="font-mono font-bold px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: sprint.color }}
              >
                {ticket.id}
              </span>
              <span className="font-medium text-slate-600 dark:text-slate-400">
                {sprint.name} · {sprint.theme}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {ticket.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5 text-sm">
          {/* Editable Status and Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Execution Status
              </label>
              <select
                value={ticket.status}
                onChange={(e) =>
                  onUpdateTicket(ticket.id, {
                    status: e.target.value as TicketStatus,
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Assigned Role / Owner
              </label>
              <input
                type="text"
                value={ticket.owner}
                onChange={(e) =>
                  onUpdateTicket(ticket.id, { owner: e.target.value })
                }
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Estimated Effort & Risk
              </label>
              <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white py-1.5">
                {ticket.effortDays} Effort-Days · {ticket.riskLevel} Risk
              </div>
            </div>
          </div>

          {/* Description & Sub-bullets */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Scope & Requirement Summary
            </h3>
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
              {ticket.description}
            </p>
            {ticket.details && ticket.details.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                {ticket.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>

          {/* SDLC Workstreams, Backend Services, Infrastructure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                SDLC Workstreams
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {ticket.workstreams.join(' · ')}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-600" />
                <span>Backend Services</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {ticket.backendServices.length > 0
                  ? ticket.backendServices.join(' · ')
                  : 'Infrastructure / Non-Service'}
              </div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-sky-600" />
                <span>AWS / Infrastructure</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {ticket.infrastructure.join(' · ')}
              </div>
            </div>
          </div>

          {/* Dependencies & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Required Inputs / Dependencies</span>
              </div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                {ticket.dependencies.map((dep, i) => (
                  <li key={i}>{dep}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Associated Sprint Risks</span>
              </div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                {ticket.risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 9 Universal Definition of Done */}
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50">
            <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Section 9 Definition of Done (Every Sprint Item)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-300">
              {dodItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      ticket.status === 'Complete'
                        ? 'bg-emerald-600'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReadinessReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprints: Sprint[];
  risks: RiskItem[];
  dependencies: DependencyItem[];
}

export const ReadinessReportModal: React.FC<ReadinessReportModalProps> = ({
  isOpen,
  onClose,
  sprints,
  risks,
  dependencies,
}) => {
  const [selectedSprintId, setSelectedSprintId] = useState<string>('ALL');

  if (!isOpen) return null;

  const downloadCsv = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportWorkstreamCsv = () => {
    const headers = ['Sprint', 'Theme', ...WORKSTREAMS, 'Total Touches'];
    const rows = sprints.map((s) => {
      const counts = WORKSTREAMS.map(
        (ws) => s.tickets.filter((t) => t.workstreams.includes(ws)).length
      );
      const total = counts.reduce((a, b) => a + b, 0);
      return [
        s.id,
        `"${s.theme}"`,
        ...counts.map(String),
        String(total),
      ].join(',');
    });
    downloadCsv(
      'GreenBDG_MVP_Workstream_Distribution.csv',
      [headers.join(','), ...rows].join('\n')
    );
  };

  const handleExportRiskRegisterCsv = () => {
    const headers = [
      'Risk ID',
      'Sprint',
      'Risk Title',
      'Likelihood',
      'Impact',
      'Affected Tickets',
      'Owner',
      'Mitigation Strategy',
    ];
    const rows = risks.map((r) =>
      [
        r.id,
        r.sprintId,
        `"${r.title}"`,
        r.likelihood,
        r.impact,
        `"${r.affectedTickets.join('; ')}"`,
        `"${r.owner}"`,
        `"${r.mitigation}"`,
      ].join(',')
    );
    downloadCsv(
      'GreenBDG_MVP_Risk_Register.csv',
      [headers.join(','), ...rows].join('\n')
    );
  };

  const handleExportTicketsCsv = () => {
    const headers = [
      'Ticket ID',
      'Sprint',
      'Title',
      'Status',
      'Effort Days',
      'Risk Level',
      'Owner',
      'Workstreams',
      'Backend Services',
      'Infrastructure',
    ];
    const rows = sprints.flatMap((s) =>
      s.tickets.map((t) =>
        [
          t.id,
          t.sprintId,
          `"${t.title}"`,
          t.status,
          String(t.effortDays),
          t.riskLevel,
          `"${t.owner}"`,
          `"${t.workstreams.join('; ')}"`,
          `"${t.backendServices.join('; ')}"`,
          `"${t.infrastructure.join('; ')}"`,
        ].join(',')
      )
    );
    downloadCsv(
      'GreenBDG_MVP_Full_Sprint_Plan.csv',
      [headers.join(','), ...rows].join('\n')
    );
  };

  const targetSprints =
    selectedSprintId === 'ALL'
      ? sprints
      : sprints.filter((s) => s.id === selectedSprintId);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Executive Export & Readiness Center</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              GreenBDG MVP Sprint Readiness Report & Data Exports
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Action Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportWorkstreamCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Workstream Matrix (CSV)</span>
            </button>
            <button
              type="button"
              onClick={handleExportRiskRegisterCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>Export Risk Register (CSV)</span>
            </button>
            <button
              type="button"
              onClick={handleExportTicketsCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Export Full 35-Ticket Plan (CSV)</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF Report</span>
          </button>
        </div>

        {/* Sprint Selector for Readiness Assessment */}
        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Select Sprint Readiness Scope:
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['ALL', 'S1', 'S2', 'S3', 'S4', 'S5'] as const).map((sid) => (
              <button
                key={sid}
                type="button"
                onClick={() => setSelectedSprintId(sid)}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-colors ${
                  selectedSprintId === sid
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {sid}
              </button>
            ))}
          </div>
        </div>

        {/* Readiness Report Content */}
        <div className="mt-4 space-y-4">
          {targetSprints.map((s) => {
            const doneCount = s.tickets.filter(
              (t) => t.status === 'Complete'
            ).length;
            const inProgCount = s.tickets.filter(
              (t) => t.status === 'In Progress'
            ).length;
            const sprintDeps = dependencies.filter((d) => d.sprintId === s.id);
            const metDeps = sprintDeps.filter((d) => d.status === 'Met').length;
            const blockedDeps = sprintDeps.filter(
              (d) => d.status === 'Blocked'
            ).length;
            const sprintRisks = risks.filter((r) => r.sprintId === s.id);

            const readinessScore = Math.round(
              (doneCount / s.tickets.length) * 50 +
                (metDeps / Math.max(1, sprintDeps.length)) * 50
            );

            return (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.id} · {s.weeks}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {s.theme}
                    </h3>
                  </div>
                  <div className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    Readiness Index: {readinessScore}%
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Deliverable:</strong> {s.deliverable}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <div className="text-slate-500 dark:text-slate-400">
                      Ticket Execution
                    </div>
                    <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                      {doneCount} Done · {inProgCount} Active ·{' '}
                      {s.tickets.length} Total
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <div className="text-slate-500 dark:text-slate-400">
                      Stakeholder Inputs
                    </div>
                    <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                      {metDeps}/{sprintDeps.length} Met ({blockedDeps} Blocked)
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <div className="text-slate-500 dark:text-slate-400">
                      Active Risks & Services
                    </div>
                    <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                      {sprintRisks.length} Risks · {s.backendServices.length}{' '}
                      Services
                    </div>
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
