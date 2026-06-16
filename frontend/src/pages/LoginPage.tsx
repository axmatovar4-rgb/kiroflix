import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

const ADMIN_USER = 'Robiya';
const ADMIN_PASS = 'Robiya';

const PLANS = [
  {
    id: '1oy',
    name: '1 Oylik',
    price: 100000,
    priceLabel: '100 000',
    period: "so'm/oy",
    color: 'from-slate-600 to-slate-700',
    border: 'border-white/10',
    btnClass: 'bg-white/10 hover:bg-white/20 border border-white/10',
    badge: null,
    features: [
      [true,  'HD sifat (720p)'],
      [true,  '1 ta qurilma'],
      [true,  '10 ta film'],
      [false, "Reklama yo'q"],
      [false, 'Yuklab olish'],
      [false, '4K sifat'],
      [false, 'Cheksiz filmlar'],
      [false, 'Oilaviy rejim'],
    ],
  },
  {
    id: '3oy',
    name: '3 Oylik',
    price: 300000,
    priceLabel: '300 000',
    period: "so'm/3 oy",
    color: 'from-blue-700 to-blue-800',
    border: 'border-blue-500/40',
    btnClass: 'bg-blue-600 hover:bg-blue-500',
    badge: null,
    features: [
      [true,  'Full HD (1080p)'],
      [true,  '2 ta qurilma'],
      [true,  '50 ta film'],
      [true,  "Reklama yo'q"],
      [true,  'Yuklab olish (5 ta)'],
      [false, '4K sifat'],
      [false, 'Cheksiz filmlar'],
      [false, 'Oilaviy rejim'],
    ],
  },
  {
    id: '6oy',
    name: '6 Oylik',
    price: 600000,
    priceLabel: '600 000',
    period: "so'm/6 oy",
    color: 'from-purple-700 to-purple-800',
    border: 'border-purple-500/50',
    btnClass: 'bg-purple-600 hover:bg-purple-500',
    badge: 'Mashhur',
    badgeClass: 'bg-white text-black',
    features: [
      [true,  'Full HD + 4K sifat'],
      [true,  '3 ta qurilma'],
      [true,  '100 ta film'],
      [true,  "Reklama yo'q"],
      [true,  'Yuklab olish (20 ta)'],
      [true,  'Yangi filmlar erta'],
      [true,  'Maxsus kontentlar'],
      [false, 'Oilaviy rejim'],
    ],
  },
  {
    id: '1yil',
    name: '1 Yillik',
    price: 1500000,
    priceLabel: '1 500 000',
    period: "so'm/yil",
    color: 'from-[#E50914] to-[#b20710]',
    border: 'border-[#E50914]/60',
    btnClass: 'bg-[#E50914] hover:bg-[#c2070f]',
    badge: 'Eng Yaxshi',
    badgeClass: 'bg-[#E50914] text-white',
    features: [
      [true, '4K Ultra HD'],
      [true, '5 ta qurilma'],
      [true, 'Cheksiz filmlar'],
      [true, "Reklama yo'q"],
      [true, 'Cheksiz yuklab olish'],
      [true, 'Oilaviy rejim (5 profil)'],
      [true, 'Yangi filmlar erta'],
      [true, "Premium qo'llab-quvvatlash"],
    ],
  },
];

type PayStep = 'method' | 'card' | 'processing' | 'success';

