---
name: package
description: Build the .vsix extension package and place it in the builds/ folder
---

# Package Extension

When packaging the extension:

1. Run `npm run package` — the script outputs directly into `builds/` via `--out builds/`
2. Confirm the generated `.vsix` file to the user

The `builds/` folder is gitignored — it stores all versioned `.vsix` artifacts locally.
