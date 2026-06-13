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

loadDotEnvFromFile(".env.local");

const requiredEnv = [
  "CONTENTFUL_SPACE_ID",
  "CONTENTFUL_ENVIRONMENT",
  "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN",
];

for (const key of requiredEnv) {
  if (!process.env[key] || process.env[key].trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID.replaceAll('"', "");
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT.replaceAll('"', "");
const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN.replaceAll('"', "");
const BASE_URL = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

function symbolField(id, name, required, validations = []) {
  return {
    id,
    name,
    type: "Symbol",
    localized: false,
    required,
    validations,
    disabled: false,
    omitted: false,
  };
}

function textField(id, name, required, validations = []) {
  return {
    id,
    name,
    type: "Text",
    localized: false,
    required,
    validations,
    disabled: false,
    omitted: false,
  };
}

function objectField(id, name, required) {
  return {
    id,
    name,
    type: "Object",
    localized: false,
    required,
    validations: [],
    disabled: false,
    omitted: false,
  };
}

function arrayOfSymbolsField(id, name, required, min, max) {
  return {
    id,
    name,
    type: "Array",
    localized: false,
    required,
    items: {
      type: "Symbol",
      validations: [],
    },
    validations: [{ size: { min, max } }],
    disabled: false,
    omitted: false,
  };
}

function arrayOfObjectsField(id, name, required, min, max) {
  return {
    id,
    name,
    type: "Array",
    localized: false,
    required,
    items: {
      type: "Object",
      validations: [],
    },
    validations: [{ size: { min, max } }],
    disabled: false,
    omitted: false,
  };
}

function entryLinkField(id, name, required, linkContentType) {
  return {
    id,
    name,
    type: "Link",
    localized: false,
    required,
    validations: linkContentType
      ? [
          {
            linkContentType: [linkContentType],
          },
        ]
      : [],
    disabled: false,
    omitted: false,
    linkType: "Entry",
  };
}

function arrayOfEntryLinksField(id, name, required, min, max, linkContentType) {
  return {
    id,
    name,
    type: "Array",
    localized: false,
    required,
    items: {
      type: "Link",
      validations: linkContentType
        ? [
            {
              linkContentType: [linkContentType],
            },
          ]
        : [],
      linkType: "Entry",
    },
    validations: [{ size: { min, max } }],
    disabled: false,
    omitted: false,
  };
}

const contentTypes = [
  {
    id: "linkItem",
    name: "Link Item",
    displayField: "label",
    fields: [
      symbolField("label", "Label", true, [{ size: { max: 120 } }]),
      symbolField("href", "Href", true, [{ size: { max: 255 } }]),
      symbolField("ariaLabel", "Aria Label", false, [{ size: { max: 140 } }]),
    ],
  },
  {
    id: "footerFormFields",
    name: "Footer Form Fields",
    displayField: "nameLabel",
    fields: [
      symbolField("nameLabel", "Name Label", true, [{ size: { max: 100 } }]),
      symbolField("namePlaceholder", "Name Placeholder", true, [{ size: { max: 140 } }]),
      symbolField("emailLabel", "Email Label", true, [{ size: { max: 100 } }]),
      symbolField("emailPlaceholder", "Email Placeholder", true, [{ size: { max: 140 } }]),
      symbolField("messageLabel", "Message Label", true, [{ size: { max: 140 } }]),
      textField("messagePlaceholder", "Message Placeholder", true, [{ size: { max: 255 } }]),
      symbolField("submitLabel", "Submit Label", true, [{ size: { max: 100 } }]),
    ],
  },
  {
    id: "stepItem",
    name: "Step Item",
    displayField: "title",
    fields: [
      symbolField("number", "Number", true, [{ size: { max: 12 } }]),
      symbolField("title", "Title", true, [{ size: { max: 140 } }]),
      arrayOfSymbolsField("bullets", "Bullets", true, 1, 8),
    ],
  },
  {
    id: "heroBlock",
    name: "Hero Block",
    displayField: "heading",
    fields: [
      symbolField("heading", "Heading", true, [{ size: { max: 160 } }]),
      arrayOfSymbolsField("paragraphs", "Paragraphs", true, 1, 6),
      entryLinkField("ctaRef", "CTA", true, "linkItem"),
      symbolField("welcomeAlt", "Welcome Image Alt", true, [{ size: { max: 160 } }]),
      symbolField("mermaidAlt", "Mermaid Image Alt", true, [{ size: { max: 160 } }]),
      symbolField("legPullBackAlt", "Leg Pull Back Image Alt", true, [{ size: { max: 160 } }]),
    ],
  },
  {
    id: "aboutBlock",
    name: "About Block",
    displayField: "heading",
    fields: [
      symbolField("heading", "Heading", true, [{ size: { max: 160 } }]),
      arrayOfSymbolsField("paragraphs", "Paragraphs", true, 1, 8),
    ],
  },
  {
    id: "stepsBlock",
    name: "Steps Block",
    displayField: "heading",
    fields: [
      symbolField("eyebrow", "Eyebrow", true, [{ size: { max: 80 } }]),
      symbolField("heading", "Heading", true, [{ size: { max: 120 } }]),
      entryLinkField("ctaRef", "CTA", true, "linkItem"),
      arrayOfEntryLinksField("itemRefs", "Step Items", true, 1, 10, "stepItem"),
    ],
  },
  {
    id: "faqItem",
    name: "FAQ Item",
    displayField: "title",
    fields: [
      symbolField("title", "Title", true, [{ size: { max: 160 } }]),
      textField("body", "Body", true, [{ size: { max: 5000 } }]),
    ],
  },
  {
    id: "pricingPackage",
    name: "Pricing Package",
    displayField: "name",
    fields: [
      symbolField("name", "Name", true, [{ size: { max: 140 } }]),
      symbolField("price", "Price", true, [{ size: { max: 100 } }]),
      symbolField("note", "Note", false, [{ size: { max: 140 } }]),
      entryLinkField("ctaRef", "CTA", true, "linkItem"),
    ],
  },
  {
    id: "siteConfig",
    name: "Site Config",
    displayField: "brandName",
    fields: [
      symbolField("brandName", "Brand Name", true, [{ size: { max: 255 } }]),
      symbolField("brandHandle", "Brand Handle", true, [
        { size: { max: 50 } },
        { regexp: { pattern: "^[A-Za-z0-9]+$" } },
      ]),
      symbolField("metadataTitle", "Metadata Title", true, [{ size: { max: 60 } }]),
      textField("metadataDescription", "Metadata Description", true, [{ size: { max: 160 } }]),
    ],
  },
  {
    id: "navigationMenu",
    name: "Navigation Menu",
    displayField: "title",
    fields: [
      symbolField("title", "Title", true, [{ size: { max: 80 } }]),
      arrayOfObjectsField("links", "Links", true, 1, 10),
      objectField("cta", "CTA", true),
      arrayOfEntryLinksField("linksRefs", "Links References", true, 1, 10, "linkItem"),
      entryLinkField("ctaRef", "CTA Reference", true, "linkItem"),
    ],
  },
  {
    id: "footerContactBlock",
    name: "Footer Contact Block",
    displayField: "heading",
    fields: [
      symbolField("heading", "Heading", true, [{ size: { max: 100 } }]),
      symbolField("formAriaLabel", "Form Aria Label", true, [{ size: { max: 100 } }]),
      objectField("fields", "Fields", true),
      arrayOfObjectsField("primaryLinks", "Primary Links", true, 1, 10),
      arrayOfObjectsField("secondaryLinks", "Secondary Links", true, 1, 10),
      symbolField("locationHeading", "Location Heading", true, [{ size: { max: 100 } }]),
      symbolField("locationBody", "Location Body", true, [{ size: { max: 255 } }]),
      arrayOfObjectsField("socialLinks", "Social Links", true, 1, 5),
      entryLinkField("fieldsRef", "Fields Reference", true, "footerFormFields"),
      arrayOfEntryLinksField("primaryLinksRefs", "Primary Links References", true, 1, 10, "linkItem"),
      arrayOfEntryLinksField(
        "secondaryLinksRefs",
        "Secondary Links References",
        true,
        1,
        10,
        "linkItem"
      ),
      arrayOfEntryLinksField("socialLinksRefs", "Social Links References", true, 1, 5, "linkItem"),
    ],
  },
  {
    id: "homePage",
    name: "Home Page",
    displayField: "internalName",
    fields: [
      symbolField("internalName", "Internal Name", true, [{ size: { max: 80 } }]),
      symbolField("metadataTitle", "Metadata Title", true, [{ size: { max: 60 } }]),
      textField("metadataDescription", "Metadata Description", true, [{ size: { max: 160 } }]),
      objectField("hero", "Hero", true),
      objectField("about", "About", true),
      objectField("steps", "Steps", true),
      entryLinkField("heroRef", "Hero Reference", true, "heroBlock"),
      entryLinkField("aboutRef", "About Reference", true, "aboutBlock"),
      entryLinkField("stepsRef", "Steps Reference", true, "stepsBlock"),
    ],
  },
  {
    id: "faqPage",
    name: "FAQ Page",
    displayField: "heading",
    fields: [
      symbolField("metadataTitle", "Metadata Title", true, [{ size: { max: 60 } }]),
      textField("metadataDescription", "Metadata Description", true, [{ size: { max: 160 } }]),
      symbolField("heading", "Heading", true, [{ size: { max: 100 } }]),
      arrayOfObjectsField("items", "Items", true, 1, 50),
      arrayOfEntryLinksField("itemRefs", "Item References", true, 1, 50, "faqItem"),
    ],
  },
  {
    id: "pricingPage",
    name: "Pricing Page",
    displayField: "heading",
    fields: [
      symbolField("metadataTitle", "Metadata Title", true, [{ size: { max: 60 } }]),
      textField("metadataDescription", "Metadata Description", true, [{ size: { max: 160 } }]),
      symbolField("heading", "Heading", true, [{ size: { max: 100 } }]),
      symbolField("packagesHeading", "Packages Heading", true, [{ size: { max: 100 } }]),
      arrayOfSymbolsField("highlights", "Highlights", true, 1, 10),
      arrayOfSymbolsField("notes", "Notes", true, 1, 5),
      objectField("faqLink", "FAQ Link", true),
      objectField("introPackage", "Intro Package", true),
      arrayOfObjectsField("standardPackages", "Standard Packages", true, 1, 10),
      entryLinkField("faqLinkRef", "FAQ Link Reference", true, "linkItem"),
      entryLinkField("introPackageRef", "Intro Package Reference", true, "pricingPackage"),
      arrayOfEntryLinksField(
        "standardPackageRefs",
        "Standard Package References",
        true,
        1,
        10,
        "pricingPackage"
      ),
    ],
  },
];

async function cmaFetch(path, options = {}) {
  return cmaRequest(path, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/vnd.contentful.management.v1+json",
      ...(options.headers ?? {}),
    },
    body: options.body,
    throwOn404: false,
  });
}

