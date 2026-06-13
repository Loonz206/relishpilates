import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { defaultContent } from "@/lib/cms/default-content";
import type { ContentContract } from "@/lib/cms/types";

/**
 * Contentful Image URL Helper
 * Transforms Contentful image URLs with optional resizing and quality parameters
 */
export function getContentfulImageUrl(
  url: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  if (!url.startsWith("https://images.ctfassets.net")) {
    return url; // Return non-Contentful URLs unchanged
  }

  const params = new URLSearchParams();
  if (options?.width) params.set("w", String(options.width));
  if (options?.height) params.set("h", String(options.height));
  if (options?.quality) params.set("q", String(options.quality));

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

type ContentResource = keyof ContentContract;
type CmsProvider = "local-api" | "embedded" | "contentful-delivery" | "contentful-preview";

const RESOURCE_TAGS: Record<ContentResource, string> = {
  siteConfig: "cms:site-config",
  navigationMenu: "cms:navigation",
  footerContactBlock: "cms:footer",
  homePage: "cms:home",
  faqPage: "cms:faq",
  pricingPage: "cms:pricing",
};

function getConfiguredProvider(): CmsProvider {
  const configuredProvider = process.env.CMS_PROVIDER;

  if (configuredProvider === "local-api") {
    return "local-api";
  }

  if (configuredProvider === "embedded") {
    return "embedded";
  }

  if (configuredProvider === "contentful-delivery") {
    return "contentful-delivery";
  }

  if (configuredProvider === "contentful-preview") {
    return "contentful-preview";
  }

  return process.env.NODE_ENV === "development" ? "local-api" : "embedded";
}

function getLocalApiBaseUrl() {
  return process.env.CMS_LOCAL_BASE_URL ?? "http://localhost:3001";
}

function isContentfulMockEnabled() {
  return process.env.CONTENTFUL_MOCK_BASE_URL?.trim().length;
}

function getContentfulMockBaseUrl() {
  return process.env.CONTENTFUL_MOCK_BASE_URL ?? "http://localhost:3002";
}

function getContentfulConfig(preview: boolean) {
  if (isContentfulMockEnabled()) {
    return {
      host: "mock.contentful.local",
      spaceId: "mock-space",
      environment: "master",
      token: "mock-token",
    };
  }

  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? "master";
  const deliveryToken = process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN;
  const previewToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

  if (!spaceId) {
    throw new Error("Missing CONTENTFUL_SPACE_ID");
  }

  const token = preview ? previewToken : deliveryToken;

  if (!token) {
    throw new Error(
      preview
        ? "Missing CONTENTFUL_PREVIEW_ACCESS_TOKEN"
        : "Missing CONTENTFUL_DELIVERY_ACCESS_TOKEN"
    );
  }

  return {
    host: preview ? "preview.contentful.com" : "cdn.contentful.com",
    spaceId,
    environment,
    token,
  };
}

function requestJson<T>(url: string): Promise<T> {
  const parsedUrl = new URL(url);
  const transport = parsedUrl.protocol === "https:" ? httpsRequest : httpRequest;

  return new Promise<T>((resolve, reject) => {
    const request = transport(
      parsedUrl,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
      (response) => {
        const chunks: Buffer[] = [];

        response.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });

        response.on("end", () => {
          const statusCode = response.statusCode ?? 500;

          if (statusCode < 200 || statusCode >= 300) {
            reject(new Error(`Failed to fetch ${url}: ${statusCode}`));
            return;
          }

          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")) as T);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.on("error", reject);
    request.end();
  });
}

function unwrapLocalizedField(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(unwrapLocalizedField);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const record = value as Record<string, unknown>;
  const localeKeys = Object.keys(record);

  if (localeKeys.length === 1 && localeKeys[0] === "en-US") {
    return unwrapLocalizedField(record["en-US"]);
  }

  const normalizedEntries = localeKeys.map(
    (key) => [key, unwrapLocalizedField(record[key])] as const
  );
  return Object.fromEntries(normalizedEntries);
}

function isLinkObject(
  value: unknown
): value is { sys: { type: string; linkType: string; id: string } } {
  if (!value || typeof value !== "object") {
    return false;
  }

  const sys = (value as { sys?: { type?: string; linkType?: string; id?: string } }).sys;
  return !!sys && sys.type === "Link" && sys.linkType === "Entry" && typeof sys.id === "string";
}

function resolveEntryLinks(value: unknown, entriesById: Map<string, unknown>): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => resolveEntryLinks(item, entriesById));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (isLinkObject(value)) {
    const linkedEntry = entriesById.get(value.sys.id) as { fields?: unknown } | undefined;
    if (!linkedEntry?.fields) {
      return null;
    }
    return resolveEntryLinks(linkedEntry.fields, entriesById);
  }

  const objectValue = value as Record<string, unknown>;
  const entries = Object.entries(objectValue).map(([key, nestedValue]) => [
    key,
    resolveEntryLinks(nestedValue, entriesById),
  ]);
  return Object.fromEntries(entries);
}

function normalizeContentfulResource<K extends ContentResource>(
  resource: K,
  fields: Record<string, unknown>
): ContentContract[K] {
  const data = fields;
  const asRecord = (value: unknown): Record<string, unknown> =>
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

  if (resource === "navigationMenu") {
    return {
      links: (data.linksRefs ?? data.links) as ContentContract["navigationMenu"]["links"],
      cta: (data.ctaRef ?? data.cta) as ContentContract["navigationMenu"]["cta"],
    } as ContentContract[K];
  }

  if (resource === "footerContactBlock") {
    return {
      heading: data.heading,
      formAriaLabel: data.formAriaLabel,
      fields: (data.fieldsRef ?? data.fields) as ContentContract["footerContactBlock"]["fields"],
      primaryLinks: (data.primaryLinksRefs ??
        data.primaryLinks) as ContentContract["footerContactBlock"]["primaryLinks"],
      secondaryLinks: (data.secondaryLinksRefs ??
        data.secondaryLinks) as ContentContract["footerContactBlock"]["secondaryLinks"],
      locationHeading: data.locationHeading,
      locationBody: data.locationBody,
      socialLinks: (data.socialLinksRefs ??
        data.socialLinks) as ContentContract["footerContactBlock"]["socialLinks"],
    } as ContentContract[K];
  }

  if (resource === "homePage") {
    const heroSource = asRecord(data.heroRef ?? data.hero);
    const aboutSource = asRecord(data.aboutRef ?? data.about);
    const stepsSource = asRecord(data.stepsRef ?? data.steps);
    const stepItems = (stepsSource.itemRefs ??
      stepsSource.items ??
      []) as ContentContract["homePage"]["steps"]["items"];

    return {
      metadataTitle: data.metadataTitle,
      metadataDescription: data.metadataDescription,
      hero: {
        heading: heroSource.heading,
        paragraphs: heroSource.paragraphs,
        cta: (heroSource.ctaRef ?? heroSource.cta) as ContentContract["homePage"]["hero"]["cta"],
        images: heroSource.images ?? {
          welcomeAlt: heroSource.welcomeAlt,
          mermaidAlt: heroSource.mermaidAlt,
          legPullBackAlt: heroSource.legPullBackAlt,
        },
      },
      about: {
        heading: aboutSource.heading,
        paragraphs: aboutSource.paragraphs,
      },
      steps: {
        eyebrow: stepsSource.eyebrow,
        heading: stepsSource.heading,
        cta: (stepsSource.ctaRef ?? stepsSource.cta) as ContentContract["homePage"]["steps"]["cta"],
        items: stepItems,
      },
    } as ContentContract[K];
  }

  if (resource === "faqPage") {
    return {
      metadataTitle: data.metadataTitle,
      metadataDescription: data.metadataDescription,
      heading: data.heading,
      items: (data.itemRefs ?? data.items) as ContentContract["faqPage"]["items"],
    } as ContentContract[K];
  }

  if (resource === "pricingPage") {
    const introSource = asRecord(data.introPackageRef ?? data.introPackage);
    const standardSources = asArray(data.standardPackageRefs ?? data.standardPackages).map(
      asRecord
    );

    return {
      metadataTitle: data.metadataTitle,
      metadataDescription: data.metadataDescription,
      heading: data.heading,
      packagesHeading: data.packagesHeading,
      highlights: data.highlights,
      notes: data.notes,
      faqLink: (data.faqLinkRef ?? data.faqLink) as ContentContract["pricingPage"]["faqLink"],
      introPackage: {
        name: introSource.name,
        price: introSource.price,
        note: introSource.note,
        cta: (introSource.ctaRef ??
          introSource.cta) as ContentContract["pricingPage"]["introPackage"]["cta"],
      },
      standardPackages: standardSources.map((item) => ({
        name: item.name,
        price: item.price,
        note: item.note,
        cta: (item.ctaRef ??
          item.cta) as ContentContract["pricingPage"]["standardPackages"][number]["cta"],
      })),
    } as unknown as ContentContract[K];
  }

  return fields as unknown as ContentContract[K];
}

async function fetchContentfulResource<K extends ContentResource>(
  resource: K,
  preview: boolean
): Promise<ContentContract[K]> {
  if (isContentfulMockEnabled()) {
    const mockUrl = new URL(`${getContentfulMockBaseUrl()}/entries`);
    mockUrl.searchParams.set("content_type", resource);
    mockUrl.searchParams.set("_limit", "1");

    const payload = await requestJson<
      Array<{
        fields?: unknown;
      }>
    >(mockUrl.toString());

    const fields = payload[0]?.fields;

    if (!fields) {
      throw new Error(`No Contentful mock entry found for ${resource}`);
    }

    return unwrapLocalizedField(fields) as ContentContract[K];
  }

  const config = getContentfulConfig(preview);
  const endpoint = new URL(
    `https://${config.host}/spaces/${config.spaceId}/environments/${config.environment}/entries`
  );

  endpoint.searchParams.set("content_type", resource);
  endpoint.searchParams.set("limit", "1");
  endpoint.searchParams.set("include", "10");

  const response = await fetch(endpoint.toString(), {
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
    cache: preview ? "no-store" : "force-cache",
    next: {
      revalidate: preview ? 0 : 300,
      tags: [RESOURCE_TAGS[resource]],
    },
  });

  if (!response.ok) {
    throw new Error(`Failed Contentful request for ${resource}: ${response.status}`);
  }

  const payload = (await response.json()) as {
    items?: Array<{
      fields?: unknown;
    }>;
    includes?: {
      Entry?: Array<{
        sys?: { id?: string };
        fields?: unknown;
      }>;
    };
  };

  const fields = payload.items?.[0]?.fields;

  if (!fields) {
    throw new Error(`No Contentful entry found for ${resource}`);
  }

  const entriesById = new Map<string, unknown>();
  for (const entry of payload.includes?.Entry ?? []) {
    const entryId = entry.sys?.id;
    if (entryId) {
      entriesById.set(entryId, entry);
    }
  }

  const resolved = resolveEntryLinks(fields, entriesById);
  const unwrapped = unwrapLocalizedField(resolved) as Record<string, unknown>;

  return normalizeContentfulResource(resource, unwrapped);
}

async function fetchContentResource<K extends ContentResource>(
  resource: K
): Promise<ContentContract[K]> {
  const provider = getConfiguredProvider();

  try {
    if (provider === "embedded") {
      return defaultContent[resource];
    }

    if (provider === "local-api") {
      return await requestJson<ContentContract[K]>(`${getLocalApiBaseUrl()}/${resource}`);
    }

    if (provider === "contentful-delivery") {
      return await fetchContentfulResource(resource, false);
    }

    return await fetchContentfulResource(resource, true);
  } catch (error) {
    console.warn(`Falling back to embedded content for ${resource}.`, error);
    return defaultContent[resource];
  }
}

export function getContentResourceTag(resource: ContentResource) {
  return RESOURCE_TAGS[resource];
}

export async function getSiteConfig() {
  return fetchContentResource("siteConfig");
}

export async function getNavigationMenu() {
  return fetchContentResource("navigationMenu");
}

export async function getFooterContactBlock() {
  return fetchContentResource("footerContactBlock");
}

export async function getHomePageContent() {
  return fetchContentResource("homePage");
}

export async function getFaqPageContent() {
  return fetchContentResource("faqPage");
}

export async function getPricingPageContent() {
  return fetchContentResource("pricingPage");
}
