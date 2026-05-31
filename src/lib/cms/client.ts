import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { defaultContent } from "@/lib/cms/default-content";
import type { ContentContract } from "@/lib/cms/types";

type ContentResource = keyof ContentContract;

function isLocalApiProvider() {
  const configuredProvider = process.env.CMS_PROVIDER;

  if (configuredProvider) {
    return configuredProvider === "local-api";
  }

  return process.env.NODE_ENV === "development";
}

function getLocalApiBaseUrl() {
  return process.env.CMS_LOCAL_BASE_URL ?? "http://localhost:3001";
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

async function fetchContentResource<K extends ContentResource>(
  resource: K
): Promise<ContentContract[K]> {
  if (!isLocalApiProvider()) {
    return defaultContent[resource];
  }

  try {
    return await requestJson<ContentContract[K]>(`${getLocalApiBaseUrl()}/${resource}`);
  } catch (error) {
    console.warn(`Falling back to embedded content for ${resource}.`, error);
    return defaultContent[resource];
  }
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
