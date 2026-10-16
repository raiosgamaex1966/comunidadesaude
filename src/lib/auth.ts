import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { and, eq, gt } from "drizzle-orm";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";

export const SESSION_COOKIE = "rcs_session";
const SESSION_DAYS = 30;

export type SessionUser = {
  id: number;
  email: string;
  fullName: string;
  role: string;
  active: boolean;
  avatarUrl: string | null;
  bio: string | null;
  whatsapp: string | null;
  country: string | null;
  profession: string | null;
  createdAt: Date;
};

const userSelection = {
  id: users.id,
  email: users.email,
  fullName: users.fullName,
  role: users.role,
  active: users.active,
  avatarUrl: users.avatarUrl,
  bio: users.bio,
  whatsapp: users.whatsapp,
  country: users.country,
  profession: users.profession,
  createdAt: users.createdAt,
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number) {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({ id, userId, expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession() {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (id) await db.delete(sessions).where(eq(sessions.id, id));
  store.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  await ensureSeeded();
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const [user] = await db
    .select(userSelection)
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date()), eq(users.active, true)))
    .limit(1);
  return user ?? null;
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/overview");
  return user;
}
