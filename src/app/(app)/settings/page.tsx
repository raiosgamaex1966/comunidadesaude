import { requireUser } from "@/lib/auth";
import { updateProfile } from "@/lib/actions";
import { PageHero } from "@/components/PageHero";
import { Avatar } from "@/components/Shell";
import { NotificationPrefs } from "./Forms";
import { PROFESSIONS } from "@/lib/concursos";

export const metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHero title="Configurações" lead="Seu perfil e preferências de notificação." />
      <form action={updateProfile} className="card space-y-4 p-6">
        <div className="flex items-center gap-4"><Avatar user={user} size={64} /><div><p className="font-semibold">{user.fullName}</p><p className="text-sm text-muted-foreground">{user.email}</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Nome</label><input name="fullName" defaultValue={user.fullName} className="input" required /></div>
          <div><label className="label">País</label><select name="country" defaultValue={user.country ?? "Brasil"} className="input">{["Brasil", "Portugal", "Angola", "Moçambique", "Outro"].map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label">Profissão do concurso</label><select name="profession" defaultValue={user.profession ?? ""} className="input"><option value="">Selecione…</option>{PROFESSIONS.map((p) => <option key={p}>{p}</option>)}</select><p className="mt-1 text-xs text-muted-foreground">Personaliza as matérias específicas no seu Início.</p></div>
          <div><label className="label">WhatsApp</label><input name="whatsapp" defaultValue={user.whatsapp ?? ""} placeholder="Com o código do país (+55…)" className="input" /><p className="mt-1 text-xs text-muted-foreground">Para avisos e suporte mais rápido.</p></div>
          <div><label className="label">Foto (URL)</label><input name="avatarUrl" defaultValue={user.avatarUrl ?? ""} placeholder="https://…" className="input" /></div>
        </div>
        <div><label className="label">Bio</label><textarea name="bio" defaultValue={user.bio ?? ""} rows={3} className="input" placeholder="Qual concurso você está preparando?" /></div>
        <button className="btn-primary">Salvar perfil</button>
      </form>
      <NotificationPrefs />
    </div>
  );
}
