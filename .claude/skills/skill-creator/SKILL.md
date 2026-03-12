---
name: skill-creator
description: Scaffold a new Claude Code skill with the correct folder structure, frontmatter, and step-by-step instructions tailored to a specific use case. Use when the user wants to create, add, or set up a new skill, or runs /skill-creator.
---

# Create a New Skill

Generate a fully structured Claude Code skill adapted to the user's described use case.

## Steps

### 1. Understand the use case
Ask the user (if not already clear) what the skill should do, when it should trigger, and whether it should be invoked manually (`/skill-name`) or automatically by Claude.

### 2. Choose a name
Pick a short, kebab-case name that clearly reflects the skill's purpose (e.g., `run-tests`, `deploy-staging`).

### 3. Create the folder and file
Create `.claude/skills/<skill-name>/SKILL.md`.

### 4. Write the SKILL.md

Follow this template:

```markdown
---
name: <skill-name>
description: <1-2 sentences: what the skill does and its purpose. End with a trigger phrase: "Use when the user ... or runs /<skill-name>.">
---

# <Title>

<Brief explanation of the skill's purpose.>

## Steps

### 1. <First step>
<Details>

### 2. <Next step>
<Details>

...
```

Rules for the description field:
- **Minimum ~100 characters** — must be specific enough for Claude to match it to user intent
- **Start with the objective**: what the skill accomplishes
- **End with a trigger phrase**: "Use when the user ... or runs /<skill-name>."
- **Include keywords** the user would naturally say when needing this skill
- **Language**: always English

Rules for the body:
- Write clear, numbered steps that Claude can follow autonomously
- Include guardrails (what NOT to do) when relevant
- Keep instructions actionable — avoid vague guidance
- Follow the coding standards and conventions of the project (see CLAUDE.md)

### 5. Verify
Read back the generated file and confirm with the user that the skill matches their expectations.
