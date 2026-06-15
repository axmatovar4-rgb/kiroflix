import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import { mockMovies } from '../data/mockMovies';

const ADMIN_KEY  = 'cv_admin_movies';
const ADMIN_USER = 'Robiya';
const ADMIN_PASS = 'Robiya';

// LocalStorage + mockMovies birlashtirish
const loadMovies = (): Movie[] => {
  try {
    const saved: Movie[] = JSON.parse(localStorage.getItem(ADMIN_KEY) || '[]');
    const savedIds = new Set(saved.map(m => m._id));
    // mockMovies dan adminlar o'chirmaganlarini ham qo'sh
    const defaultMovies = mockMovies.filter(m => !savedIds.has(m._id));
    const all = [...saved, ...defaultMovies];
    // Dastlab saqlash — keyingi safar o'zgartirilganlar ko'rinsin
    if (!localStorage.getItem(ADMIN_KEY)) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(all));
    }
    return all;
  } catch {
    return [...mockMovies];
  }
};

const saveMovies = (movies: Movie[]) => {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(movies));
};

const EMPTY_MOVIE: Omit<Movie, '_id'> = {
  title: '', description: '', genre: [], releaseYear: 2024,
  duration: 120, rating: 7.0, thumbnail: '', backdrop: '',
  videoUrl: '', cast: [], isFeatured: false, isTrending: false,
  views: 0, language: "O'zbek tilida", director: '', maturityRating: '12+',
};

const GENRES_LIST = ['Action','Drama','Sci-Fi','Crime','Adventure','Comedy','Biography','Thriller','Romance','Horror','Animation','Fantasy'];

