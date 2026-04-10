export type LocationOption = {
  id: 'abeokuta' | 'lagos' | 'online';
  label: string;
  mode: 'onsite' | 'online';
  description: string;
  perks: string[];
};

export type CohortOption = {
  id: 'january' | 'may' | 'september';
  label: string;
  window: string;
  note: string;
};

export type CurriculumBlock = {
  label: string;
  topics: string[];
};

export type ProgramProject = {
  title: string;
  description: string;
};

export type ProgramDetail = {
  slug: string;
  title: string;
  school: 'Engineering' | 'Product' | 'Data';
  summary: string;
  overview: string;
  onsiteTuition: number;
  onlineTuition: number;
  duration: string;
  schedule: string;
  highlights: string[];
  outcomes: string[];
  projects: ProgramProject[];
  assessment: string[];
  tools: string[];
  roles: string[];
  curriculum: CurriculumBlock[];
  graduationStandard: string;
  heroImage: string;
};

export const locations: LocationOption[] = [
  {
    id: 'abeokuta',
    label: 'Abeokuta Hub (Onsite Primary)',
    mode: 'onsite',
    description:
      'Live instruction in Abeokuta with full workspace access, high-speed internet, and reliable power.',
    perks: [
      'Live classroom experience with instructors',
      'Open-to-close workspace access weekdays',
      'Priority in-person reviews and mentorship',
    ],
  },
  {
    id: 'lagos',
    label: 'Lagos Facility (Online Access)',
    mode: 'onsite',
    description:
      'Work from the Lagos facility while joining live Abeokuta classes online with full programme parity.',
    perks: [
      'Professional workspace, internet, and power',
      'Same live sessions and instructor feedback',
      'No commute to Abeokuta required',
      'Onsite tuition applies for Lagos facility access',
    ],
  },
  {
    id: 'online',
    label: 'Global Online',
    mode: 'online',
    description:
      'Join from anywhere in Africa or globally. Live sessions, recordings, and full community access.',
    perks: [
      'Live instruction with recordings available within 2 hours',
      'Full assignment and feedback parity',
      '15% tuition reduction (online rate)',
    ],
  },
];

export const cohorts: CohortOption[] = [
  {
    id: 'january',
    label: 'January Cohort',
    window: 'Jan - Jun (Cohort 1)',
    note: 'Entry cohort focus with 6-week internal prep window.',
  },
  {
    id: 'may',
    label: 'May Cohort',
    window: 'May - Oct (Cohort 2)',
    note: 'Mid-year intake with full programme parity.',
  },
  {
    id: 'september',
    label: 'September Cohort',
    window: 'Sep - Feb (Cohort 3)',
    note: 'Year-end intake for learners and career switchers.',
  },
];

export const schedule = {
  days: 'Monday to Wednesday',
  time: '10:00am - 2:00pm WAT',
  note:
    'Assignments and project work run Thursday to Sunday with TA support on Discord and WhatsApp.',
};

