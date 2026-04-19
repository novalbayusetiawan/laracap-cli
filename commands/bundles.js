import axios from "axios";
import inquirer from "inquirer";
import archiver from "archiver";
import fs from "fs";
import path from "path";
import ora from "ora";
import { fileURLToPath } from "url";
import FormData from "form-data";
import { config } from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createBundle(options) {
  const token = options.token || config.get("token");
  const apiUrl = options.server || config.get("apiUrl");

  if (!apiUrl) {
    console.error(
      "Please set the server URL first using: npx laracap config:server-url"
    );
    return;
  }

  if (!token) {
    console.error("Please login first using: npx laracap login or provide a token using --token");
    return;
  }

  let appId = options.appId;

  if (!appId) {
    // 1. Get list of applications
    const spinner = ora("Fetching applications...").start();
    try {
      const response = await axios.get(`${apiUrl}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      spinner.succeed("Applications fetched successfully");

      // 2. Let user choose an application
      const appChoice = await inquirer.prompt([
        {
          type: "list",
          name: "appId",
          message: "Choose an application:",
          choices: response.data.map((app) => ({
            name: app.name,
            value: app.id,
          })),
        },
      ]);
      appId = appChoice.appId;
    } catch (error) {
      spinner.fail("Failed to fetch applications");
      console.error(error.response?.data || error.message);
      return;
    }
  }

  // 3. Create zip file
  try {
    const spinner = ora("Creating bundle...").start();
    const outputPath = path.join(process.cwd(), "bundle.zip");
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Create a promise to handle the archive completion
    const archivePromise = new Promise((resolve, reject) => {
      output.on("close", resolve);
      archive.on("error", reject);
    });

    archive.pipe(output);
    archive.directory(options.path || ".", false);
    await archive.finalize();

    // Wait for the archive to complete
    await archivePromise;
    spinner.succeed("Bundle created successfully");

    // 4. Upload the bundle
    const uploadSpinner = ora("Uploading bundle...").start();
    const formData = new FormData();
    formData.append("file", fs.createReadStream(outputPath));
    formData.append("application_id", appId);

    if (options.name) {
      formData.append("name", options.name);
    }
    if (options.channel) {
      formData.append("channel", options.channel);
    }

    try {
      const uploadResponse = await axios.post(
        `${apiUrl}/api/bundles`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...formData.getHeaders(), // Important: Use FormData headers
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      uploadSpinner.succeed("Bundle uploaded successfully");
      console.log("Upload response:", uploadResponse.data);

      // Clean up
      fs.unlinkSync(outputPath);
    } catch (error) {
      uploadSpinner.fail("Upload failed");
      console.error("Upload error:", error.response?.data || error.message);
      // Keep the zip file in case of error for debugging
      console.error("Zip file retained at:", outputPath);
    }
  } catch (error) {
    const errorMsg = error.response?.data || error.message;
    console.error("Operation error:", errorMsg);
  }
}
