# LaraCap CLI

A powerful command-line interface tool for deploying applications and managing Capacitor live updates with the LaraCap server.

## Installation

You can install the CLI globally via npm to use the `laracap` command directly, or run it via `npx` without installing.

```bash
npm install -g laracap-cli
```

## Usage

### Interactive Workflow

1. **Set the server URL:**
   Configure the CLI to point to your self-hosted LaraCap instance.
   ```bash
   npx laracap config:server-url
   ```

2. **Login:**
   Authenticate with your LaraCap account.
   ```bash
   npx laracap login
   ```

3. **Deploy a bundle:**
   Create and upload a new live update bundle. You will be prompted to select the target application.
   ```bash
   npx laracap apps:bundles:create -p <directory-path>
   ```

4. **Logout:**
   Clear your local session.
   ```bash
   npx laracap logout
   ```

---

### CI/CD Workflow (Non-Interactive)

To automate deployments in CI/CD pipelines (like GitHub Actions, GitLab CI, etc.), you can bypass the interactive prompts by passing your API token and configuration directly into the command:

```bash
npx laracap apps:bundles:create \
  --path ./dist \
  --server https://laracap.dev \
  --token <your_api_token> \
  --app-id <application_id>
```

#### Available Options (`apps:bundles:create`):
* `-p, --path <path>`: Path to the directory you want to bundle (e.g., `./dist`).
* `-s, --server <url>`: Override the default LaraCap Server URL.
* `-t, --token <token>`: Private API Token for authentication.
* `-a, --app-id <appId>`: The Database ID of the Target Application.

## License

[MIT](LICENSE)
