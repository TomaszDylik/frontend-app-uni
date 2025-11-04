interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface StatsDisplayProps {
  stats: Stat[];
}

function statColor(value: number): string {
  if (value >= 80) return '#00ff00';
  if (value >= 60) return '#ffff00';
  return '#ff0000';
}

function ProgressBar({ label, value, max = 120 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = statColor(value);
  
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <div className="stat-bar">
        <div className="stat-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );
}

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  const total = stats.reduce((acc, s) => acc + (s.base_stat || 0), 0);

  return (
    <div className="statsBox">
      {stats.map((s) => (
        <ProgressBar key={s.stat.name} label={s.stat.name} value={s.base_stat} />
      ))}
      <div className="stats-total">
        <span>Suma:</span>
        <span className="stats-total-value">{total}</span>
      </div>
    </div>
  );
}
