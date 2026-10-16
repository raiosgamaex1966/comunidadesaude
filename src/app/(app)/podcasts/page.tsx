import { desc, eq } from "drizzle-orm";
import { Headphones, Clock, BookOpen, ExternalLink, Play } from "lucide-react";
import { db } from "@/db";
import { courses, podcasts } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { Empty, PageHero } from "@/components/PageHero";
import { cn, fmtDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Podcasts" };

export default async function PodcastsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; ref?: string }>;
}) {
  await requireUser();
  const { q = "", ref = "Todos" } = await searchParams;

  const [all, allCourses] = await Promise.all([
    db
      .select({
        id: podcasts.id,
        title: podcasts.title,
        description: podcasts.description,
        audioUrl: podcasts.audioUrl,
        subjectReference: podcasts.subjectReference,
        durationMin: podcasts.durationMin,
        coverUrl: podcasts.coverUrl,
        createdAt: podcasts.createdAt,
        courseTitle: courses.title,
        courseSlug: courses.slug,
      })
      .from(podcasts)
      .leftJoin(courses, eq(podcasts.courseId, courses.id))
      .orderBy(desc(podcasts.createdAt)),
    db.select({ id: courses.id, title: courses.title }).from(courses),
  ]);

  const refs = [
    "Todos",
    ...Array.from(
      new Set(
        all
          .map((p) => p.subjectReference || p.courseTitle)
          .filter((v): v is string => Boolean(v))
      )
    ),
  ];

  const list = all.filter((p) => {
    const matchesQ =
      !q ||
      `${p.title} ${p.description ?? ""} ${p.subjectReference ?? ""} ${p.courseTitle ?? ""}`
        .toLowerCase()
        .includes(q.toLowerCase());
    const matchesRef =
      ref === "Todos" ||
      p.subjectReference === ref ||
      p.courseTitle === ref;
    return matchesQ && matchesRef;
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHero
        title="Podcasts de Estudo"
        lead="Aprenda em qualquer lugar: ouça revisões de matérias, dicas de editais, legislação e temas específicos da saúde."
      />

      {/* Busca e filtros */}
      <form className="mb-4 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar episódios de podcasts..."
          className="input h-10 w-full sm:w-72"
        />
        <input type="hidden" name="ref" value={ref} />
        <button className="btn-outline h-10">Buscar</button>
      </form>

      {refs.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {refs.map((r) => (
            <Link
              key={r}
              href={`/podcasts?q=${q}&ref=${encodeURIComponent(r)}`}
              className={cn(
                "badge px-3 py-1.5 transition",
                ref === r
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {r}
            </Link>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <Empty
          title={all.length ? "Nenhum podcast encontrado com esses termos" : "Ainda não há episódios cadastrados"}
          lead={
            all.length
              ? "Tente buscar por outro termo ou selecione todos os filtros."
              : "Os podcasts de matérias aparecerão aqui assim que forem disponibilizados pela coordenação."
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => {
            const isDirectAudio =
              item.audioUrl.endsWith(".mp3") ||
              item.audioUrl.endsWith(".wav") ||
              item.audioUrl.endsWith(".ogg") ||
              item.audioUrl.includes("audio");

            return (
              <div
                key={item.id}
                className="card flex flex-col overflow-hidden p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {item.subjectReference && (
                      <span className="badge border-primary/30 bg-primary/8 text-primary">
                        {item.subjectReference}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {item.durationMin} min
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  <h3 className="font-serif text-lg font-bold leading-tight">
                    {item.title}
                  </h3>
                  {item.courseTitle && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                      <BookOpen className="h-3.5 w-3.5" /> {item.courseTitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  {isDirectAudio ? (
                    <div className="space-y-2">
                      <audio
                        controls
                        className="w-full h-10 rounded-lg outline-none"
                        src={item.audioUrl}
                      >
                        Seu navegador não suporta o player de áudio.
                      </audio>
                    </div>
                  ) : (
                    <a
                      href={item.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Play className="h-4 w-4" /> Ouvir Podcast <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                    </a>
                  )}
                  <p className="mt-2 text-right text-[11px] text-muted-foreground">
                    Publicado em {fmtDate(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
