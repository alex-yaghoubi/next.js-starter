# create-nextjs-standard-app

[![npm](https://img.shields.io/npm/v/create-nextjs-standard-app?label=npm)](https://www.npmjs.com/package/create-nextjs-standard-app)
[![npm downloads](https://img.shields.io/npm/dw/create-nextjs-standard-app?label=weekly%20downloads)](https://www.npmjs.com/package/create-nextjs-standard-app)
[![MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Go from zero to a usable Next.js application in one command.**
The new default starter includes **Next.js 15.5 (security-patched), React 19, TypeScript, Tailwind CSS,
English/Persian routing, RTL support and dark mode**, without requiring a
database, an API key or an authentication provider.

[Published package on npm](https://www.npmjs.com/package/create-nextjs-standard-app) ·
[Source](https://github.com/alex-yaghoubi/next.js-starter) ·
[Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md) · [Release notes](RELEASING.md)

> **Important release distinction:** The redesigned **2.0.0** source is on
> GitHub `main` but **has not been published on npm**. The published npm
> version may still generate the older template. The instructions below
> describe the planned v2 behavior; don't claim they work from `npx` until
> the release is published and validated.

## Quick start (v2, after publication)

Node.js **20.9+** required.

```bash
npx create-nextjs-standard-app my-app
cd my-app
npm run dev
```

Open **http://localhost:3000**. The app redirects to `/en`; switch to
فارسی to see real RTL routing and translations at `/fa`.

That's it. The generator installs your dependencies and initializes Git by
default. No environment variables, API services or database configuration
are required for the default template.

## Choose a template

| Template | Command option | Intended for |
| --- | --- | --- |
| **Basic (default)** | `--template basic` | New projects; clean Next.js, i18n, theme toggle |
| **Appointment (optional)** | `--template appointment` | Existing legacy appointment UI/auth integration example |

```bash
# New multilingual app
npx create-nextjs-standard-app my-app

# Preserve the earlier, appointment-oriented template
npx create-nextjs-standard-app booking-app --template appointment

# Scaffold without installing packages, or choose pnpm
npx create-nextjs-standard-app demo --skip-install --no-git
npx create-nextjs-standard-app demo --pm pnpm
```

The optional Appointment template is **an integration example, not a
production-ready app**. It generates a fresh npm lockfile during installation,
not the obsolete framework lockfile from the original source. It requires backend configuration, authentication
review, and your own API.

## What the basic template includes

- **App Router** with localized `app/[locale]/` pages
- **TypeScript** and a clean `tsconfig.json`
- **Tailwind CSS** with responsive default styles
- **English and Persian translations** in `messages/en.json` and
  `messages/fa.json`, using `next-intl`
- **RTL / LTR** page direction driven by the active locale
- **Light/dark toggle**, respecting system preferences via `next-themes`
- **A usable starter homepage** and practical editing instructions
- No app-specific fonts, branding, appointment APIs, shared secrets, Docker
  registry, or deployment provider required

## Customize the generated project

| Change | File |
| --- | --- |
| Replace homepage | `app/[locale]/page.tsx` |
| Rename website / metadata | `messages/en.json`, `messages/fa.json` |
| Change layout and header | `app/[locale]/layout.tsx` |
| Update colors and styles | `app/globals.css`, `tailwind.config.ts` |
| Change supported languages | `i18n/routing.ts` |
| Add routes | `app/[locale]/your-route/page.tsx` |

The created project has its own [README](starter-basic/README.md)
with run, typecheck, build, localization, and theme instructions.

## CLI options (v2 source)

| Option | Purpose |
| --- | --- |
| `--template basic\|appointment` | Choose default or legacy starter |
| `--pm npm\|yarn\|pnpm` | Choose package manager (npm by default) |
| `--skip-install` | Generate files now, install later |
| `--no-git` | Skip automatic Git repository initialization |
| `--help` | Display available options |

The generator refuses to overwrite an existing folder and personalizes
the generated `package.json` name **and the basic app's visible title/brand**. With the Appointment template, it also
creates a unique `NEXTAUTH_SECRET` in a git-ignored `.env.local`. The
default Basic template does **not** create or require an auth secret.

## Develop and validate the package

```bash
npm ci
npm test
npm pack --dry-run

# Test the no-config application independently
cd starter-basic
npm install
npm run typecheck
npm run build
```

A **manual-only**, opt-in GitHub Actions workflow supports source, packaged
CLI, basic-template build, real HTTP smoke tests for English/Persian pages,
and a **six-combination compatibility matrix**: Node 20/22 × npm, pnpm, Yarn.
Each matrix case installs the published-format tarball in a clean consumer,
scaffolds the app, installs dependencies, and runs TypeScript and Next.js build.
The optional Appointment example retains only seven actively used UI primitives. It does **not** block commits, PRs,
deployment or publication; tests are not claimed to pass until actually run.

**Security:** see [SECURITY.md](SECURITY.md).
**Contributing:** see [CONTRIBUTING.md](CONTRIBUTING.md).
**Publishing:** maintainer-only process in [RELEASING.md](RELEASING.md).

MIT license © Alex Yaghoubi and contributors.
