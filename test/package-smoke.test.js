const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
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
});
