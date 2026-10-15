const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const binRelativePath = manifest.bin["create-nextjs-standard-app"];
const binPath = path.join(root, binRelativePath || "");
const templateDir = path.resolve(path.dirname(binPath), "..", "starter-template");

test("npm exposes the expected CLI command", () => {
  assert.equal(manifest.name, "create-nextjs-standard-app");
  assert.equal(binRelativePath, "./bin/create-nextjs-standard-app.js");
  assert.ok(fs.existsSync(binPath), "CLI executable should exist");
  assert.ok(fs.existsSync(path.join(templateDir, "package.json")), "starter template should exist");

  const source = fs.readFileSync(binPath, "utf8");
  assert.match(source, /require\("\.\.\/lib\/scaffold"\)/);
  const options = fs.readFileSync(path.join(root, "lib", "project-options.js"), "utf8");
  assert.ok(options.includes('"starter-basic"'));
  assert.ok(options.includes('"starter-template"'));
});

test("npm tarball includes both the CLI and the starter template", () => {
  const result = execFileSync(
    "npm",
    ["pack", "--dry-run", "--json", "--ignore-scripts"],
    { cwd: root, encoding: "utf8", timeout: 30000 }
  );
  const metadata = JSON.parse(result);
  const files = new Set(metadata[0].files.map((item) => item.path));

  assert.ok(files.has("bin/create-nextjs-standard-app.js"), "CLI missing from package");
  assert.ok(files.has("lib/scaffold.js"), "core scaffolding module missing from npm tarball");
  assert.ok(files.has("lib/project-options.js"), "CLI options module missing from npm tarball");
  assert.ok(files.has("starter-template/package.json"), "template missing from package");
  assert.ok(files.has("starter-basic/package.json"), "basic starter missing from npm package");
  assert.ok(files.has("starter-basic/messages/fa.json"), "basic localization missing");
  assert.ok(!files.has("starter-template/.env"), "shared .env must not ship");
  assert.ok(!files.has("starter-template/package-lock.json"), "stale legacy lockfile must not ship");
  assert.ok(![...files].some((item) => item.startsWith("starter-template/assets/fonts/")),
    "unlicensed font binaries must not be redistributed");
});


test("CLI generates a complete project without installing dependencies", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-smoke-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));

  execFileSync(
    process.execPath,
    [binPath, "sample-app", "--template", "appointment", "--skip-install", "--no-git"],
    { cwd: sandbox, encoding: "utf8", timeout: 30000 }
  );

  const generated = path.join(sandbox, "sample-app");
  assert.ok(fs.existsSync(path.join(generated, "package.json")));
  assert.ok(fs.existsSync(path.join(generated, "app", "page.tsx")));
  assert.ok(fs.existsSync(path.join(generated, "i18n", "fa.json")));
  assert.ok(fs.existsSync(path.join(generated, "i18n", "en.json")));
  assert.ok(!fs.existsSync(path.join(generated, "node_modules")));
  assert.ok(!fs.existsSync(path.join(generated, ".git")));
  assert.ok(!fs.existsSync(path.join(generated, ".env")), "no shared secret may ship as .env");
  assert.ok(fs.existsSync(path.join(generated, ".gitignore")), "generated app must ignore secrets");
  const envLocal = fs.readFileSync(path.join(generated, ".env.local"), "utf8");
  const secret = envLocal.match(/^NEXTAUTH_SECRET=(.+)$/m)?.[1];
  assert.ok(secret && secret.length >= 40, "a strong unique auth secret must be generated");
  assert.match(envLocal, /^NEXTAUTH_URL=http:\/\/localhost:3000$/m);
  assert.match(fs.readFileSync(path.join(generated, ".gitignore"), "utf8"), /^\.env\.\*$/m);
  assert.ok(fs.existsSync(path.join(generated, ".env.example")));
});

test("CLI rejects paths outside the current directory", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-validation-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));

  assert.throws(() => execFileSync(
    process.execPath,
    [binPath, "../outside", "--skip-install", "--no-git"],
    { cwd: sandbox, encoding: "utf8", stdio: "pipe", timeout: 30000 }
  ));
  assert.ok(!fs.existsSync(path.join(sandbox, "outside")));
});


test("legacy appointment template avoids vulnerable frozen dependencies", () => {
  const legacy = JSON.parse(fs.readFileSync(path.join(templateDir, "package.json"), "utf8"));
  assert.equal(legacy.dependencies.next, "^15.5.28");
  assert.equal(legacy.dependencies.react, "^19.1.8");
  assert.equal(legacy.dependencies["react-dom"], "^19.1.8");
  assert.equal(legacy.dependencies["react-table"], undefined);
  assert.equal(legacy.dependencies["@types/react-table"], undefined);
  assert.ok(!fs.existsSync(path.join(templateDir, "package-lock.json")),
    "a lockfile with stale Next.js versions must not be distributed");
});


