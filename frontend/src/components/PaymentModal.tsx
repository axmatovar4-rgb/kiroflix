import React, { useState } from 'react';

interface Props {
  movieTitle: string;
  price: number;
  onSuccess: () => void;
  onClose: () => void;
}

type Step = 'method' | 'card' | 'processing' | 'success';

const METHODS = [
  {
    id: 'card',
    label: 'Kredit/Debit karta',
    desc: 'Visa, Mastercard, Humo, UzCard',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
      </svg>
    ),
  },
  {
    id: 'payme',
    label: 'Payme',
    desc: "O'zbekistoning eng mashhur to'lov tizimi",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    id: 'click',
    label: 'Click',
    desc: "Tez va qulay to'lov",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/>
      </svg>
    ),
  },
];

const PaymentModal = ({ movieTitle, price, onSuccess, onClose }: Props) => {
  const [step, setStep]         = useState<Step>('method');
  const [method, setMethod]     = useState('');
  const [cardNum, setCardNum]   = useState('');
  const [expiry, setExpiry]     = useState('');
  const [cvv, setCvv]           = useState('');
  const [name, setName]         = useState('');
  const [errors, setErrors]     = useState<Record<string,string>>({});

  const formatCard = (v: string) =>
    v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g,'').slice(0,4);
    return d.length > 2 ? d.slice(0,2) + '/' + d.slice(2) : d;
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!name.trim())              e.name    = "Ism familiya kiriting";
    if (cardNum.replace(/\s/g,'').length < 16) e.cardNum = "Karta raqami 16 ta raqam";
    if (expiry.length < 5)         e.expiry  = "MM/YY formatida kiriting";
    if (cvv.length < 3)            e.cvv     = "CVV 3 ta raqam";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (method !== 'card') {
      // Payme / Click — simulate
      setStep('processing');
      setTimeout(() => setStep('success'), 2500);
      return;
    }
    if (!validate()) return;
    setStep('processing');
    setTimeout(() => setStep('success'), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md glass-dark rounded-2xl overflow-hidden shadow-2xl shadow-black">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E50914]/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-sm">To'lov</span>
          </div>
          {step !== 'processing' && step !== 'success' && (
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Order summary */}
        {step !== 'success' && (
          <div className="px-6 py-3 bg-white/3 border-b border-white/10 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-white/50 text-xs">Film:</p>
              <p className="text-white font-semibold text-sm truncate">{movieTitle}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-white/50 text-xs">Narx:</p>
              <p className="text-[#E50914] font-black text-lg">{price.toLocaleString()} so'm</p>
            </div>
          </div>
        )}

        <div className="px-6 py-5">

          {/* ── Step 1: Choose method ── */}
          {step === 'method' && (
            <div>
              <p className="text-white/60 text-sm mb-4">To'lov usulini tanlang:</p>
              <div className="space-y-2">
                {METHODS.map(m => (
                  <button key={m.id}
                    onClick={() => { setMethod(m.id); setStep('card'); }}
                    className="w-full flex items-center gap-4 glass rounded-xl p-4 hover:bg-white/10 transition-all text-left group border border-white/8 hover:border-[#E50914]/40">
                    <div className="w-10 h-10 bg-[#E50914]/15 rounded-lg flex items-center justify-center text-[#E50914] flex-shrink-0 group-hover:bg-[#E50914]/25 transition-colors">
                      {m.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{m.label}</p>
                      <p className="text-white/40 text-xs">{m.desc}</p>
                    </div>
                    <svg className="w-4 h-4 text-white/25 group-hover:text-[#E50914] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Card form / Payme / Click ── */}
          {step === 'card' && (
            <div>
              <button onClick={() => setStep('method')}
                className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs mb-4 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                Orqaga
              </button>

              {method === 'card' ? (
                <div className="space-y-3">
                  <p className="text-white font-semibold text-sm mb-3">Karta ma'lumotlari</p>

                  {/* Card number */}
                  <div>
                    <input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      className={`input-cv w-full px-4 py-3 rounded-xl text-sm font-mono ${errors.cardNum ? 'border-red-500/50' : ''}`} />
                    {errors.cardNum && <p className="text-red-400 text-xs mt-1">{errors.cardNum}</p>}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        className={`input-cv w-full px-4 py-3 rounded-xl text-sm ${errors.expiry ? 'border-red-500/50' : ''}`} />
                      {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,3))}
                        placeholder="CVV" type="password"
                        className={`input-cv w-full px-4 py-3 rounded-xl text-sm ${errors.cvv ? 'border-red-500/50' : ''}`} />
                      {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <input value={name} onChange={e => setName(e.target.value.toUpperCase())}
                      placeholder="KARTA EGASINING ISMI"
                      className={`input-cv w-full px-4 py-3 rounded-xl text-sm tracking-wider ${errors.name ? 'border-red-500/50' : ''}`} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#E50914]/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <p className="text-white font-semibold mb-1">
                    {method === 'payme' ? 'Payme' : 'Click'} orqali to'lash
                  </p>
                  <p className="text-white/40 text-sm">
                    Tugmani bosing — {method === 'payme' ? 'Payme' : 'Click'} ilovasiga yo'naltirilasiz
                  </p>
                </div>
              )}

              <button onClick={handlePay}
                className="btn-red w-full py-3.5 rounded-xl text-sm font-bold mt-5 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                {price.toLocaleString()} so'm to'lash
              </button>

              <p className="text-white/20 text-xs text-center mt-3 flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                SSL bilan himoyalangan to'lov
              </p>
            </div>
          )}

          {/* ── Step 3: Processing ── */}
          {step === 'processing' && (
            <div className="text-center py-10">
              <div className="w-16 h-16 border-4 border-white/10 border-t-[#E50914] rounded-full animate-spin mx-auto mb-5" />
              <p className="text-white font-semibold mb-1">To'lov amalga oshirilmoqda...</p>
              <p className="text-white/40 text-sm">Iltimos kutib turing</p>
            </div>
          )}

          {/* ── Step 4: Success ── */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-white font-black text-xl mb-2">To'lov muvaffaqiyatli!</h3>
              <p className="text-white/50 text-sm mb-1">{movieTitle}</p>
              <p className="text-green-400 text-sm font-semibold mb-6">{price.toLocaleString()} so'm to'landi</p>
              <button onClick={onSuccess}
                className="btn-red w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
                Filmni ko'rish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
