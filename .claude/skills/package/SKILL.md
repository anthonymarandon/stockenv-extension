---
name: package
description: Build the VS Code extension into a .vsix package and output it to the builds/ folder for local distribution or installation. Use when the user wants to package, build, or export the extension, or runs /package.
---

# Package Extension

When packaging the extension:

1. Run `npm run package` — the script outputs directly into `builds/` via `--out builds/`
2. Confirm the generated `.vsix` file to the user

The `builds/` folder is gitignored — it stores all versioned `.vsix` artifacts locally.
