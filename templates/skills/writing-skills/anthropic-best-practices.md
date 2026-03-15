# Anthropic Best Practices for Skill Authoring

Reference document for writing Claude Code skills that follow Anthropic's official guidance.

## Progressive Disclosure (3-Tier Context Loading)

Load context incrementally to minimize token usage:

### Tier 1: Always Loaded
- The `description` field in frontmatter
- Used for skill selection/matching
- Must be under 1024 characters
- Contains trigger conditions only

### Tier 2: Loaded When Skill is Selected
- The SKILL.md body content
- Contains instructions, steps, patterns
- Must be under 500 lines
- Should be self-contained

### Tier 3: Loaded On Demand
- Referenced files (checklists, templates, examples)
- Loaded only when explicitly needed during execution
- One level deep -- referenced files should not reference other files

## Description as Trigger Condition

The `description` field is a search index, not documentation.

**Do:**
```yaml
description: "Use when reviewing pull requests, checking code quality, or performing pre-merge validation"
```

**Do not:**
```yaml
description: "This skill helps developers perform thorough code reviews using best practices from Google's engineering guidelines"
```

Rules:
- Start with "Use when..."
- List 2-5 specific trigger scenarios
- Use verbs that match user intent (creating, debugging, deploying, reviewing)
- Maximum 1024 characters
- No marketing language or superlatives

## Body Under 500 Lines

The SKILL.md body is loaded into context whenever the skill is invoked. Every line costs tokens.

Strategies to stay under 500 lines:
- Use tables instead of verbose lists
- Move reference material to separate files
- Use terse imperative sentences
- Include code examples only when the pattern is non-obvious
- Eliminate repeated information

## File References One Level Deep

Skills can reference other files for detailed content:

```markdown
See [OWASP Checklist](./owasp-checklist.md) for detailed vulnerability patterns.
```

Rules:
- Referenced files are loaded only when needed
- References must be one level deep (a referenced file must not reference another file)
- Use relative paths from the skill directory
- Referenced files should be self-contained

## Forward Slashes Only

All file paths in skills must use forward slashes, regardless of platform:

```yaml
# Correct
templates/skills/my-skill/SKILL.md

# Incorrect
templates\skills\my-skill\SKILL.md
```

## Self-Contained Skills

Skills should minimize external dependencies:

- Do not assume specific tools are installed unless checking first
- Do not reference URLs that may change or become unavailable
- Include essential information directly in the skill body
- Use referenced files (in the same directory) for supplementary content
- Do not depend on other skills being present -- reference them as optional enhancements

## Allowed-Tools Field for Security

When a skill should only use specific tools, restrict access:

```yaml
---
name: read-only-review
description: "Use when performing read-only code analysis"
allowed-tools:
  - Read
  - Grep
  - Glob
---
```

This prevents the skill from accidentally modifying files, running commands, or accessing resources it should not touch.

Use cases:
- Read-only analysis skills (no Bash, no Edit, no Write)
- Skills that should not access the network (no WebFetch)
- Skills restricted to specific MCP tools

## Testing Skills Before Deployment

### Manual Testing

1. Write 3-5 test prompts that should trigger the skill
2. Write 2-3 prompts that should NOT trigger it
3. Invoke each prompt and verify correct skill selection
4. Check that the skill produces expected output for each test prompt
5. Verify token usage is within budget

### Checklist

- [ ] Description starts with "Use when..."
- [ ] Description is under 1024 characters
- [ ] Body is under 500 lines
- [ ] All file paths use forward slashes
- [ ] Referenced files exist and are one level deep
- [ ] No external URL dependencies that could break
- [ ] Frontmatter has `name` and `description`
- [ ] Skill is self-contained (works without other skills installed)
- [ ] Test prompts trigger correctly
- [ ] Near-miss prompts do not trigger incorrectly
- [ ] Token usage is within target for skill type
