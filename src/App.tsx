import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_SPRINTS,
  INITIAL_MILESTONES,
  INITIAL_RISKS,
  INITIAL_DEPENDENCIES,
  WORKSTREAMS,
  BACKEND_SERVICES,
  Ticket,
  Workstream,
  BackendService,
  RiskSeverity,
} from './data/greenBdgData';
import { WorkstreamMatrix } from './components/WorkstreamMatrix';
import { BackendServicesWeb } from './components/BackendServicesWeb';
import { RiskAndDependencyPanel } from './components/RiskAndDependencyPanel';
import { ScopeAndUpdatesPanel } from './components/ScopeAndUpdatesPanel';
import { TicketDetailModal } from './components/Modals';
import {
  Search,
  Sun,
  Moon,
  CircleDot,
  Flag,
  Diamond,
  ArrowRight,
  ArrowLeft,
  Presentation,
  LayoutList,
  ChevronDown,
  ChevronUp,
  X,
  ArrowUpRight,
} from 'lucide-react';

type ChapterId = 'roadmap' | 'architecture' | 'deliverables' | 'governance';

const CHAPTERS: {
  id: ChapterId;
  number: string;
  shortTitle: string;
  fullTitle: string;
  subtitle: string;
}[] = [
  {
    id: 'roadmap',
    number: '01',
    shortTitle: 'Roadmap',
    fullTitle: '01. 10-Week Delivery Roadmap & Contractual Milestones',
    subtitle:
      'Five two-week sprints (2.5 months maximum) aligned with GreenBDG MVP Proposal V1.3 and the Pareto Energy Intelligence Dashboard. Baseline state: Pre-Kickoff · 0% · No Sprint Commenced.',
  },
  {
    id: 'architecture',
    number: '02',
    shortTitle: 'Architecture',
    fullTitle: '02. Backend Microservices & AWS South Africa Stack',
    subtitle:
      '9 core backend microservices and 15 AWS (af-south-1) infrastructure & DevOps components including RDS PostgreSQL / TimescaleDB, S3, API Gateway, WAF, and POPIA controls.',
  },
  {
    id: 'deliverables',
    number: '03',
    shortTitle: 'Deliverables',
    fullTitle: '03. SDLC Workstream Heatmap, Sprint Cards & 35-Ticket Explorer',
    subtitle:
      'Complete breakdown of all 35 baseline tickets (S1-T01 through S5-T09) mapped across 8 SDLC workstreams.',
  },
  {
    id: 'governance',
    number: '04',
    shortTitle: 'Governance',
    fullTitle: '04. Risk Matrix, Stakeholder Dependencies & 2.5-Month Scope Lock',
    subtitle:
      '16 tracked risks, 28 stakeholder inputs, contractual 10-week scope lock classification, and Definition of Done.',
  },
];