test("two generated projects receive distinct authentication secrets", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-secrets-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));

  for (const name of ["alpha-app", "beta-app"]) {
    execFileSync(process.execPath, [binPath, name, "--template", "appointment", "--skip-install", "--no-git"], {
      cwd: sandbox,
      encoding: "utf8",
      timeout: 30000,
    });
  }

  const getSecret = (name) =>
    fs.readFileSync(path.join(sandbox, name, ".env.local"), "utf8")
      .match(/^NEXTAUTH_SECRET=(.+)$/m)?.[1];
  assert.ok(getSecret("alpha-app"));
  assert.ok(getSecret("beta-app"));
  assert.notEqual(getSecret("alpha-app"), getSecret("beta-app"));
});

test("template cannot silently point at the Octavia production API", () => {
  const config = fs.readFileSync(path.join(templateDir, "configs", "api.config.ts"), "utf8");
  assert.ok(config.includes("process.env.APPOINTMENT_API_BASE_URL"));
  assert.ok(!config.includes("https://api.octavia.ir"));
  assert.ok(!fs.existsSync(path.join(templateDir, ".env")));
});


test("Auth.js route exports proper handlers", () => {
  const authRoute = fs.readFileSync(
    path.join(templateDir, "app", "api", "auth", "[...nextauth]", "route.ts"), "utf8"
  );
  assert.match(authRoute, /export const \{ GET, POST \} = handlers;/);
  assert.doesNotMatch(authRoute, /export \{ handlers as GET/);
});

test("verification never assumes that the backend returns a plaintext password", () => {
  const actions = fs.readFileSync(path.join(templateDir, "actions", "auth.ts"), "utf8");
  assert.doesNotMatch(actions, /response\.data\.data\.user\.password/);
  assert.match(actions, /process\.env\.APPOINTMENT_API_BASE_URL/);
});


test("scaffolded appointment project uses the requested name without a stale lockfile", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-names-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  execFileSync(process.execPath, [binPath, "MySample", "--template", "appointment", "--skip-install", "--no-git"], {
    cwd: sandbox, encoding: "utf8", timeout: 30000,
  });
  const dir = path.join(sandbox, "MySample");
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  assert.equal(pkg.name, "mysample");
  assert.ok(!fs.existsSync(path.join(dir, "package-lock.json")),
    "npm install should generate a fresh lockfile using patched versions");
});

test("yarn consumers do not inherit npm lockfile", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-yarn-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  execFileSync(process.execPath,
    [binPath, "yarn-project", "--pm", "yarn", "--skip-install", "--no-git"],
    { cwd: sandbox, encoding: "utf8", timeout: 30000 });
  assert.ok(fs.existsSync(path.join(sandbox, "yarn-project", "package.json")));
  assert.ok(!fs.existsSync(path.join(sandbox, "yarn-project", "package-lock.json")));
});

test("invalid package manager never creates a directory", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-invalidpm-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  assert.throws(() => execFileSync(process.execPath,
    [binPath, "bad-pm", "--pm", "unknown", "--skip-install", "--no-git"],
    { cwd: sandbox, encoding: "utf8", stdio: "pipe", timeout: 30000 }));
  assert.ok(!fs.existsSync(path.join(sandbox, "bad-pm")));
});

test("an existing directory is never overwritten", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-existing-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  const target = path.join(sandbox, "existing-app");
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, "important.txt"), "untouched");
  assert.throws(() => execFileSync(process.execPath,
    [binPath, "existing-app", "--skip-install", "--no-git"],
    { cwd: sandbox, encoding: "utf8", stdio: "pipe", timeout: 30000 }));
  assert.equal(fs.readFileSync(path.join(target, "important.txt"), "utf8"), "untouched");
});

test("legacy template uses patched Next.js and React major versions", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, "package.json"), "utf8"));
  assert.equal(pkg.dependencies.next, "^15.5.28");
  assert.equal(pkg.dependencies.react, "^19.1.8");
  assert.equal(pkg.dependencies["react-dom"], "^19.1.8");
});



test("scaffold never includes a private container registry or mandatory deployment pipeline", () => {
  const docker = fs.readFileSync(path.join(templateDir, "Dockerfile"), "utf8");
  assert.match(docker, /FROM node:22-alpine/);
  assert.doesNotMatch(docker, /octavia\.ir|npm install --force/);
  assert.ok(!fs.existsSync(path.join(templateDir, "Jenkinsfile")));
  assert.ok(!fs.existsSync(path.join(templateDir, "nginx.conf")));
});

