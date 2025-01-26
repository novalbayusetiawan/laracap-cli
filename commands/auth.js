import axios from "axios";
import inquirer from "inquirer";
import { config } from "../config/config.js";

export async function login() {
  const apiUrl = config.get("apiUrl");
  if (!apiUrl) {
    console.error(
      "Please set the server URL first using: npx laracap config:server-url"
    );
    return;
  }

  const questions = [
    {
      type: "input",
      name: "email",
      message: "Enter your email:",
      validate: (input) => input.includes("@"),
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
    },
  ];

  const answers = await inquirer.prompt(questions);

  try {
    const response = await axios.post(`${apiUrl}/api/login`, {
      email: answers.email,
      password: answers.password,
    });

    config.set("token", response.data.token);
    console.log("Successfully logged in!");
  } catch (error) {
    console.error(
      "Login failed:",
      error.response?.data?.message || error.message
    );
  }
}

export async function logout() {
  const token = config.get("token");
  const apiUrl = config.get("apiUrl");
  if (!apiUrl) {
    console.error(
      "Please set the server URL first using: npx laracap config:server-url"
    );
    return;
  }

  try {
    await axios.delete(`${apiUrl}/api/logout`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    config.delete("token");
    console.log("Successfully logged out!");
  } catch (error) {
    console.error(
      "Logout failed:",
      error.response?.data?.message || error.message
    );
  }
}
