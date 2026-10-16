import Link from "next/link";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { savedItems, posts, lessons, courses, mentorships, materials, news, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { Empty, PageHero } from "@/components/PageHero";
import { SaveButton } from "@/components/SaveButton";
import { cn } from "@/lib/utils";

export const metadata = { title: "Salvos" };
const KINDS: Record<string, string> = { post: "Publicação", lesson: "Aula", mentorship: "Mentoria", material: "Material", news: "Notícia" };

export default async function SavedPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const user = await requireUser();
  const { tipo = "all" } = await searchParams;
  const items = await db.select().from(savedItems).where(eq(savedItems.userId, user.id)).orderBy(desc(savedItems.createdAt));
  const ids = (k: string) => items.filter((i) => i.kind === k).map((i) => i.refId);
  const nz = (a: number[]) => (a.length ? a : [-1]);
  const [ps, ls, ms, mats, ns] = await Promise.all([
    db.select({ id: posts.id, title: posts.content, sub: users.fullName }).from(posts).innerJoin(users, eq(posts.userId, users.id)).where(inArray(posts.id, nz(ids("post")))),
    db.select({ id: lessons.id, title: lessons.title, sub: courses.title, slug: courses.slug, lslug: lessons.slug }).from(lessons).innerJoin(courses, eq(lessons.courseId, courses.id)).where(inArray(lessons.id, nz(ids("lesson")))),
    db.select({ id: mentorships.id, title: mentorships.title, sub: mentorships.description }).from(mentorships).where(inArray(mentorships.id, nz(ids("mentorship")))),
    db.select({ id: materials.id, title: materials.title, sub: materials.category }).from(materials).where(inArray(materials.id, nz(ids("material")))),
    db.select({ id: news.id, title: news.title, sub: news.kind }).from(news).where(inArray(news.id, nz(ids("news")))),
  ]);
  const resolved = items.map((i) => {
    if (i.kind === "post") { const p = ps.find((x) => x.id === i.refId); return p && { ...i, title: p.title, sub: p.sub, href: "/community" }; }
    if (i.kind === "lesson") { const p = ls.find((x) => x.id === i.refId); return p && { ...i, title: p.title, sub: p.sub, href: `/courses/${p.slug}?aula=${p.lslug}` }; }
    if (i.kind === "mentorship") { const p = ms.find((x) => x.id === i.refId); return p && { ...i, title: p.title, sub: p.sub, href: "/mentorships" }; }
    if (i.kind === "material") { const p = mats.find((x) => x.id === i.refId); return p && { ...i, title: p.title, sub: p.sub, href: "/materials" }; }
    const p = ns.find((x) => x.id === i.refId); return p && { ...i, title: p.title, sub: p.sub === "short" ? "Vídeo curto" : "Artigo", href: `/news/${p.id}` };
  }).filter(Boolean) as { id: number; kind: string; refId: number; title: string; sub: string | null; href: string }[];
  const list = tipo === "all" ? resolved : resolved.filter((r) => r.kind === tipo);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHero title="Salvos" lead="O que você salvou para ver depois: publicações, aulas, mentorias, materiais e notícias." />
      <div className="mb-5 flex flex-wrap gap-2">
        <Link href="/saved" className={cn("badge px-3 py-1", tipo === "all" ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground")}>Tudo ({resolved.length})</Link>
        {Object.entries(KINDS).map(([k, l]) => <Link key={k} href={`/saved?tipo=${k}`} className={cn("badge px-3 py-1", tipo === k ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground")}>{l}s</Link>)}
      </div>
      {list.length === 0 ? (
        <Empty title="Você ainda não salvou nada" lead="Toque em Salvar numa aula, material, mentoria ou notícia para guardar aqui." action={<div className="flex gap-2"><Link href="/community" className="btn-outline">Ir para a comunidade</Link><Link href="/materials" className="btn-primary">Ver materiais</Link></div>} />
      ) : (
        <ul className="card divide-y divide-border">
          {list.map((r) => (
            <li key={r.id} className="flex items-center gap-3 px-4 py-3">
              <span className="badge shrink-0">{KINDS[r.kind]}</span>
              <Link href={r.href} className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{r.title}</p><p className="truncate text-xs text-muted-foreground">{r.sub}</p></Link>
              <SaveButton kind={r.kind} refId={r.refId} saved path="/saved" small />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
