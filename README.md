# LaraCap CLI

A command-line interface tool for deploying applications with LaraCap.

## Installation

```bash
npm install -g laracap-cli
```

## Usage

1. Set the server URL

```bash
npx laracap config:server-url
```

2. Login

```bash
npx laracap login
```

3. Create a bundle and upload it

```bash
npx laracap apps:bundles:create --path <directory-path>
```

4. Logout

```bash
npx laracap logout
```

## License

[MIT](LICENSE)
