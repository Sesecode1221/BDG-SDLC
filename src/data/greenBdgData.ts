export type Workstream =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Infrastructure/DevOps'
  | 'QA/Testing'
  | 'Security/Compliance'
  | 'Documentation'
  | 'Stakeholder Management';

export type BackendService =
  | 'Authentication'
  | 'Customer Data'
  | 'BatchData'
  | 'Document'
  | 'Fault'
  | 'Asset'
  | 'Workflow'
  | 'Channel'
  | 'Report';

export type TicketStatus = 'Not Started' | 'In Progress' | 'Complete';
export type RiskSeverity = 'Low' | 'Medium' | 'High';
export type DependencyStatus = 'Met' | 'Pending' | 'Blocked';
export type MilestoneStatus = 'Pending' | 'In Progress' | 'Complete';
export type RoleView = 'Technical' | 'Stakeholder' | 'Executive';

export interface Ticket {
  id: string;
  sprintId: string;
  title: string;
  description: string;
  details?: string[];
  workstreams: Workstream[];
  backendServices: BackendService[];
  infrastructure: string[];
  dependencies: string[];
  risks: string[];
  riskLevel: RiskSeverity;
  effortDays: number;
  status: TicketStatus;
  owner: string;
}

export interface RiskItem {
  id: string;
  sprintId: string;
  title: string;
  likelihood: RiskSeverity;
  impact: RiskSeverity;
  affectedTickets: string[];
  mitigation: string;
  owner: string;
}

export interface DependencyItem {
  id: string;
  sprintId: string;
  name: string;
  status: DependencyStatus;
  stakeholder: string;
  affectedTickets: string[];
}

export interface Sprint {
  id: string;
  number: number;
  name: string;
  theme: string;
  shortTheme: string;
  duration: string;
  weeks: string;
  startWeek: number;
  endWeek: number;
  dateRange: string;
  color: string;
  tickets: Ticket[];
  backendServices: BackendService[];
  infrastructure: string[];
  deliverable: string;
  owner: string;
  dependencies: string[];
  risks: string[];
  definitionOfDone: string;
  capacityPoints: number;
}

export interface Milestone {
  id: string;
  name: string;
  trigger: string;
  sprintBoundary: number; // 0 = start S1, 1 = end S1, ..., 5 = end S5, 6 = UAT start, 7 = UAT sign-off
  weekNumber: number;
  targetDate: string;
  status: MilestoneStatus;
  iconType: 'circle' | 'diamond' | 'flag';
}

export interface ProgressUpdate {
  id: string;
  sprintAndDay: string;
  timestamp: string;
  completedSinceLast: string[];
  inProgress: string[];
  plannedBeforeNext: string[];
  blockersAndDecisions: string[];
  riskStatus: 'Green' | 'Amber' | 'Red';
  riskExplanation: string;
  demoLinkOrNotes: string;
}

export interface ScopeChangeRequest {
  id: string;
  title: string;
  requestedBy: string;
  date: string;
  classification: 'Already Included in MVP' | 'Approved MVP Change' | 'Future-Phase Requirement';
  estimatedDaysImpact: number;
  targetSprint: string;
  rationale: string;
}

export interface InfraMatrixRow {
  component: string;
  category: string;
  sprints: string[];
  description: string;
}

export const WORKSTREAMS: Workstream[] = [
  'Frontend',
  'Backend',
  'Database',
  'Infrastructure/DevOps',
  'QA/Testing',
  'Security/Compliance',
  'Documentation',
  'Stakeholder Management',
];

export const BACKEND_SERVICES: BackendService[] = [
  'Authentication',
  'Customer Data',
  'BatchData',
  'Document',
  'Fault',
  'Asset',
  'Workflow',
  'Channel',
  'Report',
];

export const INFRASTRUCTURE_MATRIX: {
  component: string;
  sprints: string[];
  category: string;
}[] = [
  { component: 'AWS Landing Zone – South Africa region', sprints: ['S1'], category: 'Cloud Foundation' },
  { component: 'RDS PostgreSQL / TimescaleDB', sprints: ['S1', 'S5'], category: 'Database Engine' },
  { component: 'S3 Object Storage & Upload Processing', sprints: ['S1', 'S2', 'S3', 'S4', 'S5'], category: 'Storage' },
  { component: 'API Gateway', sprints: ['S1', 'S3', 'S4', 'S5'], category: 'Networking & API' },
  { component: 'WAF (Web Application Firewall)', sprints: ['S1', 'S3', 'S4', 'S5'], category: 'Security' },
  { component: 'Development Environment', sprints: ['S1'], category: 'Environment' },
  { component: 'Security and POPIA Controls', sprints: ['S1', 'S2', 'S5'], category: 'Compliance' },
  { component: 'Monitoring, Logging and Alerting', sprints: ['S2', 'S3', 'S4', 'S5'], category: 'Observability' },
  { component: 'File Processing Pipeline', sprints: ['S2'], category: 'Data Pipeline' },
  { component: 'Database Persistence Layer', sprints: ['S2'], category: 'Database Engine' },
  { component: 'Database Data Processing', sprints: ['S3', 'S4'], category: 'Data Pipeline' },
  { component: 'AWS Application Environment', sprints: ['S4'], category: 'Environment' },
  { component: 'AWS Production-Readiness Checks', sprints: ['S5'], category: 'Release Readiness' },
  { component: 'Deployment and Environment Checks', sprints: ['S5'], category: 'CI/CD & DevOps' },
  { component: 'UAT Environment', sprints: ['S5'], category: 'Environment' },
];

