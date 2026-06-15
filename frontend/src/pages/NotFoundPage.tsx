import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(t); navigate('/'); }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#E50914]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* 404 */}
        <div className="relative mb-8">
          <h1 className="text-[180px] md:text-[220px] font-black leading-none select-none"
            style={{
              fontFamily: 'Poppins,sans-serif',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            404
          </h1>
          {/* Film strip overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-28 h-28 text-[#E50914]/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
            </svg>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 mb-6">
          <h2 className="text-white font-bold text-2xl mb-2">Sahifa topilmadi</h2>
          <p className="text-white/40 text-sm mb-1">
            Siz izlayotgan sahifa mavjud emas yoki o'chirilgan.
          </p>
          <p className="text-white/25 text-xs">
            {count} soniyadan keyin bosh sahifaga qaytasiz...
          </p>
          {/* Progress */}
          <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="progress-bar h-full rounded-full transition-all duration-1000"
              style={{ width: `${(count / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/')}
            className="btn-red px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Bosh sahifa
          </button>
          <button onClick={() => navigate(-1)}
            className="btn-glass px-8 py-3 rounded-xl text-sm flex items-center gap-2 justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Orqaga
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
