# GameDex - Zadanie 4: Zarządzanie stanem z useState# GameDex - Zadanie 4: Zarządzanie stanem z useState



Aplikacja Next.js do przeglądania Pokemonów z systemem ulubionych, zbudowana zgodnie z wymaganiami Zadania 4.Aplikacja Next.js do przeglądania i wyszukiwania Pokemonów z systemem ulubionych wykorzystującym **useState**. Rozbudowa projektu z Zadania 3 o interaktywne funkcjonalności.



## 📋 Wymagania techniczne (spełnione)## 📋 Wymagania techniczne



- ✅ Next.js 16+ z App Router (kontynuacja projektu z Zadania 3)- ✅ Next.js 14+ z App Router

- ✅ JavaScript (pliki .js lub .jsx)- ✅ JavaScript (komponenty .jsx) + TypeScript (strony .tsx)

- ✅ Komponenty funkcyjne z hookiem `useState`- ✅ Komponenty funkcyjne z hookiem useState

- ✅ `useEffect` do pobierania danych- ✅ useEffect do pobierania danych

- ✅ Przekazywanie stanu przez props (props drilling)- ✅ Przekazywanie stanu przez props

- ✅ **ZAKAZ**: Context API, Redux, Zustand - nie używane ✅- ✅ Bez Context API, Redux, Zustand

- ✅ **ZAKAZ**: localStorage - stan istnieje tylko podczas sesji ✅- ✅ Bez localStorage (stan zeruje się po odświeżeniu)



## 🎯 Funkcjonalności## 🎯 Zaimplementowane funkcjonalności



### System ulubionych Pokemonów### System ulubionych Pokemonów (NOWE w Zadaniu 4)

- ⭐ Przycisk oznaczania jako ulubiony na każdej karcie Pokemona

- 👁️ Wizualna indykacja stanu (wypełniona ⭐ vs pusta ☆ gwiazdka)1. **Oznaczanie jako ulubiony**

- 📊 Licznik ulubionych wyświetlany na stronie głównej   - Przycisk z gwiazdką na każdej karcie Pokemona

- 🚫 Limit maksymalnie 12 ulubionych Pokemonów   - Wizualna indykacja: ⭐ (ulubiony) vs ☆ (nieulubiony)

- ⚠️ Komunikat przy próbie przekroczenia limitu   - Kliknięcie przełącza stan

- 🔄 Stan zeruje się po odświeżeniu strony (brak localStorage)

2. **Licznik ulubionych**

### Funkcjonalności z Zadania 3   - Wyświetlany na stronie głównej

- 📋 Lista 50 Pokemonów z PokeAPI   - Pokazuje: "Ulubione Pokemony: X / 12"

- 🔍 Wyszukiwarka z filtrowaniem po nazwie i typie   - Informuje ile można jeszcze dodać

- 📄 Strona szczegółów każdego Pokemona

- 📊 Wyświetlanie statystyk, umiejętności, typów3. **Limit 12 ulubionych**

   - Maksymalnie 12 Pokemonów

## 🏗️ Architektura komponentów (zgodna z poleceniem)   - Komunikat przy próbie przekroczenia limitu

   - Automatyczne ukrycie komunikatu po 3 sekundach

### Hierarchia przekazywania danych (Props Drilling):

4. **Stan tymczasowy**

```   - Stan istnieje tylko podczas sesji

HomePage (stan favorites, funkcja toggleFavorite)   - Zeruje się po odświeżeniu strony

  └── PokemonList (otrzymuje favorites i toggleFavorite jako props)

        └── PokemonCard (otrzymuje favorites i toggleFavorite jako props)### Funkcjonalności z Zadania 3 (zachowane)

              └── FavoriteButton (otrzymuje informacje czy jest ulubiony oraz funkcję toggle)

```1. **Strona główna (/)**

   - Lista 50 Pokemonów z PokeAPI

**Kluczowa koncepcja**: Stan jest podniesiony do najniższego wspólnego przodka wszystkich komponentów, które go potrzebują ("lifting state up").   - Grid layout z kartami

   - Każdy Pokemon: nazwa, numer, miniaturka, typy

## 🗂️ Struktura projektu   - Link do wyszukiwarki



