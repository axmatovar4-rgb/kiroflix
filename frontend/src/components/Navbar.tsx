import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockMovies } from '../data/mockMovies';
import { Movie } from '../types';

const NOTIFS = [
  { id:1, text:"Dune: Part Two — yangi qo'shildi",  time:'2 soat oldin', read:false },
  { id:2, text:"Oppenheimer endi mavjud",            time:'1 kun oldin',  read:false },
  { id:3, text:"Tavsiya: The Dark Knight",           time:'2 kun oldin',  read:true  },
  { id:4, text:"Profil muvaffaqiyatli yangilandi",   time:'3 kun oldin',  read:true  },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled,  setScrolled]  = useState(false);
  const [query,     setQuery]     = useState('');
  const [results,   setResults]   = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);
  const [dropdown,  setDropdown]  = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs,    setNotifs]    = useState(NOTIFS);
  const inputRef  = useRef<HTMLInputElement>(null);
  const dropRef   = useRef<HTMLDivElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout>>();

  const unread  = notifs.filter(n => !n.read).length;
  const isAdmin = sessionStorage.getItem('cv_admin') === '1';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current  && !dropRef.current.contains(e.target as Node))  setDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Debounced instant search
  const onQueryChange = useCallback((val: string) => {
    setQuery(val);
    clearTimeout(timerRef.current);
    if (!val.trim()) { setResults([]); setSearching(false); return; }
    setSearching(true);
    timerRef.current = setTimeout(() => {
      const q = val.toLowerCase();
      const found = mockMovies.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genre.some(g => g.toLowerCase().includes(q)) ||
        m.cast.some(c => (typeof c==='string'?c:c.name).toLowerCase().includes(q)) ||
        (m.director||'').toLowerCase().includes(q)
      ).slice(0, 6);
      setResults(found);
      setSearching(false);
    }, 200);
  }, []);

  const goToSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setQuery(''); setResults([]); }
  };

  const pickMovie = (id: string) => {
    navigate(`/movie/${id}`); setQuery(''); setResults([]);
  };

  if (['/login','/register'].includes(location.pathname)) return null;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-400 ${
      scrolled ? 'bg-[#0b0b0f]/95 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/40'
               : 'bg-gradient-to-b from-black/70 to-transparent'
    }`}>
      <div className="px-4 md:px-10 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <Link to="/" className="text-[#E50914] font-black text-xl md:text-2xl tracking-widest hover:opacity-80 transition-opacity" style={{fontFamily:'Poppins,sans-serif'}}>
            KIROFLIX
          </Link>
          {user && (
            <div className="hidden lg:flex items-center gap-5">
              <Link to="/"
                className={`text-sm font-medium transition-colors ${location.pathname==='/'?'text-white':'text-white/50 hover:text-white'}`}>
                Bosh Sahifa
              </Link>
              {isAdmin && (
                <>
                  <Link to="/search"
                    className={`text-sm font-medium transition-colors ${location.pathname==='/search'?'text-white':'text-white/50 hover:text-white'}`}>
                    Filmlar
                  </Link>
                  <Link to="/search?genre=Action"
                    className="text-sm font-medium text-white/50 hover:text-white transition-colors">
                    Aksiya
                  </Link>
                  <Link to="/search?genre=Sci-Fi"
                    className="text-sm font-medium text-white/50 hover:text-white transition-colors">
                    Sci-Fi
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Search (center, full) ── */}
        {user && (
          <div className="flex-1 max-w-xl relative">
            <form onSubmit={goToSearch} className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => onQueryChange(e.target.value)}
                placeholder="Film, aktyor, janr qidiring..."
                className="input-cv w-full pl-10 pr-10 py-2.5 rounded-xl text-sm"
              />
              {query && (
                <button type="button" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </form>

            {/* Instant results dropdown */}
            {(searching || results.length > 0) && query && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-dark rounded-2xl overflow-hidden shadow-2xl shadow-black/80 z-50 anim-slide-down">
                {searching ? (
                  <div className="flex items-center justify-center py-6 gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-[#E50914] rounded-full animate-spin"/>
                    <span className="text-white/40 text-sm">Qidirilmoqda...</span>
                  </div>
                ) : results.length === 0 ? (
                  <div className="py-6 text-center text-white/30 text-sm">Hech narsa topilmadi</div>
                ) : (
                  <>
                    <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
                      <span className="text-white/40 text-xs">{results.length} ta natija</span>
                      <button onClick={() => { navigate(`/search?q=${encodeURIComponent(query)}`); setQuery(''); setResults([]); }}
                        className="text-[#E50914] text-xs hover:underline">Barchasini ko'rish →</button>
                    </div>
                    {results.map(m => (
                      <button key={m._id} onClick={() => pickMovie(m._id)}
                        className="search-result-item w-full flex items-center gap-3 px-4 py-3 text-left border-b border-white/5 last:border-0">
                        <img src={m.thumbnail} alt={m.title}
                          className="w-10 h-14 object-cover rounded-lg flex-shrink-0 bg-[#1a1a1a]"
                          onError={e => { (e.target as HTMLImageElement).src=`https://picsum.photos/seed/${m._id}/80/120`; }}/>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{m.title}</p>
                          <p className="text-white/40 text-xs mt-0.5">{m.releaseYear} • {m.genre.slice(0,2).join(', ')}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span className="text-yellow-400 text-xs font-bold">{m.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Right icons ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => { setNotifOpen(v=>!v); setDropdown(false); }}
                  className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all relative">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                  {unread>0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E50914] rounded-full text-[9px] font-bold text-white flex items-center justify-center pulse-red">
                      {unread}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 glass-dark rounded-2xl overflow-hidden shadow-2xl shadow-black z-50 anim-slide-down">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <h3 className="text-white font-semibold text-sm">Bildirishnomalar</h3>
                      {unread>0 && <button onClick={() => setNotifs(p=>p.map(n=>({...n,read:true})))} className="text-[#E50914] text-xs hover:underline">Barchasini o'qildi</button>}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifs.map(n => (
                        <div key={n.id} onClick={() => setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!n.read?'bg-white/[0.03]':''}`}>
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read?'bg-white/20':'bg-[#E50914]'}`}/>
                          <div>
                            <p className={`text-sm leading-snug ${n.read?'text-white/50':'text-white'}`}>{n.text}</p>
                            <p className="text-white/30 text-xs mt-1">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="relative" ref={dropRef}>
                <button onClick={() => { setDropdown(v=>!v); setNotifOpen(false); }}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2 py-1.5 transition-all">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E50914] to-[#ff6b6b] flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white/80 text-sm font-medium hidden md:block max-w-[5rem] truncate">{user.name}</span>
                  <svg className={`w-3 h-3 text-white/40 transition-transform ${dropdown?'rotate-180':''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>

                {dropdown && (
                  <div className="absolute right-0 top-12 w-60 bg-[#111] border border-white/10 rounded-2xl py-2 shadow-2xl shadow-black z-50 anim-slide-down">
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E50914] to-[#ff6b6b] flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                          <p className="text-white/40 text-xs truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    {([
                      ['/profile','Profil','M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'],
                      ['/profile','Sevimlilar','M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'],
                      ['/profile?tab=tariflarim','Tariflarim','M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'],
                    ] as [string,string,string][]).map(([to,label,path])=>(
                      <Link key={label} to={to} onClick={()=>setDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path}/>
                        </svg>
                        {label}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link to="/search" onClick={()=>setDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"/>
                        </svg>
                        Filmlar
                      </Link>
                    )}
                    <div className="border-t border-white/10 mt-1 pt-1">
                      {isAdmin && (
                        <Link to="/admin" onClick={()=>setDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 text-sm transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      <button onClick={()=>{logout();navigate('/login');setDropdown(false);}}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/5 text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Chiqish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors px-3 py-2">Kirish</Link>
              <Link to="/register" className="btn-red px-5 py-2 rounded-xl text-sm">Boshlash</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

