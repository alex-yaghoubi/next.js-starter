"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const {randomBytes} = require("node:crypto");
const {execFileSync} = require("node:child_process");
const {validateOptions, getTemplateDirectory, getInstallCommand} = require("./project-options");

const REQUIRED_IGNORE_LINES = [
  "node_modules/",
  ".next/",
  ".env",
  ".env.*",
  "!.env.example",
];

async function saveJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function updatePackageName(targetDir, name) {
  const manifestPath = path.join(targetDir, "package.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  manifest.name = name.toLowerCase();
  await saveJson(manifestPath, manifest);
}

async function updateLocalization(targetDir, name) {
  const messagesDir = path.join(targetDir, "messages");
  const displayName = name.replace(/[-_.]+/g, " ")
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase()).trim();

  const entries = await fs.readdir(messagesDir);
  for (const fileName of entries.filter((entry) => /^[a-z]{2}(?:-[A-Za-z]{2})?\.json$/.test(entry))) {
    const messagePath = path.join(messagesDir, fileName);
    const data = JSON.parse(await fs.readFile(messagePath, "utf8"));
    if (data.Metadata && data.Navigation) {
      data.Metadata.title = displayName;
      data.Navigation.brand = displayName;
      await saveJson(messagePath, data);
    }
  }
}

async function updateLockfile(targetDir, name, manager) {
  const file = path.join(targetDir, "package-lock.json");

  // npm creates a fresh lockfile for the basic starter. Other managers
  // should never inherit npm's lockfile from the optional legacy template.
  if (manager !== "npm") {
    await fs.rm(file, {force: true});
    return;
  }

  let lock;
  try {
    lock = JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  lock.name = name.toLowerCase();
  if (lock.packages && lock.packages[""]) {
    lock.packages[""].name = lock.name;
  }
  await saveJson(file, lock);
}

async function enforceGitIgnore(targetDir) {
  const file = path.join(targetDir, ".gitignore");
  let existing = "";
  try {
    existing = await fs.readFile(file, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const lines = new Set(existing.split(/\r?\n/).map((line) => line.trim()));
  const missing = REQUIRED_IGNORE_LINES.filter((line) => !lines.has(line));
  if (missing.length) {
    await fs.appendFile(file, "\n# Generated project defaults\n" + missing.join("\n") + "\n");
  }
}

async function addAppointmentSecret(targetDir) {
  const secret = randomBytes(32).toString("base64url");
  await fs.writeFile(
    path.join(targetDir, ".env.local"),
    "NEXTAUTH_SECRET=" + secret + "\nNEXTAUTH_URL=http://localhost:3000\n",
    {flag: "wx", mode: 0o600}
  );
}

/**
 * Resolve a safe scaffold plan without writing any files. Useful for users
 * who want to see exactly which template and directory will be used.
 */
async function previewProject(rawOptions, parentDirectory = process.cwd()) {
  const options = validateOptions(rawOptions);
  const sourceDir = getTemplateDirectory(options.template);
  const targetDir = path.resolve(parentDirectory, options.name);

  await fs.access(path.join(sourceDir, "package.json"));
  let targetExists = false;
  try {
    await fs.lstat(targetDir);
    targetExists = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return {options, sourceDir, targetDir, targetExists};
}

/**
 * Creates the project directory atomically with mkdir: an existing user folder
 * is never overwritten. On scaffold failure, only our newly-created folder
 * is removed. An install failure afterwards intentionally leaves files intact.
 */
async function scaffoldProject(rawOptions, parentDirectory = process.cwd(), fsOps = fs) {
  const {options, sourceDir, targetDir, targetExists} =
    await previewProject(rawOptions, parentDirectory);

  if (targetExists) {
    throw new Error('Directory "' + options.name + '" already exists. Choose another name.');
  }

  // Atomic reservation, eliminating the access-then-copy race.
  try {
    await fsOps.mkdir(targetDir);
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error('Directory "' + options.name + '" already exists. Choose another name.');
    }
    throw error;
  }

  try {
    // Copy entries into our exclusively reserved folder. Copying the source
    // directory itself into an existing folder behaves differently across Node versions.
    const entries = await fs.readdir(sourceDir);
    for (const entry of entries) {
      await fsOps.cp(path.join(sourceDir, entry), path.join(targetDir, entry), {
        recursive: true,
        force: false,
        errorOnExist: true,
      });
    }
    await updatePackageName(targetDir, options.name);
    if (options.template === "basic") {
      await updateLocalization(targetDir, options.name);
    }
    await updateLockfile(targetDir, options.name, options.packageManager);
    await enforceGitIgnore(targetDir);
    if (options.template === "appointment") {
      await addAppointmentSecret(targetDir);
    }
  } catch (error) {
    await fs.rm(targetDir, {recursive: true, force: true});
    throw error;
  }

  return {options, targetDir};
}

function installDependencies({options, targetDir}, runner = execFileSync) {
  const {command, args} = getInstallCommand(options.packageManager);
  if (options.skipInstall) return false;
  try {
    runner(command, args, {cwd: targetDir, stdio: "inherit"});
  } catch (error) {
    throw new Error(
      "Dependency installation failed; your project files remain at " + targetDir +
      '. Retry with "' + options.packageManager + ' install". ' + error.message
    );
  }
  return true;
}

function initializeRepository({options, targetDir}, runner = execFileSync) {
  if (!options.initializeGit) return false;
  runner("git", ["init"], {cwd: targetDir, stdio: "ignore"});
  return true;
}

module.exports = {
  REQUIRED_IGNORE_LINES,
  previewProject,
  scaffoldProject,
  installDependencies,
  initializeRepository,
  updatePackageName,
  updateLocalization,
  updateLockfile,
  enforceGitIgnore,
};
