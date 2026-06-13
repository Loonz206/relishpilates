# Phase 0: Field Mapping Matrix

## Overview

This matrix maps all fields from `db.json` to proposed Contentful content types. It identifies data types, validations, and any inconsistencies in the current schema.

---

## 1. siteConfig → Contentful: `siteConfig`

| Field                 | Type   | Required | Validation                        | Current Value                                                                                                                                                  | Issues                              |
| --------------------- | ------ | -------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `brandName`           | String | ✅       | Max 255 chars                     | "Relish Pilates"                                                                                                                                               | None                                |
| `brandHandle`         | String | ✅       | Max 50 chars, no spaces           | "RelishPilates"                                                                                                                                                | None                                |
| `metadataTitle`       | String | ✅       | Max 60 chars (SEO best practice)  | "Relish Pilates — Yummy, challenging, feel-good Pilates"                                                                                                       | ⚠️ **62 chars** — exceeds SEO limit |
| `metadataDescription` | String | ✅       | Max 160 chars (SEO best practice) | "Virtual Pilates classes built entirely around you. With custom programming and personal attention, every movement connects to how you want to move and feel." | ✅ **155 chars** — good             |

**Decisions:**

- Set field-level validation in Contentful: title ≤ 60 chars, description ≤ 160 chars
- Add editor help text: "Keep titles under 60 characters for optimal Google display"
- Consider truncating `metadataTitle` to 60 chars or rewording

---

## 2. navigationMenu → Contentful: `navigationMenu`

| Field               | Type     | Required | Validation         | Current Value                                     | Issues                                        |
| ------------------- | -------- | -------- | ------------------ | ------------------------------------------------- | --------------------------------------------- |
| `links[0]`          | Object[] | ✅       | Array of LinkItems | 5 items                                           | None                                          |
| `links[].label`     | String   | ✅       | Max 50 chars       | Various ("Schedule", "Pricing", etc.)             | None                                          |
| `links[].href`      | String   | ✅       | Valid href format  | Various (relative & anchor)                       | ✅ Uses both `/` and `#` correctly            |
| `links[].ariaLabel` | String   | ❌       | Optional           | Not present                                       | ⚠️ **Missing** — should add for accessibility |
| `cta`               | Object   | ✅       | LinkItem           | {"label": "Book a Session", "href": "/#schedule"} | None                                          |

**Decisions:**

- Make `ariaLabel` optional in LinkItem type (already is in code)
- Add Contentful validation: links array min 1, max 10 items
- Add editor help text: "Navigation links appear in desktop menu and footer"

**Inconsistency Found:**

