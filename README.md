# Solutia Next.js Workshop Starter

The starter template for **React Day 2: Next.js**. Clone it, follow the slides,
and build out the dashboard.

## Getting started

```bash
pnpm install
pnpm db:push   # create the SQLite tables (idempotent — DB is already seeded)
pnpm dev       # http://localhost:3000
```

> The seeded `sqlite.db` is committed, so you have data immediately on clone.
> `pnpm db:push` just reconciles the schema.

### Demo login

```
demo@solutia.test
password123
```

## What's already set up

- **Next.js 16** (App Router), TypeScript, Tailwind v4
- **shadcn/ui** — primitives in `components/ui/*` plus a dashboard sidebar block
  (`components/app-sidebar.tsx`) and `app/dashboard/page.tsx`
- **Drizzle ORM** pointed at a local SQLite file (`lib/db.ts`, `lib/schema.ts`)
- **better-auth** configured with the Drizzle adapter (`auth.ts`,
  `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`)
- Pre-built `components/invoice-table.tsx` and `components/dashboard-skeleton.tsx`
- A seeded `invoices` table (12 rows) + a demo user

## What you'll build during the workshop

These are intentionally left for you — a 404 on them is expected until you
create them:

- Dashboard routes, layouts, `loading.tsx`, and `error.tsx`
- A `<Search />` client component (URL-driven search)
- Server Actions in `lib/actions.ts` (create invoices)
- The sign-in page (`app/login/page.tsx`), a sign-out button, and `middleware.ts`

## Scripts

| Command          | What it does                                  |
| ---------------- | --------------------------------------------- |
| `pnpm dev`       | Start the dev server                          |
| `pnpm db:push`   | Apply the Drizzle schema to SQLite            |
| `pnpm db:seed`   | Reset + reseed invoices and the demo user     |
| `pnpm db:studio` | Open Drizzle Studio to browse the database    |
| `pnpm build`     | Production build                              |

## Notes

- The database is `sqlite.db` (better-sqlite3). `better-sqlite3` is a native
  module — this repo allow-lists its build in `pnpm-workspace.yaml`, so a plain
  `pnpm install` compiles it. If it ever fails to build on a machine, the
  fallback is libsql (`@libsql/client` + `drizzle-orm/libsql`).
- `.env` is committed on purpose with a throwaway dev secret so the app runs
  right after clone. Generate a real secret for any real app with
  `npx @better-auth/cli secret`.
