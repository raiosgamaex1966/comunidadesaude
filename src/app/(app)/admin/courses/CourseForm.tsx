import { AREAS, PROFESSIONS, SPHERES } from "@/lib/concursos";

type Trail = { id: number; title: string };
type Course = { id: number; title: string; description: string | null; coverUrl: string | null; level: string; status: string; trailId: number | null; position: number; instructor: string | null; area: string; profession: string | null; sphere: string | null };

export function CourseForm({ trails, course, action }: { trails: Trail[]; course?: Course; action: (fd: FormData) => Promise<void> }) {
  return (
    <form action={action} className="space-y-3">
      {course && <input type="hidden" name="id" value={course.id} />}
      <div><label className="label">Título</label><input name="title" defaultValue={course?.title} className="input h-9" required /></div>
      <div><label className="label">Descrição</label><textarea name="description" defaultValue={course?.description ?? ""} rows={3} className="input" /></div>
      <div><label className="label">Capa (URL)</label><input name="coverUrl" defaultValue={course?.coverUrl ?? ""} className="input h-9" placeholder="/images/course-1.jpg" /></div>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="label">Nível</label><select name="level" defaultValue={course?.level ?? "Iniciante"} className="input h-9">{["Iniciante", "Intermediário", "Avançado"].map((l) => <option key={l}>{l}</option>)}</select></div>
        <div><label className="label">Estado</label><select name="status" defaultValue={course?.status ?? "published"} className="input h-9"><option value="published">Publicado</option><option value="coming_soon">Em breve</option><option value="draft">Rascunho</option></select></div>
        <div><label className="label">Trilha</label><select name="trailId" defaultValue={course?.trailId ?? ""} className="input h-9"><option value="">Sem trilha</option>{trails.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></div>
        <div><label className="label">Ordem</label><input name="position" type="number" defaultValue={course?.position ?? 0} className="input h-9" /></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="label">Área</label><select name="area" defaultValue={course?.area ?? "comum"} className="input h-9">{AREAS.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}</select></div>
        <div><label className="label">Esfera</label><select name="sphere" defaultValue={course?.sphere ?? ""} className="input h-9"><option value="">—</option>{SPHERES.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}</select></div>
      </div>
      <div><label className="label">Profissão (se específico)</label><select name="profession" defaultValue={course?.profession ?? ""} className="input h-9"><option value="">—</option>{PROFESSIONS.map((p) => <option key={p}>{p}</option>)}</select></div>
      <div><label className="label">Instrutor</label><input name="instructor" defaultValue={course?.instructor ?? "RCS"} className="input h-9" /></div>
      <button className="btn-primary w-full">{course ? "Salvar alterações" : "Criar curso"}</button>
    </form>
  );
}
