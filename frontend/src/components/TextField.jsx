export default function TextField({ label, type = 'text', name, value, onChange, required, placeholder }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-slate-200 mb-1">{label}</span>
      <input
        className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-slate-100 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
      />
    </label>
  );
}
