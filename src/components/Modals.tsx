import React from 'react';
import {
  Sprint,
  Ticket,
} from '../data/greenBdgData';
import {
  X,
  Server,
  Cloud,
  AlertTriangle,
  Link2,
  CheckCircle2,
} from 'lucide-react';

interface TicketModalProps {
  ticket: Ticket | null;
  sprint: Sprint | undefined;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketModalProps> = ({
  ticket,
  sprint,
  onClose,
}) => {
  if (!ticket || !sprint) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1.5">
              <span
                className="font-mono font-bold px-2.5 py-0.5 rounded text-white"
                style={{ backgroundColor: sprint.color }}
              >
                {ticket.id}
              </span>
              <span className="font-medium text-slate-600 dark:text-slate-400">
                {sprint.name} ({sprint.weeks}) · {sprint.theme}
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

        <div className="mt-5 space-y-5 text-sm">
          {/* Baseline Metadata Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">
                Baseline State:
              </span>{' '}
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                Pre-Kickoff · 0% · No Sprint Commenced
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">
                Risk Profile:
              </span>{' '}
              <span
                className={`font-semibold ${
                  ticket.riskLevel === 'High'
                    ? 'text-red-600 dark:text-red-400'
                    : ticket.riskLevel === 'Medium'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {ticket.riskLevel}
              </span>
            </div>
          </div>

          {/* Description & Sub-bullets */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Baseline Requirement Summary
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
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                SDLC Workstreams
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {ticket.workstreams.join(' · ')}
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-600" />
                <span>Backend Services</span>
              </div>
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {ticket.backendServices.length > 0
                  ? ticket.backendServices.join(' · ')
                  : 'Cloud / Core Infrastructure'}
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
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
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dependencies / Inputs Needed</span>
              </div>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                {ticket.dependencies.map((dep, i) => (
                  <li key={i}>{dep}</li>
                ))}
              </ul>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
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

          {/* Sprint Definition of Done */}
          <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 text-xs">
            <div className="font-semibold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{sprint.name} Definition of Done</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              {sprint.definitionOfDone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
