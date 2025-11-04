# GameDex - Next.js Pokémon Application

Aplikacja Next.js do przeglądania i wyszukiwania Pokemonów z wykorzystaniem **PokeAPI**.

## 📋 Wymagania techniczne

- ✅ Next.js 14+ z App Router
- ✅ Komponenty funkcyjne (bez hooków w komponentach serwerowych)
- ✅ PokeAPI jako źródło danych
- ✅ TypeScript
- ✅ Bez użycia useState, useEffect, localStorage w komponentach serwerowych

## 🗂️ Struktura projektu

```
src/
├── app/
│   ├── layout.tsx              # Root layout z czcionką Irish Grover
│   ├── page.tsx                # Strona główna (SSG)
│   ├── loading.tsx             # Loading state dla strony głównej
│   ├── error.tsx               # Error boundary
│   ├── pokemon/
│   │   └── [id]/
│   │       ├── page.tsx        # Szczegóły Pokemona (SSG + generateStaticParams)
│   │       └── loading.tsx     # Loading state
│   └── search/
│       └── page.tsx            # Wyszukiwarka (SSR - force-dynamic)
└── components/
    ├── PokemonCard.tsx         # Komponent serwerowy - karta Pokemona
    ├── PokemonList.tsx         # Komponent serwerowy - lista kart
    ├── StatsDisplay.tsx        # Komponent serwerowy - statystyki
    └── ToggleButton.tsx        # Komponent kliencki ('use client')
```

## 🎯 Specyfikacja tras

### `/` - Strona główna
- **Strategia**: SSG (Static Site Generation)
- **Funkcjonalność**:
  - Lista 50 Pokemonów (fetch podczas build time)
  - Każdy Pokemon: nazwa, numer, miniaturka, typy
  - Linki do `/pokemon/[id]` używając `<Link>`
  - Grid layout z kartami
  - Link do wyszukiwarki

### `/pokemon/[id]` - Szczegóły Pokemona
- **Strategia**: SSG z dynamic routes
- **Funkcjonalność**:
  - `generateStaticParams` zwracający 50 ID (1-50)
  - Fetch szczegółów podczas build time
  - Wyświetlanie:
    - Obrazek Pokemona
    - Nazwa i numer
    - Typy
    - Statystyki (HP, Attack, Defense, Speed, Special Attack, Special Defense)
    - Wzrost i waga
    - Umiejętności z oznaczeniem hidden abilities
  - Kolorowe paski statystyk (kolor zależny od wartości)
  - Komponent kliencki `ToggleButton` do ukrywania/pokazywania sekcji umiejętności
  - Link powrotny do strony głównej

### `/search` - Wyszukiwarka
- **Strategia**: SSR (Server-Side Rendering)
- **Funkcjonalność**:
  - Dyrektywa `export const dynamic = 'force-dynamic'`
  - Formularz z polami:
    - `name` (text input) - wyszukiwanie po nazwie lub numerze
    - `type` (select) - filtrowanie po typie
  - Odczyt `searchParams` z URL
  - Wykonanie wyszukiwania na serwerze
  - Wyświetlenie wyników w grid layout
  - Timestamp renderowania strony (demonstracja SSR)
  - Obsługa przypadku "brak wyników"
  - Link powrotny do strony głównej

## 🎨 Style

- Czcionka: **Irish Grover** (Google Fonts)
- Schemat kolorów zachowany z wersji React:
  - Tło: `#573280` (fioletowy)
  - Główny kolor tekstu: `#23022E` (ciemny fiolet)
  - Karty: `#afbbf2` (jasny niebieski)
- Responsywny grid layout
- Kolorowe paski statystyk:
  - Zielony: wartość ≥ 80
  - Żółty: wartość ≥ 60
  - Czerwony: wartość < 60

## 🚀 Uruchomienie

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Build produkcyjny
npm run build

# Uruchomienie wersji produkcyjnej
npm start
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 📦 Strategie renderowania

1. **SSG (Static Site Generation)** - `/` i `/pokemon/[id]`
   - Strony generowane podczas build time
   - Szybkie ładowanie
   - Idealne dla treści statycznych

2. **SSR (Server-Side Rendering)** - `/search`
   - Renderowanie na każde żądanie
   - Zawsze świeże dane
   - Timestamp pokazuje, że strona jest renderowana na żądanie

3. **Komponent kliencki** - `ToggleButton`
   - Jedyny komponent z dyrektywą `'use client'`
   - Wykorzystuje `useState` do interaktywności
   - Prosty toggle widoczności sekcji

## 🔧 Technologie

- **Next.js 16** (App Router)
- **TypeScript**
- **PokeAPI** (https://pokeapi.co/api/v2)
- **CSS Modules** (globals.css)
- **Google Fonts** (Irish Grover)

## ✅ Spełnione wymagania

- ✅ Next.js 14+ z App Router
- ✅ Komponenty funkcyjne
- ✅ PokeAPI jako źródło danych
- ✅ Zakaz useState, useEffect, localStorage w komponentach serwerowych
- ✅ TypeScript
- ✅ SSG dla strony głównej
- ✅ SSG + generateStaticParams dla szczegółów
- ✅ SSR dla wyszukiwarki
- ✅ Jeden komponent kliencki z interakcją
- ✅ Loading states
- ✅ Error handling
- ✅ Linki używające `<Link>` z Next.js

## 📝 Uwagi

- Ostrzeżenia o `<img>` vs `<Image />` są celowe - możesz je zamienić na komponenty `next/image` dla lepszej optymalizacji
- Aplikacja pobiera 50 pierwszych Pokemonów z PokeAPI
- Wszystkie komponenty serwerowe nie używają hooków React
- Komponent `ToggleButton` jest jedynym komponentem klienckim