export const INITIAL_SPRINTS: Sprint[] = [
  {
    id: 'S1',
    number: 1,
    name: 'Sprint 1',
    theme: 'Foundation, Authentication and AWS Setup',
    shortTheme: 'Foundation',
    duration: '2 weeks',
    weeks: 'Weeks 1–2',
    startWeek: 1,
    endWeek: 2,
    dateRange: 'Weeks 1–2 (Days 1–10)',
    color: '#3182CE',
    capacityPoints: 30,
    backendServices: [
      'Authentication',
      'Customer Data',
      'BatchData',
      'Document',
      'Fault',
      'Asset',
      'Workflow',
      'Channel',
      'Report',
    ],
    infrastructure: [
      'AWS Landing Zone – South Africa region',
      'RDS PostgreSQL / TimescaleDB',
      'S3',
      'API Gateway',
      'WAF',
      'Development environment',
      'Initial security and POPIA controls',
    ],
    deliverable:
      'A working platform foundation with authentication, user roles, database, AWS environment and backend service structure.',
    owner: 'Delivery/Technical Team, with required stakeholder decisions and approvals.',
    dependencies: [
      'Approved MVP Proposal V1.3',
      'AWS account/access',
      'Required domain/environment information',
      'Initial business/user information',
    ],
    risks: [
      'AWS access not available on time',
      'Database architecture decision delayed',
      'Unclear requirements or business rules',
    ],
    definitionOfDone:
      'Code is implemented, reviewed, merged, tested, deployed to Dev and demonstrated successfully.',
    tickets: [
      {
        id: 'S1-T01',
        sprintId: 'S1',
        title: 'MVP Requirements and Technical Foundation',
        description:
          'Confirm the approved MVP requirements and establish the application foundation against GreenBDG MVP Proposal V1.3.',
        workstreams: ['Documentation', 'Stakeholder Management', 'Frontend', 'Backend'],
        backendServices: ['Workflow'],
        infrastructure: ['Development environment'],
        dependencies: ['Approved MVP Proposal V1.3', 'Initial business/user information'],
        risks: ['Unclear requirements or business rules'],
        riskLevel: 'Medium',
        effortDays: 4,
        status: 'Complete',
        owner: 'Lead Architect / PM',
      },
      {
        id: 'S1-T02',
        sprintId: 'S1',
        title: 'Authentication and Onboarding Foundation',
        description:
          'Implement authentication and the role structure for Admin, Portfolio Manager, and Facility Manager.',
        details: ['Admin role structure', 'Portfolio Manager role structure', 'Facility Manager role structure'],
        workstreams: ['Frontend', 'Backend', 'Security/Compliance'],
        backendServices: ['Authentication', 'Customer Data'],
        infrastructure: ['API Gateway', 'WAF', 'Initial security and POPIA controls'],
        dependencies: ['Approved MVP Proposal V1.3', 'Initial business/user information'],
        risks: ['Unclear requirements or business rules'],
        riskLevel: 'Medium',
        effortDays: 5,
        status: 'Complete',
        owner: 'Full-Stack Security Lead',
      },
      {
        id: 'S1-T03',
        sprintId: 'S1',
        title: 'Admin First-Time Setup Foundation',
        description: 'Establish the initial Administrator setup workflow and foundational onboarding states.',
        workstreams: ['Frontend', 'Backend'],
        backendServices: ['Authentication', 'Customer Data', 'Workflow'],
        infrastructure: ['Development environment'],
        dependencies: ['Initial business/user information'],
        risks: ['Unclear requirements or business rules'],
        riskLevel: 'Low',
        effortDays: 4,
        status: 'Complete',
        owner: 'Frontend / Workflow Engineer',
      },
      {
        id: 'S1-T04',
        sprintId: 'S1',
        title: 'AWS Infrastructure Foundation',
        description:
          'Establish the AWS Landing Zone in the South Africa region (af-south-1) and the core application infrastructure.',
        workstreams: ['Infrastructure/DevOps', 'Security/Compliance'],
        backendServices: [],
        infrastructure: [
          'AWS Landing Zone – South Africa region',
          'S3',
          'API Gateway',
          'WAF',
          'Development environment',
          'Initial security and POPIA controls',
        ],
        dependencies: ['AWS account/access', 'Required domain/environment information'],
        risks: ['AWS access not available on time'],
        riskLevel: 'High',
        effortDays: 6,
        status: 'Complete',
        owner: 'Cloud / DevOps Architect',
      },
      {
        id: 'S1-T05',
        sprintId: 'S1',
        title: 'Database Foundation',
        description:
          'Establish the RDS PostgreSQL database and confirm the TimescaleDB approach required for time-series data.',
        workstreams: ['Database', 'Infrastructure/DevOps'],
        backendServices: ['Customer Data', 'BatchData'],
        infrastructure: ['RDS PostgreSQL / TimescaleDB', 'Initial security and POPIA controls'],
        dependencies: ['AWS account/access', 'Approved MVP Proposal V1.3'],
        risks: ['Database architecture decision delayed', 'AWS access not available on time'],
        riskLevel: 'High',
        effortDays: 5,
        status: 'In Progress',
        owner: 'Database / Data Engineer',
      },
      {
        id: 'S1-T06',
        sprintId: 'S1',
        title: 'Backend Service Foundation',
        description:
          'Establish the foundations, API contracts, and service skeletons for all 9 required backend services.',
        workstreams: ['Backend', 'Infrastructure/DevOps', 'Documentation'],
        backendServices: [
          'Authentication',
          'Customer Data',
          'BatchData',
          'Document',
          'Fault',
          'Asset',
          'Workflow',
          'Channel',
          'Report',
        ],
        infrastructure: ['API Gateway', 'Development environment'],
        dependencies: ['Approved MVP Proposal V1.3', 'AWS account/access'],
        risks: ['Database architecture decision delayed'],
        riskLevel: 'Medium',
        effortDays: 6,
        status: 'In Progress',
        owner: 'Backend Systems Lead',
      },
    ],
  },
  {
    id: 'S2',
    number: 2,
    name: 'Sprint 2',
    theme: 'Administration, Building, Staff and Data Management',
    shortTheme: 'Administration',
    duration: '2 weeks',
    weeks: 'Weeks 3–4',
    startWeek: 3,
    endWeek: 4,
    dateRange: 'Weeks 3–4 (Days 11–20)',
    color: '#38A169',
    capacityPoints: 30,
    backendServices: ['Customer Data', 'BatchData', 'Document', 'Workflow', 'Channel'],
    infrastructure: [
      'S3 upload processing',
      'Database persistence',
      'File processing',
      'Logging and monitoring',
      'Security controls',
    ],
    deliverable:
      'The Administrator can set up the platform, manage buildings and staff, upload data and manage documents.',
    owner: 'Delivery/Technical Team, with stakeholder input where required.',
    dependencies: [
      'Building data',
      'Staff data',
      'Test data',
      'Required document examples',
      'Data-upload templates',
    ],
    risks: [
      'Poor or incomplete source data',
      'Upload requirements not clearly defined',
      'Missing test data',
    ],
    definitionOfDone:
      'Code is implemented, merged, tested, deployed to Dev and demonstrated using representative data.',
    tickets: [
      {
        id: 'S2-T01',
        sprintId: 'S2',
        title: 'Admin First-Time Setup',
        description: 'Complete the Administrator setup workflow end-to-end with organization configuration.',
        workstreams: ['Frontend', 'Backend', 'QA/Testing'],
        backendServices: ['Customer Data', 'Workflow', 'Channel'],
        infrastructure: ['Database persistence', 'Security controls'],
        dependencies: ['Staff data'],
        risks: ['Upload requirements not clearly defined'],
        riskLevel: 'Low',
        effortDays: 4,
        status: 'Not Started',
        owner: 'Frontend / Backend Engineer',
      },
      {
        id: 'S2-T02',
        sprintId: 'S2',
        title: 'Building Management',
        description: 'Implement building creation, management and required facility metadata information.',
        workstreams: ['Frontend', 'Backend', 'Database'],
        backendServices: ['Customer Data', 'Workflow'],
        infrastructure: ['Database persistence', 'Logging and monitoring'],
        dependencies: ['Building data'],
        risks: ['Poor or incomplete source data'],
        riskLevel: 'Medium',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Full-Stack Engineer',
      },
      {
        id: 'S2-T03',
        sprintId: 'S2',
        title: 'Staff Upload and Management',
        description: 'Implement staff/user bulk upload, role assignment, and directory management.',
        workstreams: ['Frontend', 'Backend', 'Security/Compliance'],
        backendServices: ['Customer Data', 'BatchData', 'Channel'],
        infrastructure: ['File processing', 'Database persistence', 'Security controls'],
        dependencies: ['Staff data', 'Data-upload templates'],
        risks: ['Poor or incomplete source data'],
        riskLevel: 'Medium',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Backend / Platform Engineer',
      },
      {
        id: 'S2-T04',
        sprintId: 'S2',
        title: 'Data Upload Processing',
        description: 'Implement CSV/XLSX upload, schema validation, error reporting, and batch processing.',
        workstreams: ['Frontend', 'Backend', 'Database', 'QA/Testing'],
        backendServices: ['BatchData', 'Customer Data', 'Workflow'],
        infrastructure: ['S3 upload processing', 'File processing', 'Logging and monitoring'],
        dependencies: ['Data-upload templates', 'Test data'],
        risks: ['Upload requirements not clearly defined', 'Missing test data'],
        riskLevel: 'High',
        effortDays: 6,
        status: 'Not Started',
        owner: 'Data Pipeline Engineer',
      },
      {
        id: 'S2-T05',
        sprintId: 'S2',
        title: 'Document Management',
        description: 'Implement document upload, secure S3 storage, metadata tagging, and retrieval.',
        workstreams: ['Frontend', 'Backend', 'Infrastructure/DevOps', 'Security/Compliance'],
        backendServices: ['Document', 'Workflow'],
        infrastructure: ['S3 upload processing', 'Security controls', 'Logging and monitoring'],
        dependencies: ['Required document examples'],
        risks: ['Upload requirements not clearly defined'],
        riskLevel: 'Low',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Backend / Cloud Engineer',
      },
      {
        id: 'S2-T06',
        sprintId: 'S2',
        title: 'Data Persistence',
        description: 'Ensure uploaded and created data is permanently stored and indexed in the platform database.',
        workstreams: ['Database', 'Backend', 'QA/Testing'],
        backendServices: ['Customer Data', 'BatchData', 'Document'],
        infrastructure: ['Database persistence', 'Logging and monitoring'],
        dependencies: ['Building data', 'Test data'],
        risks: ['Poor or incomplete source data', 'Missing test data'],
        riskLevel: 'Medium',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Database Engineer',
      },
    ],
  },
  {
    id: 'S3',
    number: 3,
    name: 'Sprint 3',
    theme: 'Portfolio Manager and Facility Manager',
    shortTheme: 'User Workflows',
    duration: '2 weeks',
    weeks: 'Weeks 5–6',
    startWeek: 5,
    endWeek: 6,
    dateRange: 'Weeks 5–6 (Days 21–30)',
    color: '#805AD5',
    capacityPoints: 34,
    backendServices: ['Authentication', 'Customer Data', 'BatchData', 'Workflow', 'Report'],
    infrastructure: [
      'Database data processing',
      'S3 upload processing',
      'API Gateway',
      'WAF',
      'Monitoring and logging',
    ],
    deliverable:
      'Portfolio Managers can use the main dashboard and Facility Managers can upload and manage the required facility data.',
    owner: 'Delivery/Technical Team, with business validation of calculations and dashboard requirements.',
    dependencies: [
      'Electricity data',
      'Water data',
      'Gas/diesel data',
      'EPC data',
      'Building information',
      'Approved calculation rules',
      'Emission factors where required',
    ],
    risks: [
      'Data quality problems',
      'Missing calculation rules',
      'Missing or incorrect emission factors',
    ],
    definitionOfDone:
      'The functionality is implemented, tested, merged, deployed to Dev and demonstrated using representative data.',
    tickets: [
      {
        id: 'S3-T01',
        sprintId: 'S3',
        title: 'Portfolio Manager Dashboard',
        description: 'Implement the main Portfolio Manager executive dashboard aligned with Pareto Energy Intelligence.',
        workstreams: ['Frontend', 'Backend', 'Stakeholder Management'],
        backendServices: ['Customer Data', 'Report', 'Workflow'],
        infrastructure: ['API Gateway', 'Database data processing'],
        dependencies: ['Building information', 'Approved calculation rules'],
        risks: ['Missing calculation rules'],
        riskLevel: 'Medium',
        effortDays: 6,
        status: 'Not Started',
        owner: 'Senior Frontend Engineer',
      },
      {
        id: 'S3-T02',
        sprintId: 'S3',
        title: 'EPC Distribution',
        description: 'Implement the required Energy Performance Certificate (EPC) distribution visualizations and grading.',
        workstreams: ['Frontend', 'Backend', 'Database'],
        backendServices: ['Customer Data', 'Report'],
        infrastructure: ['Database data processing'],
        dependencies: ['EPC data', 'Building information', 'Approved calculation rules'],
        risks: ['Data quality problems', 'Missing calculation rules'],
        riskLevel: 'Medium',
        effortDays: 4,
        status: 'Not Started',
        owner: 'Frontend / Data Visualization Dev',
      },
      {
        id: 'S3-T03',
        sprintId: 'S3',
        title: 'Energy Trend',
        description: 'Implement the required multi-period energy consumption trend views and time-series aggregations.',
        workstreams: ['Frontend', 'Backend', 'Database'],
        backendServices: ['Customer Data', 'Report'],
        infrastructure: ['Database data processing'],
        dependencies: ['Electricity data', 'Gas/diesel data', 'Approved calculation rules'],
        risks: ['Data quality problems'],
        riskLevel: 'Medium',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Full-Stack Analytics Dev',
      },
      {
        id: 'S3-T04',
        sprintId: 'S3',
        title: 'Carbon by Region',
        description: 'Implement the required carbon-by-region emissions calculation and geographic breakdown functionality.',
        workstreams: ['Frontend', 'Backend', 'QA/Testing'],
        backendServices: ['Customer Data', 'Report'],
        infrastructure: ['Database data processing'],
        dependencies: ['Electricity data', 'Gas/diesel data', 'Emission factors where required', 'Approved calculation rules'],
        risks: ['Missing or incorrect emission factors', 'Missing calculation rules'],
        riskLevel: 'High',
        effortDays: 5,
        status: 'Not Started',
        owner: 'ESG Calculation Engineer',
      },
      {
        id: 'S3-T05',
        sprintId: 'S3',
        title: 'Building Performance',
        description: 'Implement the required building performance views, intensity ratios (kWh/m²), and benchmarking calculations.',
        workstreams: ['Frontend', 'Backend', 'Database', 'QA/Testing'],
        backendServices: ['Customer Data', 'Report'],
        infrastructure: ['Database data processing', 'API Gateway'],
        dependencies: ['Building information', 'Electricity data', 'Water data', 'Approved calculation rules'],
        risks: ['Missing calculation rules', 'Data quality problems'],
        riskLevel: 'High',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Full-Stack Analytics Dev',
      },
      {
        id: 'S3-T06',
        sprintId: 'S3',
        title: 'Facility Manager Onboarding',
        description: 'Complete Facility Manager role access, site assignment, and guided onboarding flow.',
        workstreams: ['Frontend', 'Backend', 'Security/Compliance'],
        backendServices: ['Authentication', 'Customer Data', 'Workflow'],
        infrastructure: ['API Gateway', 'WAF'],
        dependencies: ['Building information'],
        risks: ['Data quality problems'],
        riskLevel: 'Low',
        effortDays: 4,
        status: 'Not Started',
        owner: 'Frontend / Auth Engineer',
      },
      {
        id: 'S3-T07',
        sprintId: 'S3',
        title: 'Facility Manager Data Uploads',
        description:
          'Implement utility uploads for Electricity, Water, Gas/Diesel, EPC, and other approved MVP utility data.',
        details: [
          'Electricity consumption upload',
          'Water consumption upload',
          'Gas/Diesel fuel upload',
          'EPC certificate data upload',
          'Other approved MVP utility data',
        ],
        workstreams: ['Frontend', 'Backend', 'Database', 'Infrastructure/DevOps'],
        backendServices: ['BatchData', 'Customer Data', 'Workflow'],
        infrastructure: ['S3 upload processing', 'Database data processing', 'Monitoring and logging'],
        dependencies: ['Electricity data', 'Water data', 'Gas/diesel data', 'EPC data'],
        risks: ['Data quality problems'],
        riskLevel: 'High',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Data Pipeline Engineer',
      },
    ],
  },
  {
    id: 'S4',
    number: 4,
    name: 'Sprint 4',
    theme: 'Energy Intelligence, Faults, Assets and Alerts',
    shortTheme: 'Energy Intelligence',
    duration: '2 weeks',
    weeks: 'Weeks 7–8',
    startWeek: 7,
    endWeek: 8,
    dateRange: 'Weeks 7–8 (Days 31–40)',
    color: '#DD6B20',
    capacityPoints: 34,
    backendServices: ['Customer Data', 'Fault', 'Asset', 'Workflow', 'Channel', 'Report'],
    infrastructure: [
      'AWS application environment',
      'Database processing',
      'S3 where required',
      'API Gateway',
      'WAF',
      'Monitoring and alerting',
    ],
    deliverable:
      'The MVP provides the required energy intelligence, fault, asset, service-alert, notification, water-balance and fuel-reconciliation capabilities.',
    owner: 'Delivery/Technical Team, with stakeholder confirmation of business rules and calculations.',
    dependencies: [
      'Water data',
      'Fuel data',
      'Asset data',
      'Service/maintenance information',
      'Approved water-balance rules',
      'Approved fuel-reconciliation rules',
      'Alert rules',
    ],
    risks: [
      'Water or fuel data may be incomplete',
      'Calculation rules may require stakeholder clarification',
      'Additional alert requirements could affect sprint capacity',
    ],
    definitionOfDone:
      'The functionality is implemented, tested, merged, deployed to Dev and demonstrated.',
    tickets: [
      {
        id: 'S4-T01',
        sprintId: 'S4',
        title: 'Energy Intelligence',
        description: 'Complete the required energy analytics, cross-building comparison, and Pareto intelligence functionality.',
        workstreams: ['Frontend', 'Backend', 'Database', 'QA/Testing'],
        backendServices: ['Customer Data', 'Report'],
        infrastructure: ['Database processing', 'API Gateway'],
        dependencies: ['Alert rules'],
        risks: ['Calculation rules may require stakeholder clarification'],
        riskLevel: 'Medium',
        effortDays: 6,
        status: 'Not Started',
        owner: 'Energy Analytics Lead',
      },
      {
        id: 'S4-T02',
        sprintId: 'S4',
        title: 'Fault Logging',
        description: 'Implement fault creation, severity categorization, assignment management, and status tracking.',
        workstreams: ['Frontend', 'Backend', 'Database'],
        backendServices: ['Fault', 'Workflow', 'Channel'],
        infrastructure: ['AWS application environment', 'Database processing'],
        dependencies: ['Service/maintenance information'],
        risks: ['Additional alert requirements could affect sprint capacity'],
        riskLevel: 'Low',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Full-Stack Workflow Dev',
      },
      {
        id: 'S4-T03',
        sprintId: 'S4',
        title: 'ESG Asset Registry',
        description: 'Implement the ESG asset registry for tracking critical building equipment, meters, and sustainability assets.',
        workstreams: ['Frontend', 'Backend', 'Database'],
        backendServices: ['Asset', 'Customer Data', 'Report'],
        infrastructure: ['Database processing', 'S3 where required'],
        dependencies: ['Asset data', 'Service/maintenance information'],
        risks: ['Calculation rules may require stakeholder clarification'],
        riskLevel: 'Medium',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Backend / Asset Engineer',
      },
      {
        id: 'S4-T04',
        sprintId: 'S4',
        title: 'Service Alerts',
        description: 'Implement automated service and operational threshold alerts across facility metrics.',
        workstreams: ['Frontend', 'Backend', 'Infrastructure/DevOps'],
        backendServices: ['Fault', 'Asset', 'Workflow', 'Channel'],
        infrastructure: ['Monitoring and alerting', 'API Gateway'],
        dependencies: ['Alert rules', 'Service/maintenance information'],
        risks: ['Additional alert requirements could affect sprint capacity'],
        riskLevel: 'High',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Platform / Alerting Dev',
      },
      {
        id: 'S4-T05',
        sprintId: 'S4',
        title: 'Notifications',
        description: 'Implement the required multi-channel notification dispatch and in-app notification center functionality.',
        workstreams: ['Frontend', 'Backend', 'Infrastructure/DevOps'],
        backendServices: ['Channel', 'Workflow'],
        infrastructure: ['AWS application environment', 'Monitoring and alerting'],
        dependencies: ['Alert rules'],
        risks: ['Additional alert requirements could affect sprint capacity'],
        riskLevel: 'Medium',
        effortDays: 4,
        status: 'Not Started',
        owner: 'Backend Messaging Dev',
      },
      {
        id: 'S4-T06',
        sprintId: 'S4',
        title: 'Water Balance',
        description:
          'Implement the water balance inflow/outflow and variance functionality added from the Pareto Stakeholder Review.',
        workstreams: ['Frontend', 'Backend', 'Database', 'QA/Testing', 'Stakeholder Management'],
        backendServices: ['Customer Data', 'Report', 'Workflow'],
        infrastructure: ['Database processing'],
        dependencies: ['Water data', 'Approved water-balance rules'],
        risks: ['Water or fuel data may be incomplete', 'Calculation rules may require stakeholder clarification'],
        riskLevel: 'High',
        effortDays: 5,
        status: 'Not Started',
        owner: 'ESG Calculation Engineer',
      },
      {
        id: 'S4-T07',
        sprintId: 'S4',
        title: 'Fuel Reconciliation',
        description:
          'Implement the diesel/gas fuel reconciliation, generator run-hour correlation, and variance functionality added from the Pareto Stakeholder Review.',
        workstreams: ['Frontend', 'Backend', 'Database', 'QA/Testing', 'Stakeholder Management'],
        backendServices: ['Customer Data', 'Asset', 'Report', 'Workflow'],
        infrastructure: ['Database processing'],
        dependencies: ['Fuel data', 'Approved fuel-reconciliation rules'],
        risks: ['Water or fuel data may be incomplete', 'Calculation rules may require stakeholder clarification'],
        riskLevel: 'High',
        effortDays: 4,
        status: 'Not Started',
        owner: 'ESG Calculation Engineer',
      },
    ],
  },
  {
    id: 'S5',
    number: 5,
    name: 'Sprint 5',
    theme: 'AI, IoT Readiness, ISO Alignment and MVP Completion',
    shortTheme: 'AI & Completion',
    duration: '2 weeks',
    weeks: 'Weeks 9–10',
    startWeek: 9,
    endWeek: 10,
    dateRange: 'Weeks 9–10 (Days 41–50)',
    color: '#E53E3E',
    capacityPoints: 42,
    backendServices: [
      'Authentication',
      'Customer Data',
      'BatchData',
      'Document',
      'Fault',
      'Asset',
      'Workflow',
      'Channel',
      'Report',
    ],
    infrastructure: [
      'AWS production-readiness checks',
      'RDS PostgreSQL / TimescaleDB',
      'S3',
      'API Gateway',
      'WAF',
      'Monitoring',
      'Security',
      'POPIA readiness',
      'Deployment and environment checks',
      'UAT environment',
    ],
    deliverable:
      'The complete approved MVP is integrated, tested, deployed to the UAT environment and ready for stakeholder acceptance testing.',
    owner: 'Delivery/Technical Team, with stakeholder validation and approval.',
    dependencies: [
      'Historical data for analytics where required',
      'AI/analytics requirements',
      'IoT information where applicable',
      'ISO 14001:2026 requirements and evidence expectations',
      'UAT users',
      'UAT test data',
      'Final acceptance criteria',
    ],
    risks: [
      'Insufficient historical data for AI/predictive analytics',
      'IoT integration dependencies',
      'Additional ISO requirements',
      'Critical defects discovered late in the sprint',
    ],
    definitionOfDone:
      'Code is implemented, merged, tested, deployed to Dev/UAT as applicable, demonstrated and meets the agreed MVP acceptance criteria.',
    tickets: [
      {
        id: 'S5-T01',
        sprintId: 'S5',
        title: 'AI and Predictive Analytics',
        description:
          'Implement the approved MVP-level AI and predictive analytics based on available uploaded data (anomaly detection, consumption trends, basic forecasting, unusual consumption behaviour).',
        details: [
          'Anomaly detection',
          'Consumption trends',
          'Basic forecasting',
          'Identification of unusual consumption behaviour',
        ],
        workstreams: ['Frontend', 'Backend', 'Database', 'QA/Testing'],
        backendServices: ['Customer Data', 'BatchData', 'Report'],
        infrastructure: ['RDS PostgreSQL / TimescaleDB', 'API Gateway'],
        dependencies: ['Historical data for analytics where required', 'AI/analytics requirements'],
        risks: ['Insufficient historical data for AI/predictive analytics'],
        riskLevel: 'High',
        effortDays: 6,
        status: 'Not Started',
        owner: 'Data Science / Backend Lead',
      },
      {
        id: 'S5-T02',
        sprintId: 'S5',
        title: 'IoT and Smart-Meter Readiness',
        description:
          'Implement the agreed IoT/smart-meter integration foundation required for the Energy Intelligence Dashboard (architecture and data structures for live smart-meter ingestion).',
        workstreams: ['Backend', 'Database', 'Infrastructure/DevOps', 'Documentation'],
        backendServices: ['BatchData', 'Customer Data', 'Asset', 'Channel'],
        infrastructure: ['API Gateway', 'RDS PostgreSQL / TimescaleDB', 'WAF'],
        dependencies: ['IoT information where applicable'],
        risks: ['IoT integration dependencies'],
        riskLevel: 'High',
        effortDays: 5,
        status: 'Not Started',
        owner: 'IoT / Cloud Architect',
      },
      {
        id: 'S5-T03',
        sprintId: 'S5',
        title: 'ISO 14001:2026 Alignment',
        description:
          'Implement the agreed MVP-level ISO 14001:2026 alignment requirements from the Pareto Stakeholder Review (environmental information, evidence, records, and traceability).',
        workstreams: ['Frontend', 'Backend', 'Security/Compliance', 'Documentation', 'Stakeholder Management'],
        backendServices: ['Document', 'Report', 'Workflow', 'Asset'],
        infrastructure: ['S3', 'POPIA readiness'],
        dependencies: ['ISO 14001:2026 requirements and evidence expectations'],
        risks: ['Additional ISO requirements'],
        riskLevel: 'Medium',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Compliance / Full-Stack Dev',
      },
      {
        id: 'S5-T04',
        sprintId: 'S5',
        title: 'Admin Settings',
        description: 'Complete the required Admin Settings functionality for platform parameters, thresholds, and user governance.',
        workstreams: ['Frontend', 'Backend'],
        backendServices: ['Authentication', 'Customer Data', 'Workflow', 'Channel'],
        infrastructure: ['API Gateway', 'Security'],
        dependencies: ['Final acceptance criteria'],
        risks: ['Critical defects discovered late in the sprint'],
        riskLevel: 'Low',
        effortDays: 4,
        status: 'Not Started',
        owner: 'Frontend / Backend Dev',
      },
      {
        id: 'S5-T05',
        sprintId: 'S5',
        title: 'Platform Integration',
        description: 'Integrate the completed MVP functionality across all 9 backend services and confirm major workflows operate together.',
        workstreams: ['Frontend', 'Backend', 'Database', 'Infrastructure/DevOps', 'QA/Testing'],
        backendServices: [
          'Authentication',
          'Customer Data',
          'BatchData',
          'Document',
          'Fault',
          'Asset',
          'Workflow',
          'Channel',
          'Report',
        ],
        infrastructure: ['API Gateway', 'RDS PostgreSQL / TimescaleDB', 'S3', 'Monitoring'],
        dependencies: ['Final acceptance criteria'],
        risks: ['Critical defects discovered late in the sprint'],
        riskLevel: 'Medium',
        effortDays: 5,
        status: 'Not Started',
        owner: 'Lead Systems Architect',
      },
      {
        id: 'S5-T06',
        sprintId: 'S5',
        title: 'Calculation Verification',
        description:
          'Verify the MVP calculations (energy, carbon, EPC, water balance, fuel reconciliation) against approved formulas, rules, thresholds, and data requirements.',
        workstreams: ['QA/Testing', 'Backend', 'Documentation', 'Stakeholder Management'],
        backendServices: ['Customer Data', 'Report'],
        infrastructure: ['RDS PostgreSQL / TimescaleDB'],
        dependencies: ['Historical data for analytics where required', 'Final acceptance criteria'],
        risks: ['Critical defects discovered late in the sprint'],
        riskLevel: 'Medium',
        effortDays: 4,
        status: 'Not Started',
        owner: 'QA Lead & ESG Analyst',
      },
      {
        id: 'S5-T07',
        sprintId: 'S5',
        title: 'Security and POPIA Readiness',
        description: 'Complete the final security hardening, WAF verification, encryption checks, and POPIA readiness checks.',
        workstreams: ['Security/Compliance', 'Infrastructure/DevOps', 'Documentation'],
        backendServices: ['Authentication', 'Customer Data', 'Document'],
        infrastructure: ['WAF', 'Security', 'POPIA readiness', 'AWS production-readiness checks'],
        dependencies: ['Final acceptance criteria'],
        risks: ['Critical defects discovered late in the sprint'],
        riskLevel: 'Medium',
        effortDays: 4,
        status: 'Not Started',
        owner: 'Security & Compliance Officer',
      },
      {
        id: 'S5-T08',
        sprintId: 'S5',
        title: 'Testing and Defect Resolution',
        description: 'Complete end-to-end system testing, regression validation, and resolve priority defects.',
        workstreams: ['QA/Testing', 'Frontend', 'Backend'],
        backendServices: ['Authentication', 'Customer Data', 'BatchData', 'Fault', 'Asset', 'Workflow', 'Report'],
        infrastructure: ['Monitoring', 'Deployment and environment checks'],
        dependencies: ['UAT test data', 'Final acceptance criteria'],
        risks: ['Critical defects discovered late in the sprint'],
        riskLevel: 'High',
        effortDays: 5,
        status: 'Not Started',
        owner: 'QA Engineering Team',
      },
      {
        id: 'S5-T09',
        sprintId: 'S5',
        title: 'UAT Preparation',
        description: 'Prepare the UAT environment, test users, representative test data, and stakeholder acceptance scenarios.',
        workstreams: ['Infrastructure/DevOps', 'QA/Testing', 'Documentation', 'Stakeholder Management'],
        backendServices: ['Authentication', 'Customer Data', 'Workflow', 'Report'],
        infrastructure: ['UAT environment', 'Deployment and environment checks', 'AWS production-readiness checks'],
        dependencies: ['UAT users', 'UAT test data', 'Final acceptance criteria'],
        risks: ['Critical defects discovered late in the sprint'],
        riskLevel: 'Medium',
        effortDays: 4,
        status: 'Not Started',
        owner: 'Release Manager / PM',
      },
    ],
  },
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'M1',
    name: 'MVP Development Start',
    trigger: 'Start of Sprint 1',
    sprintBoundary: 0,
    weekNumber: 1,
    targetDate: 'Week 1, Day 1',
    status: 'Complete',
    iconType: 'circle',
  },
  {
    id: 'M2',
    name: 'Core Platform Foundation Complete',
    trigger: 'End of Sprint 1',
    sprintBoundary: 1,
    weekNumber: 2,
    targetDate: 'End of Week 2',
    status: 'In Progress',
    iconType: 'diamond',
  },
  {
    id: 'M3',
    name: 'Administration and Data Management Complete',
    trigger: 'End of Sprint 2',
    sprintBoundary: 2,
    weekNumber: 4,
    targetDate: 'End of Week 4',
    status: 'Pending',
    iconType: 'diamond',
  },
  {
    id: 'M4',
    name: 'Core User Workflows Complete',
    trigger: 'End of Sprint 3',
    sprintBoundary: 3,
    weekNumber: 6,
    targetDate: 'End of Week 6',
    status: 'Pending',
    iconType: 'diamond',
  },
  {
    id: 'M5',
    name: 'Energy Intelligence and Operational Features Complete',
    trigger: 'End of Sprint 4',
    sprintBoundary: 4,
    weekNumber: 8,
    targetDate: 'End of Week 8',
    status: 'Pending',
    iconType: 'diamond',
  },
  {
    id: 'M6',
    name: 'MVP Development Complete',
    trigger: 'End of Sprint 5',
    sprintBoundary: 5,
    weekNumber: 10,
    targetDate: 'End of Week 10 (2.5 Months Max)',
    status: 'Pending',
    iconType: 'diamond',
  },
  {
    id: 'M7',
    name: 'UAT Start',
    trigger: 'After Sprint 5 and completion of UAT readiness checks',
    sprintBoundary: 6,
    weekNumber: 11,
    targetDate: 'Post-Sprint 5 Readiness',
    status: 'Pending',
    iconType: 'circle',
  },
  {
    id: 'M8',
    name: 'UAT Sign-Off & Target Go-Live',
    trigger: 'After agreed acceptance criteria & production-readiness approval',
    sprintBoundary: 7,
    weekNumber: 11,
    targetDate: 'Upon UAT Sign-Off',
    status: 'Pending',
    iconType: 'flag',
  },
];

