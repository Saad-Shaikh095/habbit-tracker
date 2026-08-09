# Habitly

A full-stack daily habit tracker built with Next.js, TypeScript, Tailwind CSS, Prisma, Recharts, and JWT authentication.

## Architecture

- **Next.js App Router** supplies the React UI and route handlers.
- **Prisma** stores users, habits, and date-level completion records in a local SQLite database for development.
- **Auth** hashes passwords with bcrypt and stores a signed, 7-day JWT in an HTTP-only cookie. API handlers enforce the session, while middleware protects the dashboard route.
- The dashboard calls protected APIs and calculates daily, weekly, monthly, and yearly progress from persisted records.

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
  auth-form.tsx  dashboard.tsx  report-download.tsx  theme-toggle.tsx
lib/
  api.ts  auth.ts  prisma.ts  utils.ts
prisma/
  migrations/20260807000000_init/migration.sql
  schema.prisma
middleware.ts  .env.example  package.json
```

## Run locally

1. Install Node.js 20.9 or newer.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a local environment file named `.env.local` with:
   ```env
   JWT_SECRET="replace-with-a-random-secret-at-least-32-characters-long"
   DATABASE_URL="file:./dev.db"
   ```
4. Create the local database schema:
   ```bash
   npx prisma db push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open the app in your browser at `http://localhost:3000`.
   - If port 3000 is already busy, Next.js will automatically use the next available port.

## Optional verification

- Run `npm run build` to confirm the app compiles successfully.
- Use the sign-up flow in the browser to create your first account and add a habit.

## Deploy to Vercel

1. Push your repository to GitHub.
2. Open Vercel and create a new project from that repository.
3. In Vercel project settings, add these environment variables:
   - `JWT_SECRET`: a long random secret string.
   - `DATABASE_URL`: the connection string for a PostgreSQL database.
   - `NODE_ENV=production`
4. Create a PostgreSQL database before deployment. A simple option is Vercel Postgres or Neon.
5. Update Prisma for production by using a PostgreSQL-compatible datasource in [prisma/schema.prisma](prisma/schema.prisma).
6. Run the Prisma migration in your production database:
   ```bash
   npx prisma migrate deploy
   ```
7. Deploy the project from Vercel. The build is already configured to run `prisma generate` and `prisma migrate deploy` through the existing Vercel build script.

> The local setup uses SQLite for convenience, but Vercel cannot use a local SQLite file. For production, use PostgreSQL.

## Production notes

For production, use a strong `JWT_SECRET` and a managed PostgreSQL connection. If you switch to PostgreSQL, update the Prisma datasource and database URL accordingly.
