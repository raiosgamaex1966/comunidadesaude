"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyLink({ code }: { code: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="btn-outline h-9" onClick={() => { navigator.clipboard.writeText(`${location.origin}/chamadas/${code}`); setOk(true); setTimeout(() => setOk(false), 1500); }}>
      {ok ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />} {ok ? "Link copiado" : "Copiar link"}
    </button>
  );
}
