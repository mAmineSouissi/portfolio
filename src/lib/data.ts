export const profile = {
  name: "Mohamed Amine Souissi",
  firstName: "Amine",
  role: "Full-Stack Developer",
  tagline:
    "Backend (NestJS) · React · Next.js · React Native · TypeScript",
  about:
    "Software Engineering student at ESPRIT, Tunisia (2023–2027). I ship full-stack web and mobile products end to end, from NestJS APIs with real-time systems to clean, animated interfaces in React and Angular. I care about clean architecture, performance, and shipping features that hold up in production.",
  location: "Tunisia",
  email: "aminesouissi682@gmail.com",
  phone: "+216 28-619-391",
  openToWork: true,
  resumeUrl: "/resume.pdf",
  avatar: "/avatar.png",
  socials: [
    { platform: "GitHub", url: "https://github.com/mAmineSouissi" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/mAmineSoussi" },
    { platform: "Email", url: "mailto:aminesouissi682@gmail.com" },
  ],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "French", level: "Professional" },
    { name: "English", level: "Professional" },
  ],
  education: {
    degree: "Software Engineering (Cycle d'Ingénieur)",
    school: "ESPRIT",
    period: "2023 to 2027",
    focus: "Full-stack development, web & mobile architectures, applied AI",
  },
} as const;

export type ProjectStatus = "live" | "private-demo" | "in-progress";

export type Project = {
  title: string;
  year: string;
  category: string;
  summary: string;
  description: string;
  tech: string[];
  status: ProjectStatus;
  liveUrl?: string;
  image?: string;
  githubUrl?: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    title: "K-Trait Connect Hub",
    category: "B2B SaaS",
    year: "2025",
    summary: "Multi-tenant B2B construction SaaS with role-based dashboards.",
    description:
      "A B2B platform with fine-grained role-based access and permissions, invoicing/expense workflows, project management and reporting. Real-time chat and document sharing via Supabase Realtime.",
    tech: ["Next.js", "TypeScript", "Supabase", "React Query", "Zustand"],
    status: "live",
    liveUrl: "https://www.ktrait-konstruction.com/",
    image: "/projects/ktrait.jpg",
    featured: true,
  },
  {
    title: "Reborn",
    category: "Marketplace",
    year: "2025",
    summary: "Upwork-style freelance marketplace, web and mobile.",
    description:
      "Full REST API with NestJS, React Native mobile app, and Next.js back-office. Auth, payments, file management, and real-time messaging with Socket.IO.",
    tech: ["NestJS", "React Native", "Next.js", "TypeORM", "Socket.IO"],
    status: "private-demo",
    featured: true,
  },
  {
    title: "Instanct",
    category: "Social app",
    year: "2024",
    summary: "Social mobile platform with real-time chat and maps.",
    description:
      "NestJS backend, React Native mobile app, and Next.js admin dashboard. Auth, real-time messaging, push notifications, and location-based features.",
    tech: ["NestJS", "React Native", "Next.js", "TypeORM", "Socket.IO"],
    status: "private-demo",
    featured: false,
  },
  {
    title: "Pink Lemon",
    category: "Artist catalogue",
    year: "2026",
    summary: "Catalogue site for a Tunisian designer's handmade cushions, lamps and paintings.",
    description:
      "A catalogue, not a checkout: visitors browse the collections (Scalamandré, Zebra, Serenata, Nighttime Glow), meet the artist, and write to her to order or commission a piece. Scroll-driven animations throughout with GSAP ScrollTrigger.",
    tech: ["Next.js", "GSAP", "ScrollTrigger"],
    status: "live",
    liveUrl: "https://pinklemon-webapp.vercel.app/",
    image: "/projects/pinklemon.jpg",
    featured: false,
  },
  {
    title: "Zomra",
    category: "Fashion brand launch",
    year: "2026",
    summary: "Launch site and lookbook for a clothing label's first drop.",
    description:
      "Brand site for Zomra (زمرة, Arabic for a circle of people under one sign). The nine diamonds of the crown gather as you scroll, with a lookbook, the story of the name and Drop 01 and 02 previews. GSAP ScrollTrigger with Lenis smooth scrolling.",
    tech: ["Next.js", "GSAP", "Lenis"],
    status: "live",
    liveUrl: "https://zomra-ten.vercel.app/",
    image: "/projects/zomra.jpg",
    featured: false,
  },
  {
    title: "IDOLS",
    category: "Creator platform",
    year: "2024",
    summary: "Creator platform with advanced scroll animations.",
    description:
      "A platform for creators and brands, built with advanced GSAP and Framer Motion animations. Fully responsive reusable components.",
    tech: ["Next.js", "TypeScript", "GSAP", "Framer Motion"],
    status: "live",
    liveUrl: "https://icons-ugc.vercel.app/",
    image: "/projects/idols.jpg",
    featured: false,
  },
  {
    title: "Kibo",
    category: "Agency site",
    year: "2024",
    summary: "3D animated agency marketing site with React Three Fiber.",
    description:
      "A full rebuild of a marketing agency website with 3D visuals, smooth GSAP animations, and React Three Fiber scenes.",
    tech: ["React", "Vite", "React Three Fiber", "GSAP"],
    status: "live",
    liveUrl: "https://kibov2.vercel.app/",
    image: "/projects/kibo.jpg",
    featured: false,
  },
  {
    title: "AI Lead Agent",
    category: "AI automation",
    year: "2026",
    summary: "Multi-channel AI lead qualification: web, WhatsApp, Instagram.",
    description:
      "AI agent that qualifies leads across web, WhatsApp and Instagram using Claude AI for semantic analysis, scoring, and personalized responses. Automated scheduling, notifications, and CRM sync.",
    tech: ["Node.js", "Express", "Claude AI", "n8n"],
    status: "private-demo",
    featured: true,
  },
  {
    title: "RentSys",
    category: "Management system",
    year: "2024",
    summary: "Car rental management with Payload CMS and testing.",
    description:
      "Vehicle management system with admin backoffice, payments, and advanced search. Built with Payload CMS, tested with Vitest and Playwright.",
    tech: ["Next.js", "Payload CMS", "Vitest", "Playwright", "Docker"],
    status: "private-demo",
    featured: false,
  },
  {
    title: "XAU/USD Bot",
    category: "Trading bot",
    year: "2024",
    summary: "Automated gold trading bot with MACD strategy.",
    description:
      "Automated trading bot for Gold/USD on MetaTrader 5, using MACD-based strategy with price action and risk management.",
    tech: ["Python", "MetaTrader 5", "MACD"],
    status: "private-demo",
    featured: false,
  },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  current: boolean;
  description: string;
  tech: string[];
};

