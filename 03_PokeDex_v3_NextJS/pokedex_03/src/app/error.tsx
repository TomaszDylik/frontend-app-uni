'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div id="root-app">
      <div className="error-box">
        <h2>Wystąpił błąd!</h2>
        <p>{error.message}</p>
        <button className="btn-secondary" onClick={() => reset()}>
          Spróbuj ponownie
        </button>
      </div>
    </div>
  );
}
