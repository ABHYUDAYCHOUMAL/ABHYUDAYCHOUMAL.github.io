/**
 * Single source of truth for all portfolio content.
 * Edit this file to change names, copy, projects, contact details, etc.
 * The components import from here so updates propagate everywhere.
 */

export const profile = {
  name: "Abhyuday Choumal",
  shortName: "Abhyuday",
  initials: "AC",
  title: "Full-Stack Developer & Architect",
  taglineWords: ["Architect", "Designer", "Developer", "Engineer"],
  location: "Ratangarh (Churu), Rajasthan, India",
  email: "abhyudaychoumal@gmail.com",
  altEmail: "cs20b1001@iiitr.ac.in",
  phone: "+91 85628 34487",
  resumeUrl: "/Resume_Abhyuday_Choumal.pdf",
} as const;

export const bio = {
  short:
    "I'm a full-stack developer and architect at NirJai Technologies — Computer Science graduate from IIIT Raichur. In seven months I've led a domain-driven FastAPI restructure for Quanted Query with zero downtime, scoped three of four enterprise integrations into Aztute's live healthcare platform on a 15-day window, replaced ten months of specialist work on Navstar Shipping in 3.5 months, and shipped Koyozo — my first iOS app — to the App Store in five weeks.",
  long:
    "Computer Science graduate from IIIT Raichur (under IIT Hyderabad). I work where the system meets the contract — backend architecture, data isolation, integrations, and the unglamorous infrastructure decisions that decide whether a product holds up. In seven months at NirJai I've led a thirteen-phase restructure of an 18,000-line FastAPI monolith with zero regression, owned the ReBAC architecture decision for a B2C→B2B pivot, scoped three of four enterprise integrations into a live healthcare platform on a 23-day window, replaced ten months of specialist work on a B2B shipping platform in 3.5, and shipped my first iOS app on the App Store. I keep documentation as a habit, hold client conversations through delivery, and try to flag ambiguity earlier than I used to.",
} as const;

export const social = {
  github: "https://github.com/ABHYUDAYCHOUMAL",
  linkedin: "https://www.linkedin.com/in/abhyuday-choumal-97aa121aa",
  twitter: "https://x.com/Abhyuday0806",
  instagram: "https://www.instagram.com/cat_the__chad/",
  leetcode: "https://leetcode.com/u/abhyudaychoumal/",
} as const;

export type CareerEntry = {
  role: string;
  company: string;
  location?: string;
  period: string;
  highlight?: string;
  bullets: string[];
  tech?: string[];
  link?: string;
};

export const career: CareerEntry[] = [
  {
    role: "Backend Developer & Architect",
    company: "NirJai Technologies Pvt. Ltd.",
    location: "Delhi, India",
    period: "Sep 2025 — Present",
    highlight: "Quanted Query · Aztute · Koyozo · Navstar Shipping",
    bullets: [
      "Quanted Query — backend architect on a financial analytics platform. Led a restructure codebase into a domain-driven architecture with re-exporting shims, centralized exception hierarchy, and a feature-flagged Neo4j cache — zero downtime, zero regression. Owned the ReBAC migration (Zanzibar / OpenFGA) for the B2C→B2B pivot, including a sixteen-section enterprise architecture plan that became the team's shared reference.",
      "Aztute — Tech Lead of Project on four enterprise integrations into a live Angular/.NET/SQL Server healthcare platform: DocuSign, sFax (after three vendor cycles), and bidirectional Outlook/Teams calendar sync via Microsoft Graph with idempotent event writes, delta tokens, and conflict resolution. Three of four integrations live for the CEO demo on a 15-day window.",
      "Koyozo — first iOS app shipped to the App Store. SwiftUI/MVVM, GameController framework, two-tier NSCache+disk caching with background prefetch — 70% faster loads, 80% fewer API calls. Built from zero in five weeks.",
      "Navstar Shipping (USA) — owned a Zoho Creator/Deluge build replacing ten months of specialist work in 3.5 months. FedEx-native OAuth lifecycle with refresh-on-401, rate-shopping across Ground/Express/International, seven-state pickup status machine, GlobalTrade customs handling, webhook with signature validation. 1,000+ FedEx API references across 18 custom functions.",
    ],
    tech: [
      "FastAPI",
      "Swift",
      ".NET",
      "Microsoft Graph",
      "ReBAC",
      "Neo4j",
      "Redis",
      "Zoho Deluge",
      "Docker",
    ],
  },
  {
    role: "Software Engineer Associate (Intern)",
    company: "Codevidhya India Pvt. Ltd.",
    location: "Jaipur, India",
    period: "Mar 2025 — Aug 2025",
    bullets: [
      "Enhanced LMS portal with responsive HTML/CSS/JS features used by 5,000+ students.",
      "Improved Node.js/Express.js backend — 30% performance gain, 40% lower response times.",
    ],
    tech: ["Node.js", "Express", "JavaScript"],
  },
  {
    role: "Teaching Assistant & Student Leader",
    company: "IIIT Raichur",
    period: "Sep 2020 — Jun 2024",
    bullets: [
      "Mentored 200+ students across Programming, Data Structures, Algorithms, and Probability — held office hours, debugged submissions, and ran exam-prep sessions.",
      "General Secretary (Student Council), Cultural Secretary, and Website Team Master across multiple terms — led campus governance, the cultural fest, and the institute's web presence.",
      "Topped 12th standard at 96% and 10th at 96.17% — alumnus of Sainik School, Chittorgarh.",
    ],
  },
];

