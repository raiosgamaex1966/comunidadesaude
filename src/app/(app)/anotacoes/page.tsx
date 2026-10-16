import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Folder, NotebookPen, Plus, Star } from "lucide-react";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { createNote, toggleNoteFavorite } from "@/lib/actions";
import { Empty, PageHero } from "@/components/PageHero";
import { cn, timeAgo } from "@/lib/utils";

export const metadata = { title: "Anotações" };

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ q?: string; pasta?: string; fav?: string }> }) {
  const user = await requireUser();
  const { q = "", pasta, fav } = await searchParams;
  const all = await db.select().from(notes).where(eq(notes.userId, user.id)).orderBy(desc(notes.updatedAt));
  const folders = Array.from(new Set(all.map((n) => n.folder)));
  const list = all.filter((n) => (!q || `${n.title} ${n.content}`.toLowerCase().includes(q.toLowerCase())) && (!pasta || n.folder === pasta) && (!fav || n.favorite));
  return (
    <div className="mx-auto max-w-5xl">
      <PageHero title="Anotações" lead="Organize aprendizados, referências e reflexões da sua jornada profissional." action={
        <form action={createNote} className="flex gap-2"><input name="title" placeholder="Título do novo mapa" className="input h-10 w-48" /><button className="btn-primary h-10"><Plus className="h-4 w-4" /> Novo mapa</button></form>
      } />
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="card h-fit p-3">
          <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pastas</p>
          <Link href="/anotacoes" className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm", !pasta && !fav ? "bg-primary/12 text-primary" : "hover:bg-accent")}><NotebookPen className="h-4 w-4" /> Todos os mapas</Link>
          <Link href="/anotacoes?fav=1" className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm", fav ? "bg-primary/12 text-primary" : "hover:bg-accent")}><Star className="h-4 w-4" /> Favoritos</Link>
          {folders.map((f) => <Link key={f} href={`/anotacoes?pasta=${encodeURIComponent(f)}`} className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm", pasta === f ? "bg-primary/12 text-primary" : "hover:bg-accent")}><Folder className="h-4 w-4" /> {f}</Link>)}
        </aside>
        <div>
          <form className="mb-4"><input name="q" defaultValue={q} placeholder="Buscar nos mapas" className="input" /></form>
          {list.length === 0 ? (
            <Empty title={q ? "Nenhum mapa encontrado" : fav ? "Nenhum favorito ainda" : "Nenhum mapa aqui ainda"} lead={q ? "Tente outra palavra: a busca olha o título e o texto." : fav ? "Toque na estrela de um mapa para ele aparecer aqui." : "Crie o primeiro: um tema central, ramos e notas."} />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {list.map((n) => (
                <li key={n.id} className="card flex flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/anotacoes/${n.id}`} className="font-serif text-lg font-semibold hover:underline">{n.title}</Link>
                    <form action={toggleNoteFavorite.bind(null, n.id)}><button aria-label="Favoritar"><Star className={cn("h-4 w-4", n.favorite ? "fill-primary text-primary" : "text-muted-foreground")} /></button></form>
                  </div>
                  <p className="mt-1 line-clamp-3 flex-1 whitespace-pre-wrap text-sm text-muted-foreground">{n.content || "Sem conteúdo ainda."}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{n.folder} · {timeAgo(n.updatedAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
