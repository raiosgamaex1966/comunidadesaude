"use client";

import { useState } from "react";
import { initials, timeAgo } from "@/lib/utils";

type C = { id: number; content: string; createdAt: string; author: { fullName: string; avatarUrl: string | null } };

export function PostComments({ postId, count, action }: { postId: number; count: number; action: (fd: FormData) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<C[] | null>(null);

  async function load() {
    const r = await fetch(`/api/comments?postId=${postId}`);
    setItems(await r.json());
  }
  function toggle() {
    const n = !open;
    setOpen(n);
    if (n && !items) load();
  }

  return (
    <div className="mt-2">
      <button onClick={toggle} className="text-xs font-semibold text-primary hover:underline">
        {open ? "Ocultar comentários" : count ? `Ver ${count} comentário${count > 1 ? "s" : ""}` : "Comentar"}
      </button>
      {open && (
        <div className="mt-3 space-y-3 border-l-2 border-border pl-3">
          {(items ?? []).map((c) => (
            <div key={c.id} className="flex gap-2">
              {c.author.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.author.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary">{initials(c.author.fullName)}</span>
              )}
              <div><p className="text-xs font-semibold">{c.author.fullName} <span className="font-normal text-muted-foreground">· {timeAgo(c.createdAt)}</span></p><p className="text-sm">{c.content}</p></div>
            </div>
          ))}
          <form
            action={async (fd) => {
              await action(fd);
              await load();
            }}
            className="flex gap-2"
          >
            <input type="hidden" name="postId" value={postId} />
            <input name="content" required placeholder="Escreva um comentário…" className="input h-9" />
            <button className="btn-primary h-9 shrink-0">Enviar</button>
          </form>
        </div>
      )}
    </div>
  );
}
