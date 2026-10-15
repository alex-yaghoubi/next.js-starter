# Changelog

Significant source changes are recorded here. A version listed as
**Unreleased** is not available from npm until the maintainer publishes it.

## [Unreleased] — planned 1.3.5

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
