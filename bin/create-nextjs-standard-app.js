#!/usr/bin/env node
"use strict";

const chalk = require("chalk");
const ora = require("ora");
const yargs = require("yargs");

const {
  scaffoldProject,
  installDependencies,
  initializeRepository,
} = require("../lib/scaffold");

const argv = yargs
  .scriptName("create-nextjs-standard-app")
  .usage("$0 <project-name> [options]")
  .option("package-manager", {
    alias: "pm",
    describe: "Package manager (npm, yarn, pnpm)",
    type: "string",
    default: "npm",
  })
  .option("template", {
    describe: "Choose basic or the optional legacy appointment example",
    choices: ["basic", "appointment"],
    type: "string",
    default: "basic",
  })
  .option("git", {
    describe: "Initialize Git",
    type: "boolean",
    default: true,
  })
  .option("skip-install", {
    describe: "Create project files without installing dependencies",
    type: "boolean",
    default: false,
  })
  .strictOptions()
  .help()
  .parse();

async function main() {
  if (argv._.length !== 1) {
    throw new Error("Usage: create-nextjs-standard-app <project-name> [options]");
  }

  const spinner = ora("Creating project...").start();
  let project;
  try {
    project = await scaffoldProject({
      name: argv._[0],
      template: argv.template,
      packageManager: argv["package-manager"],
      skipInstall: argv["skip-install"],
      initializeGit: argv.git,
    });
    spinner.succeed('Created "' + project.options.name + '" (' + project.options.template + ").");
  } catch (error) {
    spinner.fail("Could not create project.");
    throw error;
  }

  // The project has been scaffolded successfully; preserve it if install fails.
  try {
    if (installDependencies(project)) {
      console.log(chalk.green("Dependencies installed."));
    } else {
      console.log(chalk.yellow("Skipped dependency installation."));
    }
  } catch (error) {
    console.error(chalk.red(error.message));
    process.exitCode = 1;
    return;
  }

  if (project.options.initializeGit) {
    try {
      initializeRepository(project);
      console.log(chalk.green("Git repository initialized."));
    } catch {
      console.warn(chalk.yellow("Git was not initialized (not installed or unavailable)."));
    }
  }

  console.log(chalk.green("\nYour starter is ready:"));
  console.log("  cd " + project.options.name);
  if (project.options.skipInstall) {
    console.log("  " + project.options.packageManager + " install");
  }
  console.log("  " + project.options.packageManager + " run dev");
}

main().catch((error) => {
  console.error(chalk.red(error.message));
  process.exitCode = 1;
});
