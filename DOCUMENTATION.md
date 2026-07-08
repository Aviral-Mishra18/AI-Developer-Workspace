# 🚀 NexusAI - Comprehensive Project Architecture & Documentation

This document serves as the **Ultimate Master Reference** for the NexusAI frontend architecture. Crafted for senior engineers, DevOps, and AI assistants, it provides deep technical context, architectural decisions, and an exhaustive breakdown of every configuration file, module, and directory in this repository.

---

## 1. 📖 Project Overview & Domain Context

**NexusAI** is a next-generation enterprise SaaS platform designed to be an AI-powered collaboration dashboard and workspace management tool. 

**Key Features Include:**
- **AI Integration**: Features an AI-powered chat (`/ai-chat`) and an AI-driven document/code review system (`/ai-review`).
- **Project & Task Management**: Includes full Kanban boards, task tracking, and project progress visualization.
- **Collaboration**: Meeting scheduling (`/meetings`), documentation management (`/docs`), and notifications (`/notifications`).
- **Analytics**: Dashboards rendering complex usage metrics, project activity, and AI usage metrics via Recharts.

---

## 2. 🛠️ Tech Stack Step-by-Step Deep Dive

The project architecture is built upon a highly modernized frontend stack. Here is the step-by-step breakdown of every technology layer and its exact purpose within NexusAI.

### Step 1: Core Engine & Language Layer
- **Next.js (v16.2.7)**: The foundational meta-framework. We exclusively use the **App Router** (`src/app`) for server-side rendering, advanced routing, and React Server Components (RSC) to ensure maximum performance and SEO capabilities.
- **React (v19.2.4)**: The core UI library utilizing the latest React 19 features, including concurrent rendering and modernized hooks, driving our component architecture.
- **TypeScript**: Enforces strict static typing across the entire codebase. This acts as our first line of defense against runtime errors and ensures seamless auto-completion and DX (Developer Experience).

### Step 2: Styling, UI Components, & Theming Layer
- **Tailwind CSS (v4)**: Our utility-first CSS engine. Integrated via `@tailwindcss/postcss`, it allows for rapid UI development without leaving the JSX/TSX files.
- **shadcn/ui & @base-ui/react**: Provides highly accessible, unstyled foundational components (like Dialogs, Selects, and Menus) which we wrap and style with Tailwind. We utilize the `base-nova` style configuration.
- **next-themes**: Handles client-side theme switching. Defaulted to **Dark Mode**, it toggles Tailwind's dark classes seamlessly across the app without hydration mismatch flickering.
- **lucide-react**: Our consistent, lightweight SVG icon library used universally across the UI.

### Step 3: Backend Integration & Authentication Layer
- **Supabase BaaS**: Serves as our PostgreSQL database, authentication provider, and storage solution.
- **@supabase/supabase-js & @supabase/ssr**: Handles secure, server-side and client-side communication with the Supabase API. `@supabase/ssr` securely manages authentication tokens within Next.js cookies to protect SSR routes seamlessly.

### Step 4: Form State & Validation Layer
- **react-hook-form**: The core engine for handling form state (like Login, Task Creation, etc.) with minimal re-renders.
- **zod & @hookform/resolvers**: Provides strict schema validation. Before any form is submitted or API hit, Zod ensures the payload structurally matches our database expectations.

### Step 5: Advanced Feature-Specific Libraries
- **Recharts (v3.8.1)**: Powers our complex analytics dashboards, rendering responsive and interactive SVGs for project metrics.
- **@hello-pangea/dnd**: A robust, accessible Drag-and-Drop library powering the interactive Kanban boards in our Task Management system.
- **react-markdown**: Parses and securely renders AI responses and documentation strings into valid HTML.
- **sonner**: Provides our sleek, non-intrusive toast notification system for user feedback (e.g., "Task created successfully").

---

## 3. ⚙️ Root Configuration & JSON Files Breakdown

The root directory contains several critical configuration files that govern the project's build, styling, linting, and environment behavior.

### 📄 `package.json` & `package-lock.json`
- **Purpose**: Defines project metadata, standard NPM scripts (`dev`, `build`, `start`, `lint`), and manages all dependencies.
- **Key aspects**: Specifies Next.js 16.2.7 and React 19.2.4. Handles exact versions of `@supabase`, `lucide-react`, and `shadcn` ecosystem packages. `package-lock.json` ensures deterministic, reproducible dependency resolution across environments.

### 📄 `tsconfig.json`
- **Purpose**: Strict TypeScript compiler configuration.
- **Key aspects**:
  - `target: ES2017` / `module: esnext`.
  - Enables `strict: true` for rigorous type-checking.
  - Configures `paths` for alias imports (`@/*` resolving to `./src/*`), providing cleaner import paths across the codebase.
  - Integrates with Next.js through the `next` plugin.

### 📄 `components.json`
- **Purpose**: The configuration file for `shadcn/ui`.
- **Key aspects**:
  - Specifies `base-nova` style and uses `lucide` for icons.
  - Defines the global CSS location (`src/app/globals.css`).
  - Sets up `aliases` for shadcn to correctly scaffold new components directly into `src/components/ui/` and `src/lib/utils`.

### 📄 `next.config.ts`
- **Purpose**: Next.js bundler and runtime configuration.
- **Key aspects**: Written in TypeScript, handles custom webpack configs, redirects, rewrites, and any experimental features required for Next.js App Router.

