"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Home, BookOpen, Users, FileText, Newspaper, Video, GraduationCap, Bookmark, NotebookPen, Webcam,
  Download, Settings, LifeBuoy, Menu, X, Sun, Moon, Bell, Search, Shield, LayoutDashboard, HeartPulse, Target, LogOut,
  Headphones,
} from "lucide-react";
import { Logo, LogoMark } from "./Logo";
import { cn, initials } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { to: "/overview", label: "Início", icon: Home, group: "Sua comunidade" },
  { to: "/concursos", label: "Meu concurso", icon: Target, group: "Sua comunidade" },
  { to: "/courses", label: "Matérias", icon: BookOpen, group: "Aprender e compartilhar" },
  { to: "/podcasts", label: "Podcasts", icon: Headphones, group: "Aprender e compartilhar" },
  { to: "/community", label: "Comunidade", icon: Users, group: "Aprender e compartilhar" },
  { to: "/materials", label: "Biblioteca", icon: FileText, group: "Aprender e compartilhar" },
  { to: "/news", label: "Atualizações", icon: Newspaper, group: "Aprender e compartilhar" },
  { to: "/mentorships", label: "Encontros", icon: Video, group: "Sua comunidade" },
  { to: "/chamadas", label: "Salas ao vivo", icon: Webcam, group: "Sua comunidade" },
  { to: "/my-learning", label: "Minha jornada", icon: GraduationCap, group: "Aprender e compartilhar" },
  { to: "/saved", label: "Salvos", icon: Bookmark, group: "Sua comunidade" },
  { to: "/anotacoes", label: "Anotações", icon: NotebookPen, group: "Aprender e compartilhar" },
  { to: "/downloads", label: "Aulas baixadas", icon: Download, group: "Aprender e compartilhar" },
  { to: "/settings", label: "Configurações", icon: Settings, group: "Conta" },
  { to: "/support", label: "Suporte", icon: LifeBuoy, group: "Conta" },
];

const MOBILE = ["/overview", "/courses", "/concursos", "/community", "/my-learning"];

export type Notif = { id: number; title: string; body: string | null; link: string | null; read: boolean };

export function Shell({ user, unread, notifs, children }: { user: SessionUser; unread: number; notifs: Notif[]; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [unreadCount, setUnreadCount] = useState(unread);
  const [items, setItems] = useState<Notif[]>(notifs);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => setUnreadCount(unread), [unread]);
  useEffect(() => setItems(notifs), [notifs]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifOpen]);

  async function markAllAsRead() {
    if (unreadCount > 0 || items.some((n) => !n.read)) {
      setUnreadCount(0);
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
      try {
        await fetch("/api/notifications/read", {
          method: "POST",
          headers: { Accept: "application/json" },
        });
      } catch (e) {
        console.error("Erro ao marcar notificações como lidas", e);
      }
    }
  }

  function handleToggleNotif() {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next && (unreadCount > 0 || items.some((n) => !n.read))) {
      markAllAsRead();
    }
  }

  useEffect(() => {
    const t = (localStorage.getItem("rcs-theme") as "dark" | "light") || "light";
    setTheme(t);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("rcs-theme", next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
  }

  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Menu principal">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/overview" aria-label="RCS Prime Comunity — página inicial">
          <Logo size={30} />
        </Link>
        <button className="btn-ghost p-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Esconder menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
        {groups.map((g) => (
          <div key={g} className="mb-4">
            <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{g}</p>
            <ul className="space-y-0.5">
              {NAV.filter((n) => n.group === g).map(({ to, label, icon: Icon }) => {
                const active = pathname.startsWith(to);
                return (
                  <li key={to}>
                    <Link
                      href={to}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                        active ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {user.role === "admin" && (
          <div className="mb-4">
            <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Admin</p>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                pathname.startsWith("/admin") ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <LayoutDashboard className="h-4 w-4" /> Painel de gestão
            </Link>
          </div>
        )}
      </div>
      <div className="mx-3 mb-3 rounded-2xl bg-accent p-3.5">
        <HeartPulse className="mb-2 h-5 w-5 text-primary" />
        <p className="text-xs font-bold text-foreground">Edital em primeiro lugar.</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Confirme sempre conteúdo programático e legislação vigente no edital do seu concurso.</p>
      </div>
      <div className="border-t border-border p-3">
        <Link href="/settings" className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-accent">
          <Avatar user={user} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.role === "admin" ? "Administrador" : "Aluno"}</p>
          </div>
          {user.role === "admin" && <Shield className="h-4 w-4 text-primary" />}
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-border bg-card/60 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] bg-card shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-4 sm:px-6">
            <button className="btn-ghost p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Mostrar menu">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/overview" className="lg:hidden"><LogoMark size={28} /></Link>
            <form action="/courses" className="ml-auto hidden items-center sm:flex">
              <div className="flex items-center gap-2 rounded-[0.75rem] border border-border bg-background px-3 h-9 w-56 focus-within:border-primary focus-within:ring-[3px]">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input name="q" placeholder="Buscar matérias" className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
              </div>
            </form>
            <div ref={notifRef} className="relative ml-auto sm:ml-0">
              <button
                type="button"
                className="btn-ghost relative p-2"
                onClick={handleToggleNotif}
                aria-label="Notificações"
                aria-haspopup="menu"
                aria-expanded={notifOpen}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="card absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-84 max-w-sm overflow-hidden shadow-2xl z-50 border border-border bg-card">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <p className="text-sm font-bold text-foreground">Notificações</p>
                    </div>
                    {items.some((n) => !n.read) && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Marcar todas como lidas
                      </button>
                    )}
                  </div>
                  <ul className="max-h-80 overflow-y-auto divide-y divide-border">
                    {items.length === 0 ? (
                      <li className="px-4 py-8 text-center">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
                          <Bell className="h-5 w-5 opacity-70" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Tudo em dia!</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Você não possui novas notificações.</p>
                      </li>
                    ) : (
                      items.map((n) => (
                        <li
                          key={n.id}
                          className={cn(
                            "p-3.5 transition hover:bg-accent/50",
                            !n.read ? "bg-primary/5 font-medium" : "opacity-85",
                          )}
                        >
                          <Link
                            href={n.link ?? "#"}
                            onClick={() => setNotifOpen(false)}
                            className="block group"
                          >
                            <div className="flex items-start gap-2.5">
                              <span
                                className={cn(
                                  "mt-1.5 h-2 w-2 rounded-full shrink-0",
                                  !n.read ? "bg-primary" : "bg-transparent",
                                )}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                                  {n.title}
                                </p>
                                {n.body && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                    {n.body}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
            <button className="btn-ghost p-2" onClick={toggleTheme} aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <form action="/api/auth/logout" method="post">
              <button className="btn-ghost p-2" aria-label="Sair" title="Sair"><LogOut className="h-5 w-5" /></button>
            </form>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden" aria-label="Navegação rápida">
          {NAV.filter((n) => MOBILE.includes(n.to)).map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link key={to} href={to} className={cn("flex flex-col items-center gap-1 py-2 text-[10px] font-semibold", active ? "text-primary" : "text-muted-foreground")}>
                <Icon className="h-5 w-5" />
                {label === "Meu Aprendizado" ? "Aprendizado" : label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function Avatar({ user, size = 32 }: { user: { fullName: string; avatarUrl?: string | null }; size?: number }) {
  return user.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.avatarUrl} alt={user.fullName} width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(user.fullName)}
    </span>
  );
}
