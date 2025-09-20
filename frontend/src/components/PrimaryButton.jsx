export default function PrimaryButton({ children, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      className={`w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
