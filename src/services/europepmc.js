const BASE = '/europepmc/search';
const NCBI_PARAMS = 'tool=rheumascan&email=isap.piress@gmail.com';

async function fetchWithRetry(url, retries = 3) {
  for (let i = 1; i <= retries; i++) {
    const res = await fetch(url);
    if (res.ok) return res;
    if (res.status === 429 && i < retries) {
      await new Promise(r => setTimeout(r, i * 1500));
      continue;
    }
    throw new Error(`Europe PMC error: ${res.status}`);
  }
}

export async function searchEuropePMC(term, minYear) {
  const query = `(${term}) AND (FIRST_PDATE:[${minYear}-01-01 TO ${new Date().getFullYear()}-12-31])`;
  const url = `${BASE}?query=${encodeURIComponent(query)}&resultType=core&pageSize=8&format=json&sort=P_PDATE_D%20desc&${NCBI_PARAMS}`;

  const res = await fetchWithRetry(url);
  const data = await res.json();
  const results = data.resultList?.result ?? [];

  return {
    articles: results.map(item => ({
      id: `epmc_${item.id}`,
      pmid: item.pmid,
      doi: item.doi,
      title: item.title,
      authors: item.authorString || 'Autores não disponíveis',
      journal: item.journalTitle || '',
      date: item.firstPublicationDate || item.pubYear || '',
      pubTypes: item.pubType ? [item.pubType] : [],
      source: 'Europe PMC',
      url: item.doi
        ? `https://doi.org/${item.doi}`
        : `https://europepmc.org/article/med/${item.pmid || item.id}`,
      isOpenAccess: item.isOpenAccess === 'Y',
    })),
    total: data.hitCount ?? 0,
  };
}
