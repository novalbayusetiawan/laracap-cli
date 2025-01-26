const axios = require("axios");
const inquirer = require("inquirer");
const Conf = require("conf");
const config = new Conf();

async function login() {
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
    const response = await axios.post("http://laracap-live-update.test/api/login", {
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

module.exports = { login };
