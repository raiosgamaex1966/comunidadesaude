import Link from "next/link";
import { Clock, PlayCircle } from "lucide-react";
import { areaLabel, sphereLabel } from "@/lib/concursos";
import { courseVisual } from "@/lib/course-visuals";

export type CourseCardData = {
  id: number; slug: string; title: string; description: string | null; coverUrl: string | null;
  level: string; status: string; area: string; profession: string | null; sphere: string | null;
  total: number; done: number; enrolled: boolean;
};

export function CourseCard({ c }: { c: CourseCardData }) {
  const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
  const soon = c.status === "coming_soon";
  const { Icon, gradient } = courseVisual(c);
  const tag = soon ? "Em breve" : c.profession ?? (c.sphere ? `Esfera ${sphereLabel(c.sphere).toLowerCase()}` : areaLabel(c.area));
  return (
    <Link href={`/courses/${c.slug}`} className="card group overflow-hidden transition hover:border-border-strong hover:shadow-md">
      <div className="relative aspect-[16/8] overflow-hidden bg-muted">
        {c.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.coverUrl} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition group-hover:scale-[1.02]" style={{ background: gradient }}>
            <Icon className="h-14 w-14 text-white/90" strokeWidth={1.5} />
          </div>
        )}
        <span className="badge absolute left-3 top-3 border-white/40 bg-white/90 text-[#174b4e] backdrop-blur">{tag}</span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg leading-tight">{c.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><PlayCircle className="h-3.5 w-3.5" /> {c.total} tópicos</span>
          {c.enrolled && !soon ? <span className="font-semibold text-primary">{pct === 100 ? "Concluído" : `${pct}%`}</span> : <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {soon ? "Em produção" : "Começar →"}</span>}
        </div>
        {c.enrolled && !soon && (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
    </Link>
  );
}
