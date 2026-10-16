import Link from "next/link";
import { desc } from "drizzle-orm";
import { CalendarDays, MessageCircle, Radio } from "lucide-react";
import { db } from "@/db";
import { mentorships } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getSavedSet } from "@/lib/queries";
import { Empty, PageHero, Section } from "@/components/PageHero";
import { SaveButton } from "@/components/SaveButton";
import { fmtDate } from "@/lib/utils";

export const metadata = { title: "Encontros" };

export default async function MentorshipsPage() {
  const user = await requireUser();
  const [all, saved] = await Promise.all([db.select().from(mentorships).orderBy(desc(mentorships.scheduledAt)), getSavedSet(user.id, "mentorship")]);
  const upcoming = all.filter((m) => m.status === "upcoming");
  const recorded = all.filter((m) => m.status === "recorded");
  return (
    <div className="mx-auto max-w-6xl">
      <PageHero title="Encontros ao vivo" lead="Aulões, plantões de dúvidas e simulados comentados para quem se prepara para concursos da saúde." />
      <Section title="Ao vivo">
        {upcoming.length === 0 ? <Empty title="Nenhuma mentoria ao vivo agendada." lead="Quando houver, ela aparece aqui com data e horário." /> : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((m) => (
              <div key={m.id} className="card glow flex flex-col p-5">
                <div className="flex items-start justify-between"><span className="badge border-primary/40 text-primary"><Radio className="h-3 w-3" /> Ao vivo em breve</span><SaveButton kind="mentorship" refId={m.id} saved={saved.has(m.id)} path="/mentorships" small /></div>
                <h3 className="mt-3 font-serif text-xl font-semibold">{m.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{m.description}</p>
                <p className="mt-3 flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4 text-primary" /> {fmtDate(m.scheduledAt)}</p>
              </div>
            ))}
          </div>
        )}
      </Section>
      <Section title="Gravadas">
        {recorded.length === 0 ? <Empty title="Ainda não há mentorias gravadas" lead="As gravações aparecem aqui depois de cada encontro ao vivo." /> : (
          <div className="grid gap-4 md:grid-cols-2">
            {recorded.map((m, i) => (
              <div key={m.id} className="card overflow-hidden">
                <div className="aspect-video bg-black">{m.recordingUrl && <iframe src={m.recordingUrl} title={m.title} className="h-full w-full" allowFullScreen loading="lazy" />}</div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2"><h3 className="font-serif text-lg font-semibold">{m.title}</h3><SaveButton kind="mentorship" refId={m.id} saved={saved.has(m.id)} path="/mentorships" small /></div>
                  <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{i === 0 && <span className="mr-2 badge border-primary/40 text-primary">Mais recente</span>}{fmtDate(m.scheduledAt, false)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
      <div className="card glow flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="max-w-xl">
          <h3 className="font-serif text-xl font-semibold">Quer sugerir uma matéria ou banca?</h3>
          <p className="mt-1 text-sm text-muted-foreground">Conte na comunidade qual assunto você quer ver nos próximos aulões e plantões de dúvidas.</p>
        </div>
        <Link href="/community" className="btn-primary"><MessageCircle className="h-4 w-4" /> Participar da conversa</Link>
      </div>
    </div>
  );
}
