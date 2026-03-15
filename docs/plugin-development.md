# Plugin Development Guide

Plugins let you package and distribute custom skills, agents, and commands for superkit-agents.

## Plugin Structure

```
my-plugin/
├── superkit-plugin.json    # Required: plugin manifest
├── skills/
│   └── my-skill/
│       └── SKILL.md
├── agents/
│   └── my-agent.md
└── commands/
    └── my-command.md
```

## Manifest Format (`superkit-plugin.json`)

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Custom skills for my framework",
  "skills": {
    "my-skill": {
      "name": "my-skill",
      "description": "Does something useful",
      "category": "framework",
      "path": "skills/my-skill"
    }
  },
  "agents": {
    "my-agent": {
      "name": "my-agent",
      "description": "Specialized agent",
      "path": "agents/my-agent.md"
    }
  },
  "commands": {
    "my-cmd": {
      "name": "my-cmd",
      "skill": "my-skill",
      "description": "Trigger my skill",
      "path": "commands/my-cmd.md"
    }
  }
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Unique plugin identifier |
| `version` | string | Semver version |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | One-line description |
| `skills` | object | Map of skill definitions |
| `agents` | object | Map of agent definitions |
| `commands` | object | Map of command definitions |

## Installation Flow

When a user runs `superkit-agents plugin add my-plugin`:

1. The plugin is downloaded via `npm pack` (or resolved from a local path)
2. `superkit-plugin.json` is validated
3. Skills are copied to `<target>/skills/plugins/my-plugin/`
4. Agents are copied to `<target>/agents/my-plugin-<name>.md`
5. Commands are copied to `<target>/commands/my-plugin-<name>.md`
6. The plugin is registered in `~/.superkit-agents/plugins.json`

## Local Development

For iterating on a plugin during development:

```bash
superkit-agents plugin add ./my-plugin --local
```

This creates **symlinks** instead of copies, so changes to your plugin source are reflected immediately.

## Publishing to npm

1. Ensure `superkit-plugin.json` is in the package root
2. Include the manifest in your `package.json` files array:
   ```json
   {
     "name": "my-superkit-plugin",
     "files": ["superkit-plugin.json", "skills/", "agents/", "commands/"]
   }
   ```
3. Publish:
   ```bash
   npm publish
   ```

Users can then install with:
```bash
superkit-agents plugin add my-superkit-plugin
```

## Plugin Registry

Installed plugins are tracked in `~/.superkit-agents/plugins.json`:

```json
{
  "plugins": {
    "my-plugin": {
      "name": "my-plugin",
      "version": "1.0.0",
      "source": "npm",
      "path": "/path/to/plugin",
      "manifest": { ... }
    }
  }
}
```

## Testing Your Plugin

```bash
# Create a test project
mkdir /tmp/test-project && cd /tmp/test-project

# Install the plugin locally
superkit-agents plugin add /path/to/my-plugin --local

# Verify
superkit-agents plugin list

# Clean up
superkit-agents plugin remove my-plugin
```
