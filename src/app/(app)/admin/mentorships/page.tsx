import { desc } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { db } from "@/db";
import { mentorships } from "@/db/schema";
import { deleteMentorship, saveMentorship } from "@/lib/admin-actions";
import { PageHero } from "@/components/PageHero";
import { fmtDate } from "@/lib/utils";

const toLocal = (d: Date | null) => (d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "");

export default async function AdminMentorships() {
  const list = await db.select().from(mentorships).orderBy(desc(mentorships.scheduledAt));
  const Form = ({ m }: { m?: (typeof list)[number] }) => (
    <form action={saveMentorship} className="grid gap-2">
      {m && <input type="hidden" name="id" value={m.id} />}
      <input name="title" defaultValue={m?.title} placeholder="Título" className="input h-9" required />
      <textarea name="description" defaultValue={m?.description ?? ""} rows={3} placeholder="Descrição" className="input" />
      <div className="grid grid-cols-2 gap-2">
        <input name="scheduledAt" type="datetime-local" defaultValue={toLocal(m?.scheduledAt ?? null)} className="input h-9" />
        <select name="status" defaultValue={m?.status ?? "upcoming"} className="input h-9"><option value="upcoming">Ao vivo (agendada)</option><option value="recorded">Gravada</option></select>
      </div>
      <input name="recordingUrl" defaultValue={m?.recordingUrl ?? ""} placeholder="URL embed da gravação" className="input h-9" />
      <div className="flex gap-2"><button className="btn-primary h-9">{m ? "Salvar" : "Criar mentoria"}</button>{m && <button formAction={deleteMentorship.bind(null, m.id)} className="btn-ghost h-9 text-destructive"><Trash2 className="h-4 w-4" /></button>}</div>
    </form>
  );
  return (
    <div>
      <PageHero title="Gerir mentorias" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">{list.map((m) => <details key={m.id} className="card p-4"><summary className="cursor-pointer font-semibold">{m.title} <span className="text-xs font-normal text-muted-foreground">· {m.status === "upcoming" ? "Agendada" : "Gravada"} · {fmtDate(m.scheduledAt)}</span></summary><div className="mt-3"><Form m={m} /></div></details>)}</div>
        <div className="card h-fit p-5"><h2 className="mb-3 font-serif text-lg font-semibold">Nova mentoria</h2><Form /></div>
      </div>
    </div>
  );
}
