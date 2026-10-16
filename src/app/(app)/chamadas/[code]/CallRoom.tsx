"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Monitor, Video, VideoOff, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function CallRoom({ status, name }: { status: string; name: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  async function join() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s); setJoined(true); setErr(null);
    } catch { setErr("Não foi possível acessar câmera/microfone. Verifique as permissões do navegador."); setJoined(true); }
  }
  async function share() {
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
      stream?.getTracks().forEach((t) => t.stop());
      setStream(s);
    } catch {}
  }
  function leave() { stream?.getTracks().forEach((t) => t.stop()); setStream(null); setJoined(false); }

  useEffect(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, [stream]);
  useEffect(() => () => { stream?.getTracks().forEach((t) => t.stop()); }, [stream]);
  useEffect(() => { stream?.getAudioTracks().forEach((t) => (t.enabled = mic)); }, [mic, stream]);
  useEffect(() => { stream?.getVideoTracks().forEach((t) => (t.enabled = cam)); }, [cam, stream]);

  if (status === "ended") return <div className="card glow p-10 text-center text-muted-foreground">Esta chamada foi encerrada.</div>;

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-video bg-black">
        {joined && stream ? <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" /> : (
          <div className="glow flex h-full flex-col items-center justify-center gap-3 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent font-serif text-2xl text-primary">{name[0]}</span>
            <p className="text-sm text-muted-foreground">{status === "live" ? "A chamada está ao vivo. Entre com câmera e microfone." : "Aguardando o anfitrião iniciar a chamada."}</p>
            {err && <p className="max-w-sm text-xs text-destructive">{err}</p>}
            {!joined && <button onClick={join} className="btn-primary">Entrar na chamada</button>}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-lg bg-background/70 px-2 py-1 text-xs">{name} (você)</span>
      </div>
      <div className="flex items-center justify-center gap-2 p-3">
        <Ctl on={mic} onClick={() => setMic((m) => !m)} label="Microfone">{mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}</Ctl>
        <Ctl on={cam} onClick={() => setCam((c) => !c)} label="Câmera">{cam ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}</Ctl>
        <Ctl on onClick={share} label="Compartilhar tela"><Monitor className="h-5 w-5" /></Ctl>
        <button onClick={leave} className="btn bg-destructive text-white" aria-label="Sair"><PhoneOff className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

function Ctl({ on, onClick, label, children }: { on: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return <button onClick={onClick} aria-label={label} title={label} className={cn("btn h-11 w-11 rounded-full p-0", on ? "bg-accent" : "bg-destructive/20 text-destructive")}>{children}</button>;
}
