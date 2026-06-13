# Phase 1: Contentful Content Models Schema

## Overview

This document defines the content types, field configurations, validations, and editor workflows needed in Contentful to mirror the current `db.json` contract.

**Target Contentful Space:** Create via Contentful UI or SDK before implementation
**Locale:** `en-US` (single locale)
**Delivery:** Content Delivery API (read-only) + Preview API (draft content)

---

## 1. Content Type: `siteConfig`

**Purpose:** Global site branding and metadata (single entry per workspace)
**Content Type ID:** `siteConfig`
**Editor Widget:** Single-entry widget
**Display Name:** "Site Config"

### Fields

| Field Name           | ID                    | Type       | Required | Validation        | Editor Help Text                                                 |
| -------------------- | --------------------- | ---------- | -------- | ----------------- | ---------------------------------------------------------------- |
| Brand Name           | `brandName`           | Short Text | ✅       | Max 255           | "e.g., 'Relish Pilates'"                                         |
| Brand Handle         | `brandHandle`         | Short Text | ✅       | Max 50, no spaces | "Used in navigation logo. Keep under 20 chars for mobile fit."   |
| Metadata Title       | `metadataTitle`       | Short Text | ✅       | Max 60            | "Google search title. Keep under 60 chars. Current: 62 chars ⚠️" |
| Metadata Description | `metadataDescription` | Long Text  | ✅       | Max 160           | "Google search snippet. Aim for 150-160 chars."                  |

### Contentful Configuration

```json
{
  "sys": {
    "type": "ContentType"
  },
  "displayField": "brandName",
  "name": "Site Config",
  "fields": [
    {
      "id": "brandName",
      "name": "Brand Name",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [{ "size": { "max": 255 } }],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "brandHandle",
      "name": "Brand Handle",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [{ "size": { "max": 50 } }, { "regexp": { "pattern": "^[A-Za-z0-9]+$" } }],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "metadataTitle",
      "name": "Metadata Title",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [{ "size": { "max": 60 } }],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "metadataDescription",
      "name": "Metadata Description",
      "type": "Text",
      "localized": false,
      "required": true,
      "validations": [{ "size": { "max": 160 } }],
      "disabled": false,
      "omitted": false
    }
  ]
}
```

---

## 2. Content Type: `navigationMenu`

**Purpose:** Main site navigation and CTA button
**Content Type ID:** `navigationMenu`
**Editor Widget:** Single-entry widget
**Display Name:** "Navigation Menu"

### Fields

| Field Name | ID      | Type             | Required | Validation      | Notes                                |
| ---------- | ------- | ---------------- | -------- | --------------- | ------------------------------------ |
| Links      | `links` | Array of Objects | ✅       | Min 1, Max 10   | Each LinkItem must have label + href |
| CTA Button | `cta`   | Object           | ✅       | LinkItem object | Single main CTA for desktop header   |

### LinkItem Object Structure

```json
{
  "label": { "type": "Symbol", "required": true, "validations": [{ "size": { "max": 50 } }] },
  "href": {
    "type": "Symbol",
    "required": true,
    "validations": [{ "regexp": { "pattern": "^(#|/)[A-Za-z0-9/#-]*$" } }]
  },
  "ariaLabel": { "type": "Symbol", "required": false, "validations": [{ "size": { "max": 100 } }] }
}
```

### Current Navigation Structure

```
Navigation Links:
1. Schedule (#schedule)
2. Pricing (/pricing)
3. Videos (#videos)
4. About (#about)
5. FAQ (/faq)

CTA: Book a Session (/#schedule)
```

---

## 3. Content Type: `footerContactBlock`

**Purpose:** Contact form and footer navigation
**Content Type ID:** `footerContactBlock`
**Editor Widget:** Single-entry widget
**Display Name:** "Footer Contact Block"

### Fields

