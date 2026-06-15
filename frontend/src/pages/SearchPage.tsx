import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Movie } from '../types';
import { mockMovies } from '../data/mockMovies';
import MovieCard from '../components/MovieCard';
import { SkeletonCard } from '../components/SkeletonCard';
import BackButton from '../components/BackButton';

const GENRES  = ['Action','Drama','Sci-Fi','Crime','Adventure','Comedy','Biography','Thriller'];
const YEARS   = [2024,2023,2022,2021,2020,2019,2018,2015,2010];
const RATINGS = [
  { label: '9+', min: 9 },
  { label: '8+', min: 8 },
  { label: '7+', min: 7 },
  { label: '6+', min: 6 },
];

const SearchPage = () => {
  const [sp, setSp] = useSearchParams();
  const q      = sp.get('q')      || '';
  const genre  = sp.get('genre')  || '';
  const year   = sp.get('year')   || '';
  const rating = sp.get('rating') || '';

  const [input,   setInput]   = useState(q);
  const [movies,  setMovies]  = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const applyFilter = useCallback((qVal: string, gVal: string, yVal: string, rVal: string) => {
    setLoading(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      let res = [...mockMovies];
      if (qVal) {
        const lq = qVal.toLowerCase();
        res = res.filter(m =>
          m.title.toLowerCase().includes(lq) ||
          m.description.toLowerCase().includes(lq) ||
          m.genre.some(g => g.toLowerCase().includes(lq)) ||
          m.cast.some(c => (typeof c === 'string' ? c : c.name).toLowerCase().includes(lq)) ||
          (m.director || '').toLowerCase().includes(lq)
        );
      }
      if (gVal) res = res.filter(m => m.genre.some(g => g.toLowerCase() === gVal.toLowerCase()));
      if (yVal) res = res.filter(m => m.releaseYear === parseInt(yVal));
      if (rVal) res = res.filter(m => m.rating >= parseFloat(rVal));
      setMovies(res);
      setLoading(false);
    }, 250);
  }, []);

  useEffect(() => {
    setInput(q);
    applyFilter(q, genre, year, rating);
  }, [q, genre, year, rating]);

  const onInputChange = (val: string) => {
    setInput(val);
    const newSp: Record<string, string> = {};
    if (val.trim()) newSp.q = val.trim();
    if (genre)  newSp.genre  = genre;
    if (year)   newSp.year   = year;
    if (rating) newSp.rating = rating;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Qidiruv tarixini saqlash
      if (val.trim()) {
        try {
          const hist: string[] = JSON.parse(localStorage.getItem('search_history') || '[]');
          const updated = [val.trim(), ...hist.filter(h => h !== val.trim())].slice(0, 20);
          localStorage.setItem('search_history', JSON.stringify(updated));
        } catch {}
      }
      setSp(newSp);
    }, 300);
  };

  const setFilter = (key: string, val: string) => {
    const newSp: Record<string, string> = {};
    if (q) newSp.q = q;
    if (key === 'genre'  && val) newSp.genre  = val;
    else if (genre  && key !== 'genre')  newSp.genre  = genre;
    if (key === 'year'   && val) newSp.year   = val;
    else if (year   && key !== 'year')   newSp.year   = year;
    if (key === 'rating' && val) newSp.rating = val;
    else if (rating && key !== 'rating') newSp.rating = rating;
    setSp(newSp);
  };

  const clearAll = () => { setInput(''); setSp({}); };

  const title = q ? `"${q}"` : genre ? genre : 'Barcha filmlar';
  const hasFilters = !!(q || genre || year || rating);

  return (
    <div className="min-h-screen bg-[#0b0b0f] pt-20 pb-20 page-enter">
      <div className="px-4 md:px-10 lg:px-16">

        {/* Top bar */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-white font-black text-2xl" style={{ fontFamily: 'Poppins,sans-serif' }}>
            {title}
          </h1>
          {!loading && (
            <span className="text-white/30 text-sm">{movies.length} film</span>
          )}
          {hasFilters && (
            <button onClick={clearAll}
              className="ml-auto text-white/40 hover:text-white text-xs flex items-center gap-1 glass px-3 py-1.5 rounded-lg transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Tozalash
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative mb-6 max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            value={input}
            onChange={e => onInputChange(e.target.value)}
            placeholder="Film, aktyor, janr..."
            className="input-cv w-full pl-11 pr-10 py-3.5 rounded-xl text-sm"
          />
          {input && (
            <button onClick={() => onInputChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Genre filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setFilter('genre', '')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              !genre ? 'bg-[#E50914] text-white' : 'glass text-white/50 hover:text-white'
            }`}>
            Hammasi
          </button>
          {GENRES.map(g => (
            <button key={g}
              onClick={() => setFilter('genre', genre === g ? '' : g)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                genre === g ? 'bg-[#E50914] text-white' : 'glass text-white/50 hover:text-white'
              }`}>
              {g}
            </button>
          ))}
        </div>

        {/* Year + Rating */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          <span className="text-white/25 text-xs">Yil:</span>
          {YEARS.map(y => (
            <button key={y}
              onClick={() => setFilter('year', year === y.toString() ? '' : y.toString())}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                year === y.toString()
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'glass text-white/40 hover:text-white'
              }`}>
              {y}
            </button>
          ))}
          <span className="text-white/25 text-xs ml-3">Reyting:</span>
          {RATINGS.map(r => (
            <button key={r.label}
              onClick={() => setFilter('rating', rating === r.min.toString() ? '' : r.min.toString())}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                rating === r.min.toString()
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'glass text-white/40 hover:text-white'
              }`}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {Array.from({ length: 14 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg className="w-16 h-16 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p className="text-white/40 text-xl font-semibold">Hech narsa topilmadi</p>
            <p className="text-white/20 text-sm">Boshqa kalit so'z yoki janr tanlang</p>
            <button onClick={clearAll} className="btn-glass px-6 py-2.5 rounded-xl text-sm mt-2">
              Filtrllarni tozalash
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
            {movies.map((m, i) => (
              <MovieCard key={m._id} movie={m} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
