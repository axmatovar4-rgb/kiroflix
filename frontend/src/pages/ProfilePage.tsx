import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockMovies } from '../data/mockMovies';
import MovieCard from '../components/MovieCard';
import BackButton from '../components/BackButton';

// ── Tariflarim bo'limi ──────────────────────────────────────────
const PLANS_DATA = [
  {
    id: '1oy', name: '1 Oylik', price: 100000, priceLabel: '100 000', period: "so'm/oy",
    color: 'from-slate-600 to-slate-700', border: 'border-white/10', btnClass: 'bg-white/10 hover:bg-white/20 border border-white/10',
    features: ['HD sifat (720p)', '1 ta qurilma', '10 ta film', "Reklama bor", 'Yuklab olish yo\'q', '4K yo\'q', 'Cheksiz filmlar yo\'q', 'Oilaviy rejim yo\'q'],
    ok:       [true, true, true, false, false, false, false, false],
  },
  {
    id: '3oy', name: '3 Oylik', price: 300000, priceLabel: '300 000', period: "so'm/3 oy",
    color: 'from-blue-700 to-blue-800', border: 'border-blue-500/40', btnClass: 'bg-blue-600 hover:bg-blue-500',
    features: ['Full HD (1080p)', '2 ta qurilma', '50 ta film', "Reklama yo'q", 'Yuklab olish (5 ta)', '4K yo\'q', 'Cheksiz filmlar yo\'q', 'Oilaviy rejim yo\'q'],
    ok:       [true, true, true, true, true, false, false, false],
  },
  {
    id: '6oy', name: '6 Oylik', price: 600000, priceLabel: '600 000', period: "so'm/6 oy",
    color: 'from-purple-700 to-purple-800', border: 'border-purple-500/50', btnClass: 'bg-purple-600 hover:bg-purple-500',
    badge: 'Mashhur', badgeClass: 'bg-white text-black',
    features: ['Full HD + 4K sifat', '3 ta qurilma', '100 ta film', "Reklama yo'q", 'Yuklab olish (20 ta)', 'Yangi filmlar erta', 'Maxsus kontentlar', 'Oilaviy rejim yo\'q'],
    ok:       [true, true, true, true, true, true, true, false],
  },
  {
    id: '1yil', name: '1 Yillik', price: 1500000, priceLabel: '1 500 000', period: "so'm/yil",
    color: 'from-[#E50914] to-[#b20710]', border: 'border-[#E50914]/60', btnClass: 'bg-[#E50914] hover:bg-[#c2070f]',
    badge: 'Eng Yaxshi', badgeClass: 'bg-[#E50914] text-white',
    features: ['4K Ultra HD', '5 ta qurilma', 'Cheksiz filmlar', "Reklama yo'q", 'Cheksiz yuklab olish', 'Oilaviy rejim (5 profil)', 'Yangi filmlar erta', "Premium qo'llab-quvvatlash"],
    ok:       [true, true, true, true, true, true, true, true],
  },
];

type PayStep = 'method' | 'card' | 'processing' | 'success';

