// ============================================================
// MOCK DATA — All static/dummy data for every module
// ============================================================

// --- Users ---
export const currentUser = {
  id: "u1",
  name: "Alex Morgan",
  email: "alex.morgan@Vionex.com",
  avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Alex",
  role: "Admin",
  bio: "Full-stack developer & AI enthusiast",
  timezone: "America/New_York",
};

export const users = [
  currentUser,
  { id: "u2", name: "Sarah Chen", email: "sarah@Vionex.com", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Sarah", role: "Developer" },
  { id: "u3", name: "Marcus Johnson", email: "marcus@Vionex.com", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Marcus", role: "Designer" },
  { id: "u4", name: "Emily Davis", email: "emily@Vionex.com", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Emily", role: "PM" },
  { id: "u5", name: "James Wilson", email: "james@Vionex.com", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=James", role: "Developer" },
  { id: "u6", name: "Priya Patel", email: "priya@Vionex.com", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Priya", role: "DevOps" },
  { id: "u7", name: "Tom Baker", email: "tom@Vionex.com", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Tom", role: "QA" },
  { id: "u8", name: "Lisa Wang", email: "lisa@Vionex.com", avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Lisa", role: "Developer" },
];

// --- Workspaces ---
export const workspaces = [
  {
    id: "ws1",
    name: "Vionex Platform",
    description: "Main product development workspace for the Vionex platform. Includes all frontend, backend, and ML services.",
    memberCount: 24,
    projectCount: 8,
    lastActivity: "2 hours ago",
    owner: users[0],
    visibility: "private" as const,
    createdAt: "2024-06-15",
    storage: "12.4 GB",
  },
  {
    id: "ws2",
    name: "Marketing & Design",
    description: "Design assets, marketing campaigns, and brand materials for Vionex.",
    memberCount: 12,
    projectCount: 5,
    lastActivity: "30 minutes ago",
    owner: users[2],
    visibility: "private" as const,
    createdAt: "2024-08-20",
    storage: "8.2 GB",
  },
  {
    id: "ws3",
    name: "Open Source Projects",
    description: "Community open-source projects and contributions maintained by the Vionex team.",
    memberCount: 156,
    projectCount: 12,
    lastActivity: "5 minutes ago",
    owner: users[0],
    visibility: "public" as const,
    createdAt: "2024-03-10",
    storage: "3.7 GB",
  },
  {
    id: "ws4",
    name: "Research Lab",
    description: "Experimental AI/ML research projects and prototypes.",
    memberCount: 8,
    projectCount: 6,
    lastActivity: "1 day ago",
    owner: users[4],
    visibility: "private" as const,
    createdAt: "2024-11-01",
    storage: "45.1 GB",
  },
  {
    id: "ws5",
    name: "Client Portal",
    description: "Customer-facing portal development and maintenance.",
    memberCount: 16,
    projectCount: 4,
    lastActivity: "4 hours ago",
    owner: users[3],
    visibility: "private" as const,
    createdAt: "2025-01-08",
    storage: "6.8 GB",
  },
  {
    id: "ws6",
    name: "Infrastructure",
    description: "DevOps, CI/CD pipelines, cloud infrastructure, and monitoring.",
    memberCount: 6,
    projectCount: 3,
    lastActivity: "12 hours ago",
    owner: users[5],
    visibility: "private" as const,
    createdAt: "2024-05-22",
    storage: "1.2 GB",
  },
];

// --- Projects ---
export type ProjectStatus = "active" | "completed" | "on-hold" | "planning";
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  team: typeof users;
  progress: number;
  lastUpdated: string;
  workspaceId: string;
  createdAt: string;
}

export const projects: Project[] = [
  { id: "p1", name: "AI Dashboard v2", description: "Next-generation analytics dashboard with AI-powered insights and real-time data visualization.", status: "active", team: [users[0], users[1], users[4]], progress: 72, lastUpdated: "2 hours ago", workspaceId: "ws1", createdAt: "2025-01-15" },
  { id: "p2", name: "Mobile App", description: "Cross-platform mobile application for iOS and Android using React Native.", status: "active", team: [users[1], users[2], users[3]], progress: 45, lastUpdated: "30 min ago", workspaceId: "ws1", createdAt: "2025-02-01" },
  { id: "p3", name: "API Gateway", description: "Unified API gateway with rate limiting, caching, and authentication middleware.", status: "completed", team: [users[4], users[5]], progress: 100, lastUpdated: "1 week ago", workspaceId: "ws1", createdAt: "2024-11-10" },
  { id: "p4", name: "Design System", description: "Comprehensive design system with reusable components, tokens, and documentation.", status: "active", team: [users[2], users[0]], progress: 88, lastUpdated: "1 day ago", workspaceId: "ws2", createdAt: "2024-09-05" },
  { id: "p5", name: "ML Pipeline", description: "End-to-end machine learning pipeline for model training, evaluation, and deployment.", status: "on-hold", team: [users[0], users[4], users[7]], progress: 35, lastUpdated: "3 days ago", workspaceId: "ws4", createdAt: "2025-01-20" },
  { id: "p6", name: "Landing Page Redesign", description: "Complete redesign of the marketing landing page with new branding.", status: "planning", team: [users[2], users[3]], progress: 10, lastUpdated: "5 hours ago", workspaceId: "ws2", createdAt: "2025-03-01" },
  { id: "p7", name: "Auth Microservice", description: "OAuth2/OIDC authentication microservice with SSO support.", status: "active", team: [users[5], users[1]], progress: 60, lastUpdated: "4 hours ago", workspaceId: "ws1", createdAt: "2025-02-15" },
  { id: "p8", name: "Documentation Portal", description: "Interactive documentation portal with live code examples and API reference.", status: "active", team: [users[0], users[7]], progress: 55, lastUpdated: "6 hours ago", workspaceId: "ws3", createdAt: "2025-01-25" },
];

// --- Tasks (Kanban) ---
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done";
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: (typeof users)[0];
  dueDate: string;
  tags: string[];
  projectId: string;
}

export const tasks: Task[] = [
  { id: "t1", title: "Implement user authentication flow", description: "Build login, register, and password reset functionality with JWT tokens.", status: "done", priority: "critical", assignee: users[1], dueDate: "2025-03-10", tags: ["auth", "backend"], projectId: "p1" },
  { id: "t2", title: "Design dashboard wireframes", description: "Create high-fidelity wireframes for the main dashboard view.", status: "done", priority: "high", assignee: users[2], dueDate: "2025-03-08", tags: ["design", "ui"], projectId: "p1" },
  { id: "t3", title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated testing and deployment.", status: "review", priority: "high", assignee: users[5], dueDate: "2025-03-15", tags: ["devops", "infra"], projectId: "p1" },
  { id: "t4", title: "Build notification system", description: "Real-time notifications using WebSockets with push notification support.", status: "review", priority: "medium", assignee: users[4], dueDate: "2025-03-18", tags: ["backend", "realtime"], projectId: "p1" },
  { id: "t5", title: "Implement dark mode", description: "Add system-wide dark mode support with smooth transitions.", status: "in-progress", priority: "medium", assignee: users[0], dueDate: "2025-03-20", tags: ["ui", "frontend"], projectId: "p1" },
  { id: "t6", title: "Create API documentation", description: "Write comprehensive API docs using OpenAPI/Swagger specification.", status: "in-progress", priority: "low", assignee: users[7], dueDate: "2025-03-22", tags: ["docs", "api"], projectId: "p1" },
  { id: "t7", title: "Optimize database queries", description: "Profile and optimize slow database queries for the analytics module.", status: "in-progress", priority: "high", assignee: users[1], dueDate: "2025-03-16", tags: ["backend", "performance"], projectId: "p1" },
  { id: "t8", title: "Add unit tests for auth module", description: "Write comprehensive unit tests for authentication service.", status: "todo", priority: "high", assignee: users[4], dueDate: "2025-03-25", tags: ["testing", "auth"], projectId: "p1" },
  { id: "t9", title: "Implement file upload service", description: "Build multi-part file upload with progress tracking and S3 integration.", status: "todo", priority: "medium", assignee: users[5], dueDate: "2025-03-28", tags: ["backend", "storage"], projectId: "p1" },
  { id: "t10", title: "Design email templates", description: "Create responsive email templates for transactional emails.", status: "todo", priority: "low", assignee: users[2], dueDate: "2025-04-01", tags: ["design", "email"], projectId: "p1" },
  { id: "t11", title: "Research vector database options", description: "Evaluate Pinecone, Weaviate, and Milvus for AI embedding storage.", status: "backlog", priority: "medium", assignee: users[0], dueDate: "2025-04-05", tags: ["research", "ai"], projectId: "p1" },
  { id: "t12", title: "Implement rate limiting", description: "Add API rate limiting with Redis-backed token bucket algorithm.", status: "backlog", priority: "high", assignee: users[1], dueDate: "2025-04-08", tags: ["backend", "security"], projectId: "p1" },
  { id: "t13", title: "Build settings page", description: "Create user settings page with profile, notifications, and billing tabs.", status: "backlog", priority: "low", assignee: users[2], dueDate: "2025-04-10", tags: ["frontend", "ui"], projectId: "p1" },
  { id: "t14", title: "Add analytics tracking", description: "Integrate Mixpanel for user behavior tracking and funnel analysis.", status: "backlog", priority: "medium", assignee: users[3], dueDate: "2025-04-12", tags: ["analytics", "frontend"], projectId: "p1" },
];

// --- Dashboard Stats ---
export const dashboardStats = {
  totalProjects: { value: 24, change: 12, trend: "up" as const },
  activeTasks: { value: 156, change: -3, trend: "down" as const },
  teamMembers: { value: 48, change: 5, trend: "up" as const },
  aiRequests: { value: 12847, change: 24, trend: "up" as const },
};

// --- Chart Data ---
export const projectActivityData = [
  { date: "Jan", commits: 45, prs: 12, issues: 8 },
  { date: "Feb", commits: 62, prs: 18, issues: 14 },
  { date: "Mar", commits: 78, prs: 24, issues: 10 },
  { date: "Apr", commits: 54, prs: 15, issues: 6 },
  { date: "May", commits: 91, prs: 28, issues: 18 },
  { date: "Jun", commits: 85, prs: 22, issues: 12 },
  { date: "Jul", commits: 103, prs: 35, issues: 16 },
  { date: "Aug", commits: 72, prs: 20, issues: 9 },
  { date: "Sep", commits: 95, prs: 30, issues: 14 },
  { date: "Oct", commits: 88, prs: 26, issues: 11 },
  { date: "Nov", commits: 110, prs: 38, issues: 20 },
  { date: "Dec", commits: 98, prs: 32, issues: 15 },
];

export const taskCompletionData = [
  { name: "Backlog", value: 24, fill: "var(--chart-1)" },
  { name: "Todo", value: 18, fill: "var(--chart-2)" },
  { name: "In Progress", value: 12, fill: "var(--chart-3)" },
  { name: "Review", value: 8, fill: "var(--chart-4)" },
  { name: "Done", value: 45, fill: "var(--chart-5)" },
];

export const aiUsageData = [
  { date: "Mon", chatRequests: 245, codeReviews: 34, docGen: 12 },
  { date: "Tue", chatRequests: 312, codeReviews: 42, docGen: 18 },
  { date: "Wed", chatRequests: 289, codeReviews: 38, docGen: 15 },
  { date: "Thu", chatRequests: 356, codeReviews: 51, docGen: 22 },
  { date: "Fri", chatRequests: 278, codeReviews: 29, docGen: 10 },
  { date: "Sat", chatRequests: 145, codeReviews: 15, docGen: 5 },
  { date: "Sun", chatRequests: 98, codeReviews: 8, docGen: 3 },
];

// --- Activity Feed ---
export const activityFeed = [
  { id: "a1", user: users[1], action: "pushed 3 commits to", target: "feature/auth-flow", time: "5 minutes ago", type: "commit" as const },
  { id: "a2", user: users[2], action: "opened pull request", target: "#142 — Redesign dashboard cards", time: "23 minutes ago", type: "pr" as const },
  { id: "a3", user: users[0], action: "merged pull request", target: "#138 — Add dark mode support", time: "1 hour ago", type: "merge" as const },
  { id: "a4", user: users[4], action: "created issue", target: "#89 — Database connection timeout", time: "2 hours ago", type: "issue" as const },
  { id: "a5", user: users[3], action: "commented on", target: "#142 — Redesign dashboard cards", time: "3 hours ago", type: "comment" as const },
  { id: "a6", user: users[5], action: "deployed to", target: "production v2.4.1", time: "5 hours ago", type: "deploy" as const },
  { id: "a7", user: users[7], action: "closed issue", target: "#85 — Fix memory leak in worker", time: "6 hours ago", type: "issue" as const },
  { id: "a8", user: users[1], action: "pushed 7 commits to", target: "main", time: "8 hours ago", type: "commit" as const },
];

// --- Notifications ---
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error" | "mention";
}

export const notifications: Notification[] = [
  { id: "n1", title: "Pull Request Approved", message: "Sarah Chen approved your PR #142 — Redesign dashboard cards", time: "5 minutes ago", read: false, type: "success" },
  { id: "n2", title: "New Comment", message: "Marcus mentioned you in #89 — @alex can you review this fix?", time: "15 minutes ago", read: false, type: "mention" },
  { id: "n3", title: "Build Failed", message: "CI pipeline failed on branch feature/auth-flow — 3 test failures", time: "1 hour ago", read: false, type: "error" },
  { id: "n4", title: "Deployment Successful", message: "Production deployment v2.4.1 completed successfully", time: "5 hours ago", read: true, type: "success" },
  { id: "n5", title: "New Team Member", message: "Lisa Wang has joined the Vionex Platform workspace", time: "1 day ago", read: true, type: "info" },
  { id: "n6", title: "Storage Warning", message: "Research Lab workspace is at 90% storage capacity", time: "2 days ago", read: true, type: "warning" },
  { id: "n7", title: "Sprint Completed", message: "Sprint 14 completed with 92% task completion rate", time: "3 days ago", read: true, type: "info" },
  { id: "n8", title: "Security Alert", message: "Unusual login attempt detected from IP 192.168.1.45", time: "4 days ago", read: true, type: "error" },
];

// --- AI Chat ---
export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  messageCount: number;
}

export const chatConversations: ChatConversation[] = [
  { id: "c1", title: "React Performance Optimization", lastMessage: "Use React.memo and useMemo for expensive computations...", time: "2 min ago", messageCount: 12 },
  { id: "c2", title: "Database Schema Design", lastMessage: "For a many-to-many relationship, you should use a junction table...", time: "1 hour ago", messageCount: 8 },
  { id: "c3", title: "CI/CD Pipeline Setup", lastMessage: "Here's the GitHub Actions workflow for your Next.js app...", time: "3 hours ago", messageCount: 15 },
  { id: "c4", title: "API Authentication Best Practices", lastMessage: "JWT with refresh tokens is the recommended approach...", time: "1 day ago", messageCount: 20 },
  { id: "c5", title: "Kubernetes Deployment", lastMessage: "Your deployment manifest looks good, but add resource limits...", time: "2 days ago", messageCount: 6 },
];

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const chatMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "How can I optimize React component re-renders in a large dashboard?",
    timestamp: "10:30 AM",
  },
  {
    id: "m2",
    role: "assistant",
    content: `Here are several strategies to optimize React component re-renders:

## 1. Use \`React.memo\`
Wrap components that receive the same props frequently:

\`\`\`tsx
const StatsCard = React.memo(({ title, value }: Props) => {
  return <div>{title}: {value}</div>
});
\`\`\`

## 2. Use \`useMemo\` for Expensive Computations
\`\`\`tsx
const sortedData = useMemo(() => {
  return data.sort((a, b) => b.value - a.value);
}, [data]);
\`\`\`

## 3. Use \`useCallback\` for Event Handlers
\`\`\`tsx
const handleClick = useCallback((id: string) => {
  setSelected(id);
}, []);
\`\`\`

## 4. Virtualize Long Lists
Use libraries like \`@tanstack/react-virtual\` for rendering large datasets efficiently.

## 5. Split Context Providers
Avoid putting too much state in a single context. Split into smaller, focused providers.`,
    timestamp: "10:31 AM",
  },
  {
    id: "m3",
    role: "user",
    content: "Can you show me how to implement virtual scrolling with React?",
    timestamp: "10:33 AM",
  },
  {
    id: "m4",
    role: "assistant",
    content: `Sure! Here's how to implement virtual scrolling using \`@tanstack/react-virtual\`:

\`\`\`tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

This only renders items that are visible in the viewport, dramatically improving performance for lists with thousands of items.`,
    timestamp: "10:34 AM",
  },
];

// --- AI Code Review ---
export interface CodeReviewIssue {
  id: string;
  severity: "critical" | "warning" | "info" | "suggestion";
  category: "security" | "performance" | "best-practices" | "code-smells" | "ai-suggestions";
  title: string;
  description: string;
  file: string;
  line: number;
  suggestion: string;
}

export const codeReviewIssues: CodeReviewIssue[] = [
  { id: "cr1", severity: "critical", category: "security", title: "SQL Injection Vulnerability", description: "User input is directly concatenated into SQL query without parameterization.", file: "src/services/userService.ts", line: 45, suggestion: "Use parameterized queries or an ORM like Prisma to prevent SQL injection." },
  { id: "cr2", severity: "critical", category: "security", title: "Exposed API Key", description: "AWS secret key is hardcoded in the source file.", file: "src/config/aws.ts", line: 12, suggestion: "Move sensitive credentials to environment variables and use a secrets manager." },
  { id: "cr3", severity: "warning", category: "performance", title: "N+1 Query Problem", description: "Database queries inside a loop cause excessive database calls.", file: "src/services/projectService.ts", line: 78, suggestion: "Use eager loading or batch queries to fetch related data in a single query." },
  { id: "cr4", severity: "warning", category: "performance", title: "Missing Database Index", description: "Frequent queries on 'email' column without an index.", file: "src/models/User.ts", line: 23, suggestion: "Add an index on the email column for faster lookups." },
  { id: "cr5", severity: "info", category: "best-practices", title: "Missing Error Boundary", description: "React component tree lacks error boundaries for graceful error handling.", file: "src/App.tsx", line: 1, suggestion: "Wrap main routes with an ErrorBoundary component." },
  { id: "cr6", severity: "info", category: "best-practices", title: "Unused Import", description: "The 'useEffect' hook is imported but never used.", file: "src/components/Header.tsx", line: 1, suggestion: "Remove unused imports to keep the code clean." },
  { id: "cr7", severity: "suggestion", category: "code-smells", title: "Long Function", description: "Function 'processData' is 150 lines long and handles multiple concerns.", file: "src/utils/dataProcessor.ts", line: 34, suggestion: "Break this function into smaller, focused functions following the Single Responsibility Principle." },
  { id: "cr8", severity: "suggestion", category: "ai-suggestions", title: "Consider Using TypeScript Generics", description: "Multiple similar functions could be consolidated using generics.", file: "src/services/apiService.ts", line: 15, suggestion: "Create a generic fetchResource<T> function to reduce code duplication." },
  { id: "cr9", severity: "warning", category: "security", title: "Missing CORS Configuration", description: "API server does not have CORS headers configured.", file: "src/server/index.ts", line: 8, suggestion: "Add proper CORS middleware with allowed origins whitelist." },
  { id: "cr10", severity: "info", category: "ai-suggestions", title: "Use Zod for Runtime Validation", description: "API request bodies are not validated at runtime.", file: "src/routes/api.ts", line: 22, suggestion: "Add Zod schema validation middleware for type-safe request handling." },
];

// --- Documentation ---
export interface DocItem {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  version: string;
  status: "published" | "draft" | "review";
}

export const docs: DocItem[] = [
  { id: "d1", title: "Getting Started Guide", description: "Quick start guide for setting up the development environment.", category: "Guides", lastUpdated: "2 days ago", version: "2.1", status: "published" },
  { id: "d2", title: "API Reference", description: "Complete REST API reference with examples and authentication.", category: "Reference", lastUpdated: "1 week ago", version: "3.0", status: "published" },
  { id: "d3", title: "Component Library", description: "Documentation for all reusable UI components with live examples.", category: "Components", lastUpdated: "3 days ago", version: "1.8", status: "published" },
  { id: "d4", title: "Authentication Flow", description: "Detailed guide on OAuth2, JWT, and SSO implementation.", category: "Guides", lastUpdated: "5 days ago", version: "2.0", status: "published" },
  { id: "d5", title: "Deployment Guide", description: "Step-by-step guide for deploying to AWS, GCP, and Azure.", category: "Operations", lastUpdated: "1 day ago", version: "1.5", status: "review" },
  { id: "d6", title: "Architecture Overview", description: "System architecture, design patterns, and tech stack overview.", category: "Architecture", lastUpdated: "2 weeks ago", version: "3.2", status: "published" },
  { id: "d7", title: "Testing Strategy", description: "Unit testing, integration testing, and E2E testing best practices.", category: "Guides", lastUpdated: "4 days ago", version: "1.3", status: "draft" },
];

export const docContent = `# Getting Started Guide

Welcome to the **Vionex Platform** documentation. This guide will help you set up your development environment and start building.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Docker (optional)

## Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/Vionex/platform.git

# Install dependencies
cd platform
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
\`\`\`

## Project Structure

| Directory | Description |
|-----------|-------------|
| \`src/app\` | Next.js App Router pages |
| \`src/components\` | Reusable UI components |
| \`src/lib\` | Utility functions and helpers |
| \`src/hooks\` | Custom React hooks |

## Next Steps

1. Read the [Architecture Overview](/docs/architecture)
2. Explore the [API Reference](/docs/api)
3. Check out the [Component Library](/docs/components)
`;

// --- Meeting Notes ---
export interface MeetingNote {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: (typeof users)[0][];
  status: "completed" | "processing" | "failed";
  summary: string;
  actionItems: { id: string; text: string; assignee: string; done: boolean }[];
  speakers: { name: string; duration: string; percentage: number }[];
}

export const meetingNotes: MeetingNote[] = [
  {
    id: "mn1",
    title: "Sprint 14 Planning",
    date: "2025-03-05",
    duration: "45 min",
    participants: [users[0], users[1], users[3], users[4]],
    status: "completed",
    summary: "Discussed sprint goals for the next two weeks. Prioritized authentication improvements and dashboard redesign. Agreed to address 3 critical bugs before feature work.",
    actionItems: [
      { id: "ai1", text: "Fix authentication token refresh bug", assignee: "Sarah Chen", done: true },
      { id: "ai2", text: "Create wireframes for new dashboard layout", assignee: "Marcus Johnson", done: false },
      { id: "ai3", text: "Set up staging environment for testing", assignee: "Priya Patel", done: false },
      { id: "ai4", text: "Review and merge pending PRs", assignee: "Alex Morgan", done: true },
    ],
    speakers: [
      { name: "Alex Morgan", duration: "15 min", percentage: 33 },
      { name: "Emily Davis", duration: "12 min", percentage: 27 },
      { name: "Sarah Chen", duration: "10 min", percentage: 22 },
      { name: "James Wilson", duration: "8 min", percentage: 18 },
    ],
  },
];

// --- Analytics (extended) ---
export const workspaceGrowthData = [
  { month: "Jan", workspaces: 12, members: 45 },
  { month: "Feb", workspaces: 15, members: 52 },
  { month: "Mar", workspaces: 18, members: 61 },
  { month: "Apr", workspaces: 22, members: 78 },
  { month: "May", workspaces: 28, members: 95 },
  { month: "Jun", workspaces: 35, members: 124 },
];

export const teamVelocityData = [
  { sprint: "S10", planned: 34, completed: 28 },
  { sprint: "S11", planned: 38, completed: 35 },
  { sprint: "S12", planned: 42, completed: 40 },
  { sprint: "S13", planned: 36, completed: 32 },
  { sprint: "S14", planned: 40, completed: 38 },
  { sprint: "S15", planned: 45, completed: 42 },
];

export const aiModelUsageData = [
  { name: "GPT-4o", requests: 8450, cost: 245.80, percentage: 65 },
  { name: "Claude 3.5", requests: 2840, cost: 156.20, percentage: 22 },
  { name: "Gemini Pro", requests: 1200, cost: 78.40, percentage: 9 },
  { name: "Llama 3", requests: 520, cost: 12.00, percentage: 4 },
];

// --- Admin ---
export const systemHealthData = {
  apiServer: { status: "operational" as const, uptime: 99.98, responseTime: 45 },
  database: { status: "operational" as const, uptime: 99.99, responseTime: 12 },
  storage: { status: "degraded" as const, uptime: 99.85, responseTime: 120 },
  mlPipeline: { status: "operational" as const, uptime: 99.90, responseTime: 250 },
  cache: { status: "operational" as const, uptime: 100.0, responseTime: 2 },
};

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: "success" | "failed" | "warning";
}

export const activityLogs: ActivityLog[] = [
  { id: "al1", timestamp: "2025-03-07 14:30:22", user: "alex.morgan@Vionex.com", action: "Login", resource: "Auth Service", ip: "192.168.1.10", status: "success" },
  { id: "al2", timestamp: "2025-03-07 14:28:15", user: "sarah.chen@Vionex.com", action: "Create Project", resource: "Project Service", ip: "192.168.1.22", status: "success" },
  { id: "al3", timestamp: "2025-03-07 14:25:01", user: "unknown@external.com", action: "Login Attempt", resource: "Auth Service", ip: "45.33.12.88", status: "failed" },
  { id: "al4", timestamp: "2025-03-07 14:20:45", user: "marcus@Vionex.com", action: "Delete File", resource: "Storage Service", ip: "192.168.1.15", status: "success" },
  { id: "al5", timestamp: "2025-03-07 14:18:30", user: "system", action: "Backup Complete", resource: "Database", ip: "10.0.0.1", status: "success" },
  { id: "al6", timestamp: "2025-03-07 14:15:00", user: "priya@Vionex.com", action: "Deploy", resource: "Production", ip: "192.168.1.30", status: "success" },
  { id: "al7", timestamp: "2025-03-07 14:10:22", user: "system", action: "High Memory Usage", resource: "ML Pipeline", ip: "10.0.0.5", status: "warning" },
  { id: "al8", timestamp: "2025-03-07 14:05:11", user: "james@Vionex.com", action: "API Key Generated", resource: "Auth Service", ip: "192.168.1.18", status: "success" },
];

// --- Settings / Billing ---
export const billingPlan = {
  name: "Enterprise",
  price: "$299/mo",
  features: ["Unlimited workspaces", "Unlimited AI requests", "Priority support", "Custom integrations", "SSO/SAML", "Advanced analytics"],
  usage: {
    aiRequests: { used: 12847, limit: -1, label: "Unlimited" },
    storage: { used: 78.4, limit: 500, label: "78.4 GB / 500 GB" },
    members: { used: 48, limit: 100, label: "48 / 100 seats" },
  },
};

export const invoices = [
  { id: "inv-001", date: "Mar 1, 2025", amount: "$299.00", status: "paid" as const },
  { id: "inv-002", date: "Feb 1, 2025", amount: "$299.00", status: "paid" as const },
  { id: "inv-003", date: "Jan 1, 2025", amount: "$299.00", status: "paid" as const },
  { id: "inv-004", date: "Dec 1, 2024", amount: "$249.00", status: "paid" as const },
];
