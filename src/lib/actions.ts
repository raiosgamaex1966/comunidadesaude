"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  calls, enrollments, lessonComments, lessonProgress, lessons, notes, notifications, postComments, postLikes, posts,
  savedItems, supportMessages, users, follows, examTargets,
} from "@/db/schema";
import { requireUser } from "@/lib/auth";

// ---------- Courses ----------
export async function enrollAction(courseId: number, slug: string) {
  const user = await requireUser();
  await db.insert(enrollments).values({ userId: user.id, courseId }).onConflictDoNothing();
  revalidatePath(`/courses/${slug}`);
}

export async function toggleLessonComplete(lessonId: number, slug: string) {
  const user = await requireUser();
  const [l] = await db.select({ courseId: lessons.courseId }).from(lessons).where(eq(lessons.id, lessonId));
  if (!l) return;
  const existing = await db.select({ id: lessonProgress.id }).from(lessonProgress).where(and(eq(lessonProgress.userId, user.id), eq(lessonProgress.lessonId, lessonId)));
  if (existing.length) {
    await db.delete(lessonProgress).where(eq(lessonProgress.id, existing[0].id));
  } else {
    await db.insert(enrollments).values({ userId: user.id, courseId: l.courseId }).onConflictDoNothing();
    await db.insert(lessonProgress).values({ userId: user.id, lessonId, courseId: l.courseId });
  }
  revalidatePath(`/courses/${slug}`);
  revalidatePath("/overview");
  revalidatePath("/my-learning");
}

export async function addLessonComment(formData: FormData) {
  const user = await requireUser();
  const lessonId = Number(formData.get("lessonId"));
  const slug = String(formData.get("slug"));
  const content = String(formData.get("content") ?? "").trim();
  if (!content || !lessonId) return;
  await db.insert(lessonComments).values({ lessonId, userId: user.id, content });
  revalidatePath(`/courses/${slug}`);
}

// ---------- Community ----------
export async function createPost(formData: FormData) {
  const user = await requireUser();
  const content = String(formData.get("content") ?? "").trim();
  const topic = String(formData.get("topic") ?? "Geral");
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  if (!content) return;
  await db.insert(posts).values({ userId: user.id, content, topic, imageUrl: imageUrl.startsWith("https://") ? imageUrl : null });
  revalidatePath("/community");
}

export async function deletePost(postId: number) {
  const user = await requireUser();
  const [p] = await db.select({ userId: posts.userId }).from(posts).where(eq(posts.id, postId));
  if (!p) return;
  if (p.userId !== user.id && user.role !== "admin") return;
  await db.delete(posts).where(eq(posts.id, postId));
  revalidatePath("/community");
}

export async function toggleLike(postId: number) {
  const user = await requireUser();
  const ex = await db.select({ id: postLikes.id }).from(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, user.id)));
  if (ex.length) await db.delete(postLikes).where(eq(postLikes.id, ex[0].id));
  else {
    await db.insert(postLikes).values({ postId, userId: user.id });
    const [p] = await db.select({ userId: posts.userId }).from(posts).where(eq(posts.id, postId));
    if (p && p.userId !== user.id) {
      await db.insert(notifications).values({ userId: p.userId, title: `${user.fullName} curtiu sua publicação`, link: "/community" });
    }
  }
  revalidatePath("/community");
}

export async function addPostComment(formData: FormData) {
  const user = await requireUser();
  const postId = Number(formData.get("postId"));
  const content = String(formData.get("content") ?? "").trim();
  if (!content || !postId) return;
  await db.insert(postComments).values({ postId, userId: user.id, content });
  const [p] = await db.select({ userId: posts.userId }).from(posts).where(eq(posts.id, postId));
  if (p && p.userId !== user.id) {
    await db.insert(notifications).values({ userId: p.userId, title: `${user.fullName} comentou sua publicação`, body: content.slice(0, 80), link: "/community" });
  }
  revalidatePath("/community");
}

export async function toggleFollow(targetId: number) {
  const user = await requireUser();
  if (targetId === user.id) return;
  const ex = await db.select({ id: follows.id }).from(follows).where(and(eq(follows.followerId, user.id), eq(follows.followingId, targetId)));
  if (ex.length) await db.delete(follows).where(eq(follows.id, ex[0].id));
  else {
    await db.insert(follows).values({ followerId: user.id, followingId: targetId });
    await db.insert(notifications).values({ userId: targetId, title: `${user.fullName} começou a seguir você`, link: `/perfil/${user.id}` });
  }
  revalidatePath("/community");
  revalidatePath(`/perfil/${targetId}`);
}

// ---------- Saved ----------
export async function toggleSaved(kind: string, refId: number, path: string) {
  const user = await requireUser();
  const ex = await db.select({ id: savedItems.id }).from(savedItems).where(and(eq(savedItems.userId, user.id), eq(savedItems.kind, kind), eq(savedItems.refId, refId)));
  if (ex.length) await db.delete(savedItems).where(eq(savedItems.id, ex[0].id));
  else await db.insert(savedItems).values({ userId: user.id, kind, refId });
  revalidatePath(path);
  revalidatePath("/saved");
}

