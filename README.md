# Relish Pilates

## Local Development

The natural local development step is a single command:

```bash
yarn dev
```

This starts both:

1. Next.js at `http://localhost:3000`
2. The local content contract API (json-server) at `http://localhost:3001`

The app defaults to local content mode in development.

If you want to run only the Next.js web server:

```bash
yarn dev:web
```

## Environment Setup

Copy the local environment template:

```bash
cp .env.local.example .env.local
```

Variables:

1. `CMS_PROVIDER` controls the content source (`local-api` by default for local dev).
2. `CMS_LOCAL_BASE_URL` points to the local content API (default: `http://localhost:3001`).
3. `CONTENTFUL_SPACE_ID` is required for Contentful providers.
4. `CONTENTFUL_ENVIRONMENT` defaults to `master`.
5. `CONTENTFUL_DELIVERY_ACCESS_TOKEN` is used for `contentful-delivery` mode.
6. `CONTENTFUL_PREVIEW_ACCESS_TOKEN` is used for `contentful-preview` mode.
7. `CMS_REVALIDATE_SECRET` secures the webhook revalidation endpoint.

Provider values:

1. `local-api` - read from local json-server contract.
2. `embedded` - read from repository fallback JSON contract.
3. `contentful-delivery` - read published content from Contentful CDA.
4. `contentful-preview` - read draft content from Contentful CPA.

## Useful Scripts

1. `yarn dev` - run web app + local content API
2. `yarn dev:web` - run web app only
3. `yarn mock-server:dev` - run local content API with watch mode
4. `yarn content:health` - verify local content API is responding
5. `yarn typecheck` - TypeScript validation
6. `yarn lint` - ESLint validation
7. `yarn test` - Jest tests

## Local API Health Check

After starting local development, run:

```bash
yarn content:health
```

Expected outcome: a small JSON response containing site config fields such as brand name and metadata.

## Revalidation Webhook

The app includes a webhook endpoint at `/api/revalidate`.

Request requirements:

1. Method: `POST`
2. Header: `x-cms-revalidate-secret: <CMS_REVALIDATE_SECRET>`
3. Body: optional `contentType` or `tags` array

Example:

```bash
curl -X POST http://localhost:3000/api/revalidate \
	-H "Content-Type: application/json" \
	-H "x-cms-revalidate-secret: $CMS_REVALIDATE_SECRET" \
	-d '{"contentType":"homePage"}'
```