export const INITIAL_RISKS: RiskItem[] = [
  {
    id: 'R-S1-1',
    sprintId: 'S1',
    title: 'AWS access not available on time',
    likelihood: 'Medium',
    impact: 'High',
    affectedTickets: ['S1-T04', 'S1-T05'],
    mitigation: 'Escalate AWS af-south-1 account provisioning and IAM credentials on Day 1; use local Dockerized PostgreSQL/TimescaleDB for immediate schema dev.',
    owner: 'Cloud / DevOps Lead',
  },
  {
    id: 'R-S1-2',
    sprintId: 'S1',
    title: 'Database architecture decision delayed',
    likelihood: 'Medium',
    impact: 'High',
    affectedTickets: ['S1-T05', 'S1-T06'],
    mitigation: 'Lock in RDS PostgreSQL + TimescaleDB hypertable design for time-series utility metrics by Sprint 1 Day 3.',
    owner: 'Database Architect',
  },
  {
    id: 'R-S1-3',
    sprintId: 'S1',
    title: 'Unclear requirements or business rules',
    likelihood: 'Low',
    impact: 'Medium',
    affectedTickets: ['S1-T01', 'S1-T02', 'S1-T03'],
    mitigation: 'Enforce GreenBDG MVP Proposal V1.3 as final baseline; log any ambiguity in Monday/Wednesday/Friday stakeholder blockers.',
    owner: 'Product Owner / PM',
  },
  {
    id: 'R-S2-1',
    sprintId: 'S2',
    title: 'Poor or incomplete source data',
    likelihood: 'High',
    impact: 'High',
    affectedTickets: ['S2-T02', 'S2-T03', 'S2-T06'],
    mitigation: 'Provide strict CSV/XLSX data-upload templates with automated row-level validation and clear rejection logs.',
    owner: 'Data Engineering Lead',
  },
  {
    id: 'R-S2-2',
    sprintId: 'S2',
    title: 'Upload requirements not clearly defined',
    likelihood: 'Medium',
    impact: 'Medium',
    affectedTickets: ['S2-T01', 'S2-T04', 'S2-T05'],
    mitigation: 'Freeze column definitions and file size/type constraints prior to Sprint 2 kickoff.',
    owner: 'Business Analyst',
  },
  {
    id: 'R-S2-3',
    sprintId: 'S2',
    title: 'Missing test data',
    likelihood: 'Medium',
    impact: 'Medium',
    affectedTickets: ['S2-T04', 'S2-T06'],
    mitigation: 'Generate synthetic representative South African commercial building datasets if client samples are delayed.',
    owner: 'QA Lead',
  },
  {
    id: 'R-S3-1',
    sprintId: 'S3',
    title: 'Data quality problems',
    likelihood: 'High',
    impact: 'Medium',
    affectedTickets: ['S3-T02', 'S3-T03', 'S3-T05', 'S3-T06', 'S3-T07'],
    mitigation: 'Implement pre-ingestion sanitization, unit normalization (kWh, kL, Litres), and duplicate period detection.',
    owner: 'Data Pipeline Engineer',
  },
  {
    id: 'R-S3-2',
    sprintId: 'S3',
    title: 'Missing calculation rules',
    likelihood: 'Medium',
    impact: 'High',
    affectedTickets: ['S3-T01', 'S3-T02', 'S3-T04', 'S3-T05'],
    mitigation: 'Require formal stakeholder sign-off on EPC grading bands and building performance formulas in Week 4.',
    owner: 'ESG Domain Lead',
  },
  {
    id: 'R-S3-3',
    sprintId: 'S3',
    title: 'Missing or incorrect emission factors',
    likelihood: 'Low',
    impact: 'High',
    affectedTickets: ['S3-T04'],
    mitigation: 'Configure parameterized South African grid & fuel emission factors in database with versioned audit trail.',
    owner: 'ESG Domain Lead',
  },
  {
    id: 'R-S4-1',
    sprintId: 'S4',
    title: 'Water or fuel data may be incomplete',
    likelihood: 'High',
    impact: 'High',
    affectedTickets: ['S4-T06', 'S4-T07'],
    mitigation: 'Support partial-period reconciliation and explicit data-completeness indicators on Pareto Water & Fuel views.',
    owner: 'Data Pipeline Engineer',
  },
  {
    id: 'R-S4-2',
    sprintId: 'S4',
    title: 'Calculation rules may require stakeholder clarification',
    likelihood: 'Medium',
    impact: 'High',
    affectedTickets: ['S4-T01', 'S4-T03', 'S4-T06', 'S4-T07'],
    mitigation: 'Schedule dedicated Pareto Stakeholder Review rule-verification workshop prior to Sprint 4.',
    owner: 'Stakeholder / PM',
  },
  {
    id: 'R-S4-3',
    sprintId: 'S4',
    title: 'Additional alert requirements could affect sprint capacity',
    likelihood: 'Medium',
    impact: 'Medium',
    affectedTickets: ['S4-T02', 'S4-T04', 'S4-T05'],
    mitigation: 'Enforce Section 13 Scope Control: route any non-baseline alert rules to the Change Request Log.',
    owner: 'Delivery Manager',
  },
  {
    id: 'R-S5-1',
    sprintId: 'S5',
    title: 'Insufficient historical data for AI/predictive analytics',
    likelihood: 'High',
    impact: 'High',
    affectedTickets: ['S5-T01'],
    mitigation: 'Use baseline statistical anomaly detection and rolling trend forecasting that degrades gracefully on shorter history.',
    owner: 'Data Science Lead',
  },
  {
    id: 'R-S5-2',
    sprintId: 'S5',
    title: 'IoT integration dependencies',
    likelihood: 'High',
    impact: 'Medium',
    affectedTickets: ['S5-T02'],
    mitigation: 'Per MVP plan, build the IoT/smart-meter architecture & ingestion contract first; only enable live device stream where APIs/access are approved.',
    owner: 'IoT Architect',
  },
  {
    id: 'R-S5-3',
    sprintId: 'S5',
    title: 'Additional ISO requirements',
    likelihood: 'Medium',
    impact: 'Medium',
    affectedTickets: ['S5-T03'],
    mitigation: 'Strictly scope ISO 14001:2026 features to the agreed Pareto Stakeholder Review environmental records & traceability baseline.',
    owner: 'Compliance Lead',
  },
  {
    id: 'R-S5-4',
    sprintId: 'S5',
    title: 'Critical defects discovered late in the sprint',
    likelihood: 'Medium',
    impact: 'High',
    affectedTickets: ['S5-T04', 'S5-T05', 'S5-T06', 'S5-T07', 'S5-T08', 'S5-T09'],
    mitigation: 'Run continuous integration testing from Sprint 1 and freeze feature code by Sprint 5 Day 6 for dedicated defect resolution.',
    owner: 'QA Lead',
  },
];

