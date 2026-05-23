# Agentic Workflow — Relish Pilates

This document describes the agentic pipeline for building new features and pages in this repository. All agents live in `.github/agents/`. The shared learning file is `.github/AGENT_LEARNINGS.md`.

---

## Pipeline Sequence

```mermaid
graph TD
    A[Task Request] --> B{Touches external library?}
    B -- Yes --> C[/agent research]
    B -- No --> D[/agent code]
    C --> D
    D --> E[/agent lint]
    E --> F[/agent accessibility]
    F --> G[/agent testing]
    G --> H[/agent e2e-testing]
    H --> I[/agent docs]
    H --> J[/agent reflective]
    I --> K[Done]
    J --> K
```

> `docs` and `reflective` are independent of each other once e2e completes — they run in parallel.

---

## Agent Reference

| Agent | Invocation | Role | Loads Skills | Handoff To |
|-------|-----------|------|-------------|-----------|
| `research` | `/agent research` | Fetches current library/API docs via Context7 MCP (falls back to web fetch) before implementation | — | `code` |
| `code` | `/agent code` | Implements features/pages/components following project conventions | `next-best-practices`, `building-components`, `vercel-react-best-practices` | `lint` |
| `lint` | `/agent lint` | Runs `npx tsc --noEmit && yarn lint`, fixes all errors | — | `accessibility` |
| `debug` | `/agent debug` | Diagnoses runtime errors, hydration, image/font issues | — | — (standalone) |
| `accessibility` | `/agent accessibility` | Audits ARIA, focus, motion, image sizes, form semantics | `web-design-guidelines` | `testing` |
| `testing` | `/agent testing` | Writes and fixes Jest + RTL unit/component tests | — | `e2e-testing` |
| `e2e-testing` | `/agent e2e-testing` | Runs Playwright E2E suite, fixes failing specs | — | `docs` + `reflective` |
| `design` | `/agent design` | Translates visual references into brand-token-accurate components | `building-components`, `web-design-guidelines`, `vercel-composition-patterns` | `code` |
| `docs` | `/agent docs` | Syncs `README.md` and `FLOW.md` when structure changes | — | — |
| `reflective` | `/agent reflective` | Logs failures, extracts rules after 3 strikes, purges stale rules | — | — |
| `pipeline` | `/agent pipeline` | Orchestrates all phases end-to-end for a full delivery | All of the above | — |

---

## When to Skip Phases

| Phase | Skip when... |
|-------|-------------|
| `research` | Change is purely structural (moving files, renaming, styling tweaks) or involves only the baseline stack with no new external dependencies |
| `testing` | No Jest infrastructure installed (`jest.config.ts` missing) |
| `e2e-testing` | No Playwright infrastructure installed (`playwright.config.ts` missing) |
| `docs` | Routine component edits that don't change folder structure, routes, or pipeline |

---

## Skills Reference

Skills live in `.agents/skills/`. Agents load them via `read_file` at the paths below.

| Skill | Path | Used By |
|-------|------|---------|
| `next-best-practices` | `.agents/skills/next-best-practices/SKILL.md` | `code`, `pipeline` |
| `building-components` | `.agents/skills/building-components/SKILL.md` | `code`, `design` |
| `vercel-react-best-practices` | `.agents/skills/vercel-react-best-practices/SKILL.md` | `code` |
| `vercel-composition-patterns` | `.agents/skills/vercel-composition-patterns/SKILL.md` | `design` |
| `web-design-guidelines` | `.agents/skills/web-design-guidelines/SKILL.md` | `accessibility`, `design` |
| `next-cache-components` | `.agents/skills/next-cache-components/SKILL.md` | `code` (when adding caching) |

---

## Learning System

All agents read `.github/AGENT_LEARNINGS.md` before starting work. The `reflective` agent is the only writer.

- **Failure Log** — every observed failure is recorded with a category (e.g. `lint:no-explicit-any`, `a11y:missing-sizes`, `e2e:selector-stale`)
- **Active Rules** — when a failure reaches 3 occurrences, a rule is extracted automatically
- **Resolved Rules** — rules older than 30 days are purged

Filter the Active Rules table by your agent's category prefix before starting:
- `code` agent → `lint:*`, `test:*`, `a11y:*`
- `lint` agent → `lint:*`
- `accessibility` agent → `a11y:*`
- `testing` agent → `test:*`, `lint:*`
- `e2e-testing` agent → `e2e:*`
- `debug` agent → `debug:*`, `build:*`
- `design` agent → `design:*`, `a11y:*`

---

## Adding New Agents

1. Create `.github/agents/<name>.agent.md` with the standard frontmatter (`name`, `description`, `argument-hint`, `tools`)
2. Add `read .github/AGENT_LEARNINGS.md` as the first step in the agent's workflow
3. Add a row to the Agent Reference table above
4. Update the pipeline sequence diagram if the agent slots into the delivery flow
