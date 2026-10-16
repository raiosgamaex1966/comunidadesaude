import { desc } from "drizzle-orm";
import { Headphones, Trash2 } from "lucide-react";
import { db } from "@/db";
import { courses, podcasts } from "@/db/schema";
import { deletePodcast, savePodcast } from "@/lib/admin-actions";
import { PageHero } from "@/components/PageHero";

export default async function AdminPodcasts() {
  const [list, courseList] = await Promise.all([
    db.select().from(podcasts).orderBy(desc(podcasts.createdAt)),
    db.select({ id: courses.id, title: courses.title }).from(courses),
  ]);

  const Form = ({ p }: { p?: (typeof list)[number] }) => (
    <form action={savePodcast} className="grid gap-2 sm:grid-cols-2">
      {p && <input type="hidden" name="id" value={p.id} />}
      <input
        name="title"
        defaultValue={p?.title}
        placeholder="Título do Podcast (ex: Resumo SUS - Leis 8080 e 8142)"
        className="input h-9 sm:col-span-2"
        required
      />
      <input
        name="description"
        defaultValue={p?.description ?? ""}
        placeholder="Descrição / Tópicos abordados"
        className="input h-9 sm:col-span-2"
      />
      <input
        name="audioUrl"
        defaultValue={p?.audioUrl}
        placeholder="URL do Áudio (MP3, Spotify embed, Anchor, Drive...)"
        className="input h-9 sm:col-span-2"
        required
      />
      <input
        name="subjectReference"
        defaultValue={p?.subjectReference ?? ""}
        placeholder="Referência de Matéria (ex: SUS, Português, Enfermagem...)"
        className="input h-9"
      />
      <select name="courseId" defaultValue={p?.courseId ?? ""} className="input h-9">
        <option value="">Sem matéria vinculada (Geral)</option>
        {courseList.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
      <input
        name="durationMin"
        type="number"
        defaultValue={p?.durationMin ?? 10}
        placeholder="Duração (minutos)"
        className="input h-9"
      />
      <input
        name="coverUrl"
        defaultValue={p?.coverUrl ?? ""}
        placeholder="URL da Imagem de Capa (opcional)"
        className="input h-9"
      />
      <div className="flex gap-2 sm:col-span-2 mt-2">
        <button className="btn-primary h-9">
          {p ? "Salvar alterações" : "Publicar Podcast"}
        </button>
        {p && (
          <button
            formAction={deletePodcast.bind(null, p.id)}
            className="btn-ghost h-9 text-destructive"
            title="Excluir Podcast"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div>
      <PageHero
        title="Gerir Podcasts"
        lead="Publique episódios em áudio com referência de matéria, tempo de duração e links para os alunos ouvirem."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {list.length === 0 && (
            <div className="card p-8 text-center text-muted-foreground">
              <Headphones className="mx-auto mb-2 h-8 w-8 opacity-40" />
              <p>Nenhum podcast publicado ainda. Use o formulário ao lado para adicionar o primeiro episódio!</p>
            </div>
          )}
          {list.map((item) => (
            <details key={item.id} className="card p-4">
              <summary className="cursor-pointer font-semibold flex items-center justify-between">
                <span>
                  🎧 {item.title}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    · {item.subjectReference || "Geral"} · {item.durationMin} min
                  </span>
                </span>
              </summary>
              <div className="mt-4 border-t border-border pt-4">
                <Form p={item} />
              </div>
            </details>
          ))}
        </div>
        <div className="card h-fit p-5">
          <h2 className="mb-3 font-serif text-lg font-semibold flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" /> Novo Podcast
          </h2>
          <Form />
        </div>
      </div>
    </div>
  );
}
