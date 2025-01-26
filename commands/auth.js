import axios from "axios";
import inquirer from "inquirer";
import { config } from "../config/config.js";

export async function login() {
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
    const response = await axios.post(`${config.get("apiUrl")}/login`, {
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
