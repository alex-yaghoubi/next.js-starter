# Contributing

Thanks for helping improve **create-nextjs-standard-app**. Contributions that
improve the generator, its security, compatibility, documentation, and starter
template are welcome.

## Before submitting

1. Check existing [issues](https://github.com/alex-yaghoubi/next.js-starter/issues).
2. Use Node.js **20.9+** and an up-to-date npm version.
3. Make a focused change; keep the public template independent of private
   registries, real API credentials, and organization-specific deployment settings.
4. Keep the generator's existing command names backward-compatible.
5. Run the checks below and describe what was tested in your pull request.

## Local checks

```bash
npm ci
npm test
npm pack --dry-run
cd starter-template
npm ci
npm run build
```

The template build checks are separate from the CLI smoke tests. Some
appointment/authentication screens are examples and require a backend you
control before they can be exercised end to end.

## Submitting a change

- Make the change in a feature branch and open a pull request.
- Include the behavior changed, any compatibility risk, and test results.
- Never add real secrets, production endpoints, or credentials to issues or PRs.
- Do not publish a new npm version from an outside contribution.
- For security concerns, follow [SECURITY.md](SECURITY.md) instead of opening
  a public vulnerability report.
