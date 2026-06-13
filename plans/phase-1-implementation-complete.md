# Phase 1: Contentful SDK Integration — Implementation Guide

**Status:** ✅ Complete (Infrastructure Ready)
**Contentful SDK Version:** Latest (`contentful` package)
**Target:** Production-ready integration with local testing support

---

## What Was Implemented

### 1. **Contentful SDK Installation**

- ✅ Added `contentful` package via yarn
- ✅ No additional dependencies required (uses REST API)
- ✅ Compatible with Next.js 16 and Node.js runtime

### 2. **Enhanced CMS Client**

#### New: Image URL Helper

```typescript
// src/lib/cms/client.ts
export function getContentfulImageUrl(
  url: string,
  options?: { width?: number; height?: number; quality?: number }
): string;
```

**Usage:**

```typescript
import { getContentfulImageUrl } from "@/lib/cms";

const imageUrl = getContentfulImageUrl("https://images.ctfassets.net/...", {
  width: 1200,
  height: 630,
  quality: 80,
});
// Output: https://images.ctfassets.net/...?w=1200&h=630&q=80
```

**Benefits:**

- Responsive image optimization (lazy-load at different sizes)
- Quality compression for faster delivery
- SEO-friendly image sourcing
- Integrates with Next.js `<Image>` component

#### Enhanced: Contentful Webhook Support

```typescript
// src/app/api/revalidate/route.ts
function getContentfulWebhookData(body): { id; contentType; updatedAt };
```

**Features:**

- Parses Contentful webhook payload structure
- Extracts content type and entry metadata
- Maps to internal resource tags for ISR
- Includes detailed console logging for debugging

**Example Webhook Payload:**

```json
{
  "sys": { "id": "entry-123", "contentType": { "sys": { "id": "homePage" } } },
  "fields": { ... }
}
```

### 3. **Preview Mode API**

**New Endpoint:** `/api/preview`

```bash
# Enable draft mode
curl "http://localhost:3000/api/preview?secret=YOUR_SECRET&redirect=/pricing"

# Disable draft mode
curl -X POST "http://localhost:3000/api/preview/exit"
```

**How It Works:**

1. Validates webhook secret via `CMS_REVALIDATE_SECRET` env var
2. Enables Next.js draft mode via `draftMode()`
3. Redirects to specified path with draft cookies
4. All subsequent requests use `contentful-preview` provider (if configured)

**Integration with Layout:**

```typescript
// src/app/layout.tsx (ready for enhancement)
export default async function RootLayout({ children }) {
  // Draft mode automatically uses contentful-preview provider
  // when CMS_PROVIDER env var is set appropriately
  const [siteConfig, navigationMenu] = await Promise.all([getSiteConfig(), getNavigationMenu()]);
  // Draft cookies enable preview content automatically
}
```

### 4. **Webhook Revalidation Enhanced**

**Enhanced Endpoint:** `/api/revalidate` (POST)

**Features:**

- ✅ Contentful webhook signature extraction
- ✅ Legacy format support (direct `contentType` field)
- ✅ Explicit tag-based revalidation
- ✅ Detailed console logging for monitoring
- ✅ Fallback to full site revalidation on unknown payloads

**Example: Contentful Webhook Configuration**

```
URL: https://yoursite.com/api/revalidate
Headers: x-cms-revalidate-secret: YOUR_SECRET
Trigger: When any content is published
```

**Response:**

```json
{
  "revalidated": true,
  "tags": ["cms:home", "cms:site-config"],
  "timestamp": "2025-01-20T14:35:00.000Z"
}
```

### 5. **Environment Configuration**

**Updated:** `.env.local.example` with comprehensive documentation

