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

export type RiskSeverity = 'Low' | 'Medium' | 'High';
export type DependencyStatus = 'Met' | 'Pending' | 'Blocked';

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
}

export interface RiskItem {
  id: string;
  sprintId: string;
  title: string;
  likelihood: RiskSeverity;
  impact: RiskSeverity;
  affectedTickets: string[];
  mitigation: string;
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
  color: string;
  tickets: Ticket[];
  backendServices: BackendService[];
  infrastructure: string[];
  deliverable: string;
  owner: string;
  dependencies: string[];
  risks: string[];
  definitionOfDone: string;
}

export interface Milestone {
  id: string;
  step: number;
  name: string;
  shortName: string;
  trigger: string;
  sprintBoundary: string;
  iconType: 'circle' | 'diamond' | 'flag';
}

export interface ScopeClassificationExample {
  id: string;
  category: 'Already in Baseline' | 'Approved MVP Change' | 'Future Phase';
  ruleDescription: string;
  items: {
    title: string;
    reference: string;
    note: string;
  }[];
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
  id: string;
  component: string;
  sprints: string[];
  category: string;
  architecturalRole: string;
}[] = [
  {
    id: 'INF-01',
    component: 'AWS Landing Zone – South Africa region (af-south-1)',
    sprints: ['S1'],
    category: 'Cloud Foundation',
    architecturalRole: 'Sovereign South African cloud tenancy, VPC networking, and account structure',
  },
  {
    id: 'INF-02',
    component: 'RDS PostgreSQL / TimescaleDB',
    sprints: ['S1', 'S5'],
    category: 'Database & Time-Series',
    architecturalRole: 'Relational core + time-series hypertables for utility, IoT, and predictive analytics',
  },
  {
    id: 'INF-03',
    component: 'S3 Object Storage & Upload Processing',
    sprints: ['S1', 'S2', 'S3', 'S4', 'S5'],
    category: 'Storage & Ingestion',
    architecturalRole: 'Secure bucket storage for CSV/XLSX utility batches, EPC certificates, and ISO evidence',
  },
  {
    id: 'INF-04',
    component: 'API Gateway',
    sprints: ['S1', 'S3', 'S4', 'S5'],
    category: 'API & Routing',
    architecturalRole: 'Unified REST/HTTP gateway routing requests across the 9 backend microservices',
  },
  {
    id: 'INF-05',
    component: 'WAF (Web Application Firewall)',
    sprints: ['S1', 'S3', 'S4', 'S5'],
    category: 'Edge Security',
    architecturalRole: 'OWASP perimeter protection, rate limiting, and endpoint shielding',
  },
  {
    id: 'INF-06',
    component: 'Development Environment',
    sprints: ['S1'],
    category: 'Environment',
    architecturalRole: 'Baseline Dev deployment target for continuous sprint demonstrations',
  },
  {
    id: 'INF-07',
    component: 'Initial Security and POPIA Controls',
    sprints: ['S1', 'S2'],
    category: 'Compliance & Governance',
    architecturalRole: 'Role-based access boundaries, data privacy encryption, and audit logging',
  },
  {
    id: 'INF-08',
    component: 'Monitoring, Logging and Alerting',
    sprints: ['S2', 'S3', 'S4', 'S5'],
    category: 'Observability',
    architecturalRole: 'CloudWatch telemetry, upload pipeline logs, and operational threshold alerts',
  },
  {
    id: 'INF-09',
    component: 'File Processing Pipeline',
    sprints: ['S2'],
    category: 'Data Pipeline',
    architecturalRole: 'Automated parsing and schema validation for CSV/XLSX facility and staff uploads',
  },
  {
    id: 'INF-10',
    component: 'Database Persistence Layer',
    sprints: ['S2'],
    category: 'Database & Time-Series',
    architecturalRole: 'Permanent transactional storage for buildings, staff, documents, and batch records',
  },
  {
    id: 'INF-11',
    component: 'Database Data Processing',
    sprints: ['S3', 'S4'],
    category: 'Data Pipeline',
    architecturalRole: 'Aggregation queries for EPC distribution, carbon by region, water balance, and fuel reconciliation',
  },
  {
    id: 'INF-12',
    component: 'AWS Application Environment',
    sprints: ['S4'],
    category: 'Environment',
    architecturalRole: 'Scaled compute and messaging runtime for energy intelligence, fault logging, and notifications',
  },
  {
    id: 'INF-13',
    component: 'AWS Production-Readiness & Security/POPIA Final Checks',
    sprints: ['S5'],
    category: 'Compliance & Governance',
    architecturalRole: 'Final security hardening, POPIA compliance verification, and infrastructure audit',
  },
  {
    id: 'INF-14',
    component: 'Deployment and Environment Checks',
    sprints: ['S5'],
    category: 'CI/CD & Release',
    architecturalRole: 'End-to-end release pipeline verification and cross-service integration validation',
  },
  {
    id: 'INF-15',
    component: 'UAT Environment',
    sprints: ['S5'],
    category: 'Environment',
    architecturalRole: 'Dedicated stakeholder acceptance testing environment with seeded UAT users and test data',
  },
];

