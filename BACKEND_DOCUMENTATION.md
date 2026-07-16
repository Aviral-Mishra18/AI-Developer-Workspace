# 🚀 Vionex Backend Documentation (Supabase BaaS)

This document provides a comprehensive analysis and architectural overview of the backend infrastructure for **Vionex**.

The project adopts a **Serverless Backend Architecture**, leveraging **Supabase** (a Backend-as-a-Service platform) instead of a traditional monolithic Node.js/Python server. This strategy offloads database management, authentication, and security rules directly to managed PostgreSQL, enhancing velocity and scalability.

---

## 1. 🏗 Architecture Overview

The backend logic is tightly integrated into the Next.js frontend repository through direct, secure client-side and server-side calls via the Supabase SDK (`@supabase/supabase-js`). 

### Core Pillars
1. **PostgreSQL Database**: The relational core storing user profiles, project metadata, and relationships.
2. **Supabase Auth**: JWT-based authentication system tightly coupled with Postgres Row Level Security (RLS).
3. **Client-Side SDK**: Data mutations and queries are performed directly from React components and custom hooks, replacing REST/GraphQL APIs.

---

## 2. 📁 Backend Integration Files (Step-by-Step)

While there is no separate "backend" directory, the backend integration is woven throughout the `src/` directory. Here is the step-by-step breakdown of how the backend is structured:

### 2.1 Initialization & Configuration

**File**: `src/lib/supabase.ts`
- **Purpose**: Instantiates the singleton Supabase client for browser-side interactions.
- **Mechanism**: Extracts `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from environment variables.
- **Analysis**: This is the gateway for all database reads and writes. Exposing the anon key is secure *only* because of Postgres Row Level Security (RLS).

### 2.2 Global State & Authentication Management

**File**: `src/components/providers/AuthProvider.tsx`
- **Purpose**: Global context provider wrapping the Next.js application to track session state.
- **Mechanism**:
  - Uses `supabase.auth.getSession()` on mount to check for an active user session.
  - Subscribes to auth events (e.g., login, logout, token refresh) via `supabase.auth.onAuthStateChange`.
  - Automatically queries the `profiles` table: `.from('profiles').select('*').eq('id', user.id).single()` to fetch extended metadata (name, bio, timezone).
- **Analysis**: Acts as the "auth middleware" for the React tree, ensuring protected routes can gracefully redirect unauthenticated users.

### 2.3 Authentication Flows (Registration & Login)

**File**: `src/app/(auth)/register/page.tsx` (and Login)
- **Purpose**: Handles user onboarding and authentication.
- **Mechanism**:
  - Captures credentials via `react-hook-form` + `zod` validation.
  - Triggers `supabase.auth.signUp()` for account creation.
  - Subsequently triggers an insertion into the `profiles` table to map the `auth.users.id` (Supabase system ID) to the public schema.
- **Analysis**: This represents the standard Supabase multi-step auth pattern (System Account -> Public Profile).

### 2.4 Data Mutators & Queries (CRUD Operations)

**File**: `src/app/(dashboard)/settings/page.tsx`
- **Purpose**: Updates the user's profile metadata.
- **Mechanism**: 
  - Uses `supabase.from('profiles').update(...)` scoped by `.eq('id', authUser.id)`.

**File**: `src/app/(dashboard)/projects/page.tsx` & `src/components/projects/CreateProjectModal.tsx`
- **Purpose**: Fetches and inserts project records.
- **Mechanism**:
  - `projects/page.tsx`: Executes `supabase.from('projects').select('*')` (filtering is implicitly handled by RLS on the Supabase dashboard).
  - `CreateProjectModal.tsx`: Executes `supabase.from('projects').insert([...])`.

---

## 3. 🗄️ Database Schema Representation

Based on the queries mapped in the codebase, the Supabase Postgres database contains the following inferred schema:

### `profiles` Table
Stores extended user context linked to the secure `auth.users` table.
- `id` (UUID, Primary Key, Foreign Key to `auth.users.id`)
- `name` (Text)
- `email` (Text - cached for display)
- `avatar` (Text/URL)
- `bio` (Text)
- `timezone` (Text)

### `projects` Table
Stores the user's AI workspaces.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to `profiles.id`)
- `title`/`name` (Text)
- `description` (Text)
- `status` (Text)

---

## 4. 🛡️ Security & Scalability Analysis (Senior Developer Review)

As requested, here is an analysis of the current backend architecture following the documentation creation:

### Strengths
- **Development Velocity**: By eliminating intermediate API routes (Node.js/Express) and calling the DB directly via `@supabase/supabase-js`, the frontend can iterate rapidly.
- **Real-time Ready**: The current setup can easily adopt `supabase.channel()` subscriptions for real-time multiplayer features (e.g., Kanban board updates).
- **Type Safety Potential**: If `supabase CLI` is used to generate `database.types.ts`, the frontend queries will be strictly typed against the Postgres schema.

### Areas for Improvement / Vulnerabilities
1. **Missing Server-Side Protection (SSR)**: The project has `@supabase/ssr` installed but currently relies heavily on client-side fetching (`src/lib/supabase.ts`). For true Next.js App Router utilization, data fetching should occur in Server Components using a specialized server client to prevent loading spinners and secure cookies automatically.
2. **Row Level Security (RLS) Dependency**: The entire security model relies on RLS policies configured in the Supabase Dashboard. If a policy like `CREATE POLICY "Enable read for authenticated users" ON "projects" USING (auth.uid() = user_id)` is missing, users could potentially query others' data. This configuration must be documented and maintained in SQL migrations.
3. **Middleware**: Currently, there is no `middleware.ts` intercepting route transitions to strictly enforce session validation at the edge. The `AuthProvider` handles this on the client, which can cause layout shifts ("flickers") before a redirect occurs.

### Recommended Next Steps
- Implement `src/middleware.ts` using `@supabase/ssr` to securely handle HTTPOnly cookie validation.
- Refactor `projects/page.tsx` to a React Server Component (RSC) to fetch data server-side before rendering.
- Run `supabase gen types typescript` to inject strong TypeScript definitions into the Supabase client.