export const INITIAL_DEPENDENCIES: DependencyItem[] = [
  // Sprint 1
  { id: 'D-S1-1', sprintId: 'S1', name: 'Approved MVP Proposal V1.3', status: 'Met', stakeholder: 'Executive Sponsor', affectedTickets: ['S1-T01', 'S1-T02', 'S1-T05', 'S1-T06'] },
  { id: 'D-S1-2', sprintId: 'S1', name: 'AWS account/access (South Africa region)', status: 'Met', stakeholder: 'Client IT / Cloud Admin', affectedTickets: ['S1-T04', 'S1-T05', 'S1-T06'] },
  { id: 'D-S1-3', sprintId: 'S1', name: 'Required domain/environment information', status: 'Met', stakeholder: 'Client IT', affectedTickets: ['S1-T04'] },
  { id: 'D-S1-4', sprintId: 'S1', name: 'Initial business/user information', status: 'Met', stakeholder: 'GreenBDG Product Owner', affectedTickets: ['S1-T01', 'S1-T02', 'S1-T03'] },
  // Sprint 2
  { id: 'D-S2-1', sprintId: 'S2', name: 'Building data', status: 'Pending', stakeholder: 'Portfolio Operations', affectedTickets: ['S2-T02', 'S2-T06'] },
  { id: 'D-S2-2', sprintId: 'S2', name: 'Staff data', status: 'Pending', stakeholder: 'HR / Platform Admin', affectedTickets: ['S2-T01', 'S2-T03'] },
  { id: 'D-S2-3', sprintId: 'S2', name: 'Test data', status: 'Pending', stakeholder: 'QA & Operations Team', affectedTickets: ['S2-T04', 'S2-T06'] },
  { id: 'D-S2-4', sprintId: 'S2', name: 'Required document examples', status: 'Met', stakeholder: 'Compliance / Facility Lead', affectedTickets: ['S2-T05'] },
  { id: 'D-S2-5', sprintId: 'S2', name: 'Data-upload templates', status: 'Met', stakeholder: 'Technical & Business Team', affectedTickets: ['S2-T03', 'S2-T04'] },
  // Sprint 3
  { id: 'D-S3-1', sprintId: 'S3', name: 'Electricity data', status: 'Pending', stakeholder: 'Facility Managers', affectedTickets: ['S3-T03', 'S3-T04', 'S3-T05', 'S3-T07'] },
  { id: 'D-S3-2', sprintId: 'S3', name: 'Water data', status: 'Pending', stakeholder: 'Facility Managers', affectedTickets: ['S3-T05', 'S3-T07'] },
  { id: 'D-S3-3', sprintId: 'S3', name: 'Gas/diesel data', status: 'Pending', stakeholder: 'Facility Managers', affectedTickets: ['S3-T03', 'S3-T04', 'S3-T07'] },
  { id: 'D-S3-4', sprintId: 'S3', name: 'EPC data', status: 'Pending', stakeholder: 'Sustainability Team', affectedTickets: ['S3-T02', 'S3-T07'] },
  { id: 'D-S3-5', sprintId: 'S3', name: 'Building information', status: 'Pending', stakeholder: 'Portfolio Managers', affectedTickets: ['S3-T01', 'S3-T02', 'S3-T05', 'S3-T06'] },
  { id: 'D-S3-6', sprintId: 'S3', name: 'Approved calculation rules', status: 'Pending', stakeholder: 'ESG & Pareto Stakeholders', affectedTickets: ['S3-T01', 'S3-T02', 'S3-T03', 'S3-T04', 'S3-T05'] },
  { id: 'D-S3-7', sprintId: 'S3', name: 'Emission factors where required', status: 'Met', stakeholder: 'ESG Specialist', affectedTickets: ['S3-T04'] },
  // Sprint 4
  { id: 'D-S4-1', sprintId: 'S4', name: 'Water data (Pareto Water Balance)', status: 'Pending', stakeholder: 'Pareto / Facility Team', affectedTickets: ['S4-T06'] },
  { id: 'D-S4-2', sprintId: 'S4', name: 'Fuel data (Pareto Fuel Reconciliation)', status: 'Blocked', stakeholder: 'Pareto / Facility Team', affectedTickets: ['S4-T07'] },
  { id: 'D-S4-3', sprintId: 'S4', name: 'Asset data', status: 'Pending', stakeholder: 'Facility Engineering', affectedTickets: ['S4-T03'] },
  { id: 'D-S4-4', sprintId: 'S4', name: 'Service/maintenance information', status: 'Pending', stakeholder: 'Operations Team', affectedTickets: ['S4-T02', 'S4-T03', 'S4-T04'] },
  { id: 'D-S4-5', sprintId: 'S4', name: 'Approved water-balance rules', status: 'Pending', stakeholder: 'Pareto Stakeholder Review', affectedTickets: ['S4-T06'] },
  { id: 'D-S4-6', sprintId: 'S4', name: 'Approved fuel-reconciliation rules', status: 'Blocked', stakeholder: 'Pareto Stakeholder Review', affectedTickets: ['S4-T07'] },
  { id: 'D-S4-7', sprintId: 'S4', name: 'Alert rules', status: 'Pending', stakeholder: 'Operations & Portfolio Lead', affectedTickets: ['S4-T01', 'S4-T04', 'S4-T05'] },
  // Sprint 5
  { id: 'D-S5-1', sprintId: 'S5', name: 'Historical data for analytics where required', status: 'Pending', stakeholder: 'Data / Portfolio Team', affectedTickets: ['S5-T01', 'S5-T06'] },
  { id: 'D-S5-2', sprintId: 'S5', name: 'AI/analytics requirements', status: 'Met', stakeholder: 'Product Owner', affectedTickets: ['S5-T01'] },
  { id: 'D-S5-3', sprintId: 'S5', name: 'IoT information where applicable', status: 'Blocked', stakeholder: 'Smart-Meter Vendor / IT', affectedTickets: ['S5-T02'] },
  { id: 'D-S5-4', sprintId: 'S5', name: 'ISO 14001:2026 requirements and evidence expectations', status: 'Met', stakeholder: 'Pareto Compliance Reviewer', affectedTickets: ['S5-T03'] },
  { id: 'D-S5-5', sprintId: 'S5', name: 'UAT users, UAT test data & Final acceptance criteria', status: 'Pending', stakeholder: 'All Stakeholders', affectedTickets: ['S5-T04', 'S5-T05', 'S5-T06', 'S5-T07', 'S5-T08', 'S5-T09'] },
];

