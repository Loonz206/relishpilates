import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getContentResourceTag } from "@/lib/cms";

const CONTENT_TYPE_TO_RESOURCE = {
  siteConfig: "siteConfig",
  navigationMenu: "navigationMenu",
  footerContactBlock: "footerContactBlock",
  homePage: "homePage",
  faqPage: "faqPage",
  pricingPage: "pricingPage",
} as const;

type ContentResource = keyof typeof CONTENT_TYPE_TO_RESOURCE;

/**
 * Maps Contentful content type IDs to our internal resource names
 */
function resolveTagFromContentType(contentType: string | undefined) {
  if (!contentType) {
    return null;
  }

  if (contentType in CONTENT_TYPE_TO_RESOURCE) {
    const resource = contentType as ContentResource;
    return getContentResourceTag(CONTENT_TYPE_TO_RESOURCE[resource]);
  }

  return null;
}

/**
 * Extracts the revalidation secret from request headers or query params
 */
function getSecretFromRequest(request: NextRequest) {
  return (
    request.headers.get("x-cms-revalidate-secret") ?? request.nextUrl.searchParams.get("secret")
  );
}

/**
 * Validates Contentful webhook signature (if provided)
 * Note: Contentful signature validation can be added here if needed
 */
function getContentfulWebhookData(body: Record<string, unknown>) {
  // Contentful webhook payload structure
  const entry = body.sys as Record<string, unknown>;
  const fields = body.fields as Record<string, unknown>;

  if (!entry || !fields) {
    return null;
  }

  return {
    id: (entry.id as string) || "",
    contentType: ((entry.contentType as Record<string, unknown>)?.sys as Record<string, unknown>)
      ?.id as string,
    updatedAt: entry.updatedAt as string,
  };
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.CMS_REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json({ error: "Missing CMS_REVALIDATE_SECRET on server" }, { status: 500 });
  }

  const providedSecret = getSecretFromRequest(request);

  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const candidateTags = new Set<string>();

  // Try to extract content type from Contentful webhook payload
  const contentfulData = getContentfulWebhookData(body);
  if (contentfulData?.contentType) {
    const mappedTag = resolveTagFromContentType(contentfulData.contentType);
    if (mappedTag) {
      candidateTags.add(mappedTag);
      console.log(`[Revalidate] Contentful ${contentfulData.contentType} updated`);
    }
  }

  // Also support direct contentType field (legacy/local-api format)
  const contentType =
    typeof body.contentType === "string"
      ? body.contentType
      : typeof body.content_type === "string"
      ? body.content_type
      : undefined;

  const mappedTag = resolveTagFromContentType(contentType);
  if (mappedTag) {
    candidateTags.add(mappedTag);
  }

  // Support explicit tags in payload
  if (Array.isArray(body.tags)) {
    for (const tag of body.tags) {
      if (typeof tag === "string" && tag.trim().length > 0) {
        candidateTags.add(tag.trim());
      }
    }
  }

  if (candidateTags.size === 0) {
    // Safe fallback for unknown payloads.
    console.log("[Revalidate] Unknown payload format, revalidating all pages");
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      tags: [],
      fallbackPath: "/",
    });
  }

  // Revalidate all tags
  for (const tag of candidateTags) {
    revalidateTag(tag, "default");
    console.log(`[Revalidate] Revalidated tag: ${tag}`);
  }

  return NextResponse.json({
    revalidated: true,
    tags: Array.from(candidateTags),
    timestamp: new Date().toISOString(),
  });
}
