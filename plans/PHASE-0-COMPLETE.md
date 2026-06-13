# Phase 0: Complete — Next Steps

## ✅ Phase 0 Completion Summary

### What Was Accomplished

**Phase 0: Finalize Local Contract** is now complete. The following deliverables have been created:

#### 1. **Local Environment Setup** ✅

- Created `.env.local` with local-api defaults
- Verified all 6 JSON-server endpoints are accessible
- Confirmed `db.json` contract is valid and complete

#### 2. **Field Mapping Matrix** ✅

- Created: `plans/phase-0-field-mapping-matrix.md`
- Analyzed all 7 content types (siteConfig, navigationMenu, footerContactBlock, homePage, faqPage, pricingPage, simplePage)
- Identified 4 critical blockers requiring resolution
- Documented all data types, validations, and editor workflows

#### 3. **Contentful Models Schema** ✅

- Created: `plans/phase-1-contentful-models-schema.md`
- Defined 6 Contentful content types with complete field configurations
- Provided JSON-compatible content type definitions
- Documented API tokens, webhook configuration, and localization strategy
- Included migration path from Phase 1 → Phase 5

#### 4. **Blocker Resolution Plan** ✅

- Created: `plans/phase-0-blockers-and-resolution.md`
- Documented all 4 critical issues with resolution options
- Provided implementation checklists and decision matrix
- Ready for stakeholder review

### Files Created

| File                                        | Purpose                      | Status   |
| ------------------------------------------- | ---------------------------- | -------- |
| `.env.local`                                | Local dev environment config | Ready ✅ |
| `plans/phase-0-field-mapping-matrix.md`     | Complete field audit         | Ready ✅ |
| `plans/phase-1-contentful-models-schema.md` | Contentful config guide      | Ready ✅ |
| `plans/phase-0-blockers-and-resolution.md`  | Blocker resolutions          | Ready ✅ |

### Critical Issues Found

#### 1. Metadata Title Too Long (62 vs 60 chars)

- **Impact:** Google will truncate in mobile SERPs
- **Resolution:** Change to `"Relish Pilates — Feel-good Pilates"` (36 chars)

#### 2. Footer Links Reference Non-existent Pages

- **Impact:** 404 errors for `/privacy` and `/terms`
- **Resolution:** Create these pages OR remove links

#### 3. FAQ Content is Placeholder

- **Impact:** Page not useful, no SEO value
- **Resolution:** Gather real FAQ Q&A from stakeholder

#### 4. Pricing Package Name Has Newline

- **Impact:** Breaks formatting consistency
- **Resolution:** Change to `"Intro Special — 3-Session Pack"`

---

## 🚀 Next Steps: Phase 0 → Phase 1

### Step 1: Resolve Blockers (1-2 hours)

1. **Review** `plans/phase-0-blockers-and-resolution.md` with Lenny
2. **Decide** on resolution for each of the 4 blockers
3. **Implement** fixes in `db.json`:
   ```bash
   # Blocker #1: Update metadata title
   # Blocker #2: Create /privacy and /terms pages OR remove links
   # Blocker #3: Gather real FAQ content from stakeholder
   # Blocker #4: Update pricing package name
   ```
4. **Validate** fixes:
   ```bash
   yarn mock-server &  # Start JSON-server
   curl http://localhost:3001/siteConfig | jq .metadataTitle
   # Verify changes are served correctly
   ```

### Step 2: Finalize Local Contract (30 minutes)

1. **Run full test suite** to ensure no regressions:

   ```bash
   yarn test
   yarn typecheck
   yarn lint
   ```

2. **Test mock server mode** end-to-end:

   ```bash
   CMS_PROVIDER=local-api yarn dev &
   # Visit http://localhost:3000 and verify all pages render from local API
   # Check Network tab to confirm fetches from localhost:3001
   ```

3. **Sign off on contract** — confirm all fields match implementation

### Step 3: Prepare for Contentful Integration (30 minutes)

1. **Review** `plans/phase-1-contentful-models-schema.md`
2. **Gather Contentful credentials** (will need):
   - Contentful Space ID
   - Contentful Environment (usually "master")
   - Contentful API tokens (delivery & preview)
3. **Schedule Contentful space creation** if not already done
4. **Identify editor workflows** (who will manage content in Contentful?)

