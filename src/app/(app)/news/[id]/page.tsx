import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { news, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { getSavedSet } from "@/lib/queries";
import { SaveButton } from "@/components/SaveButton";
import { timeAgo } from "@/lib/utils";

export default async function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = Number((await params).id);
  const [n] = await db.select({ id: news.id, title: news.title, content: news.content, kind: news.kind, coverUrl: news.coverUrl, videoUrl: news.videoUrl, createdAt: news.createdAt, author: users.fullName }).from(news).leftJoin(users, eq(news.authorId, users.id)).where(eq(news.id, id));
  if (!n) notFound();
  const saved = await getSavedSet(user.id, "news");
  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/news" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Notícias</Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="badge border-primary/40 text-primary">{n.kind === "short" ? "Vídeo curto" : "Artigo"}</span>
          <h1 className="page-title mt-3">{n.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{n.author} · {timeAgo(n.createdAt)}</p>
        </div>
        <SaveButton kind="news" refId={n.id} saved={saved.has(n.id)} path={`/news/${n.id}`} />
      </div>
      {n.videoUrl && <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-border bg-black"><iframe src={n.videoUrl} title={n.title} className="h-full w-full" allowFullScreen /></div>}
      {!n.videoUrl && n.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={n.coverUrl} alt="" className="mt-6 aspect-[16/8] w-full rounded-2xl border border-border object-cover" />
      )}
      <div className="prose-basic mt-6 text-[15px]">{n.content.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}</div>
    </article>
  );
}
