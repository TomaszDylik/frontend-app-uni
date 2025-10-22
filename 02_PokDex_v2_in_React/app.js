const POKEAPI = 'https://pokeapi.co/api/v2';

/* =========================
   "Store" i logika 
   ========================= */
const appState = {
  pokemons: [],        // [{ id, name, img, types: ['fire',...], details?: fullJson }]
  types: [],           // ['fire','water',...]
  searchQuery: '',     // tekst wyszukiwania (nazwa lub numer)
  selectedTypes: new Set(), // aktywne filtry po typach
  openedPokemonId: null,
  useJSXCard: true,    // przełącznik JSX vs createElement
  loading: true,
  error: '',
};

// Kolor paska stat zależny od wartości
function statColor(value) {
  if (value >= 80) return '#00ff00';     // zielony
  if (value >= 60)  return '#ffff00';     // żółty
  return '#ff0000';                       // czerwony
}

// Wyciągnięcie ID z URL
function extractIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

// Pobierz 50 pokemonów + szczegóły (by mieć typy i obrazek) oraz listę typów
async function loadInitialData() {
  appState.loading = true;
  appState.error = '';
  render();

  try {
    const [listRes, typesRes] = await Promise.all([
      fetch(`${POKEAPI}/pokemon?limit=50`), 
      fetch(`${POKEAPI}/type`),
    ]);

    if (!listRes.ok) throw new Error(`Błąd listy: ${listRes.status}`);  // obsluga bledow 
    if (!typesRes.ok) throw new Error(`Błąd typów: ${typesRes.status}`);

    const listJson = await listRes.json(); // do json lista pokemonow
    const typesJson = await typesRes.json(); // do json lista typow

    // pełne dane każdego pokemona + obrazki + typy 
    const detailed = await Promise.all(
      listJson.results.map(async (p) => {
        const id = extractIdFromUrl(p.url); // identyfikacja po id pokemona 

        const detRes = await fetch(`${POKEAPI}/pokemon/${id}`); // pobranie szczegolow
        if (!detRes.ok) throw new Error(`Błąd szczegółów ${id}: ${detRes.status}`); 
        
        const d = await detRes.json();
        const img = // pobranie obrazka 
          d?.sprites?.other?.['official-artwork']?.front_default ||
          d?.sprites?.front_default || '';
        const types = d.types.map(t => t.type.name);
        return { id, name: p.name, img, types, details: d };
      })
    );
    // aktualizacja stanu aplikacji
    appState.pokemons = detailed;
    appState.types = typesJson.results.map(t => t.name);
    appState.loading = false;
    render();
  } catch (err) {
    appState.error = err.message || 'Nieznany błąd';
    appState.loading = false;
    render();
  }
}

// pobranie danych danego pokemona po id
async function fetchPokemonDetails(id) {
  try {
    const res = await fetch(`${POKEAPI}/pokemon/${id}`);
    if (!res.ok) throw new Error(`Nie udało się pobrać szczegółów (${res.status})`);
    return await res.json();
  } catch (e) {
    appState.error = e.message;
    render();
    return null;
  }
}

// filtorowanie na zywo poké\emonów wg stanu CALEJ aplikacji i wyszukiwanie i wybrane typy
function getVisiblePokemons() {
  const q = appState.searchQuery.trim().toLowerCase(); // tekst szukania to lowercase
  const byTypes = appState.selectedTypes; // filtry typow
  return appState.pokemons.filter(p => {
    const matchText = !q || p.name.includes(q) || String(p.id).includes(q); //puste, zawiera wpis, zawiera id
    const matchTypes = byTypes.size === 0 || p.types.some(t => byTypes.has(t)); //jesli ma jeden to jest true
    return matchText && matchTypes;
  });
}

// renderuje na zywo pokemony przy zmianie wyszukiwania
function onSearchChange(value) {
  appState.searchQuery = value;
  render();
}

// przelaczanie filtru typu (wlacz/wylacz) typy
function onToggleType(typeName) {
  const types = appState.selectedTypes;
  if (types.has(typeName)) {
    types.delete(typeName);
  } else {
    types.add(typeName);
  }
  render();
}

async function onPokemonClick(id) {
  // jesli ten sam to zamknij jezeli inny to otworz nowy
  if (appState.openedPokemonId === id) {
    appState.openedPokemonId = null;
    render();
    return;
  }
  appState.openedPokemonId = id;
  render(); 

}

function onToggleCardMode() {
  appState.useJSXCard = !appState.useJSXCard;
  render();
}

//KOMONENTY 

// Pasek statystyki
function ProgressBar({ label, value, max = 120 }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = statColor(value);
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <div className="stat-bar">
        <div className="stat-fill" style={{ width: pct + '%', backgroundColor: color }} />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );
}

