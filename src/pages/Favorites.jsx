import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try { setFavorites(JSON.parse(localStorage.getItem('rheumascan_favorites') || '[]')); }
    catch { setFavorites([]); }
  }, []);

  const remove = (article) => {
    const next = favorites.filter(a => a.id !== article.id);
    setFavorites(next);
    localStorage.setItem('rheumascan_favorites', JSON.stringify(next));
  };

  return (
    <div className="py-6 px-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Artigos Favoritos</h1>
        <p className="text-sm text-slate-500 mt-1">
          {favorites.length === 0 ? 'Nenhum artigo salvo ainda.' : `${favorites.length} artigo${favorites.length > 1 ? 's' : ''} salvo${favorites.length > 1 ? 's' : ''}`}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24 text-slate-400">
          <p className="text-5xl mb-4">☆</p>
          <p className="font-medium text-slate-500">Nenhum favorito ainda</p>
          <p className="text-sm mt-1">Clique na estrela em qualquer artigo para salvar aqui</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {favorites.map(article => (
            <ArticleCard key={article.id} article={article} isFavorite onToggleFavorite={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
