import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { supportMessages, users } from "@/db/schema";
import { Empty, PageHero } from "@/components/PageHero";
import { Avatar } from "@/components/Shell";
import { timeAgo } from "@/lib/utils";

export default async function AdminSupport() {
  const convs = await db.select({ userId: supportMessages.userId, fullName: users.fullName, avatarUrl: users.avatarUrl, last: sql<Date>`max(${supportMessages.createdAt})`, n: sql<number>`count(*)` })
    .from(supportMessages).innerJoin(users, eq(supportMessages.userId, users.id)).groupBy(supportMessages.userId, users.fullName, users.avatarUrl).orderBy(desc(sql`max(${supportMessages.createdAt})`));
  return (
    <div>
      <PageHero title="Atendimento" lead="Conversas de suporte abertas pelos alunos." />
      {convs.length === 0 ? <Empty title="Nenhuma conversa ainda" /> : (
        <ul className="card divide-y divide-border">
          {convs.map((c) => <li key={c.userId}><Link href={`/admin/support/${c.userId}`} className="flex items-center gap-3 px-4 py-3 hover:bg-accent"><Avatar user={c} size={36} /><div className="flex-1"><p className="font-semibold">{c.fullName}</p><p className="text-xs text-muted-foreground">{Number(c.n)} mensagens · última {timeAgo(c.last)}</p></div></Link></li>)}
        </ul>
      )}
    </div>
  );
}