export type Project = {
  name: string;
  category: string;
  description: string;
  tech: string[];
  link?: string;
  appStore?: string;
  repo?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    name: "Quanted Query",
    category: "Financial Analytics · Backend",
    description:
      "Backend architect on an AI-driven market exploration platform. Led a domain-driven restructure of a tangled FastAPI codebase — zero downtime, zero regression — and owned the ReBAC migration (Zanzibar / OpenFGA) for the B2C→B2B pivot, layered on top of a Neo4j-cached LLM pipeline with three-state prompt resolution.",
    tech: ["FastAPI", "Neo4j", "RAG", "ReBAC", "Redis", "RabbitMQ"],
    link: "https://query.quanted.com/",
  },
  {
    name: "Aztute Integrations",
    category: "Enterprise · Healthcare",
    description:
      "Tech Lead of Project on four enterprise integrations into a live Angular/.NET/SQL Server healthcare platform — DocuSign, sFax (after three vendor cycles), and bidirectional Outlook/Teams calendar sync via Microsoft Graph with idempotent event writes, delta tokens, and conflict resolution. Three of four integrations live for the CEO demo on a 15-day window.",
    tech: [".NET", "Microsoft Graph", "OAuth", "Webhooks", "Angular"],
    link: "https://app.aztute.com/",
  },
  {
    name: "Koyozo",
    category: "Mobile · Swift · Gaming",
    description:
      "First iOS app shipped to the App Store. Production controller-companion app for an Indian hardware founder — SwiftUI/MVVM, GameController framework, and two-tier NSCache+disk caching with background prefetch. Built from zero in five weeks: 70% faster loads, 80% fewer API calls.",
    tech: ["Swift", "SwiftUI", "MVVM", "GameController"],
    link: "https://koyozo.com/",
    appStore: "https://apps.apple.com/in/app/koyozo-club/id6760929097",
  },
  {
    name: "Navstar Shipping",
    category: "B2B Logistics · Zoho Deluge",
    description:
      "Owned a Zoho Creator/Deluge build for a USA shipping operator, replacing ten months of specialist work in 3.5 months. FedEx-native OAuth lifecycle with refresh-on-401, rate-shopping across Ground/Express/International, a seven-state pickup status machine, GlobalTrade customs handling, and webhook signature validation. 1,000+ FedEx API references across 18 custom functions.",
    tech: ["Zoho Deluge", "FedEx API", "OAuth 2.0", "Webhooks", "RBAC"],
  },
  {
    name: "Examy",
    category: "EdTech · Plagiarism Detection",
    description:
      "Automatic programming assignment judge with Moss-algorithm plagiarism detection, embedded Monaco editor, and Docker-containerized test execution.",
    tech: ["Python", "Django", "Docker", "Monaco"],
    repo: "https://github.com/ABHYUDAYCHOUMAL/Examy",
  },
  {
    name: "Movie Recommender",
    category: "ML · NLP",
    description:
      "NLP-based movie recommendation engine on TMDb data using Word2Vec embeddings and cosine similarity — 85% prediction accuracy.",
    tech: ["Python", "NLTK", "scikit-learn", "Word2Vec"],
    repo: "https://github.com/ABHYUDAYCHOUMAL",
  },
  {
    name: "SkyBar",
    category: "Cloud · Photo Storage",
    description:
      "A cloud photo manager inspired by Google Photos — albums, secure sharing, automatic thumbnailing, and S3-backed storage.",
    tech: ["React", "Django", "MongoDB", "AWS S3"],
  },
];

export type SkillBucket = {
  title: string;
  tagline: string;
  description: string;
  skills: string[];
};

export const skillBuckets: SkillBucket[] = [
  {
    title: "Architect & Design",
    tagline: "Systems · Patterns · Integrations",
    description:
      "Designing services that hold up in production and untangling the ones that don't. Domain-driven architecture, ReBAC over Zanzibar, RAG pipelines, and the unglamorous infrastructure decisions — schema, queues, caches, exception hierarchies — that decide whether a product scales without falling on its face.",
    skills: [
      "Web Applications",
      "iOS Mobile Apps",
      "REST APIs",
      "API Integrations",
      "Microsoft Graph API",
      "Messaging Queues",
      "Auth Integration",
      "Webhooks",
      "RAG",
      "AI / ML",
      "ReBAC (Zanzibar / OpenFGA)",
      "Smart Contracts",
      "Zoho Platform",
      "RBAC Matrices",
    ],
  },
  {
    title: "Creative Developer",
    tagline: "Languages · Frameworks · Tools",
    description:
      "Ramps fast on unfamiliar stacks — Deluge zero-to-production in three months, SwiftUI zero-to-App-Store in five weeks, FastAPI catch-up to architectural ownership in six. Comfortable wiring REST, webhooks, OAuth, and real-time callbacks into systems that didn't speak before.",
    skills: [
      "Python",
      "FastAPI",
      "React",
      "Node.js",
      "MySQL",
      "Docker",
      "JavaScript",
      "TypeScript",
      "Java",
      "Swift",
      "Firebase",
      "C++",
      "Claude",
      "PostgreSQL",
      "Django",
      "MongoDB",
      "Solidity",
      "SwiftUI",
      "Supabase",
      "Redis",
      "Neo4j",
      "Conda",
      "AWS",
      "Zoho Deluge",
    ],
  },
];

export const techStack = [
  "Python",
  "TypeScript",
  "FastAPI",
  "Node.js",
  "React",
  "Docker",
  "PostgreSQL",
  "Redis",
  "Neo4j",
] as const;

export const env = {
  formspreeId: import.meta.env.VITE_FORMSPREE_ID,
  gaId: import.meta.env.VITE_GA_ID,
  rpmAvatarUrl: import.meta.env.VITE_RPM_AVATAR_URL,
  siteUrl: import.meta.env.VITE_SITE_URL,
} as const;
