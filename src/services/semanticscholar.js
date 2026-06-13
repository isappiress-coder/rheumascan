const BASE = '/s2/paper/search';

async function fetchWithRetry(url, retries = 2) {
  for (let i = 1; i <= retries; i++) {
    const res = await fetch(url);
    if (res.ok) return res;
    if ((res.status === 429 || res.status === 503) && i < retries) {
      await new Promise(r => setTimeout(r, i * 2000));
      continue;
    }
    throw new Error(`Semantic Scholar error: ${res.status}`);
  }
}

export async function searchSemanticScholar(term, minYear) {
  const fields = 'title,authors,year,journal,publicationTypes,externalIds,openAccessPdf';
  const url = `${BASE}?query=${encodeURIComponent(term)}&fields=${fields}&limit=5&year=${minYear}-${new Date().getFullYear()}`;

  const res = await fetchWithRetry(url);
  const data = await res.json();
  const items = data.data ?? [];

  return {
    articles: items.map(item => ({
      id: `s2_${item.paperId}`,
      doi: item.externalIds?.DOI,
      pmid: item.externalIds?.PubMed,
      title: item.title,
      authors: item.authors?.map(a => a.name).join(', ') || 'Autores não disponíveis',
      journal: item.journal?.name || '',
      date: item.year ? String(item.year) : '',
      pubTypes: item.publicationTypes ?? [],
      source: 'Semantic Scholar',
      url: item.externalIds?.DOI
        ? `https://doi.org/${item.externalIds.DOI}`
        : `https://www.semanticscholar.org/paper/${item.paperId}`,
      isOpenAccess: !!item.openAccessPdf,
    })),
    total: data.total ?? 0,
  };
}
