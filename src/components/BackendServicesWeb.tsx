import React, { useState } from 'react';
import {
  Sprint,
  Ticket,
  BackendService,
  BACKEND_SERVICES,
} from '../data/greenBdgData';
import { Server, X, ArrowUpRight } from 'lucide-react';

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
  const [hoveredService, setHoveredService] = useState<BackendService | null>(null);
  const [hoveredSprint, setHoveredSprint] = useState<string | null>(null);

  const activeService = hoveredService || selectedService;
  const activeSprint = hoveredSprint || selectedSprint;

  // Compute service stats
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

  // SVG Layout coordinates (800 x 440)
  const svgWidth = 780;
  const svgHeight = 440;
  const leftX = 140;
  const rightX = 610;

  const sprintNodes = sprints.map((sprint, idx) => {
    const y = 65 + idx * 78;
    return { ...sprint, x: leftX, y };
  });

  const serviceNodes = serviceMetrics.map((sm, idx) => {
    const y = 42 + idx * 44.5;
    const radius = 12 + sm.sprintCount * 2.2;
    return { ...sm, x: rightX, y, radius };
  });

  // Determine tickets to show in inspector panel
  const inspectedTickets = sprints.flatMap((s) =>
    s.tickets.filter((t) => {
      if (activeService && !t.backendServices.includes(activeService)) return false;
      if (activeSprint && t.sprintId !== activeSprint) return false;
      return activeService || activeSprint ? true : t.backendServices.length >= 4;
    })
  );

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
            <span>Microservice Architecture Topology</span>
            <span aria-hidden="true">·</span>
            <span>9 Core Services × 5 Sprints</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Backend Services Dependency Web
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Node radius reflects cross-sprint touch frequency. Hover or click any service node to trace sprint edges and ticket dependencies.
          </p>
        </div>

        {(selectedService || selectedSprint) && (
          <button
            type="button"
            onClick={() => {
              onSelectService(null);
              onSelectSprint(null);
            }}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Service Selection</span>
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Interactive SVG Network Graph */}
        <div className="xl:col-span-7 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[540px] select-none"
            role="img"
            aria-label="Backend Services Dependency Web"
          >
            {/* Column Headers inside SVG */}
            <text
              x={leftX}
              y={24}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[11px] font-semibold"
            >
              Delivery Sprints (S1–S5)
            </text>
            <text
              x={rightX}
              y={20}
              textAnchor="middle"
              className="fill-slate-500 dark:fill-slate-400 text-[11px] font-semibold"
            >
              9 Backend Services (Sized by Sprint Frequency)
            </text>

            {/* Edges connecting Sprints to Services */}
            {sprintNodes.map((sNode) =>
              serviceNodes.map((srvNode) => {
                const isConnected = sNode.backendServices.includes(srvNode.service);
                if (!isConnected) return null;

                const isHighlighted =
                  (!activeService && !activeSprint) ||
                  activeService === srvNode.service ||
                  activeSprint === sNode.id;

                const isDirectlyFocused =
                  activeService === srvNode.service || activeSprint === sNode.id;

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
                    strokeOpacity={isHighlighted ? (isDirectlyFocused ? 0.9 : 0.45) : 0.08}
                    className="transition-all duration-150"
                  />
                );
              })
            )}

            {/* Sprint Nodes (Left column) */}
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
                    onSelectSprint(selectedSprint === sNode.id ? null : sNode.id)
                  }
                >
                  <rect
                    x={-115}
                    y={-22}
                    width={162}
                    height={44}
                    rx={8}
                    fill={isSelected ? sNode.color : '#1E293B'}
                    fillOpacity={isActive ? 1 : 0.3}
                    stroke={sNode.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <text
                    x={-102}
                    y={-4}
                    className="fill-white text-[12px] font-bold font-mono"
                  >
                    {sNode.id} · {sNode.shortTheme}
                  </text>
                  <text
                    x={-102}
                    y={12}
                    className="fill-slate-300 text-[10px] font-mono"
                  >
                    {sNode.backendServices.length}/9 services · {sNode.weeks}
                  </text>
                </g>
              );
            })}

            {/* Backend Service Nodes (Right column) */}
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
                      selectedService === srvNode.service ? null : srvNode.service
                    )
                  }
                >
                  <circle
                    cx={0}
                    cy={0}
                    r={srvNode.radius}
                    fill={
                      isSelected || isHovered
                        ? '#10B981'
                        : isConnectedToActiveSprint
                        ? '#0F172A'
                        : '#475569'
                    }
                    fillOpacity={isConnectedToActiveSprint ? 0.95 : 0.25}
                    stroke={isSelected || isHovered ? '#059669' : '#38A169'}
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

                  {/* Service Label & Sprint Dots */}
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

        {/* Right 5 cols: Service Matrix & Ticket Touch Inspector */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          {/* Quick Service Selector Buttons */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center justify-between">
              <span>Backend Service Touch Frequency</span>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                Click to isolate
              </span>
            </div>
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
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-semibold truncate">
                      {sm.service}
                    </div>
                    <div
                      className={`text-[10px] font-mono mt-0.5 tabular-nums ${
                        isSelected
                          ? 'text-emerald-100'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {sm.sprintCount} sprints · {sm.ticketCount} tix
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ticket Dependency Drill-down */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {activeService
                    ? `Tickets Touching ${activeService}`
                    : activeSprint
                    ? `Service Tickets in ${activeSprint}`
                    : 'High-Coupling Multi-Service Tickets'}
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {inspectedTickets.length} tickets
              </span>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {inspectedTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => onSelectTicket(ticket)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex items-start justify-between gap-2 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        {ticket.id}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white truncate">
                        {ticket.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Services: {ticket.backendServices.join(' · ') || 'None'}
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
