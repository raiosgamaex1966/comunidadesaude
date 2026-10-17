import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rcscomunidadesaude.vercel.app"),
  title: { default: "RCS Prime Comunity — Concursos da Saúde", template: "%s — RCS Prime Comunity" },
  description: "Preparação organizada para concursos da saúde: Enfermagem, Técnico de Enfermagem e Radiologia Médica. Matérias por edital, plano individual, comunidade e podcasts.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Comunidade Saúde — Sua Saúde, Nossa Comunidade",
    description: "Preparação organizada para concursos da saúde: Enfermagem, Técnico de Enfermagem e Radiologia Médica. Matérias por edital, plano individual, comunidade e podcasts.",
    url: "https://rcscomunidadesaude.vercel.app",
    siteName: "Comunidade Saúde",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://rcscomunidadesaude.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Comunidade Saúde — Sua Saúde, Nossa Comunidade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comunidade Saúde — Sua Saúde, Nossa Comunidade",
    description: "Preparação organizada para concursos da saúde: Enfermagem, Técnico de Enfermagem e Radiologia Médica. Matérias por edital, plano individual, comunidade e podcasts.",
    images: ["https://rcscomunidadesaude.vercel.app/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="light" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f5f8f7" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rcs-theme');if(t!=='dark')t='light';var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