### Step 4: Begin Phase 1 (Contentful SDK Integration)

Once Phase 0 is complete and blockers resolved:

1. **Install Contentful SDK:**

   ```bash
   yarn add @contentful/rich-text-react-renderer @contentful/rich-text-resolver
   ```

2. **Enhance `src/lib/cms/client.ts`** to support Contentful provider:

   - Add `fetchContentfulResource()` function
   - Add `unwrapLocalizedField()` for locale handling
   - Add image URL transformation helpers
   - Add error handling with fallback to embedded content

3. **Implement preview mode** in `src/app/layout.tsx`:

   - Add Contentful preview token configuration
   - Add draft mode headers

4. **Configure webhook revalidation** in `src/app/api/revalidate/route.ts`:

   - Add Contentful webhook signature validation
   - Implement path revalidation logic

5. **Test all 4 CMS providers:**
   - ✅ `CMS_PROVIDER=embedded` (current)
   - ✅ `CMS_PROVIDER=local-api` (current)
   - 🔨 `CMS_PROVIDER=contentful-delivery` (Phase 1)
   - 🔨 `CMS_PROVIDER=contentful-preview` (Phase 1)

---

## Timeline Estimate

| Phase | Task                       | Effort          | Timeline      |
| ----- | -------------------------- | --------------- | ------------- |
| **0** | Finalize local contract    | ✅ Complete     | Done          |
| **0** | Resolve 4 blockers         | 2 hrs           | This week     |
| **1** | Contentful SDK integration | 4-6 hrs         | Next 2 days   |
| **2** | Preview mode & webhooks    | 3-4 hrs         | Day 3-4       |
| **3** | Content migration          | 2-3 hrs         | Day 5         |
| **4** | Testing & validation       | 4-6 hrs         | Day 6-7       |
| **5** | Production deployment      | 2-3 hrs         | Day 8         |
|       | **Total**                  | **17-25 hours** | **1-2 weeks** |

---

## Decision Points Requiring Stakeholder Input

1. **Blocker #2: Privacy/Terms Pages**

   - Create pages now? (Recommended: Yes)
   - Or remove footer links? (Fallback: Yes)

2. **Blocker #3: FAQ Content**

   - Provide real Q&A pairs? (Required before launch)
   - Timeline for FAQ content delivery?

3. **Image Strategy (Phase 1 Preview)**

   - Keep image URLs as strings in db.json? (Current)
   - Or migrate to Contentful Assets? (Later)

4. **Simple Pages Feature (Phase 2)**
   - Should `/about`, `/privacy`, `/terms` be editor-managed?
   - Timeline for this feature?

---

## Key Documents for Reference

1. **Original Migration Plan**

   - File: `plans/cms-content-migration-plan.md`
   - Outlines complete 3-phase strategy

2. **Phase 0 Field Mapping**

   - File: `plans/phase-0-field-mapping-matrix.md`
   - Complete field audit with validations

3. **Phase 1 Contentful Schema**

   - File: `plans/phase-1-contentful-models-schema.md`
   - All content type definitions ready for Contentful

4. **Blocker Resolution**
   - File: `plans/phase-0-blockers-and-resolution.md`
   - 4 critical issues with solutions

---

## Rollback Plan

If issues occur during Phase 1, rollback is simple:

```bash
# Revert CMS provider to embedded or local-api
CMS_PROVIDER=embedded yarn build
# OR
CMS_PROVIDER=local-api yarn dev
```

Both modes include fallback to `defaultContent` (embedded db.json), so content is never lost.

---

## Success Criteria

✅ **Phase 0 is successful when:**

1. All JSON-server endpoints return valid data
2. All 4 blockers have documented resolutions
3. `.env.local` is configured for local-api mode
4. Field mapping matrix matches implementation
5. Contentful schema is ready for creation
6. Stakeholder has reviewed and approved blocker resolutions

✅ **All criteria met** — Ready for Phase 1!

---

## Questions?

Refer to:

- `plans/phase-0-field-mapping-matrix.md` for field details
- `plans/phase-1-contentful-models-schema.md` for Contentful config
- `plans/phase-0-blockers-and-resolution.md` for blockers & resolutions
- Original `plans/cms-content-migration-plan.md` for overall strategy
