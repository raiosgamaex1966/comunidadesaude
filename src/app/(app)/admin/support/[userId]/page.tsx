import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { supportMessages, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { sendSupportMessage } from "@/lib/actions";
import { SupportChat } from "@/components/SupportChat";

export default async function AdminConversation({ params }: { params: Promise<{ userId: string }> }) {
  const me = await requireAdmin();
  const userId = Number((await params).userId);
  const [u] = await db.select().from(users).where(eq(users.id, userId));
  if (!u) notFound();
  const msgs = await db.select({ id: supportMessages.id, content: supportMessages.content, createdAt: supportMessages.createdAt, senderId: supportMessages.senderId, sender: users.fullName }).from(supportMessages).innerJoin(users, eq(supportMessages.senderId, users.id)).where(eq(supportMessages.userId, userId)).orderBy(asc(supportMessages.createdAt));
  return (
    <div>
      <Link href="/admin/support" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Atendimento</Link>
      <div className="card overflow-hidden">
        <div className="border-b border-border px-5 py-3"><p className="font-semibold">{u.fullName}</p><p className="text-xs text-muted-foreground">{u.email}{u.whatsapp && ` · ${u.whatsapp}`}</p></div>
        <SupportChat messages={msgs} meId={me.id} action={sendSupportMessage} targetUserId={userId} />
      </div>
    </div>
  );
}
