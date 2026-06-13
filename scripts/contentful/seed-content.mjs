import process from "node:process";
import { request as httpsRequest } from "node:https";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnvFromFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) {
    return;
  }

  const raw = readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['\"]|['\"]$/g, "");
    }
  }
}

function asLink(entryId) {
  return {
    sys: {
      type: "Link",
      linkType: "Entry",
      id: entryId,
    },
  };
}

function cmaRequest(baseUrl, token, path, { method, headers, body, throwOn404 = true }) {
  const url = `${baseUrl}${path}`;

  return new Promise((resolvePromise, rejectPromise) => {
    const req = httpsRequest(
      url,
      {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/vnd.contentful.management.v1+json",
          ...headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        res.on("end", () => {
          const statusCode = res.statusCode ?? 500;
          const text = Buffer.concat(chunks).toString("utf8");

          if (statusCode === 404 && !throwOn404) {
            rejectPromise({ statusCode, body: text });
            return;
          }

          if (statusCode < 200 || statusCode >= 300) {
            rejectPromise(new Error(`CMA request failed ${statusCode} for ${path}: ${text}`));
            return;
          }

          try {
            resolvePromise(text ? JSON.parse(text) : {});
          } catch (parseError) {
            rejectPromise(parseError);
          }
        });
      }
    );

    req.on("error", rejectPromise);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

function toLocalizedFields(valueByField, locale) {
  const fields = {};
  for (const [fieldId, value] of Object.entries(valueByField)) {
    if (value === undefined) {
      continue;
    }
    fields[fieldId] = {
      [locale]: value,
    };
  }
  return fields;
}

async function getExistingEntry(baseUrl, token, entryId) {
  try {
    return await cmaRequest(baseUrl, token, `/entries/${entryId}`, {
      method: "GET",
      headers: {},
      throwOn404: false,
    });
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

async function upsertAndPublishEntry(baseUrl, token, locale, contentTypeId, entryId, fieldValues) {
  const existing = await getExistingEntry(baseUrl, token, entryId);

  const upserted = await cmaRequest(baseUrl, token, `/entries/${entryId}`, {
    method: "PUT",
    headers: {
      "X-Contentful-Content-Type": contentTypeId,
      ...(existing ? { "X-Contentful-Version": String(existing.sys.version) } : {}),
    },
    body: JSON.stringify({
      fields: toLocalizedFields(fieldValues, locale),
    }),
  });

  const published = await cmaRequest(baseUrl, token, `/entries/${entryId}/published`, {
    method: "PUT",
    headers: {
      "X-Contentful-Version": String(upserted.sys.version),
    },
  });

  return {
    contentTypeId,
    entryId,
    action: existing ? "updated" : "created",
    version: published.sys.version,
  };
}

function loadSourceContent() {
  const dbPath = resolve(process.cwd(), "db.json");
  const raw = readFileSync(dbPath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  loadDotEnvFromFile(".env.local");

  const requiredEnv = ["CONTENTFUL_SPACE_ID", "CONTENTFUL_ENVIRONMENT", "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN"];
  for (const key of requiredEnv) {
    if (!process.env[key] || process.env[key].trim() === "") {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  const spaceId = process.env.CONTENTFUL_SPACE_ID.replaceAll('"', "");
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT.replaceAll('"', "");
  const token = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN.replaceAll('"', "");
  const locale = "en-US";
  const baseUrl = `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}`;
  const source = loadSourceContent();

  const results = [];

  const upsert = async (contentTypeId, entryId, fields) => {
    const result = await upsertAndPublishEntry(baseUrl, token, locale, contentTypeId, entryId, fields);
    results.push(result);
    console.log(`${result.action.toUpperCase()}: ${result.contentTypeId}/${result.entryId} (v${result.version})`);
  };

  for (const [index, link] of source.navigationMenu.links.entries()) {
    await upsert("linkItem", `nav-link-${index + 1}`, {
      label: link.label,
      href: link.href,
      ariaLabel: link.ariaLabel,
    });
  }
  await upsert("linkItem", "nav-cta", {
    label: source.navigationMenu.cta.label,
    href: source.navigationMenu.cta.href,
    ariaLabel: source.navigationMenu.cta.ariaLabel,
  });

  await upsert("footerFormFields", "footer-form-fields-default", {
    nameLabel: source.footerContactBlock.fields.nameLabel,
    namePlaceholder: source.footerContactBlock.fields.namePlaceholder,
    emailLabel: source.footerContactBlock.fields.emailLabel,
    emailPlaceholder: source.footerContactBlock.fields.emailPlaceholder,
    messageLabel: source.footerContactBlock.fields.messageLabel,
    messagePlaceholder: source.footerContactBlock.fields.messagePlaceholder,
    submitLabel: source.footerContactBlock.fields.submitLabel,
  });

  for (const [index, link] of source.footerContactBlock.primaryLinks.entries()) {
    await upsert("linkItem", `footer-primary-link-${index + 1}`, {
      label: link.label,
      href: link.href,
      ariaLabel: link.ariaLabel,
    });
  }

  for (const [index, link] of source.footerContactBlock.secondaryLinks.entries()) {
    await upsert("linkItem", `footer-secondary-link-${index + 1}`, {
      label: link.label,
      href: link.href,
      ariaLabel: link.ariaLabel,
    });
  }

  for (const [index, link] of source.footerContactBlock.socialLinks.entries()) {
    await upsert("linkItem", `footer-social-link-${index + 1}`, {
      label: link.label,
      href: link.href,
      ariaLabel: link.ariaLabel,
    });
  }

  await upsert("linkItem", "home-hero-cta", {
    label: source.homePage.hero.cta.label,
    href: source.homePage.hero.cta.href,
    ariaLabel: source.homePage.hero.cta.ariaLabel,
  });

  await upsert("heroBlock", "home-hero-default", {
    heading: source.homePage.hero.heading,
    paragraphs: source.homePage.hero.paragraphs,
    ctaRef: asLink("home-hero-cta"),
    welcomeAlt: source.homePage.hero.images.welcomeAlt,
    mermaidAlt: source.homePage.hero.images.mermaidAlt,
    legPullBackAlt: source.homePage.hero.images.legPullBackAlt,
  });

  await upsert("aboutBlock", "home-about-default", {
    heading: source.homePage.about.heading,
    paragraphs: source.homePage.about.paragraphs,
  });

  await upsert("linkItem", "home-steps-cta", {
    label: source.homePage.steps.cta.label,
    href: source.homePage.steps.cta.href,
    ariaLabel: source.homePage.steps.cta.ariaLabel,
  });

  for (const [index, item] of source.homePage.steps.items.entries()) {
    await upsert("stepItem", `home-step-item-${index + 1}`, {
      number: item.number,
      title: item.title,
      bullets: item.bullets,
    });
  }

  await upsert("stepsBlock", "home-steps-default", {
    eyebrow: source.homePage.steps.eyebrow,
    heading: source.homePage.steps.heading,
    ctaRef: asLink("home-steps-cta"),
    itemRefs: source.homePage.steps.items.map((_item, index) => asLink(`home-step-item-${index + 1}`)),
  });

  for (const [index, item] of source.faqPage.items.entries()) {
    await upsert("faqItem", `faq-item-${index + 1}`, {
      title: item.title,
      body: item.body,
    });
  }

  await upsert("linkItem", "pricing-faq-link", {
    label: source.pricingPage.faqLink.label,
    href: source.pricingPage.faqLink.href,
    ariaLabel: source.pricingPage.faqLink.ariaLabel,
  });

  await upsert("linkItem", "pricing-intro-cta", {
    label: source.pricingPage.introPackage.cta.label,
    href: source.pricingPage.introPackage.cta.href,
    ariaLabel: source.pricingPage.introPackage.cta.ariaLabel,
  });

  await upsert("pricingPackage", "pricing-intro-package", {
    name: source.pricingPage.introPackage.name,
    price: source.pricingPage.introPackage.price,
    note: source.pricingPage.introPackage.note,
    ctaRef: asLink("pricing-intro-cta"),
  });

  for (const [index, item] of source.pricingPage.standardPackages.entries()) {
    await upsert("linkItem", `pricing-standard-cta-${index + 1}`, {
      label: item.cta.label,
      href: item.cta.href,
      ariaLabel: item.cta.ariaLabel,
    });

    await upsert("pricingPackage", `pricing-standard-package-${index + 1}`, {
      name: item.name,
      price: item.price,
      note: item.note,
      ctaRef: asLink(`pricing-standard-cta-${index + 1}`),
    });
  }

  await upsert("siteConfig", "site-config-default", source.siteConfig);

  await upsert("navigationMenu", "navigation-menu-default", {
    title: "Primary Navigation",
    links: [{}],
    cta: {},
    linksRefs: source.navigationMenu.links.map((_link, index) => asLink(`nav-link-${index + 1}`)),
    ctaRef: asLink("nav-cta"),
  });

  await upsert("footerContactBlock", "footer-contact-default", {
    heading: source.footerContactBlock.heading,
    formAriaLabel: source.footerContactBlock.formAriaLabel,
    fields: {},
    primaryLinks: [{}],
    secondaryLinks: [{}],
    locationHeading: source.footerContactBlock.locationHeading,
    locationBody: source.footerContactBlock.locationBody,
    socialLinks: [{}],
    fieldsRef: asLink("footer-form-fields-default"),
    primaryLinksRefs: source.footerContactBlock.primaryLinks.map((_link, index) =>
      asLink(`footer-primary-link-${index + 1}`)
    ),
    secondaryLinksRefs: source.footerContactBlock.secondaryLinks.map((_link, index) =>
      asLink(`footer-secondary-link-${index + 1}`)
    ),
    socialLinksRefs: source.footerContactBlock.socialLinks.map((_link, index) =>
      asLink(`footer-social-link-${index + 1}`)
    ),
  });

  await upsert("homePage", "home-page-default", {
    internalName: "Default Home Page",
    metadataTitle: source.homePage.metadataTitle,
    metadataDescription: source.homePage.metadataDescription,
    hero: {},
    about: {},
    steps: {},
    heroRef: asLink("home-hero-default"),
    aboutRef: asLink("home-about-default"),
    stepsRef: asLink("home-steps-default"),
  });

  await upsert("faqPage", "faq-page-default", {
    metadataTitle: source.faqPage.metadataTitle,
    metadataDescription: source.faqPage.metadataDescription,
    heading: source.faqPage.heading,
    items: [{}],
    itemRefs: source.faqPage.items.map((_item, index) => asLink(`faq-item-${index + 1}`)),
  });

  await upsert("pricingPage", "pricing-page-default", {
    metadataTitle: source.pricingPage.metadataTitle,
    metadataDescription: source.pricingPage.metadataDescription,
    heading: source.pricingPage.heading,
    packagesHeading: source.pricingPage.packagesHeading,
    highlights: source.pricingPage.highlights,
    notes: source.pricingPage.notes,
    faqLink: {},
    introPackage: {},
    standardPackages: [{}],
    faqLinkRef: asLink("pricing-faq-link"),
    introPackageRef: asLink("pricing-intro-package"),
    standardPackageRefs: source.pricingPage.standardPackages.map((_item, index) =>
      asLink(`pricing-standard-package-${index + 1}`)
    ),
  });

  console.log("DONE: Seeded entries:");
  for (const result of results) {
    console.log(`- ${result.contentTypeId}/${result.entryId}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
