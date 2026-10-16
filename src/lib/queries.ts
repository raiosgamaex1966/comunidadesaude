import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { courses, enrollments, lessonProgress, lessons, modules, savedItems, siteSettings, trails } from "@/db/schema";
import type { CourseCardData } from "@/components/CourseCard";

export async function getCoursesWithProgress(userId: number): Promise<(CourseCardData & { trailId: number | null; position: number; createdAt: Date })[]> {
  const rows = await db
    .select({
      id: courses.id, slug: courses.slug, title: courses.title, description: courses.description, coverUrl: courses.coverUrl,
      level: courses.level, status: courses.status, area: courses.area, profession: courses.profession, sphere: courses.sphere, trailId: courses.trailId, position: courses.position, createdAt: courses.createdAt,
      total: sql<number>`(select count(*) from lessons l where l.course_id = ${courses.id})`,
      done: sql<number>`(select count(*) from lesson_progress p where p.course_id = ${courses.id} and p.user_id = ${userId})`,
      enrolled: sql<boolean>`exists(select 1 from enrollments e where e.course_id = ${courses.id} and e.user_id = ${userId})`,
    })
    .from(courses)
    .where(inArray(courses.status, ["published", "coming_soon"]))
    .orderBy(asc(courses.trailId), asc(courses.position));
  return rows.map((r) => ({ ...r, total: Number(r.total), done: Number(r.done) }));
}

export async function getTrails() {
  return db.select().from(trails).orderBy(asc(trails.position));
}

export async function getCourseDetail(slug: string, userId: number) {
  const [course] = await db.select().from(courses).where(and(eq(courses.slug, slug), inArray(courses.status, ["published", "coming_soon"]))).limit(1);
  if (!course) return null;
  const mods = await db.select().from(modules).where(eq(modules.courseId, course.id)).orderBy(asc(modules.position));
  const ls = await db.select().from(lessons).where(eq(lessons.courseId, course.id)).orderBy(asc(lessons.position));
  const done = await db.select({ lessonId: lessonProgress.lessonId }).from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.courseId, course.id)));
  const enrolled = (await db.select({ id: enrollments.id }).from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, course.id)))).length > 0;
  const doneSet = new Set(done.map((d) => d.lessonId));
  return {
    course,
    modules: mods.map((m) => ({ ...m, lessons: ls.filter((l) => l.moduleId === m.id).map((l) => ({ ...l, completed: doneSet.has(l.id) })) })),
    enrolled,
    total: ls.length,
    done: doneSet.size,
  };
}

export async function getContinueLesson(userId: number) {
  // Most recently progressed course -> first incomplete lesson
  const recent = await db
    .select({ courseId: lessonProgress.courseId, at: sql<Date>`max(${lessonProgress.completedAt})` })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId))
    .groupBy(lessonProgress.courseId)
    .orderBy(desc(sql`max(${lessonProgress.completedAt})`))
    .limit(1);
  let courseId = recent[0]?.courseId;
  if (!courseId) {
    const enr = await db.select({ courseId: enrollments.courseId }).from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.createdAt)).limit(1);
    courseId = enr[0]?.courseId;
  }
  if (!courseId) return null;
  const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
  if (!course) return null;
  const ls = await db.select({ id: lessons.id, slug: lessons.slug, title: lessons.title, moduleId: lessons.moduleId, position: lessons.position }).from(lessons).where(eq(lessons.courseId, courseId)).orderBy(asc(lessons.moduleId), asc(lessons.position));
  const done = new Set((await db.select({ l: lessonProgress.lessonId }).from(lessonProgress).where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.courseId, courseId)))).map((d) => d.l));
  const next = ls.find((l) => !done.has(l.id));
  const mod = next ? (await db.select({ title: modules.title }).from(modules).where(eq(modules.id, next.moduleId)))[0] : null;
  return { course, next, moduleTitle: mod?.title ?? null, total: ls.length, done: done.size };
}

export async function getSettings() {
  const rows = await db.select().from(siteSettings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
}

export async function getSavedSet(userId: number, kind: string) {
  const rows = await db.select({ refId: savedItems.refId }).from(savedItems).where(and(eq(savedItems.userId, userId), eq(savedItems.kind, kind)));
  return new Set(rows.map((r) => r.refId));
}
