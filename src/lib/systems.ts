export type SysNode = {
  id: string;
  title: string;
  tech: string;
  x: number;
  y: number;
  /** portrait layout for phones */
  m: [number, number];
  detail: string;
};

export type FlowStep = { from: string; to: string; text: string };
export type Flow = { id: string; label: string; steps: FlowStep[] };

export type System = {
  project: string;
  summary: string;
  nodes: SysNode[];
  edges: [string, string][];
  flows: Flow[];
};

export const systems: System[] = [
  {
    project: "Reborn",
    summary: "Freelance marketplace: one NestJS backend serving a React Native app and a Next.js back-office.",
    nodes: [
      {
        id: "mobile",
        m: [24, 12],
        title: "Mobile app",
        tech: "React Native",
        x: 13,
        y: 24,
        detail: "The client- and freelancer-facing app: sign in, browse work, pay, share files and chat in real time.",
      },
      {
        id: "admin",
        m: [76, 12],
        title: "Back-office",
        tech: "Next.js",
        x: 13,
        y: 78,
        detail: "Admin dashboard over the same API, used to manage users, payments and files.",
      },
      {
        id: "gateway",
        m: [24, 50],
        title: "Realtime gateway",
        tech: "NestJS · Socket.IO",
        x: 50,
        y: 24,
        detail: "WebSocket gateway that receives messages and pushes them to everyone in the conversation.",
      },
      {
        id: "api",
        m: [76, 50],
        title: "REST API",
        tech: "NestJS",
        x: 50,
        y: 78,
        detail: "Modules for auth, payments, file management and messaging, shared by both clients.",
      },
      {
        id: "db",
        m: [50, 88],
        title: "SQL database",
        tech: "via TypeORM",
        x: 86,
        y: 51,
        detail: "Entities and relations mapped with TypeORM. Every module persists through it.",
      },
    ],
    edges: [
      ["mobile", "gateway"],
      ["mobile", "api"],
      ["admin", "api"],
      ["admin", "gateway"],
      ["gateway", "db"],
      ["api", "db"],
    ],
    flows: [
      {
        id: "chat",
        label: "Send a chat message",
        steps: [
          { from: "mobile", to: "gateway", text: "The phone emits the message over a WebSocket." },
          { from: "gateway", to: "db", text: "The gateway validates it and saves it through TypeORM." },
          { from: "db", to: "gateway", text: "The stored message comes back with its ID." },
          { from: "gateway", to: "admin", text: "It's broadcast live to the conversation, back-office included." },
        ],
      },
      {
        id: "login",
        label: "Sign in",
        steps: [
          { from: "mobile", to: "api", text: "The app sends credentials to the auth module." },
          { from: "api", to: "db", text: "Auth looks up the user." },
          { from: "db", to: "api", text: "The user record is returned." },
          { from: "api", to: "mobile", text: "The API answers with a session, and the app unlocks." },
        ],
      },
      {
        id: "file",
        label: "Upload a file",
        steps: [
          { from: "admin", to: "api", text: "The back-office uploads to the file module." },
          { from: "api", to: "db", text: "The file's metadata is saved." },
          { from: "api", to: "mobile", text: "The app can now list and open it." },
        ],
      },
    ],
  },
  {
    project: "K-Trait Connect Hub",
    summary: "Multi-tenant construction SaaS: a Next.js app on Supabase with role-based dashboards and live collaboration.",
    nodes: [
      {
        id: "web",
        m: [26, 12],
        title: "Your dashboard",
        tech: "Next.js · TypeScript",
        x: 13,
        y: 26,
        detail: "Role-based dashboards for projects, invoicing, expenses and reporting.",
      },
      {
        id: "state",
        m: [26, 86],
        title: "Client state",
        tech: "React Query · Zustand",
        x: 13,
        y: 78,
        detail: "React Query caches server data. Zustand holds UI state across the dashboards.",
      },
      {
        id: "auth",
        m: [26, 48],
        title: "Auth & roles",
        tech: "Supabase Auth",
        x: 50,
        y: 16,
        detail: "Sessions plus fine-grained roles and permissions that decide what each user sees and can do.",
      },
      {
        id: "db",
        m: [74, 86],
        title: "Database",
        tech: "Supabase · Postgres",
        x: 50,
        y: 62,
        detail: "Projects, invoices, expenses and chat, all in one Postgres database.",
      },
      {
        id: "realtime",
        m: [74, 48],
        title: "Realtime",
        tech: "Supabase Realtime",
        x: 86,
        y: 62,
        detail: "Pushes chat messages and shared documents to everyone on the project instantly.",
      },
      {
        id: "peer",
        m: [74, 12],
        title: "Teammate's dashboard",
        tech: "Next.js",
        x: 86,
        y: 16,
        detail: "Another user on the same project, updated live without refreshing.",
      },
    ],
    edges: [
      ["web", "state"],
      ["web", "auth"],
      ["web", "db"],
      ["db", "realtime"],
      ["realtime", "peer"],
      ["realtime", "web"],
    ],
    flows: [
      {
        id: "chat",
        label: "Post in project chat",
        steps: [
          { from: "web", to: "db", text: "The message is written to the database." },
          { from: "db", to: "realtime", text: "Realtime picks up the change." },
          { from: "realtime", to: "peer", text: "Your teammate's dashboard shows it instantly." },
          { from: "realtime", to: "web", text: "Your own dashboard gets the same update, so the thread stays in sync." },
        ],
      },
      {
        id: "roles",
        label: "Open invoices",
        steps: [
          { from: "web", to: "auth", text: "The session and the user's role are checked." },
          { from: "auth", to: "web", text: "The role decides which dashboards and actions appear." },
          { from: "web", to: "db", text: "Invoices are requested for that role." },
          { from: "db", to: "web", text: "The invoices come back to the dashboard." },
          { from: "web", to: "state", text: "React Query caches them so the dashboard stays fast." },
        ],
      },
    ],
  },
];
