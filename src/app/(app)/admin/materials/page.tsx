import { desc } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { deleteMaterial, saveMaterial } from "@/lib/admin-actions";
import { PageHero } from "@/components/PageHero";

export default async function AdminMaterials() {
  const list = await db.select().from(materials).orderBy(desc(materials.createdAt));
  const Form = ({ m }: { m?: (typeof list)[number] }) => (
    <form action={saveMaterial} className="grid gap-2 sm:grid-cols-2">
      {m && <input type="hidden" name="id" value={m.id} />}
      <input name="title" defaultValue={m?.title} placeholder="Título" className="input h-9 sm:col-span-2" required />
      <input name="description" defaultValue={m?.description ?? ""} placeholder="Descrição" className="input h-9 sm:col-span-2" />
      <input name="category" defaultValue={m?.category ?? ""} placeholder="Categoria (Evidências, Segurança…)" className="input h-9" />
      <select name="kind" defaultValue={m?.kind ?? "link"} className="input h-9"><option value="link">Link</option><option value="file">Arquivo</option><option value="video">Vídeo</option></select>
      <input name="url" defaultValue={m?.url ?? ""} placeholder="URL" className="input h-9 sm:col-span-2" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="included" defaultChecked={m?.included ?? true} /> Incluído na assinatura</label>
      <input name="price" defaultValue={m?.price ?? ""} placeholder="Preço (se à venda)" className="input h-9" />
      <div className="flex gap-2 sm:col-span-2"><button className="btn-primary h-9">{m ? "Salvar" : "Publicar material"}</button>{m && <button formAction={deleteMaterial.bind(null, m.id)} className="btn-ghost h-9 text-destructive"><Trash2 className="h-4 w-4" /></button>}</div>
    </form>
  );
  return (
    <div>
      <PageHero title="Gerir materiais" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">{list.map((m) => <details key={m.id} className="card p-4"><summary className="cursor-pointer font-semibold">{m.title} <span className="text-xs font-normal text-muted-foreground">· {m.category} · {m.included ? "Incluído" : m.price}</span></summary><div className="mt-3"><Form m={m} /></div></details>)}</div>
        <div className="card h-fit p-5"><h2 className="mb-3 font-serif text-lg font-semibold">Novo material</h2><Form /></div>
      </div>
    </div>
  );
}
