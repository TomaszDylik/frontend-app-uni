const pokeapi = 'https://pokeapi.co/api/v2';
console.log('GameDex start - test (console)');

const app = document.getElementById('app');

// Nagłówek
const title = document.createElement('h1');
title.textContent = 'GameDex - wyszukiwarka Pokemonów';

////////////// Szukanie + Loading + Błędy //////////////

// search section
const searchSection = document.createElement('div');
searchSection.className = 'search-section';

// kontener paska wyszukiwania
const searchContainer = document.createElement('div');
searchContainer.className = 'search-container';

// input w search
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Wpisz nazwę pokemona...';
searchInput.className = 'search-input';

// przycisk szukaj
const searchButton = document.createElement('button');
searchButton.textContent = 'Szukaj';
searchButton.className = 'search-button';

// loading
const loading = document.createElement('div');
loading.className = 'loading-hidden';
loading.textContent = 'Ładowanie…';

// komplet paska wyszukiwania
searchContainer.append(searchInput, searchButton);

// dodanie do glownego kontenera search
searchSection.appendChild(searchContainer);
searchSection.appendChild(loading);

////////// Sekcja wynikowa: lista pokemonow + szczegoly //////////

// main section
const mainSection = document.createElement('div');
mainSection.className = 'main-section'

// lista pokemnonow
const listSection = document.createElement('div');
listSection.className = 'list-section';

// szczegóły pokemona
const detailsSection = document.createElement('div');
detailsSection.className = 'details-section';

mainSection.append(listSection, detailsSection);

// dodanie wszystkich elementów bez details
app.append(title, searchSection, mainSection);

////////// funckje //////////

// wyciągnij ID z URL (ostatni numer po /)
function extractIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return Number(parts[parts.length - 1]);
}

// obsluga loading – sterowanie widocznoscia 
function showLoading() {
  loading.className = 'loading-visible';
}
function hideLoading() {
  loading.className = 'loading-hidden';
}

//////// pobieranie danych z PokeApi funckje //////////

// Lista pierwszych 20 pokemonów z obrazkami
async function fetchPokemons() {
  try {
    const response = await fetch(`${pokeapi}/pokemon?limit=20`);
    if (!response.ok) {
      throw new Error(`Nie udało się pobrać listy (${response.status})`); // blad 1 
    }

    const data = await response.json();

    // pobranie obrazka od kazdego pokemona zrobione z pomoca
    const detailed = await Promise.all(
      data.results.map(async (pokemon) => {
        const id = extractIdFromUrl(pokemon.url);
        const res = await fetch(`${pokeapi}/pokemon/${id}`);
        if (!res.ok) {
          throw new Error(`Nie udało się pobrać szczegółów listy (${res.status})`); // blad 2
        }
        const d = await res.json(); // zamiana na obiekt JS 

        const img = // zrobione z pomoca (pobranie obrazkow z PokeApi)
          d?.sprites?.other?.['official-artwork']?.front_default ||
          d?.sprites?.front_default ||
          '';

        return { name: pokemon.name, id, img };
      })
    );

    return detailed;
  } finally {
  }
}

// pokazanie szczegóły jednego
async function fetchPokemonDetails(id) {
  try {
    const response = await fetch(`${pokeapi}/pokemon/${id}`);
    if (!response.ok) {
      throw new Error(`Nie udało się pobrać szczegółów (${response.status})`); // blad 2
    }
    return await response.json();
  } finally {
  }
}

////////////// render + lista + szczegoly ////////////////////

// obrazek i nazwa pokemona (lista)
function renderList(pokemons) {
  listSection.innerHTML = '';

  pokemons.forEach((pokemon) => {
    const item = document.createElement('div');
    item.className = 'pokemon-list-item';

    // nazwa
    const namePokemonSpan = document.createElement('span');
    namePokemonSpan.textContent = pokemon.name;
    namePokemonSpan.className = 'pokemon-name'
    item.appendChild(namePokemonSpan);    
    
    // zaladowanie obrazka
    const img = document.createElement('img');
    img.className = 'pokemon-image';
    img.src = pokemon.img;
    item.appendChild(img);  

    // klik => szczegóły
    item.addEventListener('click', () => onPokemonClick(pokemon.id));

    listSection.appendChild(item);
  });
}

