# kvasar-cli Plugin

This Claude Code plugin manages Kvasar and Atlassian Jira through CLI tools only: `kvasar-cli` and `acli`.

## Installation

1. Clone the repository.
2. Ensure `kvasar-cli` and `acli` are installed.
3. Make `bin/*` executable.
4. Load the plugin in Claude Code.

## Plugin structure

- `.claude-plugin/plugin.json`
- `bin/kvasar-cli`
- `bin/acli`
- `skills/create-feature/SKILL.md`
- `skills/plan-pi/SKILL.md`
- `skills/sync-jira/SKILL.md`
- `agents/kvasar-product-manager.md`
- `agents/jira-manager.md`
- `agents/release-manager.md`

## Agents

- Kvasar Product Manager
- Jira Manager
- Release Manager

## Skills

- create-feature
- plan-pi
- sync-jira

## Dependencies

- Bash
- kvasar-cli
- acli

## Model compatibility
When this plugin is used in a skill, known model behavior is summarized below.

| Model | Reported performance |
| --- | --- |
| `Mistralai/mistral-nemotron` | Low |

## Example workflows

# Create features from epic KV-100
kvasar-cli epic get KV-100
kvasar-cli feature create --epic KV-100 --title "Feature 1"
kvasar-cli feature create --epic KV-100 --title "Feature 2"

# Plan next PI
kvasar-cli backlog list
kvasar-cli pi create --name "PI-2026-03" --start 2026-04-01 --end 2026-05-31

# Sync Kvasar backlog with Jira
acli jira issue get PROJ-1
kvasar-cli feature list
acli jira issue create --project PROJ --summary "..."

# Assign features to ART Alpha
kvasar-cli art list
kvasar-cli art assign --feature KV-101 --art ART-ALPHA