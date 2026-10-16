import { desc, eq, sql } from "drizzle-orm";
import { KeyRound, PauseCircle, PlayCircle, Trash2, UserPlus } from "lucide-react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { createStudent, deleteUser, resetStudentPassword, toggleStudentActive } from "@/lib/admin-actions";
import { PageHero } from "@/components/PageHero";
import { PROFESSIONS } from "@/lib/concursos";
import Link from "next/link";

export default async function AdminStudents({ searchParams }: { searchParams: Promise<{ q?: string; erro?: string }> }) {
  const me = await requireAdmin();
  const { q = "", erro } = await searchParams;
  const rows = await db.select({
    id: users.id, fullName: users.fullName, email: users.email, role: users.role,
    profession: users.profession, country: users.country, active: users.active, createdAt: users.createdAt,
    done: sql<number>`(select count(*) from lesson_progress p where p.user_id = ${users.id})`,
    enrolls: sql<number>`(select count(*) from enrollments e where e.user_id = ${users.id})`,
  }).from(users).where(eq(users.role, "member")).orderBy(desc(users.createdAt));
  const list = rows.filter((u) => !q || `${u.fullName} ${u.email}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHero title="Alunos" lead={`${rows.length} contas de alunos. Cadastre cada aluno e informe o e-mail e a senha de acesso.`} action={<form><input name="q" defaultValue={q} placeholder="Buscar por nome ou e-mail" className="input h-10 w-64" /></form>} />

      {erro && <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{erro}</div>}

      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/8 p-4 text-xs leading-relaxed text-muted-foreground">
        <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p><strong>Como o aluno entra:</strong> não há cadastro público. Você cria a conta aqui, define a senha e envia o e-mail e a senha ao aluno. Ele acessa <code className="rounded bg-background px-1.5 py-0.5">/auth</code> e entra direto no painel da profissão escolhida.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3">Aluno</th><th className="px-4 py-3">Profissão</th><th className="px-4 py-3">Tópicos</th><th className="px-4 py-3">Desde</th><th className="px-4 py-3">Status</th><th /></tr></thead>
            <tbody className="divide-y divide-border">
              {list.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">Nenhum aluno encontrado. Cadastre o primeiro ao lado.</td></tr>}
              {list.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3"><Link href={`/perfil/${u.id}`} className="font-semibold hover:underline">{u.fullName}</Link><p className="text-xs text-muted-foreground">{u.email}</p></td>
                  <td className="px-4 py-3">{u.profession ?? "—"}</td>
                  <td className="px-4 py-3">{Number(u.done)}</td>
                  <td className="px-4 py-3 text-xs">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3"><span className={`badge ${u.active ? "border-primary/40 text-primary" : "text-muted-foreground"}`}>{u.active ? "Ativo" : "Pausado"}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <form action={toggleStudentActive.bind(null, u.id)}><button className="btn-ghost h-8 px-2" title={u.active ? "Pausar acesso" : "Reativar acesso"}>{u.active ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}</button></form>
                      <form action={deleteUser.bind(null, u.id)}><button className="btn-ghost h-8 px-2 text-destructive" aria-label="Remover"><Trash2 className="h-4 w-4" /></button></form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <form action={createStudent} className="card space-y-3 p-5">
            <p className="flex items-center gap-2 font-serif text-xl"><UserPlus className="h-5 w-5 text-primary" /> Cadastrar aluno</p>
            <div><label className="label">Nome completo</label><input name="fullName" required className="input" placeholder="Nome do aluno" /></div>
            <div><label className="label">E-mail de acesso</label><input name="email" type="email" required className="input" placeholder="aluno@exemplo.com" /></div>
            <div><label className="label">Senha</label><input name="password" required minLength={8} className="input" placeholder="Mínimo de 8 caracteres" /></div>
            <div><label className="label">Profissão</label><select name="profession" className="input">{PROFESSIONS.map((p) => <option key={p}>{p}</option>)}</select></div>
            <button className="btn-primary w-full">Criar conta do aluno</button>
            <p className="text-xs leading-relaxed text-muted-foreground">A senha é definida por você. Envie o e-mail e a senha ao aluno por um canal seguro e peça para ele trocar depois em Configurações.</p>
          </form>

          <form action={resetStudentPassword} className="card space-y-3 p-5">
            <p className="flex items-center gap-2 font-serif text-xl"><KeyRound className="h-5 w-5 text-primary" /> Redefinir senha</p>
            <div><label className="label">Aluno</label><select name="id" className="input">{list.map((u) => <option key={u.id} value={u.id}>{u.fullName} — {u.email}</option>)}</select></div>
            <div><label className="label">Nova senha</label><input name="password" required minLength={8} className="input" placeholder="Mínimo de 8 caracteres" /></div>
            <button className="btn-outline w-full">Salvar nova senha</button>
          </form>
        </div>
      </div>
    </div>
  );
}
