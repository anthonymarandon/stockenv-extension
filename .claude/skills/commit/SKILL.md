---
name: commit
description: Create a structured git commit with categorized changes per file
disable-model-invocation: true
argument-hint: optional message override
---

# Structured Commit

Create a well-organized git commit in English with changes categorized by file.

## Steps

### 1. Check git status
Run `git status` to see all modified, added, and deleted files. If there are no changes, stop and inform the user.

### 2. Review diffs
Run `git diff` and `git diff --cached` to understand every change (staged and unstaged).

### 3. Stage all relevant changes
Stage the changed files by name. Never use `git add -A` or `git add .`. Never stage `.env` files, credentials, or secrets.

### 4. Build the commit message

Format:
```
<type>: <concise main title summarizing all changes>

<file-or-scope>:
- <what changed and why>

<file-or-scope>:
- <what changed and why>
```

Rules:
- **Language**: English only
- **Type prefix**: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`
- **Main title**: one line, under 70 characters, summarizes the overall change
- **Body**: group changes by file or logical scope, one section per file/scope
- Each section lists concrete changes as bullet points
- Keep bullets short and focused on the "what" and "why"

### 5. Create the commit
Use a HEREDOC to pass the message:
```bash
git commit -m "$(cat <<'EOF'
<the commit message>
EOF
)"
```

### 6. Verify
Run `git status` to confirm the commit succeeded and the working tree is clean.
