import { SPECIALTIES } from '../services/pubmed';

const LABELS = {
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

export default function FilterBar({ selected, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.keys(SPECIALTIES).map((key) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            selected === key
              ? 'bg-teal-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-400 hover:text-teal-600'
          }`}
        >
          {LABELS[key]}
        </button>
      ))}
    </div>
  );
}