```2. **Szczegóły Pokemona (/pokemon/[id])**

src/   - SSG z generateStaticParams (50 Pokemonów)

├── app/   - Obrazek, nazwa, numer

│   ├── page.js                    # 'use client' - zarządza stanem favorites (useState)   - Typy

│   ├── layout.js                  # Root layout z czcionką Irish Grover   - Statystyki z kolorowymi paskami

│   ├── globals.css                # Style aplikacji   - Wzrost i waga

│   ├── pokemon/[id]/   - Umiejętności z oznaczeniem hidden abilities

│   │   └── page.js                # Szczegóły Pokemona (bez zmian względem Zadania 3)   - ToggleButton do pokazywania/ukrywania umiejętności

│   └── search/   - Linki powrotne

│       └── page.js                # 'use client' - wyszukiwarka z useState

│3. **Wyszukiwarka (/search)**

└── components/   - SSR (Server-Side Rendering)

    ├── PokemonCard.jsx            # 'use client' - karta z przyciskiem ulubionych   - Wyszukiwanie po nazwie lub numerze

    ├── PokemonList.jsx            # Przekazuje props w dół   - Filtrowanie po typie

    ├── FavoriteButton.jsx         # 'use client' - renderuje przycisk ⭐/☆   - Timestamp renderowania

    └── FavoritesCounter.jsx       # Wyświetla licznik (X / 12)   - Obsługa braku wyników

```

## 🏗️ Architektura komponentów

## 📐 Specyfikacja techniczna

### Hierarchia przekazywania danych (Lifting State Up)

### Strona główna (`/`)

```

**Dyrektywa**: `'use client'` - komponent klienckiHomePage (stan favorites, funkcja toggleFavorite)

  ├── FavoritesCounter (otrzymuje count)

**Stan (useState)**:  └── PokemonList (otrzymuje favorites i toggleFavorite)

```javascript        └── PokemonCard (otrzymuje favorites i toggleFavorite)

const [favorites, setFavorites] = useState([]) // Tablica ID Pokemonów, np. [1, 4, 7, 25]              └── FavoriteButton (otrzymuje isFavorite i onToggle)

const [pokemons, setPokemons] = useState([])```

const [loading, setLoading] = useState(true)

const [error, setError] = useState(null)### Opis komponentów

const [limitMessage, setLimitMessage] = useState('')

```#### `app/page.tsx` - Strona główna

- **Typ**: Komponent kliencki (`'use client'`)

**Pobieranie danych**: useEffect z fetch do PokeAPI (50 Pokemonów)- **Stan**:

  - `favorites: number[]` - tablica ID ulubionych Pokemonów

**Funkcja toggleFavorite**:  - `pokemons: Pokemon[]` - lista wszystkich Pokemonów

- Dodaje Pokemon do ulubionych (jeśli limit < 12)  - `loading: boolean` - stan ładowania

- Usuwa Pokemon z ulubionych (jeśli już jest)  - `error: string | null` - komunikaty błędów

- Waliduje limit i wyświetla komunikat  - `limitMessage: string` - komunikat o limicie

- Przekazywana do komponentów potomnych przez props- **Funkcje**:

  - `toggleFavorite(pokemonId: number)` - dodaje/usuwa z ulubionych z walidacją limitu

### PokemonCard.jsx  - `useEffect` - pobiera dane z PokeAPI przy montowaniu



**Dyrektywa**: `'use client'`#### `components/FavoriteButton.jsx`

- **Typ**: Komponent kliencki (`'use client'`)

**Props otrzymywane**:- **Props**:

- `id` - numer Pokemona  - `isFavorite: boolean` - czy Pokemon jest ulubiony

- `name` - nazwa  - `onToggle: () => void` - callback do zmiany stanu

- `img` - URL obrazka- **Funkcjonalność**:

- `types` - tablica typów  - Renderuje przycisk z gwiazdką

- `favorites` - tablica ID ulubionych (z rodzica)  - `e.preventDefault()` - zapobiega nawigacji

- `toggleFavorite` - funkcja callback (z rodzica)  - Hover effect - powiększenie przycisku



**Logika**:#### `components/FavoritesCounter.jsx`

```javascript- **Props**:

const isFavorite = favorites.includes(id);  - `count: number` - liczba ulubionych

```- **Funkcjonalność**:

  - Wyświetla licznik "X / 12"

Komponent sprawdza czy jego Pokemon znajduje się w tablicy ulubionych (nie zarządza własnym stanem).  - Informuje ile można jeszcze dodać

  - Komunikat gdy osiągnięto limit

### FavoriteButton.jsx

#### `components/PokemonList.jsx`

**Dyrektywa**: `'use client'`- **Props**:

  - `pokemons: Pokemon[]` - lista Pokemonów

**Props**:  - `favorites: number[]` - tablica ID ulubionych

- `isFavorite` (boolean) - czy Pokemon jest ulubiony  - `toggleFavorite: (id: number) => void` - funkcja do zmiany stanu

- `onToggle` (function) - funkcja callback do wywołania przy kliknięciu- **Funkcjonalność**:

  - Renderuje listę kart

