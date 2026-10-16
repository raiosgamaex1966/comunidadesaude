import { PageHero } from "@/components/PageHero";
import { DownloadsList } from "./DownloadsList";

export const metadata = { title: "Aulas baixadas" };

export default function DownloadsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHero title="Aulas baixadas" lead="As aulas guardadas neste aparelho abrem dentro do app, mesmo sem internet." />
      <DownloadsList />
    </div>
  );
}
