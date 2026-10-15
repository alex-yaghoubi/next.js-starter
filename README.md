# create-nextjs-standard-app

[![npm version](https://img.shields.io/npm/v/create-nextjs-standard-app?label=npm)](https://www.npmjs.com/package/create-nextjs-standard-app)
[![npm weekly downloads](https://img.shields.io/npm/dw/create-nextjs-standard-app?label=weekly%20downloads)](https://www.npmjs.com/package/create-nextjs-standard-app)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**A Next.js application scaffolder** with TypeScript, Tailwind CSS,
English/Persian localization, RTL layouts, a theme switcher, and example
authentication/appointment screens.

[npm package](https://www.npmjs.com/package/create-nextjs-standard-app) ·
[GitHub source](https://github.com/alex-yaghoubi/next.js-starter) ·
[Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md)

> **Release status:** The fixes and new CLI options in `main` are development
> changes intended for the **next npm release**. Until that version is published,
> `npx` installs the existing npm release, which may not include these changes.
> See the [changelog](CHANGELOG.md) for the source-versus-release distinction.

## Quick start

**Requirements:** Node.js 20.9+ and npm, yarn, or pnpm.

```bash
npx create-nextjs-standard-app my-project
cd my-project
npm run dev
```

## CLI options in the current source

| Option | Purpose |
| --- | --- |
| `--pm npm\|yarn\|pnpm` | Choose the installer (default: npm) |
| `--no-git` | Skip initializing a Git repository |
| `--skip-install` | Generate source files without installing packages |
| `--help` | Show supported CLI options |

For example, generate the project without installing dependencies:

```bash
npx create-nextjs-standard-app my-project --skip-install --no-git
```

The generator creates `my-project/`, personalizes the package name and
generates an individual `NEXTAUTH_SECRET` in a git-ignored `.env.local`.
For yarn and pnpm, it removes the npm template lockfile so the selected
package manager can manage dependencies.

## What's inside?

- Next.js App Router, TypeScript, and Tailwind CSS
- English and Persian messages with `next-intl` and RTL awareness
- Theme switcher and reusable UI components
- Sample authentication and appointment UI and integrations
- Optional standalone Next.js Dockerfile (npm-based)

**Example code is not production-ready.** Some app-specific styling/assets
remain in the sample template; replace them with your own branding.
The sample auth and appointment flows need an API you own and a separate
security review before use with real users.

## Security defaults

- A new random authentication secret is generated for every scaffolded project.
- `.env.local` is excluded from Git and Docker build context.
- `.env.example` documents environment settings without bundling a shared secret.
- The sample backend has **no configured production endpoint** by default.
- No private deployment pipeline or internal container registry is included.
- The CLI refuses to overwrite an existing directory.

See the [template setup guide](starter-template/README.md) for backend setup.
Report security issues privately according to [SECURITY.md](SECURITY.md).

## Development and verification

```bash
npm ci
npm test
npm pack --dry-run
```

The test suite covers CLI behavior, generated package metadata, secret
isolation, dependency/lock consistency, and package contents.

To optionally validate the Next.js build, use **Actions → Manual package
validation → Run workflow**, or locally run:

```bash
cd starter-template
npm ci
npm run build
```

This GitHub Actions workflow is **manual only**. It does not gate commits,
deployment, merges, or npm publishing. Its results must be checked before
treating the pending source release as validated.

## Maintainer and license

Maintained by [Alex Yaghoubi](https://github.com/alex-yaghoubi).
Licensed under the [MIT License](LICENSE). For bugs, features, or pull
requests, see [Contributing](CONTRIBUTING.md).