**Renderowanie**:  - Przekazuje props w dół do PokemonCard

- ⭐ (wypełniona gwiazdka) jeśli `isFavorite === true`

- ☆ (pusta gwiazdka) jeśli `isFavorite === false`#### `components/PokemonCard.jsx`

- **Typ**: Komponent kliencki (`'use client'`)

**Event handling**:- **Props**:

```javascript  - `id, name, img, types` - dane Pokemona

onClick={(e) => {  - `favorites: number[]` - tablica ID ulubionych

  e.preventDefault(); // Zapobiega nawigacji Link  - `toggleFavorite: (id: number) => void` - funkcja do zmiany stanu

  e.stopPropagation();- **Funkcjonalność**:

  onToggle();  - Sprawdza czy Pokemon jest w favorites: `favorites.includes(id)`

}}  - Renderuje FavoriteButton

```  - Link do strony szczegółów



### Walidacja limitu## 🗂️ Struktura projektu



Przed dodaniem Pokemona do ulubionych:```

```javascriptsrc/

if (prevFavorites.length >= 12) {├── app/

  setLimitMessage('Osiągnięto limit 12 ulubionych Pokemonów!');│   ├── page.tsx               # 'use client', zarządza stanem favorites

  setTimeout(() => setLimitMessage(''), 3000); // Ukryj po 3s│   ├── layout.tsx             # Root layout z czcionką Irish Grover

  return prevFavorites; // Nie dodawaj│   ├── loading.tsx            # Loading state

}│   ├── error.tsx              # Error boundary

```│   ├── globals.css            # Style aplikacji

│   ├── pokemon/

Komunikat wyświetlany jako `<div>` nad listą Pokemonów z czerwonym tłem.│   │   └── [id]/

│   │       ├── page.tsx       # Szczegóły Pokemona (SSG)

### Strona wyszukiwarki (`/search`)│   │       └── loading.tsx    # Loading state

│   └── search/

**Dyrektywa**: `'use client'`│       └── page.tsx           # Wyszukiwarka (SSR)

└── components/

**Funkcjonalność**:    ├── PokemonCard.jsx        # 'use client', z FavoriteButton

- Filtrowanie po nazwie (input text)    ├── PokemonList.jsx        # Przekazuje props

- Filtrowanie po typie (select dropdown)    ├── FavoriteButton.jsx     # 'use client', przycisk gwiazdki

- Stan przechowywany w `useState` (nie URL)    ├── FavoritesCounter.jsx   # Licznik ulubionych

- Lista wyników używa tego samego `PokemonList` + `PokemonCard`    ├── StatsDisplay.tsx       # Statystyki (strona szczegółów)

- Ulubione przekazywane jako pusta tablica `[]` (read-only)    └── ToggleButton.tsx       # 'use client', toggle content

```

## 🚀 Uruchomienie

## 🚀 Uruchomienie projektu

```bash

# Instalacja zależności```bash

pnpm install# Instalacja zależności (jeśli nie zainstalowane)

npm install

# Uruchomienie serwera deweloperskiego

pnpm run dev# Uruchomienie w trybie deweloperskim

npm run dev

# Build produkcyjny

pnpm run build# Build produkcyjny

npm run build

# Uruchomienie wersji produkcyjnejnpm start

pnpm start```

```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 🎨 Funkcje aplikacji

## ✅ Zgodność z poleceniem

### Strona główna (/)

### Wymagania funkcjonalne- Lista 50 Pokemonów

- ✅ Przycisk oznaczania jako ulubiony na karcie- System ulubionych z przyciskami gwiazdek (⭐/☆)

- ✅ Wizualna indykacja ⭐ / ☆- Licznik ulubionych (X / 12)

- ✅ Licznik ulubionych- Komunikat o limicie

- ✅ Limit 12 Pokemonów z komunikatem- Link do wyszukiwarki

- ✅ Stan zeruje się po odświeżeniu- Pobieranie danych po stronie klienta (useEffect)



### Wymagania architektoniczne### Szczegóły Pokemona (/pokemon/[id])

- ✅ Strona główna jako komponent kliencki (`'use client'`)- Pełne informacje o Pokemonie

- ✅ Stan `favorites` w `useState` jako tablica ID- Obrazek z official artwork

- ✅ Props drilling przez wszystkie poziomy hierarchii- Nazwa, numer, wzrost, waga

- ✅ Lifting state up do wspólnego przodka- Typy

- ✅ Komponenty otrzymują props (nie zarządzają własnym stanem ulubionych)- Statystyki z kolorowymi paskami:

  - Zielony: wartość ≥ 80

