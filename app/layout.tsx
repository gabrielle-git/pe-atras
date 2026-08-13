import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pé Atrás — Verifique antes de confiar",
  description:
    "Ferramenta educativa que analisa mensagens suspeitas, identifica sinais comuns de golpes e explica o que merece atenção.",
  applicationName: "Pé Atrás",
  metadataBase: new URL("https://pe-atras.vercel.app"),
  openGraph: {
    title: "Pé Atrás — Verifique antes de confiar",
    description:
      "Cole uma mensagem suspeita e veja quais sinais de fraude merecem sua atenção.",
    url: "/",
    siteName: "Pé Atrás",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
