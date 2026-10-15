# create-nextjs-standard-app ⚡️

[![npm version](https://img.shields.io/npm/v/create-nextjs-standard-app?label=npm%20version)](https://www.npmjs.com/package/create-nextjs-standard-app)
[![npm weekly downloads](https://img.shields.io/npm/dw/create-nextjs-standard-app?label=weekly%20downloads)](https://www.npmjs.com/package/create-nextjs-standard-app)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

**[View on npm](https://www.npmjs.com/package/create-nextjs-standard-app)** · **[Source on GitHub](https://github.com/alex-yaghoubi/next.js-starter)**


A reusable CLI for scaffolding **Next.js + Tailwind CSS + TypeScript + i18n** applications, with English/Persian language support and RTL layouts.

**Requirements:** Node.js 20.9+ and npm, yarn, or pnpm.

## 🚀 Usage

Create a new project:

```bash
npx create-nextjs-standard-app my-project
cd my-project
npm run dev
```

The generator copies its starter template, installs dependencies using your selected package manager, and optionally initializes Git.

Use pnpm instead of npm:

```bash
npx create-nextjs-standard-app my-project --pm pnpm
```

Skip automatic Git initialization:

```bash
npx create-nextjs-standard-app my-project --no-git
```

For the complete options list, run `npx create-nextjs-standard-app --help`.

> This repository contains the source for the npm package. Changes on GitHub do not change the already-published npm version until a new release is published.

---

## 📦 What’s included?

- ✅ Next.js App Router (with `/app`)
- ✅ Tailwind CSS ready to go
- ✅ RTL & Persian (`fa`) setup by default
- ✅ Theme toggle (dark/light)
- ✅ Locales & i18n structure
- ✅ Server-first design (no `use client` by default)

---

## ✨ Perfect for

- Booking/Appointment platforms
- B2B dashboards
- Medical, Legal, or Clinic platforms
- Multilingual (RTL & LTR)

---

## 🧪 Tech Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [App Router + SSR + Edge-ready]

---

## 🧪 Development and packaging checks

```bash
npm ci
npm test
npm pack --dry-run
```

The smoke tests check the published CLI entrypoint and confirm that the template is included in the npm package.

For issues or contributions, use the [GitHub repository](https://github.com/alex-yaghoubi/next.js-starter).

---

## 🛠 Author

Created by [Alex Yaghoubi](https://github.com/alex-yaghoubi). Published as [`create-nextjs-standard-app`](https://www.npmjs.com/package/create-nextjs-standard-app) on npm.
