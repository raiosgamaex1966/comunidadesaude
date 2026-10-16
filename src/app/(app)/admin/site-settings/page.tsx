import { saveSettings } from "@/lib/admin-actions";
import { getSettings } from "@/lib/queries";
import { PageHero } from "@/components/PageHero";

export default async function AdminSiteSettings() {
  const s = await getSettings();
  const F = ({ k, l }: { k: string; l: string }) => <div><label className="label">{l}</label><input name={k} defaultValue={s[k] ?? ""} className="input" /></div>;
  return (
    <div>
      <PageHero title="Aparência" lead="Textos do destaque, vídeo de apresentação e links de suporte." />
      <form action={saveSettings} className="card max-w-2xl space-y-3 p-5">
        <F k="highlight_title" l="Título do destaque" /><F k="highlight_subtitle" l="Subtítulo do destaque" />
        <F k="video_title" l="Título do vídeo de apresentação" /><F k="video_url" l="URL embed do vídeo de apresentação" />
        <F k="whatsapp_group" l="Link do grupo de WhatsApp" /><F k="instagram" l="Link do Instagram" />
        <button className="btn-primary">Salvar</button>
      </form>
    </div>
  );
}
