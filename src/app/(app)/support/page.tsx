import { asc, eq } from "drizzle-orm";
import { Camera, MessageCircle, LifeBuoy } from "lucide-react";
import { db } from "@/db";
import { supportMessages, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { sendSupportMessage } from "@/lib/actions";
import { getSettings } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";
import { SupportChat } from "@/components/SupportChat";

export const metadata = { title: "Suporte" };

export default async function SupportPage() {
  const user = await requireUser();
  const [settings, msgs] = await Promise.all([
    getSettings(),
    db.select({ id: supportMessages.id, content: supportMessages.content, createdAt: supportMessages.createdAt, senderId: supportMessages.senderId, sender: users.fullName }).from(supportMessages).innerJoin(users, eq(supportMessages.senderId, users.id)).where(eq(supportMessages.userId, user.id)).orderBy(asc(supportMessages.createdAt)),
  ]);
  const h = new Date().getHours();
  const online = h >= 9 && h < 18;
  return (
    <div className="mx-auto max-w-5xl">
      <PageHero title="Central de Suporte" lead="Precisa de ajuda com a plataforma? Fale com a equipe pelo atendimento privado abaixo." />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Channel icon={<MessageCircle className="h-5 w-5" />} title="Grupo de profissionais" sub="Troca entre colegas" text="Um canal adicional de contato com a comunidade quando o grupo for disponibilizado." href={settings.whatsapp_group} cta="Abrir grupo" />
        <Channel icon={<Camera className="h-5 w-5" />} title="Redes da comunidade" sub="Acompanhe novidades" text="Veja avisos e conteúdos compartilhados pela equipe em nossas redes." href={settings.instagram} cta="Abrir rede" />
        <Channel icon={<LifeBuoy className="h-5 w-5" />} title="Atendimento na plataforma" sub="Mensagem privada" text="Envie sua mensagem e acompanhe o histórico da conversa aqui dentro." href="#chat" cta="Falar com a equipe" />
      </div>
      <div id="chat" className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div><p className="font-semibold">Atendimento RCS Prime Comunity</p><p className="text-xs text-muted-foreground">{online ? "Equipe online — resposta rápida" : "Fora do horário — respondemos em até 24h úteis"}</p></div>
          <span className={`badge ${online ? "border-primary/40 text-primary" : ""}`}><span className={`h-2 w-2 rounded-full ${online ? "bg-primary" : "bg-muted-foreground"}`} /> {online ? "Online" : "Offline"}</span>
        </div>
        <SupportChat messages={msgs} meId={user.id} action={sendSupportMessage} />
      </div>
    </div>
  );
}

function Channel({ icon, title, sub, text, href, cta }: { icon: React.ReactNode; title: string; sub: string; text: string; href: string; cta: string }) {
  return (
    <div className="card flex flex-col p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">{icon}</span>
      <h3 className="mt-3 font-serif text-lg font-semibold">{title}</h3>
      <p className="text-xs font-semibold text-primary">{sub}</p>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{text}</p>
      {href && href !== "https://chat.whatsapp.com/" && href !== "https://instagram.com/" ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} className="btn-outline mt-4">{cta}</a>
      ) : (
        <span className="badge mt-4 w-fit text-muted-foreground">Em breve</span>
      )}
    </div>
  );
}
