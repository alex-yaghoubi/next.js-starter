#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");
const { randomBytes } = require("crypto");
const { execSync } = require("child_process");
const ora = require("ora");
const chalk = require("chalk");
const yargs = require("yargs");

const argv = yargs
  .option("package-manager", {
    alias: "pm",
    describe: "Choose package manager (npm, yarn, pnpm)",
    type: "string",
    default: "npm",
  })
  .option("git", {
    describe: "Initialize a git repository",
    type: "boolean",
    default: true,
  })
  .option("skip-install", {
    describe: "Create project files without installing dependencies",
    type: "boolean",
    default: false,
  })
  .help().argv;

const projectName = argv._[0];

(async () => {
  const spinner = ora();

  // Validate project name
  if (!projectName) {
    console.error(chalk.red("❌ Please provide a project name:"));
    console.error(chalk.cyan("    npx create-nextjs-standard-app my-project"));
    process.exit(1);
  }

  if (typeof projectName !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(projectName) || projectName === "." || projectName === "..") {
    console.error(chalk.red("❌ Use a simple directory name with letters, numbers, dots, dashes, or underscores."));
    process.exit(1);
  }

  const sourceDir = path.join(__dirname, "..", "starter-template");
  const targetDir = path.join(process.cwd(), projectName);

  try {
    // Check if template exists
    spinner.start("Checking project template...");
    const sourceExists = await fs
      .access(sourceDir)
      .then(() => true)
      .catch(() => false);
    if (!sourceExists) {
      spinner.fail();
      console.error(
        chalk.red("❌ Starter template not found. Check the package structure.")
      );
      process.exit(1);
    }
    spinner.succeed();

    // Check if target directory exists
    spinner.start("Checking destination...");
    const targetExists = await fs
      .access(targetDir)
      .then(() => true)
      .catch(() => false);
    if (targetExists) {
      spinner.fail();
      console.error(
        chalk.red(
          `❌ Directory "${projectName}" already exists. Choose a different name.`
        )
      );
      process.exit(1);
    }
    spinner.succeed();

    // Copy project files
    spinner.start("Copying project files...");
    await fs.cp(sourceDir, targetDir, { recursive: true });

    // Every generated app receives its own strong authentication secret.
    // .env.local is ignored by the starter's .gitignore.
    const envFile = path.join(targetDir, ".env.local");
    const authSecret = randomBytes(32).toString("base64url");
    await fs.writeFile(
      envFile,
      `NEXTAUTH_SECRET=${authSecret}\nNEXTAUTH_URL=http://localhost:3000\n`,
      { flag: "wx", mode: 0o600 }
    );

    spinner.succeed(chalk.green(`✅ Project "${projectName}" created.`));
    console.log(chalk.cyan(`📁 Path: ${targetDir}`));

    // Install dependencies
    spinner.start("Installing dependencies...");
    const pm = argv["package-manager"];
    const installCmd = {
      npm: "npm install",
      yarn: "yarn",
      pnpm: "pnpm install",
    }[pm];

    if (!installCmd) {
      spinner.fail();
      console.error(chalk.red(`❌ Package manager "${pm}" is not supported.`));
      process.exit(1);
    }

    if (argv["skip-install"]) {
      spinner.info("Dependency installation skipped. Run your package manager in the new project.");
    } else {
      execSync(installCmd, { stdio: "inherit", cwd: targetDir });
      spinner.succeed(chalk.green("📦 Dependencies installed."));
    }

    // Initialize git (optional)
    if (argv.git) {
      spinner.start("Initializing git repository...");
      try {
        execSync("git init", { stdio: "ignore", cwd: targetDir });
        spinner.succeed(chalk.green("🌿 Git repository initialized."));
      } catch (error) {
        spinner.warn(chalk.yellow("⚠️ Failed to initialize git. Skipping..."));
      }
    }

    // Final instructions
    console.log(chalk.bold.green("\n🚀 Project is ready! Get started with:"));
    console.log(chalk.cyan(`    cd ${projectName}`));
    console.log(chalk.cyan(`    ${pm} run dev`));
  } catch (error) {
    spinner.fail();
    console.error(chalk.red("❌ An error occurred:"));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
})();
