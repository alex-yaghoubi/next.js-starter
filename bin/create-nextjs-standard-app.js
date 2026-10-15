#!/usr/bin/env node

const fs = require("node:fs").promises;
const path = require("node:path");
const { randomBytes } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const ora = require("ora");
const chalk = require("chalk");
const yargs = require("yargs");

const argv = yargs
  .scriptName("create-nextjs-standard-app")
  .usage("$0 <project-name> [options]")
  .option("package-manager", {
    alias: "pm",
    describe: "Package manager for dependency installation (npm, yarn, pnpm)",
    type: "string",
    default: "npm",
  })
  .option("git", {
    describe: "Initialize a Git repository",
    type: "boolean",
    default: true,
  })
  .option("skip-install", {
    describe: "Create project files without installing dependencies",
    type: "boolean",
    default: false,
  })
  .option("template", {
    describe: "Scaffold a clean app (basic) or the legacy appointment example",
    type: "string",
    choices: ["basic", "appointment"],
    default: "basic",
  })
  .strictOptions()
  .help().argv;

const name = String(argv._[0] ?? "");
const pm = argv["package-manager"];
const packageManagers = {
  npm: ["npm", ["install"]],
  yarn: ["yarn", ["install"]],
  pnpm: ["pnpm", ["install"]],
};

async function run() {
  if (argv._.length !== 1 || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name) ||
      name === "." || name === ".." || name.endsWith(".")) {
    throw new Error("Provide one project name using letters, numbers, dots, dashes, or underscores.");
  }

  // Validate options before writing any files.
  if (!Object.hasOwn(packageManagers, pm)) {
    throw new Error('Unsupported package manager "' + pm + '". Choose npm, yarn, or pnpm.');
  }

  const sourceDir = path.resolve(
    __dirname, "..", argv.template === "appointment" ? "starter-template" : "starter-basic"
  );
  const targetDir = path.join(process.cwd(), name);
  await fs.access(path.join(sourceDir, "package.json"));

  try {
    await fs.access(targetDir);
    throw new Error('Directory "' + name + '" already exists. Choose a new name.');
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const spinner = ora("Creating project...").start();
  try {
    await fs.cp(sourceDir, targetDir, {
      recursive: true,
      force: false,
      errorOnExist: true,
    });

    // Use the requested name rather than leaving the template's generic name.
    const packagePath = path.join(targetDir, "package.json");
    const pkg = JSON.parse(await fs.readFile(packagePath, "utf8"));
    pkg.name = name.toLowerCase();
    await fs.writeFile(packagePath, JSON.stringify(pkg, null, 2) + "\n");

    // The clean template is branded automatically with the supplied project name.
    if (argv.template === "basic") {
      const displayName = name
        .replace(/[-_.]+/g, " ")
        .replace(/\\b[a-z]/g, (letter) => letter.toUpperCase())
        .trim();
      for (const locale of ["en", "fa"]) {
        const messagePath = path.join(targetDir, "messages", locale + ".json");
        const messages = JSON.parse(await fs.readFile(messagePath, "utf8"));
        messages.Metadata.title = displayName;
        messages.Navigation.brand = displayName;
        await fs.writeFile(messagePath, JSON.stringify(messages, null, 2) + "\n");
      }
    }

    const lockPath = path.join(targetDir, "package-lock.json");
    if (pm === "npm") {
      // The basic starter intentionally has no lockfile. npm install creates one.
      try {
        const lock = JSON.parse(await fs.readFile(lockPath, "utf8"));
        lock.name = pkg.name;
        lock.packages[""].name = pkg.name;
        await fs.writeFile(lockPath, JSON.stringify(lock, null, 2) + "\n");
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    } else {
      // Do not impose npm's lockfile on yarn/pnpm consumers.
      await fs.rm(lockPath, { force: true });
    }

    // npm packaging tools may omit the template's .gitignore: enforce secret safety
    // in the generated project even when the packaged template lacks that file.
    const gitignorePath = path.join(targetDir, ".gitignore");
    let gitignore = "";
    try {
      gitignore = await fs.readFile(gitignorePath, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (!gitignore.includes(".env.*")) {
      await fs.appendFile(
        gitignorePath,
        "\nnode_modules/\n.next/\n.env\n.env.*\n!.env.example\n"
      );
    }

    if (argv.template === "appointment") {
      // Only the optional Auth.js example requires authentication credentials.
      const secret = randomBytes(32).toString("base64url");
      await fs.writeFile(
        path.join(targetDir, ".env.local"),
        "NEXTAUTH_SECRET=" + secret + "\nNEXTAUTH_URL=http://localhost:3000\n",
        { flag: "wx", mode: 0o600 }
      );
    }

    spinner.succeed('Project "' + name + '" created.');
  } catch (error) {
    spinner.fail("Could not scaffold the project.");
    throw error;
  }

  if (argv["skip-install"]) {
    console.log(chalk.yellow("Skipped dependency installation."));
  } else {
    console.log(chalk.cyan("Installing dependencies with " + pm + "..."));
    try {
      const [command, args] = packageManagers[pm];
      execFileSync(command, args, { stdio: "inherit", cwd: targetDir });
    } catch (error) {
      // Preserve project files to enable recovery without clobbering user content.
      throw new Error(
        "Dependency installation failed. Project files remain at " + targetDir +
        '. Run "' + pm + ' install" in that directory to retry. ' + error.message
      );
    }
  }

  if (argv.git) {
    try {
      execFileSync("git", ["init"], { stdio: "ignore", cwd: targetDir });
      console.log(chalk.green("Initialized Git repository."));
    } catch {
      console.warn(chalk.yellow("Git initialization skipped (git not available)."));
    }
  }

  console.log(chalk.green("\nYour starter is ready:"));
  console.log("  cd " + name);
  if (argv["skip-install"]) console.log("  " + pm + " install");
  console.log("  " + pm + " run dev");
}

run().catch((error) => {
  console.error(chalk.red(error.message));
  process.exitCode = 1;
});
