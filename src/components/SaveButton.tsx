import { Bookmark } from "lucide-react";
import { toggleSaved } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function SaveButton({ kind, refId, saved, path, small }: { kind: string; refId: number; saved: boolean; path: string; small?: boolean }) {
  return (
    <form action={toggleSaved.bind(null, kind, refId, path)}>
      <button className={cn("btn-ghost", small ? "h-8 px-2" : "")} aria-label={saved ? "Remover dos Salvos" : "Salvar"} title={saved ? "Remover dos Salvos" : "Salvar"}>
        <Bookmark className={cn("h-4 w-4", saved && "fill-primary text-primary")} />
      </button>
    </form>
  );
}
