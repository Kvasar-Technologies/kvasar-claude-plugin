# Contributing to Kvasar Claude Plugin

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Code of Conduct

This project is governed by the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

- Check existing issues to avoid duplicates
- Include steps to reproduce, expected vs actual behavior
- Include relevant logs and environment details (Node version, OS)
- Include Claude Desktop or MCP client configuration if applicable

### Suggesting Features

- Open an issue to discuss proposed changes before implementing
- Explain the use case and why the feature benefits users
- Consider if the capability exists in the Kvasar CLI first - we wrap CLI commands 1:1

### Contributing Code

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/kvasar-claude-plugin.git`
3. Create a branch: `git checkout -b feature/my-feature`
4. Make changes and ensure tests pass
5. Run typecheck: `npm run typecheck`
6. Run tests: `npm test`
7. Commit with clear messages following Conventional Commits
8. Push to your fork: `git push origin feature/my-feature`
9. Open a Pull Request

## Development Setup

```bash
git clone https://github.com/kvasar/kvasar-claude-plugin.git
cd kvasar-claude-plugin
npm install
```

### Running in Development

```bash
# Start the MCP server directly
npm run dev
```

Ensure you have the following environment variables set:
- `KVASAR_EMAIL` - Your Kvasar login email
- `KVASAR_PASSWORD` - Your Kvasar password
- `AUTH0_DOMAIN` (optional) - defaults to `https://kvasar-pro.eu.auth0.com`
- `AUTH0_CLIENT_ID` (optional)
- `AUTH0_AUDIENCE` (optional) - defaults to `https://api.kvasar.tech/api/v1/`

The Kvasar CLI must be installed and available in `PATH`.

### Building

```bash
npm run build
```

Outputs to `dist/`.

### Testing

```bash
npm test
npm run test:watch
```

### Type Checking

```bash
npm run typecheck
```

## Pull Request Process

1. Ensure all tests and type checks pass
2. Update documentation if needed (README.md, CLI_INVENTORY.md)
3. Keep PRs focused on a single logical change
4. Write clear PR description explaining what and why
5. PRs require review from maintainers
6. Squash and merge on approval

## Style Guide

- Follow existing TypeScript patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions and tool definitions
- Keep tool schemas consistent with existing tools
- Use `const` and `let` appropriately; avoid `var`
- Use single quotes for strings
- Follow the existing indentation (2 spaces)

## Adding New Tools

Tools are registered in the `src/tools/` modules. Follow the pattern in `tool-factory.ts`:

1. Define tool schema using Zod or TypeBox
2. Create implementation function that calls the CLI via `client.ts`
3. Register with `api.registerTool(toolObject)`
4. Add to `CLI_INVENTORY.md` with CLI command mapping
5. Document the persona(s) that use the tool

## Adding New Skills

Create a `.skill.md` file in `src/skills/` following the format of existing skills. Skills describe a persona, responsibilities, behavior, and tone.

## Questions?

Open an issue or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License (see LICENSE file).