export const INITIAL_PROGRESS_UPDATES: ProgressUpdate[] = [
  {
    id: 'PU-1',
    sprintAndDay: 'Sprint 1, Day 8 of 10',
    timestamp: 'Friday 16:00 SAST',
    completedSinceLast: [
      'S1-T01: Confirmed GreenBDG MVP Proposal V1.3 baseline and Pareto Energy Intelligence alignment',
      'S1-T02: Implemented RBAC authentication structure for Admin, Portfolio Manager, and Facility Manager',
      'S1-T03: Completed Admin First-Time Setup Foundation workflow',
      'S1-T04: Provisioned AWS Landing Zone (af-south-1 South Africa), S3 buckets, API Gateway, and WAF rules',
    ],
    inProgress: [
      'S1-T05: Finalizing TimescaleDB hypertable partitioning on RDS PostgreSQL (85% complete)',
      'S1-T06: Scaffolding microservice contracts for Fault, Asset, Workflow, Channel, and Report services',
    ],
    plannedBeforeNext: [
      'Complete S1-T05 and S1-T06 merge to Dev branch',
      'Execute Sprint 1 30-minute stakeholder demo and review before Sprint 2 kickoff',
      'Validate Sprint 2 CSV/XLSX upload templates with stakeholder team',
    ],
    blockersAndDecisions: [
      'Confirmation required on representative Building & Staff test data files for Sprint 2 (S2-T02, S2-T03)',
      'Stakeholder sign-off on Pareto fuel-reconciliation variance thresholds needed ahead of Sprint 4',
    ],
    riskStatus: 'Green',
    riskExplanation:
      'Sprint 1 foundation is on schedule; AWS South Africa region and core RBAC are live in Dev.',
    demoLinkOrNotes: 'Dev Environment Build #104 — Auth, Role Matrix & AWS af-south-1 Landing Zone verified.',
  },
  {
    id: 'PU-2',
    sprintAndDay: 'Sprint 1, Day 5 of 10',
    timestamp: 'Wednesday 16:00 SAST',
    completedSinceLast: [
      'S1-T01: Signed off technical foundation architecture and repository structure',
      'S1-T04: Configured AWS af-south-1 VPC, S3 encryption, and initial POPIA security controls',
    ],
    inProgress: [
      'S1-T02: Role structure implementation for Admin, Portfolio Manager, and Facility Manager',
      'S1-T03: Admin First-Time Setup UI and API endpoints',
    ],
    plannedBeforeNext: [
      'Complete authentication token flow and WAF attachment on API Gateway',
      'Begin RDS PostgreSQL + TimescaleDB schema migration scripts (S1-T05)',
    ],
    blockersAndDecisions: [
      'Final domain SSL certificate DNS validation pending Client IT confirmation',
    ],
    riskStatus: 'Amber',
    riskExplanation:
      'Database TimescaleDB extension parameter group verification in progress; mitigated via local container testing.',
    demoLinkOrNotes: 'Architecture walkthrough & IAM role matrix preview shared with technical stakeholders.',
  },
];

