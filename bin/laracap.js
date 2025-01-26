#!/usr/bin/env node

import { program } from "commander";
import { login } from "../commands/auth.js";
import { createBundle } from "../commands/bundles.js";

program.version("1.0.0").description("LaraCap CLI tool for deployment");

program.command("login").description("Authenticate with LaraCap").action(login);

program
  .command("apps:bundles:create")
  .description("Create and upload a bundle")
  .option("-p, --path <path>", "Path to directory to bundle")
  .action(createBundle);

program.parse(process.argv);