async function getCurrentContentType(id) {
  try {
    return await cmaRequest(`/content_types/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/vnd.contentful.management.v1+json",
      },
      throwOn404: false,
    });
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

function cmaRequest(path, { method, headers, body, throwOn404 = true }) {
  const url = `${BASE_URL}${path}`;

  return new Promise((resolve, reject) => {
    const req = httpsRequest(
      url,
      {
        method,
        headers: {
          Authorization: `Bearer ${CMA_TOKEN}`,
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
            reject({ statusCode, body: text });
            return;
          }

          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`CMA request failed ${statusCode} for ${path}: ${text}`));
            return;
          }

          try {
            resolve(text ? JSON.parse(text) : {});
          } catch (parseError) {
            reject(parseError);
          }
        });
      }
    );

    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function upsertContentType(definition) {
  const existing = await getCurrentContentType(definition.id);
  const headers = existing ? { "X-Contentful-Version": String(existing.sys.version) } : {};

  const upserted = await cmaFetch(`/content_types/${definition.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      name: definition.name,
      displayField: definition.displayField,
      fields: definition.fields,
      description: `Provisioned by script for ${definition.id}`,
    }),
  });

  const published = await cmaFetch(`/content_types/${definition.id}/published`, {
    method: "PUT",
    headers: {
      "X-Contentful-Version": String(upserted.sys.version),
    },
  });

  return {
    id: definition.id,
    name: definition.name,
    version: published.sys.version,
    action: existing ? "updated" : "created",
  };
}

async function main() {
  const results = [];

  for (const contentType of contentTypes) {
    const result = await upsertContentType(contentType);
    results.push(result);
    console.log(`${result.action.toUpperCase()}: ${result.id} (v${result.version})`);
  }

  console.log("DONE: Provisioned content types:");
  for (const result of results) {
    console.log(`- ${result.id}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
