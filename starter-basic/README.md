# Your Next.js application

A responsive, multilingual Next.js 15.5 application starter with TypeScript,
Tailwind CSS 3, `next-intl`, and light/dark themes. Instead of a dead-end
welcome screen, you get a working example workspace and practical onboarding.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000, which routes to the localized home page.
No database, credentials, `.env` file or external API is needed.

## Explore your new app

- `/en` and `/fa` — redesigned responsive landing pages
- `/en/workspace` and `/fa/workspace` — working task management demo:
  create, edit, complete, filter, and remove tasks. Progress updates live.
- `/en/guide` and `/fa/guide` — developer onboarding with key file locations
- Local demo data is stored in the browser's `localStorage`. No accounts,
  APIs, secrets, or database are required. This is **not cloud sync**.
- The app includes localized 404/error states, a loading skeleton,
  responsive navigation, dark/light mode, and keyboard-friendly controls.

The first visit seeds a few example tasks. Delete them and add your own, or
replace the demo with your real product's data layer when you're ready.

## Make it yours

1. Your project name is already reflected in the website title and header.
2. Edit `app/[locale]/page.tsx` to replace the landing page.
3. Edit `messages/en.json` and `messages/fa.json` to change copy.
4. Edit `components/SiteHeader.tsx` and `components/SiteFooter.tsx` to update navigation and footer.
5. Edit `app/globals.css` and `tailwind.config.ts` to change the look.
6. Reuse `components/FeatureCard.tsx` for feature listings.
7. Inspect `components/workspace/TaskBoard.tsx` and `lib/tasks.ts` for a real
   local-first interactive feature.
8. Add new routes under `app/[locale]/` and use `next-intl`'s navigation helpers.

## Project structure

- `app/[locale]/` — localized routes and layout
- `components/` — reusable presentation, navigation, theme and workspace controls
- `lib/tasks.ts` — typed model and helpers for the local task demo
- `messages/` — translated copy, metadata and accessibility labels
- `i18n/` — locale routing, navigation and request configuration
- `app/globals.css` — Tailwind styling

## Commands

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run start` — run a production build
- `npm run typecheck` — check TypeScript

## Localization

- Localized routes: `/en` and `/fa`
- Default language: English
- RTL automatically applied to Persian pages
- Adjust `i18n/routing.ts` to add locales; add matching `messages/<locale>.json`

## Theme

Dark/light switching uses `next-themes`. Customize Tailwind colors in `app/globals.css`.

## Authentication / databases

This starter intentionally **does not include** authentication, API credentials, payment integrations or a database. Add only the services you need.

For an appointment-oriented example, use the generator's `--template appointment` option instead.