export default function App() {
  // Dark mode default, light mode optional
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('greenbdg_once_off_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('greenbdg_once_off_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const sprints = INITIAL_SPRINTS;
  const milestones = INITIAL_MILESTONES;
  const risks = INITIAL_RISKS;
  const dependencies = INITIAL_DEPENDENCIES;

  // Slide Deck Mode vs Full Presentation Scroll
  const [isSlideMode, setIsSlideMode] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<ChapterId>('roadmap');

  // Hovered Sprint in Chapter 01 Gantt Timeline
  const [hoveredGanttSprintId, setHoveredGanttSprintId] =
    useState<string>('S1');

  // Collapsible Sprint Detail Cards in Chapter 03
  const [expandedSprintCards, setExpandedSprintCards] = useState<
    Record<string, boolean>
  >({
    S1: true,
    S2: false,
    S3: false,
    S4: false,
    S5: false,
  });

  // Static Filtering State for Chapter 03 Ticket Explorer & Matrix Cross-Highlighting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
  const [selectedWorkstream, setSelectedWorkstream] =
    useState<Workstream | null>(null);
  const [selectedService, setSelectedService] =
    useState<BackendService | null>(null);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<
    'ALL' | RiskSeverity
  >('ALL');

  // Static Ticket Specification Modal
  const [activeTicketModal, setActiveTicketModal] = useState<Ticket | null>(
    null
  );

  // Keyboard navigation in Slide Deck Mode
  useEffect(() => {
    if (!isSlideMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }
      const idx = CHAPTERS.findIndex((c) => c.id === activeChapter);
      if (e.key === 'ArrowRight' && idx < CHAPTERS.length - 1) {
        setActiveChapter(CHAPTERS[idx + 1].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        setActiveChapter(CHAPTERS[idx - 1].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSlideMode, activeChapter]);

  const allTickets = useMemo(
    () => sprints.flatMap((s) => s.tickets),
    [sprints]
  );

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

  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allTickets.filter((t) => {
      if (selectedSprint && t.sprintId !== selectedSprint) return false;
      if (selectedWorkstream && !t.workstreams.includes(selectedWorkstream))
        return false;
      if (selectedService && !t.backendServices.includes(selectedService))
        return false;
      if (selectedRiskLevel !== 'ALL' && t.riskLevel !== selectedRiskLevel)
        return false;
      if (q && !highlightedTicketIds.has(t.id)) return false;
      return true;
    });
  }, [
    allTickets,
    selectedSprint,
    selectedWorkstream,
    selectedService,
    selectedRiskLevel,
    searchQuery,
    highlightedTicketIds,
  ]);

  const navigateToChapter = (cid: ChapterId) => {
    setActiveChapter(cid);
    if (!isSlideMode) {
      const el = document.getElementById(cid);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentChapterIndex = CHAPTERS.findIndex((c) => c.id === activeChapter);
  const focusedGanttSprint =
    sprints.find((s) => s.id === hoveredGanttSprintId) || sprints[0];

  const fixedHeaderMetrics = [
    { label: 'Sprints', value: '5 Sprints', sub: '2 Weeks Each' },
    { label: 'Duration', value: '10 Weeks', sub: 'Development Time' },
    { label: 'Max Ceiling', value: '2.5 Months', sub: 'Locked Limit' },
    { label: 'Total Scope', value: '35 Tickets', sub: 'S1-T01 to S5-T09' },
    { label: 'SDLC Streams', value: '8 Workstreams', sub: 'Full-Stack & Gov' },
    { label: 'Microservices', value: '9 Services', sub: 'Core Backend' },
    { label: 'AWS & DevOps', value: '15 Components', sub: 'af-south-1 Region' },
    { label: 'Milestones', value: '8 Gates', sub: 'Start to UAT Sign-Off' },
    { label: 'Risk Register', value: '16 Risks', sub: 'Mapped to Tickets' },
    { label: 'Dependencies', value: '28 Inputs', sub: 'Stakeholder Checklist' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors">
      {/* 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 no-print">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single Text Element Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              navigateToChapter('roadmap');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
          >
            GreenBDG
          </a>

          {/* Zone 2: 4 Chapter Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {CHAPTERS.map((chap) => {
              const isCurrent = activeChapter === chap.id;
              return (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => navigateToChapter(chap.id)}
                  className={`transition-colors whitespace-nowrap pb-0.5 cursor-pointer ${
                    isCurrent
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-500'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {chap.number}. {chap.shortTitle}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Slide Deck Toggle & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSlideMode(!isSlideMode)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap border cursor-pointer ${
                isSlideMode
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-900 dark:bg-emerald-600 border-transparent text-white hover:bg-slate-800 dark:hover:bg-emerald-500'
              }`}
            >
              {isSlideMode ? (
                <>
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>Exit Slide Deck</span>
                </>
              ) : (
                <>
                  <Presentation className="w-3.5 h-3.5" />
                  <span>Slide Deck Mode</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle color theme"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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

      {/* Main Presentation Content */}
      <main
        id="top"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-12"
      >
        {/* EXECUTIVE HEADER (Shown on Overview / Slide 1 or Full Scroll) */}
        {(!isSlideMode || activeChapter === 'roadmap') && (
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2.5">
                  <span>GreenBDG MVP Proposal V1.3</span>
                  <span aria-hidden="true">·</span>
                  <span>Pareto Energy Intelligence Dashboard Aligned</span>
                  <span aria-hidden="true">·</span>
                  <span>Once-Off Executive Baseline Presentation</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
                  GreenBDG MVP Sprint Command Center
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Static architectural and SDLC intelligence board explaining the 10-week (2.5-month maximum) MVP delivery plan across 5 sprints, 35 tickets, 8 workstreams, and 9 backend services.
                </p>
              </div>

              {/* Baseline Status Indicator */}
              <div className="self-start lg:self-end shrink-0 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Fixed Baseline State
                </div>
                <div className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  Pre-Kickoff · 0% · No Sprint Commenced
                </div>
              </div>
            </div>

            {/* 10 Fixed Baseline Metrics Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
              {fixedHeaderMetrics.map((m) => (
                <div
                  key={m.label}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800"
                >
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {m.label}
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums truncate">
                    {m.value}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {m.sub}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CHAPTER 01: ROADMAP (10-Week Sprint Timeline Gantt + 8 Contractual Milestones) */}
        {(!isSlideMode || activeChapter === 'roadmap') && (
          <section id="roadmap" className="space-y-6 scroll-mt-24">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {CHAPTERS[0].fullTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {CHAPTERS[0].subtitle}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
              {/* 10-Week Gantt Header Ruler */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  <span>10-Week Sprint Timeline Gantt (Hover or click any sprint block to view its theme and deliverable)</span>
                  <span className="font-mono">Max Delivery Period: 2½ Months</span>
                </div>

                <div className="grid grid-cols-10 gap-1.5 mb-3 text-center">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 tabular-nums"
                    >
                      W{idx + 1}
                    </div>
                  ))}
                </div>

                {/* 5 Color-Coded Sprint Blocks with Milestone Diamonds at Boundaries */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                  {sprints.map((sprint) => {
                    const isFocused = hoveredGanttSprintId === sprint.id;
                    return (
                      <div
                        key={sprint.id}
                        onMouseEnter={() => setHoveredGanttSprintId(sprint.id)}
                        onClick={() => setHoveredGanttSprintId(sprint.id)}
                        className={`relative rounded-xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                          isFocused
                            ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-emerald-500 shadow-sm'
                            : 'bg-slate-50/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-900 dark:text-white'
                        }`}
                      >
                        <div>
                          <div
                            className="h-2 w-full rounded-full mb-3"
                            style={{ backgroundColor: sprint.color }}
                          />
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span
                              className="font-mono font-bold px-2 py-0.5 rounded text-white"
                              style={{ backgroundColor: sprint.color }}
                            >
                              {sprint.id} · {sprint.weeks}
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] opacity-80">
                              <Diamond className="w-3 h-3 fill-current" />
                              <span>M{sprint.number + 1}</span>
                            </span>
                          </div>
                          <h3 className="text-sm font-bold leading-snug mt-1">
                            {sprint.theme}
                          </h3>
                        </div>

                        <div
                          className={`mt-4 pt-2.5 border-t border-slate-200/30 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-mono ${
                            isFocused
                              ? 'text-slate-300'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <span>{sprint.tickets.length} Tickets</span>
                          <span>{sprint.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Focused Sprint Theme & Deliverable Banner */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="font-mono font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: focusedGanttSprint.color }}
                      >
                        {focusedGanttSprint.name} ({focusedGanttSprint.weeks})
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {focusedGanttSprint.theme}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white">
                        Sprint Deliverable:
                      </strong>{' '}
                      {focusedGanttSprint.deliverable}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSprint(focusedGanttSprint.id);
                      navigateToChapter('deliverables');
                    }}
                    className="self-start md:self-center shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <span>Inspect {focusedGanttSprint.id} Deliverables</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Static 8-Milestone Tracker Stepper */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    8 Contractual Delivery Milestones (MVP Start → UAT Sign-Off)
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Baseline Status: Pre-Kickoff · 0% Commenced
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5">
                  {milestones.map((ms) => (
                    <div
                      key={ms.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            0{ms.step} · {ms.sprintBoundary}
                          </span>
                          {ms.iconType === 'diamond' ? (
                            <Diamond className="w-3.5 h-3.5 text-sky-500" />
                          ) : ms.iconType === 'flag' ? (
                            <Flag className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <CircleDot className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {ms.shortName}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          {ms.name}
                        </p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {ms.trigger}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CHAPTER 02: ARCHITECTURE (9-Service Dependency Web + 15 AWS Infrastructure Stack) */}
        {(!isSlideMode || activeChapter === 'architecture') && (
          <section id="architecture" className="space-y-6 scroll-mt-24">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {CHAPTERS[1].fullTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {CHAPTERS[1].subtitle}
              </p>
            </div>

            <BackendServicesWeb
              sprints={sprints}
              selectedService={selectedService}
              selectedSprint={selectedSprint}
              onSelectService={setSelectedService}
              onSelectSprint={setSelectedSprint}
              onSelectTicket={setActiveTicketModal}
            />
          </section>
        )}

        {/* CHAPTER 03: DELIVERABLES (5x8 Workstream Heatmap + Sprint Detail Cards + 35-Ticket Static Explorer) */}
        {(!isSlideMode || activeChapter === 'deliverables') && (
          <section id="deliverables" className="space-y-8 scroll-mt-24">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {CHAPTERS[2].fullTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {CHAPTERS[2].subtitle}
              </p>
            </div>

            {/* 1. 5x8 Workstream Heatmap */}
            <WorkstreamMatrix
              sprints={sprints}
              selectedSprint={selectedSprint}
              selectedWorkstream={selectedWorkstream}
              onSelectSprint={setSelectedSprint}
              onSelectWorkstream={setSelectedWorkstream}
              onSelectTicket={setActiveTicketModal}
              highlightedTicketIds={highlightedTicketIds}
            />

            {/* 2. Collapsible Sprint Detail Cards (S1–S5) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
                    Sprint Scope Specifications
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Sprint Detail Cards (S1–S5)
                  </h3>
                </div>
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
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
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
                    className="text-slate-500 hover:underline font-semibold cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {sprints.map((sprint) => {
                  const isExpanded = !!expandedSprintCards[sprint.id];
                  return (
                    <div
                      key={sprint.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSprintCards((prev) => ({
                            ...prev,
                            [sprint.id]: !prev[sprint.id],
                          }))
                        }
                        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="font-mono text-xs font-bold px-2.5 py-1 rounded text-white shrink-0"
                            style={{ backgroundColor: sprint.color }}
                          >
                            {sprint.id} · {sprint.weeks}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                              {sprint.name} – {sprint.theme}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                            {sprint.tickets.length} Tickets ·{' '}
                            {sprint.backendServices.length} Services
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                          <div className="space-y-2">
                            <div className="font-bold text-slate-900 dark:text-white">
                              Sprint Deliverable & Owner
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                              {sprint.deliverable}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 pt-1">
                              <strong>Owner:</strong> {sprint.owner}
                            </p>
                            <p className="text-emerald-700 dark:text-emerald-400 pt-1">
                              <strong>Sprint DoD:</strong>{' '}
                              {sprint.definitionOfDone}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="font-bold text-slate-900 dark:text-white">
                              Scoped Tickets ({sprint.tickets.length})
                            </div>
                            <div className="space-y-1.5">
                              {sprint.tickets.map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => setActiveTicketModal(t)}
                                  className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                                >
                                  <span>
                                    <strong className="font-mono text-emerald-700 dark:text-emerald-400">
                                      {t.id}
                                    </strong>{' '}
                                    <span className="text-slate-800 dark:text-slate-200">
                                      {t.title}
                                    </span>
                                  </span>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="font-bold text-slate-900 dark:text-white">
                              Architecture & Cloud Scope
                            </div>
                            <div>
                              <span className="text-slate-500 dark:text-slate-400">
                                Backend Services:
                              </span>{' '}
                              <span className="text-slate-800 dark:text-slate-200">
                                {sprint.backendServices.join(' · ')}
                              </span>
                            </div>
                            <div className="pt-1">
                              <span className="text-slate-500 dark:text-slate-400">
                                Infrastructure / DevOps:
                              </span>{' '}
                              <span className="text-slate-800 dark:text-slate-200">
                                {sprint.infrastructure.join(' · ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Static 35-Ticket Explorer */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 tabular-nums">
                    Static Baseline Backlog · Showing {filteredTickets.length} of{' '}
                    {allTickets.length} Tickets
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    35-Ticket Static Explorer (S1-T01 through S5-T09)
                  </h3>
                </div>

                {/* Filters: Sprint, Workstream, Service, Risk + Search */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Filter by Sprint"
                    value={selectedSprint || 'ALL'}
                    onChange={(e) =>
                      setSelectedSprint(
                        e.target.value === 'ALL' ? null : e.target.value
                      )
                    }
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
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
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
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
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="ALL">All 9 Services</option>
                    {BACKEND_SERVICES.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Filter by Risk"
                    value={selectedRiskLevel}
                    onChange={(e) =>
                      setSelectedRiskLevel(
                        e.target.value as 'ALL' | RiskSeverity
                      )
                    }
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="ALL">All Risk Levels</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                  </select>

                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search keyword..."
                      className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Static 8-Column Ticket Table */}
              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3 min-w-[220px]">Title</th>
                      <th className="py-3 px-3">Sprint</th>
                      <th className="py-3 px-3">Workstreams</th>
                      <th className="py-3 px-3">Backend Services</th>
                      <th className="py-3 px-3">Infrastructure</th>
                      <th className="py-3 px-3">Dependencies</th>
                      <th className="py-3 px-3">Risks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                    {filteredTickets.map((t) => {
                      const sp = sprints.find((s) => s.id === t.sprintId);
                      return (
                        <tr
                          key={t.id}
                          onClick={() => setActiveTicketModal(t)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 px-3 align-top font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                            {t.id}
                          </td>
                          <td className="py-3.5 px-3 align-top">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {t.title}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              {t.description}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 align-top whitespace-nowrap">
                            <span
                              className="font-mono text-[11px] font-bold px-2 py-0.5 rounded text-white"
                              style={{
                                backgroundColor: sp?.color || '#3182CE',
                              }}
                            >
                              {t.sprintId}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 align-top text-slate-700 dark:text-slate-300">
                            {t.workstreams.join(' · ')}
                          </td>
                          <td className="py-3.5 px-3 align-top text-slate-600 dark:text-slate-400">
                            {t.backendServices.length > 0
                              ? t.backendServices.join(' · ')
                              : '—'}
                          </td>
                          <td className="py-3.5 px-3 align-top text-slate-600 dark:text-slate-400">
                            {t.infrastructure.join(' · ')}
                          </td>
                          <td className="py-3.5 px-3 align-top text-slate-600 dark:text-slate-400">
                            {t.dependencies.join(' · ')}
                          </td>
                          <td className="py-3.5 px-3 align-top">
                            <span
                              className={`font-semibold ${
                                t.riskLevel === 'High'
                                  ? 'text-red-600 dark:text-red-400'
                                  : t.riskLevel === 'Medium'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {t.riskLevel}:
                            </span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">
                              {t.risks.join(' · ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* CHAPTER 04: GOVERNANCE (16 Risks, 28 Dependencies, Scope Lock Panel & DoD) */}
        {(!isSlideMode || activeChapter === 'governance') && (
          <section id="governance" className="space-y-8 scroll-mt-24">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {CHAPTERS[3].fullTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {CHAPTERS[3].subtitle}
              </p>
            </div>

            <RiskAndDependencyPanel
              sprints={sprints}
              risks={risks}
              dependencies={dependencies}
              selectedSprint={selectedSprint}
              onSelectTicket={setActiveTicketModal}
            />

            <ScopeAndUpdatesPanel />
          </section>
        )}

        {/* Slide Deck Navigation Bar (Active when in Slide Deck Mode) */}
        {isSlideMode && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              disabled={currentChapterIndex === 0}
              onClick={() =>
                navigateToChapter(CHAPTERS[currentChapterIndex - 1].id)
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            {/* Chapter Jump Buttons */}
            <div className="flex items-center gap-1.5">
              {CHAPTERS.map((chap, idx) => (
                <button
                  key={chap.id}
                  type="button"
                  onClick={() => navigateToChapter(chap.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    idx === currentChapterIndex
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {chap.number}. {chap.shortTitle}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentChapterIndex === CHAPTERS.length - 1}
              onClick={() =>
                navigateToChapter(CHAPTERS[currentChapterIndex + 1].id)
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white disabled:opacity-40 hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              <span>Next Slide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Quiet Presentation Footer */}
      <footer className="max-w-[1400px] mx-auto px-6 py-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div>
          GreenBDG MVP Sprint Command Center · Baseline Proposal V1.3 & Pareto Energy Intelligence Dashboard Alignment
        </div>
        <div className="font-mono">
          Pre-Kickoff · 0% · No Sprint Commenced
        </div>
      </footer>

      {/* Static Read-Only Ticket Detail Modal */}
      <TicketDetailModal
        ticket={activeTicketModal}
        sprint={
          activeTicketModal
            ? sprints.find((s) => s.id === activeTicketModal.sprintId)
            : undefined
        }
        onClose={() => setActiveTicketModal(null)}
      />
    </div>
  );
}