export const programs: ProgramDetail[] = [
  {
    slug: 'frontend-engineering',
    title: 'Frontend Engineering',
    school: 'Engineering',
    summary:
      'Build modern AI-integrated web applications with Next.js, React, TanStack Query, and Tailwind CSS.',
    overview:
      'Graduate with 4+ deployed applications, a live portfolio, and the ability to integrate AI features into real frontend products.',
    onsiteTuition: 150_000,
    onlineTuition: 127_500,
    duration: '6 months learning + 3 months post-grad support',
    schedule: 'Mon - Wed, 10:00am - 2:00pm WAT',
    highlights: [
      'Week-by-week depth across React, Next.js, and AI integration',
      'Real project delivered by Month 2 with live expert reviews',
      'Business modules covering pricing, contracts, and client management',
    ],
    outcomes: [
      'Ship production-ready Next.js applications with modern routing and data fetching.',
      'Build AI-enhanced interfaces with streaming responses and cost controls.',
      'Deliver a portfolio with 4+ deployed projects and documented architecture decisions.',
      'Collaborate in cross-school product teams with designers, PMs, and data analysts.',
    ],
    projects: [
      {
        title: 'Real Project I - Local Service Marketplace',
        description:
          'A full-featured web app with listings, filters, and booking requests built and deployed by Month 3.',
      },
      {
        title: 'AI Feature Build',
        description:
          'Add an AI-powered feature that solves a real user workflow problem (not just a chatbot).',
      },
      {
        title: 'Cross-School Product Build',
        description:
          'Frontend ownership for a multi-disciplinary product delivered to an industry partner.',
      },
    ],
    assessment: [
      'Weekly assignments and code reviews with instructor feedback.',
      'Live expert reviews at key milestones (Weeks 8, 12, 19).',
      'Portfolio audit + graduation demo scored against readiness checklist.',
    ],
    tools: [
      'Next.js',
      'React',
      'TanStack Query',
      'Tailwind CSS',
      'Material UI',
      'GitHub Copilot',
      'Cursor',
      'v0.dev',
      'Claude / ChatGPT',
    ],
    roles: [
      'Frontend Engineer',
      'React Developer',
      'UI Engineer',
      'Web Application Developer',
      'Frontend Product Engineer',
    ],
    curriculum: [
      {
        label: 'Week 1 - Dev Environment & Professional Habits',
        topics: [
          'VS Code mastery and professional tooling setup',
          'Git workflow: commits, branching, merges, GitHub Classroom',
          'AI-assisted development: Copilot install, trust-but-verify mindset',
          'Assignment: publish a GitHub profile page and explain AI edits',
        ],
      },
      {
        label: 'Week 2 - Web Foundations',
        topics: [
          'How the internet works: HTTP/S, DNS, request-response',
          'Semantic HTML and accessibility fundamentals',
          'Intro to CSS: selectors, specificity, the cascade',
          'Assignment: semantic portfolio skeleton',
        ],
      },
      {
        label: 'Week 3 - CSS Mastery',
        topics: [
          'Box model, layout, flex and grid systems',
          'Tailwind CSS setup and utility-first workflow',
          'Component layouts: navigation, heroes, cards, grids',
          'Assignment: full Tailwind styling of Week 2 portfolio',
        ],
      },
      {
        label: 'Week 4 - JavaScript I',
        topics: [
          'Variables, data types, control flow, functions',
          'DOM manipulation and event handling',
          'AI-assisted debugging workflow',
          'Assignment: interactive to-do list app',
        ],
      },
      {
        label: 'Week 5 - JavaScript II (Modern & Async)',
        topics: [
          'ES6+ syntax, async/await, promises, Fetch API',
          'Handling loading and error states',
          'Assignment: weather app with a public API',
        ],
      },
      {
        label: 'Week 6 - React I (Component Model)',
        topics: [
          'JSX, functional components, props, composition',
          'Conditional and list rendering patterns',
          'Assignment: reusable UI component library',
        ],
      },
      {
        label: 'Week 7 - React II (State & Forms)',
        topics: [
          'useState, controlled inputs, form validation',
          'React Hook Form workflows',
          'Assignment: multi-step registration form with localStorage',
        ],
      },
      {
        label: 'Week 8 - Real Project I + Industry Expert Session',
        topics: [
          'Launch Real Project I with a real brief',
          'Live code review by practising frontend engineer',
          'AI-assisted planning and technical spec generation',
        ],
      },
      {
        label: 'Week 9 - TanStack Query',
        topics: [
          'Server state vs client state, useQuery and useMutation',
          'Caching, pagination, optimistic updates',
          'Assignment: refactor Real Project I with TanStack Query',
        ],
      },
      {
        label: 'Week 10 - React Router & App Architecture',
        topics: [
          'Routing, protected routes, authentication guards',
          'Zustand for global state',
          'Assignment: add navigation + auth flow to Real Project I',
        ],
      },
      {
        label: 'Week 11 - Next.js',
        topics: [
          'App Router mental model, layouts, metadata, SEO',
          'Server vs client components and data strategy',
          'Assignment: migrate Real Project I to Next.js and deploy',
        ],
      },
      {
        label: 'Week 12 - Business Module I + Project Review',
        topics: [
          'Pricing, scoping, contracts, client communication',
          'Expert review of Real Project I with feedback',
        ],
      },
      {
        label: 'Week 13 - TypeScript',
        topics: [
          'Types, interfaces, generics, type guards',
          'TypeScript in React and custom hooks',
          'Assignment: add full TypeScript to Real Project I',
        ],
      },
      {
        label: 'Week 14 - AI Integration in Frontend Apps',
        topics: [
          'OpenAI / Claude API basics and streaming UI',
          'Vercel AI SDK and prompt engineering for product features',
          'Assignment: add an AI feature to Real Project I',
        ],
      },
      {
        label: 'Week 15 - Performance, Testing & Code Quality',
        topics: [
          'React performance patterns and Lighthouse auditing',
          'Testing with Vitest and React Testing Library',
          'Assignment: audit + write 5 meaningful tests',
        ],
      },
      {
        label: 'Week 16 - Cross-School Project Kick-off',
        topics: [
          'Multi-disciplinary teams formed across tracks',
          'Product brief introduced by industry partner',
          'Deliverable: technical plan + wireframes + data brief',
        ],
      },
      {
        label: 'Week 17 - Cross-School Project Sprint 1',
        topics: [
          'Core feature build with API integration',
          'Daily async stand-ups and blocker escalation',
          'Mid-sprint industry check-in',
        ],
      },
      {
        label: 'Week 18 - Business Module II + Career Prep',
        topics: [
          'Salary vs freelancing vs equity trade-offs',
          'LinkedIn optimisation + portfolio reviews',
          'Assignment: update every project README with portfolio link',
        ],
      },
      {
        label: 'Week 19 - Cross-School Project Sprint 2',
        topics: [
          'Final polish, user testing, performance pass',
          'Expert panel review across tech, product, and data',
        ],
      },
      {
        label: 'Week 20 - Portfolio Audit & Graduation Brief',
        topics: [
          'Professional readiness checklist',
          'Graduation project scope and architecture plan',
          'Deployment pipeline configured',
        ],
      },
      {
        label: 'Week 21-22 - Graduation Project Sprint',
        topics: [
          'Build core and secondary features with AI integration',
          'Documentation, user testing, and feedback iteration',
        ],
      },
      {
        label: 'Week 23 - Final Polish & Presentation',
        topics: [
          'Performance audit (target Lighthouse 85+)',
          'Demo prep, Q&A rehearsal, career document check',
        ],
      },
      {
        label: 'Week 24 - Graduation Day',
        topics: [
          'Live demo and panel Q&A',
          'Certificates issued and alumni network activation',
        ],
      },
    ],
    graduationStandard:
      '4+ deployed projects on public URLs, 100+ GitHub commits, AI feature integration, and the ability to ship a production Next.js app from a brief in under 5 days.',
    heroImage:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'backend-engineering',
    title: 'Backend Engineering',
    school: 'Engineering',
    summary:
      'Deep backend engineering with NestJS, PostgreSQL, Prisma ORM, and RESTful API design.',
    overview:
      'Includes AI model integration and comprehensive payment gateway coverage: Paystack, Flutterwave, and Stripe.',
    onsiteTuition: 200_000,
    onlineTuition: 170_000,
    duration: '6 months learning + 3 months post-grad support',
    schedule: 'Mon - Wed, 10:00am - 2:00pm WAT',
    highlights: [
      'Production-grade APIs with JWT auth, RBAC, and multi-tenancy',
      'Payment gateway mastery (Paystack required) and AI service abstraction',
      'Industry live brief with CTO review',
    ],
    outcomes: [
      'Design and ship secure REST APIs with JWT auth, RBAC, and Swagger documentation.',
      'Integrate Paystack (required) plus optional multi-gateway payment flows.',
      'Build AI-powered backend services with cost controls and provider abstraction.',
      'Deploy and maintain production APIs with CI/CD and performance tuning.',
    ],
    projects: [
      {
        title: 'Authenticated API Platform',
        description:
          'Build a multi-tenant API with user roles, refresh tokens, and audit logging.',
      },
      {
        title: 'Payments + AI Integration',
        description:
          'Implement Paystack payments with webhooks and AI service endpoints.',
      },
      {
        title: 'Industry Live Brief',
        description:
          'Deliver a production-ready API for an industry partner with CTO review.',
      },
    ],
    assessment: [
      'Monthly architecture reviews and code quality checks.',
      'Payment integration verification with webhook testing.',
      'Graduation project demo plus security audit checklist.',
    ],
    tools: [
      'Node.js',
      'NestJS',
      'PostgreSQL',
      'Prisma ORM',
      'Redis',
      'Docker',
      'GitHub Actions',
      'OpenAI API',
      'Claude API',
      'Paystack',
    ],
    roles: [
      'Backend Engineer',
      'API Engineer',
      'Platform Engineer',
      'Infrastructure-leaning Software Engineer',
      'Systems Engineer',
    ],
    curriculum: [
      {
        label: 'Month 1 - Backend Foundations & TypeScript',
        topics: [
          'Node.js event loop, modules, async patterns',
          'NestJS controllers, providers, modules, dependency injection',
          'TypeScript strict typing and decorators',
          'PostgreSQL + Prisma schema design and migrations',
        ],
      },
      {
        label: 'Month 2 - API Design & Authentication',
        topics: [
          'REST API design principles and Swagger documentation',
          'JWT auth with refresh tokens and RBAC guards',
          'Security fundamentals: validation, rate limiting, CORS',
          'Real Project I: fully authenticated API with expert review',
        ],
      },
      {
        label: 'Month 3 - Advanced Backend Patterns',
        topics: [
          'Multi-tenancy enforcement with Prisma middleware',
          'Redis caching, pub/sub, background jobs (BullMQ)',
          'File storage with S3/R2 and presigned URLs',
          'Transactional email and SMS integrations',
        ],
      },
      {
        label: 'Month 4 - AI Integration & Payment Gateways',
        topics: [
          'OpenAI + Claude APIs with streaming and embeddings',
          'AI service abstraction and cost management',
          'Paystack, Flutterwave, and Stripe integrations',
          'Payment abstraction layer and idempotent webhooks',
        ],
      },
      {
        label: 'Month 5 - Production Engineering & Industry Immersion',
        topics: [
          'Docker, CI/CD with GitHub Actions, staging/production gates',
          'Database performance tuning and query optimisation',
          'Testing strategy: unit, integration, multi-tenant patterns',
          'Industry live brief with CTO review',
        ],
      },
      {
        label: 'Month 6 - Graduation Project',
        topics: [
          'Multi-tenant, authenticated, AI-integrated API',
          'Security audit (OWASP Top 10) and remediation',
          'Full Swagger documentation and deployment guide',
        ],
      },
    ],
    graduationStandard:
      'Deployed production API with JWT auth, RBAC, AI integration, Paystack payments, and 70%+ test coverage. Can explain architectural decisions confidently.',
    heroImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'product-design',
    title: 'Product Design (UI/UX)',
    school: 'Product',
    summary:
      'Research-to-prototype design using Figma, AI-assisted prototyping, and end-to-end design sprints.',
    overview:
      'Graduate with 5 documented case studies, design system mastery, and developer-ready handoff packs.',
    onsiteTuition: 130_000,
    onlineTuition: 110_500,
    duration: '6 months learning + 3 months post-grad support',
    schedule: 'Mon - Wed, 10:00am - 2:00pm WAT',
    highlights: [
      'Design foundations, accessibility, and high-fidelity prototyping',
      'Live industry brief and stakeholder presentation',
      'Design systems + developer handoff best practices',
    ],
    outcomes: [
      'Run end-to-end design sprints with research, prototyping, and testing.',
      'Deliver a professional design system with tokens and responsive breakpoints.',
      'Ship 5 full case studies including a live redesign project.',
      'Collaborate with engineers and PMs using handoff best practices.',
    ],
    projects: [
      {
        title: 'Real Product Redesign',
        description:
          'Research-led redesign of a Nigerian digital product with usability testing.',
      },
      {
        title: 'Design System Build',
        description:
          'Create a reusable component library with tokens and responsive guidance.',
      },
      {
        title: 'Industry Live Brief',
        description:
          'Present a stakeholder-ready prototype and roadmap for a partner company.',
      },
    ],
    assessment: [
      'Weekly critiques and portfolio reviews.',
      'User research documentation and synthesis quality checks.',
      'Graduation case study presentation with expert panel feedback.',
    ],
    tools: [
      'Figma',
      'Galileo AI',
      'DALL-E',
      'FigJam',
      'Notion',
      'Maze / Useberry',
      'Loom',
    ],
    roles: [
      'Product Designer',
      'UI/UX Designer',
      'Interaction Designer',
      'UX Researcher (Junior)',
      'Design Systems Specialist',
    ],
    curriculum: [
      {
        label: 'Month 1 - Design Foundations',
        topics: [
          'Visual hierarchy, typography, colour theory, grid systems',
          'Figma mastery from scratch to component library',
          'Accessibility and WCAG fundamentals',
        ],
      },
      {
        label: 'Month 2 - User Research',
        topics: [
          'Interview scripting, facilitation, and synthesis',
          'Personas, journey maps, opportunity statements',
          'AI-assisted transcript analysis',
        ],
      },
      {
        label: 'Month 3 - Wireframing to High-Fidelity',
        topics: [
          'Information architecture and prototyping',
          'Real Project I: redesign a Nigerian digital product',
        ],
      },
      {
        label: 'Month 4 - Design Systems & Handoff',
        topics: [
          'Design tokens, responsive breakpoints, dark mode',
          'Developer handoff: Inspect mode, specs, CSS export',
          'Cross-school project design leadership',
        ],
      },
      {
        label: 'Month 5 - Industry Immersion + Business Module',
        topics: [
          'Live design brief from industry partner',
          'Design agency economics, pricing, portfolio positioning',
        ],
      },
      {
        label: 'Month 6 - Graduation Project',
        topics: [
          'End-to-end product design with usability testing report',
          'Design system documentation and handoff package',
        ],
      },
    ],
    graduationStandard:
      '5 full case studies, end-to-end research and prototypes, and a production-ready design system with developer handoff.',
    heroImage:
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'product-management',
    title: 'Product Management',
    school: 'Product',
    summary:
      'From idea to shipped product: discovery, roadmapping, PRDs, sprint execution, and stakeholder management.',
    overview:
      'Graduate ready to lead product teams with AI-accelerated workflows and commercial reasoning.',
    onsiteTuition: 140_000,
    onlineTuition: 119_000,
    duration: '6 months learning + 3 months post-grad support',
    schedule: 'Mon - Wed, 10:00am - 2:00pm WAT',
    highlights: [
      'Discovery, opportunity sizing, and roadmap creation',
      'Cross-school product leadership in a live build',
      'Metrics, growth loops, and stakeholder pitch',
    ],
    outcomes: [
      'Lead discovery with research, opportunity sizing, and PRD creation.',
      'Run agile rituals and manage cross-functional stakeholders.',
      'Define success metrics and build growth loops for products.',
      'Deliver a portfolio-ready product brief and live stakeholder pitch.',
    ],
    projects: [
      {
        title: 'Discovery Sprint',
        description:
          'Research and validate a real user problem with personas and opportunity sizing.',
      },
      {
        title: 'Cross-School Product Lead',
        description:
          'Lead the multi-disciplinary team through sprint planning and delivery.',
      },
      {
        title: 'Graduation Product Pitch',
        description:
          'Produce a full PRD, roadmap, and stakeholder pitch for a live brief.',
      },
    ],
    assessment: [
      'PRD and roadmap quality reviews.',
      'Stakeholder management simulations and feedback.',
      'Live pitch graded against clarity and business reasoning.',
    ],
    tools: [
      'Notion',
      'Jira',
      'Figma',
      'Miro',
      'Google Workspace',
      'Claude / ChatGPT',
    ],
    roles: [
      'Product Manager',
      'Product Operations Associate',
      'Associate Product Manager',
      'Growth Product Analyst',
      'Product Owner',
    ],
    curriculum: [
      {
        label: 'Month 1 - Product Thinking',
        topics: [
          'Product vs project mindset and JTBD framework',
          'Problem discovery and user insight analysis',
          'AI-assisted feedback synthesis',
        ],
      },
      {
        label: 'Month 2 - Discovery Toolkit',
        topics: [
          'User interviews, opportunity sizing, competitive mapping',
          'Problem statements and persona creation',
        ],
      },
      {
        label: 'Month 3 - Roadmapping & Requirements',
        topics: [
          'PRD structure, user stories, acceptance criteria',
          'Prioritisation frameworks (MoSCoW, RICE, ICE)',
          'OKRs and avoiding vanity metrics',
        ],
      },
      {
        label: 'Month 4 - Agile Execution & Cross-School Project',
        topics: [
          'Scrum ceremonies, backlog grooming, stakeholder management',
          'Lead the multi-disciplinary product build',
        ],
      },
      {
        label: 'Month 5 - Metrics, Growth & Business Module',
        topics: [
          'Success metrics, instrumentation, A/B testing',
          'PM compensation in Nigeria and career ladders',
        ],
      },
      {
        label: 'Month 6 - Graduation Project',
        topics: [
          'Full product brief, PRD, roadmap, and stakeholder pitch',
          '10-minute live presentation',
        ],
      },
    ],
    graduationStandard:
      'Complete product brief with research summary, PRD, roadmap, success metrics, and stakeholder pitch.',
    heroImage:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics',
    school: 'Data',
    summary:
      'Python, SQL, Excel, Power BI, and Tableau for business intelligence and storytelling with data.',
    overview:
      'Graduate ready to turn raw data into clear business recommendations with AI-accelerated workflows.',
    onsiteTuition: 170_000,
    onlineTuition: 144_500,
    duration: '6 months learning + 3 months post-grad support',
    schedule: 'Mon - Wed, 10:00am - 2:00pm WAT',
    highlights: [
      'Shared data foundations plus deep analytics track',
      'Industry live brief with real business dataset',
      'Graduation dashboard + executive presentation',
    ],
    outcomes: [
      'Clean and analyze complex datasets using SQL and Python.',
      'Build executive-ready dashboards in Power BI or Tableau.',
      'Generate AI-assisted insight narratives for business stakeholders.',
      'Deliver a full analytics portfolio with a live presentation.',
    ],
    projects: [
      {
        title: 'Business Dataset Analysis',
        description:
          'End-to-end analysis of a Nigerian business dataset with actionable insights.',
      },
      {
        title: 'BI Dashboard Build',
        description:
          'Interactive dashboard with KPIs, filters, and executive summary.',
      },
      {
        title: 'Industry Live Brief',
        description:
          'Deliver an analysis and dashboard for a real partner company dataset.',
      },
    ],
    assessment: [
      'SQL proficiency tests and data cleaning assignments.',
      'Dashboard quality and storytelling evaluations.',
      'Graduation presentation scored by industry analysts.',
    ],
    tools: [
      'Python',
      'SQL',
      'Excel',
      'Power BI',
      'Tableau',
      'Pandas',
      'Seaborn',
      'Claude / ChatGPT',
    ],
    roles: [
      'Data Analyst',
      'Business Intelligence Analyst',
      'Reporting Analyst',
      'Analytics Associate',
      'Data Storyteller',
    ],
    curriculum: [
      {
        label: 'Month 1 - Shared Data Foundations',
        topics: [
          'Python fundamentals, Jupyter/Colab workflows',
          'Statistics basics and Excel data cleaning',
          'AI-assisted analysis and reproducible version control',
        ],
      },
      {
        label: 'Month 2 - SQL & Data Querying',
        topics: [
          'PostgreSQL joins, window functions, CTEs',
          'AI-assisted query generation and optimisation',
        ],
      },
      {
        label: 'Month 3 - Python for Analytics',
        topics: [
          'Pandas, NumPy, and data cleaning workflows',
          'Data visualisation with Matplotlib and Seaborn',
          'Real Project I: end-to-end business dataset analysis',
        ],
      },
      {
        label: 'Month 4 - Business Intelligence Tools',
        topics: [
          'Power BI dashboards and DAX formulas',
          'Tableau storytelling and public portfolio',
          'Industry expert session from fintech analyst',
        ],
      },
      {
        label: 'Month 5 - Advanced Analytics & AI Acceleration',
        topics: [
          'Predictive analytics foundations',
          'AI-assisted EDA and insight narratives',
          'Industry live brief with messy dataset delivery',
        ],
      },
      {
        label: 'Month 6 - Graduation Project',
        topics: [
          'Full analytics project with dashboard and executive presentation',
          'Graduate benchmark: actionable business recommendation',
        ],
      },
    ],
    graduationStandard:
      'Complete analytics portfolio: SQL, Python analysis, Power BI dashboard, and a business recommendation that a CEO can act on.',
    heroImage:
      'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'data-science',
    title: 'Data Science',
    school: 'Data',
    summary:
      'Machine learning, statistical modelling, and neural networks with Python, scikit-learn, and TensorFlow.',
    overview:
      'Includes AI-powered application building with OpenAI and HuggingFace APIs.',
    onsiteTuition: 170_000,
    onlineTuition: 144_500,
    duration: '6 months learning + 3 months post-grad support',
    schedule: 'Mon - Wed, 10:00am - 2:00pm WAT',
    highlights: [
      'Mathematics foundations + ML pipeline mastery',
      'Deep learning, NLP, and applied LLM integration',
      'Graduation project: deployed ML system',
    ],
    outcomes: [
      'Build and evaluate machine learning models with scikit-learn.',
      'Deploy ML systems with FastAPI and production-grade endpoints.',
      'Integrate LLMs and retrieval pipelines for applied AI products.',
      'Present model performance to non-technical stakeholders.',
    ],
    projects: [
      {
        title: 'ML Model Sprint',
        description:
          'Train, evaluate, and improve a model on a real Nigerian dataset.',
      },
      {
        title: 'Applied LLM Project',
        description:
          'Build an AI-powered data application using OpenAI or HuggingFace APIs.',
      },
      {
        title: 'Deployed ML System',
        description:
          'End-to-end model deployment with REST inference and monitoring.',
      },
    ],
    assessment: [
      'Model evaluation reviews with precision/recall benchmarks.',
      'Deployment readiness and API reliability checks.',
      'Graduation demo plus stakeholder explanation session.',
    ],
    tools: [
      'Python',
      'scikit-learn',
      'TensorFlow / Keras',
      'HuggingFace',
      'FastAPI',
      'OpenAI API',
      'Claude API',
    ],
    roles: [
      'Data Scientist (Junior)',
      'Machine Learning Engineer (Associate)',
      'AI Analyst',
      'Applied ML Specialist',
      'Data Science Consultant',
    ],
    curriculum: [
      {
        label: 'Month 1 - Shared Data Foundations',
        topics: [
          'Python fundamentals, Jupyter/Colab workflows',
          'Statistics basics and Excel data cleaning',
          'AI-assisted analysis and reproducible version control',
        ],
      },
      {
        label: 'Month 2 - Mathematics for Data Science',
        topics: [
          'Linear algebra, probability, hypothesis testing',
          'NumPy and SciPy for mathematical computing',
        ],
      },
      {
        label: 'Month 3 - Machine Learning Foundations',
        topics: [
          'Supervised and unsupervised learning',
          'scikit-learn pipelines and model evaluation',
          'Real Project I on Nigerian dataset',
        ],
      },
      {
        label: 'Month 4 - Deep Learning & NLP',
        topics: [
          'Neural networks, TensorFlow/Keras workflows',
          'Text classification, sentiment analysis, transfer learning',
        ],
      },
      {
        label: 'Month 5 - Applied AI & Industry Immersion',
        topics: [
          'LLM APIs, RAG pipelines, and AI-powered data apps',
          'HuggingFace deployment and inference endpoints',
          'Industry expert session on production ML systems',
        ],
      },
      {
        label: 'Month 6 - Graduation Project',
        topics: [
          'End-to-end ML system with deployment and REST inference',
          'Graduate benchmark: explain model performance to stakeholders',
        ],
      },
    ],
    graduationStandard:
      'Deployed ML system with a live inference endpoint, documented evaluation, and stakeholder-ready explanations.',
    heroImage:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
];

export const programBySlug = Object.fromEntries(programs.map((program) => [program.slug, program]));

export function getProgram(slug: string, list: ProgramDetail[] = programs) {
  if (list === programs) {
    return programBySlug[slug];
  }
  return list.find((program) => program.slug === slug);
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getBaseTuition(
  program: ProgramDetail,
  locationId: LocationOption['id'],
  locationList: LocationOption[] = locations
) {
  const location = locationList.find((item) => item.id === locationId);
  if (!location) return program.onsiteTuition;
  return location.mode === 'online' ? program.onlineTuition : program.onsiteTuition;
}

export type PaymentPlan = 'deposit' | 'full' | 'scholarship';

export function calculateAmountDue(baseTuition: number, paymentPlan: PaymentPlan) {
  if (paymentPlan === 'full') {
    return Math.round(baseTuition * 0.95);
  }
  if (paymentPlan === 'deposit') {
    return Math.round(baseTuition * 0.75);
  }
  return 0;
}
