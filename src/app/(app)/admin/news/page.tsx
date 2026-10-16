import { desc } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { db } from "@/db";
import { news } from "@/db/schema";
import { deleteNews, saveNews } from "@/lib/admin-actions";
import { PageHero } from "@/components/PageHero";

export default async function AdminNews() {
  const list = await db.select().from(news).orderBy(desc(news.createdAt));
  const Form = ({ n }: { n?: (typeof list)[number] }) => (
    <form action={saveNews} className="grid gap-2">
      {n && <input type="hidden" name="id" value={n.id} />}
      <input name="title" defaultValue={n?.title} placeholder="Título" className="input h-9" required />
      <textarea name="content" defaultValue={n?.content} rows={5} placeholder="Conteúdo (parágrafos separados por linha em branco)" className="input" />
      <div className="grid grid-cols-2 gap-2">
        <select name="kind" defaultValue={n?.kind ?? "article"} className="input h-9"><option value="article">Artigo</option><option value="short">Vídeo curto</option></select>
        <input name="videoUrl" defaultValue={n?.videoUrl ?? ""} placeholder="URL embed do vídeo" className="input h-9" />
      </div>
      <input name="coverUrl" defaultValue={n?.coverUrl ?? ""} placeholder="Capa (URL)" className="input h-9" />
      <div className="flex gap-2"><button className="btn-primary h-9">{n ? "Salvar" : "Publicar"}</button>{n && <button formAction={deleteNews.bind(null, n.id)} className="btn-ghost h-9 text-destructive"><Trash2 className="h-4 w-4" /></button>}</div>
    </form>
  );
  return (
    <div>
      <PageHero title="Gerir notícias" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">{list.map((n) => <details key={n.id} className="card p-4"><summary className="cursor-pointer font-semibold">{n.title} <span className="text-xs font-normal text-muted-foreground">· {n.kind === "short" ? "Short" : "Artigo"}</span></summary><div className="mt-3"><Form n={n} /></div></details>)}</div>
        <div className="card h-fit p-5"><h2 className="mb-3 font-serif text-lg font-semibold">Nova notícia</h2><Form /></div>
      </div>
    </div>
  );
}
