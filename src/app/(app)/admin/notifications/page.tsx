import { broadcast } from "@/lib/admin-actions";
import { PageHero } from "@/components/PageHero";

export default function AdminNotifications() {
  return (
    <div>
      <PageHero title="Notificações" lead="Envie um aviso para todos os membros da plataforma." />
      <form action={broadcast} className="card max-w-xl space-y-3 p-5">
        <div><label className="label">Título</label><input name="title" className="input" required /></div>
        <div><label className="label">Mensagem</label><textarea name="body" rows={3} className="input" /></div>
        <div><label className="label">Link (opcional)</label><input name="link" placeholder="/mentorships" className="input" /></div>
        <button className="btn-primary">Enviar para todos</button>
      </form>
    </div>
  );
}
