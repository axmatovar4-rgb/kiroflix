import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import { SkeletonRow } from '../components/SkeletonCard';
import { useAuth } from '../contexts/AuthContext';
import { mockMovies, getTrendingMovies, getTopRatedMovies, getNewReleases, getMoviesByGenre } from '../data/mockMovies';
import { Movie } from '../types';

const ADMIN_KEY = 'cv_admin_movies';

const DEMO_LIMIT = 10;

const getAllMovies = (isDemo: boolean): Movie[] => {
  try {
    const saved = localStorage.getItem(ADMIN_KEY);
    const adminMovies: Movie[] = saved ? JSON.parse(saved) : [];
    const adminIds = new Set(adminMovies.map(m => m._id));
    const all = [...adminMovies, ...mockMovies.filter(m => !adminIds.has(m._id))];
    return isDemo ? all.slice(0, DEMO_LIMIT) : all;
  } catch {
    return isDemo ? mockMovies.slice(0, DEMO_LIMIT) : mockMovies;
  }
};

const GENRES = [
  { id: 'Action',    label: 'Aksiya' },
  { id: 'Drama',     label: 'Drama' },
  { id: 'Sci-Fi',    label: 'Ilmiy Fantastika' },
  { id: 'Crime',     label: 'Jinoyat' },
  { id: 'Adventure', label: 'Sarguzasht' },
  { id: 'Comedy',    label: 'Komediya' },
];

const HomePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const isDemo = localStorage.getItem('cv_is_demo') === '1';
    console.log('Demo mode:', isDemo, '| Flag value:', localStorage.getItem('cv_is_demo'));
    const movies = getAllMovies(isDemo);
    console.log('Movies loaded:', movies.length);
    setAllMovies(movies);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const trending    = [...allMovies].sort((a,b) => b.views - a.views).slice(0,8);
  const topRated    = [...allMovies].sort((a,b) => b.rating - a.rating).slice(0,8);
  const newReleases = [...allMovies].sort((a,b) => b.releaseYear - a.releaseYear).slice(0,8);
  const byGenre     = (g: string) => allMovies.filter(m => m.genre.some(x => x.toLowerCase() === g.toLowerCase()));

  const continueWatching = user?.watchHistory?.length
    ? mockMovies.filter(m => user.watchHistory!.some(h => h.movieId === m._id)).slice(0, 6)
    : [];

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Hero */}
      <HeroBanner />

      {/* Content */}
      <div className="relative z-10 mt-4 pb-20">
        {loading ? (
          <>
            <SkeletonRow /><SkeletonRow /><SkeletonRow />
          </>
        ) : (
          <>
            {/* Continue watching */}
            {continueWatching.length > 0 && (
              <MovieRow title="Ko'rishni davom ettirish" movies={continueWatching} badge="Davom" />
            )}

            {/* Har bir row uchun unique filmlar — oldingi rowlarda ko'rsatilganlar o'tkazib yuboriladi */}
            {(() => {
              const used = new Set<string>();
              const pick = (list: typeof allMovies, max = 8) => {
                const res = list.filter(m => !used.has(m._id)).slice(0, max);
                res.forEach(m => used.add(m._id));
                return res;
              };

              const trendMovies   = pick([...allMovies].sort((a,b) => b.views - a.views));
              const topMovies     = pick([...allMovies].sort((a,b) => b.rating - a.rating));
              const newMovies     = pick([...allMovies].sort((a,b) => b.releaseYear - a.releaseYear));
              const genreRows     = GENRES.map(g => ({
                label: g.label,
                id: g.id,
                films: pick(allMovies.filter(m => m.genre.some(x => x.toLowerCase() === g.id.toLowerCase())), 6),
              }));
              const remaining     = allMovies.filter(m => !used.has(m._id));

              return (
                <>
                  {trendMovies.length > 0  && <MovieRow title="Trenddagi Filmlar"      movies={trendMovies}  badge="TREND" />}
                  {topMovies.length > 0    && <MovieRow title="Eng Yuqori Baholangan"  movies={topMovies}    badge="TOP"   />}
                  {newMovies.length > 0    && <MovieRow title="Yangi Chiqganlar"        movies={newMovies}    badge="YANGI" />}
                  {genreRows.map(g => g.films.length > 0 && (
                    <MovieRow key={g.id} title={g.label} movies={g.films} />
                  ))}
                  {remaining.length > 0    && <MovieRow title="Boshqa Filmlar"          movies={remaining}             />}
                </>
              );
            })()}
          </>
        )}
      </div>

      {/* ── TARIFLAR ── */}
      <section id="tariflar" className="py-24 px-4 md:px-10 lg:px-16 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs font-bold uppercase tracking-widest mb-3">Tariflar</p>
            <h2 className="text-white font-black text-3xl md:text-5xl mb-4" style={{fontFamily:'Poppins,sans-serif'}}>
              O'zingizga mos tarifni tanlang
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              Har qanday ehtiyoj uchun qulay narxlar. Istalgan vaqt bekor qilish imkoniyati.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1 Oylik */}
            <div className="relative rounded-2xl border border-white/10 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform hover:shadow-2xl hover:shadow-black/60">
              <div className="bg-gradient-to-br from-slate-600 to-slate-700 px-6 pt-8 pb-6">
                <p className="text-white/70 text-sm font-medium mb-2">1 Oylik</p>
                <div className="flex items-end gap-1">
                  <span className="text-white font-black text-3xl">100 000</span>
                </div>
                <p className="text-white/50 text-xs mt-1">so'm/oy</p>
              </div>
              <div className="bg-white/5 border-t border-white/10 px-6 py-6 flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {[
                    [true,  'HD sifat (720p)'],
                    [true,  '1 ta qurilma'],
                    [true,  '10 ta film'],
                    [false, 'Reklama yo\'q'],
                    [false, 'Yuklab olish'],
                    [false, '4K sifat'],
                    [false, 'Cheksiz filmlar'],
                    [false, 'Oilaviy rejim'],
                  ].map(([ok, text], i) => (
                    <li key={i} className="flex items-center gap-3">
                      {ok ? (
                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      ) : (
                        <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                      )}
                      <span className={`text-sm ${ok ? 'text-white/80' : 'text-white/25 line-through'}`}>{text as string}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-3 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all">
                  Boshlash
                </button>
              </div>
            </div>

            {/* 3 Oylik */}
            <div className="relative rounded-2xl border border-blue-500/40 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform hover:shadow-2xl hover:shadow-black/60">
              <div className="bg-gradient-to-br from-blue-700 to-blue-800 px-6 pt-8 pb-6">
                <p className="text-white/70 text-sm font-medium mb-2">3 Oylik</p>
                <div className="flex items-end gap-1">
                  <span className="text-white font-black text-3xl">300 000</span>
                </div>
                <p className="text-white/50 text-xs mt-1">so'm/3 oy</p>
              </div>
              <div className="bg-white/5 border-t border-white/10 px-6 py-6 flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {[
                    [true,  'Full HD (1080p)'],
                    [true,  '2 ta qurilma'],
                    [true,  '50 ta film'],
                    [true,  'Reklama yo\'q'],
                    [true,  'Yuklab olish (5 ta)'],
                    [false, '4K sifat'],
                    [false, 'Cheksiz filmlar'],
                    [false, 'Oilaviy rejim'],
                  ].map(([ok, text], i) => (
                    <li key={i} className="flex items-center gap-3">
                      {ok ? (
                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      ) : (
                        <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                      )}
                      <span className={`text-sm ${ok ? 'text-white/80' : 'text-white/25 line-through'}`}>{text as string}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all">
                  Boshlash
                </button>
              </div>
            </div>

            {/* 6 Oylik */}
            <div className="relative rounded-2xl border border-purple-500/50 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform hover:shadow-2xl hover:shadow-black/60">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-white text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">Mashhur</span>
              </div>
              <div className="bg-gradient-to-br from-purple-700 to-purple-800 px-6 pt-8 pb-6">
                <p className="text-white/70 text-sm font-medium mb-2">6 Oylik</p>
                <div className="flex items-end gap-1">
                  <span className="text-white font-black text-3xl">600 000</span>
                </div>
                <p className="text-white/50 text-xs mt-1">so'm/6 oy</p>
              </div>
              <div className="bg-white/5 border-t border-white/10 px-6 py-6 flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {[
                    [true,  'Full HD + 4K sifat'],
                    [true,  '3 ta qurilma'],
                    [true,  '100 ta film'],
                    [true,  'Reklama yo\'q'],
                    [true,  'Yuklab olish (20 ta)'],
                    [true,  'Yangi filmlar erta'],
                    [true,  'Maxsus kontentlar'],
                    [false, 'Oilaviy rejim'],
                  ].map(([ok, text], i) => (
                    <li key={i} className="flex items-center gap-3">
                      {ok ? (
                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      ) : (
                        <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                      )}
                      <span className={`text-sm ${ok ? 'text-white/80' : 'text-white/25 line-through'}`}>{text as string}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-3 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all">
                  Boshlash
                </button>
              </div>
            </div>

            {/* 1 Yillik */}
            <div className="relative rounded-2xl border border-[#E50914]/60 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform hover:shadow-2xl hover:shadow-[#E50914]/20">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-[#E50914] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">Eng Yaxshi</span>
              </div>
              <div className="bg-gradient-to-br from-[#E50914] to-[#b20710] px-6 pt-8 pb-6">
                <p className="text-white/70 text-sm font-medium mb-2">1 Yillik</p>
                <div className="flex items-end gap-1">
                  <span className="text-white font-black text-3xl">1 500 000</span>
                </div>
                <p className="text-white/50 text-xs mt-1">so'm/yil</p>
              </div>
              <div className="bg-white/5 border-t border-white/10 px-6 py-6 flex-1 flex flex-col">
                <ul className="space-y-3 flex-1">
                  {[
                    [true, '4K Ultra HD'],
                    [true, '5 ta qurilma'],
                    [true, 'Cheksiz filmlar'],
                    [true, 'Reklama yo\'q'],
                    [true, 'Cheksiz yuklab olish'],
                    [true, 'Oilaviy rejim (5 profil)'],
                    [true, 'Yangi filmlar erta'],
                    [true, 'Premium qo\'llab-quvvatlash'],
                  ].map(([ok, text], i) => (
                    <li key={i} className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      <span className="text-sm text-white/80">{text as string}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-3 rounded-xl text-sm font-bold bg-[#E50914] hover:bg-[#c2070f] text-white transition-all">
                  Boshlash
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-dark border-t border-white/10">
        <div className="flex">
          {[
            ['/', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, 'Bosh'],
            ['/search', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>, 'Qidirish'],
            ['/profile', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, 'Profil'],
          ].map(([to, icon, label]) => (
            <a key={to as string} href={to as string} className="flex-1 flex flex-col items-center justify-center py-3 text-white/40 hover:text-white transition-colors gap-1">
              {icon}
              <span className="text-[10px]">{label as string}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
