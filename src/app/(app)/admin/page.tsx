import Link from "next/link";
import { desc, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, courses, lessons, lessonProgress, posts, supportMessages, enrollments } from "@/db/schema";
import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Admin" };

export default async function AdminHome() {
  const c = async (q: Promise<{ n: number }[]>) => Number((await q)[0]?.n ?? 0);
  const week = new Date(Date.now() - 7 * 86400000);
  const [students, newStudents, nCourses, nLessons, completions, weekCompletions, nPosts, enrolls, openSupport] = await Promise.all([
    c(db.select({ n: sql<number>`count(*)` }).from(users)),
    c(db.select({ n: sql<number>`count(*)` }).from(users).where(gte(users.createdAt, week))),
    c(db.select({ n: sql<number>`count(*)` }).from(courses)),
    c(db.select({ n: sql<number>`count(*)` }).from(lessons)),
    c(db.select({ n: sql<number>`count(*)` }).from(lessonProgress)),
    c(db.select({ n: sql<number>`count(*)` }).from(lessonProgress).where(gte(lessonProgress.completedAt, week))),
    c(db.select({ n: sql<number>`count(*)` }).from(posts)),
    c(db.select({ n: sql<number>`count(*)` }).from(enrollments)),
    c(db.select({ n: sql<number>`count(distinct user_id)` }).from(supportMessages)),
  ]);
  const recent = await db.select({ id: users.id, fullName: users.fullName, email: users.email, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(6);
  const stats = [
    ["Alunos", students, `+${newStudents} esta semana`], ["Cursos", nCourses, `${nLessons} aulas`], ["Matrículas", enrolls, ""], ["Aulas concluídas", completions, `+${weekCompletions} esta semana`],
    ["Publicações", nPosts, "na comunidade"], ["Conversas de suporte", openSupport, ""],
  ] as const;
  return (
    <div>
      <PageHero title="Visão geral" lead="Números da plataforma e atalhos de gestão." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map(([l, v, s]) => <div key={l} className="card p-5"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{l}</p><p className="mt-1 font-serif text-3xl font-semibold">{v}</p>{s && <p className="text-xs text-muted-foreground">{s}</p>}</div>)}
      </div>
      <div className="card mt-6 p-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-serif text-lg font-semibold">Alunos recentes</h2><Link href="/admin/students" className="text-xs font-semibold text-primary">Ver todos</Link></div>
        <ul className="divide-y divide-border">{recent.map((u) => <li key={u.id} className="flex items-center justify-between py-2 text-sm"><span><b>{u.fullName}</b> <span className="text-muted-foreground">· {u.email}</span></span><span className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</span></li>)}</ul>
      </div>
    </div>
  );
}
