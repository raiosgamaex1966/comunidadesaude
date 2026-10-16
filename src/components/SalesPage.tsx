import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  BookOpenCheck,
  Check,
  ClipboardList,
  FileText,
  GraduationCap,
  Headphones,
  HeartPulse,
  Landmark,
  ShieldCheck,
  Target,
  UsersRound,
  Video,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";

const audience = [
  {
    title: "Quem prepara para concursos da saúde",
    text: "Transforme seu conhecimento em matérias organizadas, tópicos, materiais de apoio, aulões e atualizações para uma comunidade de alunos.",
    icon: GraduationCap,
  },
  {
    title: "Quem administra a comunidade",
    text: "Você administra a comunidade e publica as matérias, materiais, atualizações e encontros que os alunos vão estudar.",
    icon: UsersRound,
  },
  {
    title: "Alunos da área da saúde",
    text: "Monte um plano por órgão, esfera e profissão e acompanhe conteúdos comuns, legislação e específicos.",
    icon: Target,
  },
];

const features = [
  {
    title: "Catálogo de matérias por edital",
    text: "Organize Português, Raciocínio Lógico-Matemático, SUS, legislação federal/estadual/municipal e matérias específicas por profissão.",
    icon: BookOpenCheck,
  },
  {
    title: "Plano individual de concurso",
    text: "O aluno cadastra órgão, esfera, cargo, banca e data da prova. A plataforma combina as matérias certas e mostra o progresso.",
    icon: ClipboardList,
  },
  {
    title: "Painel de gestão completo",
    text: "Crie matérias, módulos, tópicos, referências, vídeos, materiais, artigos e encontros em um único painel administrativo.",
    icon: BookOpenCheck,
  },
  {
    title: "Acesso seguro por perfil",
    text: "Alunos acessam apenas a área de estudos. O administrador controla todo o conteúdo, os acessos e a moderação da comunidade.",
    icon: ShieldCheck,
  },
  {
    title: "Biblioteca e fontes oficiais",
    text: "Centralize leis, conselhos profissionais, links, apostilas externas, referências e outros materiais de apoio aos estudos.",
    icon: FileText,
  },
  {
    title: "Podcasts de matérias e temas",
    text: "Episódios em áudio organizados por matéria para os alunos estudarem e revisarem de onde estiverem.",
    icon: Headphones,
  },
  {
    title: "Comunidade, suporte e notificações",
    text: "Crie conversas sobre editais e estudos, envie avisos, responda pelo suporte privado e mantenha os alunos informados.",
    icon: BellRing,
  },
];

const professions = [
  "Enfermagem",
  "Técnico de Enfermagem",
  "Radiologia Médica",
];

const steps = [
  ["01", "Estruture sua escola", "Crie trilhas, matérias e o catálogo inicial de conteúdos para concursos da saúde."],
  ["02", "Publique suas matérias", "No painel de gestão, crie matérias, módulos e tópicos com vídeos, referências e materiais de apoio."],
  ["03", "Publique com organização", "No painel de gestão, cadastre módulos, tópicos, vídeos incorporados, materiais, atualizações e encontros ao vivo."],
  ["04", "Acompanhe a comunidade", "Alunos montam planos de estudo, registram progresso, salvam conteúdos e participam de conversas e suporte."],
];