export const INITIAL_SPRINTS: Sprint[] = [
  {
    id: 'S1',
    number: 1,
    name: 'Sprint 1',
    theme: 'Foundation, Authentication and AWS Setup',
    shortTheme: 'Foundation & AWS',
    duration: '2 weeks',
    weeks: 'Weeks 1–2',
    startWeek: 1,
    endWeek: 2,
    color: '#3182CE',
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
      },
    ],
  },
  {
    id: 'S2',
    number: 2,
    name: 'Sprint 2',
    theme: 'Administration, Building, Staff and Data Management',
    shortTheme: 'Admin & Data Mgmt',
    duration: '2 weeks',
    weeks: 'Weeks 3–4',
    startWeek: 3,
    endWeek: 4,
    color: '#38A169',
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
    color: '#805AD5',
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
    color: '#DD6B20',
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
      },
    ],
  },
  {
    id: 'S5',
    number: 5,
    name: 'Sprint 5',
    theme: 'AI, IoT Readiness, ISO Alignment and MVP Completion',
    shortTheme: 'AI, IoT & Completion',
    duration: '2 weeks',
    weeks: 'Weeks 9–10',
    startWeek: 9,
    endWeek: 10,
    color: '#E53E3E',
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
      },
    ],
  },
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'M1',
    step: 1,
    name: 'MVP Development Start',
    shortName: 'MVP Start',
    trigger: 'Start of Sprint 1 (Week 1)',
    sprintBoundary: 'S1 Start',
    iconType: 'circle',
  },
  {
    id: 'M2',
    step: 2,
    name: 'Core Platform Foundation Complete',
    shortName: 'Foundation',
    trigger: 'End of Sprint 1 (Week 2)',
    sprintBoundary: 'End S1',
    iconType: 'diamond',
  },
  {
    id: 'M3',
    step: 3,
    name: 'Administration and Data Management Complete',
    shortName: 'Admin / Data',
    trigger: 'End of Sprint 2 (Week 4)',
    sprintBoundary: 'End S2',
    iconType: 'diamond',
  },
  {
    id: 'M4',
    step: 4,
    name: 'Core User Workflows Complete',
    shortName: 'User Workflows',
    trigger: 'End of Sprint 3 (Week 6)',
    sprintBoundary: 'End S3',
    iconType: 'diamond',
  },
  {
    id: 'M5',
    step: 5,
    name: 'Energy Intelligence and Operational Features Complete',
    shortName: 'Energy Intelligence',
    trigger: 'End of Sprint 4 (Week 8)',
    sprintBoundary: 'End S4',
    iconType: 'diamond',
  },
  {
    id: 'M6',
    step: 6,
    name: 'MVP Development Complete',
    shortName: 'MVP Complete',
    trigger: 'End of Sprint 5 (Week 10 · 2.5 Months Max)',
    sprintBoundary: 'End S5',
    iconType: 'diamond',
  },
  {
    id: 'M7',
    step: 7,
    name: 'UAT Start',
    shortName: 'UAT Start',
    trigger: 'After Sprint 5 and completion of UAT readiness checks',
    sprintBoundary: 'Post-S5',
    iconType: 'circle',
  },
  {
    id: 'M8',
    step: 8,
    name: 'UAT Sign-Off',
    shortName: 'UAT Sign-Off',
    trigger: 'After agreed acceptance criteria have been successfully completed',
    sprintBoundary: 'Go-Live',
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
    mitigation: 'Provision AWS af-south-1 account and IAM credentials prior to Sprint 1 Day 1; use containerized PostgreSQL/TimescaleDB for immediate local schema work.',
  },
  {
    id: 'R-S1-2',
    sprintId: 'S1',
    title: 'Database architecture decision delayed',
    likelihood: 'Medium',
    impact: 'High',
    affectedTickets: ['S1-T05', 'S1-T06'],
    mitigation: 'Confirm RDS PostgreSQL + TimescaleDB time-series partitioning approach in Week 1.',
  },
  {
    id: 'R-S1-3',
    sprintId: 'S1',
    title: 'Unclear requirements or business rules',
    likelihood: 'Low',
    impact: 'Medium',
    affectedTickets: ['S1-T01', 'S1-T02', 'S1-T03'],
    mitigation: 'Enforce GreenBDG MVP Proposal V1.3 as the locked requirements baseline.',
  },
  {
    id: 'R-S2-1',
    sprintId: 'S2',
    title: 'Poor or incomplete source data',
    likelihood: 'High',
    impact: 'High',
    affectedTickets: ['S2-T02', 'S2-T03', 'S2-T06'],
    mitigation: 'Provide standardized CSV/XLSX data-upload templates with strict row-level schema validation.',
  },
  {
    id: 'R-S2-2',
    sprintId: 'S2',
    title: 'Upload requirements not clearly defined',
    likelihood: 'Medium',
    impact: 'Medium',
    affectedTickets: ['S2-T01', 'S2-T04', 'S2-T05'],
    mitigation: 'Freeze CSV/XLSX column definitions and document upload constraints before Sprint 2.',
  },
  {
    id: 'R-S2-3',
    sprintId: 'S2',
    title: 'Missing test data',
    likelihood: 'Medium',
    impact: 'Medium',
    affectedTickets: ['S2-T04', 'S2-T06'],
    mitigation: 'Prepare representative commercial building datasets ahead of Sprint 2 testing.',
  },
  {
    id: 'R-S3-1',
    sprintId: 'S3',
    title: 'Data quality problems',
    likelihood: 'High',
    impact: 'Medium',
    affectedTickets: ['S3-T02', 'S3-T03', 'S3-T05', 'S3-T06', 'S3-T07'],
    mitigation: 'Enforce pre-ingestion sanitization and unit normalization (kWh, kL, Litres) on utility uploads.',
  },
  {
    id: 'R-S3-2',
    sprintId: 'S3',
    title: 'Missing calculation rules',
    likelihood: 'Medium',
    impact: 'High',
    affectedTickets: ['S3-T01', 'S3-T02', 'S3-T04', 'S3-T05'],
    mitigation: 'Obtain stakeholder sign-off on EPC grading bands and building intensity formulas prior to Sprint 3.',
  },
  {
    id: 'R-S3-3',
    sprintId: 'S3',
    title: 'Missing or incorrect emission factors',
    likelihood: 'Low',
    impact: 'High',
    affectedTickets: ['S3-T04'],
    mitigation: 'Parameterize South African grid and fuel emission factors in the database.',
  },
  {
    id: 'R-S4-1',
    sprintId: 'S4',
    title: 'Water or fuel data may be incomplete',
    likelihood: 'High',
    impact: 'High',
    affectedTickets: ['S4-T06', 'S4-T07'],
    mitigation: 'Support partial-period reconciliation and explicit data-completeness indicators.',
  },
  {
    id: 'R-S4-2',
    sprintId: 'S4',
    title: 'Calculation rules may require stakeholder clarification',
    likelihood: 'Medium',
    impact: 'High',
    affectedTickets: ['S4-T01', 'S4-T03', 'S4-T06', 'S4-T07'],
    mitigation: 'Confirm Pareto water-balance and fuel-reconciliation calculation rules before Sprint 4.',
  },
  {
    id: 'R-S4-3',
    sprintId: 'S4',
    title: 'Additional alert requirements could affect sprint capacity',
    likelihood: 'Medium',
    impact: 'Medium',
    affectedTickets: ['S4-T02', 'S4-T04', 'S4-T05'],
    mitigation: 'Apply Section 13 Scope Lock: defer non-baseline alert rules to Future Phase.',
  },
  {
    id: 'R-S5-1',
    sprintId: 'S5',
    title: 'Insufficient historical data for AI/predictive analytics',
    likelihood: 'High',
    impact: 'High',
    affectedTickets: ['S5-T01'],
    mitigation: 'Implement statistical anomaly detection and trend forecasting tuned for uploaded MVP datasets.',
  },
  {
    id: 'R-S5-2',
    sprintId: 'S5',
    title: 'IoT integration dependencies',
    likelihood: 'High',
    impact: 'Medium',
    affectedTickets: ['S5-T02'],
    mitigation: 'Deliver the IoT/smart-meter data architecture foundation; only activate live telemetry where devices/APIs are approved.',
  },
  {
    id: 'R-S5-3',
    sprintId: 'S5',
    title: 'Additional ISO requirements',
    likelihood: 'Medium',
    impact: 'Medium',
    affectedTickets: ['S5-T03'],
    mitigation: 'Bound ISO 14001:2026 scope strictly to the agreed Pareto Stakeholder Review environmental records and traceability.',
  },
  {
    id: 'R-S5-4',
    sprintId: 'S5',
    title: 'Critical defects discovered late in the sprint',
    likelihood: 'Medium',
    impact: 'High',
    affectedTickets: ['S5-T04', 'S5-T05', 'S5-T06', 'S5-T07', 'S5-T08', 'S5-T09'],
    mitigation: 'Enforce Definition of Done testing across Sprints 1–4 and dedicate S5-T08 to full system defect resolution.',
  },
];

