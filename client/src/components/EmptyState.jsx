export default function EmptyState({
  message = 'Nothing here yet',
  icon = '📭',
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <p className="empty-state__message">{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn--primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
