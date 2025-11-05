import { Irish_Grover } from "next/font/google";
import "./globals.css";

// Konfiguracja czcionki Google Fonts
const irishGrover = Irish_Grover({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-irish-grover",
});

// Metadata strony
export const metadata = {
  title: "GameDex - Wyszukiwarka Pokemonów",
  description: "Aplikacja Next.js do przeglądania Pokemonów z wykorzystaniem PokeAPI i useState",
};

// Glowny layout aplikacji
export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={irishGrover.className}>
        {children}
      </body>
    </html>
  );
}