const AdminPage = () => {
  const navigate = useNavigate();
  const [authed,    setAuthed]    = useState(false);
  const [pass,      setPass]      = useState('');
  const [login,     setLogin]     = useState('');
  const [passErr,   setPassErr]   = useState('');
  const [movies,    setMovies]    = useState<Movie[]>([]);
  const [tab,       setTab]       = useState<'list'|'add'|'edit'>('list');
  const [editing,   setEditing]   = useState<Movie | null>(null);
  const [form,      setForm]      = useState<Omit<Movie,'_id'>>(EMPTY_MOVIE);
  const [genreInput,setGenreInput]= useState('');
  const [castInput, setCastInput] = useState('');
  const [saved,     setSaved]     = useState(false);
  const [deleteId,  setDeleteId]  = useState<string|null>(null);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('cv_admin') === '1';
    if (isAuth) {
      setAuthed(true);
      const all = loadMovies();
      setMovies(all);
      saveMovies(all); // localStorage ga yoz
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('cv_admin', '1');
      setAuthed(true);
      setMovies(loadMovies());
    } else {
      setPassErr("Parol noto'g'ri");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cv_admin');
    setAuthed(false);
    navigate('/');
  };

  const openAdd = () => {
    setForm(EMPTY_MOVIE);
    setGenreInput('');
    setCastInput('');
    setEditing(null);
    setTab('add');
  };

  const openEdit = (m: Movie) => {
    setEditing(m);
    setForm({ ...m });
    setGenreInput(m.genre.join(', '));
    setCastInput(m.cast.map(c => typeof c === 'string' ? c : c.name).join(', '));
    setTab('edit');
  };

  const handleSave = () => {
    const genres = genreInput.split(',').map(s => s.trim()).filter(Boolean);
    const castArr = castInput.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name, character: '' }));
    const finalMovie = { ...form, genre: genres, cast: castArr };

    let updated: Movie[];
    if (editing) {
      updated = movies.map(m => m._id === editing._id ? { ...finalMovie, _id: editing._id } : m);
    } else {
      const newMovie: Movie = { ...finalMovie, _id: 'custom_' + Date.now() };
      updated = [...movies, newMovie];
    }
    setMovies(updated);
    saveMovies(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTab('list');
  };

  const handleDelete = (id: string) => {
    const updated = movies.filter(m => m._id !== id);
    setMovies(updated);
    saveMovies(updated);
    setDeleteId(null);
  };

  const f = (key: keyof typeof form, val: any) => setForm(p => ({ ...p, [key]: val }));

  // ── Login ──────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-white font-black text-2xl" style={{fontFamily:'Poppins,sans-serif'}}>Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">KIROFLIX boshqaruv paneli</p>
        </div>
        <form onSubmit={handleLogin} className="glass rounded-2xl p-8 space-y-4">
          {passErr && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {passErr}
            </div>
          )}
          {/* Login input */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <input type="text" value={login} onChange={e => { setLogin(e.target.value); setPassErr(''); }}
              placeholder="Login"
              className="input-cv w-full pl-10 pr-4 py-3.5 rounded-xl text-sm" />
          </div>
          {/* Password input */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <input type="password" value={pass} onChange={e => { setPass(e.target.value); setPassErr(''); }}
              placeholder="Parol"
              className="input-cv w-full pl-10 pr-4 py-3.5 rounded-xl text-sm" />
          </div>
          <button type="submit" className="btn-red w-full py-3.5 rounded-xl text-sm font-bold">
            Kirish
          </button>
          <button type="button" onClick={() => navigate('/')}
            className="w-full text-white/30 hover:text-white text-sm transition-colors py-2">
            ← Saytga qaytish
          </button>
        </form>
      </div>
    </div>
  );

  // ── Main Admin ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      {/* Header */}
      <div className="bg-black/60 backdrop-blur border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-[#E50914] font-black text-xl tracking-widest" style={{fontFamily:'Poppins,sans-serif'}}>
            KIROFLIX
          </span>
          <span className="glass text-white/50 text-xs px-2.5 py-1 rounded-full">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')}
            className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            Saytga o'tish
          </button>
          <button onClick={handleLogout}
            className="glass text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-xl transition-colors">
            Chiqish
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Jami filmlar', value: movies.length, bg: 'from-blue-500/20 to-blue-600/10', path: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4', color: 'text-blue-400' },
            { label: 'Featured', value: movies.filter(m=>m.isFeatured).length, bg: 'from-yellow-500/20 to-yellow-600/10', path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-yellow-400' },
            { label: 'Trending', value: movies.filter(m=>m.isTrending).length, bg: 'from-orange-500/20 to-orange-600/10', path: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'text-orange-400' },
            { label: 'Videoli', value: movies.filter(m=>m.videoUrl).length, bg: 'from-green-500/20 to-green-600/10', path: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className={`glass rounded-2xl p-5 bg-gradient-to-br ${s.bg}`}>
              <svg className={`w-6 h-6 ${s.color} mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.path}/>
              </svg>
              <div className="text-white font-black text-3xl">{s.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setTab('list')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab==='list'?'bg-[#E50914] text-white':'glass text-white/50 hover:text-white'}`}>
            Filmlar ro'yxati
          </button>
          <button onClick={openAdd}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab==='add'?'bg-[#E50914] text-white':'glass text-white/50 hover:text-white'}`}>
            + Yangi film qo'shish
          </button>
          {saved && (
            <span className="text-green-400 text-sm flex items-center gap-1.5 ml-auto">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Saqlandi!
            </span>
          )}
        </div>

        {/* ── Film list ── */}
        {tab === 'list' && (
          <div className="space-y-3">
            {movies.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center">
                <div className="text-5xl mb-4">🎬</div>
                <p className="text-white/40 text-lg mb-2">Hali film qo'shilmagan</p>
                <p className="text-white/20 text-sm mb-6">Yangi film qo'shish uchun yuqoridagi tugmani bosing</p>
                <button onClick={openAdd} className="btn-red px-6 py-2.5 rounded-xl text-sm">
                  + Birinchi filmni qo'shish
                </button>
              </div>
            ) : movies.map(m => (
              <div key={m._id} className="glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                <img src={m.thumbnail} alt={m.title}
                  className="w-14 h-20 object-cover rounded-xl flex-shrink-0 bg-[#1a1a1a]"
                  onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${m._id}/80/120`; }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-bold text-sm truncate">{m.title}</h3>
                    {m.isFeatured && <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">FEATURED</span>}
                    {m.isTrending && <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">TREND</span>}
                    {m.videoUrl ? (
                      <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">▶ VIDEO</span>
                    ) : (
                      <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">VIDEO YO'Q</span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs mt-0.5">{m.releaseYear} • {m.genre.join(', ')} • ⭐{m.rating}</p>
                  {m.videoUrl && (
                    <p className="text-white/25 text-[10px] mt-0.5 truncate">🔗 {m.videoUrl}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(m)}
                    className="glass px-3 py-2 rounded-lg text-white/60 hover:text-white text-xs transition-colors flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Tahrirlash
                  </button>
                  <button onClick={() => setDeleteId(m._id)}
                    className="glass px-3 py-2 rounded-lg text-red-400/70 hover:text-red-400 text-xs transition-colors flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Add / Edit form ── */}
        {(tab === 'add' || tab === 'edit') && (
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-white font-bold text-xl mb-6">
              {tab === 'edit' ? `✏️ Tahrirlash: ${editing?.title}` : '+ Yangi film qo\'shish'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Film nomi *</label>
                <input value={form.title} onChange={e => f('title', e.target.value)}
                  placeholder="Masalan: Qasoskorlar: Yakuniy o'yin"
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm" />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Tavsif *</label>
                <textarea value={form.description} onChange={e => f('description', e.target.value)}
                  placeholder="Film haqida qisqacha..."
                  rows={3}
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm resize-none" />
              </div>

              {/* Video URL — most important */}
              <div className="md:col-span-2">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
                  🎬 Video URL (YouTube, Google Drive, boshqa link)
                </label>
                <input value={form.videoUrl || ''} onChange={e => f('videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... yoki https://drive.google.com/file/d/.../view"
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm" />
                <p className="text-white/25 text-xs mt-1.5">
                  YouTube: to'liq URL yoki embed URL • Google Drive: ulashish linki
                </p>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Poster URL (thumbnail)</label>
                <input value={form.thumbnail} onChange={e => f('thumbnail', e.target.value)}
                  placeholder="https://image.tmdb.org/..."
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm" />
              </div>

              {/* Backdrop */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Fon rasmi URL (backdrop)</label>
                <input value={form.backdrop || ''} onChange={e => f('backdrop', e.target.value)}
                  placeholder="https://image.tmdb.org/... (keng formatda)"
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm" />
              </div>

              {/* Genre */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Janrlar (vergul bilan)</label>
                <input value={genreInput} onChange={e => setGenreInput(e.target.value)}
                  placeholder="Action, Drama, Sci-Fi"
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm" />
                <div className="flex flex-wrap gap-1 mt-2">
                  {GENRES_LIST.map(g => (
                    <button key={g} type="button"
                      onClick={() => setGenreInput(prev => prev ? `${prev}, ${g}` : g)}
                      className="text-[10px] glass text-white/40 hover:text-white px-2 py-0.5 rounded-full transition-colors">
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cast */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Aktyorlar (vergul bilan)</label>
                <input value={castInput} onChange={e => setCastInput(e.target.value)}
                  placeholder="Tom Hanks, Meryl Streep, ..."
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm" />
              </div>

              {/* Director */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Rejissyor</label>
                <input value={form.director || ''} onChange={e => f('director', e.target.value)}
                  placeholder="Christopher Nolan"
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm" />
              </div>

              {/* Language */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Til</label>
                <select value={form.language} onChange={e => f('language', e.target.value)}
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm">
                  {["O'zbek tilida", "O'zbek dublyaji", 'English', 'Russian', 'Korean', 'French'].map(l => (
                    <option key={l} value={l} style={{background:'#1a1a1a'}}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Yil</label>
                <input type="number" value={form.releaseYear} onChange={e => f('releaseYear', +e.target.value)}
                  min={1900} max={2030}
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm" />
              </div>

              {/* Duration */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Davomiylik (daqiqa)</label>
                <input type="number" value={form.duration} onChange={e => f('duration', +e.target.value)}
                  min={1}
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm" />
              </div>

              {/* Rating */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Reyting (0-10): <span className="text-yellow-400 font-bold">{form.rating}</span>
                </label>
                <input type="range" value={form.rating} onChange={e => f('rating', +e.target.value)}
                  min={0} max={10} step={0.1}
                  className="w-full accent-[#E50914]" />
              </div>

              {/* Maturity */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">Yosh chegarasi</label>
                <select value={form.maturityRating || '12+'} onChange={e => f('maturityRating', e.target.value)}
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm">
                  {['Barcha yosh','6+','12+','16+','18+'].map(r => (
                    <option key={r} value={r} style={{background:'#1a1a1a'}}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Narx (so'm) — 0 = bepul
                </label>
                <input
                  type="number"
                  value={(form as any).price ?? 0}
                  onChange={e => { f('price', +e.target.value); f('isFree', +e.target.value === 0); }}
                  min={0}
                  step={1000}
                  placeholder="15000"
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm"
                />
                <p className="text-white/25 text-xs mt-1">
                  {(form as any).price === 0 || !(form as any).price ? 'Bepul film' : `${Number((form as any).price).toLocaleString()} so'm`}
                </p>
              </div>

              {/* Download URL */}
              <div className="md:col-span-2">
                <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block mb-2">
                  Yuklab olish URL (ixtiyoriy)
                </label>
                <input
                  value={(form as any).downloadUrl || ''}
                  onChange={e => f('downloadUrl' as any, e.target.value)}
                  placeholder="https://drive.google.com/... yoki boshqa to'g'ridan-to'g'ri link"
                  className="input-cv w-full px-4 py-3 rounded-xl text-sm"
                />
                <p className="text-white/25 text-xs mt-1">
                  Google Drive, Dropbox yoki boshqa to'g'ridan-to'g'ri fayl linki
                </p>
              </div>

              {/* Checkboxes */}
              <div className="md:col-span-2 flex flex-wrap gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={!!form.isFeatured} onChange={e => f('isFeatured', e.target.checked)}
                    className="w-4 h-4 accent-[#E50914]" />
                  <span className="text-white/70 text-sm">Featured (bosh sahifada katta banner)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={!!form.isTrending} onChange={e => f('isTrending', e.target.checked)}
                    className="w-4 h-4 accent-[#E50914]" />
                  <span className="text-white/70 text-sm">Trending</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={!!(form as any).isFree} onChange={e => { f('isFree' as any, e.target.checked); if (e.target.checked) f('price' as any, 0); }}
                    className="w-4 h-4 accent-green-500" />
                  <span className="text-white/70 text-sm">Bepul film</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            {form.thumbnail && (
              <div className="mt-6 p-4 glass rounded-xl">
                <p className="text-white/40 text-xs mb-3 uppercase tracking-wider">Ko'rinish</p>
                <div className="flex items-start gap-4">
                  <img src={form.thumbnail} alt="preview"
                    className="w-20 h-28 object-cover rounded-xl bg-[#1a1a1a]"
                    onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                  <div>
                    <p className="text-white font-bold">{form.title || 'Film nomi...'}</p>
                    <p className="text-white/50 text-xs mt-1">{form.releaseYear} • {genreInput || 'Janr...'}</p>
                    <p className="text-yellow-400 text-xs mt-0.5">⭐ {form.rating}</p>
                    {form.videoUrl && (
                      <p className="text-green-400 text-xs mt-1">▶ Video qo'shilgan</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-8">
              <button onClick={handleSave}
                disabled={!form.title.trim()}
                className="btn-red px-8 py-3.5 rounded-xl text-sm font-bold disabled:opacity-40 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                {tab === 'edit' ? 'Saqlash' : "Qo'shish"}
              </button>
              <button onClick={() => setTab('list')}
                className="btn-glass px-6 py-3.5 rounded-xl text-sm">
                Bekor qilish
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="glass-dark rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="text-white font-bold text-lg mb-2">O'chirishni tasdiqlang</h3>
            <p className="text-white/40 text-sm mb-6">Bu filmni o'chirsangiz qaytarib bo'lmaydi.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold transition-colors">
                Ha, o'chirish
              </button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 btn-glass py-3 rounded-xl text-sm">
                Bekor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;

