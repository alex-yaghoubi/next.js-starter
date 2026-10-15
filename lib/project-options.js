"use strict";

const path = require("node:path");

const TEMPLATES = Object.freeze({
  basic: "starter-basic",
  appointment: "starter-template",
});

const PACKAGE_MANAGERS = Object.freeze({
  npm: Object.freeze({command: "npm", args: ["install"]}),
  yarn: Object.freeze({command: "yarn", args: ["install"]}),
  pnpm: Object.freeze({command: "pnpm", args: ["install"]}),
});

function validateProjectName(name) {
  if (typeof name !== "string" ||
      !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name) ||
      name.endsWith(".") ||
      /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:[.]|$)/i.test(name)) {
    throw new Error(
      "Provide one safe project name containing letters, numbers, dots, dashes or underscores."
    );
  }
  if (name.length > 214) {
    throw new Error("Project name must not exceed 214 characters.");
  }
  return name;
}

function validateOptions(input) {
  const name = validateProjectName(input.name);
  const template = input.template ?? "basic";
  const packageManager = input.packageManager ?? "npm";

  if (!Object.hasOwn(TEMPLATES, template)) {
    throw new Error('Unsupported template "' + template + '". Choose basic or appointment.');
  }
  if (!Object.hasOwn(PACKAGE_MANAGERS, packageManager)) {
    throw new Error(
      'Unsupported package manager "' + packageManager + '". Choose npm, yarn or pnpm.'
    );
  }

  return {
    name,
    template,
    packageManager,
    skipInstall: Boolean(input.skipInstall),
    initializeGit: input.initializeGit !== false,
  };
}

function assertSupportedNodeVersion(version = process.versions.node) {
  const parts = String(version).split(".").map(Number);
  const major = parts[0];
  const minor = parts[1];
  if (!Number.isInteger(major) || !Number.isInteger(minor) ||
      major < 20 || (major === 20 && minor < 9)) {
    throw new Error(
      "Node.js 20.9 or newer is required (current: " + version + "). " +
      "Update Node.js and run this command again."
    );
  }
  return version;
}

function getTemplateDirectory(template) {
  if (!Object.hasOwn(TEMPLATES, template)) {
    throw new Error('Unsupported template "' + template + '".');
  }
  return path.resolve(__dirname, "..", TEMPLATES[template]);
}

function getInstallCommand(manager) {
  if (!Object.hasOwn(PACKAGE_MANAGERS, manager)) {
    throw new Error('Unsupported package manager "' + manager + '".');
  }
  return PACKAGE_MANAGERS[manager];
}

module.exports = {
  TEMPLATES,
  PACKAGE_MANAGERS,
  validateProjectName,
  validateOptions,
  assertSupportedNodeVersion,
  getTemplateDirectory,
  getInstallCommand,
};