```bash
# Phase 0/1: Local testing
CMS_PROVIDER=local-api
CMS_LOCAL_BASE_URL=http://localhost:3001

# Phase 2: Switch to Contentful
CMS_PROVIDER=contentful-delivery
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_DELIVERY_ACCESS_TOKEN=your-token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your-preview-token

# Webhook & Preview
CMS_REVALIDATE_SECRET=dev-secret-change-in-production
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  Next.js App (Your Site)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  src/app/layout.tsx (Root Layout)                  │   │
│  │  • Calls getSiteConfig(), getNavigationMenu()      │   │
│  │  • Draft mode enabled via /api/preview             │   │
│  └─────────────────────────────────────────────────────┘   │
│                         ↓                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  src/lib/cms/client.ts (Provider Layer)            │   │
│  │  • Detects CMS_PROVIDER env var                    │   │
│  │  • Routes to: local-api | embedded | contentful-*  │   │
│  │  • Image optimization helper                       │   │
│  └─────────────────────────────────────────────────────┘   │
│           ↓                ↓                  ↓             │
│      ┌────────┐       ┌────────┐       ┌─────────────┐    │
│      │ Local  │       │Embedded│       │ Contentful  │    │
│      │ API    │       │db.json │       │API (REST)   │    │
│      │:3001   │       │        │       │             │    │
│      └────────┘       └────────┘       └─────────────┘    │
│           ↓                ↓                  ↓             │
│      json-server        Fallback         cdn.contentful.com│
│                                         preview.contentful │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Routes                                         │   │
│  │  • /api/revalidate (POST) — ISR via tags           │   │
│  │  • /api/preview (GET/POST) — Draft mode toggle     │   │
│  └─────────────────────────────────────────────────────┘   │
│           ↑                                                  │
│           └───── Contentful Webhooks ←──────────────────── │
│                                    (on publish/unpublish)   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing the Implementation

### 1. **Local Testing (Phase 0/1)**

**Prerequisites:**

- json-server running on port 3001: `yarn json-server db.json --port 3001`
- Dev server running: `yarn dev`

**Test Local API:**

```bash
# Verify data fetching
curl http://localhost:3000/

# Should render with content from db.json
# Check browser console for CMS logs
```

**Test Revalidation (Local):**

```bash
# Trigger revalidation for homePage
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-cms-revalidate-secret: dev-secret-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{"contentType": "homePage"}'

# Response:
# {"revalidated": true, "tags": ["cms:home"], "timestamp": "..."}
```

**Test Preview Mode (Local):**

```bash
# Enable draft mode
curl "http://localhost:3000/api/preview?secret=dev-secret-change-in-production&redirect=/"

# Disable draft mode
curl -X POST "http://localhost:3000/api/preview/exit"

# Check: __previewData cookie should be set
# In browser dev tools → Application → Cookies
```

### 2. **Contentful Integration Testing (Phase 2)**

**Prerequisites:**

- Contentful space created with models matching `phase-1-contentful-models-schema.md`
- Access tokens generated (Delivery + Preview)

**Setup Credentials:**

```bash
# Copy .env.local.example to .env.local
cp .env.local.example .env.local

# Edit .env.local with Contentful credentials
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_DELIVERY_ACCESS_TOKEN=cfpat_xxxxx
CONTENTFUL_PREVIEW_ACCESS_TOKEN=cfpat_xxxxx
CMS_PROVIDER=contentful-delivery
```

**Test Contentful Delivery:**

```bash
# Update env, restart dev server
yarn dev

# Monitor console logs for Contentful requests
# Check Network tab: should see requests to cdn.contentful.com

# If data missing, falls back to embedded db.json automatically
```

**Test Contentful Preview (Draft Mode):**

```bash
# Enable preview mode with draft token
curl "http://localhost:3000/api/preview?secret=dev-secret-change-in-production&redirect=/"

# Dev server should now use contentful-preview provider
# Check console: "Provider: contentful-preview"
```

**Test Webhook Revalidation:**

```bash
# In Contentful Dashboard:
# 1. Settings → Webhooks → Create webhook
# 2. POST URL: https://your-site.com/api/revalidate
# 3. Headers: x-cms-revalidate-secret: YOUR_SECRET
# 4. Triggers: Publish Entry, Unpublish Entry

