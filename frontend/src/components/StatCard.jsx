import React, { useEffect, useState, useRef } from 'react';

const formatValue = (value, withPlus) => {
  if (!Number.isFinite(value)) return '--';
  return withPlus && value > 0 ? `${value}+` : String(value);
};

const StatCard = ({ Icon, label, value, withPlus = false, duration = 1000 }) => {
  const [display, setDisplay] = useState(() => (Number.isFinite(value) ? 0 : '--'));
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!Number.isFinite(value)) {
      setDisplay('--');
      return;
    }

    const start = performance.now();
    startRef.current = start;
    const from = 0;
    const to = Number(value);

    const step = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad-ish
      const current = Math.round(from + (to - from) * eased);
      setDisplay(withPlus ? `${current}+` : String(current));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(formatValue(to, withPlus));
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, withPlus, duration]);

  return (
    <div className="stat-card">
      <div className="stat-icon">
        {Icon ? <Icon size={32} /> : null}
      </div>
      <div className="stat-content">
        <h3>{display}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
