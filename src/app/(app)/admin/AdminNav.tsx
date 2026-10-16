"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  ["/admin", "Visão geral"], ["/admin/courses", "Gerir cursos"], ["/admin/podcasts", "Gerir podcasts"], ["/admin/materials", "Gerir materiais"], ["/admin/news", "Gerir notícias"],
  ["/admin/mentorships", "Gerir mentorias"], ["/admin/students", "Alunos"], ["/admin/support", "Atendimento"], ["/admin/notifications", "Notificações"], ["/admin/site-settings", "Aparência"],
];

export function AdminNav() {
  const p = usePathname();
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Painel de gestão</p>
      <div className="scrollbar-thin mt-2 flex gap-2 overflow-x-auto pb-1">
        {ITEMS.map(([to, l]) => (
          <Link key={to} href={to} className={cn("badge shrink-0 px-3 py-1.5", (to === "/admin" ? p === to : p.startsWith(to)) ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}>{l}</Link>
        ))}
      </div>
    </div>
  );
}
