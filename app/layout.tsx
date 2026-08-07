import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pé Atrás — cole a mensagem e veja se tem cara de golpe",
  description: "Assistente que ajuda a identificar golpes recebidos por mensagem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
