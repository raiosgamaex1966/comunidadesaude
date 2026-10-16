import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc, eq, and, gt } from "drizzle-orm";
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, CheckCircle2, Circle, Download, ExternalLink, Lock, PlayCircle, Trophy } from "lucide-react";
import { db } from "@/db";
import { courses, lessonComments, users, savedItems } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getCourseDetail } from "@/lib/queries";
import { getHealthcareGuide } from "@/lib/healthcare-guides";
import { addLessonComment, enrollAction, toggleLessonComplete, toggleSaved } from "@/lib/actions";
import { Avatar } from "@/components/Shell";
import { cn, timeAgo } from "@/lib/utils";
import { DownloadButton } from "./DownloadButton";

export default async function CoursePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ aula?: string }> }) {
  const user = await requireUser();
  const { slug } = await params;
  const { aula } = await searchParams;
  const data = await getCourseDetail(slug, user.id);
  if (!data) notFound();
  const { course, modules, enrolled, total, done } = data;
  const guide = getHealthcareGuide(course.area);
  const flat = modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleTitle: m.title })));
  const current = flat.find((l) => l.slug === aula) ?? flat.find((l) => !l.completed) ?? flat[0];
  const idx = current ? flat.findIndex((l) => l.id === current.id) : -1;
  const next = idx >= 0 ? flat[idx + 1] : undefined;
  const soon = course.status === "coming_soon";
  const pct = total ? Math.round((done / total) * 100) : 0;
  const finished = total > 0 && done === total;

  const [comments, nextCourse, saved] = await Promise.all([
    current
      ? db.select({ id: lessonComments.id, content: lessonComments.content, createdAt: lessonComments.createdAt, author: { fullName: users.fullName, avatarUrl: users.avatarUrl } })
          .from(lessonComments).innerJoin(users, eq(lessonComments.userId, users.id)).where(eq(lessonComments.lessonId, current.id)).orderBy(desc(lessonComments.createdAt))
      : Promise.resolve([]),
    course.trailId
      ? db.select({ slug: courses.slug, title: courses.title, status: courses.status }).from(courses).where(and(eq(courses.trailId, course.trailId), gt(courses.position, course.position))).orderBy(asc(courses.position)).limit(1)
      : Promise.resolve([]),
    current ? db.select({ id: savedItems.id }).from(savedItems).where(and(eq(savedItems.userId, user.id), eq(savedItems.kind, "lesson"), eq(savedItems.refId, current.id))) : Promise.resolve([]),
  ]);
  const resources: { label: string; url: string }[] = current?.resources ? JSON.parse(current.resources) : [];

  return (
    <div className="mx-auto max-w-7xl">
      <Link href="/courses" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Cursos</Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <div className={`aspect-video overflow-hidden rounded-2xl border border-border ${current?.videoUrl && !soon ? "bg-black" : "bg-muted"}`}>
            {soon || !current?.videoUrl ? (
              <div className="glow flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-foreground">
                {soon ? <Lock className="h-9 w-9 text-primary" /> : <BookOpen className="h-9 w-9 text-primary" />}
                <p className="font-serif text-xl sm:text-2xl">{soon ? "Conteúdo em preparação" : "Guia de estudo do tópico"}</p>
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">{soon ? "Esta formação está em desenvolvimento. Novos tópicos serão adicionados em breve." : current?.description || "Explore o tema, consulte as referências disponíveis e registre suas reflexões nas anotações."}</p>
                {!soon && <span className="badge mt-1 border-primary/40 text-primary">Leitura orientada · {current?.durationMin ?? 10} min</span>}
              </div>
            ) : (
              <iframe key={current.id} src={current.videoUrl} title={current.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{course.title} {current && `· ${current.moduleTitle}`}</p>
              <h1 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">{current?.title ?? course.title}</h1>
              {current && <p className="mt-1 text-xs text-muted-foreground">Tópico {idx + 1} de {total} · {current.durationMin} min</p>}
            </div>
            {current && !soon && (
              <div className="flex flex-wrap gap-2">
                <form action={toggleSaved.bind(null, "lesson", current.id, `/courses/${slug}`)}>
                  <button className="btn-outline" aria-label={saved.length ? "Remover dos Salvos" : "Salvar"}>
                    <Bookmark className={cn("h-4 w-4", saved.length > 0 && "fill-primary text-primary")} /> {saved.length ? "Salvo" : "Salvar"}
                  </button>
                </form>
                {current.videoUrl && <DownloadButton lessonId={current.id} title={current.title} course={course.title} slug={slug} />}
                {enrolled ? (
                  <form action={toggleLessonComplete.bind(null, current.id, slug)}>
                    <button className={cn(current.completed ? "btn-outline" : "btn-primary")}>
                      <CheckCircle2 className="h-4 w-4" /> {current.completed ? "Tópico concluído" : "Marcar como estudado"}
                    </button>
                  </form>
                ) : (
                  <form action={enrollAction.bind(null, course.id, slug)}>
                    <button className="btn-primary">Matricular</button>
                  </form>
                )}
              </div>
            )}
          </div>

          {finished && (
            <div className="card glow mt-5 flex flex-wrap items-center justify-between gap-4 border-primary/40 p-5">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-serif text-lg font-semibold">Parabéns, você concluiu este curso!</p>
                  <p className="text-sm text-muted-foreground">{nextCourse[0] ? `Próximo curso da trilha: ${nextCourse[0].title}` : "Você concluiu a trilha inteira!"}</p>
                </div>
              </div>
              <Link href={nextCourse[0] ? `/courses/${nextCourse[0].slug}` : "/courses"} className="btn-primary">
                {nextCourse[0] ? "Ir para o próximo curso" : "Ver cursos"} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {next && current?.completed && !finished && (
            <Link href={`/courses/${slug}?aula=${next.slug}`} className="card mt-4 flex items-center justify-between p-4 hover:border-border-strong">
              <div><p className="text-xs text-muted-foreground">Próxima aula</p><p className="font-semibold">{next.title}</p></div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </Link>
          )}

          {guide && !soon && (
            <div className="card mt-6 border-primary/20 bg-accent/40 p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Como estudar esta matéria</p>
              <h2 className="mt-1 font-serif text-xl">{guide.focus}</h2>
              <ul className="mt-4 space-y-2.5">
                {guide.points.map((point) => <li key={point} className="flex gap-2.5 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{point}</li>)}
              </ul>
              <p className="mt-5 rounded-xl border border-border bg-card p-3 text-sm"><strong>Dica de revisão:</strong> {guide.reflection}</p>
            </div>
          )}

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="card p-5">
              <h3 className="mb-2 font-serif text-lg font-semibold">Descrição</h3>
              <p className="text-sm text-muted-foreground">{current?.description ?? course.description ?? "Sem descrição para esta aula."}</p>
            </div>
            <div className="card p-5">
              <h3 className="mb-2 font-serif text-lg font-semibold">Recursos</h3>
              {!enrolled ? (
                <p className="text-sm text-muted-foreground">Matricule-se para acessar os materiais.</p>
              ) : resources.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem recursos nesta aula.</p>
              ) : (
                <ul className="space-y-2">
                  {resources.map((r, i) => (
                    <li key={i}><a href={r.url} className="flex items-center gap-2 text-sm text-primary hover:underline"><ExternalLink className="h-4 w-4" /> {r.label}</a></li>
                  ))}
                  <li><Link href={`/anotacoes?curso=${course.id}`} className="flex items-center gap-2 text-sm text-primary hover:underline"><Download className="h-4 w-4" /> Abrir anotações deste curso</Link></li>
                </ul>
              )}
            </div>
          </div>

          <div className="card mt-6 p-5">
            <h3 className="mb-3 font-serif text-lg font-semibold">Comentários</h3>
            {!enrolled ? (
              <p className="text-sm text-muted-foreground">Matricule-se para participar da discussão.</p>
            ) : current ? (
              <form action={addLessonComment} className="flex gap-2">
                <input type="hidden" name="lessonId" value={current.id} />
                <input type="hidden" name="slug" value={slug} />
                <input name="content" placeholder="Deixe uma dúvida ou comentário…" className="input" required />
                <button className="btn-primary shrink-0">Enviar</button>
              </form>
            ) : null}
            <ul className="mt-4 space-y-4">
              {comments.map((c) => (
                <li key={c.id} className="flex gap-3">
                  <Avatar user={c.author} size={32} />
                  <div>
                    <p className="text-sm font-semibold">{c.author.fullName} <span className="font-normal text-muted-foreground">· {timeAgo(c.createdAt)}</span></p>
                    <p className="text-sm">{c.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="card h-fit lg:sticky lg:top-20">
          <div className="border-b border-border p-4">
            <p className="font-serif text-lg font-semibold">Tópicos da matéria</p>
            {soon ? (
              <p className="mt-1 text-xs text-muted-foreground">Este curso está marcado como <b>Em breve</b>.</p>
            ) : enrolled ? (
              <>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
                <p className="mt-1 text-xs text-muted-foreground">{done} de {total} concluídas · {pct}%</p>
              </>
            ) : (
              <form action={enrollAction.bind(null, course.id, slug)} className="mt-2">
                <p className="mb-2 text-xs text-muted-foreground">Matricule-se para acompanhar progresso.</p>
                <button className="btn-primary w-full">Matricular</button>
              </form>
            )}
          </div>
          <div className="scrollbar-thin max-h-[60vh] overflow-y-auto p-2">
            {modules.length === 0 && <p className="p-3 text-sm text-muted-foreground">Nenhuma aula ainda.</p>}
            {modules.map((m) => (
              <div key={m.id} className="mb-2">
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{m.title}</p>
                {m.lessons.map((l) => {
                  const active = current?.id === l.id;
                  return (
                    <Link key={l.id} href={`/courses/${slug}?aula=${l.slug}`} className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition", active ? "bg-primary/12 text-primary" : "hover:bg-accent")}>
                      {l.completed ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> : active ? <PlayCircle className="h-4 w-4 shrink-0" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}
                      <span className="flex-1 truncate">{l.title}</span>
                      <span className="text-[11px] text-muted-foreground">{l.durationMin}m</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