export const INITIAL_DEPENDENCIES: DependencyItem[] = [
  // Sprint 1 (4)
  { id: 'D-S1-1', sprintId: 'S1', name: 'Approved MVP Proposal V1.3', status: 'Met', stakeholder: 'Executive Sponsor', affectedTickets: ['S1-T01', 'S1-T02', 'S1-T05', 'S1-T06'] },
  { id: 'D-S1-2', sprintId: 'S1', name: 'AWS account/access (South Africa region)', status: 'Pending', stakeholder: 'Client IT / Cloud Admin', affectedTickets: ['S1-T04', 'S1-T05', 'S1-T06'] },
  { id: 'D-S1-3', sprintId: 'S1', name: 'Required domain/environment information', status: 'Pending', stakeholder: 'Client IT', affectedTickets: ['S1-T04'] },
  { id: 'D-S1-4', sprintId: 'S1', name: 'Initial business/user information', status: 'Pending', stakeholder: 'GreenBDG Product Owner', affectedTickets: ['S1-T01', 'S1-T02', 'S1-T03'] },
  // Sprint 2 (5)
  { id: 'D-S2-1', sprintId: 'S2', name: 'Building data', status: 'Pending', stakeholder: 'Portfolio Operations', affectedTickets: ['S2-T02', 'S2-T06'] },
  { id: 'D-S2-2', sprintId: 'S2', name: 'Staff data', status: 'Pending', stakeholder: 'HR / Platform Admin', affectedTickets: ['S2-T01', 'S2-T03'] },
  { id: 'D-S2-3', sprintId: 'S2', name: 'Test data', status: 'Pending', stakeholder: 'QA & Operations Team', affectedTickets: ['S2-T04', 'S2-T06'] },
  { id: 'D-S2-4', sprintId: 'S2', name: 'Required document examples', status: 'Pending', stakeholder: 'Compliance / Facility Lead', affectedTickets: ['S2-T05'] },
  { id: 'D-S2-5', sprintId: 'S2', name: 'Data-upload templates', status: 'Pending', stakeholder: 'Technical & Business Team', affectedTickets: ['S2-T03', 'S2-T04'] },
  // Sprint 3 (7)
  { id: 'D-S3-1', sprintId: 'S3', name: 'Electricity data', status: 'Pending', stakeholder: 'Facility Managers', affectedTickets: ['S3-T03', 'S3-T04', 'S3-T05', 'S3-T07'] },
  { id: 'D-S3-2', sprintId: 'S3', name: 'Water data', status: 'Pending', stakeholder: 'Facility Managers', affectedTickets: ['S3-T05', 'S3-T07'] },
  { id: 'D-S3-3', sprintId: 'S3', name: 'Gas/diesel data', status: 'Pending', stakeholder: 'Facility Managers', affectedTickets: ['S3-T03', 'S3-T04', 'S3-T07'] },
  { id: 'D-S3-4', sprintId: 'S3', name: 'EPC data', status: 'Pending', stakeholder: 'Sustainability Team', affectedTickets: ['S3-T02', 'S3-T07'] },
  { id: 'D-S3-5', sprintId: 'S3', name: 'Building information', status: 'Pending', stakeholder: 'Portfolio Managers', affectedTickets: ['S3-T01', 'S3-T02', 'S3-T05', 'S3-T06'] },
  { id: 'D-S3-6', sprintId: 'S3', name: 'Approved calculation rules', status: 'Pending', stakeholder: 'ESG & Pareto Stakeholders', affectedTickets: ['S3-T01', 'S3-T02', 'S3-T03', 'S3-T04', 'S3-T05'] },
  { id: 'D-S3-7', sprintId: 'S3', name: 'Emission factors where required', status: 'Pending', stakeholder: 'ESG Specialist', affectedTickets: ['S3-T04'] },
  // Sprint 4 (7)
  { id: 'D-S4-1', sprintId: 'S4', name: 'Water data (Pareto Water Balance)', status: 'Pending', stakeholder: 'Pareto / Facility Team', affectedTickets: ['S4-T06'] },
  { id: 'D-S4-2', sprintId: 'S4', name: 'Fuel data (Pareto Fuel Reconciliation)', status: 'Blocked', stakeholder: 'Pareto / Facility Team', affectedTickets: ['S4-T07'] },
  { id: 'D-S4-3', sprintId: 'S4', name: 'Asset data', status: 'Pending', stakeholder: 'Facility Engineering', affectedTickets: ['S4-T03'] },
  { id: 'D-S4-4', sprintId: 'S4', name: 'Service/maintenance information', status: 'Pending', stakeholder: 'Operations Team', affectedTickets: ['S4-T02', 'S4-T03', 'S4-T04'] },
  { id: 'D-S4-5', sprintId: 'S4', name: 'Approved water-balance rules', status: 'Pending', stakeholder: 'Pareto Stakeholder Review', affectedTickets: ['S4-T06'] },
  { id: 'D-S4-6', sprintId: 'S4', name: 'Approved fuel-reconciliation rules', status: 'Blocked', stakeholder: 'Pareto Stakeholder Review', affectedTickets: ['S4-T07'] },
  { id: 'D-S4-7', sprintId: 'S4', name: 'Alert rules', status: 'Pending', stakeholder: 'Operations & Portfolio Lead', affectedTickets: ['S4-T01', 'S4-T04', 'S4-T05'] },
  // Sprint 5 (5)
  { id: 'D-S5-1', sprintId: 'S5', name: 'Historical data for analytics where required', status: 'Pending', stakeholder: 'Data / Portfolio Team', affectedTickets: ['S5-T01', 'S5-T06'] },
  { id: 'D-S5-2', sprintId: 'S5', name: 'AI/analytics requirements', status: 'Met', stakeholder: 'Product Owner', affectedTickets: ['S5-T01'] },
  { id: 'D-S5-3', sprintId: 'S5', name: 'IoT information where applicable', status: 'Blocked', stakeholder: 'Smart-Meter Vendor / IT', affectedTickets: ['S5-T02'] },
  { id: 'D-S5-4', sprintId: 'S5', name: 'ISO 14001:2026 requirements and evidence expectations', status: 'Met', stakeholder: 'Pareto Compliance Reviewer', affectedTickets: ['S5-T03'] },
  { id: 'D-S5-5', sprintId: 'S5', name: 'UAT users, UAT test data & Final acceptance criteria', status: 'Pending', stakeholder: 'All Stakeholders', affectedTickets: ['S5-T04', 'S5-T05', 'S5-T06', 'S5-T07', 'S5-T08', 'S5-T09'] },
];

