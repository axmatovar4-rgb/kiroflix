import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0e] border-t border-white/8 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-[#E50914] font-black text-2xl tracking-widest mb-3"
              style={{ fontFamily: 'Poppins,sans-serif' }}>KIROFLIX</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              O'zbekistondagi premium kino platformasi. Minglab filmlar bir joyda.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: 'Telegram', href: 'https://t.me/kiroflix_com', path: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.61c-.154.676-.556.84-1.126.522l-3.126-2.302-1.508 1.452c-.168.167-.308.307-.63.307l.225-3.184 5.78-5.22c.252-.224-.054-.348-.39-.124L7.034 14.42l-3.07-.956c-.667-.208-.68-.667.14-.987l11.98-4.618c.558-.2 1.044.136.478 1.389z' },
                { label: 'Instagram', href: '#', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { label: 'YouTube', href: '#', path: 'M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Navigatsiya</h3>
            <ul className="space-y-2.5">
              {[['/', 'Bosh Sahifa'],['/search','Filmlar'],['/search?genre=Action','Aksiya'],['/search?genre=Drama','Drama'],['/profile','Profil']].map(([to,label]) => (
                <li key={label}>
                  <Link to={to} className="text-white/40 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Janrlar */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Janrlar</h3>
            <ul className="space-y-2.5">
              {['Action','Drama','Sci-Fi','Crime','Adventure','Comedy','Thriller','Horror'].map(g => (
                <li key={g}>
                  <Link to={`/search?genre=${g}`} className="text-white/40 hover:text-white text-sm transition-colors">{g}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aloqa */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Aloqa</h3>
            <ul className="space-y-3">
              {[
                { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', text: 'info@kiroflix.uz' },
                { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', text: '+998 90 123 45 67' },
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: "Toshkent, O'zbekiston" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#E50914] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon}/>
                  </svg>
                  <span className="text-white/40 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">© 2026 KIROFLIX. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-5">
            {['Maxfiylik siyosati','Foydalanish shartlari','Cookie'].map(l => (
              <a key={l} href="#" className="text-white/25 hover:text-white/50 text-xs transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
