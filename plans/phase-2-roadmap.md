# Phase 2+: Roadmap & Next Steps

**Overall Progress:** Phase 1 Complete ✅ | Phase 2 Ready to Start | Phase 3 Future

---

## Phase 2: Content Migration & Testing

**Objective:** Migrate all content from `db.json` to Contentful and validate end-to-end workflow

### 2.1 Contentful Space Setup

**Prerequisite Tasks (Out of Scope for Dev):**

- [ ] Create Contentful account (if not exists)
- [ ] Create new space (or use existing)
- [ ] Generate API keys:
  - [ ] Delivery API token (for CDN)
  - [ ] Preview API token (for drafts)

**Developer Tasks:**

1. **Create Content Models** (Reference: `plans/phase-1-contentful-models-schema.md`)

   - [ ] Create 6 content types matching TypeScript interfaces:
     - [ ] `siteConfig` (single instance)
     - [ ] `navigationMenu` (single instance)
     - [ ] `footerContactBlock` (single instance)
     - [ ] `homePage` (single instance)
     - [ ] `faqPage` (supports multiple items)
     - [ ] `pricingPage` (single instance)
   - [ ] Enable localization if needed (currently `en-US` only)
   - [ ] Set up field validations (lengths, required fields)
   - [ ] Document field constraints for editors

2. **Configure API Keys** (in Contentful Dashboard)
   - [ ] Create Content Delivery API token (read-only)
   - [ ] Create Content Preview API token (read-only)
   - [ ] Set IP restrictions if needed
   - [ ] Store tokens in `.env.local` (dev) and deployment platform (production)

### 2.2 Data Migration

**Strategy:** Two-phase approach (validate, then migrate)

