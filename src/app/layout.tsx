import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RCS Prime Comunity", template: "%s — RCS Prime Comunity" },
  description: "RCS Prime Comunity — Preparação para concursos públicos da área da saúde.",
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
