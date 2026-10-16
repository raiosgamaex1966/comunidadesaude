import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (user) await db.update(notifications).set({ read: true }).where(eq(notifications.userId, user.id));
  const referer = new URL(request.headers.get("referer") ?? request.url);
  return new Response(null, { status: 303, headers: { Location: `${referer.pathname}${referer.search}` } });
}
