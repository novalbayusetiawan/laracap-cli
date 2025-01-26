#!/usr/bin/env node

const { program } = require("commander");
const { login } = require("../commands/auth");
const { createBundle } = require("../commands/bundles");

program.version("1.0.0").description("LaraCap CLI tool for deployment");

program.command("login").description("Authenticate with LaraCap").action(login);

program
  .command("apps:bundles:create")
  .description("Create and upload a bundle")
  .option("-p, --path <path>", "Path to directory to bundle")
  .action(createBundle);

program.parse(process.argv);
