"use client";

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";

export type OfflineLesson = { lessonId: number; title: string; course: string; slug: string; savedAt: string };
const KEY = "rcs-offline-lessons";

export function readOffline(): OfflineLesson[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function writeOffline(list: OfflineLesson[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function DownloadButton({ lessonId, title, course, slug }: { lessonId: number; title: string; course: string; slug: string }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => setSaved(readOffline().some((l) => l.lessonId === lessonId)), [lessonId]);

  function toggle() {
    const list = readOffline();
    if (saved) {
      writeOffline(list.filter((l) => l.lessonId !== lessonId));
      setSaved(false);
      return;
    }
    setBusy(true);
    setTimeout(() => {
      writeOffline([...list, { lessonId, title, course, slug, savedAt: new Date().toISOString() }]);
      setSaved(true);
      setBusy(false);
    }, 900);
  }

  return (
    <button onClick={toggle} disabled={busy} className="btn-outline" title="Baixar para assistir offline">
      {saved ? <Check className="h-4 w-4 text-primary" /> : <Download className="h-4 w-4" />}
      {busy ? "Baixando aula…" : saved ? "Baixada" : "Baixar aula"}
    </button>
  );
}