# Make change in Contentful and publish
# Site should auto-revalidate via Next.js ISR
```

---

## Fallback & Error Handling

### Automatic Fallback Chain

```
Try: Contentful API (if credentials present)
  └─ On error: Try local-api (if running)
       └─ On error: Try embedded (db.json)
            └─ On error: Throw with console warning
```

**Example:**

```typescript
// If Contentful fails, automatically uses local-api
// If local-api fails, automatically uses embedded db.json
const siteConfig = await getSiteConfig();
// App continues working without CMS downtime
```

### Monitoring

- Console logs include `[Revalidate]` prefix for debugging
- Check logs in production via: `yarn dev` (local) or cloud logs (production)
- Webhook responses include timestamp for tracking

---

## Phase 1→2 Migration Checklist

- [ ] Contentful space created with 6 content types
- [ ] API keys generated (Delivery + Preview tokens)
- [ ] `.env.local` updated with Contentful credentials
- [ ] `CMS_PROVIDER=contentful-delivery` in production
- [ ] Webhook configured in Contentful Dashboard
- [ ] Webhook secret stored securely (not in git)
- [ ] Test draft mode: `/api/preview` endpoint working
- [ ] Test revalidation: Published content appears within 5 seconds
- [ ] Test fallback: Unplug Contentful API, site still works with cached content
- [ ] Monitoring: Check logs for any "Failed Contentful request" warnings
- [ ] Performance: Monitor CDN cache hit rates
- [ ] Team training: Document Contentful editor workflow for stakeholders

---

## Code References

### Files Modified

- `src/lib/cms/client.ts` — Added image helper, improved Contentful support
- `src/app/api/revalidate/route.ts` — Enhanced webhook handling
- `src/app/api/preview/route.ts` — New preview mode endpoint
- `src/lib/cms/index.ts` — Export image helper
- `.env.local.example` — Better documentation

### Type Safety

- All Contentful responses validated against `ContentContract` TypeScript interface
- Image URLs checked for `ctfassets.net` domain before transformation
- Webhook payloads parsed with type guards

### Next Steps (Phase 2)

1. Create Contentful space and content models
2. Migrate initial content from `db.json` to Contentful
3. Update stakeholder documentation for Contentful editor workflow
4. Set up monitoring/alerting for webhook failures
5. Schedule team training session

---

## Troubleshooting

**Problem:** "Missing CONTENTFUL_SPACE_ID"

- **Solution:** `CMS_PROVIDER` is set to `contentful-delivery` but env var is empty. Either set the var or change provider to `local-api`.

**Problem:** Webhook not triggering revalidation

- **Solution:** Check webhook secret matches `CMS_REVALIDATE_SECRET`. Verify webhook URL is publicly accessible. Check Contentful webhook logs in Dashboard.

**Problem:** Draft mode not working

- **Solution:** Ensure `CONTENTFUL_PREVIEW_ACCESS_TOKEN` is set. Verify draft cookies are being set in browser. Check that `CMS_PROVIDER=contentful-preview` when in draft mode.

**Problem:** Images not loading from Contentful

- **Solution:** Use `getContentfulImageUrl()` helper. Check that image URLs start with `https://images.ctfassets.net`. Verify image assets are published in Contentful.

---

## Resources

- **Contentful API Docs:** https://www.contentful.com/developers/docs/references/content-delivery-api/
- **Contentful Preview API:** https://www.contentful.com/developers/docs/references/content-preview-api/
- **Next.js Draft Mode:** https://nextjs.org/docs/app/building-your-application/configuring/draft-mode
- **Next.js ISR:** https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
- **Next.js revalidateTag:** https://nextjs.org/docs/app/api-reference/functions/revalidateTag
