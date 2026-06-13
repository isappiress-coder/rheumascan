const GUIDELINES = [
  {
    org: 'ACR', orgFull: 'American College of Rheumatology',
    color: 'border-blue-200', headerBg: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700',
    items: [
      { title: 'Guideline for Rheumatoid Arthritis', year: '2024', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Rheumatoid-Arthritis' },
      { title: 'Guideline for Gout Management', year: '2024', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Gout' },
      { title: 'Guideline for Lupus Nephritis', year: '2024', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Lupus-Nephritis' },
      { title: 'Guideline for Osteoarthritis of the Hand, Hip and Knee', year: '2023', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Osteoarthritis-of-the-Hand,-Hip-and-Knee' },
      { title: 'Guideline for Vasculitis', year: '2021', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Vasculitis' },
    ],
  },
  {
    org: 'EULAR', orgFull: 'European Alliance of Associations for Rheumatology',
    color: 'border-emerald-200', headerBg: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-700',
    items: [
      { title: 'Recommendations for Management of Rheumatoid Arthritis', year: '2024', url: 'https://www.eular.org/recommendations-management-rheumatoid-arthritis' },
      { title: 'Recommendations for Systemic Lupus Erythematosus', year: '2023', url: 'https://www.eular.org/recommendations-sle' },
      { title: 'Recommendations for ANCA-associated Vasculitis', year: '2022', url: 'https://www.eular.org' },
      { title: 'Recommendations for Spondyloarthritis', year: '2022', url: 'https://www.eular.org' },
      { title: 'Recommendations for Psoriatic Arthritis', year: '2023', url: 'https://www.eular.org' },
    ],
  },
  {
    org: 'SBR', orgFull: 'Sociedade Brasileira de Reumatologia',
    color: 'border-yellow-200', headerBg: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700',
    items: [
      { title: 'Consenso Brasileiro para Artrite Reumatoide', year: '2023', url: 'https://www.reumatologia.org.br/consenso' },
      { title: 'Diretrizes para Gota', year: '2023', url: 'https://www.reumatologia.org.br' },
      { title: 'Consenso para Lúpus Eritematoso Sistêmico', year: '2022', url: 'https://www.reumatologia.org.br' },
      { title: 'Diretrizes para Fibromialgia', year: '2022', url: 'https://www.reumatologia.org.br' },
    ],
  },
];

export default function Guidelines() {
  return (
    <div className="py-6 px-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Guidelines Oficiais</h1>
        <p className="text-sm text-slate-500 mt-1">Diretrizes das principais sociedades de reumatologia — ACR, EULAR e SBR (2021–2024)</p>
      </div>

      <div className="space-y-6">
        {GUIDELINES.map(org => (
          <div key={org.org} className={`bg-white rounded-2xl border ${org.color} overflow-hidden shadow-sm`}>
            {/* Header */}
            <div className={`${org.headerBg} px-5 py-4 flex items-center gap-3`}>
              <span className="text-white font-bold text-lg">{org.org}</span>
              <span className="text-white/70 text-sm">{org.orgFull}</span>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-100">
              {org.items.map(item => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-sm text-slate-700 group-hover:text-teal-700 font-medium transition-colors">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${org.badge}`}>{item.year}</span>
                    <span className="text-slate-300 group-hover:text-teal-500 transition-colors">→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center">
        Links direcionam para os sites oficiais das sociedades. Sempre verifique a versão mais atual.
      </p>
    </div>
  );
}
