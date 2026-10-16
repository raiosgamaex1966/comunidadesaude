"use client";

import { useEffect, useState } from "react";

const PREFS = [
  ["lessons", "Aulas novas", "Quando sai uma aula nova num curso"],
  ["mentorships", "Mentorias e eventos", "Mentorias ao vivo e novidades de agenda"],
  ["news", "Notícias", "Centro de atualizações"],
  ["materials", "Materiais novos", "Templates, sistemas e arquivos"],
  ["posts", "Publicações na comunidade", "Quando alguém publica"],
  ["comments", "Comentários", "Nas suas publicações e aulas que comentou"],
  ["likes", "Curtidas", "Reações às suas publicações"],
  ["followers", "Novos seguidores", "Quando alguém começa a seguir você"],
] as const;

export function NotificationPrefs() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  useEffect(() => { try { setPrefs(JSON.parse(localStorage.getItem("rcs-notif-prefs") || "{}")); } catch {} }, []);
  function toggle(k: string) { const n = { ...prefs, [k]: !(prefs[k] ?? true) }; setPrefs(n); localStorage.setItem("rcs-notif-prefs", JSON.stringify(n)); }
  return (
    <div className="card p-6">
      <h2 className="mb-4 font-serif text-xl font-semibold">Notificações</h2>
      <ul className="divide-y divide-border">
        {PREFS.map(([k, t, d]) => {
          const on = prefs[k] ?? true;
          return (
            <li key={k} className="flex items-center justify-between gap-4 py-3">
              <div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
              <button role="switch" aria-checked={on} onClick={() => toggle(k)} className={`relative h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${on ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
