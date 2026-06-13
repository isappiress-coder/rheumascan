import Logo from './Logo';
import { SPECIALTIES } from '../services/searchAll';

const SPECIALTY_LABELS = {
  all: 'Todos',
  lupus: 'Lúpus',
  arthritis: 'Artrite Reumatoide',
  gout: 'Gota',
  vasculitis: 'Vasculite',
  fibromyalgia: 'Fibromialgia',
  spondylitis: 'Espondilite',
  psoriatic: 'Artrite Psoriásica',
  osteoarthritis: 'Osteoartrite',
  sjogren: 'Sjögren',
};

const NAV_ITEMS = [
  { key: 'home', icon: '📄', label: 'Artigos' },
  { key: 'guidelines', icon: '📋', label: 'Guidelines' },
  { key: 'favorites', icon: '⭐', label: 'Favoritos' },
];

const SOURCE_LABELS = {
  pubmed: { label: 'PubMed', color: '#3b82f6' },
  europepmc: { label: 'Europe PMC', color: '#10b981' },
  s2: { label: 'Semantic Scholar', color: '#8b5cf6' },
};

export default function Sidebar({ page, onNavigate, specialty, onSpecialty, sources, onToggleSource, lastUpdated }) {
  const minutesAgo = lastUpdated
    ? Math.floor((Date.now() - lastUpdated.getTime()) / 60000)
    : null;

  return (
    <aside className="fixed top-0 left-0 h-full w-64 flex flex-col z-20 select-none" style={{ background: '#0f1629' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Logo />
      </div>

      {/* Navegação */}
      <nav className="px-3 pt-4 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-2 mb-2">Menu</p>
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              page === item.key
                ? 'bg-teal-500/20 text-teal-400'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {page === item.key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
          </button>
        ))}
      </nav>

      {/* Filtro por subespecialidade */}
      <div className="px-3 mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-2 mb-2">Subespecialidade</p>
        <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1 sidebar-scroll">
          {Object.keys(SPECIALTIES).map(key => (
            <button
              key={key}
              onClick={() => onSpecialty(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer text-left ${
                specialty === key
                  ? 'bg-teal-500/20 text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${specialty === key ? 'bg-teal-400' : 'bg-slate-600'}`} />
              {SPECIALTY_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Fontes */}
      <div className="px-3 mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-2 mb-2">Fontes</p>
        <div className="space-y-1">
          {Object.entries(SOURCE_LABELS).map(([key, cfg]) => (
            <label key={key} className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/5 group">
              <input
                type="checkbox"
                checked={sources[key]}
                onChange={() => onToggleSource(key)}
                className="w-3.5 h-3.5 rounded accent-teal-400"
              />
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
              <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{cfg.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-auto px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          {minutesAgo === null
            ? 'Carregando...'
            : minutesAgo === 0
            ? 'Atualizado agora'
            : `Atualizado há ${minutesAgo}min`}
        </div>
        <p className="text-[10px] text-slate-600 mt-1">Últimos 5 anos · Auto-refresh 60min</p>
      </div>
    </aside>
  );
}
