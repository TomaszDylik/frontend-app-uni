'use client';

interface ToggleButtonProps {
  children: React.ReactNode;
  buttonLabel: string;
}

export default function ToggleButton({ children, buttonLabel }: ToggleButtonProps) {
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const content = button.nextElementSibling as HTMLElement;
    if (content) {
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? 'block' : 'none';
      button.textContent = isHidden ? `${buttonLabel} ▼` : `${buttonLabel} ▶`;
    }
  };

  return (
    <div>
      <button
        className="btn-secondary"
        onClick={handleToggle}
        style={{ marginBottom: '1rem' }}
      >
        {buttonLabel} ▼
      </button>
      <div>
        {children}
      </div>
    </div>
  );
}
