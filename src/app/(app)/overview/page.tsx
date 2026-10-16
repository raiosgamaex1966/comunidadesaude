import Link from "next/link";
import { desc, eq, gte, and } from "drizzle-orm";
import { ArrowRight, BookOpen, CheckCircle2, Flame, Headphones, Newspaper, PlayCircle, Radio, ShieldCheck, Target, Users, Video } from "lucide-react";
import { db } from "@/db";
import { mentorships, news, podcasts, posts, users, lessonProgress } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getContinueLesson, getCoursesWithProgress, getSettings } from "@/lib/queries";
import { CourseCard } from "@/components/CourseCard";
import { Section } from "@/components/PageHero";
import { Avatar } from "@/components/Shell";
import { PROFESSIONS, PROFESSION_DETAILS } from "@/lib/concursos";
import { firstName, fmtDate, timeAgo } from "@/lib/utils";

export const metadata = { title: "Início" };

export default async function OverviewPage() {
  const user = await requireUser();
  const [allCourses, cont, settings] = await Promise.all([getCoursesWithProgress(user.id), getContinueLesson(user.id), getSettings()]);
  const [ment, latestNews, latestPosts, weekly, latestPodcasts] = await Promise.all([
    db.select().from(mentorships).orderBy(desc(mentorships.scheduledAt)).limit(3),
    db.select({ id: news.id, title: news.title, kind: news.kind, createdAt: news.createdAt }).from(news).orderBy(desc(news.createdAt)).limit(3),
    db.select({ id: posts.id, content: posts.content, topic: posts.topic, createdAt: posts.createdAt, author: { fullName: users.fullName, avatarUrl: users.avatarUrl } })
      .from(posts).innerJoin(users, eq(posts.userId, users.id)).orderBy(desc(posts.createdAt)).limit(3),
    db.select({ id: lessonProgress.id }).from(lessonProgress).where(and(eq(lessonProgress.userId, user.id), gte(lessonProgress.completedAt, new Date(Date.now() - 7 * 86400000)))),
    db.select().from(podcasts).orderBy(desc(podcasts.createdAt)).limit(3),
  ]);

  const published = allCourses.filter((c) => c.status === "published");
  const totalDone = allCourses.reduce((a, c) => a + c.done, 0);
  const coursesDone = published.filter((c) => c.total > 0 && c.done === c.total).length;
  const inProgress = published.filter((c) => c.done > 0 && c.done < c.total).length;
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  const common = allCourses.filter((c) => c.area === "comum");
  const legislation = allCourses.filter((c) => c.area === "legislacao");
  const mine = user.profession ? allCourses.filter((c) => c.profession === user.profession) : [];
  const details = user.profession ? PROFESSION_DETAILS[user.profession] : null;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="text-sm capitalize text-muted-foreground">{today}</p>
        <h1 className="page-title">Olá, {firstName(user.fullName)}.</h1>
        <p className="page-lead">
          {details ? `Painel de ${details.role}` : "Escolha sua profissão para ver o painel de estudos."}
        </p>
      </div>

      {/* Painel exclusivo da profissão */}
      {details && user.profession ? (
        <div className="relative mb-8 overflow-hidden rounded-[28px] bg-[#0d555b] text-white shadow-[0_18px_48px_rgba(13,85,91,0.12)]">
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 25% 15%, #75d7c5, transparent 58%)" }} />
          <div className="relative px-7 py-9 sm:px-10 sm:py-11">
            <span className="badge border-white/30 bg-white/10 text-white">{user.profession}</span>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.08] sm:text-5xl">{settings.highlight_title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{settings.highlight_subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/concursos" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0d555b] transition hover:bg-[#e6f5f2]">Montar meu plano <ArrowRight className="h-4 w-4" /></Link>
              <Link href={`/courses?profissao=${encodeURIComponent(user.profession)}`} className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">Minhas específicas</Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-white/70"><ShieldCheck className="h-4 w-4" /> {details.daily}</p>
          </div>
        </div>
      ) : (
        <div className="card mb-8 p-6">
          <p className="font-serif text-xl">Qual é a sua profissão?</p>
          <p className="mt-1 text-sm text-muted-foreground">Selecione para ver as matérias específicas e montar seu painel de estudos.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PROFESSIONS.map((p) => {
              const d = PROFESSION_DETAILS[p];
              return (
                <Link key={p} href={`/settings`} className="rounded-2xl border border-border p-4 transition hover:border-primary/40 hover:bg-accent">
                  <p className="font-serif text-lg">{p}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{d.blurb}</p>
                </Link>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Defina em <Link href="/settings" className="font-semibold text-primary">Configurações</Link>.</p>
        </div>
      )}

      {/* Destaques da profissão */}
      {details && (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {details.highlights.map((h) => (
            <div key={h.title} className="card p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary"><BookOpen className="h-4 w-4" /></span>
              <h3 className="mt-3 font-serif text-lg">{h.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Progresso + continuar */}
      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="card glow p-6 lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{cont ? "Continue de onde parou" : "Comece por aqui"}</p>
          {cont ? (
            <>
              <h2 className="mt-2 font-serif text-2xl">{cont.course.title}</h2>
              {cont.next ? <p className="mt-1 text-sm text-muted-foreground">{cont.moduleTitle} · Próximo: {cont.next.title}</p> : <p className="mt-1 text-sm text-primary">Matéria concluída</p>}
              <div className="mt-4 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${cont.total ? Math.round((cont.done / cont.total) * 100) : 0}%` }} /></div>
                <span className="text-xs text-muted-foreground">{cont.done}/{cont.total}</span>
              </div>
              <Link href={`/courses/${cont.course.slug}${cont.next ? `?aula=${cont.next.slug}` : ""}`} className="btn-primary mt-5">
                <PlayCircle className="h-4 w-4" /> {cont.next ? (cont.done ? "Continuar estudo" : "Começar matéria") : "Rever a matéria"}
              </Link>
            </>
          ) : published[0] ? (
            <>
              <h2 className="mt-2 font-serif text-2xl">{published[0].title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{published[0].description}</p>
              <Link href={`/courses/${published[0].slug}`} className="btn-primary mt-5"><PlayCircle className="h-4 w-4" /> Começar matéria</Link>
            </>
          ) : <p className="mt-2 text-sm text-muted-foreground">Ainda não há matérias publicadas.</p>}
        </div>
        <div className="card p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Seu progresso</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <Stat icon={<CheckCircle2 className="h-4 w-4" />} v={totalDone} l="Tópicos estudados" />
            <Stat icon={<BookOpen className="h-4 w-4" />} v={coursesDone} l="Matérias concluídas" />
            <Stat icon={<Flame className="h-4 w-4" />} v={inProgress} l="Em andamento" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {weekly.length ? `${weekly.length} tópico${weekly.length > 1 ? "s" : ""} estudado${weekly.length > 1 ? "s" : ""} nos últimos 7 dias. Continue assim!` : "Nenhum tópico estudado nos últimos 7 dias. Constância vale mais que intensidade."}
          </p>
        </div>
      </div>

      {/* Específicas da profissão */}
      {mine.length > 0 && (
        <Section title={`Específicas — ${user.profession}`} action={<Link href={`/courses?profissao=${encodeURIComponent(user.profession ?? "")}`} className="text-sm font-semibold text-primary">Ver todas →</Link>}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mine.map((c) => <CourseCard key={c.id} c={c} />)}</div>
        </Section>
      )}

      {/* Comuns */}
      <Section title="Conhecimentos comuns" action={<Link href="/courses?area=comum" className="text-sm font-semibold text-primary">Ver todas →</Link>}>
        <p className="-mt-2 mb-3 text-sm text-muted-foreground">Língua Portuguesa, Raciocínio Lógico-Matemático e Sistema Único de Saúde.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{common.map((c) => <CourseCard key={c.id} c={c} />)}</div>
      </Section>

      {/* Legislação */}
      <Section title="Legislação por esfera" action={<Link href="/courses?area=legislacao" className="text-sm font-semibold text-primary">Ver todas →</Link>}>
        <p className="-mt-2 mb-3 text-sm text-muted-foreground">Escolha a esfera do seu concurso em <Link href="/concursos" className="font-semibold text-primary">Meu concurso</Link>.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{legislation.map((c) => <CourseCard key={c.id} c={c} />)}</div>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel icon={<Headphones className="h-4 w-4" />} title="Podcasts de estudo" to="/podcasts">
          {latestPodcasts.length === 0 && <p className="text-sm text-muted-foreground">Nenhum episódio por enquanto.</p>}
          {latestPodcasts.map((p) => (
            <Link key={p.id} href="/podcasts" className="block rounded-xl px-3 py-2 hover:bg-accent">
              <p className="text-sm font-semibold truncate">{p.title}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="text-primary font-medium">{p.subjectReference || "Geral"}</span> · {p.durationMin} min
              </p>
            </Link>
          ))}
        </Panel>
        <Panel icon={<Video className="h-4 w-4" />} title="Próximos encontros" to="/mentorships">
          {ment.length === 0 && <p className="text-sm text-muted-foreground">Nenhum encontro por agora.</p>}
          {ment.map((m) => (
            <Link key={m.id} href="/mentorships" className="block rounded-xl px-3 py-2 hover:bg-accent">
              <p className="text-sm font-semibold">{m.title}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">{m.status === "upcoming" ? <><Radio className="h-3 w-3 text-primary" /> Ao vivo · {fmtDate(m.scheduledAt)}</> : "Gravado · Disponível"}</p>
            </Link>
          ))}
        </Panel>
        <Panel icon={<Newspaper className="h-4 w-4" />} title="Dicas e notícias" to="/news">
          {latestNews.length === 0 && <p className="text-sm text-muted-foreground">Sem novidades por enquanto.</p>}
          {latestNews.map((n) => (
            <Link key={n.id} href={`/news/${n.id}`} className="block rounded-xl px-3 py-2 hover:bg-accent">
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.kind === "short" ? "Vídeo curto" : "Artigo"} · {timeAgo(n.createdAt)}</p>
            </Link>
          ))}
        </Panel>
        <Panel icon={<Users className="h-4 w-4" />} title="Na comunidade" to="/community">
          {latestPosts.length === 0 && <p className="text-sm text-muted-foreground">Ainda não há conversas. Que tal abrir a primeira?</p>}
          {latestPosts.map((p) => (
            <Link key={p.id} href="/community" className="flex gap-2 rounded-xl px-3 py-2 hover:bg-accent">
              <Avatar user={p.author} size={28} />
              <div className="min-w-0">
                <p className="text-xs font-semibold">{p.author.fullName} <span className="font-normal text-muted-foreground">· {timeAgo(p.createdAt)}</span></p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{p.content}</p>
              </div>
            </Link>
          ))}
        </Panel>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-accent/60 p-4 text-xs leading-relaxed text-muted-foreground">
        <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>Conteúdo de apoio aos estudos, sem garantia de aprovação. Matérias, legislação e normas podem mudar: confirme sempre o conteúdo programático e a versão vigente no edital oficial do seu concurso.</p>
      </div>
    </div>
  );
}

function Stat({ icon, v, l }: { icon: React.ReactNode; v: number; l: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">{icon}</div>
      <p className="mt-1 font-serif text-2xl">{v}</p>
      <p className="text-[10px] leading-tight text-muted-foreground">{l}</p>
    </div>
  );
}

function Panel({ icon, title, to, children }: { icon: React.ReactNode; title: string; to: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="flex items-center gap-2 font-serif text-lg"><span className="text-primary">{icon}</span>{title}</p>
        <Link href={to} className="text-xs font-semibold text-primary">Ver tudo</Link>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
