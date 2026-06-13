import { searchArticles as searchPubMed, SPECIALTIES } from './pubmed';
import { searchEuropePMC } from './europepmc';
import { searchSemanticScholar } from './semanticscholar';

export { SPECIALTIES };

function dedup(articles) {
  const seen = new Set();
  return articles.filter(a => {
    const key = a.doi
      ? `doi:${a.doi.toLowerCase()}`
      : a.pmid
      ? `pmid:${a.pmid}`
      : `id:${a.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function searchAll(specialty, keyword, enabledSources) {
  const minYear = new Date().getFullYear() - 5;
  const term    = SPECIALTIES[specialty] || SPECIALTIES.all;
  const query   = keyword ? `(${term}) AND (${keyword})` : term;

  // Run all enabled sources in parallel; each failure returns empty result
  const [pubmedResult, europeResult, s2Result] = await Promise.all([
    enabledSources.pubmed
      ? searchPubMed(specialty, keyword).catch(() => ({ articles: [], total: 0 }))
      : Promise.resolve({ articles: [], total: 0 }),
    enabledSources.europepmc
      ? searchEuropePMC(query, minYear).catch(() => ({ articles: [], total: 0 }))
      : Promise.resolve({ articles: [], total: 0 }),
    enabledSources.s2
      ? searchSemanticScholar(query, minYear).catch(() => ({ articles: [], total: 0 }))
      : Promise.resolve({ articles: [], total: 0 }),
  ]);

  const totals = {
    pubmed:    pubmedResult.total,
    europepmc: europeResult.total,
    s2:        s2Result.total,
  };

  const allArticles = [
    ...pubmedResult.articles,
    ...europeResult.articles,
    ...s2Result.articles,
  ];

  const unique = dedup(allArticles);

  unique.sort((a, b) => {
    const da = new Date(a.date || '1970');
    const db = new Date(b.date || '1970');
    return isNaN(db) - isNaN(da) || db - da;
  });

  return { articles: unique, totals };
}
