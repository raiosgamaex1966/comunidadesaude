import Link from "next/link";
import { desc, eq, sql, ne, and } from "drizzle-orm";
import { Heart, MessageSquare, Trash2, Users } from "lucide-react";
import { db } from "@/db";
import { posts, users, follows, news } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { addPostComment, createPost, deletePost, toggleFollow, toggleLike } from "@/lib/actions";
import { Avatar } from "@/components/Shell";
import { PageHero } from "@/components/PageHero";
import { cn, timeAgo } from "@/lib/utils";
import { PROFESSIONS } from "@/lib/concursos";
import { PostComments } from "./PostComments";

export const metadata = { title: "Comunidade" };
const TOPICS = ["Geral", "Editais", "Rotina de estudos", "Português", "Raciocínio Lógico", "SUS", "Legislação", ...PROFESSIONS, "Avisos"];

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ tema?: string; feed?: string }> }) {
  const user = await requireUser();
  const { tema, feed } = await searchParams;

  const followingRows = await db.select({ id: follows.followingId }).from(follows).where(eq(follows.followerId, user.id));
  const following = new Set(followingRows.map((f) => f.id));

  const list = await db
    .select({
      id: posts.id, content: posts.content, topic: posts.topic, imageUrl: posts.imageUrl, createdAt: posts.createdAt, userId: posts.userId,
      author: { id: users.id, fullName: users.fullName, avatarUrl: users.avatarUrl, role: users.role },
      likes: sql<number>`(select count(*) from post_likes l where l.post_id = ${posts.id})`,
      liked: sql<boolean>`exists(select 1 from post_likes l where l.post_id = ${posts.id} and l.user_id = ${user.id})`,
      comments: sql<number>`(select count(*) from post_comments c where c.post_id = ${posts.id})`,
    })
    .from(posts).innerJoin(users, eq(posts.userId, users.id))
    .where(tema ? eq(posts.topic, tema) : undefined)
    .orderBy(desc(posts.createdAt)).limit(50);
  const shown = feed === "seguindo" ? list.filter((p) => following.has(p.userId)) : list;

  const [suggestions, latestNews, online] = await Promise.all([
    db.select({ id: users.id, fullName: users.fullName, avatarUrl: users.avatarUrl, bio: users.bio, country: users.country }).from(users).where(ne(users.id, user.id)).orderBy(desc(users.createdAt)).limit(5),
    db.select({ id: news.id, title: news.title }).from(news).orderBy(desc(news.createdAt)).limit(3),
    db.select({ n: sql<number>`count(*)` }).from(users).where(and(ne(users.id, user.id), eq(users.role, "admin"))),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHero title="Comunidade" lead="Troque dúvidas, estratégias de estudo e notícias de editais com outros concurseiros da saúde." />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <form action={createPost} className="card p-4">
            <div className="flex gap-3">
              <Avatar user={user} size={40} />
              <div className="flex-1 space-y-2">
                <textarea name="content" rows={3} required placeholder="Compartilhe uma dúvida, dica de estudo ou novidade de edital…" className="input resize-none" />
                <div className="flex flex-wrap items-center gap-2">
                  <select name="topic" className="input h-9 w-auto" defaultValue="Geral" title="Tema">
                    {TOPICS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <input name="imageUrl" placeholder="Link da imagem (https://…)" className="input h-9 flex-1" />
                  <button className="btn-primary h-9">Publicar</button>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">Escolha um tema para encontrar colegas da área. Respeite os colegas e não compartilhe material protegido por direitos autorais nem dados pessoais de terceiros.</p>
              </div>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link href="/community" className={cn("badge px-3 py-1", !feed && !tema ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground")}>Todos</Link>
            <Link href="/community?feed=seguindo" className={cn("badge px-3 py-1", feed === "seguindo" ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground")}>Seguindo</Link>
            <span className="mx-1 h-4 w-px bg-border" />
            {TOPICS.map((t) => (
              <Link key={t} href={`/community?tema=${t}`} className={cn("badge px-3 py-1", tema === t ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground")}>{t}</Link>
            ))}
          </div>

          <ul className="mt-4 space-y-4">
            {shown.length === 0 && (
              <li className="card p-8 text-center text-sm text-muted-foreground">
                {feed === "seguindo" ? "Você ainda não segue profissionais que tenham publicado. Siga membros nas sugestões para acompanhar as conversas." : tema ? `Ainda não há publicações em ${tema}. Comece a conversa!` : "Ainda não há publicações. Conte à comunidade qual concurso você está preparando."}
              </li>
            )}
            {shown.map((p) => (
              <li key={p.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <Link href={`/perfil/${p.author.id}`}><Avatar user={p.author} size={40} /></Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 text-sm">
                      <Link href={`/perfil/${p.author.id}`} className="font-semibold hover:underline">{p.author.fullName}</Link>
                      <span className="badge">{p.author.role === "admin" ? "Instrutor" : "Membro"}</span>
                      <span className="text-muted-foreground">· {timeAgo(p.createdAt)} · {p.topic}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm">{p.content}</p>
                    {p.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="Publicação com imagem" className="mt-3 max-h-96 rounded-xl border border-border object-cover" />
                    )}
                    <div className="mt-3 flex items-center gap-1">
                      <form action={toggleLike.bind(null, p.id)}>
                        <button className={cn("btn-ghost h-8 px-2 text-xs", p.liked && "text-primary")}><Heart className={cn("h-4 w-4", p.liked && "fill-primary")} /> {Number(p.likes)}</button>
                      </form>
                      <span className="btn-ghost h-8 px-2 text-xs"><MessageSquare className="h-4 w-4" /> {Number(p.comments)}</span>
                      {(p.userId === user.id || user.role === "admin") && (
                        <form action={deletePost.bind(null, p.id)} className="ml-auto">
                          <button className="btn-ghost h-8 px-2 text-xs text-destructive" aria-label="Excluir"><Trash2 className="h-4 w-4" /></button>
                        </form>
                      )}
                    </div>
                    <PostComments postId={p.id} count={Number(p.comments)} action={addPostComment} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4">
          <div className="card p-4">
            <p className="mb-3 font-serif text-lg font-semibold">O meu perfil</p>
            <div className="flex items-center gap-3">
              <Avatar user={user} size={44} />
              <div className="min-w-0"><p className="truncate font-semibold">{user.fullName}</p><p className="text-xs text-muted-foreground">Seguindo {following.size} · {Number(online[0]?.n ?? 0)} instrutores</p></div>
            </div>
            <Link href={`/perfil/${user.id}`} className="btn-outline mt-3 w-full">Ver perfil</Link>
          </div>
          <div className="card p-4">
            <p className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold"><Users className="h-4 w-4 text-primary" /> Sugestões</p>
            <ul className="space-y-3">
              {suggestions.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <Link href={`/perfil/${s.id}`}><Avatar user={s} size={32} /></Link>
                  <div className="min-w-0 flex-1"><Link href={`/perfil/${s.id}`} className="block truncate text-sm font-semibold hover:underline">{s.fullName}</Link><p className="truncate text-xs text-muted-foreground">{s.country}</p></div>
                  <form action={toggleFollow.bind(null, s.id)}><button className={cn("badge px-2.5 py-1", following.has(s.id) ? "text-muted-foreground" : "border-primary text-primary")}>{following.has(s.id) ? "Seguindo" : "Seguir"}</button></form>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-4">
            <p className="mb-2 font-serif text-lg font-semibold">Novidades</p>
            {latestNews.length === 0 && <p className="text-sm text-muted-foreground">Sem novidades por enquanto.</p>}
            <ul className="space-y-1">{latestNews.map((n) => <li key={n.id}><Link href={`/news/${n.id}`} className="block rounded-lg px-2 py-1.5 text-sm hover:bg-accent">{n.title}</Link></li>)}</ul>
            <Link href="/news" className="mt-2 block text-xs font-semibold text-primary">Ver notícias →</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
