import inquirer from "inquirer";
import { config } from "../config/config.js";

export async function setServerUrl() {
  const currentUrl = config.get("apiUrl");

  const questions = [
    {
      type: "input",
      name: "apiUrl",
      message: "Enter the LaraCap server URL:",
      default: currentUrl || "http://localhost",
      validate: (input) => {
        try {
          new URL(input);
          return true;
        } catch (error) {
          return "Please enter a valid URL";
        }
      },
    },
  ];

  const answers = await inquirer.prompt(questions);

  // Remove trailing slash if present
  const apiUrl = answers.apiUrl.replace(/\/$/, "");

  config.set("apiUrl", apiUrl);
  console.log(`Server URL has been set to: ${apiUrl}`);
}
