# StockEnv

VS Code extension that replaces the default text editor for `.env` files with an interactive table view. Keys and values are masked by default and can be revealed individually.

## Project Structure

- `src/extension.ts` — Single-file extension (custom editor provider, webview HTML/CSS/JS)
- `out/` — Compiled JavaScript (generated)
- `demo/.env` — Demo environment file
- `package.json` — Extension manifest, commands, custom editor registration
- `CHANGELOG.md` — Version history

## Build & Dev

- Compile: `npm run compile`
- Watch: `npm run watch`
- Package: `npm run package` (uses `vsce package`)
- Launch debug: F5 (see `.vscode/launch.json`)

## Architecture

- **Single-file TypeScript** — everything lives in `src/extension.ts`
- **Custom editor** — registered as `envshield.envTable` with `priority: "default"` for `.env` files
- **Webview** — self-contained HTML with embedded CSS and JS, no external resources
- **Message passing** — webview communicates with extension via `postMessage` (types: `edit`, `addRow`, `deleteRow`, `save`, `openAsText`)
- **Security** — CSP `default-src 'none'`, HTML escaping, input validation, zero dependencies

## Coding Standards

- TypeScript strict mode, ES2020 target
- 2-space indentation
- No runtime dependencies — only `@types/vscode` and `typescript` as dev deps
- All user content must be escaped with `escapeHtml()` before rendering
- Commit messages in English, using conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)

## Important Rules

- Always run `npm run compile` after modifying `src/extension.ts` to verify no TypeScript errors
- When adding/modifying features, update `README.md` and `CHANGELOG.md`
- Never add external dependencies — the extension must remain zero-dependency
- CSP must stay `default-src 'none'` — no external network requests allowed

## Available Skills

| Skill | Command | When to use |
|---|---|---|
| **update-docs** | `/update-docs` | After feature changes — updates README, CHANGELOG, bumps version, syncs lockfile, then commits |
| **commit** | `/commit` | Create a structured git commit with changes grouped by file/scope |
| **package** | `/package` | Build the `.vsix` package into `builds/` for local distribution |
| **skill-creator** | `/skill-creator` | Scaffold a new skill with correct folder structure and frontmatter |
