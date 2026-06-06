# Skill: sync-jira

Use this skill to synchronize Kvasar items into Jira.

## Workflow

1. Retrieve Kvasar entities
2. Retrieve Jira entities
3. Detect differences
4. Create/update Jira work items
5. Produce synchronization report

## Execution guidance

- Use `kvasar-cli feature list` or `kvasar-cli epic list`.
- Use `acli jira issue get` or `acli jira search`.
- Compare identifiers and names.
- Use `acli jira issue create` or `acli jira issue update` for changes.
- Summarize what was created, updated, or skipped.
