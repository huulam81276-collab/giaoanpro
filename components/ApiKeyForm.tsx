
import React, { useState, useEffect } from 'react';
import { translations } from '../utils/locales';
import { Language } from '../types';

interface ApiKeyFormProps {
  onSave: (apiKey: string) => void;
  initialError?: string | null;
  lang: Language;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSave, initialError, lang }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const t = translations[lang];

  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError(lang === 'vi' ? 'Vui lòng nhập API Key.' : 'Please enter API Key.');
      return;
    }
    setError('');
    onSave(key.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-slate-900/5 ring-1 ring-black/5 text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
        {t.apiKeyTitle}
      </h1>
      <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto mb-6">
        {t.apiKeyDesc}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            value={key}
            onChange={(e) => {
                setKey(e.target.value)
                if(error) setError('');
            }}
            placeholder={t.apiKeyPlaceholder}
            className="w-full px-3 py-2 bg-white/50 text-slate-900 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm transition text-center"
            aria-label="Google AI API Key"
          />
           {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-500 transition-all"
        >
          {t.saveAndStart}
        </button>
      </form>
       <div className="mt-6 text-xs text-slate-400">
            <p>{t.apiKeyNote}</p>
            <p className="mt-1">{lang === 'vi' ? 'Bạn có thể lấy API Key miễn phí tại' : 'Get your free API Key at'} <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">Google AI Studio</a>.</p>
       </div>
    </div>
  );
};