### 📄 `.env.local`
- **Purpose**: Stores secret environment variables that shouldn't be committed to source control.
- **Key aspects**: Contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` needed for authenticating the client with the Supabase backend.

### 📄 `eslint.config.mjs`
- **Purpose**: Configures ESLint rules.
- **Key aspects**: Enforces Next.js core web vitals linting (`eslint-config-next`) and custom formatting rules to ensure team-wide code consistency.

### 📄 `postcss.config.mjs`
- **Purpose**: PostCSS configuration, essentially the bridge between modern CSS syntax and Tailwind.
- **Key aspects**: Configured exclusively for `@tailwindcss/postcss` for Tailwind CSS v4 support.

---

## 4. 📂 Source Directory (`src/`) Architecture

The source code strictly follows domain-driven structure mapped heavily to Next.js App Router concepts.

### 📁 `src/app/` (Next.js App Router)
Handles routing, layouts, and page-level logic.
- **`(auth)/`**: Route group containing `/login`, `/register`, `/forgot-password`, `/reset-password`. Grouped so auth pages bypass the main dashboard layout.
- **`(dashboard)/`**: Protected route group. Contains `layout.tsx` which wraps all inner routes with the Sidebar and Top Navbar.
  - `admin/`, `ai-chat/`, `ai-review/`, `analytics/`, `dashboard/`, `docs/`, `meetings/`, `notifications/`, `projects/`, `settings/`, `tasks/`, `workspaces/`.
- **`globals.css`**: Defines CSS variables required by Tailwind v4, handling global theme tokens and dark mode colors.
- **`layout.tsx`**: The Root layout. Wraps the entire application in global context providers (`ThemeProvider`, `AuthProvider`), custom fonts (Geist/Geist Mono), and toast notifications (`sonner`).

### 📁 `src/components/` (UI & Feature Modules)
Organized by feature, minimizing bloated monolithic folders.
- **`ui/`**: Base atomic components strictly generated by shadcn (Buttons, Inputs, Modals, Dialogs, Avatars).
- **`layout/`**: Contains the persistent shell: `Sidebar`, `TopNavbar`.
- **`providers/`**: Context Providers like `AuthProvider` (Supabase auth state wrapping) and `theme-provider.tsx`.
- **Feature Folders**: `ai-chat/`, `analytics/`, `dashboard/`, `docs/`, `kanban/`, `projects/`, `workspace/`. Keeps components co-located based on domain context.

### 📁 `src/hooks/` (Custom React Hooks)
- **`use-sidebar.ts`**: Example custom hook that manages the UI state of the collapsible sidebar, persisting the user's preference in `localStorage`.

### 📁 `src/lib/` (Utilities, API, & Logic)
- **`utils.ts`**: Exposes the `cn()` utility combining `clsx` and `tailwind-merge` for conditionally joining Tailwind classes.
- **`supabase.ts`**: The initialized Supabase browser client setup.
- **`schemas.ts`**: Central repository for all Zod validation schemas. Keeps form logic dry and fully typed.
- **`mock-data.ts`**: Stubbed backend data used for UI scaffolding and layout testing.

---

## 5. 🔐 Authentication & Session Management

The application implements robust authentication using **Supabase**, centralized in the UI context layer.

- **Provider Layer**: `src/components/providers/AuthProvider.tsx` wraps the application.
- **Context API (`useAuth`)**: Exposes:
  - `user`: Authenticated user entity.
  - `profile`: Extended user attributes fetched from the public `profiles` table.
  - `session`: Validated JWT session state.
- **Middleware / Client Guarding**: Route protection is handled gracefully.
  - Authenticated users attempting to view `/login` get routed to `/dashboard`.
  - Anonymous users hitting `/(dashboard)` routes fall back to `/login`.

---

## 6. 🗃️ Data Models & Validation (Zod Schemas)

Inputs and API mutations are securely validated using `zod`, located in `src/lib/schemas.ts`.
- **Auth**: `loginSchema`, `registerSchema` (with strong password enforcements).
- **Workspaces**: `createWorkspaceSchema`.
- **Projects & Tasks**: `createProjectSchema`, `createTaskSchema` (enforcing valid Kanban statuses and metadata).

---

## 7. 🎨 Styling, UI Philosophy, and Theming

- **Tailwind Engine**: Powered by Tailwind v4 utilizing `@tailwindcss/postcss`.
- **Dark Mode First**: Theme controlled via `next-themes`. App defaults to `dark` utilizing CSS variables heavily (e.g., `bg-background`, `text-foreground`).
- **Dynamic Interactions**: `tw-animate-css` works alongside `tailwind-merge` to introduce polished micro-animations and smooth layout transitions without bloating CSS.

---

## 8. 🤖 Developer & AI Instructions

When working in this repository, follow these engineering standards:
1. **Routing**: Any protected view belongs in `src/app/(dashboard)/`.
2. **Components**: Maximize reuse from `src/components/ui/`. If an atom is missing, install it via shadcn rather than building custom from scratch.
3. **Styling Strictness**: Use Tailwind CSS variables. Do not use hardcoded hex codes. All conditional classes must be wrapped in the `cn()` function.
4. **Forms**: Adhere strictly to the `react-hook-form` + `zod` schema paradigm. Define the shape in `src/lib/schemas.ts` first.
5. **State Management**: Leverage Server Components where possible; use Context and custom hooks (`src/hooks/`) purely for interactive client UI state.

---
*Maintained by Senior Engineering Team - NexusAI.*
