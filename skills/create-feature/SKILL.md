# Skill: create-feature

Use this skill to create SAFe-compliant Kvasar features from an epic.

## Workflow

1. Retrieve epic information
2. Analyze scope
3. Generate SAFe-compliant features
4. Create features using kvasar

## Execution guidance

- First run `kvasar epic list` or `kvasar epic get <EPIC_ID>`.
- Analyze the epic context.
- Define feature scopes that are small enough to deliver in one PI.
- Create features with `kvasar feature create`.
