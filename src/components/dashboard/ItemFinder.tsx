import { useState } from 'react';
import { Search, Camera, MapPin, Package } from 'lucide-react';

interface Result {
  name: string;
  location: string;
  category: string;
}

const MOCK_ITEMS: Result[] = [
  { name: 'مفاتيح السيارة', location: 'الدرج بجانب التلفاز', category: 'مفاتيح' },
  { name: 'نظارة طبية', location: 'حقيبة اليد', category: 'إكسسوارات' },
  { name: 'كتاب الطب', location: 'المكتب - الرف الثاني', category: 'كتب' },
  { name: 'سماعة البلوتوث', location: 'درج المكتب', category: 'إلكترونيات' },
  { name: 'بطاقة الهوية', location: 'المحفظة', category: 'مستندات' },
];

export default function ItemFinder() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);

  const search = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setSearched(true);
    setResults(MOCK_ITEMS.filter((item) => item.name.includes(q) || item.location.includes(q) || item.category.includes(q)));
  };

  return (
    <div className="card p-5 sm:p-6 animate-fade-up">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-9 h-9 rounded-xl bg-warning-500/15 flex items-center justify-center text-warning-600 dark:text-warning-400">
          <MapPin size={20} />
        </div>
        <div>
          <h2 className="font-bold text-lg">أين وضعتها؟</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">ابحث عن أي مقتنى واعثر على مكانه فوراً</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mt-4">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder="مثال: مفاتيح السيارة..."
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-brand-400 focus:bg-white dark:focus:bg-slate-800 outline-none py-3 pr-11 pl-14 text-sm transition-all"
        />
        <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition" aria-label="بحث بالصورة">
          <Camera size={18} />
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div className="mt-4 space-y-2 animate-fade-in">
          {results.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
              <Package size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">لا توجد نتائج مطابقة</p>
            </div>
          ) : (
            results.map((item) => (
              <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition animate-scale-in">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Package size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin size={12} />
                    {item.location}
                  </p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  {item.category}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
