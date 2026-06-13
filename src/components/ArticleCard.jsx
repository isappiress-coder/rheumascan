const SOURCE_STYLES = {
  'PubMed':           { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  'Europe PMC':       { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Semantic Scholar': { bg: 'bg-violet-50',  text: 'text-violet-700', dot: 'bg-violet-500' },
};

const TYPE_STYLES = {
  guideline:       { label: 'Guideline',      bg: 'bg-purple-100 text-purple-700' },
  'meta-analysis': { label: 'Meta-análise',   bg: 'bg-blue-100 text-blue-700' },
  review:          { label: 'Revisão',         bg: 'bg-orange-100 text-orange-700' },
  'clinical trial':{ label: 'Ensaio Clínico', bg: 'bg-green-100 text-green-700' },
  'case report':   { label: 'Relato de Caso', bg: 'bg-slate-100 text-slate-600' },
};

function getTypeBadge(pubTypes) {
  if (!pubTypes?.length) return null;
  const lower = pubTypes.map(t => t.toLowerCase());
  for (const [key, val] of Object.entries(TYPE_STYLES)) {
    if (lower.some(t => t.includes(key))) return val;
  }
  return null;
}

function formatDate(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  }
  return raw;
}

export default function ArticleCard({ article, isFavorite, onToggleFavorite }) {
  const src = SOURCE_STYLES[article.source] ?? SOURCE_STYLES['PubMed'];
  const typeBadge = getTypeBadge(article.pubTypes);

  return (
    <article className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3.5 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${src.bg} ${src.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${src.dot}`} />
            {article.source}
          </span>
          {typeBadge && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeBadge.bg}`}>
              {typeBadge.label}
            </span>
          )}
          {article.isOpenAccess && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
              Open Access
            </span>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(article)}
          className="text-lg cursor-pointer flex-shrink-0 leading-none hover:scale-110 transition-transform"
          title={isFavorite ? 'Remover dos favoritos' : 'Salvar'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {/* Date */}
      {article.date && (
        <p className="text-[11px] text-slate-400 -mt-1">{formatDate(article.date)}</p>
      )}

      {/* Title */}
      <h3 className="text-slate-800 font-semibold text-sm leading-snug group-hover:text-teal-700 transition-colors line-clamp-3">
        {article.title}
      </h3>

      {/* Authors + Journal */}
      <div className="text-xs text-slate-400 space-y-0.5">
        <p className="truncate">{article.authors}</p>
        {article.journal && (
          <p className="font-medium text-slate-500 truncate italic">{article.journal}</p>
        )}
      </div>

      {/* Footer */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
      >
        Ver artigo completo →
      </a>
    </article>
  );
}
