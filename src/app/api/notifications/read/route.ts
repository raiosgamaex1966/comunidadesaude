import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (user) {
    await db.update(notifications).set({ read: true }).where(eq(notifications.userId, user.id));
  }

  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("application/json") || request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ ok: true });
  }

  const referer = new URL(request.headers.get("referer") ?? request.url);
  return new Response(null, { status: 303, headers: { Location: `${referer.pathname}${referer.search}` } });
}
