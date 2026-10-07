import React, { useState } from 'react';
import {
  Sprint,
  Ticket,
  BackendService,
  BACKEND_SERVICES,
  INFRASTRUCTURE_MATRIX,
} from '../data/greenBdgData';
import {
  Server,
  Cloud,
  Database,
  Shield,
  X,
  ArrowUpRight,
} from 'lucide-react';

interface BackendServicesWebProps {
  sprints: Sprint[];
  selectedService: BackendService | null;
  selectedSprint: string | null;
  onSelectService: (service: BackendService | null) => void;
  onSelectSprint: (sprintId: string | null) => void;
  onSelectTicket: (ticket: Ticket) => void;
}

export const BackendServicesWeb: React.FC<BackendServicesWebProps> = ({
  sprints,
  selectedService,
  selectedSprint,
  onSelectService,
  onSelectSprint,
  onSelectTicket,
}) => {
  const [hoveredService, setHoveredService] = useState<BackendService | null>(
    null
  );
  const [hoveredSprint, setHoveredSprint] = useState<string | null>(null);

  const activeService = hoveredService || selectedService;
  const activeSprint = hoveredSprint || selectedSprint;

  const serviceMetrics = BACKEND_SERVICES.map((service) => {
    const touchingSprints = sprints.filter((s) =>
      s.backendServices.includes(service)
    );
    const touchingTickets = sprints.flatMap((s) =>
      s.tickets.filter((t) => t.backendServices.includes(service))
    );
    return {
      service,
      touchingSprints,
      touchingTickets,
      sprintCount: touchingSprints.length,
      ticketCount: touchingTickets.length,
    };
  });

  const svgWidth = 780;
  const svgHeight = 430;
  const leftX = 140;
  const rightX = 600;

  const sprintNodes = sprints.map((sprint, idx) => ({
    ...sprint,
    x: leftX,
    y: 65 + idx * 76,
  }));

  const serviceNodes = serviceMetrics.map((sm, idx) => ({
    ...sm,
    x: rightX,
    y: 42 + idx * 43.5,
    radius: 12 + sm.sprintCount * 2.2,
  }));

  const inspectedTickets = sprints.flatMap((s) =>
    s.tickets.filter((t) => {
      if (activeService && !t.backendServices.includes(activeService))
        return false;
      if (activeSprint && t.sprintId !== activeSprint) return false;
      return activeService || activeSprint
        ? true
        : t.backendServices.length >= 4;
    })
  );

  return (
    <div className="space-y-8">
      {/* 1. 9-Service Backend Dependency Web */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              Microservice Architecture Topology
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              9-Service Backend Dependency Web
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Sprint 1 establishes the foundations for all 9 backend microservices; Sprints 2–5 extend each service across role workflows, energy intelligence, and UAT integration. Hover or click any node to inspect related tickets.
            </p>
          </div>

          {(selectedService || selectedSprint) && (
            <button
              type="button"
              onClick={() => {
                onSelectService(null);
                onSelectSprint(null);
              }}
              className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Graph Focus</span>
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Interactive Static Network Graph */}
          <div className="xl:col-span-7 bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[540px] select-none"
              role="img"
              aria-label="Backend Services Dependency Web"
            >
              <text
                x={leftX}
                y={22}
                textAnchor="middle"
                className="fill-slate-500 dark:fill-slate-400 text-[11px] font-semibold"
              >
                5 Delivery Sprints (S1–S5)
              </text>
              <text
                x={rightX}
                y={20}
                textAnchor="middle"
                className="fill-slate-500 dark:fill-slate-400 text-[11px] font-semibold"
              >
                9 Core Backend Microservices
              </text>

              {sprintNodes.map((sNode) =>
                serviceNodes.map((srvNode) => {
                  const isConnected = sNode.backendServices.includes(
                    srvNode.service
                  );
                  if (!isConnected) return null;

                  const isHighlighted =
                    (!activeService && !activeSprint) ||
                    activeService === srvNode.service ||
                    activeSprint === sNode.id;

                  const isDirectlyFocused =
                    activeService === srvNode.service ||
                    activeSprint === sNode.id;

                  const pathD = `M ${sNode.x + 48} ${sNode.y} C ${
                    (sNode.x + srvNode.x) / 2
                  } ${sNode.y}, ${(sNode.x + srvNode.x) / 2} ${srvNode.y}, ${
                    srvNode.x - srvNode.radius - 6
                  } ${srvNode.y}`;

                  return (
                    <path
                      key={`${sNode.id}-${srvNode.service}`}
                      d={pathD}
                      fill="none"
                      stroke={sNode.color}
                      strokeWidth={isDirectlyFocused ? 2.6 : 1.5}
                      strokeOpacity={
                        isHighlighted ? (isDirectlyFocused ? 0.9 : 0.45) : 0.08
                      }
                      className="transition-all duration-150"
                    />
                  );
                })
              )}

              {sprintNodes.map((sNode) => {
                const isSelected = selectedSprint === sNode.id;
                const isActive =
                  !activeService ||
                  sNode.backendServices.includes(activeService);

                return (
                  <g
                    key={sNode.id}
                    transform={`translate(${sNode.x}, ${sNode.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSprint(sNode.id)}
                    onMouseLeave={() => setHoveredSprint(null)}
                    onClick={() =>
                      onSelectSprint(
                        selectedSprint === sNode.id ? null : sNode.id
                      )
                    }
                  >
                    <rect
                      x={-115}
                      y={-22}
                      width={162}
                      height={44}
                      rx={10}
                      fill={isSelected ? sNode.color : '#1A365D'}
                      fillOpacity={isActive ? 1 : 0.3}
                      stroke={sNode.color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <text
                      x={-100}
                      y={-3}
                      className="fill-white text-[12px] font-bold font-mono"
                    >
                      {sNode.id} · {sNode.shortTheme}
                    </text>
                    <text
                      x={-100}
                      y={13}
                      className="fill-slate-300 text-[10px] font-mono"
                    >
                      {sNode.backendServices.length}/9 services · {sNode.weeks}
                    </text>
                  </g>
                );
              })}

              {serviceNodes.map((srvNode) => {
                const isSelected = selectedService === srvNode.service;
                const isHovered = hoveredService === srvNode.service;
                const isConnectedToActiveSprint =
                  !activeSprint ||
                  srvNode.touchingSprints.some((s) => s.id === activeSprint);

                return (
                  <g
                    key={srvNode.service}
                    transform={`translate(${srvNode.x}, ${srvNode.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredService(srvNode.service)}
                    onMouseLeave={() => setHoveredService(null)}
                    onClick={() =>
                      onSelectService(
                        selectedService === srvNode.service
                          ? null
                          : srvNode.service
                      )
                    }
                  >
                    <circle
                      cx={0}
                      cy={0}
                      r={srvNode.radius}
                      fill={
                        isSelected || isHovered
                          ? '#38A169'
                          : isConnectedToActiveSprint
                          ? '#1A365D'
                          : '#64748B'
                      }
                      fillOpacity={isConnectedToActiveSprint ? 0.95 : 0.25}
                      stroke={isSelected || isHovered ? '#10B981' : '#38A169'}
                      strokeWidth={isSelected || isHovered ? 3 : 1.5}
                    />
                    <text
                      x={0}
                      y={4}
                      textAnchor="middle"
                      className="fill-white text-[11px] font-mono font-bold"
                    >
                      {srvNode.sprintCount}S
                    </text>
                    <text
                      x={srvNode.radius + 12}
                      y={-2}
                      className={`text-[12px] font-semibold ${
                        isSelected || isHovered
                          ? 'fill-emerald-600 dark:fill-emerald-400 font-bold'
                          : isConnectedToActiveSprint
                          ? 'fill-slate-900 dark:fill-slate-100'
                          : 'fill-slate-400 dark:fill-slate-600'
                      }`}
                    >
                      {srvNode.service}
                    </text>
                    <text
                      x={srvNode.radius + 12}
                      y={12}
                      className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono"
                    >
                      {srvNode.touchingSprints.map((s) => s.id).join(', ')} ·{' '}
                      {srvNode.ticketCount} tickets
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Service Nodes Summary & Related Tickets */}
          <div className="xl:col-span-5 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-2">
              {serviceMetrics.map((sm) => {
                const isSelected = selectedService === sm.service;
                return (
                  <button
                    key={sm.service}
                    type="button"
                    onClick={() =>
                      onSelectService(isSelected ? null : sm.service)
                    }
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">
                      {sm.service}
                    </div>
                    <div
                      className={`text-[10px] font-mono mt-0.5 tabular-nums ${
                        isSelected
                          ? 'text-emerald-100'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {sm.touchingSprints.map((s) => s.id).join(' · ')}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeService
                      ? `Tickets Touching ${activeService}`
                      : activeSprint
                      ? `Service Tickets in ${activeSprint}`
                      : 'Multi-Service Integration Tickets'}
                  </h4>
                </div>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {inspectedTickets.length} tickets
                </span>
              </div>

              <div className="space-y-2 max-h-[245px] overflow-y-auto pr-1">
                {inspectedTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => onSelectTicket(ticket)}
                    className="w-full text-left p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500 transition-colors flex items-start justify-between gap-2 group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {ticket.id}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                          {ticket.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {ticket.backendServices.join(' · ') || 'Infrastructure'}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AWS af-south-1 Infrastructure Stack & 15-Component Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            Cloud & Data Foundation · AWS South Africa (af-south-1)
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            AWS Infrastructure Stack & 15 DevOps Components
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Unified AWS technology foundation supporting the GreenBDG MVP and Pareto Energy Intelligence Dashboard without disconnected third-party stacks.
          </p>
        </div>

        {/* 3 Core Architectural Pillars Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              <Cloud className="w-4 h-4 text-sky-500" />
              <span>AWS Landing Zone (af-south-1)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Provisioned in the South Africa (Cape Town) region with S3 object storage for CSV/XLSX utility batches and document evidence, routed via API Gateway.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>RDS PostgreSQL & TimescaleDB</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Combines relational building, staff, and ESG asset persistence with TimescaleDB hypertables for multi-period energy trends, water balance, fuel reconciliation, and smart-meter readiness.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              <Shield className="w-4 h-4 text-amber-500" />
              <span>WAF, Monitoring & POPIA / ISO Controls</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Protected by AWS WAF, role-based access (Admin, Portfolio Manager, Facility Manager), POPIA data privacy controls, and ISO 14001:2026 environmental record traceability.
            </p>
          </div>
        </div>

        {/* 15 Infrastructure / DevOps Components Matrix */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-3">Infrastructure / DevOps Component</th>
                <th className="py-3 px-3">Architectural Role</th>
                {sprints.map((s) => (
                  <th key={s.id} className="py-3 px-3 text-center font-mono">
                    {s.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {INFRASTRUCTURE_MATRIX.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {row.component}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {row.architecturalRole}
                  </td>
                  {sprints.map((s) => {
                    const active = row.sprints.includes(s.id);
                    return (
                      <td key={s.id} className="py-3 px-2.5 text-center">
                        {active ? (
                          <span
                            className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-mono font-bold text-white"
                            style={{ backgroundColor: s.color }}
                          >
                            {s.id}
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700 font-mono">
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
