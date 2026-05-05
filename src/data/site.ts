/**
 * Single source of truth for all portfolio content.
 * Edit this file to change names, copy, projects, contact details, etc.
 * The components import from here so updates propagate everywhere.
 */

export const profile = {
  name: "Abhyuday Choumal",
  shortName: "Abhyuday",
  initials: "AC",
  title: "Backend Developer & Architect",
  taglineWords: ["Architect", "Builder", "Shipper", "Engineer"],
  location: "Ratangarh (Churu), Rajasthan, India",
  email: "abhyudaychoumal8@gmail.com",
  altEmail: "cs20b1001@iiitr.ac.in",
  phone: "+91 85628 34487",
  resumeUrl: "/Resume_Abhyuday_Choumal.pdf",
} as const;

export const bio = {
  short:
    "I'm a backend developer and architect at NirJai Technologies, designing systems that turn natural language into financial insight, ship enterprise integrations under hard deadlines, and put production code on iOS, Android and the web.",
  long:
    "Computer Science graduate from IIIT Raichur (under IIT Hyderabad). I work across the stack but my heart lives in the backend — FastAPI, Node, .NET, distributed systems, RAG pipelines, infrastructure decisions. I led an 18,000-line monolith refactor at NirJai, shipped three mission-critical integrations on a live Angular/.NET platform, architected a production iOS gaming platform, and delivered an enterprise B2B shipping system 450% faster than scoped. I like ownership, hard problems, and code that ships.",
} as const;

export const social = {
  github: "https://github.com/ABHYUDAYCHOUMAL",
  linkedin: "https://www.linkedin.com/in/abhyuday-choumal-97aa121aa",
  twitter: "https://twitter.com/Abhyuda39197919",
  instagram: "https://www.instagram.com/abhyudaychoumal8/",
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
      "Architected backend for Quanted Query — FastAPI, Supabase, LMDB, Redis, RabbitMQ, Neo4j — powering AI-driven market exploration via agentic RAG and multi-model LLM orchestration.",
      "Spearheaded full-scale overhaul of an 18,000+ line monolith into a production-grade domain-driven architecture with centralized services, custom exception hierarchy, and fail-fast validation — zero downtime, zero regression.",
      "Owned end-to-end delivery of three mission-critical integrations into Aztute (DocuSign, eFax, MS Teams Calendar bidirectional sync) on a live Angular/.NET/SQL Server platform under aggressive demo deadlines.",
      "Architected a production iOS gaming platform on Koyozo (SwiftUI/MVVM, GameController, two-tier NSCache+disk caching) — 70% faster loads, 80% fewer API calls. Led Android port for parity with 10,000+ console users.",
      "Delivered Navstar's B2B shipping platform in 2 months — 450% faster than scoped — integrating FedEx, USPS, and Tive IoT webhooks across 50+ routes.",
    ],
    tech: ["FastAPI", "Node.js", ".NET", "Swift", "Redis", "Neo4j", "Docker"],
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
    role: "Teaching Assistant",
    company: "IIIT Raichur",
    period: "Sep 2020 — Jun 2024",
    bullets: [
      "Mentored 200+ students across Programming, Data Structures, Algorithms, and Probability.",
      "General Secretary, Cultural Secretary, and Website Team Master across multiple terms.",
    ],
  },
];

export type Project = {
  name: string;
  category: string;
  description: string;
  tech: string[];
  link?: string;
  repo?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    name: "Quanted Query",
    category: "Financial Analytics · Backend",
    description:
      "Architected the backend for an AI-driven market exploration platform — FastAPI, Supabase, LMDB, Redis, RabbitMQ, Neo4j — with agentic RAG and multi-model LLM orchestration over a domain-driven monolith.",
    tech: ["FastAPI", "Neo4j", "RAG", "LLM", "Redis", "RabbitMQ"],
    link: "https://quantedquery.com",
  },
  {
    name: "Aztute Integrations",
    category: "Enterprise · .NET",
    description:
      "Three mission-critical integrations into a live Angular/.NET/SQL Server workflow platform — DocuSign, eFax, and Microsoft Teams Calendar with bidirectional sync, OAuth lifecycle, and real-time conflict resolution.",
    tech: [".NET", "Angular", "OAuth", "Webhooks", "REST"],
  },
  {
    name: "Koyozo iOS Platform",
    category: "Mobile · Swift",
    description:
      "Production iOS gaming platform with GameController framework, SwiftUI/MVVM, and two-tier NSCache+disk caching with background prefetch — 70% faster loads, 80% fewer API calls. Led Android parity port.",
    tech: ["Swift", "SwiftUI", "MVVM", "Android"],
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
    title: "Architect",
    tagline: "Systems · Backend · Infrastructure",
    description:
      "Designing services that hold up in production. Domain-driven architecture, distributed systems, RAG pipelines, and the unglamorous infrastructure decisions — schema, queues, caches, observability — that decide whether a product scales.",
    skills: [
      "FastAPI",
      "Node.js",
      "Django",
      ".NET",
      "Python",
      "TypeScript",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Neo4j",
      "RabbitMQ",
      "Docker",
      "RAG",
      "LLM Orchestration",
    ],
  },
  {
    title: "Builder",
    tagline: "Web · Mobile · Integrations",
    description:
      "Shipping across surfaces — React for the web, Swift for iOS, Android for parity. Comfortable wiring REST, webhooks, OAuth, and real-time callbacks into systems that didn't speak before.",
    skills: [
      "React",
      "Next.js",
      "Swift",
      "SwiftUI",
      "Android",
      "REST",
      "Webhooks",
      "OAuth",
      "AWS S3",
      "Firebase",
      "Solidity",
      "CUDA",
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
