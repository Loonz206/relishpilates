import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to enable preview mode
 * Usage: /api/preview?secret=YOUR_SECRET&redirect=/path
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const redirectPath = request.nextUrl.searchParams.get("redirect") || "/";

  // Verify the secret
  if (secret !== process.env.CMS_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Enable draft mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the specified path
  return NextResponse.redirect(new URL(redirectPath, request.url));
}

/**
 * API route to disable preview mode
 * Usage: /api/preview/exit (POST)
 */
export async function POST() {
  const draft = await draftMode();
  draft.disable();

  return NextResponse.json({ message: "Draft mode disabled" });
}
