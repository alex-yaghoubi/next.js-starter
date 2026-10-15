# Maintainer release checklist

This document is for the npm package maintainer. GitHub source updates
do **not** automatically publish or update the version on npm.

## Before publishing

1. Confirm that `main` contains the intended change and the package version
   is new relative to `npm view create-nextjs-standard-app version`.
2. In GitHub, run **Actions → Manual package validation → Run workflow**
   with **build_template** enabled. Review **both** job results.
3. Confirm `npm ci`, `npm test`, `npm pack --dry-run`, and the
   generated template's `npm run build` pass.
4. Review all bundled files with `npm pack --dry-run --json`; avoid shipping
   secrets, internal endpoints, or organization-specific deployment configs.
5. Verify rights to redistribute any third-party fonts and other assets
   bundled in `starter-template` (code's MIT license does not grant rights
   to separately licensed assets).
6. Review relevant security advisories and dependency issues.
7. Update `CHANGELOG.md` from **Unreleased** to the intended version/date.

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
