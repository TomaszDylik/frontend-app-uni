'use client';

// Komponent przycisku ulubionego - gwiazdka
export default function FavoriteButton({ isFavorite, onToggle }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Zapobiega nawigacji przez Link
        e.stopPropagation();
        onToggle();
      }}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        fontSize: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 10
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
    >
      {isFavorite ? '⭐' : '☆'}
    </button>
  );
}
