"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

export function LoginForm() {
  const params = useSearchParams();
  const erro = params.get("erro");
  const [show, setShow] = useState(false);
  return (
    <form action="/api/auth/login" method="post" className="card w-full max-w-md p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Acesso à comunidade</p>
      <h1 className="mt-2 font-serif text-3xl">Entre para continuar</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Alunos, professores convidados e administradores acessam a plataforma por aqui.</p>
      <div className="mt-6 space-y-4">
        <div>
          <label className="label">E-mail</label>
          <div className="flex items-center gap-2 rounded-[0.75rem] border border-border bg-background px-3 h-[2.625rem] focus-within:border-primary focus-within:ring-[3px]">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input name="email" type="email" autoComplete="email" className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="voce@exemplo.com" required />
          </div>
        </div>
        <div>
          <label className="label">Senha</label>
          <div className="flex items-center gap-2 rounded-[0.75rem] border border-border bg-background px-3 h-[2.625rem] focus-within:border-primary focus-within:ring-[3px]">
            <LockKeyhole className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input name="password" type={show ? "text" : "password"} autoComplete="current-password" className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" placeholder="Sua senha" required />
            <button type="button" onClick={() => setShow((v) => !v)} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label={show ? "Ocultar senha" : "Mostrar senha"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {erro && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{erro}</p>}
        <button className="btn-primary w-full">Entrar na plataforma</button>
      </div>
      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">Acesso restrito a membros autorizados da comunidade.</p>
      <Link href="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-foreground">← Voltar para a página inicial</Link>
    </form>
  );
}
