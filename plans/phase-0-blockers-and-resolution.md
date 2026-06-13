# Phase 0 Blockers & Resolution Plan

## Overview

Phase 0 validation identified **4 critical issues** that must be resolved before migrating to Contentful. This document outlines each issue, impact, and recommended resolution.

---

## Blocker #1: siteConfig.metadataTitle Too Long ❌

### Issue

```
Current: "Relish Pilates — Yummy, challenging, feel-good Pilates"
Length: 62 characters
Limit:  60 characters (SEO best practice)
```

**Impact:**

- Google will truncate the title in search results on mobile (< 60 chars recommended)
- Poor SEO signal for search engines
- Inconsistent display across devices

### Resolution Options

| Option          | New Title                                | Chars | Pros                         | Cons                                     |
| --------------- | ---------------------------------------- | ----- | ---------------------------- | ---------------------------------------- |
| A (Recommended) | "Relish Pilates — Feel-good Pilates"     | 36    | Short, memorable, fits SERPs | Loses key phrases "yummy", "challenging" |
| B               | "Relish Pilates — Challenging Pilates"   | 38    | Keeps "challenging" keyword  | Loses "yummy", "feel-good"               |
| C               | "Yummy Pilates Classes — Relish Pilates" | 40    | Keeps key terms              | Longer, less brand-focused               |
| D               | "Relish Pilates — Strength & Flow"       | 34    | Short, benefits-focused      | More generic                             |

### ✅ Recommended Action

**Adopt Option A:** `"Relish Pilates — Feel-good Pilates"`

**Rationale:**

- Stays under 60 char limit with buffer
- Maintains "Relish Pilates" brand recognition
- "Feel-good" is a key emotional benefit
- Still matches home page hero copy theme

### Database Updates Required

Update in `db.json`:

```json
{
  "siteConfig": {
    "metadataTitle": "Relish Pilates — Feel-good Pilates" // Changed
  }
}
```

Also check if this title is duplicated elsewhere:

```bash
grep -r "Yummy, challenging, feel-good Pilates" src/ db.json
```

---

## Blocker #2: Footer Secondary Links Reference Non-existent Pages ⚠️

### Issue

`footerContactBlock.secondaryLinks` includes links to pages that don't exist:

```json
{
  "label": "Privacy",
  "href": "/privacy"
}
{
  "label": "Terms",
  "href": "/terms"
}
```

**Current Routes:**

- ✅ `/` (home)
- ✅ `/faq` (exists)
- ✅ `/pricing` (exists)
- ❌ `/privacy` (missing)
- ❌ `/terms` (missing)

**Impact:**

- Broken links in production footer
- Poor UX when users click privacy/terms
- 404 errors in analytics
- Potential SEO penalty

### Resolution Options

| Option            | Action                                   | Effort  | Notes                             |
| ----------------- | ---------------------------------------- | ------- | --------------------------------- |
| A: Remove Links   | Delete `/privacy` & `/terms` from footer | 5 min   | Simple, but limits legal coverage |
| B: Create Pages   | Create `/privacy` and `/terms` pages     | 1-2 hrs | Recommended for legal compliance  |
| C: External Links | Link to external policy pages            | 30 min  | Requires external policy URLs     |

### ✅ Recommended Action

**Adopt Option B:** Create `/privacy` and `/terms` pages

**Rationale:**

- Legal requirement for e-commerce/SaaS platforms
- Improves user trust
- Enables future CMS editing of policies
- Positions Relish as professional

### Implementation Steps

1. **Create `/src/app/privacy/page.tsx`**

   ```tsx
   // Simple privacy policy page
   export const metadata = {
     title: "Privacy Policy | Relish Pilates",
     description: "Relish Pilates privacy policy",
   };

   export default function PrivacyPage() {
     // Placeholder privacy policy
     // Content to be provided by legal/business
   }
   ```

2. **Create `/src/app/terms/page.tsx`**

   ```tsx
   // Simple terms of service page
   export const metadata = {
     title: "Terms of Service | Relish Pilates",
     description: "Relish Pilates terms of service",
   };

   export default function TermsPage() {
     // Placeholder terms page
     // Content to be provided by legal/business
   }
   ```

3. **Test footer links**
   - Verify links navigate correctly
   - Verify page titles/descriptions render

### Fallback Option

If creating pages is deferred, remove from footer now:

```json
{
  "secondaryLinks": [
    { "label": "About", "href": "/#about" },
    { "label": "FAQ", "href": "/faq" }
  ]
}
```

---

## Blocker #3: FAQ Page Has Placeholder Content ❌

### Issue

`faqPage.items` contains generic placeholder content:

```json
{
  "items": [
    {
      "title": "FAQ title",
      "body": "Paragraph 1 body copy"
    },
    {
      "title": "FAQ title",
      "body": "Paragraph 1 body copy"
    }
  ]
}
```

**Impact:**

- FAQ page is not useful to visitors
- No SEO value (generic content)
- May hurt credibility ("under construction" appearance)
- Can't launch FAQ in production with this content

### Resolution Options

| Option                 | Action                                     | Effort  | Recommendation                |
| ---------------------- | ------------------------------------------ | ------- | ----------------------------- |
| A: Gather Real FAQs    | Interview stakeholder for real Q&A         | 1-2 hrs | **Recommended**               |
| B: Create Generic FAQs | Write placeholder FAQs (Pilates 101, etc.) | 30 min  | Quick solution, limited value |
| C: Defer FAQ Section   | Hide FAQ from site, keep page              | 5 min   | Later feature                 |

