import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { calls, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { setCallStatus } from "@/lib/actions";
import { CallRoom } from "./CallRoom";

export default async function CallPage({ params }: { params: Promise<{ code: string }> }) {
  const user = await requireUser();
  const { code } = await params;
  const [c] = await db.select({ id: calls.id, code: calls.code, title: calls.title, status: calls.status, hostId: calls.hostId, host: users.fullName }).from(calls).innerJoin(users, eq(calls.hostId, users.id)).where(eq(calls.code, code));
  if (!c) notFound();
  const canManage = c.hostId === user.id || user.role === "admin";
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/chamadas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Chamadas</Link>
        {canManage && c.status === "scheduled" && <form action={setCallStatus.bind(null, c.code, "live")}><button className="btn-primary h-9">Iniciar chamada</button></form>}
        {canManage && c.status === "live" && <form action={setCallStatus.bind(null, c.code, "ended")}><button className="btn-outline h-9">Encerrar para todos</button></form>}
      </div>
      <h1 className="font-serif text-2xl font-semibold">{c.title}</h1>
      <p className="mb-4 text-sm text-muted-foreground">Anfitrião: {c.host} · {c.status === "live" ? "Ao vivo" : c.status === "ended" ? "Encerrada" : "Sala de espera — aguardando o anfitrião iniciar"}</p>
      <CallRoom status={c.status} name={user.fullName} />
    </div>
  );
}