export const SCOPE_LOCK_CLASSIFICATIONS: ScopeClassificationExample[] = [
  {
    id: 'SC-1',
    category: 'Already in Baseline',
    ruleDescription:
      'Requirements defined in GreenBDG MVP Proposal V1.3 and the specifically instructed Pareto Energy Intelligence & Stakeholder Review additions.',
    items: [
      {
        title: 'Pareto Water Balance Functionality',
        reference: 'Sprint 4 · S4-T06',
        note: 'Incorporated into baseline from Pareto Stakeholder Review.',
      },
      {
        title: 'Pareto Fuel Reconciliation Functionality',
        reference: 'Sprint 4 · S4-T07',
        note: 'Incorporated into baseline from Pareto Stakeholder Review.',
      },
      {
        title: 'ISO 14001:2026 Alignment & Traceability',
        reference: 'Sprint 5 · S5-T03',
        note: 'Environmental evidence, records, and traceability included in MVP scope.',
      },
    ],
  },
  {
    id: 'SC-2',
    category: 'Approved MVP Change',
    ruleDescription:
      'Any new requirement approved for the MVP after the V1.3 baseline must have its sprint impact assessed so the 10-week (2.5-month) delivery limit remains protected.',
    items: [
      {
        title: 'Formal Scope Impact Assessment Rule',
        reference: 'Section 1 & Section 13',
        note: 'The development team is not expected to absorb additional requirements without assessing impact on the agreed 10-week timeline.',
      },
      {
        title: 'Live Smart-Meter Device Integration',
        reference: 'Sprint 5 · S5-T02',
        note: 'Only implemented where required devices, APIs, connectivity, and access are available and formally approved.',
      },
    ],
  },
  {
    id: 'SC-3',
    category: 'Future Phase',
    ruleDescription:
      'Capabilities outside the approved 10-week baseline that are deferred post-MVP to protect the 2.5-month delivery ceiling.',
    items: [
      {
        title: 'Advanced AI & Closed-Loop Optimisation',
        reference: 'Sprint 5 · S5-T01',
        note: 'MVP includes anomaly detection, consumption trends, and basic forecasting; advanced AI/optimisation is excluded unless specifically approved.',
      },
      {
        title: 'Unapproved Post-Baseline Feature Additions',
        reference: 'Section 13 Governance',
        note: 'Routed to Post-MVP Phase 2 backlog to preserve the 5-sprint delivery schedule.',
      },
    ],
  },
];

