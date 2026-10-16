"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { courses, lessons, materials, mentorships, modules, news, notifications, podcasts, siteSettings, trails, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { PROFESSIONS } from "@/lib/concursos";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const n = (fd: FormData, k: string) => Number(fd.get(k) ?? 0) || 0;

async function notifyAll(title: string, link: string, exceptId: number) {
  const all = await db.select({ id: users.id }).from(users);
  if (all.length) await db.insert(notifications).values(all.filter((u) => u.id !== exceptId).map((u) => ({ userId: u.id, title, link })));
}

// Courses
export async function saveCourse(fd: FormData) {
  const admin = await requireAdmin();
  const id = n(fd, "id");
  const title = s(fd, "title");
  if (!title) return;
  const data = {
    title, description: s(fd, "description"), coverUrl: s(fd, "coverUrl") || null, level: s(fd, "level") || "Iniciante",
    status: s(fd, "status") || "published", trailId: n(fd, "trailId") || null, position: n(fd, "position"), instructor: s(fd, "instructor") || "RCS",
    area: s(fd, "area") || "comum", profession: s(fd, "profession") || null, sphere: s(fd, "sphere") || null,
  };
  if (id) {
    await db.update(courses).set(data).where(eq(courses.id, id));
  } else {
    const [c] = await db.insert(courses).values({ ...data, ownerUserId: admin.id, slug: `${slugify(title)}-${Date.now().toString(36).slice(-4)}` }).returning();
    await notifyAll(`Novo curso: ${title}`, `/courses/${c.slug}`, admin.id);
    revalidatePath("/admin/courses");
    redirect(`/admin/courses/${c.id}`);
  }
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
  revalidatePath("/courses");
}

export async function deleteCourse(id: number) {
  await requireAdmin();
  await db.delete(courses).where(eq(courses.id, id));
  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}

