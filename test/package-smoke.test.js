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
  assert.match(source, /path\.join\(__dirname,\s*"\.\.",\s*"starter-template"\)/);
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
  assert.ok(files.has("starter-template/package.json"), "template missing from package");
  assert.ok(!files.has("starter-template/.env"), "shared .env must not ship");
});


test("CLI generates a complete project without installing dependencies", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-smoke-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));

  execFileSync(
    process.execPath,
    [binPath, "sample-app", "--skip-install", "--no-git"],
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
  assert.match(fs.readFileSync(path.join(generated, ".gitignore"), "utf8"), /\.env\*\.local/);
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


test("starter manifest and lockfile stay in sync", () => {
  const starterPackage = JSON.parse(fs.readFileSync(path.join(templateDir, "package.json"), "utf8"));
  const starterLock = JSON.parse(fs.readFileSync(path.join(templateDir, "package-lock.json"), "utf8"));
  const lockedRoot = starterLock.packages[""];

  assert.deepEqual(lockedRoot.dependencies, starterPackage.dependencies);
  assert.deepEqual(lockedRoot.devDependencies, starterPackage.devDependencies);
  assert.equal(starterPackage.dependencies["react-table"], undefined,
    "legacy react-table does not support React 19");
  assert.equal(starterPackage.dependencies["@types/react-table"], undefined);
  assert.equal(starterLock.packages["node_modules/react-table"], undefined);
  assert.equal(starterLock.packages["node_modules/@types/react-table"], undefined);
});


test("two generated projects receive distinct authentication secrets", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-secrets-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));

  for (const name of ["alpha-app", "beta-app"]) {
    execFileSync(process.execPath, [binPath, name, "--skip-install", "--no-git"], {
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


test("scaffolded npm project has the requested package name and lockfile", (t) => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "nextjs-cli-names-"));
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  execFileSync(process.execPath, [binPath, "MySample", "--skip-install", "--no-git"], {
    cwd: sandbox, encoding: "utf8", timeout: 30000,
  });
  const dir = path.join(sandbox, "MySample");
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  const lock = JSON.parse(fs.readFileSync(path.join(dir, "package-lock.json"), "utf8"));
  assert.equal(pkg.name, "mysample");
  assert.equal(lock.name, pkg.name);
  assert.equal(lock.packages[""].name, pkg.name);
  assert.deepEqual(lock.packages[""].dependencies, pkg.dependencies);
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

test("template pins compatible Next.js and React majors", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, "package.json"), "utf8"));
  const lock = JSON.parse(fs.readFileSync(path.join(templateDir, "package-lock.json"), "utf8"));
  assert.equal(pkg.dependencies.next, "^15.3.0");
  assert.equal(pkg.dependencies.react, "^19.1.0");
  assert.equal(pkg.dependencies["react-dom"], "^19.1.0");
  assert.equal(lock.packages[""].dependencies.next, pkg.dependencies.next);
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
