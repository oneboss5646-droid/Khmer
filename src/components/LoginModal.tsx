import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, User, RefreshCw, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { store } from '../services/store';
import { LanguageSelector } from './LanguageSelector';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<Props> = ({
  language,
  onLanguageChange,
  onLoginSuccess,
}) => {
  const t = translations[language];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('3762');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(random);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (inputCaptcha !== captchaCode) {
      setError(language === 'km' ? 'លេខកូដផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវទេ' : 'Verification captcha code is incorrect.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.loginUser(username, password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.message || t.invalidCredentials);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0a0e17] relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Language Switcher at Top */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
      </div>

      <div className="w-full max-w-sm z-10">
        {/* Mobile-like Phone Frame Container matching Screen 1 in screenshot */}
        <div className="bg-[#111726] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-20 h-20 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/30 mb-3 border border-blue-500/40 bg-slate-950 p-1">
              <img
                src="/src/assets/images/quantyield_logo_1791865235637.jpg"
                alt="QuantYield Global Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {language === 'km' ? 'សូមស្វាគមន៍!' : 'Hello! Welcome to Login'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              QuantYield Global Institutional VIP Investment & Staking
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Account / Username */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'km' ? 'គណនី' : 'Account'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.accountPlaceholder}
                  className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2.5 pl-9 pr-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'km' ? 'ពាក្យសម្ងាត់' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2.5 pl-9 pr-10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Verification Captcha Code */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.verifyCodePlaceholder}
              </label>
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3">
                  <input
                    type="text"
                    value={inputCaptcha}
                    onChange={(e) => setInputCaptcha(e.target.value)}
                    placeholder="Enter code"
                    maxLength={4}
                    className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 px-3 text-white text-xs font-mono tracking-widest text-center focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <div
                    onClick={generateCaptcha}
                    title="Click to refresh captcha"
                    className="flex-1 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl py-2 text-center font-bold tracking-widest text-emerald-400 font-mono text-sm cursor-pointer select-none shadow-inner"
                  >
                    {captchaCode}
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2 text-slate-400 hover:text-white transition"
                    title="Refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition transform active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Logging in...') : t.login.toUpperCase()}
            </button>

            {/* Quick 1-Click VIP Investor Access */}
            <button
              type="button"
              onClick={() => {
                setUsername('mk887');
                setPassword('password123');
                setInputCaptcha(captchaCode);
                setTimeout(() => {
                  const res = store.loginUser('mk887', 'password123');
                  if (res.success) onLoginSuccess();
                }, 200);
              }}
              className="w-full py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span>⭐ {language === 'km' ? 'ចូលមើលគណនីគំរូ VIP mk887 ភ្លាមៗ (1-Click)' : '1-Click Quick VIP Access (mk887)'}</span>
            </button>
          </form>

          {/* Admin Provision Notice */}
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 leading-relaxed">
            <span className="font-semibold text-amber-300 block mb-0.5">🔒 {language === 'km' ? 'សុវត្ថិភាពគណនី' : 'Admin Provisioning Required'}</span>
            {t.adminNotice}
          </div>

          {/* Institutional Trust Badges on Login */}
          <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-1 text-center font-mono text-[9px] text-slate-400">
            <div className="p-1 rounded bg-slate-900/60 border border-slate-800/60">
              🔒 256-Bit SSL
            </div>
            <div className="p-1 rounded bg-slate-900/60 border border-slate-800/60">
              🛡️ $50M SAFU
            </div>
            <div className="p-1 rounded bg-slate-900/60 border border-slate-800/60">
              💎 Cold Vault
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
