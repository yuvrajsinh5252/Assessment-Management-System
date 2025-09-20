export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur rounded-2xl shadow-xl border border-slate-700">
        <div className="px-8 py-10">
          <h1 className="text-3xl font-semibold text-white mb-2">{title}</h1>
          {subtitle && <p className="text-slate-300 mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
