import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../locales/translations';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export const LanguageSelector: React.FC<Props> = ({ language, onLanguageChange, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 bg-slate-800/80 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-700/60 text-xs font-medium text-slate-200 ${className}`}>
      <Globe className="w-3.5 h-3.5 text-blue-400" />
      <button
        onClick={() => onLanguageChange('km')}
        className={`px-1.5 py-0.5 rounded transition ${language === 'km' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'}`}
      >
        ខ្មែរ
      </button>
      <span className="text-slate-600">|</span>
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-1.5 py-0.5 rounded transition ${language === 'en' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'}`}
      >
        EN
      </button>
    </div>
  );
};
