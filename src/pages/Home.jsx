import { useState, useEffect, useCallback, useRef } from 'react';
import ArticleCard from '../components/ArticleCard';
import SkeletonCard from '../components/SkeletonCard';
import { searchAll } from '../services/searchAll';

function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rheumascan_favorites') || '[]'); }
    catch { return []; }
  });
  const toggle = useCallback((article) => {
    setFavorites(prev => {
      const exists = prev.some(a => a.id === article.id);
      const next = exists ? prev.filter(a => a.id !== article.id) : [article, ...prev];
      localStorage.setItem('rheumascan_favorites', JSON.stringify(next));
      return next;
    });
  }, []);
  return { favorites, toggle };
}

const SOURCE_COLORS = {
  pubmed: '#3b82f6',
  europepmc: '#10b981',
  s2: '#8b5cf6',
};

export default function Home({ specialty, sources, onLastUpdated }) {
  const [keyword, setKeyword]       = useState('');
  const [inputValue, setInputValue] = useState('');
  const [articles, setArticles]     = useState([]);
  const [totals, setTotals]         = useState({ pubmed: 0, europepmc: 0, s2: 0 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const { favorites, toggle }       = useFavorites();
  const refreshTimer                = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    searchAll(specialty, keyword, sources)
      .then(({ articles, totals }) => {
        setArticles(articles);
        setTotals(totals);
        onLastUpdated(new Date());
      })
      .catch(err => setError(err.message || 'Erro ao buscar artigos. Tente novamente.'))
      .finally(() => setLoading(false));
  }, [specialty, keyword, sources, onLastUpdated]);

  // Load on change + auto-refresh every 60 minutes
  useEffect(() => {
    load();
    clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(load, 60 * 60 * 1000);
    return () => clearInterval(refreshTimer.current);
  }, [load]);

  const handleSearch = e => { e.preventDefault(); setKeyword(inputValue.trim()); };
  const clearSearch  = () => { setKeyword(''); setInputValue(''); };

  const totalAll = totals.pubmed + totals.europepmc + totals.s2;

  return (
    <div className="flex flex-col gap-6 py-6 px-6 max-w-6xl">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Buscar por medicamento, doença, autor, palavra-chave..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
          />
        </div>
        <button type="submit" className="px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer shadow-sm transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0d9488, #0ea5e9)' }}>
          Buscar
        </button>
        {keyword && (
          <button type="button" onClick={clearSearch} className="px-4 py-3 rounded-xl text-sm text-slate-500 border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
            ✕
          </button>
        )}
      </form>

      {/* Stats bar */}
      {!loading && !error && (
        <div className="flex flex-wrap gap-3">
          <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-2 shadow-sm">
            <span className="text-2xl font-bold text-slate-800">{articles.length}</span>
            <span className="text-xs text-slate-500 leading-tight">artigos<br/>exibidos</span>
          </div>
          {[
            { key: 'pubmed',    label: 'PubMed' },
            { key: 'europepmc', label: 'Europe PMC' },
            { key: 's2',        label: 'Semantic Scholar' },
          ].filter(s => sources[s.key]).map(s => (
            <div key={s.key} className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: SOURCE_COLORS[s.key] }} />
              <div>
                <p className="text-lg font-bold text-slate-800 leading-none">{(totals[s.key] || 0).toLocaleString('pt-BR')}</p>
                <p className="text-[11px] text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-2 shadow-sm">
            <span className="text-lg font-bold text-teal-600">{totalAll.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-slate-500 leading-tight">total<br/>encontrado</span>
          </div>
        </div>
      )}

      {keyword && !loading && (
        <p className="text-sm text-slate-500 -mt-2">
          Resultados para <span className="font-semibold text-slate-700">"{keyword}"</span>
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-red-700">Falha ao carregar artigos</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
            <button onClick={load} className="mt-2 text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer underline">
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
          : articles.map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                isFavorite={favorites.some(f => f.id === article.id)}
                onToggleFavorite={toggle}
              />
            ))}
      </div>

      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-3">🔬</p>
          <p className="font-medium">Nenhum artigo encontrado</p>
          <p className="text-sm mt-1">Tente outros termos ou verifique os filtros ativos</p>
        </div>
      )}
    </div>
  );
}