export const UNIVERSAL_DOD_ITEMS: string[] = [
  'The agreed functionality has been implemented',
  'Code has been reviewed and merged',
  'Required testing has been completed',
  'The functionality has been deployed to Dev',
  'Acceptance criteria have been met',
  'The functionality can be demonstrated',
  'Known issues are documented',
];

export const PM_TOOL_COMPARISON = [
  {
    feature: 'Multi-dimensional SDLC heatmap',
    greenBdg: 'Native, visual',
    genericPm: 'Flat lists only',
  },
  {
    feature: 'Backend service dependency web',
    greenBdg: 'Interactive static graph',
    genericPm: 'Not supported',
  },
  {
    feature: 'Scope Lock timeline protection',
    greenBdg: 'Built-in visual',
    genericPm: 'Manual tracking',
  },
  {
    feature: 'Presentation-first slide deck',
    greenBdg: 'One-click chapters',
    genericPm: 'Separate slides needed',
  },
  {
    feature: 'No accounts, no login, instant share',
    greenBdg: 'Static SPA',
    genericPm: 'Account-based',
  },
  {
    feature: 'Executive 2-minute overview',
    greenBdg: 'Designed for it',
    genericPm: 'Requires setup',
  },
  {
    feature: 'Risk-to-ticket mapping',
    greenBdg: 'Visual, direct',
    genericPm: 'Basic fields',
  },
  {
    feature: 'One-time baseline narrative',
    greenBdg: 'Fixed, clear',
    genericPm: 'Ongoing updates expected',
  },
];
