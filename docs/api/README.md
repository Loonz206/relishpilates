# Local Content API

This project includes a Phase 1 content contract backed by `json-server`.

## Start the local API

```bash
yarn mock-server:dev
```

The API runs on `http://localhost:3001`.

## Quick Health Check

From the project root:

```bash
yarn content:health
```

Direct curl alternative:

```bash
curl -sf http://localhost:3001/siteConfig
```

To run the Next.js app and the local API together:

```bash
yarn dev:content
```

## Environment variables

Set these when you want the app to fetch from the local API instead of the embedded fallback contract:

```bash
CMS_PROVIDER=local-api
CMS_LOCAL_BASE_URL=http://localhost:3001
```

Other provider options:

1. `CMS_PROVIDER=embedded`
2. `CMS_PROVIDER=contentful-delivery`
3. `CMS_PROVIDER=contentful-preview`

Contentful variables:

1. `CONTENTFUL_SPACE_ID`
2. `CONTENTFUL_ENVIRONMENT` (default: `master`)
3. `CONTENTFUL_DELIVERY_ACCESS_TOKEN`
4. `CONTENTFUL_PREVIEW_ACCESS_TOKEN`

## Revalidation Endpoint

`POST /api/revalidate` supports cache invalidation for CMS updates.

Auth:

1. Header `x-cms-revalidate-secret` must match `CMS_REVALIDATE_SECRET`

Payload options:

1. `contentType` (for mapped CMS resource tags)
2. `tags` array (explicit tag invalidation)

## Available resources

1. `GET /siteConfig`
2. `GET /navigationMenu`
3. `GET /footerContactBlock`
4. `GET /homePage`
5. `GET /faqPage`
6. `GET /pricingPage`

## Postman and Insomnia

Import these files into Postman or Insomnia:

1. `docs/api/relish-cms-local.postman_collection.json`
2. `docs/api/relish-cms-local.postman_environment.json`

The collection is exported in Postman Collection v2.1 format, which Insomnia can import.
