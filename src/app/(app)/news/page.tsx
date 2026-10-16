import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { news, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getSavedSet } from "@/lib/queries";
import { Empty, PageHero } from "@/components/PageHero";
import { SaveButton } from "@/components/SaveButton";
import { cn, timeAgo } from "@/lib/utils";
import { PlayCircle } from "lucide-react";

export const metadata = { title: "Atualizações" };

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const user = await requireUser();
  const { tipo = "Todas" } = await searchParams;
  const [all, saved] = await Promise.all([
    db.select({ id: news.id, title: news.title, content: news.content, kind: news.kind, coverUrl: news.coverUrl, createdAt: news.createdAt, author: users.fullName }).from(news).leftJoin(users, eq(news.authorId, users.id)).orderBy(desc(news.createdAt)),
    getSavedSet(user.id, "news"),
  ]);
  const list = all.filter((n) => tipo === "Todas" || (tipo === "Artigos" ? n.kind === "article" : n.kind === "short"));
  return (
    <div className="mx-auto max-w-5xl">
      <PageHero title="Atualizações" lead="Dicas de estudo, estratégias e orientações para acompanhar editais e planejar sua preparação." />
      <div className="mb-5 flex gap-2">{["Todas", "Artigos", "Vídeos curtos"].map((t) => <Link key={t} href={`/news?tipo=${t}`} className={cn("badge px-3 py-1", tipo === t ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground")}>{t}</Link>)}</div>
      {list.length === 0 ? <Empty title="Ainda não há notícias" lead="As novidades aparecem aqui assim que forem publicadas." /> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((n) => (
            <div key={n.id} className="card group overflow-hidden">
              <Link href={`/news/${n.id}`}>
                <div className="relative aspect-[16/8] bg-muted">
                  {n.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.coverUrl} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : <div className="glow flex h-full items-center justify-center text-primary">{n.kind === "short" && <PlayCircle className="h-10 w-10" />}</div>}
                  <span className="badge absolute left-3 top-3 bg-background/80">{n.kind === "short" ? "Vídeo curto" : "Artigo"}</span>
                </div>
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/news/${n.id}`} className="font-serif text-lg font-semibold leading-tight hover:underline">{n.title}</Link>
                  <SaveButton kind="news" refId={n.id} saved={saved.has(n.id)} path="/news" small />
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">{n.author} · {timeAgo(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
