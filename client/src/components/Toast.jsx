import { useEffect, useState } from 'react';

const TYPE_CONFIG = {
  success: { icon: '✓', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.12)' },
  error: { icon: '✕', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.12)' },
  info: { icon: 'ℹ', color: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.12)' },
};

export default function Toast({ message, type = 'info', onClose }) {
  const [exiting, setExiting] = useState(false);
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`toast ${exiting ? 'toast--exit' : ''}`}
      style={{
        '--toast-accent': config.color,
        '--toast-bg': config.bg,
      }}
    >
      <span className="toast__icon" style={{ color: config.color }}>
        {config.icon}
      </span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={handleClose} aria-label="Close">
        ✕
      </button>
    </div>
  );
}
