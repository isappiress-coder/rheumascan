const BASE_URL = '/pubmed';
const NCBI_PARAMS = 'tool=rheumascan&email=isap.piress@gmail.com';

export const SPECIALTIES = {
  all: 'rheumatology',
  lupus: 'systemic lupus erythematosus',
  arthritis: 'rheumatoid arthritis',
  gout: 'gout',
  vasculitis: 'vasculitis',
  fibromyalgia: 'fibromyalgia',
  spondylitis: 'ankylosing spondylitis',
  psoriatic: 'psoriatic arthritis',
  osteoarthritis: 'osteoarthritis',
  sjogren: 'sjogren syndrome',
};

async function fetchWithRetry(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res;
    if (res.status === 429 && attempt < retries) {
      await new Promise((r) => setTimeout(r, attempt * 1500));
      continue;
    }
    throw new Error(`Erro ao acessar o PubMed (${res.status}). Tente novamente em alguns segundos.`);
  }
}

export async function searchArticles(specialty = 'all', keyword = '') {
  const fiveYearsAgo = new Date().getFullYear() - 5;
  const baseTerm = SPECIALTIES[specialty] || SPECIALTIES.all;
  const term = keyword ? `(${baseTerm}) AND (${keyword})` : baseTerm;

  const searchUrl = `${BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&datetype=pdat&mindate=${fiveYearsAgo}&retmax=20&retmode=json&sort=pub+date&${NCBI_PARAMS}`;

  const searchRes = await fetchWithRetry(searchUrl);
  const searchData = await searchRes.json();
  const ids = searchData.esearchresult?.idlist ?? [];

  if (ids.length === 0) return { articles: [], total: 0 };

  // Pequena pausa entre as duas chamadas para respeitar o rate limit
  await new Promise((r) => setTimeout(r, 400));

  const summaryUrl = `${BASE_URL}/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json&${NCBI_PARAMS}`;
  const summaryRes = await fetchWithRetry(summaryUrl);
  const summaryData = await summaryRes.json();

  const articles = ids.map((id) => {
    const item = summaryData.result?.[id];
    if (!item) return null;
    return {
      id: `pubmed_${id}`,
      pmid: id,
      doi: null,
      title: item.title,
      authors: item.authors?.map((a) => a.name).join(', ') || 'Autores não disponíveis',
      journal: item.fulljournalname || item.source,
      date: item.pubdate,
      pubTypes: item.pubtype || [],
      source: 'PubMed',
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      isOpenAccess: false,
    };
  }).filter(Boolean);

  return { articles, total: Number(searchData.esearchresult?.count ?? 0) };
}