export const INITIAL_SCOPE_CHANGES: ScopeChangeRequest[] = [
  {
    id: 'CR-01',
    title: 'Pareto Water Balance Inflow/Outflow Analytics (S4-T06)',
    requestedBy: 'Pareto Stakeholder Review',
    date: 'Baseline V1.3 Incorporation',
    classification: 'Already Included in MVP',
    estimatedDaysImpact: 0,
    targetSprint: 'S4',
    rationale: 'Explicitly incorporated into Sprint 4 baseline per Section 1 & Section 6 of the MVP Delivery Plan.',
  },
  {
    id: 'CR-02',
    title: 'Pareto Fuel Reconciliation & Generator Correlation (S4-T07)',
    requestedBy: 'Pareto Stakeholder Review',
    date: 'Baseline V1.3 Incorporation',
    classification: 'Already Included in MVP',
    estimatedDaysImpact: 0,
    targetSprint: 'S4',
    rationale: 'Explicitly incorporated into Sprint 4 baseline per Section 1 & Section 6 of the MVP Delivery Plan.',
  },
  {
    id: 'CR-03',
    title: 'ISO 14001:2026 Environmental Evidence & Traceability (S5-T03)',
    requestedBy: 'Pareto Stakeholder Review',
    date: 'Baseline V1.3 Incorporation',
    classification: 'Already Included in MVP',
    estimatedDaysImpact: 0,
    targetSprint: 'S5',
    rationale: 'Incorporated into Sprint 5 baseline within approved MVP scope.',
  },
  {
    id: 'CR-04',
    title: 'Automated Real-Time HVAC Closed-Loop Autonomous Optimization',
    requestedBy: 'Future Roadmap Inquiry',
    date: 'Scope Control Evaluation',
    classification: 'Future-Phase Requirement',
    estimatedDaysImpact: 18,
    targetSprint: 'Post-MVP Phase 2',
    rationale: 'Section 7 (S5-T01) states advanced AI or optimisation functionality is excluded unless specifically approved to protect the 2.5-month limit.',
  },
];