| Field Name       | ID                | Type             | Required | Validation    | Notes                                            |
| ---------------- | ----------------- | ---------------- | -------- | ------------- | ------------------------------------------------ |
| Heading          | `heading`         | Short Text       | ✅       | Max 100       | "e.g., 'Got questions?'"                         |
| Form Aria Label  | `formAriaLabel`   | Short Text       | ✅       | Max 100       | Accessibility label for form                     |
| Form Fields      | `fields`          | Object           | ✅       | Nested object | Contains 7 form field labels/placeholders        |
| Primary Links    | `primaryLinks`    | Array of Objects | ✅       | Min 1, Max 10 | "Call-to-action links in footer"                 |
| Secondary Links  | `secondaryLinks`  | Array of Objects | ✅       | Min 1, Max 10 | "Info links (privacy, terms, etc.)"              |
| Location Heading | `locationHeading` | Short Text       | ✅       | Max 100       | "e.g., 'Locations'"                              |
| Location Body    | `locationBody`    | Short Text       | ✅       | Max 255       | "e.g., 'Streaming from beautiful Bremerton, WA'" |
| Social Links     | `socialLinks`     | Array of Objects | ✅       | Min 1, Max 5  | Each must have label, href, ariaLabel            |

### Form Fields Object

```json
{
  "nameLabel": { "type": "Symbol", "required": true },
  "namePlaceholder": { "type": "Symbol", "required": true },
  "emailLabel": { "type": "Symbol", "required": true },
  "emailPlaceholder": { "type": "Symbol", "required": true },
  "messageLabel": { "type": "Symbol", "required": true },
  "messagePlaceholder": { "type": "Symbol", "required": true },
  "submitLabel": { "type": "Symbol", "required": true }
}
```

### ⚠️ Known Issues

- **Secondary links reference non-existent pages**: `/privacy`, `/terms`
- **Decision:** Need to either (a) create these pages, or (b) remove these links
- **Action Required:** Clarify with stakeholder

---

## 4. Content Type: `homePage`

**Purpose:** Homepage content (hero, about, steps sections)
**Content Type ID:** `homePage`
**Editor Widget:** Single-entry widget
**Display Name:** "Home Page"

### Top-level Fields

| Field Name           | ID                    | Type       | Required | Validation          | Notes                                     |
| -------------------- | --------------------- | ---------- | -------- | ------------------- | ----------------------------------------- |
| Metadata Title       | `metadataTitle`       | Short Text | ✅       | Max 60              | SEO: Google search title                  |
| Metadata Description | `metadataDescription` | Long Text  | ✅       | Max 160             | SEO: Google search snippet                |
| Hero Section         | `hero`                | Object     | ✅       | Nested HeroSection  | Contains heading, paragraphs, CTA, images |
| About Section        | `about`               | Object     | ✅       | Nested AboutSection | Contains heading, paragraphs              |
| Steps Section        | `steps`               | Object     | ✅       | Nested StepsSection | Contains eyebrow, heading, items, CTA     |

### HeroSection Object

```json
{
  "heading": { "type": "Symbol", "required": true, "validations": [{ "size": { "max": 100 } }] },
  "paragraphs": {
    "type": "Array",
    "items": { "type": "Symbol" },
    "required": true,
    "validations": [{ "size": { "min": 1, "max": 5 } }]
  },
  "cta": { "type": "Object", "required": true }, // LinkItem
  "images": {
    "type": "Object",
    "required": true,
    "properties": {
      "welcomeAlt": {
        "type": "Symbol",
        "required": true,
        "validations": [{ "size": { "max": 255 } }]
      },
      "mermaidAlt": {
        "type": "Symbol",
        "required": true,
        "validations": [{ "size": { "max": 255 } }]
      },
      "legPullBackAlt": {
        "type": "Symbol",
        "required": true,
        "validations": [{ "size": { "max": 255 } }]
      }
    }
  }
}
```

### AboutSection Object

```json
{
  "heading": { "type": "Symbol", "required": true, "validations": [{ "size": { "max": 100 } }] },
  "paragraphs": {
    "type": "Array",
    "items": { "type": "Symbol" },
    "required": true,
    "validations": [{ "size": { "min": 1, "max": 5 } }]
  }
}
```

### StepsSection Object

```json
{
  "eyebrow": { "type": "Symbol", "required": true, "validations": [{ "size": { "max": 50 } }] },
  "heading": { "type": "Symbol", "required": true, "validations": [{ "size": { "max": 100 } }] },
  "cta": { "type": "Object", "required": true }, // LinkItem
  "items": {
    "type": "Array",
    "items": { "type": "Object" }, // StepItem
    "required": true,
    "validations": [{ "size": { "min": 1, "max": 10 } }]
  }
}
```

### StepItem Object

