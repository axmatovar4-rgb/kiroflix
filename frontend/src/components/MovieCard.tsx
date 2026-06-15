import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface Props { movie: Movie; index?: number; size?: 'sm' | 'md' | 'lg'; }

const MovieCard = ({ movie, index = 0, size = 'md' }: Props) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [imgErr, setImgErr] = useState(false);
  const inWatchlist = user?.watchlist?.includes(movie._id) ?? false;

  const toggleWL = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return navigate('/login');
    updateUser({ ...user, watchlist: inWatchlist
      ? user.watchlist.filter(id => id !== movie._id)
      : [...user.watchlist, movie._id] });
  };

  const widthClass = size === 'sm' ? 'w-28 md:w-36' : size === 'lg' ? 'w-44 md:w-56' : 'w-36 md:w-44';

  return (
    <div
      className={`movie-card relative flex-shrink-0 ${widthClass} cursor-pointer group`}
      style={{ animationDelay: `${index * 0.04}s` }}
      onClick={() => navigate(`/movie/${movie._id}`)}
    >
      {/* Poster */}
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1e]">
        <img
          src={imgErr ? `https://picsum.photos/seed/${movie._id}/400/600` : movie.thumbnail}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500"
          onError={() => setImgErr(true)}
          loading="lazy"
        />

        {/* Dark overlay on hover */}
        <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {movie.isTrending && (
            <span className="text-[9px] font-black bg-[#E50914] text-white px-1.5 py-0.5 rounded-md tracking-wide">
              TREND
            </span>
          )}
        </div>

        {/* Rating top-right */}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded-md">
          <svg className="w-2.5 h-2.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span className="text-white text-[9px] font-bold">{movie.rating.toFixed(1)}</span>
        </div>

        {/* Price badge bottom-left */}
        <div className="absolute bottom-2 left-2">
          {movie.price ? (
            <span className="text-[9px] font-black bg-[#E50914]/90 text-white px-1.5 py-0.5 rounded-md">
              {(movie.price / 1000).toFixed(0)}K
            </span>
          ) : null}
        </div>

        {/* Hover info */}
        <div className="card-info absolute inset-x-0 bottom-0 p-2.5">
          <p className="text-white text-[11px] font-bold truncate mb-1.5">{movie.title}</p>
          <div className="flex items-center gap-2">
            {/* Play */}
            <button
              onClick={e => { e.stopPropagation(); navigate(`/movie/${movie._id}`); }}
              className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-white/80 transition-colors flex-shrink-0"
            >
              <svg className="w-3 h-3 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
            </button>
            {/* Watchlist */}
            <button onClick={toggleWL}
              className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
                inWatchlist ? 'border-[#E50914] bg-[#E50914]/25 text-[#E50914]' : 'border-white/40 text-white/70 hover:border-white'
              }`}>
              <svg className="w-3 h-3" fill={inWatchlist?'currentColor':'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={inWatchlist?'M5 13l4 4L19 7':'M12 4v16m8-8H4'}/>
              </svg>
            </button>
            <span className="text-white/50 text-[9px] ml-auto">{movie.releaseYear}</span>
          </div>
        </div>
      </div>

      {/* Title below */}
      <p className="text-white/60 text-[11px] mt-1.5 truncate group-hover:text-white transition-colors font-medium px-0.5">
        {movie.title}
      </p>
      <p className="text-white/30 text-[10px] px-0.5 truncate">{movie.genre.slice(0,2).join(' · ')}</p>
    </div>
  );
};

export default MovieCard;