test("template explicitly ignores local credentials in Git and Docker", () => {
  const gitignore = fs.readFileSync(path.join(templateDir, ".gitignore"), "utf8");
  const dockerignore = fs.readFileSync(path.join(templateDir, ".dockerignore"), "utf8");
  assert.match(gitignore, /^\.env\.\*$/m);
  assert.match(gitignore, /^!\.env\.example$/m);
  assert.match(dockerignore, /^\.env\.\*$/m);
});


test("starter uses valid nested auth layout and only present navigation routes", () => {
  const layout = fs.readFileSync(path.join(templateDir, "app", "auth", "layout.tsx"), "utf8");
  const nav = fs.readFileSync(path.join(templateDir, "components", "server", "Navbar.tsx"), "utf8");
  assert.doesNotMatch(layout, /<html\b|<body\b/);
  assert.doesNotMatch(nav, /href="\/about"|href="\/services"|href="\/projects"|href="\/contact"/);
  assert.match(nav, /href="\/auth\/phone"/);
  for (const locale of ["en", "fa"]) {
    const messages = JSON.parse(fs.readFileSync(path.join(templateDir, "i18n", locale + ".json"), "utf8"));
    assert.ok(messages.Navbar.links.home && messages.Navbar.links.signIn);
    assert.ok(!JSON.stringify(messages).includes("Octavia"));
  }
});


test("Next.js 15 auth pages use awaited searchParams", () => {
  for (const name of ["phone", "password", "signup", "verify-login", "verify-signup"]) {
    const page = fs.readFileSync(path.join(templateDir, "app", "auth", name, "page.tsx"), "utf8");
    assert.match(page, /searchParams: Promise<\{/);
    assert.match(page, /await searchParams/);
    assert.doesNotMatch(page, /searchParams\.(phone|error)/);
    assert.doesNotMatch(page, /redirect\("\/dashboard"\)/);
  }
});

test("sample API routes are explicit non-operational stubs", () => {
  for (const name of ["appointments", "clients", "professionals"]) {
    const source = fs.readFileSync(path.join(templateDir, "app", "api", name, "route.ts"), "utf8");
    assert.match(source, /export async function GET/);
    assert.match(source, /status: 501/);
  }
});


test("default scaffold is a zero-config multilingual Next.js app", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-basic-default-"));
  t.after(() => fs.rmSync(sandbox, {recursive: true, force: true}));
  execFileSync(process.execPath, [binPath, "my-app", "--skip-install", "--no-git"], {
    cwd: sandbox, encoding: "utf8", timeout: 30000
  });
  const app = path.join(sandbox, "my-app");
  const pkg = JSON.parse(fs.readFileSync(path.join(app, "package.json"), "utf8"));
  assert.equal(pkg.name, "my-app");
  for (const locale of ["en", "fa"]) {
    const messages = JSON.parse(fs.readFileSync(path.join(app, "messages", locale + ".json"), "utf8"));
    assert.equal(messages.Metadata.title, "My App");
    assert.equal(messages.Navigation.brand, "My App");
  }
  assert.ok(fs.existsSync(path.join(app, "app", "[locale]", "page.tsx")));
  assert.ok(fs.existsSync(path.join(app, "app", "[locale]", "layout.tsx")));
  assert.ok(fs.existsSync(path.join(app, "messages", "en.json")));
  assert.ok(fs.existsSync(path.join(app, "messages", "fa.json")));
  assert.ok(fs.existsSync(path.join(app, "middleware.ts")));
  assert.ok(fs.existsSync(path.join(app, ".gitignore")));
  assert.ok(!fs.existsSync(path.join(app, ".env.local")), "basic apps should not need Auth.js secrets");
  assert.ok(!fs.existsSync(path.join(app, "package-lock.json")), "npm creates its own fresh lockfile");
  assert.equal(pkg.dependencies["next-auth"], undefined);
  assert.equal(pkg.dependencies["next-intl"], "^4.0.2");
  assert.equal(pkg.dependencies["next-themes"], "^0.4.6");
  assert.equal(pkg.dependencies.next, "^15.5.28");
  assert.equal(pkg.dependencies.react, "^19.1.8");
});

test("basic template does not ship Octavia application services or licensed fonts", () => {
  const base = path.resolve(root, "starter-basic");
  const paths = ["lib/auth.ts", "actions/auth.ts", "assets/fonts", ".env", ".env.local"];
  for (const rel of paths) assert.ok(!fs.existsSync(path.join(base, rel)), rel);
  assert.ok(!fs.readFileSync(path.join(base, "app", "[locale]", "page.tsx"), "utf8").includes("api.octavia.ir"));
});

