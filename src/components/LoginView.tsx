import React, { useState } from 'react';
import { User } from '../types';
import { storage } from '../services/storage';
import { Building2, Lock, User as UserIcon, ShieldAlert } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Silakan masukkan username dan password Anda.');
      return;
    }

    setIsLoading(true);
    // Slight simulated latency for realism
    setTimeout(() => {
      const users = storage.getUsers();
      const matched = users.find(
        u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
      );

      if (matched) {
        storage.setCurrentUser(matched);
        onLoginSuccess(matched);
      } else {
        setErrorMessage('Username atau password yang Anda masukkan salah.');
        setIsLoading(false);
      }
    }, 200);
  };

  const handleQuickLogin = (demoUsername: string, demoPass: string) => {
    setUsername(demoUsername);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-8">
      {/* Top institution badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-900 text-white rounded mb-3 shadow-sm">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Selamat datang di SIMAMAT
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
          Sistem Informasi Manajemen Arsip Surat - Universitas Komputama Majenang
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-300 rounded shadow-sm p-6 sm:p-8">
        <div className="mb-5 pb-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">
            Masuk ke Akun Anda
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gunakan akun resmi institusi untuk mengelola arsip surat.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2.5 text-red-700 text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-colors"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-blue-900 hover:bg-blue-950 text-white text-sm font-semibold rounded shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Demo Accounts List - as requested */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Akun Demo (Klik untuk isi cepat):
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="p-2 border border-slate-200 rounded text-left hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <div className="text-xs font-semibold text-slate-800">Admin</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">admin</div>
              <div className="text-[10px] text-slate-400 font-mono">admin123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('tu', 'tu123')}
              className="p-2 border border-slate-200 rounded text-left hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <div className="text-xs font-semibold text-slate-800">Staf TU</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">tu</div>
              <div className="text-[10px] text-slate-400 font-mono">tu123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('pimpinan', 'pimpinan123')}
              className="p-2 border border-slate-200 rounded text-left hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <div className="text-xs font-semibold text-slate-800">Pimpinan</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">pimpinan</div>
              <div className="text-[10px] text-slate-400 font-mono">pimpinan123</div>
            </button>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 text-center">
            Format: username / password
          </div>
        </div>
      </div>

      {/* Footer institutional copyright */}
      <footer className="mt-8 text-center text-xs text-slate-500">
        <div>Bagian Tata Usaha & Kearsipan &bull; Universitas Komputama Majenang</div>
        <div className="text-[11px] text-slate-400 mt-1">Cilacap, Jawa Tengah &bull; 2026</div>
      </footer>
    </div>
  );
};
