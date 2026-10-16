import type { ReactNode } from "react";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { Shell } from "@/components/Shell";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const notifs = await db
    .select({ id: notifications.id, title: notifications.title, body: notifications.body, link: notifications.link, read: notifications.read })
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(15);
  const unread = (
    await db.select({ id: notifications.id }).from(notifications).where(and(eq(notifications.userId, user.id), eq(notifications.read, false)))
  ).length;

  return (
    <Shell user={user} unread={unread} notifs={notifs}>
      {children}
    </Shell>
  );
}
