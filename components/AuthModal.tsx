'use client';

import { type FormEvent, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AuthService from '@/lib/authService';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

type Mode = 'login' | 'register';

export default function AuthModal({ visible, onClose, onLoginSuccess }: AuthModalProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>('login');
  const [pseudo, setPseudo] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!visible) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = mode === 'login'
        ? await AuthService.login(login, password)
        : await AuthService.register(pseudo, login, password);

      if (mode === 'register') {
        setMessage(t('auth.success_register')); // Optionally keep this message for a moment
        // After successful registration, automatically log in the user
        const loginResponse = await AuthService.login(login, password);
        localStorage.setItem('farmcore_token', loginResponse.data.access_token);
        localStorage.setItem('farmcore_user', JSON.stringify(loginResponse.data.user));
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      } else {
        setMessage(t('auth.success_login'));
        localStorage.setItem('farmcore_token', response.data.access_token);
        localStorage.setItem('farmcore_user', JSON.stringify(response.data.user));
        if (onLoginSuccess) onLoginSuccess();
        onClose();
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 text-left shadow-2xl shadow-black/40">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-white"
        >
          ×
        </button>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">{t('auth.title')}</h2>
            <p className="text-sm text-slate-500">{t('auth.subtitle')}</p>
          </div>
          <div className="rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-400">
            {mode === 'login' ? t('auth.login_tab') : t('auth.register_tab')}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { setMode('login'); setMessage(''); setError(''); }}
            className={`rounded-2xl px-4 py-2 text-sm font-black transition ${mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            {t('auth.login_tab')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setMessage(''); setError(''); }}
            className={`rounded-2xl px-4 py-2 text-sm font-black transition ${mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            {t('auth.register_tab')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <label className="block text-sm font-semibold text-slate-200">
              <span>{t('auth.pseudo')}</span>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
              />
            </label>
          )}

          <label className="block text-sm font-semibold text-slate-200">
            <span>{t('auth.login_label')}</span>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-200">
            <span>{t('auth.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
            />
          </label>

          {(message || error) && (
            <div className="rounded-2xl border px-4 py-3 text-sm">
              {message ? (
                <p className="text-emerald-400">{message}</p>
              ) : (
                <p className="text-rose-400">{error}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t('auth.loading') : t('auth.submit')}
          </button>
        </form>

        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
          {mode === 'login' ? t('auth.switch_to_register') : t('auth.switch_to_login')}
        </p>
      </div>
    </div>
  );
}
