import React, { useState } from 'react';
import { User } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { LogOut, User as UserIcon, Building2, RotateCcw } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onResetData }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'tu':
        return 'Staf Tata Usaha';
      case 'pimpinan':
        return 'Pimpinan Universitas';
      default:
        return role;
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tu':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pimpinan':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <>
      <header className="no-print h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-900 rounded flex items-center justify-center text-white font-bold text-base shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-950 tracking-tight text-lg">SIMAMAT</span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">| Sistem Informasi Manajemen Arsip Surat</span>
            </div>
            <p className="text-xs text-slate-500 font-normal">Universitas Komputama Majenang</p>
          </div>
        </div>

        {/* Right user & actions */}
        <div className="flex items-center gap-3">
          {/* Reset Dummy Data quick tool */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset data ke bawaan awal"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          {/* User Profile display */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {user.name}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[11px] px-1.5 py-0.2 rounded border font-medium ${getRoleBadgeStyle(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">
                  @{user.username}
                </span>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-1.5 ml-2 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-300 hover:border-red-200 rounded transition-colors"
            title="Keluar dari sistem"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Logout confirmation */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Konfirmasi Keluar"
        message={`Apakah Anda yakin ingin keluar dari akun ${user.name}? Anda harus masuk kembali untuk mengakses sistem.`}
        confirmLabel="Keluar Sekarang"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          onLogout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {/* Reset data confirmation */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Data Simulasi"
        message="Tindakan ini akan mengembalikan data pengguna, kategori, surat masuk, dan surat keluar ke data awal simulasi bawaan. Lanjutkan?"
        confirmLabel="Ya, Reset Data"
        cancelLabel="Batal"
        isDestructive={false}
        onConfirm={() => {
          setShowResetConfirm(false);
          onResetData();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
};
