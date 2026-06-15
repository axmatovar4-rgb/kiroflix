import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  className?: string;
  label?: string;
}

const BackButton = ({ className = '', label = 'Orqaga' }: Props) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 text-white/50 hover:text-white transition-colors group ${className}`}
    >
      <div className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/12 border border-white/10 flex items-center justify-center transition-all group-hover:border-white/25">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default BackButton;
