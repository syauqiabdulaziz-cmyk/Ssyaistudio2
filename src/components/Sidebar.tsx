import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Inbox, 
  Send, 
  Archive, 
  FileText, 
  Users, 
  Tags, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'surat-masuk' 
  | 'surat-keluar' 
  | 'arsip' 
  | 'laporan' 
  | 'users' 
  | 'kategori' 
  | 'alur';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  role: UserRole;
  counts: {
    suratMasukPending: number;
    suratKeluarPending: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  role,
  counts,
}) => {
  return (
    <aside className="no-print w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Institution header note */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu Navigasi
        </div>
        <div className="text-xs text-slate-300 mt-1">
          {role === 'admin' && 'Akses: Administrator'}
          {role === 'tu' && 'Akses: Staf Tata Usaha'}
          {role === 'pimpinan' && 'Akses: Pimpinan / Rektor'}
        </div>
      </div>

      {/* Main navigation list */}
      <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-blue-800 text-white font-medium'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <span>Dashboard</span>
          </div>
        </button>

        {/* Section title */}
        <div className="pt-3 pb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Layanan Surat
        </div>

        {/* Surat Masuk */}
        <button
          onClick={() => onSelectTab('surat-masuk')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
            activeTab === 'surat-masuk'
              ? 'bg-blue-800 text-white font-medium'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Inbox className="w-4 h-4 text-slate-400" />
            <span>Surat Masuk</span>
          </div>
          {counts.suratMasukPending > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
              {counts.suratMasukPending}
            </span>
          )}
        </button>

        {/* Surat Keluar */}
        <button
          onClick={() => onSelectTab('surat-keluar')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
            activeTab === 'surat-keluar'
              ? 'bg-blue-800 text-white font-medium'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Send className="w-4 h-4 text-slate-400" />
            <span>Surat Keluar</span>
          </div>
          {counts.suratKeluarPending > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500 text-white">
              {counts.suratKeluarPending}
            </span>
          )}
        </button>

        {/* Arsip Surat */}
        <button
          onClick={() => onSelectTab('arsip')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
            activeTab === 'arsip'
              ? 'bg-blue-800 text-white font-medium'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Archive className="w-4 h-4 text-slate-400" />
            <span>Arsip Surat</span>
          </div>
        </button>

        {/* Laporan */}
        <button
          onClick={() => onSelectTab('laporan')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
            activeTab === 'laporan'
              ? 'bg-blue-800 text-white font-medium'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Rekap & Laporan</span>
          </div>
        </button>

        {/* Admin only section */}
        {role === 'admin' && (
          <>
            <div className="pt-4 pb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Pengaturan Admin
            </div>

            <button
              onClick={() => onSelectTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-800 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Kelola Pengguna</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('kategori')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
                activeTab === 'kategori'
                  ? 'bg-blue-800 text-white font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tags className="w-4 h-4 text-slate-400" />
                <span>Kategori Surat</span>
              </div>
            </button>
          </>
        )}

        {/* Info Alur */}
        <div className="pt-4 pb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Bantuan
        </div>

        <button
          onClick={() => onSelectTab('alur')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-colors ${
            activeTab === 'alur'
              ? 'bg-blue-800 text-white font-medium'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Alur Sistem SIMAMAT</span>
          </div>
        </button>
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <FileCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>SIMAMAT v1.0</span>
        </div>
        <p className="mt-0.5 text-slate-400">Univ. Komputama Majenang</p>
      </div>
    </aside>
  );
};
