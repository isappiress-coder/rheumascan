export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔬</span>
        <span className="text-xl font-bold text-teal-700 tracking-tight">RheumaScan</span>
      </div>
      <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
        Inovações em Reumatologia · Últimos 5 anos
      </span>
    </header>
  );
}
