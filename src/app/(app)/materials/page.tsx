import Link from "next/link";
import { desc } from "drizzle-orm";
import { FileText, Link2, Video, Lock } from "lucide-react";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getSavedSet } from "@/lib/queries";
import { Empty, PageHero } from "@/components/PageHero";
import { SaveButton } from "@/components/SaveButton";
import { cn } from "@/lib/utils";

export const metadata = { title: "Biblioteca" };
const ICON = { file: FileText, link: Link2, video: Video } as const;

export default async function MaterialsPage({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string; tipo?: string }> }) {
  const user = await requireUser();
  const { q = "", cat = "Todas", tipo = "Todos" } = await searchParams;
  const [all, saved] = await Promise.all([db.select().from(materials).orderBy(desc(materials.createdAt)), getSavedSet(user.id, "material")]);
  const cats = ["Todas", ...Array.from(new Set(all.map((m) => m.category)))];
  const list = all.filter((m) =>
    (!q || `${m.title} ${m.description}`.toLowerCase().includes(q.toLowerCase())) &&
    (cat === "Todas" || m.category === cat) &&
    (tipo === "Todos" || (tipo === "Incluídos" ? m.included : !m.included)),
  );
  const isNew = (d: Date) => Date.now() - new Date(d).getTime() < 14 * 86400000;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHero title="Biblioteca" lead="Legislação oficial, conselhos profissionais e diários oficiais para estudar pelas fontes originais." />
      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Buscar materiais" className="input h-10 w-full sm:w-64" />
        <input type="hidden" name="cat" value={cat} /><input type="hidden" name="tipo" value={tipo} />
        <button className="btn-outline h-10">Buscar</button>
      </form>
      <div className="mb-2 flex flex-wrap gap-2">{cats.map((c) => <Link key={c} href={`/materials?q=${q}&cat=${c}&tipo=${tipo}`} className={cn("badge px-3 py-1", cat === c ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground")}>{c}</Link>)}</div>
      <div className="mb-5 flex flex-wrap gap-2">{["Todos", "Incluídos", "À venda"].map((t) => <Link key={t} href={`/materials?q=${q}&cat=${cat}&tipo=${t}`} className={cn("badge px-3 py-1", tipo === t ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground")}>{t}</Link>)}</div>
      {list.length === 0 ? (
        <Empty title={all.length ? "Nenhum material com esses filtros" : "Ainda não há materiais"} lead={all.length ? "Tente outra busca ou categoria." : "Os novos materiais aparecem aqui assim que forem publicados."} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => {
            const Icon = ICON[m.kind as keyof typeof ICON] ?? FileText;
            return (
              <div key={m.id} className="card flex flex-col p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary"><Icon className="h-5 w-5" /></span>
                  <div className="flex items-center gap-1">
                    {isNew(m.createdAt) && <span className="badge border-primary/40 text-primary">Novo</span>}
                    <span className="badge">{m.included ? "Incluído" : m.price ?? "À venda"}</span>
                    <SaveButton kind="material" refId={m.id} saved={saved.has(m.id)} path="/materials" small />
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{m.category}</p>
                <h3 className="font-serif text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{m.description}</p>
                <a href={m.url ?? "#"} target={m.url?.startsWith("http") ? "_blank" : undefined} className={cn("mt-4", m.included ? "btn-primary" : "btn-outline")}>
                  {m.included ? (m.kind === "link" ? "Abrir link" : m.kind === "video" ? "Assistir" : "Baixar arquivo") : <><Lock className="h-4 w-4" /> Comprar {m.price}</>}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
