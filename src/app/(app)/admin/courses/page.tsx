import Link from "next/link";
import { asc, sql } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { db } from "@/db";
import { courses, trails } from "@/db/schema";
import { deleteCourse, deleteTrail, saveCourse, saveTrail } from "@/lib/admin-actions";
import { PageHero } from "@/components/PageHero";
import { CourseForm } from "./CourseForm";

export default async function AdminCourses() {
  const [cs, ts] = await Promise.all([
    db.select({ id: courses.id, title: courses.title, status: courses.status, level: courses.level, trailId: courses.trailId, lessons: sql<number>`(select count(*) from lessons l where l.course_id = ${courses.id})`, students: sql<number>`(select count(*) from enrollments e where e.course_id = ${courses.id})` }).from(courses).orderBy(asc(courses.trailId), asc(courses.position)),
    db.select().from(trails).orderBy(asc(trails.position)),
  ]);
  return (
    <div>
      <PageHero title="Gerir cursos" lead="Crie cursos, organize em trilhas e adicione módulos e aulas." />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="card divide-y divide-border">
          {cs.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50 transition">
              <Link href={`/admin/courses/${c.id}`} className="min-w-0 flex-1">
                <p className="truncate font-semibold hover:underline">{c.title}</p>
                <p className="text-xs text-muted-foreground">{ts.find((t) => t.id === c.trailId)?.title ?? "Sem trilha"} · {c.level} · {Number(c.lessons)} aulas · {Number(c.students)} alunos</p>
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`badge ${c.status === "published" ? "border-primary/40 text-primary" : ""}`}>{c.status === "published" ? "Publicado" : c.status === "coming_soon" ? "Em breve" : "Rascunho"}</span>
                <form action={deleteCourse.bind(null, c.id)}>
                  <button className="btn-ghost h-8 w-8 p-0 text-destructive hover:bg-destructive/10" title="Excluir curso" aria-label="Excluir curso">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="card p-5"><h2 className="mb-3 font-serif text-lg font-semibold">Novo curso</h2><CourseForm trails={ts} action={saveCourse} /></div>
          <div className="card p-5">
            <h2 className="mb-3 font-serif text-lg font-semibold">Trilhas</h2>
            <ul className="mb-3 space-y-1">{ts.map((t) => <li key={t.id} className="flex items-center justify-between text-sm"><span>{t.position}. {t.title}</span><form action={deleteTrail.bind(null, t.id)}><button className="text-destructive" aria-label="Excluir"><Trash2 className="h-4 w-4" /></button></form></li>)}</ul>
            <form action={saveTrail} className="space-y-2"><input name="title" placeholder="Nome da trilha" className="input h-9" required /><input name="description" placeholder="Descrição" className="input h-9" /><input name="position" type="number" placeholder="Ordem" className="input h-9" /><button className="btn-outline h-9 w-full">Adicionar trilha</button></form>
          </div>
        </div>
      </div>
    </div>
  );
}
