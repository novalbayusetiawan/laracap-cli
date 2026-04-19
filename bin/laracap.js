#!/usr/bin/env node

import { program } from "commander";
import { login, logout } from "../commands/auth.js";
import { createBundle } from "../commands/bundles.js";
import { setServerUrl } from "../commands/config.js";

program.version("1.0.0").description("LaraCap CLI tool for deployment");

program.command("login").description("Authenticate with LaraCap").action(login);

program
  .command("config:server-url")
  .description("Set the LaraCap server URL")
  .action(setServerUrl);

program
  .command("apps:bundles:create")
  .description("Create and upload a bundle")
  .option("-p, --path <path>", "Path to directory to bundle")
  .option("-t, --token <token>", "API Token for authentication (bypass login)")
  .option("-a, --app-id <appId>", "Application ID (required for non-interactive use)")
  .action(createBundle);

program.command("logout").description("Logout from LaraCap").action(logout);

program.parse(process.argv);