test("English and Persian landing messages have matching translation keys", () => {
  const messagesDir = path.resolve(root, "starter-basic", "messages");
  const en = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));
  const fa = JSON.parse(fs.readFileSync(path.join(messagesDir, "fa.json"), "utf8"));
  for (const section of Object.keys(en)) {
    assert.deepEqual(Object.keys(en[section]).sort(), Object.keys(fa[section]).sort(), section);
  }
  assert.match(
    fs.readFileSync(path.resolve(root, "starter-basic", "app", "[locale]", "layout.tsx"), "utf8"),
    /locale === "fa" \? "rtl" : "ltr"/
  );
});


test("basic template uses security-patched compatible Next.js and React baselines", () => {
  const starter = JSON.parse(fs.readFileSync(path.join(root, "starter-basic", "package.json"), "utf8"));
  assert.equal(starter.dependencies.next, "^15.5.28");
  assert.equal(starter.dependencies.react, "^19.1.8");
  assert.equal(starter.dependencies["react-dom"], "^19.1.8");
  assert.ok(!fs.existsSync(path.join(root, "starter-basic", "package-lock.json")),
    "a stale lockfile must not downgrade the security baseline");
});


test("optional appointment template uses system fonts and bundles no font binaries", () => {
  const css = fs.readFileSync(path.join(templateDir, "styles", "globals.css"), "utf8");
  const tailwind = fs.readFileSync(path.join(templateDir, "tailwind.config.ts"), "utf8");
  assert.doesNotMatch(css, /@font-face|assets\/fonts|\.woff2/);
  assert.doesNotMatch(tailwind, /Octavia-EN|YekanBakh.*-Ubitex/);
  const fonts = path.join(templateDir, "assets", "fonts");
  assert.ok(!fs.existsSync(fonts) || fs.readdirSync(fonts).length === 0);
});


test("core modules expose independent options and scaffolding interfaces", () => {
  const core = require("../lib/scaffold");
  const opts = require("../lib/project-options");
  assert.equal(typeof core.scaffoldProject, "function");
  assert.equal(typeof core.installDependencies, "function");
  assert.equal(typeof core.initializeRepository, "function");
  assert.equal(opts.validateOptions({name: "hello-app"}).template, "basic");
  assert.equal(opts.getInstallCommand("pnpm").command, "pnpm");
});

test("project name validation rejects traversal and unsafe Windows device names", () => {
  const {validateProjectName} = require("../lib/project-options");
  for (const name of ["../foo", ".", "..", "-bad", "CON", "aux.txt", "some/path", "a..\\b"]) {
    assert.throws(() => validateProjectName(name), name);
  }
  assert.equal(validateProjectName("My-App_1"), "My-App_1");
});

test("bad options are rejected without filesystem side effects", async (t) => {
  const {scaffoldProject} = require("../lib/scaffold");
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-bad-options-"));
  t.after(() => fs.rmSync(rootDir, {recursive: true, force: true}));
  await assert.rejects(scaffoldProject({name: "valid-name", template: "missing"}, rootDir));
  await assert.rejects(scaffoldProject({name: "valid-name", packageManager: "oops"}, rootDir));
  assert.deepEqual(fs.readdirSync(rootDir), []);
});

test("failed copy cleans up only the newly-reserved directory", async (t) => {
  const {scaffoldProject} = require("../lib/scaffold");
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-copy-failure-"));
  t.after(() => fs.rmSync(rootDir, {recursive: true, force: true}));
  const fsPromises = require("node:fs/promises");
  const fakeFs = {
    mkdir: (...args) => fsPromises.mkdir(...args),
    cp: async () => { throw new Error("simulated copy failure"); }
  };
  await assert.rejects(scaffoldProject({name: "broken-app"}, rootDir, fakeFs), /simulated/);
  assert.ok(!fs.existsSync(path.join(rootDir, "broken-app")));
});

test("dependency installation errors preserve generated files", async (t) => {
  const {scaffoldProject, installDependencies} = require("../lib/scaffold");
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-install-failure-"));
  t.after(() => fs.rmSync(rootDir, {recursive: true, force: true}));
  const project = await scaffoldProject({name: "recoverable-app"}, rootDir);
  assert.throws(
    () => installDependencies(project, () => { throw new Error("network unavailable"); }),
    /Retry with "npm install"/
  );
  assert.ok(fs.existsSync(path.join(project.targetDir, "package.json")));
});

