import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie, CastMember } from '../types';
import { mockMovies, getRecommendations } from '../data/mockMovies';
import { useAuth } from '../contexts/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import MovieRow from '../components/MovieRow';
import BackButton from '../components/BackButton';
import PaymentModal from '../components/PaymentModal';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [movie,       setMovie]       = useState<Movie | null>(null);
  const [similar,     setSimilar]     = useState<Movie[]>([]);
  const [player,      setPlayer]      = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Demo user tekshiruvi — faqat "Demo bilan kirish" tugmasi orqali kirganlar
  const isDemo = localStorage.getItem('cv_is_demo') === '1';

  // To'langan filmlar ro'yxati localStorage dan
  const getPaidMovies = (): string[] => {
    try { return JSON.parse(localStorage.getItem('paid_movies') || '[]'); }
    catch { return []; }
  };
  const isPaid = (movieId: string) => isDemo || getPaidMovies().includes(movieId);

  const markAsPaid = (movieId: string) => {
    const paid = getPaidMovies();
    if (!paid.includes(movieId)) {
      paid.push(movieId);
      localStorage.setItem('paid_movies', JSON.stringify(paid));
    }
  };

  useEffect(() => {
    setPlayer(false);
    window.scrollTo({ top: 0 });
    const m = mockMovies.find(m => m._id === id) ?? null;
    setMovie(m);
    setSimilar(id ? getRecommendations(id) : []);
  }, [id]);

  // Loading holat
  if (movie === null && id) {
    const found = mockMovies.find(m => m._id === id);
    if (!found) return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-white text-xl font-bold mb-4">Film topilmadi (ID: {id})</p>
          <button onClick={() => navigate('/')} className="btn-red px-6 py-2.5 rounded-xl text-sm">Bosh sahifaga</button>
        </div>
      </div>
    );
  }

  if (!movie) return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center pt-16">
      <div className="w-10 h-10 border-4 border-white/10 border-t-[#E50914] rounded-full animate-spin" />
    </div>
  );

  const inWL = user?.watchlist?.includes(movie._id) ?? false;
  const toggleWL = () => {
    if (!user) return navigate('/login');
    updateUser({
      ...user,
      watchlist: inWL
        ? user.watchlist.filter(i => i !== movie._id)
        : [...user.watchlist, movie._id],
    });
  };

  const backdrop = movie.backdropImage || movie.backdrop || movie.thumbnail;
  const castName  = (c: string | CastMember) => typeof c === 'string' ? c : c.name;
  const castChar  = (c: string | CastMember) => typeof c === 'string' ? '' : c.character || '';

  return (
    <div className="min-h-screen bg-[#0b0b0f] pt-16">

      {/* ── Hero / Player ── */}
      {!player ? (
        <div className="relative overflow-hidden" style={{ height: 'clamp(320px, 50vw, 650px)' }}>
          <img
            src={backdrop}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${movie._id}bg/1280/720`; }}
          />
          <div className="hero-gradient absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 h-28"
            style={{ background: 'linear-gradient(to top,#0b0b0f,transparent)' }} />

          {/* Back */}
          <div className="absolute top-5 left-4 md:left-10 z-10">
            <BackButton />
          </div>

          {/* Play button */}
          <button
            onClick={() => {
              if (movie.isFree || isPaid(movie._id)) {
                setPlayer(true);
              } else {
                setShowPayment(true);
              }
            }}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className="w-20 h-20 rounded-full border-2 border-white/40 bg-black/40 backdrop-blur flex items-center justify-center group-hover:scale-110 group-hover:border-white group-hover:bg-black/60 transition-all duration-300">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          {/* Genre top-right */}
          <div className="absolute top-5 right-4 md:right-10 hidden md:flex flex-wrap gap-1 justify-end max-w-xs">
            {movie.genre.slice(0, 3).map(g => (
              <span key={g} className="glass text-white/70 text-xs px-2.5 py-1 rounded-full">{g}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full bg-black">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <BackButton label="Orqaga" />
            <span className="text-white/50 text-sm">{movie.title}</span>
          </div>
          <VideoPlayer src={movie.videoUrl} poster={backdrop} title={movie.title} />
          {/* YouTube warning */}
          {movie.videoUrl?.includes('youtube') && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
              <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-yellow-400/80 text-xs">Bu rasmiy YouTube traileri — to'liq film emas</span>
            </div>
          )}
        </div>
      )}

      {/* ── Info ── */}
      <div className="px-4 md:px-10 lg:px-16 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Genres mobile */}
            <div className="flex flex-wrap gap-2 mb-3 md:hidden">
              {movie.genre.map(g => (
                <span key={g} className="glass text-white/70 text-xs px-3 py-1 rounded-full">{g}</span>
              ))}
            </div>
            {/* Title */}
            <h1 className="text-white font-black text-4xl md:text-6xl leading-none mb-4"
              style={{ fontFamily: 'Poppins,sans-serif' }}>
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.rating.toFixed(1)}
              </span>
              <span className="text-white/25">|</span>
              <span className="text-white/60">{movie.releaseYear}</span>
              <span className="text-white/25">|</span>
              <span className="text-white/60">{Math.floor(movie.duration / 60)}s {movie.duration % 60}d</span>
              <span className="text-white/25">|</span>
              <span className="text-white/60">{movie.language}</span>
              {movie.maturityRating && (
                <span className="glass text-white/60 text-xs px-2 py-0.5 rounded">{movie.maturityRating}</span>
              )}
            </div>

            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-2xl">
              {movie.description}
            </p>

            {/* Price badge */}
            {!isDemo && movie.price && !movie.isFree && (
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center gap-2 bg-[#E50914]/15 border border-[#E50914]/40 text-white px-5 py-2.5 rounded-xl">
                  <svg className="w-5 h-5 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="text-white/60 text-sm">Ko'rish narxi:</span>
                  <span className="text-[#E50914] font-black text-lg">{movie.price?.toLocaleString()} so'm</span>
                </span>
              </div>
            )}
            {isDemo && (
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center gap-2 bg-green-500/15 border border-green-500/40 text-white px-5 py-2.5 rounded-xl">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span className="text-green-400 font-bold text-sm">Demo rejim — barcha filmlar bepul!</span>
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => {
                  if (isDemo || movie.isFree || isPaid(movie._id)) {
                    setPlayer(true);
                  } else {
                    setShowPayment(true);
                  }
                }}
                className="btn-red flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-base glow-red"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                {isDemo ? "Ko'rish (Demo)" : isPaid(movie._id) ? "Ko'rish" : `Ko'rish — ${movie.price?.toLocaleString()} so'm`}
              </button>

              <button
                onClick={toggleWL}
                className={`btn-glass flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm ${inWL ? '!border-[#E50914] !text-[#E50914]' : ''}`}
              >
                <svg className="w-4 h-4" fill={inWL ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={inWL ? 'M5 13l4 4L19 7' : 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'} />
                </svg>
                {inWL ? "Ro'yxatda" : "Ro'yxatga qo'shish"}
              </button>
            </div>

            {/* Cast */}
            {movie.cast.length > 0 && (
              <div>
                <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Aktyorlar</h3>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {movie.cast.slice(0, 8).map((c, i) => (
                    <div key={i} className="flex-shrink-0 text-center w-[70px]">
                      <div className="w-[70px] h-[70px] rounded-2xl overflow-hidden bg-[#1a1a1e] mb-1.5">
                        <img
                          src={`https://picsum.photos/seed/act${movie._id}${i}/80/80`}
                          alt={castName(c)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-white text-[10px] font-semibold truncate">{castName(c)}</p>
                      {castChar(c) && <p className="text-white/35 text-[9px] truncate">{castChar(c)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0 space-y-4">
            <div className="glass rounded-2xl p-5 space-y-3">
              <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Film haqida</h3>
              {([
                ['Rejissyor', movie.director],
                ['Yil', movie.releaseYear?.toString()],
                ['Davomiylik', `${Math.floor(movie.duration / 60)}s ${movie.duration % 60}d`],
                ['Til', movie.language],
                ['Yosh chegarasi', movie.maturityRating],
              ] as [string, string | undefined][]).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-white/35 text-xs">{k}</span>
                  <span className="text-white text-xs font-medium text-right">{v}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between mb-1.5">
                  <span className="text-white/35 text-xs">Reyting</span>
                  <span className="text-yellow-400 font-bold text-xs">{movie.rating}/10</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="progress-bar h-full rounded-full" style={{ width: `${movie.rating * 10}%` }} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${movie._id}/300/450`; }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <div className="pb-16">
          <MovieRow title="O'xshash Filmlar" movies={similar} />
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && movie.price && !isDemo && (
        <PaymentModal
          movieTitle={movie.title}
          price={movie.price}
          onSuccess={() => {
            markAsPaid(movie._id);
            setShowPayment(false);
            setPlayer(true);
          }}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default MovieDetailPage;
