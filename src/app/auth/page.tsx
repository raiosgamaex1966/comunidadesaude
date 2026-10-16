import { redirect } from "next/navigation";
import { ShieldCheck, Target, UsersRound } from "lucide-react";
import { Logo } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar" };

export default async function AuthPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/overview");
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <section className="hidden bg-[#0d555b] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <Logo size={36} />
          <div>
            <span className="badge border-white/30 bg-white/10 text-white">Concursos da saúde</span>
            <h2 className="mt-5 max-w-lg font-serif text-5xl leading-[1.06]">Preparação que conecta quem ensina e quem estuda.</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/75">Professores convidados publicam suas próprias matérias. Alunos encontram uma preparação organizada para concursos da saúde.</p>
            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
              <Point icon={<Target className="h-4 w-4" />} text="Plano por cargo" />
              <Point icon={<UsersRound className="h-4 w-4" />} text="Professores convidados" />
              <Point icon={<ShieldCheck className="h-4 w-4" />} text="Acesso protegido" />
            </div>
          </div>
          <p className="text-xs text-white/60">RCS Prime Comunity · Plataforma privada</p>
        </section>
        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden"><Logo size={32} /></div>
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}

function Point({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="rounded-xl border border-white/15 bg-white/10 p-3 text-xs leading-snug text-white/85"><span className="mb-2 block text-[#8ae0d7]">{icon}</span>{text}</div>;
}
