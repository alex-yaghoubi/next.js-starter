# Changelog

Significant source changes are recorded here. A version listed as
**Unreleased** is not available from npm until the maintainer publishes it.

## [Unreleased] — planned 2.0.0

### Breaking change

- A new clean, zero-config `basic` template is now the **default**.
- The previous Appointment-oriented template remains accessible with
  `--template appointment` for users of the original workflow.

### New basic template

- Next.js 15.5 patched baseline and React 19.1.8+ for new projects.
- Next.js App Router with English/Persian routes and RTL-aware layout.
- Responsive landing page with a practical getting-started section.
- Tailwind CSS 3, TypeScript, `next-intl`, and `next-themes`.
- No backend, database, auth provider, environment variable, or third-party
  font dependency required to run the basic template.
- Remove unattributed third-party font binaries from the optional Appointment
  template too; use system font stacks instead.
- Remove the obsolete pinned Appointment lockfile and use patched Next.js/React
  minimums so new installs do not inherit insecure dependency snapshots.
- Expanded CLI checks verifying template selection and output files.
- Split CLI into dedicated validation and scaffolding modules, with safe rollback
  if copying fails and recovery instructions if installation fails.
- Extract reusable header, footer and feature cards; localize accessible controls
  and add a skip-to-content link.
- Manual GitHub Action checks real HTTP responses from /en and /fa after a build.

### Additional hardening originally prepared for 1.3.5

### Changed

- Resolve the starter template relative to the CLI package root.
- Expose the canonical `create-nextjs-standard-app` command, retaining the
  legacy CLI alias for compatibility.
- Set each generated project's package name and matching npm lockfile metadata.
- Validate directory names and package managers before writing project files.
- Support scaffold-only mode and npm, yarn, or pnpm installation.
- Pin compatible Next.js and React major versions in the starter template.
- Replace private deployment assumptions with a public Node Docker example.
- Provide a neutral default homepage and remove unused React 18-only table dependencies.
- Replace the stale navigation, copyright and translations with starter-friendly defaults.
- Use Next.js 15 async route search parameters in example auth pages; make unfinished API endpoints return 501.
- Correct App Router's nested auth layout so it does not emit a second document root.

### Security

- Generate a unique, git-ignored authentication secret in each new project.
- Remove the shared example secret and the hard-coded Octavia production API.
- Ensure the sample auth flow does not assume a backend returns raw passwords.
- Clarify sample API/authentication limitations and local environment handling.

### Developer experience

- Add CLI, tarball, configuration, and regression smoke tests.
- Add a manual-only validation workflow and open-source project documentation.
- Document a release checklist and tarball consumer verification step.

## Published releases

Earlier versions and their release dates are tracked on
[npm](https://www.npmjs.com/package/create-nextjs-standard-app?activeTab=versions).