// ---------- Notes ----------
export async function createNote(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim() || "Novo mapa";
  const folder = String(formData.get("folder") ?? "Geral").trim() || "Geral";
  const [n] = await db.insert(notes).values({ userId: user.id, title, folder }).returning();
  redirect(`/anotacoes/${n.id}`);
}

export async function updateNote(formData: FormData) {
  const user = await requireUser();
  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim() || "Sem título";
  const content = String(formData.get("content") ?? "");
  const folder = String(formData.get("folder") ?? "Geral").trim() || "Geral";
  await db.update(notes).set({ title, content, folder, updatedAt: new Date() }).where(and(eq(notes.id, id), eq(notes.userId, user.id)));
  revalidatePath(`/anotacoes/${id}`);
  revalidatePath("/anotacoes");
}

export async function toggleNoteFavorite(id: number) {
  const user = await requireUser();
  const [n] = await db.select({ favorite: notes.favorite }).from(notes).where(and(eq(notes.id, id), eq(notes.userId, user.id)));
  if (!n) return;
  await db.update(notes).set({ favorite: !n.favorite }).where(eq(notes.id, id));
  revalidatePath("/anotacoes");
  revalidatePath(`/anotacoes/${id}`);
}

export async function deleteNote(id: number) {
  const user = await requireUser();
  await db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, user.id)));
  redirect("/anotacoes");
}

// ---------- Support ----------
export async function sendSupportMessage(formData: FormData) {
  const user = await requireUser();
  const content = String(formData.get("content") ?? "").trim();
  const targetUserId = Number(formData.get("userId") ?? user.id) || user.id;
  if (!content) return;
  const owner = user.role === "admin" ? targetUserId : user.id;
  await db.insert(supportMessages).values({ userId: owner, senderId: user.id, content });
  if (user.role === "admin" && owner !== user.id) {
    await db.insert(notifications).values({ userId: owner, title: "O suporte respondeu", body: content.slice(0, 80), link: "/support" });
  } else {
    const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, "admin"));
    for (const a of admins) {
      if (a.id !== user.id) await db.insert(notifications).values({ userId: a.id, title: `${user.fullName} escreveu no suporte`, body: content.slice(0, 80), link: `/admin/support/${owner}` });
    }
  }
  revalidatePath("/support");
  revalidatePath(`/admin/support/${owner}`);
}

// ---------- Settings ----------
export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const country = String(formData.get("country") ?? "Brasil");
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  const profession = String(formData.get("profession") ?? "").trim();
  if (fullName.length < 2) return;
  await db.update(users).set({ fullName, bio, whatsapp, country, avatarUrl: avatarUrl || null, profession: profession || null }).where(eq(users.id, user.id));
  revalidatePath("/settings");
  revalidatePath("/", "layout");
}

// ---------- Calls ----------
export async function createCall(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim() || "Chamada";
  const when = String(formData.get("scheduledAt") ?? "");
  const now = formData.get("now") === "1";
  const guests = formData.get("guests") === "on";
  const code = `rcs-${Math.random().toString(36).slice(2, 8)}`;
  await db.insert(calls).values({ code, title, hostId: user.id, scheduledAt: when ? new Date(when) : now ? new Date() : null, status: now ? "live" : "scheduled", guestsAllowed: guests });
  if (now) {
    const all = await db.select({ id: users.id }).from(users);
    for (const u of all) if (u.id !== user.id) await db.insert(notifications).values({ userId: u.id, title: `Chamada ao vivo: ${title}`, link: `/chamadas/${code}` });
  }
  revalidatePath("/chamadas");
  if (now) redirect(`/chamadas/${code}`);
}

export async function setCallStatus(code: string, status: "live" | "ended") {
  const user = await requireUser();
  const [c] = await db.select().from(calls).where(eq(calls.code, code));
  if (!c || (c.hostId !== user.id && user.role !== "admin")) return;
  await db.update(calls).set({ status }).where(eq(calls.id, c.id));
  revalidatePath("/chamadas");
  revalidatePath(`/chamadas/${code}`);
}

export async function deleteCall(id: number) {
  const user = await requireUser();
  const [c] = await db.select().from(calls).where(eq(calls.id, id));
  if (!c || (c.hostId !== user.id && user.role !== "admin")) return;
  await db.delete(calls).where(eq(calls.id, id));
  revalidatePath("/chamadas");
}

// ---------- Meu concurso ----------
export async function createExamTarget(formData: FormData) {
  const user = await requireUser();
  const organ = String(formData.get("organ") ?? "").trim();
  const sphere = String(formData.get("sphere") ?? "federal");
  const profession = String(formData.get("profession") ?? "").trim();
  if (!organ || !profession) return;
  const date = String(formData.get("examDate") ?? "");
  await db.insert(examTargets).values({
    userId: user.id, organ, sphere, profession,
    location: String(formData.get("location") ?? "").trim() || null,
    banca: String(formData.get("banca") ?? "").trim() || null,
    examDate: date ? new Date(`${date}T12:00:00`) : null,
  });
  revalidatePath("/concursos");
}

export async function deleteExamTarget(id: number) {
  const user = await requireUser();
  await db.delete(examTargets).where(and(eq(examTargets.id, id), eq(examTargets.userId, user.id)));
  revalidatePath("/concursos");
}
