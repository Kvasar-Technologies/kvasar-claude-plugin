# Skill: plan-pi

Use this skill to plan a PI using backlog and capacity data.

## Workflow

1. Retrieve backlog
2. Analyze team capacity
3. Create PI plan
4. Assign work to ARTs

## Execution guidance

- Use `kvasar-cli backlog list`.
- Use `kvasar-cli capacity list --team <TEAM_ID>`.
- Use `kvasar-cli pi create`.
- Use `kvasar-cli art assign`.