```json
{
  "number": {
    "type": "Symbol",
    "required": true,
    "validations": [{ "regexp": { "pattern": "^[1-9]$" } }]
  },
  "title": { "type": "Symbol", "required": true, "validations": [{ "size": { "max": 100 } }] },
  "bullets": {
    "type": "Array",
    "items": { "type": "Symbol" },
    "required": true,
    "validations": [{ "size": { "min": 1, "max": 10 } }]
  }
}
```

---

## 5. Content Type: `faqPage`

**Purpose:** FAQ page content
**Content Type ID:** `faqPage`
**Editor Widget:** Single-entry widget
**Display Name:** "FAQ Page"

### Fields

| Field Name           | ID                    | Type             | Required | Validation    | Notes                      |
| -------------------- | --------------------- | ---------------- | -------- | ------------- | -------------------------- |
| Metadata Title       | `metadataTitle`       | Short Text       | ✅       | Max 60        | SEO title                  |
| Metadata Description | `metadataDescription` | Long Text        | ✅       | Max 160       | SEO snippet                |
| Heading              | `heading`             | Short Text       | ✅       | Max 100       | Page title                 |
| FAQ Items            | `items`               | Array of Objects | ✅       | Min 1, Max 50 | Each item has title + body |

### FaqItem Object

```json
{
  "title": { "type": "Symbol", "required": true, "validations": [{ "size": { "max": 100 } }] },
  "body": { "type": "Text", "required": true, "validations": [{ "size": { "max": 1000 } }] }
}
```

### ⚠️ Known Issues

- **Current FAQ items are placeholder content**: "FAQ title", "Paragraph 1 body copy"
- **Action Required:** Gather real FAQ Q&A from stakeholder before Phase 2

---

## 6. Content Type: `pricingPage`

**Purpose:** Pricing page content (packages and highlights)
**Content Type ID:** `pricingPage`
**Editor Widget:** Single-entry widget
**Display Name:** "Pricing Page"

### Fields

| Field Name           | ID                    | Type             | Required | Validation      | Notes                                    |
| -------------------- | --------------------- | ---------------- | -------- | --------------- | ---------------------------------------- |
| Metadata Title       | `metadataTitle`       | Short Text       | ✅       | Max 60          | SEO title                                |
| Metadata Description | `metadataDescription` | Long Text        | ✅       | Max 160         | SEO snippet                              |
| Page Heading         | `heading`             | Short Text       | ✅       | Max 100         | "e.g., 'Pricing options'"                |
| Packages Heading     | `packagesHeading`     | Short Text       | ✅       | Max 100         | "e.g., 'Packages'"                       |
| Highlights           | `highlights`          | Array of Strings | ✅       | Min 1, Max 10   | Bullet points of benefits                |
| Notes                | `notes`               | Array of Strings | ✅       | Min 1, Max 5    | Terms/conditions (expiration, tax, etc.) |
| FAQ Link             | `faqLink`             | Object           | ✅       | LinkItem object | Link to FAQ page                         |
| Intro Package        | `introPackage`        | Object           | ✅       | PricingPackage  | First-time offer                         |
| Standard Packages    | `standardPackages`    | Array of Objects | ✅       | Min 1, Max 10   | Regular pricing tiers                    |

### PricingPackage Object

```json
{
  "name": { "type": "Symbol", "required": true, "validations": [{ "size": { "max": 100 } }] },
  "price": { "type": "Symbol", "required": true, "validations": [{ "size": { "max": 100 } }] },
  "note": { "type": "Symbol", "required": false, "validations": [{ "size": { "max": 100 } }] },
  "cta": { "type": "Object", "required": true } // LinkItem
}
```

### ⚠️ Known Issues

- **Intro package name contains newline**: "Intro Special\n3-Session Pack"
- **Fix:** Normalize to "Intro Special 3-Session Pack" (single line)

---

## 7. Content Type: `simplePage` (Phase 2 Future)

**Purpose:** Editor-managed simple pages (e.g., /about, /privacy, /terms)
**Content Type ID:** `simplePage`
**Editor Widget:** Multi-entry widget with slug routing
**Display Name:** "Simple Page"

### Fields

