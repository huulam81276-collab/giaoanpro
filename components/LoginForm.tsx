
import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { authService } from '../services/authService';
import { translations } from '../utils/locales';
import { Language } from '../types';

interface LoginFormProps {
  onLoginSuccess: (email: string) => void;
  lang?: Language;
  setLang?: (lang: Language) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, lang = 'vi', setLang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string>('Loading...');
  
  const t = translations[lang];

  useEffect(() => {
    // Fetch public IP address
    const fetchIp = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            if (response.ok) {
                const data = await response.json();
                setIpAddress(data.ip);
            } else {
                setIpAddress('Unknown');
            }
        } catch (e) {
            setIpAddress('Unknown');
        }
    };
    fetchIp();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    const result = await authService.login(email, password);

    if (result.success && result.user) {
        localStorage.setItem('session_email', result.user.email);
        localStorage.setItem('session_token', result.user.token); 
        onLoginSuccess(result.user.email);
    } else {
        setError(result.message || t.loginError);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-sky-50">
      <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-slate-900/10 ring-1 ring-white/50 relative border border-white mt-12">
        
        {/* Prominent Language Switcher */}
        {setLang && (
             <div className="absolute -top-24 right-0 left-0 flex flex-col items-center justify-center z-20 gap-3">
                <span className="bg-slate-800/80 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                    {lang === 'vi' ? 'Chọn ngôn ngữ / Select Language' : 'Select Language / Chọn ngôn ngữ'}
                </span>
                <div className="flex items-center bg-white p-2 rounded-full shadow-2xl ring-4 ring-white/30 scale-110">
                    <button 
                        onClick={() => setLang('vi')} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                            lang === 'vi' 
                            ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg transform scale-105 ring-2 ring-white' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                        <span className="text-xl">🇻🇳</span>
                        <span>Tiếng Việt</span>
                    </button>
                    <button 
                        onClick={() => setLang('en')} 
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                            lang === 'en' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform scale-105 ring-2 ring-white' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                    >
                        <span className="text-xl">🇬🇧</span>
                        <span>English</span>
                    </button>
                </div>
            </div>
        )}

        <div className="text-center mb-8 mt-6">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-sky-100 to-blue-50 text-sky-600 mb-5 shadow-inner ring-1 ring-sky-100">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {t.login}
          </h1>
          <p className="text-base text-slate-500">
            {t.loginDesc}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 ml-1">
              {t.emailLabel}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm"
              placeholder="example@school.edu.vn"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 ml-1">
              {t.passwordLabel}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 text-sm p-4 rounded-xl border animate-pulse bg-red-50 text-red-600 border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 px-4 py-3.5 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="w-5 h-5" />
                <span>{t.authenticating}</span>
              </>
            ) : (
              t.loginButton
            )}
          </button>
        </form>

        <div className="mt-6 p-3 bg-slate-100/80 border border-slate-200 rounded-lg text-center">
            <p className="text-xs text-slate-500 font-mono mb-1">
                {t.currentIp}: <span className="font-bold text-slate-700">{ipAddress}</span>
            </p>
            <p className="text-[11px] text-red-500 font-semibold italic">
                {t.ipWarning}
            </p>
        </div>
      </div>
    </div>
  );
};
