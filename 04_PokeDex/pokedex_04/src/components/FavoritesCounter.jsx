// Komponent licznika ulubionych Pokemonow
export default function FavoritesCounter({ count }) {
  return (
    <div style={{
      textAlign: 'center',
      margin: '1rem 0',
      padding: '1rem',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      maxWidth: '300px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <div style={{ 
        fontSize: '2rem',
        marginBottom: '0.5rem'
      }}>
        ⭐
      </div>
      <div style={{
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#333'
      }}>
        Ulubione Pokemony: {count} / 12
      </div>
      {count > 0 && (
        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          {count === 12 ? 'Osiągnięto maksymalny limit!' : `Możesz dodać jeszcze ${12 - count}`}
        </div>
      )}
    </div>
  );
}