export async function saveModule(fd: FormData) {
  await requireAdmin();
  const courseId = n(fd, "courseId");
  const title = s(fd, "title");
  if (!courseId || !title) return;
  await db.insert(modules).values({ courseId, title, position: n(fd, "position") });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteModule(id: number, courseId: number) {
  await requireAdmin();
  await db.delete(modules).where(eq(modules.id, id));
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function saveLesson(fd: FormData) {
  const admin = await requireAdmin();
  const id = n(fd, "id");
  const courseId = n(fd, "courseId");
  const moduleId = n(fd, "moduleId");
  const title = s(fd, "title");
  if (!courseId || !moduleId || !title) return;
  const data = { moduleId, courseId, title, description: s(fd, "description"), videoUrl: s(fd, "videoUrl") || null, durationMin: n(fd, "durationMin") || 10, position: n(fd, "position") };
  if (id) await db.update(lessons).set(data).where(eq(lessons.id, id));
  else {
    await db.insert(lessons).values({ ...data, slug: `${slugify(title)}-${Date.now().toString(36).slice(-5)}` });
    const [c] = await db.select({ slug: courses.slug, title: courses.title }).from(courses).where(eq(courses.id, courseId));
    if (c) await notifyAll(`Aula nova em ${c.title}: ${title}`, `/courses/${c.slug}`, admin.id);
  }
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/courses");
}

export async function deleteLesson(id: number, courseId: number) {
  await requireAdmin();
  await db.delete(lessons).where(eq(lessons.id, id));
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function saveTrail(fd: FormData) {
  await requireAdmin();
  const title = s(fd, "title");
  if (!title) return;
  await db.insert(trails).values({ title, description: s(fd, "description"), position: n(fd, "position") });
  revalidatePath("/admin/courses");
}

export async function deleteTrail(id: number) {
  await requireAdmin();
  await db.delete(trails).where(eq(trails.id, id));
  revalidatePath("/admin/courses");
}

// Materials
export async function saveMaterial(fd: FormData) {
  const admin = await requireAdmin();
  const id = n(fd, "id");
  const title = s(fd, "title");
  if (!title) return;
  const data = { title, description: s(fd, "description"), category: s(fd, "category") || "Evidências", kind: s(fd, "kind") || "link", url: s(fd, "url") || null, included: fd.get("included") === "on", price: s(fd, "price") || null };
  if (id) await db.update(materials).set(data).where(eq(materials.id, id));
  else { await db.insert(materials).values({ ...data, ownerUserId: admin.id }); await notifyAll(`Material novo: ${title}`, "/materials", admin.id); }
  revalidatePath("/admin/materials"); revalidatePath("/materials");
}
export async function deleteMaterial(id: number) {
  await requireAdmin();
  await db.delete(materials).where(eq(materials.id, id));
  revalidatePath("/admin/materials"); revalidatePath("/materials");
}

// News
export async function saveNews(fd: FormData) {
  const admin = await requireAdmin();
  const id = n(fd, "id");
  const title = s(fd, "title");
  if (!title) return;
  const data = { title, content: s(fd, "content"), kind: s(fd, "kind") || "article", videoUrl: s(fd, "videoUrl") || null, coverUrl: s(fd, "coverUrl") || null, authorId: admin.id };
  if (id) await db.update(news).set(data).where(eq(news.id, id));
  else { const [row] = await db.insert(news).values(data).returning(); await notifyAll(`Notícia: ${title}`, `/news/${row.id}`, admin.id); }
  revalidatePath("/admin/news"); revalidatePath("/news");
}
export async function deleteNews(id: number) {
  await requireAdmin();
  await db.delete(news).where(eq(news.id, id));
  revalidatePath("/admin/news"); revalidatePath("/news");
}

// Mentorships
export async function saveMentorship(fd: FormData) {
  const admin = await requireAdmin();
  const id = n(fd, "id");
  const title = s(fd, "title");
  if (!title) return;
  const when = s(fd, "scheduledAt");
  const data = { title, description: s(fd, "description"), scheduledAt: when ? new Date(when) : null, recordingUrl: s(fd, "recordingUrl") || null, status: s(fd, "status") || "upcoming" };
  if (id) await db.update(mentorships).set(data).where(eq(mentorships.id, id));
  else { await db.insert(mentorships).values({ ...data, ownerUserId: admin.id }); await notifyAll(`Mentoria: ${title}`, "/mentorships", admin.id); }
  revalidatePath("/admin/mentorships"); revalidatePath("/mentorships");
}
export async function deleteMentorship(id: number) {
  await requireAdmin();
  await db.delete(mentorships).where(eq(mentorships.id, id));
  revalidatePath("/admin/mentorships"); revalidatePath("/mentorships");
}

// Students
export async function setUserRole(id: number, role: "member" | "admin") {
  const admin = await requireAdmin();
  if (id === admin.id) return;
  await db.update(users).set({ role }).where(eq(users.id, id));
  revalidatePath("/admin/students");
}
export async function deleteUser(id: number) {
  const admin = await requireAdmin();
  if (id === admin.id) return;
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin/students");
}

// Alunos: cadastro e redefinição de senha
export async function createStudent(fd: FormData) {
  await requireAdmin();
  const fullName = s(fd, "fullName");
  const email = s(fd, "email").toLowerCase();
  const password = s(fd, "password");
  const profession = s(fd, "profession") || PROFESSIONS[0];
  if (fullName.length < 2) redirect("/admin/students?erro=" + encodeURIComponent("Informe o nome do aluno."));
  if (!/^\S+@\S+\.\S+$/.test(email)) redirect("/admin/students?erro=" + encodeURIComponent("Informe um e-mail válido."));
  if (password.length < 8) redirect("/admin/students?erro=" + encodeURIComponent("A senha precisa ter no mínimo 8 caracteres."));

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) redirect("/admin/students?erro=" + encodeURIComponent("Já existe uma conta com este e-mail."));

  await db.insert(users).values({
    email, fullName, profession, role: "member", active: true,
    passwordHash: await hashPassword(password),
  });
  revalidatePath("/admin/students");
}

export async function resetStudentPassword(fd: FormData) {
  const admin = await requireAdmin();
  const id = n(fd, "id");
  const password = s(fd, "password");
  if (!id || password.length < 8) redirect("/admin/students?erro=" + encodeURIComponent("A senha precisa ter no mínimo 8 caracteres."));
  const [target] = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1);
  if (!target || id === admin.id) return;
  await db.update(users).set({ passwordHash: await hashPassword(password) }).where(eq(users.id, id));
  revalidatePath("/admin/students");
}

export async function toggleStudentActive(id: number) {
  const admin = await requireAdmin();
  if (id === admin.id) return;
  const [student] = await db.select({ id: users.id, role: users.role, active: users.active }).from(users).where(eq(users.id, id)).limit(1);
  if (!student || student.role !== "member") return;
  await db.update(users).set({ active: !student.active }).where(eq(users.id, id));
  revalidatePath("/admin/students");
}

// Notifications broadcast
export async function broadcast(fd: FormData) {
  const admin = await requireAdmin();
  const title = s(fd, "title");
  if (!title) return;
  const body = s(fd, "body");
  const link = s(fd, "link") || "/overview";
  const all = await db.select({ id: users.id }).from(users);
  await db.insert(notifications).values(all.map((u) => ({ userId: u.id, title, body, link })));
  revalidatePath("/admin/notifications");
  void admin;
}

// Site settings
export async function saveSettings(fd: FormData) {
  await requireAdmin();
  for (const key of ["highlight_title", "highlight_subtitle", "video_url", "video_title", "whatsapp_group", "instagram"]) {
    const value = s(fd, key);
    await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({ target: siteSettings.key, set: { value } });
  }
  revalidatePath("/admin/site-settings"); revalidatePath("/overview"); revalidatePath("/support");
}

// Podcasts
export async function savePodcast(fd: FormData) {
  const admin = await requireAdmin();
  const id = n(fd, "id");
  const title = s(fd, "title");
  const audioUrl = s(fd, "audioUrl");
  if (!title || !audioUrl) return;

  const data = {
    title,
    description: s(fd, "description") || null,
    audioUrl,
    subjectReference: s(fd, "subjectReference") || null,
    courseId: n(fd, "courseId") || null,
    durationMin: n(fd, "durationMin") || 10,
    coverUrl: s(fd, "coverUrl") || null,
  };

  if (id) {
    await db.update(podcasts).set(data).where(eq(podcasts.id, id));
  } else {
    await db.insert(podcasts).values({ ...data, ownerUserId: admin.id });
    await notifyAll(`Novo Podcast: ${title}`, "/podcasts", admin.id);
  }

  revalidatePath("/admin/podcasts");
  revalidatePath("/podcasts");
  revalidatePath("/overview");
}

export async function deletePodcast(id: number) {
  await requireAdmin();
  await db.delete(podcasts).where(eq(podcasts.id, id));
  revalidatePath("/admin/podcasts");
  revalidatePath("/podcasts");
  revalidatePath("/overview");
}

