import { notFound } from "next/navigation";
import { desc, eq, sql, and } from "drizzle-orm";
import { db } from "@/db";
import { users, posts, follows, lessonProgress } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { toggleFollow } from "@/lib/actions";
import { Avatar } from "@/components/Shell";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const me = await requireUser();
  const id = Number((await params).userId);
  const [u] = await db.select().from(users).where(eq(users.id, id));
  if (!u) notFound();
  const [ps, followers, following, done, isFollowing] = await Promise.all([
    db.select().from(posts).where(eq(posts.userId, id)).orderBy(desc(posts.createdAt)).limit(20),
    db.select({ n: sql<number>`count(*)` }).from(follows).where(eq(follows.followingId, id)),
    db.select({ n: sql<number>`count(*)` }).from(follows).where(eq(follows.followerId, id)),
    db.select({ n: sql<number>`count(*)` }).from(lessonProgress).where(eq(lessonProgress.userId, id)),
    db.select({ id: follows.id }).from(follows).where(and(eq(follows.followerId, me.id), eq(follows.followingId, id))),
  ]);
  return (
    <div className="mx-auto max-w-3xl">
      <div className="card glow p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar user={u} size={72} />
          <div className="flex-1">
            <h1 className="font-serif text-2xl font-semibold">{u.fullName}</h1>
            <p className="text-sm text-muted-foreground">{u.role === "admin" ? "Instrutor" : "Membro"} · {u.country} · desde {new Date(u.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}</p>
            {u.bio && <p className="mt-2 text-sm">{u.bio}</p>}
          </div>
          {me.id !== id ? (
            <form action={toggleFollow.bind(null, id)}><button className={isFollowing.length ? "btn-outline" : "btn-primary"}>{isFollowing.length ? "Seguindo" : "Seguir"}</button></form>
          ) : (
            <Link href="/settings" className="btn-outline">Editar perfil</Link>
          )}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          {[[Number(followers[0].n), "Seguidores"], [Number(following[0].n), "Seguindo"], [Number(done[0].n), "Aulas concluídas"]].map(([v, l]) => (
            <div key={l} className="rounded-xl bg-muted p-3"><p className="font-serif text-2xl font-semibold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>
          ))}
        </div>
      </div>
      <h2 className="mb-3 mt-8 font-serif text-xl font-semibold">Publicações</h2>
      {ps.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma publicação ainda.</p>}
      <ul className="space-y-3">{ps.map((p) => <li key={p.id} className="card p-4"><p className="text-xs text-muted-foreground">{p.topic} · {timeAgo(p.createdAt)}</p><p className="mt-1 whitespace-pre-wrap text-sm">{p.content}</p></li>)}</ul>
    </div>
  );
}