1. **Phase 2a: Validation (Local Testing)**

   - [ ] Keep `CMS_PROVIDER=local-api` (don't migrate yet)
   - [ ] Manually create one entry in Contentful (e.g., `siteConfig`)
   - [ ] Test reading from Contentful in isolation
   - [ ] Verify data structure matches TypeScript interface
   - [ ] Document any field mapping differences

2. **Phase 2b: Bulk Migration**

   - [ ] Migrate all entries from `db.json` to Contentful
   - [ ] Use Contentful import feature or manual entry
   - [ ] Verify all 6 content types populated
   - [ ] Validate entry count and field completeness
   - [ ] Create backup of `db.json` in git (tag: `v1-before-migration`)

3. **Phase 2c: Cutover Testing**
   - [ ] Switch `CMS_PROVIDER=contentful-delivery` in `.env.local`
   - [ ] Run test suite: `yarn test` (should all pass)
   - [ ] Verify all pages render correctly
   - [ ] Check browser console for any warnings
   - [ ] Monitor performance: Network tab should show contentful API calls

### 2.3 Webhook Integration

1. **Configure Contentful Webhook**

   - [ ] In Contentful Dashboard: Settings → Webhooks → Create
   - [ ] POST URL: `https://yoursite.com/api/revalidate`
   - [ ] Headers: `x-cms-revalidate-secret: YOUR_SECRET`
   - [ ] Triggers:
     - [ ] Entry Published
     - [ ] Entry Unpublished
     - [ ] Asset Published
   - [ ] Test webhook delivery in Contentful UI

2. **Deployment Configuration**
   - [ ] Store `CONTENTFUL_*` tokens in deployment platform (Vercel, etc.)
   - [ ] Store `CMS_REVALIDATE_SECRET` securely (rotate periodically)
   - [ ] Ensure production URL is publicly accessible for webhooks
   - [ ] Set up monitoring/alerting for webhook failures

### 2.4 Testing Checklist

- [ ] **Type Safety:** TypeScript compilation clean (`npx tsc --noEmit`)
- [ ] **Unit Tests:** All pass (`yarn test`)
- [ ] **Component Tests:** Verify all pages still render with Contentful data
- [ ] **Integration:** Test full request cycle (Contentful → app → rendered HTML)
- [ ] **Error Handling:** Unplug Contentful, verify fallback to embedded content
- [ ] **Performance:** Monitor ISR revalidation time (should be < 5 seconds)
- [ ] **Webhooks:** Publish entry, verify site updates within 5 seconds
- [ ] **Preview Mode:** Edit entry in Contentful, see changes via `/api/preview`
- [ ] **Search Engines:** Verify no robots.txt blocks crawlers from Contentful CDN

---

## Phase 3: Content Editor Experience

**Objective:** Empower non-technical stakeholders to manage content via Contentful UI

### 3.1 Contentful Editor Setup

1. **Field Documentation**

   - [ ] Add field descriptions in Contentful (visible to editors)
   - [ ] Document character limits (titles, descriptions)
   - [ ] Provide examples for each field type
   - [ ] Create style guide for rich text formatting

2. **Access Control**
   - [ ] Create "Editor" role with publish permissions
   - [ ] Create "Admin" role with full permissions
   - [ ] Invite stakeholders to Contentful workspace
   - [ ] Document login/password reset workflow

### 3.2 Editor Workflow Documentation

Create internal wiki with:

- [ ] How to edit homepage content
- [ ] How to edit FAQ entries
- [ ] How to update pricing
- [ ] How to preview changes before publishing
- [ ] How to troubleshoot common issues
- [ ] Who to contact for technical support

### 3.3 Training Session

- [ ] Schedule team training on Contentful UI
- [ ] Demo: Creating new FAQ entry
- [ ] Demo: Publishing and preview workflow
- [ ] Q&A: Answer editor questions

---

## Phase 4: Advanced Features (Future)

### 4.1 Localization

- [ ] Add support for multiple locales (es, fr, etc.)
- [ ] Update TypeScript interfaces for locale support
- [ ] Configure Contentful locales and fallbacks
- [ ] Deploy locale-specific pages

### 4.2 Image Optimization

- [ ] Upload images to Contentful DAM
- [ ] Configure image transforms (srcset, thumbnails)
- [ ] Integrate with Next.js `<Image>` component
- [ ] Monitor CDN cache performance

### 4.3 SEO & Rich Text

- [ ] Support Contentful rich text (markdown, embeds)
- [ ] Add rich text renderer component
- [ ] Configure SEO fields (meta title, description)
- [ ] Generate sitemap from Contentful

### 4.4 Analytics

- [ ] Track content performance in Google Analytics
- [ ] Monitor editor activity in Contentful
- [ ] Alert on publish failures or slow revalidation
- [ ] Dashboard: Content engagement metrics

---

## Deployment Strategy

### Development

```bash
CMS_PROVIDER=local-api      # json-server on :3001
yarn dev                     # http://localhost:3000
```

### Staging (Pre-production)

```bash
CMS_PROVIDER=contentful-delivery
CONTENTFUL_SPACE_ID=<your-space>
CONTENTFUL_DELIVERY_ACCESS_TOKEN=<token>
# Deploy to staging URL
# Test with real Contentful data
# Verify webhooks trigger correctly
```

### Production

```bash
CMS_PROVIDER=contentful-delivery
CONTENTFUL_SPACE_ID=<your-space>
CONTENTFUL_DELIVERY_ACCESS_TOKEN=<token>
CONTENTFUL_PREVIEW_ACCESS_TOKEN=<token>  # For draft mode
CMS_REVALIDATE_SECRET=<random-secret>
# Monitor webhook delivery in Contentful dashboard
# Monitor revalidation logs in deployment platform
```

---

## Monitoring & Maintenance

### Weekly Tasks

- [ ] Check Contentful webhook logs for failures
- [ ] Review revalidation performance (tail deployment logs)
- [ ] Scan browser console for Contentful API errors
- [ ] Verify ISR cache is updating correctly

### Monthly Tasks

- [ ] Review Contentful API usage (rate limits, overage charges)
- [ ] Audit editor activity in Contentful
- [ ] Update documentation if workflow changes
- [ ] Collect feedback from content editors

### Quarterly Tasks

- [ ] Review content performance metrics
- [ ] Plan new features (localization, rich text, etc.)
- [ ] Update security credentials (rotate tokens if needed)
- [ ] Team training refresher

---

## Success Metrics

✅ **Phase 1 Complete When:**

- TypeScript compiles without errors
- All tests pass (54/54)
- `/api/revalidate` endpoint responds correctly
- `/api/preview` enables draft mode
- `getContentfulImageUrl()` helper works
- Documentation complete

✅ **Phase 2 Complete When:**

- Contentful space created with 6 content types
- All entries migrated from `db.json`
- Webhook configured and tested
- `CMS_PROVIDER=contentful-delivery` in production
- All pages render correctly with Contentful data
- Performance metrics acceptable (LCP < 2.5s)

✅ **Phase 3 Complete When:**

- Non-technical stakeholders can publish content independently
- Editor documentation exists and is up-to-date
- Team training completed
- Zero support requests for "how to..." questions

---

## Timeline Estimate

| Phase    | Duration  | Start Date    | Status                              |
| -------- | --------- | ------------- | ----------------------------------- |
| Phase 0  | 1-2 days  | Jan 13        | ✅ Complete                         |
| Phase 1  | 3-4 hours | Today         | ✅ Complete                         |
| Phase 2  | 1-2 weeks | After Phase 1 | 🔶 Blocked (needs Contentful space) |
| Phase 3  | 1-2 weeks | After Phase 2 | ⏳ Pending                          |
| Phase 4+ | TBD       | Q2+ 2025      | 📅 Future                           |

---

## Blockers & Dependencies

### Phase 2 Blockers

- **Contentful Space:** Needs to be created by stakeholder
- **Access Tokens:** Must be generated in Contentful Dashboard
- **FAQ Content:** Needs stakeholder input (not yet captured)

### Phase 3 Blockers

- **Stakeholder Availability:** For training session
- **Final Workflow Approval:** Before launching to team

### Phase 4 Blockers

- **Business Requirements:** Localization, rich text demand
- **Budget:** May require Contentful plan upgrade

---

## Questions for Stakeholders

Before Phase 2, confirm:

1. Is Contentful the right platform for your team?
2. Who will manage content editors? (need admin access)
3. When do you need multi-language support?
4. Do you want to support rich text (bold, links, embeds)?
5. What's your target for editor self-sufficiency?

---

## Resources

- **Contentful Guides:** https://www.contentful.com/developers/docs/
- **Next.js Handbook:** https://nextjs.org/learn
- **ISR Best Practices:** https://vercel.com/docs/incremental-static-regeneration
- **TypeScript Guide:** https://www.typescriptlang.org/docs/