### Wymagania techniczne  - Żółty: wartość ≥ 60

- ✅ JavaScript (nie TypeScript)  - Czerwony: wartość < 60

- ✅ Next.js 14+ z App Router- Umiejętności (zwykłe i ukryte)

- ✅ Komponenty funkcyjne- ToggleButton do pokazywania/ukrywania sekcji

- ✅ Tylko `useState` i `useEffect`- SSG - generowane podczas build

- ✅ ZAKAZ Context API / Redux / Zustand - przestrzegany- Linki nawigacyjne

- ✅ ZAKAZ localStorage - przestrzegany

### Wyszukiwarka (/search)

---- Wyszukiwanie po nazwie/numerze

- Filtrowanie po typie (dropdown z wszystkimi typami)

**Autor**: Tomasz Dylik  - SSR - zawsze świeże dane

**Data**: Listopad 2025  - Timestamp renderowania

**Punkty**: 1.0 pkt- Licznik wyników

- Obsługa braku wyników

## 📐 Kluczowe koncepcje

### Lifting State Up
Stan `favorites` jest przechowywany na najniższym wspólnym przodku wszystkich komponentów, które go potrzebują (strona główna). Dzięki temu:
- Jeden źródło prawdy
- Łatwe zarządzanie stanem
- Spójna synchronizacja między komponentami

### Props Drilling
Stan i funkcje przekazywane są przez props:
```
HomePage → PokemonList → PokemonCard → FavoriteButton
```

### Walidacja limitu
```typescript
const toggleFavorite = (pokemonId: number) => {
  setFavorites((prevFavorites) => {
    // Jeśli Pokemon już jest w ulubionych, usuń go
    if (prevFavorites.includes(pokemonId)) {
      setLimitMessage('');
      return prevFavorites.filter((id) => id !== pokemonId);
    }
    
    // Sprawdź limit przed dodaniem
    if (prevFavorites.length >= 12) {
      setLimitMessage('Osiągnięto limit 12 ulubionych Pokemonów!');
      setTimeout(() => setLimitMessage(''), 3000);
      return prevFavorites;
    }
    
    // Dodaj do ulubionych
    setLimitMessage('');
    return [...prevFavorites, pokemonId];
  });
};
```

## 📊 Przepływ danych

```
1. Montowanie HomePage
   ↓
2. useEffect pobiera dane z PokeAPI
   ↓
3. setPokemons(data)
   ↓
4. Renderowanie PokemonList z props
   ↓
5. Każdy PokemonCard sprawdza favorites.includes(id)
   ↓
6. FavoriteButton pokazuje ⭐ lub ☆
   ↓
7. Kliknięcie → toggleFavorite(id)
   ↓
8. setFavorites (walidacja limitu)
   ↓
9. Re-render z nowym stanem
```

## ✅ Spełnienie wymagań

- ✅ System ulubionych z przyciskiem na każdej karcie
- ✅ Wizualna indykacja (⭐ / ☆)
- ✅ Licznik ulubionych na stronie głównej
- ✅ Limit 12 z komunikatem
- ✅ Stan zeruje się po odświeżeniu
- ✅ Hierarchia: HomePage → PokemonList → PokemonCard → FavoriteButton
- ✅ Lifting state up
- ✅ Przekazywanie przez props
- ✅ useState + useEffect
- ✅ JavaScript komponenty (.jsx)
- ✅ Bez localStorage, Context API, Redux

## 🎓 Realizacja koncepcji "Lifting State Up"

Stan `favorites` został podniesiony do `HomePage`, ponieważ:
1. Zarówno licznik jak i przyciski potrzebują dostępu do tego stanu
2. HomePage jest najniższym wspólnym przodkiem
3. Umożliwia to synchronizację między wszystkimi komponentami
4. Spełnia zasadę single source of truth

## 📝 Technologie

- **Next.js 16.0.1** - Framework React z App Router
- **React 19.2.0** - Biblioteka UI
- **TypeScript** - Typowanie (strona główna)
- **JavaScript** - Komponenty
- **PokeAPI** - Źródło danych
- **CSS** - Stylowanie (Irish Grover font)

## 🔧 Konfiguracja

### Font
Aplikacja używa czcionki **Irish Grover** z Google Fonts, skonfigurowanej w `layout.tsx`.

### Tailwind CSS
Tailwind został usunięty i zastąpiony customowym CSS w `globals.css` dla lepszej kontroli nad stylami zgodnie z projektem GameDex.

---

Projekt zrealizowany zgodnie z wymaganiami **Zadania 4: GameDex — zarządzanie stanem z useState**