### ✅ Recommended Action

**Adopt Option A:** Gather real FAQ content from stakeholder (Lenny)

### Required Information

Ask stakeholder for at least **5-10 real FAQ Q&A pairs:**

Example format:

```
Q: What should I bring to my first session?
A: Just yourself! I'll guide you through everything. A yoga mat or towel is helpful, and wear comfortable clothes you can move in.

Q: How long is each session?
A: Each session is 55-60 minutes, tailored to your goals and current fitness level.

Q: What if I've never done Pilates before?
A: Perfect! Intro sessions are designed for all fitness levels. I'll show you proper form and modifications for any exercise.

Q: Can I reschedule if I need to?
A: Yes! You have 24 hours notice to reschedule. We understand life happens.

Q: Do you offer group sessions?
A: Currently offering 1-on-1 personalized sessions. Group sessions are a future offering.
```

### Implementation

Once content is gathered:

1. Update `db.json`:

   ```json
   {
     "faqPage": {
       "items": [
         {
           "title": "What should I bring to my first session?",
           "body": "Just yourself! I'll guide you through everything. A yoga mat or towel is helpful, and wear comfortable clothes you can move in."
         }
         // ... more items
       ]
     }
   }
   ```

2. Verify FAQ page renders correctly
3. Test mobile responsiveness

---

## Blocker #4: Pricing Page Package Names Have Formatting Issues ⚠️

### Issue

`pricingPage.introPackage.name` contains a newline character:

```json
{
  "name": "Intro Special\n3-Session Pack"
}
```

**Current Rendering:**

```
Intro Special
3-Session Pack
```

**Impact:**

- Inconsistent rendering across devices
- Breaks card layout in some contexts
- Difficult to handle in Contentful (will be single-line)
- Not SEO-friendly

### Resolution

**Fix:** Normalize to single-line format

| Current                         | Proposed                         | Reason             |
| ------------------------------- | -------------------------------- | ------------------ |
| "Intro Special\n3-Session Pack" | "Intro Special 3-Session Pack"   | Single line, clean |
| "Intro Special\n3-Session Pack" | "Intro Special — 3-Session Pack" | Semantic separator |
| "Intro Special\n3-Session Pack" | "3-Session Intro Pack"           | Shorter, clearer   |

### ✅ Recommended Action

**Adopt:** `"Intro Special — 3-Session Pack"`

**Rationale:**

- Uses em-dash (semantic separator)
- Single line, Contentful-compatible
- Professional formatting
- Still clearly indicates intro special

### Database Update

Update `db.json`:

```json
{
  "pricingPage": {
    "introPackage": {
      "name": "Intro Special — 3-Session Pack" // Changed from "Intro Special\n3-Session Pack"
    }
  }
}
```

---

## Resolution Checklist

### Blocker #1: Metadata Title

- [ ] Decide on new title (Recommended: Option A)
- [ ] Update `db.json` `siteConfig.metadataTitle`
- [ ] Test via mock server: `curl http://localhost:3001/siteConfig`
- [ ] Verify home page renders updated title
- [ ] Run `yarn typecheck` to ensure no other refs

### Blocker #2: Privacy/Terms Pages

- [ ] Decide: Create pages (Option B) or remove links (Fallback)
- **If Option B:**
  - [ ] Create `/src/app/privacy/page.tsx`
  - [ ] Create `/src/app/terms/page.tsx`
  - [ ] Add placeholder content (to be updated later)
  - [ ] Test footer links navigate correctly
  - [ ] Run tests: `yarn test`
- **If Fallback:**
  - [ ] Remove `/privacy` and `/terms` from `db.json` `footerContactBlock.secondaryLinks`
  - [ ] Verify footer renders correctly

### Blocker #3: FAQ Content

- [ ] Contact stakeholder (Lenny) for real FAQ Q&A
- [ ] Collect at least 5-10 FAQ pairs
- [ ] Update `db.json` `faqPage.items` with real content
- [ ] Test FAQ page renders with new content
- [ ] Run tests: `yarn test`

### Blocker #4: Pricing Package Names

- [ ] Update `db.json` `pricingPage.introPackage.name` to `"Intro Special — 3-Session Pack"`
- [ ] Test pricing page renders updated name
- [ ] Verify card layout still looks good
- [ ] Run `yarn test`

---

## Next Steps

1. **Review this document with Lenny** to confirm decisions on all 4 blockers
2. **Implement resolutions** in priority order:
   - Blocker #1 (Metadata Title) - 5 min
   - Blocker #4 (Pricing Names) - 5 min
   - Blocker #2 (Privacy/Terms) - 1-2 hrs
   - Blocker #3 (FAQ Content) - 1-2 hrs
3. **Validate fixes** via mock server
4. **Run full test suite** to ensure no regressions
5. **Proceed to Phase 1** once all blockers resolved

---

## Decision Record

| Blocker           | Recommended Option  | Status     | Decided By | Date |
| ----------------- | ------------------- | ---------- | ---------- | ---- |
| #1: Title Length  | Option A            | ⏳ Pending | TBD        | -    |
| #2: Privacy/Terms | Option B            | ⏳ Pending | TBD        | -    |
| #3: FAQ Content   | Option A            | ⏳ Pending | TBD        | -    |
| #4: Package Names | Single-line em-dash | ⏳ Pending | TBD        | -    |

---

## Resources

- [SEO Title Length Best Practices](https://moz.com/learn/seo/title-tag)
- [Privacy Policy Templates](https://www.termly.io/resources/templates/)
- [Terms of Service Templates](https://www.termsfeed.com/)
