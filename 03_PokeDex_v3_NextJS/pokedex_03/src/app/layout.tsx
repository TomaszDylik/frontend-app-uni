import type { Metadata } from "next";
import { Irish_Grover } from "next/font/google";
import "./globals.css";

const irishGrover = Irish_Grover({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-irish-grover",
});

export const metadata: Metadata = {
  title: "GameDex - Wyszukiwarka Pokemonów",
  description: "Aplikacja Next.js do przeglądania i wyszukiwania Pokemonów z wykorzystaniem PokeAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={irishGrover.className}>
        {children}
      </body>
    </html>
  );
}
