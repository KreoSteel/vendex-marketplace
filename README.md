<div align="center">

# Vendex Marketplace

**A full-stack marketplace app for buying and selling items, with real-time chat and support for 4 languages.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## About

Vendex is a peer-to-peer marketplace where users can list items for sale, browse by category, message sellers directly, leave reviews, and favorite listings. It supports four locales out of the box (English, Italian, Russian, Ukrainian) and ships with real-time chat, image uploads, search and filtering.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Internationalization](#internationalization)
- [Error Monitoring](#error-monitoring)
- [Known Issues](#known-issues)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Listings** — create, edit, delete, and mark listings as sold, with up to 10 images each
- **Browse & filter** — category, price range, condition, keyword search, and pagination
- **Favorites** — save listings for later
- **Reviews** — leave and read ratings on other users
- **Real-time messaging** — direct chat between buyers and sellers, delivered live
- **Profiles** — public seller profiles with active/sold/favorited listings and reviews
- **i18n** — English, Italian, Russian, and Ukrainian, with locale-prefixed routing
- **Authentication** — email/password auth with protected routes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Server Actions) |
| UI | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/) |
| Language | TypeScript |
| Database | PostgreSQL via [Prisma 7](https://www.prisma.io/) |
| Auth | [better-auth](https://www.better-auth.com/) |
| Storage & Realtime | [Supabase](https://supabase.com/) (Storage + Realtime broadcast channels) |
| Data fetching (client) | [TanStack Query](https://tanstack.com/query) |
| Validation | [Zod](https://zod.dev/) + [@t3-oss/env-nextjs](https://env.t3.gg/) for typed env vars |
| i18n | [next-intl](https://next-intl.dev/) |
| Monitoring | [Sentry](https://sentry.io/) |

## Architecture

The `src/app` directory is organized using **Feature-Sliced Design (FSD)**. Layers depend downward only — a layer may import from the layers below it, never sideways or upward, and every slice exposes its public surface through an `index.ts`:

```
app       → routes and top-level layout
pages     → page logic: filters, tabs, local state
widgets   → UI blocks built from features + entities (Header, Chat, Profile)
features  → things users do (create a listing, favorite it, chat, log in...)
entities  → core data types and how to fetch/save them (user, listing, category, review...)
shared    → common tools used everywhere: Prisma/Supabase/auth clients, UI pieces, hooks
```

## Project Structure

```
vendex-marketplace/
├── prisma/
│   ├── schema.prisma           # Data model
│   ├── migrations/             # SQL migration history
│   └── seed.ts                 # Demo data seeder
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── [locale]/
│   │   │   │   ├── (main)/
│   │   │   │   │   ├── (home)/         # "/"
│   │   │   │   │   ├── listings/       # "/listings", "/listings/[id]", "/listings/create"
│   │   │   │   │   ├── messages/       # "/messages", "/messages/[userId]"
│   │   │   │   │   └── profile/        # "/profile", "/profile/[id]"
│   │   │   │   └── auth/               # "/auth/login", "/auth/register"
│   │   │   ├── api/auth/[...all]/      # better-auth REST handler
│   │   │   └── providers/              # TanStack Query provider
│   │   ├── entities/                   # user, listings, category, favorites, reviews, messages-(chat)
│   │   ├── features/                   # auth, create/update/delete-listing, toggle-favorite,
│   │   │                                #   mark-as-sold, create-review, chat, realtime-chat,
│   │   │                                #   avatar-upload, update-profile, locale-switch
│   │   ├── widgets/                    # header, home, chat, profile
│   │   ├── pages/                      # listings & listing-details orchestration
│   │   └── shared/                     # api clients, ui kit, hooks, lib
│   ├── config/
│   │   ├── envs/                       # validated server/client env schemas
│   │   └── styles/                     # fonts, globals.css
│   ├── pkg/
│   │   ├── i18n/                       # next-intl routing/navigation config
│   │   └── sentry/                     # instrumentation
│   ├── translations/                   # en.json, it.json, ru.json, uk.json
│   ├── types/result.ts                 # shared Result<T, E> type
│   ├── utils/generated/                # Prisma Client output (generated, not hand-edited)
│   └── proxy.ts                        # i18n + auth-guarded routing
├── next.config.ts
├── prisma.config.ts
└── package.json
```

## Data Model

Defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

- **User** — account profile; owns listings, favorites, messages, and reviews
- **Category** — listing categories (slug, icon, description)
- **Listing** — the core sellable item (title, price, condition, status, views, images)
- **ListingImage** — ordered images belonging to a listing
- **Favorite** — join table between users and listings
- **Review** — ratings/comments between users, optionally tied to a listing
- **Message** — direct messages between two users, optionally tied to a listing
- **Session / Account / Verification** — managed by better-auth

## Getting Started

### Prerequisites

- **Node.js ≥ 20.9** (required by Next.js 16)
- **npm / pnpm**
- A **PostgreSQL** database
- A **Supabase** project (for image storage and realtime chat)

### Installation

```bash
git clone https://github.com/KreoSteel/vendex-marketplace.git
cd vendex-marketplace
npm install # or pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
# Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL="postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
# Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL="postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Auth (better-auth)
BETTER_AUTH_SECRET=generate-a-long-random-string

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

Environment variables are validated at startup with Zod (`src/config/envs/server.ts` and `client.ts`) — the app will fail fast with a clear error if a required variable is missing.

In Supabase, create two Storage buckets used by the app: `listing_images` and `users_avatars` (both public, so uploaded images can be served via their public URL).

### Database Setup

```bash
# Apply migrations
npx prisma migrate dev

# (Optional) seed demo categories and listings
npm run seed
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Start the local dev server |
| `npm run build` | `next build` | Create a production build |
| `npm run start` | `next start` | Run the production build |
| `npm run lint` | `eslint` | Lint the codebase |
| `npm run typecheck` | `tsc --noEmit` | Type-check without emitting output |
| `npm run seed` | `tsx prisma/seed.ts` | Seed the database with demo data |

## Internationalization

Locales are configured in `src/pkg/i18n/routing.ts` (`en`, `ru`, `uk`, `it`, default `en`) and routed via a `[locale]` URL segment. Message catalogs live in `src/translations/*.json`. To add a new locale, add it to `routing.ts` and create a matching translation file.

## Error Monitoring

The app is wired up with [Sentry](https://sentry.io/) for both server and client instrumentation (`sentry.server.config.ts`, `sentry.edge.config.ts`, `src/pkg/sentry/`). Update the `org`/`project` values in `next.config.ts` and provide your own Sentry DSN before deploying to production.

## License

This project is licensed under the [MIT License](./LICENSE).
