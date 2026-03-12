---
name: update-docs
description: Full release preparation — update README.md, CHANGELOG.md, bump version in package.json, sync package-lock.json, then commit. Use when the user wants to release a new version, update documentation after changes, or runs /update-docs.
---

# Update Documentation & Prepare Release

When features are added, modified, or removed, run this full pipeline to keep all project files in sync and produce a clean release commit.

## Steps

### 1. Analyze changes

Run `git diff HEAD` and `git diff --cached` to understand every change since the last commit. Identify:
- New features, UI changes, bug fixes, removals
- Which files were modified and why

### 2. Update README.md

1. Read the current `README.md`
2. Identify which sections are affected by the changes
3. Update the relevant sections to reflect the new behavior
4. If a new feature was added, add a section for it in the appropriate place
5. If a feature was removed, remove its section
6. Keep the existing writing style and structure
7. Do not rewrite sections that are unaffected

### 3. Update CHANGELOG.md

1. Read the current `CHANGELOG.md`
2. Determine the new version number by incrementing the patch version from the latest entry (e.g. `0.0.7` → `0.0.8`)
3. Add a new `## [X.Y.Z] - YYYY` entry at the top (below the file header), using the current year
4. Categorize changes using these headers:
   - `### Added` — new features
   - `### Changed` — modifications to existing features
   - `### Fixed` — bug fixes
   - `### Removed` — removed features
5. Write concise one-line descriptions for each change
6. Never use `## [Unreleased]` — always assign a version number

### 4. Bump version in package.json

1. Read `package.json`
2. Update the `"version"` field to match the version used in CHANGELOG.md
3. Do NOT modify any other field

### 5. Sync package-lock.json

Run `npm install` to update `package-lock.json` with the new version number.

### 6. Compile

Run `npm run compile` to verify there are no TypeScript errors.

### 7. Commit

Invoke the `/commit` skill to stage all modified files and create a structured commit.

## When to trigger

- User asks to update documentation after making changes
- User asks to prepare a release or bump the version
- User runs `/update-docs`

## When NOT to trigger

- Internal refactors with no user-visible change (use `/commit` directly)
- Build/tooling-only changes (use `/commit` directly)
