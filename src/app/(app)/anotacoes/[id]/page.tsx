import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { deleteNote, toggleNoteFavorite, updateNote } from "@/lib/actions";
import { cn } from "@/lib/utils";

export default async function NoteEditor({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = Number((await params).id);
  const [n] = await db.select().from(notes).where(and(eq(notes.id, id), eq(notes.userId, user.id)));
  if (!n) notFound();
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/anotacoes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Anotações</Link>
        <div className="flex gap-1">
          <form action={toggleNoteFavorite.bind(null, n.id)}><button className="btn-ghost h-9 px-2"><Star className={cn("h-4 w-4", n.favorite && "fill-primary text-primary")} /></button></form>
          <form action={deleteNote.bind(null, n.id)}><button className="btn-ghost h-9 px-2 text-destructive"><Trash2 className="h-4 w-4" /></button></form>
        </div>
      </div>
      <form action={updateNote} className="card space-y-4 p-5">
        <input type="hidden" name="id" value={n.id} />
        <input name="title" defaultValue={n.title} className="w-full bg-transparent font-serif text-3xl font-semibold outline-none" />
        <div><label className="label">Pasta</label><input name="folder" defaultValue={n.folder} className="input h-9 w-48" /></div>
        <div>
          <label className="label">Notas</label>
          <textarea name="content" defaultValue={n.content} rows={18} placeholder={"Tema central\n- Ramo 1\n  - Nota\n- Ramo 2"} className="input resize-y font-mono text-sm leading-relaxed" />
          <p className="mt-1 text-xs text-muted-foreground">Use hífens e indentação para criar ramos do seu mapa.</p>
        </div>
        <button className="btn-primary">Salvar</button>
      </form>
    </div>
  );
}