// Karta Pokemona — WERSJA JSX
function PokemonCardJSX({ pokemon, onClick }) {
  return (
    <div className="pokemon-list-item" onClick={() => onClick(pokemon.id)}>
      <span className="pokemon-name">{pokemon.name}</span>
      <img className="pokemon-image" src={pokemon.img} alt={pokemon.name} />
      <div className="mini-types">
        {(pokemon.types || []).map(t => (
          <span key={t} className="typBox typBox--small">{t}</span>
        ))}
      </div>
    </div>
  );
}

// Karta Pokemona — WERSJA React.createElement
function PokemonCardReact(props) {
  const p = props.pokemon;
  return React.createElement(
    'div',
    { className: 'pokemon-list-item', onClick: () => props.onClick(p.id) },
    React.createElement('span', { className: 'pokemon-name' }, p.name),
    React.createElement('img', { className: 'pokemon-image', src: p.img, alt: p.name }),
    React.createElement(
      'div',
      { className: 'mini-types' },
      (p.types || []).map(t => React.createElement('span', { key: t, className: 'typBox typBox--small' }, t))
    )
  );
}

// szczegoly pokemona
function PokemonDetails({ details }) {
  if (!details) return null;
  const abilities = details.abilities || [];
  const stats = details.stats || [];

  const total = stats.reduce((acc, s) => acc + (s.base_stat || 0), 0);

  return (
    <div className="details-section">
      <div className="first-col">
        <h1>{details.name}</h1>
        <p>Wzrost: {details.height}</p>
        <p>Waga: {details.weight}</p>

        <h3>Typy:</h3>
        <div className="typesBox">
          {(details.types || []).map((t) => (
            <div key={t.type.name} className="typBox">{t.type.name}</div>
          ))}
        </div>

        <h3>Umiejętności:</h3>
        <ul className="abilities">
          {abilities.map(a => (
            <li key={a.ability.name} className={a.is_hidden ? 'ability ability--hidden' : 'ability'}>
              {a.ability.name} {a.is_hidden ? '(ukryta)' : ''}
            </li>
          ))}
        </ul>
      </div>

      <div className="second-col">
        <h3>Podstawowe statystyki:</h3>
        <div className="statsBox">
          {stats.map(s => (
            // pasek umijetnosci kolorowy
            <ProgressBar key={s.stat.name} label={s.stat.name} value={s.base_stat} />
          ))}
          <div className="stats-total">
            <span>Suma:</span>
            <span className="stats-total-value">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pasek narzędzi: szukaj + filtry + przełącznik
function Toolbar({ searchQuery, types, selectedTypes, onSearchChange, onToggleType, useJSXCard, onToggleCardMode }) {
  return (
    <div className="search-section">
      <div className="search-container">
        <input
          type="text"
          placeholder="Szukaj po nazwie lub numerze..."
          className="search-input"
          value={searchQuery}
          onInput={(e) => onSearchChange(e.target.value)}
        />
        <button className="search-button" onClick={() => onSearchChange(searchQuery)}>Szukaj</button>
      </div>

      <div className="filters">
        <div className="filters-list">
          {types.map(t => (
            // obsluga przyciskow typow
            <button
              key={t}
              className={selectedTypes.has(t) ? 'filter-btn filter-btn--active' : 'filter-btn'}
              onClick={() => onToggleType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="filters-actions">
          <button className="btn-secondary" onClick={onToggleCardMode}>
            Tryb karty: {useJSXCard ? 'JSX' : 'createElement'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Lista kart
function PokemonList({ pokemons, onCardClick, useJSX }) {
  const Card = useJSX ? PokemonCardJSX : PokemonCardReact;
  return (
    <div className="list-section">
      {pokemons.map(p => <Card key={p.id} pokemon={p} onClick={onCardClick} />)}
    </div>
  );
}

// Root prezentacyjny
function App(props) {
  const { state } = props;
  const visible = getVisiblePokemons();

  const opened = state.openedPokemonId
    ? (state.pokemons.find(p => p.id === state.openedPokemonId)?.details || null)
    : null;

  return (
    <div id="root-app">
      <h1>GameDex - wyszukiwarka Pokemonów (React)</h1>

      <Toolbar
        searchQuery={state.searchQuery}
        types={state.types}
        selectedTypes={state.selectedTypes}
        onSearchChange={onSearchChange}
        onToggleType={onToggleType}
        useJSXCard={state.useJSXCard}
        onToggleCardMode={onToggleCardMode}
      />

      {state.loading && <div className="loading-visible">Ładowanie…</div>}
      {state.error && <div className="error-box">Błąd: {state.error}</div>}

      {!state.loading && !state.error && (
        <div className="main-section">
          <PokemonList pokemons={visible} onCardClick={onPokemonClick} useJSX={state.useJSXCard} />
          {opened && <PokemonDetails details={opened} />}
        </div>
      )}
    </div>
  );
}

//renderowanie aplikacji

const mountNode = document.getElementById('app');
const root = ReactDOM.createRoot(mountNode); 

function render() {
  ReactDOM.render(<App state={appState} />, mountNode);
}

// Start
render();
loadInitialData();


