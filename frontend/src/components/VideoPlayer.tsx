import React, { useRef, useState, useEffect } from 'react';

interface Props {
  src?: string;
  poster?: string;
  title?: string;
}

  // YouTube URL dan embed URL chiqarish
const getYouTubeEmbed = (url: string): string | null => {
  if (!url) return null;
  // Already embed format
  if (url.includes('youtube.com/embed/')) return url;
  // watch?v= format
  const watchMatch = url.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // youtu.be short format
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return null;
};

const VideoPlayer = ({ src, poster, title }: Props) => {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume,   setVolume]   = useState(1);
  const [muted,    setMuted]    = useState(false);
  const [controls, setControls] = useState(true);
  const timerRef  = useRef<ReturnType<typeof setTimeout>>();

  const youtubeEmbed = src ? getYouTubeEmbed(src) : null;
  const isYoutube = !!youtubeEmbed;

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    setControls(true);
    timerRef.current = setTimeout(() => { if (playing) setControls(false); }, 3000);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // ── YouTube embed ──────────────────────────────────────────────
  if (isYoutube) {
    // Build embed URL — preserve existing params (start, end) if present
    const embedBase = youtubeEmbed!;
    const sep = embedBase.includes('?') ? '&' : '?';
    const finalUrl = embedBase.includes('autoplay')
      ? embedBase
      : `${embedBase}${sep}autoplay=1&rel=0&modestbranding=1`;
    return (
      <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={finalUrl}
          title={title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  // ── No video ───────────────────────────────────────────────────
  if (!src) {
    return (
      <div className="relative w-full bg-[#0a0a0a]" style={{ aspectRatio: '16/9' }}>
        {poster && (
          <img src={poster} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-15" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
            </svg>
          </div>
          <p className="text-white/40 text-sm">Video mavjud emas</p>
          <p className="text-white/20 text-xs">Trailer uchun YouTube linki qo'shing</p>
        </div>
      </div>
    );
  }

  // ── Native HTML5 video ─────────────────────────────────────────
  const fmt = (s: number) => {
    if (isNaN(s)) return '0:00';
    return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
  };
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    playing ? v.pause() : v.play();
    setPlaying(!playing);
    resetTimer();
  };

  return (
    <div
      className="relative w-full bg-black group"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={resetTimer}
      onMouseLeave={() => playing && setControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onTimeUpdate={() => setCurrent(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onClick={toggle}
      />

      {/* Controls */}
      <div className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${controls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Center play */}
        <button onClick={toggle}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur transition-all">
          {playing
            ? <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            : <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
          }
        </button>

        {/* Bottom bar */}
        <div className="relative z-10 px-4 pb-3">
          {title && <p className="text-white text-xs font-semibold mb-2 opacity-80">{title}</p>}
          <input type="range" min={0} max={duration||100} value={current}
            onChange={e => { const v=videoRef.current; if(v){v.currentTime=+e.target.value; setCurrent(+e.target.value);} }}
            className="w-full h-1 mb-3 cursor-pointer accent-[#E50914]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={toggle} className="text-white hover:text-white/70 transition-colors">
                {playing
                  ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                }
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => { const v=videoRef.current; if(v){v.muted=!muted; setMuted(!muted);} }} className="text-white hover:text-white/70 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={muted || volume===0
                      ? 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2'
                      : 'M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'}/>
                  </svg>
                </button>
                <input type="range" min={0} max={1} step={0.05} value={muted?0:volume}
                  onChange={e => { const v=videoRef.current; if(v){v.volume=+e.target.value; setVolume(+e.target.value); setMuted(+e.target.value===0);} }}
                  className="w-16 h-1 cursor-pointer accent-white" />
              </div>
              <span className="text-white/60 text-xs">{fmt(current)} / {fmt(duration)}</span>
            </div>
            <button onClick={() => { const el=videoRef.current?.parentElement; el && (document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen()); }}
              className="text-white hover:text-white/70 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