test("scaffolded projects always ignore build output and secrets", async (t) => {
  const {scaffoldProject, REQUIRED_IGNORE_LINES} = require("../lib/scaffold");
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-ignore-check-"));
  t.after(() => fs.rmSync(rootDir, {recursive: true, force: true}));
  const project = await scaffoldProject({name: "ignored-app"}, rootDir);
  const gitignore = fs.readFileSync(path.join(project.targetDir, ".gitignore"), "utf8").split(/\r?\n/);
  for (const line of REQUIRED_IGNORE_LINES) {
    assert.ok(gitignore.includes(line), "Missing ignore rule: " + line);
  }
});


test("numeric directory names from yargs are converted to valid project names", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-numeric-project-"));
  t.after(() => fs.rmSync(sandbox, {recursive: true, force: true}));
  execFileSync(process.execPath, [binPath, "2026", "--skip-install", "--no-git"], {
    cwd: sandbox, timeout: 30000, encoding: "utf8",
  });
  assert.ok(fs.existsSync(path.join(sandbox, "2026", "package.json")));
});

test("starter layouts reuse presentational components and localized controls", () => {
  const dir = path.join(root, "starter-basic");
  const layout = fs.readFileSync(path.join(dir, "app", "[locale]", "layout.tsx"), "utf8");
  const home = fs.readFileSync(path.join(dir, "app", "[locale]", "page.tsx"), "utf8");
  assert.match(layout, /<SiteHeader/);
  assert.match(layout, /<SiteFooter/);
  assert.match(home, /<FeatureCard/);
  for (const locale of ["en", "fa"]) {
    const messages = JSON.parse(fs.readFileSync(path.join(dir, "messages", locale + ".json"), "utf8"));
    assert.ok(messages.Navigation.skipToContent);
    assert.ok(messages.Navigation.navigationLabel);
    assert.ok(messages.Controls.switchToLight);
    assert.ok(messages.Controls.switchToDark);
    assert.ok(messages.Controls.switchToEnglish);
    assert.ok(messages.Controls.switchToPersian);
  }
});


test("copies each template entry into an exclusively reserved target", async (t) => {
  const {scaffoldProject} = require("../lib/scaffold");
  const io = require("node:fs/promises");
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cross-node-copy-"));
  t.after(() => fs.rmSync(rootDir, {recursive: true, force: true}));
  const copied = [];
  const instrumented = {
    mkdir: (...args) => io.mkdir(...args),
    cp: async (source, dest, options) => {
      copied.push({source, dest, options});
      return io.cp(source, dest, options);
    },
  };
  const project = await scaffoldProject({name: "copyable"}, rootDir, instrumented);
  assert.ok(copied.length > 3);
  assert.ok(copied.every(({source, dest, options}) =>
    source !== path.join(root, "starter-basic") &&
    path.dirname(dest) === project.targetDir &&
    options.force === false &&
    options.errorOnExist === true
  ));
  assert.ok(fs.existsSync(path.join(project.targetDir, "app", "[locale]", "page.tsx")));
});


test("appointment template only ships UI primitives used by the example flows", () => {
  const uiDir = path.join(templateDir, "components", "ui");
  const included = fs.readdirSync(uiDir).filter((item) => item.endsWith(".tsx")).sort();
  const expected = ["button.tsx", "card.tsx", "input-otp.tsx", "input-password.tsx",
    "input.tsx", "progress.tsx", "select.tsx"].sort();
  assert.deepEqual(included, expected);
});

test("appointment dependencies include Radix Slot used by the shared button", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, "package.json"), "utf8"));
  const button = fs.readFileSync(path.join(templateDir, "components", "ui", "button.tsx"), "utf8");
  assert.match(button, /@radix-ui\/react-slot/);
  assert.ok(pkg.dependencies["@radix-ui/react-slot"]);
  for (const dep of ["@radix-ui/react-dialog", "motion", "next-themes", "react-icons", "tailwindcss-animate"]) {
    assert.equal(pkg.dependencies[dep], undefined, dep + " is not used by the retained example");
  }
});

test("appointment example contains no obsolete placeholder actions or unused network helper", () => {
  for (const pathName of ["actions/appointments.ts", "actions/profile.ts",
    "actions/settings.ts", "lib/db.ts", "lib/fetch.ts"]) {
    assert.ok(!fs.existsSync(path.join(templateDir, pathName)), pathName);
  }
  for (const file of ["button.tsx", "card.tsx", "input.tsx", "input-password.tsx",
    "input-otp.tsx", "progress.tsx", "select.tsx"]) {
    assert.ok(fs.existsSync(path.join(templateDir, "components", "ui", file)));
  }
});