export const PM_TOOL_COMPARISON = [
  {
    feature: 'Multi-dimensional SDLC workstream matrix',
    greenBdg: 'Native 5x8 visual heatmap with effort & ticket drill-down',
    genericPm: 'Requires custom fields + manual pivot setup',
  },
  {
    feature: 'Backend services dependency web',
    greenBdg: 'Interactive 9-service architecture network graph across S1–S5',
    genericPm: 'Not supported natively',
  },
  {
    feature: 'Sprint capacity vs. scope visualization',
    greenBdg: 'Built-in dynamic 10-week / 2.5-month timeline lock',
    genericPm: 'Manual spreadsheet calculations',
  },
  {
    feature: 'Risk heatmap per sprint',
    greenBdg: 'Interactive Likelihood x Impact bubble matrix with ticket links',
    genericPm: 'Basic flat text risk fields only',
  },
  {
    feature: 'Dependency chain mapping',
    greenBdg: 'Cross-sprint input readiness & blocker impact attribution',
    genericPm: 'Linear task links only',
  },
  {
    feature: 'Role-based intelligence views',
    greenBdg: 'Instant 1-click switch (Technical / Stakeholder / Executive)',
    genericPm: 'Requires maintaining separate boards & permissions',
  },
  {
    feature: 'Scope creep impact simulator',
    greenBdg: 'Live 2.5-month delivery boundary breach calculator',
    genericPm: 'Not supported',
  },
  {
    feature: 'Progress update feed (Mon/Wed/Fri 16:00)',
    greenBdg: 'Structured contractual reporting format with live simulation',
    genericPm: 'Unstructured comments or manual status docs',
  },
];
