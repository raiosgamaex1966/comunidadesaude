import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "RCS Prime Comunity — Concursos da Saúde";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #072e32 0%, #0d555b 50%, #062224 100%)",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Topo: Logo & Identidade */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "22px",
              backgroundColor: "#087d81",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              border: "2px solid rgba(89, 209, 199, 0.4)",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 32 32"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 27s-10.5-6.4-10.5-13.2C5.5 10 8.1 7.5 11.2 7.5c2 0 3.7 1 4.8 2.6 1.1-1.6 2.8-2.6 4.8-2.6 3.1 0 5.7 2.5 5.7 6.3C26.5 20.6 16 27 16 27z" />
              <path d="M9 16h4l2-3.5 2.2 7 1.8-3.5H23" strokeWidth="2.1" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: "#ffffff",
              }}
            >
              RCS Prime Comunity
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "4px",
                color: "#59d1c7",
                textTransform: "uppercase",
              }}
            >
              Concursos da Saúde
            </span>
          </div>
        </div>

        {/* Centro: Título e Chamada */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              borderRadius: "50px",
              backgroundColor: "rgba(89, 209, 199, 0.15)",
              border: "1px solid rgba(89, 209, 199, 0.5)",
              width: "fit-content",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#59d1c7", letterSpacing: "1px" }}>
              PREPARAÇÃO COMPLETA POR EDITAL
            </span>
          </div>

          <div
            style={{
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Preparação para Concursos:</span>
            <span style={{ color: "#59d1c7" }}>Enfermagem e Radiologia</span>
          </div>

          <p
            style={{
              fontSize: "22px",
              color: "#d2e7e4",
              lineHeight: 1.4,
              maxWidth: "960px",
              margin: 0,
            }}
          >
            Matérias organizadas por edital, plano individual de estudo, biblioteca oficial, aulas e podcasts.
          </p>
        </div>

        {/* Rodapé: Especialidades em Badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ display: "flex", gap: "14px" }}>
            <div
              style={{
                padding: "10px 22px",
                borderRadius: "14px",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                fontSize: "17px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              👩‍⚕️ Enfermagem
            </div>
            <div
              style={{
                padding: "10px 22px",
                borderRadius: "14px",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                fontSize: "17px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              🩺 Téc. de Enfermagem
            </div>
            <div
              style={{
                padding: "10px 22px",
                borderRadius: "14px",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                fontSize: "17px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              ☢️ Radiologia Médica
            </div>
            <div
              style={{
                padding: "10px 22px",
                borderRadius: "14px",
                backgroundColor: "rgba(8, 125, 129, 0.4)",
                border: "1px solid #59d1c7",
                fontSize: "17px",
                fontWeight: 700,
                color: "#59d1c7",
              }}
            >
              🎧 Podcasts
            </div>
          </div>

          <span style={{ fontSize: "16px", color: "#a6c0bf", fontWeight: 600 }}>
            rcscomunidadesaude.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
