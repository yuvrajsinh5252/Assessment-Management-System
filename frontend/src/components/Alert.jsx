export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const colorMap = {
    info: 'border-sky-500/40 bg-sky-500/10 text-sky-100',
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
    error: 'border-rose-500/40 bg-rose-500/10 text-rose-100',
  };

  return (
    <div className={`mb-4 rounded-2xl border px-5 py-4 text-sm shadow-sm ${colorMap[type]}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="leading-5">{message}</p>
        {onClose && (
          <button
            type="button"
            className="text-slate-200"
            onClick={onClose}
            aria-label="Close message"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