export const experience: Experience[] = [
  {
    company: "Maisonduweb",
    role: "Frontend Software Engineer Intern",
    period: "Jul 2026 to Sep 2026",
    current: false,
    description:
      "Developed features on an Angular 21 app with standalone components, signals, and RxJS. Implemented auth, guards, API calls, and centralized error handling. Integrated i18n with Transloco and PWA via Angular Service Worker. Wrote unit and e2e tests with Vitest and Playwright.",
    tech: ["Angular", "RxJS", "Tailwind CSS", "Vitest", "Playwright"],
  },
  {
    company: "Halo Groupe",
    role: "Full-Stack Developer",
    period: "Jan 2026 to Feb 2026",
    current: false,
    description:
      "Built an AI agent to auto-qualify leads from web, WhatsApp and Instagram. Integrated Claude AI for lead analysis, scoring, and personalized response generation. Automated scheduling, notifications, and CRM synchronization.",
    tech: ["Node.js", "Claude AI", "WhatsApp API", "n8n"],
  },
  {
    company: "Zedney Creative",
    role: "Frontend Software Engineer Intern",
    period: "Jun 2025 to Jul 2025",
    current: false,
    description:
      "Contributed to a production invoicing and business management platform (React + TypeScript). Refactored frontend into reusable components, diagnosed and fixed production bugs, and collaborated on API contract consistency.",
    tech: ["React", "TypeScript"],
  },
  {
    company: "WiseVision AI Technologies",
    role: "Frontend Developer Intern",
    period: "Jul 2024 to Aug 2024",
    current: false,
    description:
      "Built a React/Vite interface for an AI-powered retail analytics platform. Created a full admin dashboard, implemented heatmaps, analytics, QR-code flows and inventory tracking. Integrated REST APIs and managed client-side state.",
    tech: ["React", "Vite", "TypeScript"],
  },
  {
    company: "Les Ciments de Bizerte",
    role: "Symfony Developer Intern",
    period: "Jul 2023 to Aug 2023",
    current: false,
    description:
      "Developed a stock-management web app with Symfony/PHP, improving inventory accuracy by ~25%. Collaborated with the logistics team to digitize business processes.",
    tech: ["Symfony", "PHP", "MySQL"],
  },
];

export type SkillGroup = { category: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "SQL", "Python", "Java", "PHP"],
  },
  {
    category: "Frontend",
    items: [
      "Angular",
      "React",
      "Next.js",
      "React Native",
      "RxJS",
      "Tailwind CSS",
      "Vite",
      "GSAP",
      "Framer Motion",
    ],
  },
  {
    category: "Backend",
    items: [
      "NestJS",
      "Node.js",
      "Express",
      "Symfony",
      "REST API",
      "Socket.IO",
      "TypeORM",
    ],
  },
  {
    category: "Data & Tools",
    items: [
      "PostgreSQL",
      "MySQL",
      "Supabase",
      "Docker",
      "Git",
      "Playwright",
      "Vitest",
      "Figma",
    ],
  },
];

export const awards = [
  {
    title: "3rd Place: Agricultural Insurance Platform",
    context: "Hackathon · blockchain + NFT + AI",
    year: "Jul 2025",
  },
];

export const certifications = [
  {
    title: "Fundamentals of Deep Learning",
    issuer: "NVIDIA Deep Learning Institute",
    date: "2026-11",
    url: "https://learn.nvidia.com/certificates?id=g1mMWL3gQiObw_-tPdKIhA",
  },
];

export const files = [
  { id: "about", name: "about.md", commit: "init: Mohamed Amine Souissi, full-stack dev" },
  { id: "work", name: "work.tsx", commit: "feat(work): three products live in production" },
  { id: "architecture", name: "architecture.ts", commit: "feat(arch): trace one request end to end" },
  { id: "career", name: "career.log", commit: "docs(career): five teams since 2023" },
  { id: "stack", name: "stack.json", commit: "chore(stack): tools, counted from real projects" },
  { id: "contact", name: "contact.sh", commit: "ci: ready for review" },
] as const;

export type FileId = (typeof files)[number]["id"];
