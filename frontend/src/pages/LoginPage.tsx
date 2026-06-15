import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ADMIN_USER = 'Robiya';
const ADMIN_PASS = 'Robiya';

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState('');
  const [pass,     setPass]     = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Admin tekshirish
    if (email.trim() === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('cv_admin', '1');
      navigate('/admin');
      setLoading(false);
      return;
    }

    // Avval login, xato bo'lsa —” avtomatik ro'yxatdan o'tkaz
    try {
      await login(email, pass);
      navigate('/');
    } catch {
      try {
        const name = email.includes('@') ? email.split('@')[0] : email;
        await register(name, email, pass);
        navigate('/');
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

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="https://picsum.photos/seed/kiroflix2025/1920/1080" alt=""
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[#E50914]/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-purple-900/15 rounded-full blur-3xl" />
      </div>

      {/* в”Ђв”Ђ LEFT —” Branding в”Ђв”Ђ */}
      <div className="relative z-10 hidden lg:flex lg:w-[55%] flex-col justify-between p-16">
        <div>
          <h1 className="text-[#E50914] font-black text-5xl tracking-widest"
            style={{ fontFamily: 'Poppins, sans-serif' }}>KIROFLIX</h1>
          <p className="text-white/40 text-sm tracking-wider uppercase mt-1">Premium Kino Platformasi</p>
        </div>

        <div>
          <h2 className="text-white font-black text-6xl leading-tight mb-5">
            Kino olamiga<br />
            <span style={{
              background: 'linear-gradient(135deg, #fff 0%, #E50914 60%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>kirish vaqti</span>
          </h2>
          <p className="text-white/55 text-lg leading-relaxed max-w-md mb-10">
            Minglab filmlar, seriallar —” barchasi bir joyda.
            Istalgan vaqt, istalgan qurilmada tomosha qiling.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {/* 28+ Film */}
            <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
              <div className="w-9 h-9 bg-[#E50914]/15 rounded-lg flex items-center justify-center flex-shrink-0">
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
              <div className="w-9 h-9 bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
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
              <div className="w-9 h-9 bg-yellow-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">HD & 4K</p>
                <p className="text-white/40 text-xs">Yuqori sifat</p>
              </div>
            </div>

            {/* Robiya Xurshidova —” asoschi */}
            <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
              <div className="w-9 h-9 bg-purple-500/15 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <div className="min-w-0">
                {/* Ism + verified badge */}
                <div className="flex items-center gap-1.5">
                  <p className="text-white text-xs font-bold truncate">Robiya Xurshidova</p>
                  {/* Telegram verified badge */}
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-[#2AABEE]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/>
                  </svg>
                </div>
                <p className="text-white/40 text-[10px]">Asoschi</p>
              </div>
            </div>
          </div>
          {/* Info links */}
          <div className="border-t border-white/10 pt-5">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-2">
              {['Biz haqimizda', 'Maxfiylik', 'Foydalanish shartlari', 'Yordam'].map(l => (
                <a key={l} href="#" className="text-white/25 hover:text-white/50 text-xs transition-colors">{l}</a>
              ))}
            </div>
            <p className="text-white/15 text-xs">© 2026 KIROFLIX • O'zbekiston</p>
          </div>
        </div>
      </div>

      {/* в”Ђв”Ђ RIGHT —” Login form в”Ђв”Ђ */}
      <div className="relative z-10 w-full lg:w-[45%] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-[#E50914] font-black text-4xl tracking-widest"
              style={{ fontFamily: 'Poppins, sans-serif' }}>KIROFLIX</h1>
          </div>

          <h2 className="text-white font-black text-3xl mb-1">Kirish</h2>
          <p className="text-white/40 text-sm mb-8">Hisobingizga xush kelibsiz</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20
                            text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email / Login */}
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <input
                type="text"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="Email yoki login"
                required
                className="input-cv w-full pl-10 pr-4 py-3.5 rounded-xl text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={e => { setPass(e.target.value); setError(''); }}
                placeholder="Parol"
                required
                className="input-cv w-full pl-10 pr-11 py-3.5 rounded-xl text-sm"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={showPass
                      ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'}/>
                </svg>
              </button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-red w-full py-3.5 rounded-xl text-sm font-bold disabled:opacity-50 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"/>
                  Kirilmoqda...
                </span>
              ) : 'Kirish'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10"/>
            <span className="text-white/25 text-xs">yoki</span>
            <div className="flex-1 h-px bg-white/10"/>
          </div>

          {/* Demo */}
          <button onClick={handleDemo} disabled={loading}
            className="btn-glass w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Demo bilan kirish
            <span className="text-white/30 text-xs">(10 ta kino)</span>
          </button>

          {/* Register */}
          <p className="text-center text-white/40 text-sm mt-6">
            Hisob yo'qmi?{' '}
            <button onClick={() => navigate('/register')}
              className="text-[#E50914] hover:text-[#ff4444] font-semibold transition-colors">
              Ro'yxatdan o'ting
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;