- Some links use anchor (#schedule) but `/faq`, `/pricing` use page routes
- Decision: Keep current pattern (mixed routing is fine for SPA)

---

## 3. footerContactBlock → Contentful: `footerContactBlock`

| Field                       | Type     | Required | Validation                                 | Current Value                            | Issues                                                    |
| --------------------------- | -------- | -------- | ------------------------------------------ | ---------------------------------------- | --------------------------------------------------------- |
| `heading`                   | String   | ✅       | Max 100 chars                              | "Got questions?"                         | None                                                      |
| `formAriaLabel`             | String   | ✅       | Max 100 chars                              | "Contact form"                           | None                                                      |
| `fields`                    | Object   | ✅       | Nested object                              | 7 fields                                 | None                                                      |
| `fields.nameLabel`          | String   | ✅       | Max 50 chars                               | "Name"                                   | None                                                      |
| `fields.namePlaceholder`    | String   | ✅       | Max 100 chars                              | "Your name..."                           | None                                                      |
| `fields.emailLabel`         | String   | ✅       | Max 50 chars                               | "Email"                                  | None                                                      |
| `fields.emailPlaceholder`   | String   | ✅       | Max 100 chars                              | "you@example.com"                        | None                                                      |
| `fields.messageLabel`       | String   | ✅       | Max 50 chars                               | "What's on your mind"                    | None                                                      |
| `fields.messagePlaceholder` | String   | ✅       | Max 255 chars                              | "Tell me what's on your mind..."         | None                                                      |
| `fields.submitLabel`        | String   | ✅       | Max 50 chars                               | "Send Message"                           | None                                                      |
| `primaryLinks[]`            | Object[] | ✅       | Array of LinkItems (4 items)               | Various                                  | None                                                      |
| `secondaryLinks[]`          | Object[] | ✅       | Array of LinkItems (4 items)               | Various                                  | ⚠️ Includes `/privacy` & `/terms` pages (not yet created) |
| `locationHeading`           | String   | ✅       | Max 100 chars                              | "Locations"                              | None                                                      |
| `locationBody`              | String   | ✅       | Max 255 chars                              | "Streaming from beautiful Bremerton, WA" | None                                                      |
| `socialLinks[]`             | Object[] | ✅       | Array of {label, href, ariaLabel} (1 item) | Instagram link                           | None                                                      |

**Decisions:**

- Use Contentful Object type for nested `fields`
- Set array min/max: `primaryLinks` 1-10, `secondaryLinks` 1-10, `socialLinks` 1-5
- Add validation: `socialLinks` must have `ariaLabel` (currently required in type)

**Inconsistency Found:**

- **Secondary links reference `/privacy` and `/terms` pages that don't exist**
- Decision: Either (a) create these pages, or (b) remove these links
- **Action: Document for Phase 2 — decide if /privacy and /terms pages are needed**

---

## 4. homePage → Contentful: `homePage`

### 4.1 Top-level fields

| Field                 | Type   | Required | Validation          | Issues                                       |
| --------------------- | ------ | -------- | ------------------- | -------------------------------------------- |
| `metadataTitle`       | String | ✅       | Max 60 chars        | ⚠️ Same as siteConfig — may conflict in SERP |
| `metadataDescription` | String | ✅       | Max 160 chars       | ✅ Good                                      |
| `hero`                | Object | ✅       | Nested HeroSection  | None                                         |
| `about`               | Object | ✅       | Nested AboutSection | None                                         |
| `steps`               | Object | ✅       | Nested StepsSection | None                                         |

### 4.2 hero (nested)

| Field                   | Type     | Required | Validation                 | Current Value                                    | Issues |
| ----------------------- | -------- | -------- | -------------------------- | ------------------------------------------------ | ------ |
| `heading`               | String   | ✅       | Max 100 chars              | "Yummy, challenging, feel-good Pilates"          | None   |
| `paragraphs[]`          | String[] | ✅       | Array of strings (3 items) | Various                                          | None   |
| `cta`                   | Object   | ✅       | LinkItem                   | {"label": "Book a session", "href": "#schedule"} | None   |
| `images.welcomeAlt`     | String   | ✅       | Max 255 chars              | "Relish Pilates welcome"                         | None   |
| `images.mermaidAlt`     | String   | ✅       | Max 255 chars              | "Pilates mermaid pose"                           | None   |
| `images.legPullBackAlt` | String   | ✅       | Max 255 chars              | "Pilates leg pull back"                          | None   |

**Decision:** Images are alt text only; actual images handled by Next.js Image component. No Contentful Asset needed yet (Phase A strategy).

### 4.3 about (nested)

| Field          | Type     | Required | Validation                 | Current Value                 | Issues |
| -------------- | -------- | -------- | -------------------------- | ----------------------------- | ------ |
| `heading`      | String   | ✅       | Max 100 chars              | "Strengthen. Stretch. Savor." | None   |
| `paragraphs[]` | String[] | ✅       | Array of strings (3 items) | Various                       | None   |

### 4.4 steps (nested)

| Field               | Type     | Required | Validation                      | Current Value                                    | Issues |
| ------------------- | -------- | -------- | ------------------------------- | ------------------------------------------------ | ------ |
| `eyebrow`           | String   | ✅       | Max 50 chars                    | "How to Relish"                                  | None   |
| `heading`           | String   | ✅       | Max 100 chars                   | "Ready to Pilates"                               | None   |
| `cta`               | Object   | ✅       | LinkItem                        | {"label": "Book a session", "href": "#schedule"} | None   |
| `items[]`           | Object[] | ✅       | Array of StepItem (3 items)     | 3 steps                                          | None   |
| `items[].number`    | String   | ✅       | Single digit "1"-"9"            | "1", "2", "3"                                    | None   |
| `items[].title`     | String   | ✅       | Max 100 chars                   | Various                                          | None   |
| `items[].bullets[]` | String[] | ✅       | Array of strings (2-4 per item) | Various                                          | None   |

---

## 5. faqPage → Contentful: `faqPage`

| Field                 | Type     | Required | Validation                             | Current Value                         | Issues                     |
| --------------------- | -------- | -------- | -------------------------------------- | ------------------------------------- | -------------------------- |
| `metadataTitle`       | String   | ✅       | Max 60 chars                           | "FAQ \| Relish Pilates"               | None                       |
| `metadataDescription` | String   | ✅       | Max 160 chars                          | "Find answers to common questions..." | None                       |
| `heading`             | String   | ✅       | Max 100 chars                          | "Frequently Asked Questions"          | None                       |
| `items[]`             | Object[] | ✅       | Array of FaqItem (2 placeholder items) | Placeholder: "FAQ title"              | ⚠️ **PLACEHOLDER CONTENT** |
| `items[].title`       | String   | ✅       | Max 100 chars                          | "FAQ title"                           | ⚠️ Generic placeholder     |
| `items[].body`        | String   | ✅       | Max 1000 chars                         | "Paragraph 1 body copy"               | ⚠️ Generic placeholder     |

**Inconsistency Found:**

- **FAQ items are placeholder content**
- Decision: Gather real FAQ content from business stakeholder before Phase 2
- **Action: Contact for real FAQ Q&A pairs**

---

## 6. pricingPage → Contentful: `pricingPage`

### 6.1 Top-level fields

| Field                 | Type     | Required | Validation                        | Current Value                                | Issues |
| --------------------- | -------- | -------- | --------------------------------- | -------------------------------------------- | ------ |
| `metadataTitle`       | String   | ✅       | Max 60 chars                      | "Pricing \| Relish Pilates"                  | None   |
| `metadataDescription` | String   | ✅       | Max 160 chars                     | "Explore Relish Pilates session packages..." | None   |
| `heading`             | String   | ✅       | Max 100 chars                     | "Pricing options"                            | None   |
| `packagesHeading`     | String   | ✅       | Max 100 chars                     | "Packages"                                   | None   |
| `highlights[]`        | String[] | ✅       | Array of strings (4 items)        | Various benefits                             | None   |
| `notes[]`             | String[] | ✅       | Array of strings (2 items)        | Expiration & tax notes                       | None   |
| `faqLink`             | Object   | ✅       | LinkItem                          | {"label": "View FAQ", "href": "/faq"}        | None   |
| `introPackage`        | Object   | ✅       | PricingPackage                    | Intro 3-pack                                 | None   |
| `standardPackages[]`  | Object[] | ✅       | Array of PricingPackage (3 items) | Single, 5-pack, 10-pack                      | None   |

### 6.2 introPackage & standardPackages[] (nested)

| Field   | Type   | Required | Validation              | Current Value                                                     | Issues              |
| ------- | ------ | -------- | ----------------------- | ----------------------------------------------------------------- | ------------------- |
| `name`  | String | ✅       | Max 100 chars           | "Intro Special\n3-Session Pack"                                   | ⚠️ Contains newline |
| `price` | String | ✅       | Max 100 chars           | "$195 \| $65 per session"                                         | None                |
| `note`  | String | ❌       | Optional, max 100 chars | "\*First-time students only"                                      | None                |
| `cta`   | Object | ✅       | LinkItem                | {"label": "Purchase >", "href": "/#schedule", "ariaLabel": "..."} | None                |

**Inconsistency Found:**

- **`introPackage.name` contains newline character**: "Intro Special\n3-Session Pack"
- Decision: Remove newline, use single line for Contentful simplicity
- **Fix:** "Intro Special — 3-Session Pack" or "Intro Special 3-Session Pack"

**Decision:**

- Normalize package names to single-line format
- Set array constraints: `standardPackages` min 1, max 10 items

---

## Summary of Inconsistencies & Actions

### Critical (Must Fix Before Contentful)

1. ❌ **siteConfig.metadataTitle too long** (62 chars vs 60 limit)

   - Action: Shorten to "Relish Pilates — Feel-good Pilates" (36 chars)

2. ❌ **footerContactBlock.secondaryLinks reference non-existent pages** (/privacy, /terms)

   - Action: Either create these pages or remove from footer links

3. ❌ **faqPage.items are placeholder content** ("FAQ title", "Paragraph 1 body copy")

   - Action: Gather real FAQ Q&A from stakeholder

4. ❌ **pricingPage.introPackage.name contains newline**
   - Action: Normalize to "Intro Special 3-Session Pack"

### Medium (Document for Phase 2)

1. ⚠️ **No image URLs** — only alt text provided

   - Decision: Phase A uses URLs as strings; plan Asset migration for Phase 2

2. ⚠️ **No LinkItem.ariaLabel** on navigationMenu links
   - Decision: Add for accessibility in Phase 2 content creation

### Low (Document for Future)

- Consider extracting repeated CTA labels ("Book a session", "Purchase >") as reusable content blocks
- Consider extracting common link destinations as named references (e.g., "schedule-anchor" → "#schedule")

---

## Next Steps (Phase 0.3 & 0.4)

1. ✅ **Validate fixes above with stakeholder** (Lenny)
2. ✅ **Decide on image strategy**: Contentful Assets or URL strings?
3. ✅ **Create Contentful content type definitions** based on this matrix
4. ✅ **Add field-level validations** to Contentful UI
5. ✅ **Prepare migration script** to transform current db.json to Contentful import format

---

## Data Type Mappings (db.json → Contentful)

| JS Type          | Contentful Type   | Notes                      |
| ---------------- | ----------------- | -------------------------- |
| `string`         | Text (Short Text) | Use for most fields        |
| `string[]`       | Text (Short Text) | Use Array widget           |
| `object`         | Object            | Use Object/JSON type       |
| `LinkItem`       | Object            | {label, href, ariaLabel?}  |
| `StepItem`       | Object            | {number, title, bullets[]} |
| `PricingPackage` | Object            | {name, price, note?, cta}  |

---

## Migration Validation Checklist

Before Phase 1 (Contentful setup), verify:

- [ ] Fix siteConfig.metadataTitle length
- [ ] Resolve footer secondary links (/privacy, /terms)
- [ ] Gather real FAQ content
- [ ] Normalize pricingPage package names
- [ ] Test db.json via `yarn mock-server` on port 3001
- [ ] All app pages render from mock server
- [ ] No console errors in local-api mode
- [ ] Field mapping matrix approved by stakeholder