| Field Name           | ID                    | Type       | Required | Validation     | Notes                                    |
| -------------------- | --------------------- | ---------- | -------- | -------------- | ---------------------------------------- |
| Slug                 | `slug`                | Short Text | ✅       | Unique, max 50 | URL path (e.g., "about", "privacy")      |
| Metadata Title       | `metadataTitle`       | Short Text | ✅       | Max 60         | SEO title                                |
| Metadata Description | `metadataDescription` | Long Text  | ✅       | Max 160        | SEO snippet                              |
| Heading              | `heading`             | Short Text | ✅       | Max 100        | Page H1                                  |
| Body                 | `body`                | Rich Text  | ✅       | Max 10000      | Main page content (Contentful rich text) |

### Phase 2 Consideration

- Implement `/api/[slug]/page.tsx` route handler
- Query simplePage entries by slug
- Support Markdown or Contentful Rich Text format

---

## Contentful API Configuration

### Delivery Access Token (Production Read-only)

- Name: `relish-pilates-delivery`
- Permissions: Read-only access to published entries & assets
- Used in production (`CMS_PROVIDER=contentful-delivery`)

### Preview Access Token (Draft Content)

- Name: `relish-pilates-preview`
- Permissions: Read access to draft & published entries
- Used for preview mode (`CMS_PROVIDER=contentful-preview`)

### Webhook Configuration

- **Endpoint:** `https://yourdomain.com/api/revalidate`
- **Secret:** `CMS_REVALIDATE_SECRET` (from environment)
- **Triggers:** `ENTRY_PUBLISH`, `ENTRY_UPDATE`
- **Payload:** Include `sys.id` and `fields` for revalidation

---

## Localization Strategy

**Current Phase:** Single locale (`en-US`)

**Field-level Localization:** Disabled for Phase 1

**Contentful Configuration:**

- Locale: `en-US` (required)
- No additional locales

**Future (Phase 3+):** Add locales as needed

---

## Content Modeling Decisions

### 1. Single-Entry vs Multi-Entry Content Types

| Content Type         | Strategy     | Reason                              |
| -------------------- | ------------ | ----------------------------------- |
| `siteConfig`         | Single-entry | Global config, 1 instance           |
| `navigationMenu`     | Single-entry | One nav per site                    |
| `footerContactBlock` | Single-entry | One footer per site                 |
| `homePage`           | Single-entry | One home page                       |
| `faqPage`            | Single-entry | One FAQ page                        |
| `pricingPage`        | Single-entry | One pricing page                    |
| `simplePage`         | Multi-entry  | Many pages (/about, /privacy, etc.) |

### 2. Nested Objects vs Linked Entries

**Decision:** Use nested objects (not linked entries) for:

- `navigationMenu.links[]` (array of objects)
- `homePage.hero`, `homePage.about`, `homePage.steps` (nested sections)
- `pricingPage.introPackage`, `pricingPage.standardPackages[]`

**Reason:** Simpler API responses, no extra HTTP requests, matches current `db.json` structure

### 3. Rich Text Support

**Phase 1:** Text fields only (no rich text)

**Phase 2+:** Consider rich text for:

- `homePage.hero.paragraphs` (support formatting)
- `simplePage.body` (required for user-created pages)

---

## Validation Rules Summary

| Content Type                   | Validation                       | Impact                |
| ------------------------------ | -------------------------------- | --------------------- |
| `siteConfig.metadataTitle`     | Max 60 chars                     | SEO compliance        |
| `navigationMenu.links`         | Min 1, Max 10 items              | Navigation limits     |
| `pricingPage.standardPackages` | Min 1, Max 10 items              | Pricing flexibility   |
| `homePage.hero.paragraphs`     | Min 1, Max 5 items               | UI layout constraints |
| All `*` fields with `href`     | Regex: `^(#\|/)[A-Za-z0-9/#-]*$` | Valid URL validation  |
| `simplePage.slug`              | Unique, alphanumeric + hyphens   | URL-safe routing      |

---

## Migration Path

1. **Phase 0 (Current):** Validate `db.json` contract ✅
2. **Phase 1:** Create content types in Contentful UI
3. **Phase 2:** Implement Contentful SDK in `client.ts`
4. **Phase 3:** Migrate content from `db.json` to Contentful
5. **Phase 4:** Test & validate end-to-end
6. **Phase 5:** Deploy to production

---

## Next Steps

1. Create content types in Contentful dashboard using configurations above
2. Test publishing entries via Contentful UI
3. Verify delivery API responses match expected schema
4. Implement Phase 1 enhancements to `client.ts`
