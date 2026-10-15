# Next.js Standard Starter

A reusable Next.js + TypeScript application template with Tailwind CSS,
English/Persian translations, RTL support, and example appointment/authentication screens.

## Getting started

If this app was created using `create-nextjs-standard-app`, the generator already
created a private `.env.local` with a randomly generated `NEXTAUTH_SECRET`.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Dependency compatibility

This optional example no longer ships its old `package-lock.json` (which held
outdated framework versions). Run `npm install` first to generate a new lockfile
using security-patched Next.js and React versions. You can use `npm ci` afterward
once the generated lockfile exists.

## Configuration and security

- `.env.local` is ignored by Git. Do not commit it.
- `.env.example` documents supported settings without including credentials.
- `NEXTAUTH_SECRET` must be unique for each deployment. The generator creates
  one for local development; manually provision a secret for production.
- `NEXTAUTH_URL` defaults to `http://localhost:3000` in generated apps.
- `APPOINTMENT_API_BASE_URL` is intentionally unset. Provide the URL of an
  API **you control** if you want to integrate the example appointment actions.
  This starter does not default to an Octavia production service.

The appointment endpoints and authentication screens are **integration examples**.
They require an application-specific backend, authorization checks, and appropriate
security review before handling real users or payments. Generating a project does
not configure a production-ready authentication service.

## Fonts and redistribution

The optional Appointment example now uses system font stacks instead of
redistributing proprietary font binaries. Replace these stacks with licensed
fonts appropriate for your own app if needed.

## Included

- Next.js App Router and TypeScript
- Tailwind CSS and reusable UI components
- `next-intl` with English and Persian message files
- RTL-aware direction and a theme switcher
- Example appointment and authentication flows

## Production checklist

1. Configure backend URLs and production secrets securely.
2. Review and replace example appointment/authentication logic.
3. Update app branding and metadata.
4. Run `npm run build` and confirm application behavior.
   The provided Dockerfile is an optional **npm-only** standalone Next.js example
   using public Node images; adjust it if you use yarn or pnpm. The build creates
   an empty `public/` directory when the starter does not yet contain assets.
5. Test access controls and data flows with your real backend.

Source and CLI: https://github.com/alex-yaghoubi/next.js-starter
