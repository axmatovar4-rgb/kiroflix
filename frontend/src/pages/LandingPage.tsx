import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PLANS = [
  {
    id: '1oy',
    name: '1 Oylik',
    price: '29 900',
    period: 'so\'m/oy',
    color: 'from-slate-600 to-slate-700',
    border: 'border-white/10',
    badge: null,
    features: [
      { text: 'HD sifat (720p)', ok: true },
      { text: '1 ta qurilma', ok: true },
      { text: '10 ta film', ok: true },
      { text: 'Reklama mavjud', ok: false },
      { text: 'Yuklab olish', ok: false },
      { text: '4K sifat', ok: false },
      { text: 'Cheksiz filmlar', ok: false },
      { text: 'Oilaviy rejim', ok: false },
    ],
  },
  {
    id: '3oy',
    name: '3 Oylik',
    price: '69 900',
    period: 'so\'m/3 oy',
    color: 'from-blue-700 to-blue-800',
    border: 'border-blue-500/40',
    badge: null,
    features: [
      { text: 'Full HD (1080p)', ok: true },
      { text: '2 ta qurilma', ok: true },
      { text: '50 ta film', ok: true },
      { text: 'Reklama yo\'q', ok: true },
      { text: 'Yuklab olish (5 ta)', ok: true },
      { text: '4K sifat', ok: false },
      { text: 'Cheksiz filmlar', ok: false },
      { text: 'Oilaviy rejim', ok: false },
    ],
  },
  {
    id: '6oy',
    name: '6 Oylik',
    price: '119 900',
    period: 'so\'m/6 oy',
    color: 'from-purple-700 to-purple-800',
    border: 'border-purple-500/50',
    badge: 'Mashhur',
    features: [
      { text: 'Full HD (1080p)', ok: true },
      { text: '3 ta qurilma', ok: true },
      { text: '100 ta film', ok: true },
      { text: 'Reklama yo\'q', ok: true },
      { text: 'Yuklab olish (20 ta)', ok: true },
      { text: '4K sifat', ok: true },
      { text: 'Yangi filmlar erta', ok: true },
      { text: 'Oilaviy rejim', ok: false },
    ],
  },
  {
    id: '1yil',
    name: '1 Yillik',
    price: '199 900',
    period: 'so\'m/yil',
    color: 'from-[#E50914] to-[#b20710]',
    border: 'border-[#E50914]/60',
    badge: 'Eng Yaxshi',
    features: [
      { text: '4K Ultra HD', ok: true },
      { text: '5 ta qurilma', ok: true },
      { text: 'Cheksiz filmlar', ok: true },
      { text: 'Reklama yo\'q', ok: true },
      { text: 'Cheksiz yuklab olish', ok: true },
      { text: 'Oilaviy rejim (5 profil)', ok: true },
      { text: 'Yangi filmlar erta', ok: true },
      { text: 'Premium qo\'llab-quvvatlash', ok: true },
    ],
  },
];

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Hash ga scroll
    if (window.location.hash === '#tariflar') {
      setTimeout(() => {
        document.getElementById('tariflar')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const scrollToTariflar = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('tariflar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HERO ── */}
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/kiroflix-landing/1920/1080"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#080808]/80 to-[#080808]" />
        </div>

        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 md:px-16 py-5">
          <h1
            className="text-[#E50914] font-black text-2xl md:text-3xl tracking-widest"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            KIROFLIX
          </h1>
          <div className="flex items-center gap-6">
            <a
              href="#tariflar"
              onClick={scrollToTariflar}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              Tariflar
            </a>
            {user ? (
              <button
                onClick={() => navigate('/home')}
                className="bg-[#E50914] hover:bg-[#c2070f] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Filmlar
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-[#E50914] hover:bg-[#c2070f] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Kirish
              </Link>
            )}
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#E50914]/15 border border-[#E50914]/30 text-[#E50914] text-xs font-bold px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse" />
            O'zbekistonning #1 Kino Platformasi
          </div>

          <h2
            className="text-5xl md:text-7xl font-black leading-none mb-6"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Kino olamiga<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #E50914 60%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              xush kelibsiz
            </span>
          </h2>

          <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Minglab filmlar, seriallar — barchasi bir joyda. Istalgan vaqt, istalgan qurilmada tomosha qiling.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/home')}
                className="bg-[#E50914] hover:bg-[#c2070f] text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Filmlarni ko'rish
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-[#E50914] hover:bg-[#c2070f] text-white font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105"
                >
                  Bepul boshlash
                </Link>
                <Link
                  to="/login"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all"
                >
                  Kirish
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-14">
            {[
              ['28+', 'Premium Film'],
              ['4K', 'Ultra HD Sifat'],
              ['5', 'Qurilma'],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-white font-black text-3xl">{num}</p>
                <p className="text-white/40 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#tariflar"
          onClick={scrollToTariflar}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
        >
          <span className="text-xs">Tariflar</span>
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>

      {/* ── TARIFLAR ── */}
      <section id="tariflar" className="py-24 px-6 md:px-16 bg-[#080808]">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-[#E50914] text-sm font-bold uppercase tracking-widest mb-3">Tariflar</p>
            <h3
              className="text-4xl md:text-5xl font-black mb-4"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              O'zingizga mos tarifni tanlang
            </h3>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Har qanday ehtiyoj uchun qulay narxlar. Istalgan vaqt bekor qilish imkoniyati.
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border ${plan.border} overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-white text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header gradient */}
                <div className={`bg-gradient-to-br ${plan.color} px-6 pt-8 pb-6`}>
                  <p className="text-white/70 text-sm font-medium mb-2">{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-white font-black text-3xl">{plan.price}</span>
                  </div>
                  <p className="text-white/50 text-xs mt-1">{plan.period}</p>
                </div>

                {/* Features */}
                <div className="bg-white/5 backdrop-blur border-t border-white/10 px-6 py-6 flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {f.ok ? (
                          <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className={`text-sm ${f.ok ? 'text-white/80' : 'text-white/25 line-through'}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`mt-6 w-full py-3 rounded-xl text-sm font-bold text-center transition-all block ${
                      plan.id === '1yil'
                        ? 'bg-[#E50914] hover:bg-[#c2070f] text-white'
                        : plan.id === '6oy'
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    Boshlash
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Demo note */}
          <p className="text-center text-white/25 text-sm mt-10">
            Avval sinab ko'rmoqchimisiz?{' '}
            <Link to="/login" className="text-[#E50914] hover:underline">
              Demo bilan bepul kiring
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-white/5 py-8 text-center text-white/20 text-sm">
        © 2026 KIROFLIX • O'zbekiston
      </div>
    </div>
  );
};

export default LandingPage;