export function SalesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7faf9] text-[#173b40]">
      <header className="sticky top-0 z-50 border-b border-[#dbe9e6] bg-[#f7faf9]/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-5 px-5 py-3 sm:px-8">
          <Link href="/" aria-label="RCS Prime Comunity" className="shrink-0">
            <Logo size={34} />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#517176] md:flex">
            <a href="#funcionalidades" className="transition hover:text-[#087d81]">Funcionalidades</a>
            <a href="#professores" className="transition hover:text-[#087d81]">Gestão</a>
            <a href="#para-quem" className="transition hover:text-[#087d81]">Para quem serve</a>
            <a href="#como-funciona" className="transition hover:text-[#087d81]">Como funciona</a>
          </nav>
          <Link href="/auth" className="btn-primary shrink-0 px-4 py-2.5 sm:px-5">Entrar <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </header>

      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(42,179,168,0.16),transparent_25rem),radial-gradient(circle_at_10%_7%,rgba(42,179,168,0.12),transparent_30rem)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#a6d5cf] bg-[#e8f7f4] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#087d81]">
              <HeartPulse className="h-3.5 w-3.5" /> Plataforma para concursos da saúde
            </div>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight text-[#123d42] sm:text-6xl lg:text-7xl">
              Sua comunidade de ensino. <span className="text-[#087d81]">Todo o conteúdo nas suas mãos.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#58767b] sm:text-lg">
              A RCS Prime Comunity reúne em um único ambiente o que uma preparação para concursos da saúde precisa: matérias organizadas, planos de estudo por profissão, comunidade e gestão de conteúdo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth" className="btn-primary px-5 py-3">Acessar a plataforma <ArrowRight className="h-4 w-4" /></Link>
              <a href="#funcionalidades" className="btn-outline px-5 py-3">Conhecer recursos</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#45666b]">
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#087d81]" /> Acesso por login e senha</p>
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#087d81]" /> Painel administrativo completo</p>
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#087d81]" /> Conteúdo por profissão e esfera</p>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[28px] border border-[#cce3df] bg-white p-3 shadow-[0_28px_75px_rgba(14,89,92,0.15)]">
              <div className="overflow-hidden rounded-[19px] bg-[#0d555b]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/course-3.jpg" alt="Profissionais de saúde estudando em equipe" className="h-[340px] w-full object-cover sm:h-[430px]" />
              </div>
              <div className="absolute -bottom-5 -left-4 max-w-[260px] rounded-2xl border border-[#dbe9e6] bg-white p-4 shadow-xl sm:-left-8">
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f6f3] text-[#087d81]"><Target className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-[#668084]">Plano de estudos</p><p className="font-serif text-lg">Feito para cada edital</p></div></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8f1ef]"><div className="h-full w-[68%] rounded-full bg-[#087d81]" /></div>
                <p className="mt-2 text-xs text-[#668084]">Comuns · Legislação · Específicos</p>
              </div>
            </div>
            <div className="absolute -right-5 top-10 hidden rounded-2xl border border-[#cce3df] bg-white p-4 shadow-xl sm:block">
              <LogoMark size={34} />
              <p className="mt-2 text-xs font-semibold text-[#31595d]">Você publica e organiza<br />todo o conteúdo.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="para-quem" className="border-y border-[#dbe9e6] bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#087d81]">Para quem serve</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-center font-serif text-4xl leading-tight sm:text-5xl">Uma estrutura clara para ensinar, aprender e administrar.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {audience.map((item) => {
              const Icon = item.icon;
              return <article key={item.title} className="rounded-3xl border border-[#dbe9e6] bg-[#fbfdfd] p-7"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5f5f2] text-[#087d81]"><Icon className="h-6 w-6" /></span><h3 className="mt-5 font-serif text-2xl">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#658084]">{item.text}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section id="funcionalidades" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087d81]">Tudo em um só app</p><h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Mais organização para sua operação de ensino.</h2></div>
            <p className="max-w-2xl text-base leading-relaxed text-[#658084]">A plataforma foi estruturada para o cenário real dos concursos da saúde: conteúdos em comum, matérias específicas por profissão e legislação variável por esfera.</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return <article key={feature.title} className="rounded-2xl border border-[#dbe9e6] bg-white p-6 transition hover:-translate-y-1 hover:border-[#a8d5cf] hover:shadow-lg"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7f4] text-[#087d81]"><Icon className="h-5 w-5" /></span><h3 className="mt-4 font-serif text-xl">{feature.title}</h3><p className="mt-2 text-sm leading-relaxed text-[#688287]">{feature.text}</p></article>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0d555b] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8ae0d7]">Conteúdo que faz sentido</p><h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Preparação alinhada ao que os editais cobram.</h2><p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">Organize a experiência do aluno entre a base comum, a legislação da esfera correta e o conteúdo específico de cada profissão.</p><Link href="/auth" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0d555b]">Entrar para gerenciar <ArrowRight className="h-4 w-4" /></Link></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/8 p-6 sm:col-span-2"><Landmark className="h-6 w-6 text-[#8ae0d7]" /><h3 className="mt-4 font-serif text-2xl">Três frentes de estudo</h3><p className="mt-2 text-sm leading-relaxed text-white/70">Conhecimentos comuns, legislação federal/estadual/municipal e conhecimentos específicos por profissão.</p></div>
              {professions.map((profession) => <div key={profession} className="rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-medium text-white/85">{profession}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="professores" className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="rounded-[28px] border border-[#dbe9e6] bg-[#f3f9f7] p-6 sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087d81]">Gestão de conteúdo</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">Publique. Organize. Acompanhe.</h2>
            <div className="mt-7 space-y-4">
              {[
                "Você acessa o painel de gestão com login e senha de administrador.",
                "Cria trilhas, matérias, módulos e tópicos com vídeos e referências.",
                "Publica materiais, atualizações e encontros ao vivo para os alunos.",
                "Acompanha alunos, progresso, comunidade e mensagens de suporte.",
              ].map((item) => <p key={item} className="flex gap-3 text-sm leading-relaxed text-[#55757a]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#087d81]" />{item}</p>)}
            </div>
          </div>
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f7f4] text-[#087d81]"><UsersRound className="h-6 w-6" /></span>
            <h2 className="mt-5 font-serif text-4xl leading-tight">Todo o conteúdo sob o seu controle.</h2>
            <p className="mt-5 text-base leading-relaxed text-[#658084]">Um único painel administrativo para criar matérias, módulos, tópicos, materiais, atualizações e encontros — com os alunos acessando somente a área de estudos.</p>
            <Link href="/auth" className="btn-primary mt-7">Acessar o painel de gestão <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087d81]">Como funciona</p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">Do primeiro conteúdo à comunidade ativa em quatro passos.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(([number, title, text]) => <article key={number} className="relative rounded-2xl border border-[#dbe9e6] bg-white p-6"><span className="font-serif text-4xl text-[#b8dcd6]">{number}</span><h3 className="mt-8 font-serif text-xl">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#658084]">{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-7xl rounded-[30px] bg-[#e4f5f1] px-6 py-12 text-center sm:px-12 sm:py-16">
          <LogoMark size={46} />
          <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight text-[#123d42] sm:text-5xl">Pronto para organizar sua comunidade de estudos?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#5b787d]">Entre como administrador para criar matérias, acompanhar alunos e estruturar sua comunidade de concursos da saúde.</p>
          <Link href="/auth" className="btn-primary mt-7 px-6 py-3">Entrar na RCS Prime Comunity <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <footer className="border-t border-[#dbe9e6] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-[#688287] sm:px-8"><Logo size={26} /><p>RCS Prime Comunity · Preparação para concursos da saúde.</p></div>
      </footer>
    </main>
  );
}
