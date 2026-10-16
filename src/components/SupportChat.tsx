import { Send } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";

type M = { id: number; content: string; createdAt: Date; senderId: number; sender: string };

export function SupportChat({ messages, meId, action, targetUserId }: { messages: M[]; meId: number; action: (fd: FormData) => Promise<void>; targetUserId?: number }) {
  return (
    <>
      <div className="scrollbar-thin flex max-h-[50vh] min-h-[280px] flex-col gap-2 overflow-y-auto p-5">
        {messages.length === 0 && <p className="m-auto text-center text-sm text-muted-foreground">Nenhuma mensagem ainda. Escreva abaixo para abrir um atendimento.</p>}
        {messages.map((m) => {
          const mine = m.senderId === meId;
          return (
            <div key={m.id} className={cn("max-w-[80%] rounded-2xl px-4 py-2 text-sm", mine ? "self-end bg-primary text-primary-foreground" : "self-start bg-muted")}>
              {!mine && <p className="mb-0.5 text-[11px] font-semibold opacity-80">{m.sender}</p>}
              <p className="whitespace-pre-wrap">{m.content}</p>
              <p className={cn("mt-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>{timeAgo(m.createdAt)}</p>
            </div>
          );
        })}
      </div>
      <form action={action} className="flex gap-2 border-t border-border p-3">
        {targetUserId && <input type="hidden" name="userId" value={targetUserId} />}
        <input name="content" required placeholder="Escreva sua mensagem…" className="input" autoComplete="off" />
        <button className="btn-primary shrink-0" aria-label="Enviar"><Send className="h-4 w-4" /></button>
      </form>
    </>
  );
}
