# Habitly

A full-stack daily habit tracker built with Next.js, TypeScript, Tailwind CSS, Prisma, SQLite, Recharts, and JWT authentication.

## Architecture

- **Next.js App Router** supplies the React UI and route handlers.
- **Prisma** persists users, habits, and date-level completion records using PostgreSQL.
- **Auth** hashes passwords with bcrypt and stores a signed, 7-day JWT only in an HTTP-only, SameSite cookie. API handlers independently enforce the session, while middleware protects the dashboard navigation route.
- The client dashboard calls protected APIs, keeps optimistic UI updates small and reversible, and calculates daily/weekly/monthly/yearly reporting from saved records.

## Project structure

```
app/
  api/auth/{login,logout,me,signup}/route.ts
  api/habits/[id]/completion/route.ts
  api/habits/[id]/route.ts
  api/habits/route.ts
  dashboard/page.tsx  login/page.tsx  signup/page.tsx
  globals.css  layout.tsx  page.tsx
components/
  auth-form.tsx  dashboard.tsx  theme-toggle.tsx
lib/
  api.ts  auth.ts  prisma.ts  utils.ts
prisma/
  migrations/20260807000000_init/migration.sql
  schema.prisma
middleware.ts  .env.example  package.json
```

## Run locally

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env`, replace `JWT_SECRET` with a random value at least 32 characters long, and set `DATABASE_URL` to your PostgreSQL connection string.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Run `npx prisma migrate deploy`.
6. Run `npm run dev` and open `http://localhost:3000`.

## Production notes

Set a strong `JWT_SECRET`, use a managed PostgreSQL connection, run `npx prisma migrate deploy`, and deploy behind HTTPS. Secure cookies are automatically enabled when `NODE_ENV=production`.
