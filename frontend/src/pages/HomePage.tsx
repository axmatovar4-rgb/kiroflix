import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import { SkeletonRow } from '../components/SkeletonCard';
import { useAuth } from '../contexts/AuthContext';
import { mockMovies, getTrendingMovies, getTopRatedMovies, getNewReleases, getMoviesByGenre } from '../data/mockMovies';
import { Movie } from '../types';

const ADMIN_KEY = 'cv_admin_movies';

const DEMO_LIMIT = 10;

// Tarif bo'yicha film limiti
const getPlanLimit = (): number => {
  const isDemo    = localStorage.getItem('cv_is_demo') === '1';
  const planName  = localStorage.getItem('cv_plan_name') || '';
  if (isDemo) return 10;
  if (planName.includes('1 Oylik'))  return 10;
  if (planName.includes('3 Oylik'))  return 50;
  if (planName.includes('6 Oylik'))  return 100;
  if (planName.includes('1 Yillik')) return Infinity;
  return Infinity; // default — cheksiz
};

const getAllMovies = (): Movie[] => {
  try {
    const saved = localStorage.getItem(ADMIN_KEY);
    const adminMovies: Movie[] = saved ? JSON.parse(saved) : [];
    const adminIds = new Set(adminMovies.map(m => m._id));
    const all = [...adminMovies, ...mockMovies.filter(m => !adminIds.has(m._id))];
    const limit = getPlanLimit();
    return limit === Infinity ? all : all.slice(0, limit);
  } catch {
    return mockMovies;
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
    const movies = getAllMovies();
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
