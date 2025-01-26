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
  const token = config.get("token");
  if (!token) {
    console.error("Please login first using: npx laracap login");
    return;
  }

  // 1. Get list of applications
  const spinner = ora("Fetching applications...").start();
  try {
    const response = await axios.get(`${config.get("apiUrl")}/apps`, {
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

    // 3. Create zip file
    spinner.start("Creating bundle...");
    const outputPath = path.join(process.cwd(), "bundle.zip");
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", async () => {
      spinner.succeed("Bundle created successfully");

      // 4. Upload the bundle
      spinner.start("Uploading bundle...");
      const formData = new FormData();
      formData.append("bundle", fs.createReadStream(outputPath));
      formData.append("app_id", appChoice.appId);

      try {
        await axios.post(`${config.get("apiUrl")}/bundles`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        spinner.succeed("Bundle uploaded successfully");

        // Clean up
        fs.unlinkSync(outputPath);
      } catch (error) {
        spinner.fail("Upload failed");
        console.error(error.response?.data?.message || error.message);
      }
    });

    archive.pipe(output);
    archive.directory(options.path || ".", false);
    await archive.finalize();
  } catch (error) {
    spinner.fail("Operation failed");
    console.error(error.response?.data?.message || error.message);
  }
}
