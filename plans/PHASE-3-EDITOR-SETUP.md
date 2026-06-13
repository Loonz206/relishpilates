# Phase 3: Contentful Editor Experience Setup

**Status:** Ready to implement
**Target Audience:** Non-technical content editors, marketing team
**Outcome:** Empower stakeholders to manage site content independently via Contentful UI

---

## Overview

Phase 3 focuses on preparing Contentful for non-technical editors. This includes:

1. **Field Descriptions** — Guidance for each field in the Contentful editor UI
2. **Editor Access Control** — Roles and permissions for team members
3. **Content Workflows** — Step-by-step guides for common editorial tasks
4. **Editor Training** — Onboarding materials and training sessions

---

## Step 1: Add Field Descriptions to Contentful

Field descriptions appear in the Contentful editor UI, guiding editors on what content to enter and any formatting requirements.

### 1.1 Access Contentful Content Model Editor

1. Log into [Contentful Dashboard](https://app.contentful.com)
2. Navigate to **Content model** (left sidebar)
3. Select a content type (e.g., `homePage`)
4. Click **Add field description** or edit existing field

### 1.2 Content Type Field Descriptions

#### **siteConfig**

Single instance containing site-wide metadata.

| Field                 | Type       | Description                                                           |
| --------------------- | ---------- | --------------------------------------------------------------------- |
| `brandName`           | Short Text | **Display name:** e.g., "Relish Pilates"                              |
| `brandHandle`         | Short Text | **Social handle:** e.g., "@relishpilates" (no @)                      |
| `metadataTitle`       | Short Text | **SEO title** (55-60 chars) Appears in browser tab and search results |
| `metadataDescription` | Long Text  | **SEO description** (155-160 chars) Summary for search engines        |
| `supportEmail`        | Short Text | **Contact email** for support inquiries                               |

#### **navigationMenu**

Single instance containing header navigation links.

| Field       | Type              | Description                                             |
| ----------- | ----------------- | ------------------------------------------------------- |
| `linksRefs` | Reference (Array) | **Menu items:** Link to `link` entries (order matters)  |
| `ctaRef`    | Reference         | **Call-to-action button:** Link to primary button entry |

#### **footerContactBlock**

Single instance containing footer contact & social links.

| Field                | Type              | Description                                               |
| -------------------- | ----------------- | --------------------------------------------------------- |
| `primaryLinksRefs`   | Reference (Array) | **Footer links (left column):** Link to `link` entries    |
| `secondaryLinksRefs` | Reference (Array) | **Footer links (right column):** Link to `link` entries   |
| `socialLinksRefs`    | Reference (Array) | **Social media links:** Link to `link` entries with icons |

#### **homePage**

Single instance containing homepage hero, features, and CTA sections.

| Field      | Type      | Description                                              |
| ---------- | --------- | -------------------------------------------------------- |
| `heroRef`  | Reference | **Hero section:** Link to `heroSection` entry            |
| `aboutRef` | Reference | **About section:** Link to `aboutSection` entry          |
| `stepsRef` | Reference | **Steps/features section:** Link to `stepsSection` entry |

#### **faqPage**

FAQ page content with list of questions and answers.

| Field      | Type              | Description                                            |
| ---------- | ----------------- | ------------------------------------------------------ |
| `heading`  | Short Text        | **Page heading:** e.g., "Frequently Asked Questions"   |
| `itemRefs` | Reference (Array) | **FAQ items:** Link to `faqItem` entries (reorderable) |

#### **pricingPage**

Single instance containing pricing tiers and packages.

| Field                 | Type              | Description                                                        |
| --------------------- | ----------------- | ------------------------------------------------------------------ |
| `heading`             | Short Text        | **Page heading:** e.g., "Simple Pricing"                           |
| `introPackageRef`     | Reference         | **Intro offer:** Link to `pricingPackage` entry (featured)         |
| `standardPackageRefs` | Reference (Array) | **Standard tiers:** Link to `pricingPackage` entries (reorderable) |

#### **faqItem** (Child Entry)

Individual FAQ question + answer pair.

| Field   | Type       | Description                                            |
| ------- | ---------- | ------------------------------------------------------ |
| `title` | Short Text | **Question:** e.g., "What is Pilates?" (max 100 chars) |
| `body`  | Long Text  | **Answer:** Detailed explanation (max 500 chars)       |

#### **pricingPackage** (Child Entry)

Individual pricing tier with name, price, and CTA.

| Field   | Type       | Description                                                       |
| ------- | ---------- | ----------------------------------------------------------------- |
| `name`  | Short Text | **Package name:** e.g., "10-Session Pack" (max 50 chars)          |
| `price` | Short Text | **Price display:** e.g., "$250 total" or "$30/month"              |
| `cta`   | Object     | **Button details:** JSON object with `label`, `href`, `ariaLabel` |

#### **link** (Child Entry)

Reusable link component for menus and CTAs.

| Field       | Type       | Description                                                      |
| ----------- | ---------- | ---------------------------------------------------------------- |
| `label`     | Short Text | **Link text:** e.g., "Book a Session" (max 50 chars)             |
| `href`      | Short Text | **URL or anchor:** e.g., "/#schedule" or "/faq"                  |
| `ariaLabel` | Short Text | **Accessibility label:** Descriptive label for screen readers    |
| `target`    | Short Text | **Link target:** "\_blank" for external links, omit for internal |

### 1.3 Add Field Validations

For each field, set character limits and validation rules:

1. Click field → **Appearance tab**
2. Set **Character limit** (e.g., 60 chars for titles)
3. Set **Required** toggle if field must be populated
4. Add **Help text** with examples

**Example Validation:**

- `metadataTitle`: 55-60 chars (required)
- `metadataDescription`: 155-160 chars (required)
- `faqItem.title`: max 100 chars (required)
- `link.label`: max 50 chars (required)

---

## Step 2: Create Editor Roles & Access Control

### 2.1 Editor Role Setup

Create two roles in Contentful: **Editor** and **Admin**

#### **Editor Role** (Content contributors)

- ✅ **Can:** Create, edit, publish entries
- ✅ **Can:** Preview draft content
- ❌ **Cannot:** Delete entries (prevents accidents)
- ❌ **Cannot:** Modify content model
- ❌ **Cannot:** Manage users/roles
- ❌ **Cannot:** View API tokens

**Permissions:**

1. Log into Contentful → **Settings** → **Roles**
2. Click **Create role**
3. Name: `Editor`
4. Grant permissions:
   - ✅ `Allow reading of entries`
   - ✅ `Allow creating entries of any content type`
   - ✅ `Allow editing entries of any content type`
   - ✅ `Allow publishing entries`
   - ✅ `Allow reading assets`
   - ✅ `Allow seeing content in preview`
   - ❌ Delete entries (leave unchecked)
   - ❌ Content model editing (leave unchecked)

#### **Admin Role** (Developers/tech leads)

- ✅ **All permissions** (unrestricted)

**Setup:**

1. Use Contentful's built-in **"Administrator"** role
2. Only assign to 1-2 trusted team members
3. Rotate CMA (Management API) tokens annually

### 2.2 Invite Team Members

1. **Settings** → **Members**
2. Click **Invite member**
3. Enter email address
4. Select role: **Editor** or **Administrator**
5. Send invitation
6. Recipient confirms via email link

**Example Invitations:**

- Marketing Lead → Editor role
- Content Manager → Editor role
- Developer → Administrator role

---

## Step 3: Editor Workflow Guides

### 3.1 Publishing a FAQ Entry

**Scenario:** Editor wants to add a new FAQ to the pricing page.

**Steps:**

1. Open Contentful Dashboard
2. Navigate to **Content** → **faqItem**
3. Click **Create entry**
4. Fill in fields:
   - **title:** "What refund policy do you have?" (max 100 chars)
   - **body:** "We offer full refunds within 7 days of purchase, no questions asked." (max 500 chars)
5. Click **Save draft** (top-right)
6. Click **Publish** button
7. Confirm publication
8. **Site updates automatically within 5 seconds** ✅

**Tips:**

- Save drafts frequently (Ctrl+S)
- Use **Preview** button to see how content appears before publishing
- Avoid special characters in titles (use URL-safe text)

### 3.2 Updating Pricing Tiers

**Scenario:** Editor needs to change pricing for the "10-Session Pack".

**Steps:**

1. Navigate to **Content** → **pricingPackage**
2. Find entry named "10-Session Pack"
3. Click to edit
4. Update **price** field: e.g., "$250 total" → "$280 total"
5. Update **cta.label** if needed: e.g., "Purchase >" → "Buy Now >"
6. Click **Publish**
7. **Site reflects new price within 5 seconds** ✅

**Editing the CTA button:**

- The `cta` field is a **JSON object**
- Do NOT manually edit the JSON
- Contact your developer to modify `cta` structure

### 3.3 Homepage Hero Section Update

**Scenario:** Editor wants to change the homepage hero image or headline.

**Steps:**

1. Navigate to **Content** → **homePage**
2. Click to edit the single `homePage` entry
3. Click the **heroRef** field (linked entry reference)
4. This opens the linked `heroSection` entry
5. Update fields:
   - **Heading:** New hero text
   - **Image:** Upload/change image (see Image Guidelines below)
   - **CTA:** Update button text/link via `ctaRef`
6. Click **Publish**
7. **Homepage updates automatically** ✅

**Image Guidelines:**

- **Format:** JPG or PNG
- **Size:** < 2MB
- **Dimensions:** Landscape preferred (2:1 aspect ratio, e.g., 1200x600px)
- **Quality:** High resolution (72+ DPI)
- **Optimization:** Compress before uploading (use [TinyPNG.com](https://tinypng.com))

### 3.4 Managing Social Links in Footer

**Scenario:** Editor wants to add Instagram link to footer.

**Steps:**

1. Navigate to **Content** → **link** entries
2. Create new entry: "Instagram"
   - **label:** "Instagram"
   - **href:** "https://instagram.com/relishpilates"
   - **target:** "\_blank" (opens in new tab)
   - **ariaLabel:** "Follow us on Instagram"
3. Publish entry
4. Navigate to **footerContactBlock**
5. Add entry to **socialLinksRefs** array
6. Reorder links (drag to position)
7. Publish

**Tips:**

- Use same link label as the platform name
- Always use `_blank` for external links
- Aria labels help screen readers

### 3.5 Previewing Draft Changes Before Publish

**Scenario:** Editor wants to preview changes before making them live.

**Steps:**

1. Edit an entry (e.g., faqItem)
2. Click **Preview** button (top-right)
3. New tab opens showing your draft on the live site
4. Review changes in context
5. If satisfied: return to editor tab and click **Publish**
6. If not satisfied: click **Edit** and revise

**Preview URL:**

```
https://relish-pilates.vercel.app/api/preview?secret=...&redirect=/faq
```

---

## Step 4: Training Materials & Support

### 4.1 Training Session Agenda (60 min)

**Goal:** Empower 1-3 editors to manage all content independently

**Outline:**

1. **Welcome & Overview** (5 min)

   - What is Contentful?
   - Why we're using it (vs. manual code edits)
   - Security & access control

2. **Live Demo: Editing FAQ** (15 min)

   - Log in to Contentful
   - Create new FAQ entry
   - Publish and verify site update
   - Show preview feature

3. **Live Demo: Updating Pricing** (10 min)

   - Edit existing pricing entry
   - Show real-time site update
   - Demonstrate image upload

4. **Live Demo: Hero Section Changes** (10 min)

   - Navigate linked references
   - Update hero image & text
   - Test preview mode

5. **Hands-On Practice** (15 min)

   - Editor creates test FAQ entry (supervised)
   - Editor updates pricing (supervised)
   - Q&A

6. **Troubleshooting & Support** (5 min)
   - Contact info for technical help
   - Where to find documentation
   - What to do if something breaks

### 4.2 Quick Reference Card

**Print this and share with editors:**

```markdown
CONTENTFUL QUICK START

Logging In:

1. Visit app.contentful.com
2. Email: your-email@company.com
3. Click "Sign in"

Creating New Content:

1. Content (left sidebar)
2. Select content type (e.g., "faqItem")
3. Click "Create entry"
4. Fill in fields
5. Click "Publish"

Publishing:
✅ Save draft frequently (Ctrl+S)
✅ Preview before publishing
✅ Publish to go live (5s delay)

Getting Help:
• Technical issues → Slack #tech or email tech@relishpilates.com
• Content guidance → Email editor@relishpilates.com
• Contentful help → Contentful Support: https://support.contentful.com
```

### 4.3 FAQ for Editors

**Q: How long after I publish does the site update?**
A: 5-10 seconds. If it takes longer, refresh your browser.

**Q: Can I delete entries?**
A: No, only your developer can delete entries (prevents accidents). Contact them to remove content.

**Q: What if I accidentally published something wrong?**
A: Don't panic! Unpublish the entry, then re-publish the correct version. Previous versions are saved automatically.

**Q: Can I see who edited what?**
A: Yes! Click **History** tab on any entry to see edit timeline and who made changes.

**Q: What's the difference between "Save draft" and "Publish"?**
A: Draft = not live yet (only you can see in preview). Publish = live on website for everyone.

**Q: Can I schedule future publishes?**
A: Not yet, but we can add this. Contact your developer.

---

## Step 5: Rollout Plan

### Week 1: Setup & Preparation

- [ ] Create Editor and Admin roles in Contentful
- [ ] Add field descriptions to all content types
- [ ] Create this documentation (DONE ✅)
- [ ] Schedule 1-hour training session

### Week 2: Training & Handoff

- [ ] 60-min group training session
- [ ] Supervised practice: 1 FAQ + 1 pricing update per editor
- [ ] Distribute Quick Reference Card
- [ ] Set up communication channel for questions (Slack #contentful-editors)

### Week 3: Monitoring & Support

- [ ] Monitor webhook logs for publishing activity
- [ ] Respond to editor questions
- [ ] Document common issues for future reference
- [ ] Celebrate successful first independent edits! 🎉

### Week 4+: Independence

- [ ] Editors manage FAQ, pricing, homepage independently
- [ ] Developer available for: schema changes, complex edits, troubleshooting
- [ ] Monthly sync call to discuss upcoming content needs

---

## Success Criteria ✅

Phase 3 is complete when:

1. ✅ All field descriptions added to Contentful editor UI
2. ✅ Editor and Admin roles created with proper permissions
3. ✅ Training session completed with all target editors
4. ✅ Each editor has successfully:
   - Created and published a new FAQ entry
   - Updated pricing
   - Previewed draft changes
5. ✅ Quick Reference Card distributed
6. ✅ Support contact info documented
7. ✅ Zero escalations needed for 1 week of independent editing

---

## Ongoing Maintenance

### Monthly Tasks

- [ ] Review Contentful webhook logs (ensure all publishes succeeded)
- [ ] Check for orphaned entries (entries not linked anywhere)
- [ ] Update field descriptions based on editor feedback
- [ ] Rotate CMA (Management API) tokens (every 90 days)
- [ ] Backup Contentful content (optional but recommended)

### Quarterly Tasks

- [ ] Gather editor feedback on workflow
- [ ] Evaluate if new content types needed (e.g., blog posts)
- [ ] Assess localization needs (multi-language support)
- [ ] Plan next phase of enhancements (Phase 4)

---

## Next: Phase 4 (Optional Enhancements)

After Phase 3 is stable, consider:

1. **Localization** — Support Spanish, French content
2. **Image Optimization** — Automatic resizing & compression
3. **Content Versioning** — Approval workflows (editor → admin → publish)
4. **Blog Posts** — New content type for news/articles
5. **A/B Testing** — Multiple hero variations with analytics

---

## Support & Documentation

- **Contentful Official Docs:** https://www.contentful.com/developers/documentation/
- **Contentful Help Desk:** https://support.contentful.com
- **Internal Tech Contact:** [tech@relishpilates.com](mailto:tech@relishpilates.com)
- **Internal Editor Support:** [editor@relishpilates.com](mailto:editor@relishpilates.com)