const LoginPage = () => {
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();
  const tariflarRef = useRef<HTMLElement>(null);

  // Allaqachon kirgan bo'lsa — bosh sahifaga
  useEffect(() => {
    if (!loading && user) {
      const hasPlan = localStorage.getItem('cv_plan_active') === '1';
      const isDemo  = localStorage.getItem('cv_is_demo') === '1';
      if (hasPlan || isDemo) {
        navigate('/');
      }
    }
  }, [user, loading]);

  const [email,    setEmail]    = useState('');
  const [pass,     setPass]     = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Tarif & to'lov
  const [loggedIn,     setLoggedIn]     = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [payStep,      setPayStep]      = useState<PayStep>('method');
  const [payMethod,    setPayMethod]    = useState('');
  const [cardNum,      setCardNum]      = useState('');
  const [expiry,       setExpiry]       = useState('');
  const [cvv,          setCvv]          = useState('');
  const [cardName,     setCardName]     = useState('');
  const [cardErrors,   setCardErrors]   = useState<Record<string,string>>({});

  const scrollToTariflar = () => {
    tariflarRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email.trim() === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('cv_admin', '1');
      navigate('/admin');
      setLoading(false);
      return;
    }

    try {
      await login(email, pass);
      setLoggedIn(true);
      setTimeout(scrollToTariflar, 300);
    } catch {
      try {
        const name = email.includes('@') ? email.split('@')[0] : email;
        await register(name, email, pass);
        setLoggedIn(true);
        setTimeout(scrollToTariflar, 300);
      } catch (regErr: any) {
        setError(regErr?.response?.data?.message || "Kirishda xato. Qayta urinib ko'ring.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setLoading(true);
    try {
      await login('demo@kiroflix.uz', 'demo123');
      localStorage.setItem('cv_is_demo', '1');
      navigate('/');
    } catch {
      setError("Demo kirishda xato.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
    setPayStep('method');
    setCardNum(''); setExpiry(''); setCvv(''); setCardName(''); setCardErrors({});
  };

  const formatCard   = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d; };

  const validateCard = () => {
    const e: Record<string,string> = {};
    if (!cardName.trim())                    e.cardName = "Ism kiriting";
    if (cardNum.replace(/\s/g,'').length<16) e.cardNum  = "16 ta raqam";
    if (expiry.length < 5)                   e.expiry   = "MM/YY";
    if (cvv.length < 3)                      e.cvv      = "3 ta raqam";
    setCardErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (payMethod !== 'card') {
      setPayStep('processing');
      setTimeout(() => setPayStep('success'), 2500);
      return;
    }
    if (!validateCard()) return;
    setPayStep('processing');
    setTimeout(() => setPayStep('success'), 2500);
  };

  return (
    <div className="bg-[#080808]">

      {/* ── LOGIN QISMI ── */}
      <div className="min-h-screen flex relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://picsum.photos/seed/kiroflix2025/1920/1080" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[#E50914]/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-purple-900/15 rounded-full blur-3xl" />
        </div>

        {/* LEFT */}
        <div className="relative z-10 hidden lg:flex lg:w-[55%] flex-col justify-between p-16">
          <div>
            <h1 className="text-[#E50914] font-black text-5xl tracking-widest" style={{fontFamily:'Poppins,sans-serif'}}>KIROFLIX</h1>
            <p className="text-white/40 text-sm tracking-wider uppercase mt-1">Premium Kino Platformasi</p>
          </div>
          <div>
            <h2 className="text-white font-black text-6xl leading-tight mb-5">
              Kino olamiga<br />
              <span style={{background:'linear-gradient(135deg,#fff 0%,#E50914 60%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                kirish vaqti
              </span>
            </h2>
            <p className="text-white/55 text-lg leading-relaxed max-w-md mb-10">
              Minglab filmlar, seriallar — barchasi bir joyda. Istalgan vaqt, istalgan qurilmada tomosha qiling.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-10">
              {/* 28+ Film */}
              <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'#E5091422'}}>
                  <svg className="w-5 h-5 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">28+ Film</p>
                  <p className="text-white/40 text-xs">Premium kontent</p>
                </div>
              </div>
              {/* O'zbek tilida */}
              <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'#60a5fa22'}}>
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">O'zbek tilida</p>
                  <p className="text-white/40 text-xs">Dublyaj & tarjima</p>
                </div>
              </div>
              {/* HD & 4K */}
              <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'#facc1522'}}>
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">HD & 4K</p>
                  <p className="text-white/40 text-xs">Yuqori sifat</p>
                </div>
              </div>
              {/* Robiya Xurshidova */}
              <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'#a78bfa22'}}>
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-white text-xs font-bold truncate">Robiya Xurshidova</p>
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#2AABEE]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/>
                    </svg>
                  </div>
                  <p className="text-white/40 text-xs">Asoschi</p>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-5">
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-2">
                {['Biz haqimizda','Maxfiylik','Foydalanish shartlari','Yordam'].map(l => (
                  <a key={l} href="#" className="text-white/25 hover:text-white/50 text-xs transition-colors">{l}</a>
                ))}
              </div>
              <p className="text-white/15 text-xs">© 2026 KIROFLIX • O'zbekiston</p>
            </div>
          </div>
        </div>

        {/* RIGHT — login form */}
        <div className="relative z-10 w-full lg:w-[45%] flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-[#E50914] font-black text-4xl tracking-widest" style={{fontFamily:'Poppins,sans-serif'}}>KIROFLIX</h1>
            </div>

            {loggedIn ? (
              /* Kirdi — tariflarga yo'naltirish xabari */
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h2 className="text-white font-black text-2xl mb-2">Muvaffaqiyatli kirdingiz!</h2>
                <p className="text-white/50 text-sm mb-6">Endi o'zingizga mos tarifni tanlang</p>
                <button onClick={scrollToTariflar} className="btn-red px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                  Tariflarni ko'rish
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-white font-black text-3xl mb-1">Kirish</h2>
                <p className="text-white/40 text-sm mb-8">Hisobingizga xush kelibsiz</p>

                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <input type="text" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} placeholder="Email yoki login" required className="input-cv w-full pl-10 pr-4 py-3.5 rounded-xl text-sm"/>
                  </div>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <input type={showPass?'text':'password'} value={pass} onChange={e=>{setPass(e.target.value);setError('');}} placeholder="Parol" required className="input-cv w-full pl-10 pr-11 py-3.5 rounded-xl text-sm"/>
                    <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPass?'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21':'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'}/>
                      </svg>
                    </button>
                  </div>
                  <button type="submit" disabled={loading} className="btn-red w-full py-3.5 rounded-xl text-sm font-bold disabled:opacity-50 mt-2">
                    {loading ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"/>Kirilmoqda...</span> : 'Kirish'}
                  </button>
                </form>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/10"/>
                  <span className="text-white/25 text-xs">yoki</span>
                  <div className="flex-1 h-px bg-white/10"/>
                </div>

                <button onClick={handleDemo} disabled={loading} className="btn-glass w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Demo bilan kirish
                  <span className="text-white/30 text-xs">(10 ta kino)</span>
                </button>

                <p className="text-center text-white/40 text-sm mt-6">
                  Hisob yo'qmi?{' '}
                  <button onClick={()=>navigate('/register')} className="text-[#E50914] hover:text-[#ff4444] font-semibold transition-colors">
                    Ro'yxatdan o'ting
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── TARIFLAR ── */}
      <section ref={tariflarRef} id="tariflar" className="py-24 px-6 md:px-16 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#E50914] text-xs font-bold uppercase tracking-widest mb-3">Tariflar</p>
            <h2 className="text-white font-black text-3xl md:text-5xl mb-4" style={{fontFamily:'Poppins,sans-serif'}}>
              O'zingizga mos tarifni tanlang
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              {loggedIn ? 'Tarifni tanlang va to\'lovni amalga oshiring — keyin filmlarni tomosha qiling!' : 'Avval kiring, so\'ng tarifni tanlang.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map(plan => (
              <div key={plan.id} className={`relative rounded-2xl border ${plan.border} overflow-hidden flex flex-col hover:-translate-y-1 transition-transform hover:shadow-2xl hover:shadow-black/60 ${selectedPlan?.id === plan.id ? 'ring-2 ring-white/40' : ''}`}>
                {plan.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`${plan.badgeClass} text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide`}>{plan.badge}</span>
                  </div>
                )}
                <div className={`bg-gradient-to-br ${plan.color} px-6 pt-8 pb-6`}>
                  <p className="text-white/70 text-sm font-medium mb-2">{plan.name}</p>
                  <span className="text-white font-black text-3xl">{plan.priceLabel}</span>
                  <p className="text-white/50 text-xs mt-1">{plan.period}</p>
                </div>
                <div className="bg-white/5 border-t border-white/10 px-6 py-6 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map(([ok, text], i) => (
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
                  <button
                    onClick={() => loggedIn ? handleSelectPlan(plan) : scrollToTariflar()}
                    className={`mt-6 w-full py-3 rounded-xl text-sm font-bold text-white transition-all ${plan.btnClass}`}
                  >
                    {loggedIn ? "Tanlash" : "Kirish kerak"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TO'LOV MODALI ── */}
      {selectedPlan && loggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E50914]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-sm">To'lov</span>
              </div>
              {payStep !== 'processing' && payStep !== 'success' && (
                <button onClick={() => setSelectedPlan(null)} className="text-white/40 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Summary */}
            {payStep !== 'success' && (
              <div className="px-6 py-3 bg-white/3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-xs">Tarif:</p>
                  <p className="text-white font-semibold text-sm">{selectedPlan.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-xs">Narx:</p>
                  <p className="text-[#E50914] font-black text-lg">{selectedPlan.priceLabel} so'm</p>
                </div>
              </div>
            )}

            <div className="px-6 py-5">
              {/* Method */}
              {payStep === 'method' && (
                <div className="space-y-2">
                  <p className="text-white/60 text-sm mb-4">To'lov usulini tanlang:</p>
                  {[
                    {id:'card', label:"Kredit/Debit karta", desc:"Visa, Mastercard, Humo, UzCard"},
                    {id:'payme', label:"Payme", desc:"O'zbekistoning mashhur to'lov tizimi"},
                    {id:'click', label:"Click", desc:"Tez va qulay to'lov"},
                  ].map(m => (
                    <button key={m.id} onClick={() => {setPayMethod(m.id); setPayStep('card');}}
                      className="w-full flex items-center gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all text-left border border-white/8 hover:border-[#E50914]/40">
                      <div className="w-10 h-10 bg-[#E50914]/15 rounded-lg flex items-center justify-center text-[#E50914] flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{m.label}</p>
                        <p className="text-white/40 text-xs">{m.desc}</p>
                      </div>
                      <svg className="w-4 h-4 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ))}
                </div>
              )}

              {/* Card / Payme / Click */}
              {payStep === 'card' && (
                <div>
                  <button onClick={() => setPayStep('method')} className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs mb-4 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                    Orqaga
                  </button>
                  {payMethod === 'card' ? (
                    <div className="space-y-3">
                      <input value={cardNum} onChange={e=>setCardNum(formatCard(e.target.value))} placeholder="0000 0000 0000 0000"
                        className={`input-cv w-full px-4 py-3 rounded-xl text-sm font-mono ${cardErrors.cardNum?'border-red-500/50':''}`}/>
                      {cardErrors.cardNum && <p className="text-red-400 text-xs">{cardErrors.cardNum}</p>}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input value={expiry} onChange={e=>setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY"
                            className={`input-cv w-full px-4 py-3 rounded-xl text-sm ${cardErrors.expiry?'border-red-500/50':''}`}/>
                          {cardErrors.expiry && <p className="text-red-400 text-xs mt-1">{cardErrors.expiry}</p>}
                        </div>
                        <div>
                          <input value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,'').slice(0,3))} placeholder="CVV" type="password"
                            className={`input-cv w-full px-4 py-3 rounded-xl text-sm ${cardErrors.cvv?'border-red-500/50':''}`}/>
                          {cardErrors.cvv && <p className="text-red-400 text-xs mt-1">{cardErrors.cvv}</p>}
                        </div>
                      </div>
                      <input value={cardName} onChange={e=>setCardName(e.target.value.toUpperCase())} placeholder="KARTA EGASINING ISMI"
                        className={`input-cv w-full px-4 py-3 rounded-xl text-sm tracking-wider ${cardErrors.cardName?'border-red-500/50':''}`}/>
                      {cardErrors.cardName && <p className="text-red-400 text-xs">{cardErrors.cardName}</p>}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-[#E50914]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <p className="text-white font-semibold mb-1">{payMethod === 'payme' ? 'Payme' : 'Click'} orqali to'lash</p>
                      <p className="text-white/40 text-sm">Tugmani bosing va davom eting</p>
                    </div>
                  )}
                  <button onClick={handlePay} className="btn-red w-full py-3.5 rounded-xl text-sm font-bold mt-5 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    {selectedPlan.priceLabel} so'm to'lash
                  </button>
                </div>
              )}

              {/* Processing */}
              {payStep === 'processing' && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 border-4 border-white/10 border-t-[#E50914] rounded-full animate-spin mx-auto mb-5"/>
                  <p className="text-white font-semibold mb-1">To'lov amalga oshirilmoqda...</p>
                  <p className="text-white/40 text-sm">Iltimos kutib turing</p>
                </div>
              )}

              {/* Success */}
              {payStep === 'success' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h3 className="text-white font-black text-xl mb-2">To'lov muvaffaqiyatli!</h3>
                  <p className="text-white/50 text-sm mb-1">{selectedPlan.name} tarifi faollashtirildi</p>
                  <p className="text-green-400 text-sm font-semibold mb-6">{selectedPlan.priceLabel} so'm to'landi</p>
                  <button onClick={() => {
                    localStorage.setItem('cv_plan_active', '1');
                    localStorage.setItem('cv_plan_name', selectedPlan.name);
                    navigate('/');
                  }} className="btn-red w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    </svg>
                    Filmlarni ko'rish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
};

export default LoginPage;
