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

function getSecretFromRequest(request: NextRequest) {
  return (
    request.headers.get("x-cms-revalidate-secret") ?? request.nextUrl.searchParams.get("secret")
  );
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

  if (Array.isArray(body.tags)) {
    for (const tag of body.tags) {
      if (typeof tag === "string" && tag.trim().length > 0) {
        candidateTags.add(tag.trim());
      }
    }
  }

  if (candidateTags.size === 0) {
    // Safe fallback for unknown payloads.
    revalidatePath("/");

    return NextResponse.json({
      revalidated: true,
      tags: [],
      fallbackPath: "/",
    });
  }

  for (const tag of candidateTags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({
    revalidated: true,
    tags: Array.from(candidateTags),
  });
}
