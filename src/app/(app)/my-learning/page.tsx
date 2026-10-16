import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { CheckCircle2, Clock, Flame, Trophy } from "lucide-react";
import { db } from "@/db";
import { lessonProgress, lessons, courses } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getCoursesWithProgress } from "@/lib/queries";
import { CourseCard } from "@/components/CourseCard";
import { Empty, PageHero, Section } from "@/components/PageHero";
import { cn, timeAgo } from "@/lib/utils";

export const metadata = { title: "Minha jornada" };

export default async function MyLearningPage() {
  const user = await requireUser();
  const [all, history] = await Promise.all([
    getCoursesWithProgress(user.id),
    db.select({ id: lessonProgress.id, at: lessonProgress.completedAt, durationMin: lessons.durationMin, lesson: lessons.title, slug: lessons.slug, course: courses.title, courseSlug: courses.slug })
      .from(lessonProgress).innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id)).innerJoin(courses, eq(lessonProgress.courseId, courses.id))
      .where(eq(lessonProgress.userId, user.id)).orderBy(desc(lessonProgress.completedAt)),
  ]);
  const published = all.filter((c) => c.status === "published");
  const inProgress = published.filter((c) => c.done > 0 && c.done < c.total);
  const done = published.filter((c) => c.total > 0 && c.done === c.total);
  const notStarted = published.filter((c) => c.done === 0);
  const minutes = history.reduce((a, h) => a + h.durationMin, 0);

  // streak
  const days = new Set(history.map((h) => new Date(h.at).toDateString()));
  let streak = 0;
  for (let d = new Date(); days.has(d.toDateString()); d.setDate(d.getDate() - 1)) streak++;

  // 12-week heatmap
  const weeks = 12;
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - (weeks * 7 - 1) - start.getDay());
  const counts = new Map<string, number>();
  history.forEach((h) => { const k = new Date(h.at).toDateString(); counts.set(k, (counts.get(k) ?? 0) + 1); });
  const cells = Array.from({ length: weeks * 7 + new Date().getDay() + 1 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return { d, n: counts.get(d.toDateString()) ?? 0 }; }).filter((c) => c.d <= new Date());

  return (
    <div className="mx-auto max-w-6xl">
      <PageHero title="Minha jornada" lead="Acompanhe seus tópicos estudados, constância e progresso nas matérias." />
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={<CheckCircle2 />} v={history.length} l="Aulas concluídas" />
        <Stat icon={<Clock />} v={minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`} l="Tempo de estudo" />
        <Stat icon={<Trophy />} v={done.length} l="Cursos concluídos" />
        <Stat icon={<Flame />} v={streak} l={streak ? "Dias seguidos" : "Conclua uma aula hoje"} />
      </div>

      <Section title="Atividade">
        <div className="card p-5">
          <div className="flex flex-wrap gap-1">
            {cells.map((c, i) => (
              <span key={i} title={`${c.d.toLocaleDateString("pt-BR")}: ${c.n} aula(s)`} className={cn("h-3.5 w-3.5 rounded-sm", c.n === 0 ? "bg-muted" : c.n === 1 ? "bg-primary/40" : c.n === 2 ? "bg-primary/70" : "bg-primary")} />
            ))}
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">Menos <span className="h-3 w-3 rounded-sm bg-muted" /><span className="h-3 w-3 rounded-sm bg-primary/40" /><span className="h-3 w-3 rounded-sm bg-primary/70" /><span className="h-3 w-3 rounded-sm bg-primary" /> Mais</p>
          {history.length === 0 && <p className="mt-2 text-sm text-muted-foreground">Nenhuma aula concluída nessas semanas.</p>}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <Section title="Em andamento">
            {inProgress.length === 0 ? <Empty title="Nenhum curso em andamento" lead="Comece por aqui." action={<Link href="/courses" className="btn-primary">Ver todos os cursos</Link>} /> : <div className="grid gap-4 sm:grid-cols-2">{inProgress.map((c) => <CourseCard key={c.id} c={c} />)}</div>}
          </Section>
          {done.length > 0 && <Section title="Concluídos"><div className="grid gap-4 sm:grid-cols-2">{done.map((c) => <CourseCard key={c.id} c={c} />)}</div></Section>}
          {notStarted.length > 0 && <Section title="Ainda não iniciados"><div className="grid gap-4 sm:grid-cols-2">{notStarted.slice(0, 4).map((c) => <CourseCard key={c.id} c={c} />)}</div></Section>}
        </div>
        <Section title="Últimas aulas concluídas">
          <div className="card divide-y divide-border">
            {history.length === 0 && <p className="p-4 text-sm text-muted-foreground">As aulas que você concluir aparecem aqui, da mais recente para a mais antiga.</p>}
            {history.slice(0, 12).map((h) => (
              <Link key={h.id} href={`/courses/${h.courseSlug}?aula=${h.slug}`} className="block px-4 py-3 hover:bg-accent">
                <p className="text-sm font-semibold">{h.lesson}</p>
                <p className="text-xs text-muted-foreground">{h.course} · {timeAgo(h.at)}</p>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Stat({ icon, v, l }: { icon: React.ReactNode; v: number | string; l: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <div><p className="font-serif text-2xl font-semibold leading-none">{v}</p><p className="mt-1 text-xs text-muted-foreground">{l}</p></div>
    </div>
  );
}
