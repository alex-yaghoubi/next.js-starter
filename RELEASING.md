# Maintainer release checklist

This document is for the npm package maintainer. GitHub source updates
do **not** automatically publish or update the version on npm.

## Before publishing

1. Confirm that `main` contains the intended change and the package version
   is new relative to `npm view create-nextjs-standard-app version`.
2. In GitHub, run **Actions → Manual package validation → Run workflow**
   with **build_template** and **test_matrix** enabled. Review the CLI
   smoke test, basic app build, and **all six matrix combinations**.
   Optionally enable **build_appointment** to validate the legacy example;
   none of these jobs are required checks or deployment gates.
3. Confirm `npm ci`, `npm test`, `npm pack --dry-run`, each matrix build, and the
   **default basic template** `npm run typecheck` and `npm run build` pass.
   The new default template is a breaking change and requires a
   **2.0.0 major-version release**. Also verify that both /en and /fa
   return localized HTML with the correct direction (LTR/RTL).
4. Review all bundled files with `npm pack --dry-run --json`; avoid shipping
   secrets, internal endpoints, or organization-specific deployment configs.
5. Confirm `npm pack --dry-run --json` excludes former third-party font
   binaries from the optional Appointment template. Review rights to any
   other assets, and ensure packaged files contain no proprietary material.
6. Confirm the optional Appointment example still scaffolds and includes all
   seven UI primitives required by auth forms; check its own build before claiming
   it production-ready. Review relevant dependency/security advisories.
7. Confirm the basic template is the default and `--template appointment` remains available.
8. Update `CHANGELOG.md` from **Unreleased** to the intended version/date.

## Publish manually with the authorized npm account

```bash
npm whoami
npm view create-nextjs-standard-app version
npm pack --dry-run
npm publish --access public
```

Publishing requires maintainer authorization and any npm account MFA.
**There is no automated publish job** and no credentials are committed.

## After publishing

- Confirm the new version on [npm](https://www.npmjs.com/package/create-nextjs-standard-app).
- Test the exact published version in a fresh folder.
- Add a matching Git tag/release once the published artifact has been verified.
- Update the version status notes in `README.md` if necessary.
