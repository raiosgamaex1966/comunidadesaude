import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { CalendarDays, Radio, Trash2, Webcam } from "lucide-react";
import { db } from "@/db";
import { calls, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { createCall, deleteCall, setCallStatus } from "@/lib/actions";
import { Empty, PageHero, Section } from "@/components/PageHero";
import { fmtDate } from "@/lib/utils";
import { CopyLink } from "./CopyLink";

export const metadata = { title: "Chamadas" };

export default async function CallsPage() {
  const user = await requireUser();
  const all = await db.select({ id: calls.id, code: calls.code, title: calls.title, status: calls.status, scheduledAt: calls.scheduledAt, guestsAllowed: calls.guestsAllowed, hostId: calls.hostId, host: users.fullName }).from(calls).innerJoin(users, eq(calls.hostId, users.id)).orderBy(desc(calls.createdAt));
  const live = all.filter((c) => c.status === "live");
  const upcoming = all.filter((c) => c.status === "scheduled");
  const ended = all.filter((c) => c.status === "ended");
  const canManage = (c: { hostId: number }) => c.hostId === user.id || user.role === "admin";

  const Card = ({ c }: { c: (typeof all)[number] }) => (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className={`badge ${c.status === "live" ? "border-primary/40 text-primary" : ""}`}>{c.status === "live" ? <><Radio className="h-3 w-3" /> Ao vivo agora</> : c.status === "ended" ? "Encerrada" : c.guestsAllowed ? "Aberta a convidados" : "Só membros"}</span>
          <h3 className="mt-2 font-serif text-lg font-semibold">{c.title}</h3>
          <p className="text-xs text-muted-foreground">Anfitrião: {c.host} · <CalendarDays className="inline h-3 w-3" /> {c.scheduledAt ? fmtDate(c.scheduledAt) : "Sem data marcada"}</p>
        </div>
        {canManage(c) && <form action={deleteCall.bind(null, c.id)}><button className="btn-ghost h-8 px-2 text-destructive" aria-label="Excluir"><Trash2 className="h-4 w-4" /></button></form>}
      </div>
      <div className="flex flex-wrap gap-2">
        {c.status !== "ended" && <Link href={`/chamadas/${c.code}`} className="btn-primary h-9">{c.status === "live" ? "Entrar" : "Abrir sala de espera"}</Link>}
        <CopyLink code={c.code} />
        {canManage(c) && c.status === "scheduled" && <form action={setCallStatus.bind(null, c.code, "live")}><button className="btn-outline h-9">Iniciar agora</button></form>}
        {canManage(c) && c.status === "live" && <form action={setCallStatus.bind(null, c.code, "ended")}><button className="btn-outline h-9">Encerrar</button></form>}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl">
      <PageHero title="Salas ao vivo" lead="Grupos de estudo e plantões com câmera, microfone e compartilhamento de tela." />
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {live.length > 0 && <Section title="Ao vivo agora"><div className="grid gap-4 md:grid-cols-2">{live.map((c) => <Card key={c.id} c={c} />)}</div></Section>}
          <Section title="Próximas">
            {upcoming.length === 0 && live.length === 0 ? <Empty title="Nenhuma chamada por agora" lead={user.role === "admin" ? "Crie a primeira: comece agora ou agende e envie o link aos membros." : "Quando houver uma chamada ao vivo, ela aparece aqui e você recebe um aviso."} /> : <div className="grid gap-4 md:grid-cols-2">{upcoming.map((c) => <Card key={c.id} c={c} />)}</div>}
          </Section>
          {ended.length > 0 && <Section title="Anteriores"><div className="grid gap-4 md:grid-cols-2">{ended.map((c) => <Card key={c.id} c={c} />)}</div></Section>}
        </div>
        <form action={createCall} className="card h-fit space-y-3 p-5">
          <p className="flex items-center gap-2 font-serif text-lg font-semibold"><Webcam className="h-5 w-5 text-primary" /> Nova chamada</p>
          <div><label className="label">Título</label><input name="title" required placeholder="Ex.: Plantão de dúvidas de SUS" className="input" /></div>
          <div><label className="label">Data e hora</label><input name="scheduledAt" type="datetime-local" className="input" /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="guests" className="accent-[var(--primary)]" /> Aberta a convidados (quem não é membro)</label>
          <div className="flex gap-2">
            <button className="btn-outline flex-1">Agendar</button>
            <button name="now" value="1" className="btn-primary flex-1">Começar agora</button>
          </div>
        </form>
      </div>
    </div>
  );
}
