"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, WifiOff } from "lucide-react";
import { readOffline, writeOffline, type OfflineLesson } from "../courses/[slug]/DownloadButton";
import { timeAgo } from "@/lib/utils";

export function DownloadsList() {
  const [list, setList] = useState<OfflineLesson[]>([]);
  useEffect(() => setList(readOffline()), []);
  function remove(id: number) { const n = list.filter((l) => l.lessonId !== id); writeOffline(n); setList(n); }
  if (list.length === 0) return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <WifiOff className="mb-2 h-8 w-8 text-muted-foreground" />
      <p className="font-serif text-lg font-semibold">Nenhuma aula baixada</p>
      <p className="mt-1 text-sm text-muted-foreground">Abra uma aula e toque em “Baixar aula” para guardá-la neste aparelho.</p>
      <Link href="/courses" className="btn-primary mt-4">Ver cursos</Link>
    </div>
  );
  return (
    <ul className="card divide-y divide-border">
      {list.map((l) => (
        <li key={l.lessonId} className="flex items-center gap-3 px-4 py-3">
          <Link href={`/courses/${l.slug}`} className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{l.title}</p><p className="text-xs text-muted-foreground">{l.course} · baixada {timeAgo(l.savedAt)}</p></Link>
          <button onClick={() => remove(l.lessonId)} className="btn-ghost h-8 px-2 text-destructive" aria-label="Remover"><Trash2 className="h-4 w-4" /></button>
        </li>
      ))}
    </ul>
  );
}
