import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const downloadUrl =
    process.env.APK_DOWNLOAD_URL ||
    new URL("/downloads/dcsmart.apk", req.url).toString();

  return NextResponse.redirect(downloadUrl, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Disposition": 'attachment; filename="dcsmart.apk"',
    },
  });
}
