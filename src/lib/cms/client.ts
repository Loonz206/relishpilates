import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { defaultContent } from "@/lib/cms/default-content";
import type { ContentContract } from "@/lib/cms/types";

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

function getContentfulConfig(preview: boolean) {
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

async function fetchContentfulResource<K extends ContentResource>(
  resource: K,
  preview: boolean
): Promise<ContentContract[K]> {
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
  };

  const fields = payload.items?.[0]?.fields;

  if (!fields) {
    throw new Error(`No Contentful entry found for ${resource}`);
  }

  return unwrapLocalizedField(fields) as ContentContract[K];
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