const TariflarimSection = ({ navigate }: { navigate: (path: string) => void }) => {
  const [activePlan, setActivePlan] = useState(localStorage.getItem('cv_plan_name') || '');
  const isDemo = localStorage.getItem('cv_is_demo') === '1';
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS_DATA[0] | null>(null);
  const [payStep, setPayStep] = useState<PayStep>('method');
  const [payMethod, setPayMethod] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const formatCard = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length>2 ? d.slice(0,2)+'/'+d.slice(2) : d; };

  const validateCard = () => {
    const e: Record<string,string> = {};
    if (!cardName.trim()) e.cardName = 'Ism kiriting';
    if (cardNum.replace(/\s/g,'').length < 16) e.cardNum = '16 ta raqam';
    if (expiry.length < 5) e.expiry = 'MM/YY';
    if (cvv.length < 3) e.cvv = '3 ta raqam';
    setCardErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (payMethod !== 'card') { setPayStep('processing'); setTimeout(() => setPayStep('success'), 2500); return; }
    if (!validateCard()) return;
    setPayStep('processing');
    setTimeout(() => setPayStep('success'), 2500);
  };

  const handleSuccess = () => {
    if (!selectedPlan) return;
    localStorage.setItem('cv_plan_active', '1');
    localStorage.setItem('cv_plan_name', selectedPlan.name);
    setActivePlan(selectedPlan.name);
    setSelectedPlan(null);
  };

  const openPlan = (plan: typeof PLANS_DATA[0]) => {
    setSelectedPlan(plan);
    setPayStep('method');
    setCardNum(''); setExpiry(''); setCvv(''); setCardName(''); setCardErrors({});
  };

  return (
    <>
      <div className="space-y-6">
        {/* Joriy tarif */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Joriy tarif</h3>
          {isDemo ? (
            <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <p className="text-yellow-400 font-bold">Demo rejim</p>
                <p className="text-white/40 text-sm">10 ta film bepul</p>
              </div>
            </div>
          ) : activePlan ? (
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-green-400 font-bold">{activePlan} — Faol</p>
                  <p className="text-white/40 text-sm">Tarifingiz faol holda</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <p className="text-red-400 font-bold flex-1">Tarif tanlanmagan</p>
            </div>
          )}
        </div>

        {/* Tariflarni o'zgartirish */}
        <div>
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">
            {activePlan ? "Tarifni o'zgartirish" : "Tarif tanlang"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS_DATA.map(plan => (
              <div key={plan.id} className={`relative rounded-2xl border ${plan.border} overflow-hidden flex flex-col hover:-translate-y-1 transition-transform ${activePlan === plan.name ? 'ring-2 ring-green-400/50' : ''}`}>
                {(plan as any).badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`${(plan as any).badgeClass} text-[9px] font-black px-2 py-0.5 rounded-full uppercase`}>{(plan as any).badge}</span>
                  </div>
                )}
                {activePlan === plan.name && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-green-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full">Faol</span>
                  </div>
                )}
                <div className={`bg-gradient-to-br ${plan.color} px-5 pt-6 pb-4`}>
                  <p className="text-white/70 text-xs font-medium mb-1">{plan.name}</p>
                  <p className="text-white font-black text-2xl">{plan.priceLabel}</p>
                  <p className="text-white/50 text-xs mt-0.5">{plan.period}</p>
                </div>
                <div className="bg-white/5 px-5 py-4 flex-1 flex flex-col">
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs">
                        {plan.ok[i] ? (
                          <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-white/20 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                        )}
                        <span className={plan.ok[i] ? 'text-white/70' : 'text-white/25 line-through'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openPlan(plan)}
                    className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all ${plan.btnClass} ${activePlan === plan.name ? 'opacity-50 cursor-default' : ''}`}
                    disabled={activePlan === plan.name}
                  >
                    {activePlan === plan.name ? 'Joriy tarif' : activePlan ? "O'tish" : 'Tanlash'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* To'lov modali */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="text-white font-bold text-sm">To'lov — {selectedPlan.name}</span>
              {payStep !== 'processing' && payStep !== 'success' && (
                <button onClick={() => setSelectedPlan(null)} className="text-white/40 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            {payStep !== 'success' && (
              <div className="px-6 py-3 bg-white/3 border-b border-white/10 flex justify-between">
                <span className="text-white/50 text-sm">{selectedPlan.name}</span>
                <span className="text-[#E50914] font-black">{selectedPlan.priceLabel} so'm</span>
              </div>
            )}
            <div className="px-6 py-5">
              {payStep === 'method' && (
                <div className="space-y-2">
                  <p className="text-white/60 text-sm mb-3">To'lov usulini tanlang:</p>
                  {[{id:'card',label:'Karta (Visa/Humo/UzCard)'},{id:'payme',label:'Payme'},{id:'click',label:'Click'}].map(m => (
                    <button key={m.id} onClick={() => {setPayMethod(m.id); setPayStep('card');}}
                      className="w-full flex items-center justify-between px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E50914]/40 rounded-xl transition-all text-sm text-white">
                      {m.label}
                      <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </button>
                  ))}
                </div>
              )}
              {payStep === 'card' && (
                <div>
                  <button onClick={() => setPayStep('method')} className="text-white/40 hover:text-white text-xs mb-4 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                    Orqaga
                  </button>
                  {payMethod === 'card' ? (
                    <div className="space-y-3">
                      <input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} placeholder="0000 0000 0000 0000"
                        className={`input-cv w-full px-4 py-3 rounded-xl text-sm font-mono ${cardErrors.cardNum ? 'border-red-500/50' : ''}`}/>
                      {cardErrors.cardNum && <p className="text-red-400 text-xs">{cardErrors.cardNum}</p>}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY"
                            className={`input-cv w-full px-4 py-3 rounded-xl text-sm ${cardErrors.expiry ? 'border-red-500/50' : ''}`}/>
                          {cardErrors.expiry && <p className="text-red-400 text-xs mt-1">{cardErrors.expiry}</p>}
                        </div>
                        <div>
                          <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,3))} placeholder="CVV" type="password"
                            className={`input-cv w-full px-4 py-3 rounded-xl text-sm ${cardErrors.cvv ? 'border-red-500/50' : ''}`}/>
                          {cardErrors.cvv && <p className="text-red-400 text-xs mt-1">{cardErrors.cvv}</p>}
                        </div>
                      </div>
                      <input value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} placeholder="KARTA EGASINING ISMI"
                        className={`input-cv w-full px-4 py-3 rounded-xl text-sm ${cardErrors.cardName ? 'border-red-500/50' : ''}`}/>
                      {cardErrors.cardName && <p className="text-red-400 text-xs">{cardErrors.cardName}</p>}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-white font-semibold mb-1">{payMethod === 'payme' ? 'Payme' : 'Click'} orqali to'lash</p>
                      <p className="text-white/40 text-sm">Tugmani bosing va davom eting</p>
                    </div>
                  )}
                  <button onClick={handlePay} className="btn-red w-full py-3.5 rounded-xl text-sm font-bold mt-5">
                    {selectedPlan.priceLabel} so'm to'lash
                  </button>
                </div>
              )}
              {payStep === 'processing' && (
                <div className="text-center py-10">
                  <div className="w-14 h-14 border-4 border-white/10 border-t-[#E50914] rounded-full animate-spin mx-auto mb-4"/>
                  <p className="text-white font-semibold">To'lov amalga oshirilmoqda...</p>
                </div>
              )}
              {payStep === 'success' && (
                <div className="text-center py-8">
                  <div className="w-18 h-18 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5 w-20 h-20">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-black text-xl mb-2">Tarif muvaffaqiyatli o'zgartirildi!</h3>
                  <p className="text-green-400 text-sm font-semibold mb-6">{selectedPlan.name} — {selectedPlan.priceLabel} so'm</p>
                  <button onClick={handleSuccess} className="btn-red w-full py-3.5 rounded-xl text-sm font-bold">
                    Tasdiqlash
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
// ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'watchlist', label: 'Sevimlilar',     icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
  { id: 'history',   label: "Ko'rish tarixi", icon: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z' },
  { id: 'tariflarim',label: 'Tariflarim',     icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { id: 'paid',      label: "To'lov tarixi",  icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'search',    label: 'Qidiruv tarixi', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
];

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'watchlist');
  const [editName,  setEditName] = useState(false);
  const [nameVal,   setNameVal]  = useState(user?.name || '');
  const [rating,    setRating]   = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem('movie_ratings') || '{}'); } catch { return {}; }
  });

  if (!user) return null;

  // Data sources
  const watchlistMovies = mockMovies.filter(m => user.watchlist.includes(m._id));

  const paidIds: string[] = (() => {
    try { return JSON.parse(localStorage.getItem('paid_movies') || '[]'); } catch { return []; }
  })();
  const paidMovies = mockMovies.filter(m => paidIds.includes(m._id));

  const searchHistory: string[] = (() => {
    try { return JSON.parse(localStorage.getItem('search_history') || '[]'); } catch { return []; }
  })();

  const historyMovies = paidMovies; // To'langan = ko'rilgan deb hisoblash

  const saveName = () => {
    updateUser({ ...user, name: nameVal });
    setEditName(false);
  };

  const setMovieRating = (movieId: string, stars: number) => {
    const updated = { ...rating, [movieId]: stars };
    setRating(updated);
    localStorage.setItem('movie_ratings', JSON.stringify(updated));
  };

  const clearSearchHistory = () => {
    localStorage.removeItem('search_history');
  };

  const stats = [
    { label: "Ko'rilgan",  value: paidMovies.length,      icon: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z', color: 'text-blue-400 bg-blue-500/15' },
    { label: 'Sevimlilar', value: watchlistMovies.length,  icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: 'text-red-400 bg-red-500/15' },
    { label: "To'langan",  value: paidMovies.length,       icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', color: 'text-green-400 bg-green-500/15' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0f] pt-20 pb-8 page-enter">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <BackButton className="mb-6" />

        {/* Profile header */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/5 via-transparent to-purple-900/5 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E50914] to-[#ff6b6b] flex items-center justify-center text-white font-black text-3xl flex-shrink-0 shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editName ? (
                <div className="flex items-center gap-2 mb-2">
                  <input value={nameVal} onChange={e => setNameVal(e.target.value)}
                    className="input-cv px-3 py-2 rounded-xl text-lg font-bold w-48" />
                  <button onClick={saveName} className="btn-red px-4 py-2 rounded-lg text-xs">Saqlash</button>
                  <button onClick={() => { setEditName(false); setNameVal(user.name); }}
                    className="text-white/30 hover:text-white text-xs transition-colors">Bekor</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-white font-black text-2xl">{user.name}</h1>
                  <button onClick={() => setEditName(true)} className="text-white/25 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-white/40 text-sm mb-2">{user.email}</p>
              <span className="inline-flex items-center gap-1.5 glass px-3 py-1 rounded-full text-xs font-semibold capitalize">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                <span className="text-[#E50914]">{user.subscription}</span>
                <span className="text-white/40">plan</span>
              </span>
            </div>

            <button onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Chiqish
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6">
            {stats.map(s => (
              <div key={s.label} className={`glass rounded-xl px-5 py-3 flex items-center gap-3`}>
                <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon}/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-black text-xl leading-none">{s.value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass-dark rounded-2xl p-1 w-fit mb-6 overflow-x-auto hide-scrollbar">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                tab === t.id ? 'bg-[#E50914] text-white' : 'text-white/50 hover:text-white'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon}/>
              </svg>
              {t.label}
              {t.id === 'watchlist' && watchlistMovies.length > 0 && (
                <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-full">{watchlistMovies.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Sevimlilar ── */}
        {tab === 'watchlist' && (
          watchlistMovies.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <svg className="w-14 h-14 text-white/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <p className="text-white/30 text-lg mb-2">Sevimlilar ro'yxati bo'sh</p>
              <p className="text-white/20 text-sm mb-5">Film sahifasida + tugmasini bosib qo'shing</p>
              <button onClick={() => navigate('/')} className="btn-red px-6 py-2.5 rounded-xl text-sm">Filmlarni ko'rish</button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {watchlistMovies.map((m, i) => <MovieCard key={m._id} movie={m} index={i} />)}
            </div>
          )
        )}

        {/* ── Ko'rish tarixi ── */}
        {tab === 'history' && (
          historyMovies.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <svg className="w-14 h-14 text-white/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
              </svg>
              <p className="text-white/30 text-lg mb-2">Ko'rish tarixi bo'sh</p>
              <p className="text-white/20 text-sm">To'lov qilib ko'rgan filmlaringiz bu yerda ko'rinadi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyMovies.map((m, i) => (
                <div key={m._id} className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <img src={m.thumbnail} alt={m.title}
                    className="w-14 h-20 object-cover rounded-lg flex-shrink-0 bg-[#1a1a1a] cursor-pointer"
                    onClick={() => navigate(`/movie/${m._id}`)}
                    onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${m._id}/80/120`; }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate mb-1 cursor-pointer hover:text-[#E50914] transition-colors"
                      onClick={() => navigate(`/movie/${m._id}`)}>{m.title}</h3>
                    <p className="text-white/40 text-xs">{m.releaseYear} • {m.genre.slice(0,2).join(', ')}</p>
                    {/* Stars rating */}
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-white/30 text-xs mr-1">Baho:</span>
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => setMovieRating(m._id, star)}
                          className={`text-lg transition-transform hover:scale-110 ${
                            (rating[m._id] || 0) >= star ? 'text-yellow-400' : 'text-white/15'}`}>
                          ★
                        </button>
                      ))}
                      {rating[m._id] && (
                        <span className="text-yellow-400 text-xs ml-1 font-bold">{rating[m._id]}/5</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => navigate(`/movie/${m._id}`)}
                    className="btn-red px-4 py-2 rounded-xl text-xs flex-shrink-0">
                    Ko'rish
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── To'lov tarixi ── */}
        {tab === 'paid' && (
          paidMovies.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <svg className="w-14 h-14 text-white/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
              <p className="text-white/30 text-lg mb-2">To'lov tarixi bo'sh</p>
              <p className="text-white/20 text-sm">Sotib olingan filmlar bu yerda ko'rinadi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paidMovies.map((m, i) => (
                <div key={m._id} className="glass rounded-xl p-4 flex items-center gap-4">
                  <img src={m.thumbnail} alt={m.title}
                    className="w-14 h-20 object-cover rounded-lg flex-shrink-0 bg-[#1a1a1a]"
                    onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${m._id}/80/120`; }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate mb-1">{m.title}</h3>
                    <p className="text-white/40 text-xs mb-2">{m.releaseYear} • {m.genre.slice(0,2).join(', ')}</p>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-green-400 text-xs font-bold">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        To'langan
                      </span>
                      <span className="text-white/25 text-xs">•</span>
                      <span className="text-[#E50914] text-xs font-bold">{m.price?.toLocaleString()} so'm</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/movie/${m._id}`)}
                    className="btn-red px-4 py-2 rounded-xl text-xs flex-shrink-0">
                    Ko'rish
                  </button>
                </div>
              ))}
              {/* Jami */}
              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <span className="text-white/50 text-sm">Jami to'langan:</span>
                <span className="text-[#E50914] font-black text-lg">
                  {paidMovies.reduce((sum, m) => sum + (m.price || 0), 0).toLocaleString()} so'm
                </span>
              </div>
            </div>
          )
        )}

        {/* ── Tariflarim ── */}
        {tab === 'tariflarim' && <TariflarimSection navigate={navigate} />}

        {/* ── Qidiruv tarixi ── */}
        {tab === 'search' && (
          searchHistory.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <svg className="w-14 h-14 text-white/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p className="text-white/30 text-lg mb-2">Qidiruv tarixi bo'sh</p>
              <p className="text-white/20 text-sm">Qidirgan so'zlaringiz bu yerda ko'rinadi</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/40 text-sm">{searchHistory.length} ta qidiruv</p>
                <button onClick={() => { clearSearchHistory(); window.location.reload(); }}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Tozalash
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 30).map((q, i) => (
                  <button key={i}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)}
                    className="glass hover:bg-white/10 text-white/60 hover:text-white text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
