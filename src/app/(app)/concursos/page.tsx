import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { CalendarClock, MapPin, Target, Trash2 } from "lucide-react";
import { db } from "@/db";
import { examTargets } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { createExamTarget, deleteExamTarget } from "@/lib/actions";
import { getCoursesWithProgress } from "@/lib/queries";
import { PROFESSIONS, SPHERES, sphereLabel } from "@/lib/concursos";
import { Empty, PageHero } from "@/components/PageHero";

export const metadata = { title: "Meu concurso" };

export default async function ConcursosPage() {
  const user = await requireUser();
  const [targets, all] = await Promise.all([
    db.select().from(examTargets).where(eq(examTargets.userId, user.id)).orderBy(asc(examTargets.examDate)),
    getCoursesWithProgress(user.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHero title="Meu concurso" lead="Cadastre os concursos que você vai prestar e receba o plano de matérias: comuns, legislação da esfera e específicas do cargo." />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {targets.length === 0 && (
            <Empty title="Nenhum concurso cadastrado" lead="Informe o órgão, a esfera e o cargo ao lado para montar seu plano de estudos." />
          )}
          {targets.map((t) => {
            const plan = all.filter((c) => c.area === "comum" || (c.area === "legislacao" && c.sphere === t.sphere) || (c.area === "especifico" && c.profession === t.profession));
            const total = plan.reduce((a, c) => a + c.total, 0);
            const done = plan.reduce((a, c) => a + c.done, 0);
            const pct = total ? Math.round((done / total) * 100) : 0;
            const days = t.examDate ? Math.ceil((t.examDate.getTime() - Date.now()) / 86400000) : null;
            return (
              <article key={t.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">{sphereLabel(t.sphere)} · {t.profession}</p>
                    <h2 className="mt-1 font-serif text-xl">{t.organ}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {t.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {t.location}</span>}
                      {t.banca && <span>Banca: {t.banca}</span>}
                      {t.examDate && <span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {t.examDate.toLocaleDateString("pt-BR")}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {days !== null && <span className="badge border-primary/40 text-primary">{days > 0 ? `${days} dias` : days === 0 ? "Hoje" : "Prova realizada"}</span>}
                    <form action={deleteExamTarget.bind(null, t.id)}><button className="btn-ghost h-8 px-2 text-destructive" aria-label="Remover concurso"><Trash2 className="h-4 w-4" /></button></form>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
                  <span className="text-xs text-muted-foreground">{done}/{total} tópicos · {pct}%</span>
                </div>
                <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
                  {plan.map((c) => (
                    <li key={c.id}>
                      <Link href={`/courses/${c.slug}`} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-accent">
                        <span className="min-w-0 truncate">{c.title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{c.done}/{c.total}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
          <p className="text-xs leading-relaxed text-muted-foreground">O plano é uma sugestão baseada em esfera e cargo. Compare sempre com o conteúdo programático do edital oficial.</p>
        </div>

        <form action={createExamTarget} className="card h-fit space-y-3 p-5">
          <p className="flex items-center gap-2 font-serif text-lg"><Target className="h-5 w-5 text-primary" /> Novo concurso</p>
          <div><label className="label">Órgão / instituição</label><input name="organ" required placeholder="Ex.: Prefeitura de Campinas" className="input" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Esfera</label><select name="sphere" className="input">{SPHERES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}</select></div>
            <div><label className="label">UF / cidade</label><input name="location" placeholder="SP" className="input" /></div>
          </div>
          <div><label className="label">Cargo / profissão</label><select name="profession" defaultValue={user.profession ?? PROFESSIONS[1]} className="input">{PROFESSIONS.map((p) => <option key={p}>{p}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="label">Banca</label><input name="banca" placeholder="Opcional" className="input" /></div>
            <div><label className="label">Data da prova</label><input name="examDate" type="date" className="input" /></div>
          </div>
          <button className="btn-primary w-full">Montar meu plano</button>
        </form>
      </div>
    </div>
  );
}
