# Meridian

Meridian is a mobile-first personal sales KPI dashboard. It gives one person a private place to set weekly targets, save one check-in per Monday-based week, and understand a transparent 0 to 100 score.

The five fixed metrics are outreach, qualified leads, discovery calls, proposals, and closed deals. Their score weights are 15%, 20%, 20%, 20%, and 25%.

## Stack

- Nuxt 4 and Vue 3
- Tailwind CSS 4 with token-driven light and dark themes
- shadcn-vue-compatible Nuxt component structure
- Supabase Auth and Postgres through `@nuxtjs/supabase`
- TypeScript and Vitest

## Run locally

```powershell
pnpm install
Copy-Item .env.example .env
pnpm dev
```

`pnpm dev:lan` binds the development server to `0.0.0.0`. Use the machine’s IPv4 address from another device on the same network, for example `http://192.168.x.x:3000`. Windows Firewall may need an inbound rule for the selected port.

Without real Supabase values, Meridian deliberately opens a browser-local preview mode. It stores preview targets and check-ins in local storage, labels that state in the UI, and never claims that an account or check-in was sent to Supabase.

## Configure Supabase

Create a Supabase project, then set these values in `.env`:

```dotenv
NUXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=your-publishable-key
```

Enable Email in Supabase Authentication. In **Authentication → URL Configuration**, configure:

- Site URL: your local or deployed application origin.
- Redirect URLs: `http://localhost:3000/auth/confirm`, your LAN origin plus `/auth/confirm`, and the deployed Vercel origin plus `/auth/confirm`.

The confirmation route is `/auth/confirm`. The sign-up form supplies that path as `emailRedirectTo`.

### Apply the database schema

The migrations create `profiles`, one-row-per-user `kpi_goals`, and `weekly_check_ins`. Check-ins carry target snapshots, only allow Monday week starts, and enforce one `(user_id, week_start)` record. Table grants are limited to `authenticated`, and RLS policies constrain every row to `auth.uid()`.

```powershell
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
npx supabase gen types typescript --linked --schema public | Out-File -Encoding utf8 app/types/database.types.ts
```

The checked-in `app/types/database.types.ts` mirrors the migrations so the project can compile before a project is linked. Regenerate it using the last command after the migration is applied, then review and commit the resulting schema types.

### Verify RLS in a real project

Create two email users. With each user’s own session, verify that the other user’s `profiles`, `kpi_goals`, and `weekly_check_ins` rows cannot be selected, inserted, updated, or deleted. Also verify that an authenticated user can only upsert their own Monday check-in.

## Quality commands

```powershell
pnpm test
pnpm exec nuxi typecheck
pnpm build
pnpm preview:lan
```

`pnpm preview:lan` serves the production build to the local network. Confirm `/favicon.png` loads and the browser tab shows the cobalt route mark. The source uses this same raster mark in the application header.

## Deploy to Vercel

1. Import the repository in Vercel.
2. Add the two `NUXT_PUBLIC_SUPABASE_*` environment variables for the relevant environment.
3. Deploy with the default Nuxt build command, `pnpm build`.
4. Add the deployed origin and `/auth/confirm` redirect URL in Supabase.
5. Verify the deployed sign-up confirmation redirect, private routes, dashboard save/update, history, dark mode, and `https://your-domain/favicon.png`.

## Accessibility and responsive behavior

- Visible labels, `inputmode="numeric"`, blur validation, linked messages, and focused error summaries.
- Polite feedback after saves and keyboard-complete controls with visible focus rings.
- 44px touch targets, semantic landmarks, a responsive history table, and reduced-motion handling.
- One-column mobile layout at 360px, two-column dashboard content from 768px, and persistent desktop navigation from 1280px.

## Verification boundary

The local score logic, tests, type checks, and production build can run without a Supabase project. Applying migrations, exercising two-account RLS, email confirmation, deployed Vercel behavior, and deployed favicon validation require project credentials and deployment access, so those are intentionally documented rather than reported as complete here.
