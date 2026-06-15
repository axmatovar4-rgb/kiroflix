import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { getFeaturedMovies } from '../data/mockMovies';
import { useAuth } from '../contexts/AuthContext';

const HeroBanner = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [movies] = useState<Movie[]>(getFeaturedMovies());
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const movie = movies[current];

  useEffect(() => {
    setLoaded(false);
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, [current]);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % movies.length), 8000);
    return () => clearInterval(t);
  }, [movies.length]);

  if (!movie) return null;

  const inWatchlist = user?.watchlist?.includes(movie._id) ?? false;
  const toggleWatchlist = () => {
    if (!user) return navigate('/login');
    const newList = inWatchlist
      ? user.watchlist.filter(id => id !== movie._id)
      : [...user.watchlist, movie._id];
    updateUser({ ...user, watchlist: newList });
  };

  const backdrop = movie.backdrop || movie.backdropImage || movie.thumbnail;

  return (
    <div className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden noise">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          key={movie._id}
          src={backdrop}
          alt={movie.title}
          className={`w-full h-full object-cover transition-all duration-1000 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${movie._id}/1920/1080`; }}
        />
        <div className="hero-overlay absolute inset-0" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48" style={{background:'linear-gradient(to top, #080808, transparent)'}} />
      </div>

      {/* Content */}
      <div className={`absolute inset-0 flex flex-col justify-end pb-32 px-8 md:px-16 lg:px-24 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="max-w-2xl">
          {/* Genre badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genre.slice(0,3).map(g => (
              <span key={g} className="glass text-white/80 text-xs px-3 py-1 rounded-full font-medium">{g}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-white font-black text-5xl md:text-7xl lg:text-8xl leading-none mb-4 tracking-tight">
            {movie.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="text-yellow-400 font-bold">{movie.rating.toFixed(1)}</span>
            </div>
            <span className="text-white/50">|</span>
            <span className="text-white/70">{movie.releaseYear}</span>
            <span className="text-white/50">|</span>
            <span className="text-white/70">{Math.floor(movie.duration/60)}s {movie.duration%60}d</span>
            {movie.maturityRating && (
              <>
                <span className="text-white/50">|</span>
                <span className="glass text-white/70 text-xs px-2 py-0.5 rounded">{movie.maturityRating}</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-lg line-clamp-3">
            {movie.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(`/movie/${movie._id}`)}
              className="btn-primary flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-base neon-red"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Ko'rish
            </button>

            <button
              onClick={() => navigate(`/movie/${movie._id}`)}
              className="btn-ghost flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Batafsil
            </button>

            <button
              onClick={toggleWatchlist}
              className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all ${
                inWatchlist ? 'border-[#E50914] bg-[#E50914]/20 text-[#E50914]' : 'border-white/30 text-white/70 hover:border-white glass'
              }`}
            >
              <svg className="w-5 h-5" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={inWatchlist ? 'M5 13l4 4L19 7' : 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-8 md:left-16 lg:left-24 flex items-center gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-[#E50914]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>

      {/* Director info bottom-right */}
      {movie.director && (
        <div className="absolute bottom-10 right-8 md:right-16 text-right hidden md:block">
          <p className="text-white/30 text-xs">Rejissyor</p>
          <p className="text-white/70 text-sm font-medium">{movie.director}</p>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
