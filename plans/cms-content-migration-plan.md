# CMS Content Migration Plan

## Summary

Migrate all hard-coded copy to a CMS-first architecture in two stages:

1. Stage A migrates existing pages and global shell content to structured models, with preview and webhook revalidation.
2. Stage B adds editor-managed simple page creation for brief, lightweight pages.

To reduce risk, first build a local contract harness using JSON-server on port 3001, then consume that from the app running on 3000. This verifies model mapping before Contentful integration.

## Decisions

1. New page model: simple brief template.
2. Rollout: existing pages first, new page creation second.
3. Include preview and webhook revalidation in phase 1.
4. Single locale now (`en-US`).
5. Deliver Postman v2.1 collection plus environment compatible with Insomnia import.

## Phases

### Phase 0

1. Build a field-by-field migration matrix from current hard-coded copy to target model fields.
2. Resolve copy inconsistencies before migration.
3. Separate shared content from page-specific content.

### Phase 1

1. Add local API tooling with JSON-server, nodemon, and a combined dev command.
2. Create a model-shaped `db.json` contract.
3. Add a typed fetch abstraction that can switch between embedded fallback content and the local API.
4. Refactor app routes and shared layout content to consume fetched content.
5. Add basic API tooling artifacts for later Postman and Insomnia validation.

### Phase 2

1. Define Contentful content models for site config, navigation, footer, home, pricing, FAQ, and simple pages.
2. Add validations, editorial descriptions, and ordering rules.
3. Add preview-mode and webhook-driven revalidation.

### Phase 3

1. Seed Contentful with the initial content set.
2. Switch from local API mode to CMS delivery mode outside local development.
3. Validate rendering, metadata, and cache invalidation end to end.

## Immediate Implementation Targets

1. [package.json](/Users/lenny/Projects/relishpilates/package.json)
2. [db.json](/Users/lenny/Projects/relishpilates/db.json)
3. [src/app/layout.tsx](/Users/lenny/Projects/relishpilates/src/app/layout.tsx)
4. [src/app/page.tsx](/Users/lenny/Projects/relishpilates/src/app/page.tsx)
5. [src/app/faq/page.tsx](/Users/lenny/Projects/relishpilates/src/app/faq/page.tsx)
6. [src/app/pricing/page.tsx](/Users/lenny/Projects/relishpilates/src/app/pricing/page.tsx)
7. [src/lib/cms/index.ts](/Users/lenny/Projects/relishpilates/src/lib/cms/index.ts)

## Verification

1. Start the mock server and confirm `http://localhost:3001` serves the expected resources.
2. Run the app in local API mode and confirm the existing UI renders from fetched content.
3. Run unit tests for the migrated pages.
4. Run lint and typecheck.
