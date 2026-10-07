import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_SPRINTS,
  INITIAL_MILESTONES,
  INITIAL_RISKS,
  INITIAL_DEPENDENCIES,
  INITIAL_PROGRESS_UPDATES,
  INITIAL_SCOPE_CHANGES,
  WORKSTREAMS,
  BACKEND_SERVICES,
  Sprint,
  Ticket,
  TicketStatus,
  Workstream,
  BackendService,
  RiskSeverity,
  DependencyStatus,
  Milestone,
  MilestoneStatus,
  RoleView,
  ProgressUpdate,
  ScopeChangeRequest,
} from './data/greenBdgData';
import { WorkstreamMatrix } from './components/WorkstreamMatrix';
import { BackendServicesWeb } from './components/BackendServicesWeb';
import { RiskAndDependencyPanel } from './components/RiskAndDependencyPanel';
import { ScopeAndUpdatesPanel } from './components/ScopeAndUpdatesPanel';
import { TicketDetailModal, ReadinessReportModal } from './components/Modals';
import {
  Search,
  Sun,
  Moon,
  Play,
  Square,
  RotateCcw,
  FileBarChart2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  CircleDot,
  Flag,
  Diamond,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Eye,
} from 'lucide-react';

export default function App() {
  // Persistent Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('greenbdg_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('greenbdg_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Core State
  const [sprints, setSprints] = useState<Sprint[]>(() => {
    const saved = localStorage.getItem('greenbdg_sprints_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SPRINTS;
      }
    }
    return INITIAL_SPRINTS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [dependencies, setDependencies] = useState(INITIAL_DEPENDENCIES);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>(
    INITIAL_PROGRESS_UPDATES
  );
  const [scopeChanges, setScopeChanges] = useState<ScopeChangeRequest[]>(
    INITIAL_SCOPE_CHANGES
  );

  useEffect(() => {
    localStorage.setItem('greenbdg_sprints_v1', JSON.stringify(sprints));
  }, [sprints]);

  // Role-based view mode (Delivery/Technical, Stakeholder, Executive)
  const [roleView, setRoleView] = useState<RoleView>('Technical');

  // Interactive Cross-Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
  const [selectedWorkstream, setSelectedWorkstream] =
    useState<Workstream | null>(null);
  const [selectedService, setSelectedService] =
    useState<BackendService | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<
    'ALL' | RiskSeverity
  >('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | TicketStatus>(
    'ALL'
  );
  const [ticketSortField, setTicketSortField] = useState<
    'id' | 'effortDays' | 'riskLevel' | 'status'
  >('id');
  const [ticketSortAsc, setTicketSortAsc] = useState<boolean>(true);

  // Modals & Collapsible Sprint Cards
  const [activeTicketModal, setActiveTicketModal] = useState<Ticket | null>(
    null
  );
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [expandedSprintCards, setExpandedSprintCards] = useState<
    Record<string, boolean>
  >({
    S1: true,
    S2: true,
    S3: false,
    S4: false,
    S5: false,
  });

  // Demo Mode Auto-Simulation
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  useEffect(() => {
    if (!demoMode) return;
    const timer = setInterval(() => {
      setDemoStep((prev) => {
        const next = prev >= 5 ? 1 : prev + 1;
        // Update sprints & milestones to simulate advancing through Sprint 1..5
        setSprints((currSprints) =>
          currSprints.map((sp) => {
            if (sp.number < next) {
              return {
                ...sp,
                tickets: sp.tickets.map((t) => ({ ...t, status: 'Complete' })),
              };
            }
            if (sp.number === next) {
              return {
                ...sp,
                tickets: sp.tickets.map((t, idx) => ({
                  ...t,
                  status: idx < 3 ? 'Complete' : 'In Progress',
                })),
              };
            }
            return {
              ...sp,
              tickets: sp.tickets.map((t) => ({ ...t, status: 'Not Started' })),
            };
          })
        );

        setMilestones((currMs) =>
          currMs.map((m) => {
            if (m.sprintBoundary < next) return { ...m, status: 'Complete' };
            if (m.sprintBoundary === next)
              return { ...m, status: 'In Progress' };
            return { ...m, status: 'Pending' };
          })
        );

        return next;
      });
    }, 3200);

    return () => clearInterval(timer);
  }, [demoMode]);

  const handleResetBaseline = () => {
    setDemoMode(false);
    setSprints(INITIAL_SPRINTS);
    setMilestones(INITIAL_MILESTONES);
    setDependencies(INITIAL_DEPENDENCIES);
    setProgressUpdates(INITIAL_PROGRESS_UPDATES);
    setScopeChanges(INITIAL_SCOPE_CHANGES);
    setSelectedSprint(null);
    setSelectedWorkstream(null);
    setSelectedService(null);
    setSearchQuery('');
  };

  // Update individual ticket status or owner
  const handleUpdateTicket = (
    ticketId: string,
    updates: Partial<Pick<Ticket, 'status' | 'owner'>>
  ) => {
    setSprints((prev) =>
      prev.map((sp) => ({
        ...sp,
        tickets: sp.tickets.map((t) =>
          t.id === ticketId ? { ...t, ...updates } : t
        ),
      }))
    );
    if (activeTicketModal && activeTicketModal.id === ticketId) {
      setActiveTicketModal((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  // Update dependency status
  const handleUpdateDependencyStatus = (
    depId: string,
    status: DependencyStatus
  ) => {
    setDependencies((prev) =>
      prev.map((d) => (d.id === depId ? { ...d, status } : d))
    );
  };

  // Cycle milestone status on click
  const handleToggleMilestoneStatus = (id: string) => {
    const order: MilestoneStatus[] = ['Pending', 'In Progress', 'Complete'];
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextIdx = (order.indexOf(m.status) + 1) % order.length;
        return { ...m, status: order[nextIdx] };
      })
    );
  };

  // Compute Executive Metrics
  const allTickets = useMemo(
    () => sprints.flatMap((s) => s.tickets),
    [sprints]
  );
  const completedTicketsCount = useMemo(
    () => allTickets.filter((t) => t.status === 'Complete').length,
    [allTickets]
  );
  const inProgressTicketsCount = useMemo(
    () => allTickets.filter((t) => t.status === 'In Progress').length,
    [allTickets]
  );
  const overallProgressPct = useMemo(
    () =>
      Math.round(
        ((completedTicketsCount + inProgressTicketsCount * 0.4) /
          allTickets.length) *
          100
      ),
    [completedTicketsCount, inProgressTicketsCount, allTickets.length]
  );

  const blockedDepsCount = useMemo(
    () => dependencies.filter((d) => d.status === 'Blocked').length,
    [dependencies]
  );

  const overallRiskStatus: 'Green' | 'Amber' | 'Red' =
    blockedDepsCount >= 4 ? 'Red' : blockedDepsCount >= 1 ? 'Amber' : 'Green';

  // Search matching set for highlighting
  const highlightedTicketIds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return new Set<string>();
    const matched = allTickets.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.workstreams.some((w) => w.toLowerCase().includes(q)) ||
        t.backendServices.some((b) => b.toLowerCase().includes(q)) ||
        t.infrastructure.some((inf) => inf.toLowerCase().includes(q)) ||
        t.dependencies.some((d) => d.toLowerCase().includes(q)) ||
        t.risks.some((r) => r.toLowerCase().includes(q))
    );
    return new Set(matched.map((t) => t.id));
  }, [searchQuery, allTickets]);

  // Filtered and Sorted Tickets for Ticket Explorer
  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allTickets.filter((t) => {
      if (selectedSprint && t.sprintId !== selectedSprint) return false;
      if (selectedWorkstream && !t.workstreams.includes(selectedWorkstream))
        return false;
      if (selectedService && !t.backendServices.includes(selectedService))
        return false;
      if (selectedRiskLevel !== 'ALL' && t.riskLevel !== selectedRiskLevel)
        return false;
      if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
      if (q && !highlightedTicketIds.has(t.id)) return false;
      return true;
    });

    const riskRank: Record<RiskSeverity, number> = {
      High: 3,
      Medium: 2,
      Low: 1,
    };
    const statusRank: Record<TicketStatus, number> = {
      Complete: 3,
      'In Progress': 2,
      'Not Started': 1,
    };

    return [...list].sort((a, b) => {
      let cmp = 0;
      if (ticketSortField === 'id') {
        cmp = a.id.localeCompare(b.id);
      } else if (ticketSortField === 'effortDays') {
        cmp = a.effortDays - b.effortDays;
      } else if (ticketSortField === 'riskLevel') {
        cmp = riskRank[a.riskLevel] - riskRank[b.riskLevel];
      } else if (ticketSortField === 'status') {
        cmp = statusRank[a.status] - statusRank[b.status];
      }
      return ticketSortAsc ? cmp : -cmp;
    });
  }, [
    allTickets,
    selectedSprint,
    selectedWorkstream,
    selectedService,
    selectedRiskLevel,
    selectedStatus,
    searchQuery,
    highlightedTicketIds,
    ticketSortField,
    ticketSortAsc,
  ]);

  const toggleSort = (field: 'id' | 'effortDays' | 'riskLevel' | 'status') => {
    if (ticketSortField === field) {
      setTicketSortAsc(!ticketSortAsc);
    } else {
      setTicketSortField(field);
      setTicketSortAsc(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 no-print">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element Brand Wordmark */}
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
          >
            GreenBDG Command
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a
              href="#timeline"
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Timeline & Milestones
            </a>
            <a
              href="#workstreams"
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Workstream Matrix
            </a>
            {roleView === 'Technical' && (
              <a
                href="#services-web"
                className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
              >
                Services Web
              </a>
            )}
            <a
              href="#risks"
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Risks & Dependencies
            </a>
            {roleView !== 'Executive' && (
              <a
                href="#tickets"
                className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
              >
                Ticket Explorer
              </a>
            )}
            <a
              href="#governance"
              className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Scope & Updates
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                demoMode
                  ? 'bg-amber-600 text-white hover:bg-amber-500'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {demoMode ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Demo (S{demoStep})</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Demo Mode</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 transition-colors whitespace-nowrap"
            >
              <FileBarChart2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export & Readiness</span>
            </button>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Command Center Workspace */}
      <main
        id="top"
        className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6"
      >
        {/* A. EXECUTIVE HEADER BAR & ROLE VIEW SWITCHER */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1.5">
                <span>Baseline: GreenBDG MVP Proposal V1.3</span>
                <span aria-hidden="true">·</span>
                <span>Pareto Energy Intelligence Dashboard Aligned</span>
                <span aria-hidden="true">·</span>
                <span>AWS South Africa (af-south-1)</span>
                <span aria-hidden="true">·</span>
                <span>POPIA & ISO 14001:2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
                GreenBDG MVP Sprint Command Center
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                5 Sprints · 10 Weeks · 2.5 Months Max · Multi-Dimensional SDLC Workstream & Architecture Intelligence
              </p>
            </div>

            {/* Global Search & Role-Based Lens Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Global Search Input */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search water balance, AWS, POPIA, EPC..."
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Role-Based View Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <span className="px-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline-flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>Lens:</span>
                </span>
                {(
                  [
                    { id: 'Technical', label: 'Delivery / Tech' },
                    { id: 'Stakeholder', label: 'Stakeholder' },
                    { id: 'Executive', label: 'Executive' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRoleView(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                      roleView === tab.id
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleResetBaseline}
                title="Reset all simulated statuses to baseline"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Metrics Tiles (Tabular Numerals) */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Total Sprints
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 tabular-nums">
                5 Sprints
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                2 weeks per sprint
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Total MVP Tickets
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 tabular-nums">
                {allTickets.length} Tickets
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                S1-T01 through S5-T09
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Development Horizon
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 tabular-nums">
                10 Weeks
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                Max Allowed: 2.5 Months
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Architecture Scope
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 tabular-nums">
                9 Services
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                8 Workstreams · 15 Infra
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Current Progress
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
                {overallProgressPct}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                {completedTicketsCount} Done · {inProgressTicketsCount} Active
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Overall Risk Posture
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-3 h-3 rounded-full ${
                    overallRiskStatus === 'Green'
                      ? 'bg-emerald-500'
                      : overallRiskStatus === 'Amber'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {overallRiskStatus}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                {blockedDepsCount} Blocked Inputs · 16 Risks
              </div>
            </div>
          </div>

          {searchQuery && (
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                Global Search Active for "{searchQuery}" — Matching{' '}
                {highlightedTicketIds.size} of {allTickets.length} tickets across
                all matrices
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        {/* B & H. SPRINT TIMELINE VISUAL (10-WEEK GANTT) & MILESTONE TRACKER */}
        <section
          id="timeline"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                <span>10-Week Master Delivery Schedule</span>
                <span aria-hidden="true">·</span>
                <span>2.5 Months Maximum Delivery Period</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Gantt Sprint Timeline & Delivery Milestone Tracker
              </h2>
            </div>

            {selectedSprint && (
              <button
                type="button"
                onClick={() => setSelectedSprint(null)}
                className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
                <span>Showing {selectedSprint} Only — Show All 5 Sprints</span>
              </button>
            )}
          </div>

          {/* 10-Week Horizontal Timeline Grid */}
          <div className="mt-5">
            {/* Week Ruler (Weeks 1 to 10) */}
            <div className="grid grid-cols-10 gap-1 mb-2 text-center">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div
                  key={idx}
                  className="py-1 rounded bg-slate-100 dark:bg-slate-800/70 text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 tabular-nums"
                >
                  Week {idx + 1}
                </div>
              ))}
            </div>

            {/* 5 Sprint Blocks (Each 2 Weeks Wide) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
              {sprints.map((sprint) => {
                const isSelected = selectedSprint === sprint.id;
                const doneCount = sprint.tickets.filter(
                  (t) => t.status === 'Complete'
                ).length;
                const inProgCount = sprint.tickets.filter(
                  (t) => t.status === 'In Progress'
                ).length;
                const pct = Math.round(
                  ((doneCount + inProgCount * 0.4) / sprint.tickets.length) *
                    100
                );

                return (
                  <div
                    key={sprint.id}
                    onClick={() =>
                      setSelectedSprint(isSelected ? null : sprint.id)
                    }
                    className={`group relative rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'ring-2 ring-slate-900 dark:ring-white bg-slate-50 dark:bg-slate-800/70 border-transparent'
                        : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    {/* Top color bar */}
                    <div
                      className="h-1.5 w-full rounded-full mb-3"
                      style={{ backgroundColor: sprint.color }}
                    />

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span
                          className="font-mono font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: sprint.color }}
                        >
                          {sprint.id} · {sprint.weeks}
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
                          {pct}%
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                        {sprint.theme}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {sprint.deliverable}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/70">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5 tabular-nums">
                        <span>{sprint.tickets.length} Tickets</span>
                        <span>
                          {doneCount}/{sprint.tickets.length} Complete
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: sprint.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* H. Delivery Milestone Stepper (8 Milestones from Section 12) */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Section 12 Delivery Milestones (Click any milestone to toggle status)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                {milestones.filter((m) => m.status === 'Complete').length} /{' '}
                {milestones.length} Milestones Complete
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5">
              {milestones.map((ms) => {
                const isDone = ms.status === 'Complete';
                const isInProg = ms.status === 'In Progress';

                return (
                  <button
                    key={ms.id}
                    type="button"
                    onClick={() => handleToggleMilestoneStatus(ms.id)}
                    className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                      isDone
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80'
                        : isInProg
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80'
                        : 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {ms.targetDate}
                        </span>
                        {ms.iconType === 'diamond' ? (
                          <Diamond
                            className={`w-3.5 h-3.5 ${
                              isDone
                                ? 'text-emerald-600 fill-emerald-600'
                                : isInProg
                                ? 'text-amber-500'
                                : 'text-slate-400'
                            }`}
                          />
                        ) : ms.iconType === 'flag' ? (
                          <Flag
                            className={`w-3.5 h-3.5 ${
                              isDone
                                ? 'text-emerald-600 fill-emerald-600'
                                : 'text-slate-400'
                            }`}
                          />
                        ) : (
                          <CircleDot
                            className={`w-3.5 h-3.5 ${
                              isDone
                                ? 'text-emerald-600'
                                : isInProg
                                ? 'text-amber-500'
                                : 'text-slate-400'
                            }`}
                          />
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                        {ms.name}
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px]">
                      <span
                        className={`font-semibold ${
                          isDone
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : isInProg
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {ms.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* C. WORKSTREAM DISTRIBUTION BOARD */}
        <div id="workstreams">
          <WorkstreamMatrix
            sprints={sprints}
            selectedSprint={selectedSprint}
            selectedWorkstream={selectedWorkstream}
            onSelectSprint={setSelectedSprint}
            onSelectWorkstream={setSelectedWorkstream}
            onSelectTicket={setActiveTicketModal}
            highlightedTicketIds={highlightedTicketIds}
          />
        </div>

        {/* D. BACKEND SERVICES DEPENDENCY WEB (Shown in Technical & Stakeholder Views) */}
        {roleView !== 'Executive' && (
          <div id="services-web">
            <BackendServicesWeb
              sprints={sprints}
              selectedService={selectedService}
              selectedSprint={selectedSprint}
              onSelectService={setSelectedService}
              onSelectSprint={setSelectedSprint}
              onSelectTicket={setActiveTicketModal}
            />
          </div>
        )}

        {/* F. RISK & DEPENDENCY HEATMAP */}
        <div id="risks">
          <RiskAndDependencyPanel
            sprints={sprints}
            risks={INITIAL_RISKS}
            dependencies={dependencies}
            selectedSprint={selectedSprint}
            onUpdateDependencyStatus={handleUpdateDependencyStatus}
            onSelectTicket={setActiveTicketModal}
          />
        </div>

        {/* E. TICKET EXPLORER PANEL (Shown in Technical & Stakeholder Views) */}
        {roleView !== 'Executive' && (
          <section
            id="tickets"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Granular SDLC Backlog Explorer</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    Showing {filteredTickets.length} of {allTickets.length} Tickets
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Interactive Ticket Explorer (S1-T01 through S5-T09)
                </h2>
              </div>

              {/* Multi-Dimensional Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Filter by Sprint"
                  value={selectedSprint || 'ALL'}
                  onChange={(e) =>
                    setSelectedSprint(
                      e.target.value === 'ALL' ? null : e.target.value
                    )
                  }
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Sprints (S1–S5)</option>
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id}: {s.shortTheme}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter by Workstream"
                  value={selectedWorkstream || 'ALL'}
                  onChange={(e) =>
                    setSelectedWorkstream(
                      e.target.value === 'ALL'
                        ? null
                        : (e.target.value as Workstream)
                    )
                  }
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All 8 Workstreams</option>
                  {WORKSTREAMS.map((ws) => (
                    <option key={ws} value={ws}>
                      {ws}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter by Backend Service"
                  value={selectedService || 'ALL'}
                  onChange={(e) =>
                    setSelectedService(
                      e.target.value === 'ALL'
                        ? null
                        : (e.target.value as BackendService)
                    )
                  }
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All 9 Backend Services</option>
                  {BACKEND_SERVICES.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filter by Risk Level"
                  value={selectedRiskLevel}
                  onChange={(e) =>
                    setSelectedRiskLevel(
                      e.target.value as 'ALL' | RiskSeverity
                    )
                  }
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Risk Levels</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>

                <select
                  aria-label="Filter by Status"
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as 'ALL' | TicketStatus)
                  }
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Complete">Complete</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>
            </div>

            {/* High-Density Data Grid */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => toggleSort('id')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                      >
                        <span>Ticket ID</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3 px-3 min-w-[240px]">Title & Summary</th>
                    <th className="py-3 px-3">Workstreams</th>
                    <th className="py-3 px-3">Backend Services</th>
                    <th className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => toggleSort('riskLevel')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                      >
                        <span>Risk</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort('effortDays')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                      >
                        <span>Effort</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3 px-3">Owner</th>
                    <th className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => toggleSort('status')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                      >
                        <span>Status</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-8 text-center text-slate-500 dark:text-slate-400"
                      >
                        No tickets match the current filter combination.{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSprint(null);
                            setSelectedWorkstream(null);
                            setSelectedService(null);
                            setSelectedRiskLevel('ALL');
                            setSelectedStatus('ALL');
                            setSearchQuery('');
                          }}
                          className="text-emerald-600 underline ml-1"
                        >
                          Reset all filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => {
                      const sp = sprints.find((s) => s.id === t.sprintId);
                      return (
                        <tr
                          key={t.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-3 align-top whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setActiveTicketModal(t)}
                              className="font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor: sp?.color || '#3182CE',
                                }}
                              />
                              <span>{t.id}</span>
                            </button>
                          </td>
                          <td className="py-3 px-3 align-top">
                            <button
                              type="button"
                              onClick={() => setActiveTicketModal(t)}
                              className="text-left group"
                            >
                              <div className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {t.title}
                              </div>
                              <div className="text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {t.description}
                              </div>
                            </button>
                          </td>
                          <td className="py-3 px-3 align-top text-slate-600 dark:text-slate-300">
                            {t.workstreams.join(' · ')}
                          </td>
                          <td className="py-3 px-3 align-top text-slate-600 dark:text-slate-400">
                            {t.backendServices.length > 0
                              ? t.backendServices.join(' · ')
                              : 'Infra / Core'}
                          </td>
                          <td className="py-3 px-3 align-top whitespace-nowrap">
                            <span
                              className={`font-medium ${
                                t.riskLevel === 'High'
                                  ? 'text-red-600 dark:text-red-400'
                                  : t.riskLevel === 'Medium'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {t.riskLevel}
                            </span>
                          </td>
                          <td className="py-3 px-3 align-top text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                            {t.effortDays}d
                          </td>
                          <td className="py-3 px-3 align-top text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {t.owner}
                          </td>
                          <td className="py-3 px-3 align-top">
                            <select
                              aria-label={`Status for ${t.id}`}
                              value={t.status}
                              onChange={(e) =>
                                handleUpdateTicket(t.id, {
                                  status: e.target.value as TicketStatus,
                                })
                              }
                              className={`text-xs font-semibold rounded-md px-2 py-1 border cursor-pointer ${
                                t.status === 'Complete'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                                  : t.status === 'In Progress'
                                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Complete">Complete</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* G. SPRINT DETAIL CARDS (COLLAPSIBLE) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Sprint-by-Sprint Execution Blueprints (S1–S5)
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() =>
                  setExpandedSprintCards({
                    S1: true,
                    S2: true,
                    S3: true,
                    S4: true,
                    S5: true,
                  })
                }
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-medium"
              >
                Expand All
              </button>
              <span aria-hidden="true" className="text-slate-400">
                ·
              </span>
              <button
                type="button"
                onClick={() =>
                  setExpandedSprintCards({
                    S1: false,
                    S2: false,
                    S3: false,
                    S4: false,
                    S5: false,
                  })
                }
                className="text-slate-500 hover:underline font-medium"
              >
                Collapse All
              </button>
            </div>
          </div>

          {sprints.map((sprint) => {
            const isExpanded = !!expandedSprintCards[sprint.id];
            const doneCount = sprint.tickets.filter(
              (t) => t.status === 'Complete'
            ).length;

            return (
              <div
                key={sprint.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSprintCards((prev) => ({
                      ...prev,
                      [sprint.id]: !prev[sprint.id],
                    }))
                  }
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="font-mono text-xs font-bold px-2.5 py-1 rounded text-white shrink-0"
                      style={{ backgroundColor: sprint.color }}
                    >
                      {sprint.id} · {sprint.duration}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {sprint.name} – {sprint.theme}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Deliverable: {sprint.deliverable}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums hidden sm:inline">
                      {doneCount}/{sprint.tickets.length} Tickets Done
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-4 text-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Tickets in Sprint */}
                      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                        <div className="font-semibold text-slate-900 dark:text-white mb-2">
                          Use Cases / Tickets ({sprint.tickets.length})
                        </div>
                        <div className="space-y-2">
                          {sprint.tickets.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setActiveTicketModal(t)}
                              className="w-full text-left flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-colors"
                            >
                              <div>
                                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                  {t.id}
                                </span>{' '}
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {t.title}
                                </span>
                              </div>
                              <span className="font-mono text-[10px] text-slate-500 shrink-0 tabular-nums">
                                {t.status}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Services & Infrastructure */}
                      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-3">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white mb-1">
                            Backend Services Touched ({sprint.backendServices.length})
                          </div>
                          <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {sprint.backendServices.join(' · ')}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="font-semibold text-slate-900 dark:text-white mb-1">
                            Infrastructure / DevOps ({sprint.infrastructure.length})
                          </div>
                          <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                            {sprint.infrastructure.map((inf, idx) => (
                              <li key={idx}>{inf}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="font-semibold text-slate-900 dark:text-white mb-0.5">
                            Sprint Owner
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">
                            {sprint.owner}
                          </div>
                        </div>
                      </div>

                      {/* Dependencies, Risks & DoD */}
                      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-3">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white mb-1">
                            Dependencies / Inputs Needed
                          </div>
                          <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                            {sprint.dependencies.map((d, idx) => (
                              <li key={idx}>{d}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
                            Key Sprint Risks
                          </div>
                          <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                            {sprint.risks.map((r, idx) => (
                              <li key={idx}>{r}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-0.5">
                            Definition of Done
                          </div>
                          <div className="text-slate-600 dark:text-slate-300">
                            {sprint.definitionOfDone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* I & J. PROGRESS UPDATE FEED, SCOPE CONTROL SIMULATOR & PM BENCHMARK */}
        <div id="governance">
          <ScopeAndUpdatesPanel
            progressUpdates={progressUpdates}
            scopeChanges={scopeChanges}
            onAddProgressUpdate={(u) =>
              setProgressUpdates((prev) => [u, ...prev])
            }
            onAddScopeChange={(c) => setScopeChanges((prev) => [c, ...prev])}
          />
        </div>
      </main>

      {/* Clean Quiet Footer */}
      <footer className="max-w-[1440px] mx-auto px-6 py-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div>
          GreenBDG MVP Sprint Command Center · Baseline Proposal V1.3 & Pareto Energy Intelligence Alignment
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="hover:text-slate-900 dark:hover:text-white underline"
          >
            Generate Sprint Readiness Report
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={handleResetBaseline}
            className="hover:text-slate-900 dark:hover:text-white underline"
          >
            Reset Simulation Data
          </button>
        </div>
      </footer>

      {/* Modals */}
      <TicketDetailModal
        ticket={activeTicketModal}
        sprint={
          activeTicketModal
            ? sprints.find((s) => s.id === activeTicketModal.sprintId)
            : undefined
        }
        onClose={() => setActiveTicketModal(null)}
        onUpdateTicket={handleUpdateTicket}
      />

      <ReadinessReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        sprints={sprints}
        risks={INITIAL_RISKS}
        dependencies={dependencies}
      />
    </div>
  );
}
