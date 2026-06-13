import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Guidelines from './pages/Guidelines';

const DEFAULT_SOURCES = { pubmed: true, europepmc: true, s2: true };

export default function App() {
  const [page, setPage]           = useState('home');
  const [specialty, setSpecialty] = useState('all');
  const [sources, setSources]     = useState(DEFAULT_SOURCES);
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleSpecialty = (key) => {
    setSpecialty(key);
    setPage('home');
  };

  const toggleSource = (key) => {
    setSources(prev => {
      const active = Object.values(prev).filter(Boolean).length;
      if (prev[key] && active === 1) return prev; // keep at least one source
      return { ...prev, [key]: !prev[key] };
    });
  };

  const handleLastUpdated = useCallback((date) => setLastUpdated(date), []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        page={page}
        onNavigate={setPage}
        specialty={specialty}
        onSpecialty={handleSpecialty}
        sources={sources}
        onToggleSource={toggleSource}
        lastUpdated={lastUpdated}
      />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 min-w-0" style={{ marginLeft: '256px' }}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 capitalize">
              {page === 'home' ? '📄 Artigos' : page === 'guidelines' ? '📋 Guidelines' : '⭐ Favoritos'}
            </h2>
            <p className="text-xs text-slate-400">Reumatologia · Últimos 5 anos · {new Date().getFullYear()}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Ao vivo
          </div>
        </div>

        {/* Page content */}
        {page === 'home' && (
          <Home
            specialty={specialty}
            sources={sources}
            onLastUpdated={handleLastUpdated}
          />
        )}
        {page === 'guidelines' && <Guidelines />}
        {page === 'favorites'  && <Favorites />}
      </main>
    </div>
  );
}
