---
name: update-docs
description: Keep project documentation in sync by updating README.md and CHANGELOG.md whenever user-facing features are added, changed, or removed. Use when the user modifies extension behavior and needs docs refreshed, or runs /update-docs.
---

# Update Documentation After Feature Changes

When any feature of the extension is added, modified, or removed, you MUST update the documentation files before committing.

## README.md

1. Read the current `README.md`
2. Identify which sections are affected by the change
3. Update the relevant sections to reflect the new behavior
4. If a new feature was added, add a section for it in the appropriate place
5. If a feature was removed, remove its section
6. Keep the existing writing style and structure
7. Do not rewrite sections that are unaffected

## CHANGELOG.md

1. Read the current `CHANGELOG.md`
2. Add an entry under the `## [Unreleased]` section at the top
3. Categorize the change using these headers:
   - `### Added` — new features
   - `### Changed` — modifications to existing features
   - `### Fixed` — bug fixes
   - `### Removed` — removed features
4. Write a concise one-line description of the change
5. If there is no `## [Unreleased]` section, create one above the latest version

Format:
```markdown
## [Unreleased]

### Added
- Description of what was added
```

## When to trigger

This skill applies whenever `src/extension.ts` or `package.json` is modified in a way that changes user-facing behavior (new commands, UI changes, new features, removed features, changed defaults).

It does NOT apply for:
- Internal refactors with no user-visible change
- Build/tooling changes
- Test changes
