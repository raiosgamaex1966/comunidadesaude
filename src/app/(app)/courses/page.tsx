import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getCoursesWithProgress } from "@/lib/queries";
import { CourseCard } from "@/components/CourseCard";
import { Empty, PageHero, Section } from "@/components/PageHero";
import { AREAS, PROFESSIONS } from "@/lib/concursos";
import { cn } from "@/lib/utils";

export const metadata = { title: "Matérias" };

const STATES = [
  { k: "all", l: "Todas" },
  { k: "progress", l: "Em andamento" },
  { k: "done", l: "Concluídas" },
  { k: "new", l: "Não iniciadas" },
];

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ q?: string; estado?: string; area?: string; profissao?: string }> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase().trim();
  const estado = sp.estado ?? "all";
  const area = sp.area ?? "all";
  const profissao = sp.profissao ?? "";
  const all = await getCoursesWithProgress(user.id);

  const filtered = all.filter((c) => {
    if (q && !`${c.title} ${c.description} ${c.profession ?? ""}`.toLowerCase().includes(q)) return false;
    if (area !== "all" && c.area !== area) return false;
    if (profissao && c.profession !== profissao) return false;
    const done = c.total > 0 && c.done === c.total;
    if (estado === "progress") return c.done > 0 && !done;
    if (estado === "done") return done;
    if (estado === "new") return c.done === 0;
    return true;
  });

  const inProgress = all.filter((c) => c.done > 0 && c.done < c.total);
  const filtering = Boolean(q || profissao || area !== "all" || estado !== "all");
  const href = (p: Partial<{ estado: string; area: string; profissao: string }>) => {
    const u = new URLSearchParams({ q: sp.q ?? "", estado, area, profissao, ...p });
    return `/courses?${u.toString()}`;
  };
  const group = (a: string) => all.filter((c) => c.area === a);
  const grid = (list: typeof all) => <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <CourseCard key={c.id} c={c} />)}</div>;
  const mine = user.profession ? all.filter((c) => c.profession === user.profession) : [];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHero title="Matérias para concursos da saúde" lead="Conhecimentos comuns, legislação por esfera e conteúdos específicos da sua profissão. Confirme sempre o conteúdo programático no edital." />

      <form className="mb-4 flex flex-wrap items-center gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Buscar matérias ou tópicos" className="input h-10 w-full sm:w-64" />
        <input type="hidden" name="estado" value={estado} />
        <input type="hidden" name="area" value={area} />
        <select name="profissao" defaultValue={profissao} className="input h-10 w-auto">
          <option value="">Todas as profissões</option>
          {PROFESSIONS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <button className="btn-outline h-10">Filtrar</button>
        {filtering && <Link href="/courses" className="btn-ghost h-10">Limpar filtros</Link>}
      </form>
      <div className="mb-2 flex flex-wrap gap-2" aria-label="Filtrar por área">
        <Link href={href({ area: "all" })} className={cn("badge px-3 py-1", area === "all" ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}>Todas as áreas</Link>
        {AREAS.map((a) => <Link key={a.key} href={href({ area: a.key })} className={cn("badge px-3 py-1", area === a.key ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}>{a.label}</Link>)}
      </div>
      <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtrar por estado">
        {STATES.map((s) => <Link key={s.k} href={href({ estado: s.k })} className={cn("badge px-3 py-1", estado === s.k ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}>{s.l}</Link>)}
      </div>

      {filtering ? (
        filtered.length === 0 ? <Empty title="Nenhuma matéria encontrada" lead="Tente outros filtros ou palavras." /> : grid(filtered)
      ) : (
        <>
          {inProgress.length > 0 && <Section title="Continuar estudando">{grid(inProgress)}</Section>}
          {mine.length > 0 && <Section title={`Para você: ${user.profession}`}>{grid(mine)}</Section>}
          <Section title="Conhecimentos comuns a todos os cargos">
            <p className="-mt-2 mb-3 text-sm text-muted-foreground">Língua Portuguesa, Raciocínio Lógico-Matemático e Sistema Único de Saúde.</p>
            {grid(group("comum"))}
          </Section>
          <Section title="Legislação e conhecimentos por esfera">
            <p className="-mt-2 mb-3 text-sm text-muted-foreground">Escolha a esfera do seu concurso: federal, estadual ou municipal.</p>
            {grid(group("legislacao"))}
          </Section>
          <Section title="Conhecimentos específicos por profissão">
            {PROFESSIONS.map((p) => {
              const list = all.filter((c) => c.profession === p);
              if (!list.length) return null;
              return (
                <div key={p} className="mb-5">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">{p}</h3>
                  {grid(list)}
                </div>
              );
            })}
          </Section>
        </>
      )}
    </div>
  );
}