// szczegóły: typy, wzrost, waga, podstawowe staty
function renderPokemonDetails(pokemon) {
  detailsSection.innerHTML = '';

  // I kolumna
  const firstCol = document.createElement('div');
  firstCol.className = 'first-col';
  
  // nagłówek - nazwa poka
  const name = document.createElement('h1');
  name.textContent = pokemon.name;
  firstCol.appendChild(name);

  // wzrost/waga 
  const height = document.createElement('p');
  height.textContent = 'Wzrost: ' + pokemon.height;
  const weight = document.createElement('p');
  weight.textContent = 'Waga: ' + pokemon.weight;
  firstCol.appendChild(height);
  firstCol.appendChild(weight);

  // typy - naglowek
  const typesTitle = document.createElement('h3');
  typesTitle.textContent = 'Typy:';
  firstCol.appendChild(typesTitle);

  // dodanie diva dla typu/typow pokemona (moga byc dwa)
  const typesBox = document.createElement('div');
  typesBox.className = 'typesBox';

  // dodanie kazdwgo typu pokemona do diva z typami
  pokemon.types.forEach((t) => {
    const typ = document.createElement('div');
    typ.textContent = t.type.name;
    typ.className = 'typBox';
    typesBox.appendChild(typ);
  });

  firstCol.appendChild(typesBox);

  // II kolumna
  const secondCol = document.createElement('div');
  secondCol.className = 'second-col';
  
  // statystyki - naglowek 
  const statsTitle = document.createElement('h3');
  statsTitle.textContent = 'Podstawowe statystyki:';
  secondCol.appendChild(statsTitle);

  // div dla statystyk
  const statsBox = document.createElement('div');

  // dodanie kazdej statystyki do diva statystyk
  pokemon.stats.forEach((stat) => {
    const p = document.createElement('p');
    p.textContent = stat.stat.name + ': ' + stat.base_stat;
    statsBox.appendChild(p);
  });
  secondCol.appendChild(statsBox);

  // Dodaj obie kolumny do sekcji szczegółów
  detailsSection.append(firstCol, secondCol);
}

////////////// interakcje //////////////////

// Szukaj – wyszukiwanie po nazwie 
searchButton.addEventListener('click', async () => {
  showLoading();
  const searchText = searchInput.value.toLowerCase().trim(); // do malych plus obciecie spacji
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1,5 sek opóźnienia
    const pokemons = await fetchPokemons();
    const filtered = pokemons.filter((p) => p.name.includes(searchText));
    renderList(filtered);
  } catch (e) {
    console.error(e);
  }
  hideLoading();
  detailsSection.innerHTML = '';

});

// start i wyrenderowanie listy pokemonow
(async function init() {
  try {
    const pokemons = await fetchPokemons();
    renderList(pokemons);
  } catch (e) {
    console.error(e);
  }
})();

///// OBSLUGA SZCZEGOLOW
// zamykanie szczegolow po podwojnym kiknieciu w pokemona o tym smaym id
let openedPokemonId = null; // wartosc start             

async function onPokemonClick(id) {
  // ten sam pokemon
  if (openedPokemonId === id) {
    detailsSection.innerHTML = '';            
    openedPokemonId = null;
    return;
  }
  // inny pokemon
  openedPokemonId = id;

  try {
    const details = await fetchPokemonDetails(id);  // pobierz dane
    renderPokemonDetails(details);                  // pokaż szczegóły
  } catch (err) {
    console.error('Błąd podczas pobierania szczegółów pokemona:', err);
  }
};
