import React, { useRef, useState } from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface Props {
  title: string;
  movies: Movie[];
  badge?: string;
}

const MovieRow = ({ title, movies, badge }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir: 'left' | 'right') => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth * 0.7 : el.clientWidth * 0.7, behavior: 'smooth' });
    setTimeout(() => {
      setCanLeft(el.scrollLeft > 0);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    }, 350);
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  if (!movies.length) return null;

  return (
    <div className="mb-10 group/row">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 px-4 md:px-12">
        <h2 className="text-white font-bold text-lg md:text-xl">{title}</h2>
        {badge && (
          <span className="text-[10px] font-bold bg-[#E50914] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
            {badge}
          </span>
        )}
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        {/* Scroll buttons */}
        <div className="flex items-center gap-1">
          <button onClick={() => scroll('left')}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
              canLeft
                ? 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                : 'border-white/5 text-white/15 cursor-default'
            }`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button onClick={() => scroll('right')}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
              canRight
                ? 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                : 'border-white/5 text-white/15 cursor-default'
            }`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Left fade + arrow */}
        <button onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-4 z-20 w-12 flex items-center justify-center transition-all duration-300 ${
            canLeft ? 'opacity-0 group-hover/row:opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ background: 'linear-gradient(to right, rgba(11,11,15,0.95), transparent)' }}>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
            </svg>
          </div>
        </button>

        {/* Cards */}
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex gap-3 overflow-x-auto hide-scrollbar px-4 md:px-12 pb-2"
        >
          {movies.map((movie, i) => (
            <MovieCard key={movie._id} movie={movie} index={i} />
          ))}
        </div>

        {/* Right fade + arrow */}
        <button onClick={() => scroll('right')}
          className={`absolute right-0 top-0 bottom-4 z-20 w-12 flex items-center justify-center transition-all duration-300 ${
            canRight ? 'opacity-0 group-hover/row:opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ background: 'linear-gradient(to left, rgba(11,11,15,0.95), transparent)' }}>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
