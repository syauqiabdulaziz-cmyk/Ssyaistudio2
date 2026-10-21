/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Category, SuratMasuk, SuratKeluar } from './types';
import { storage } from './services/storage';
import { LoginView } from './components/LoginView';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SuratMasukView } from './components/SuratMasukView';
import { SuratKeluarView } from './components/SuratKeluarView';
import { ArsipView } from './components/ArsipView';
import { LaporanView } from './components/LaporanView';
import { KelolaUserView } from './components/KelolaUserView';
import { KelolaKategoriView } from './components/KelolaKategoriView';
import { AlurPanduanView } from './components/AlurPanduanView';
import { PrintDisposisiModal } from './components/PrintDisposisiModal';
import { PrintLetterModal } from './components/PrintLetterModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Core Data States
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories());
  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => storage.getSuratMasuk());
  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => storage.getSuratKeluar());

  // Print Modals
  const [printDisposisiSurat, setPrintDisposisiSurat] = useState<SuratMasuk | null>(null);
  const [printLetterSurat, setPrintLetterSurat] = useState<SuratKeluar | null>(null);

  // Detail item navigation
  const [selectedSuratMasukForDetail, setSelectedSuratMasukForDetail] = useState<SuratMasuk | null>(null);
  const [selectedSuratKeluarForDetail, setSelectedSuratKeluarForDetail] = useState<SuratKeluar | null>(null);

  // Sync state whenever storage changes or on mount
  const refreshAllData = () => {
    setUsers(storage.getUsers());
    setCategories(storage.getCategories());
    setSuratMasukList(storage.getSuratMasuk());
    setSuratKeluarList(storage.getSuratKeluar());
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    refreshAllData();
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleResetData = () => {
    storage.resetAllData();
    refreshAllData();
    const updatedUser = storage.getUsers().find(u => u.username === currentUser?.username) || storage.getUsers()[0];
    storage.setCurrentUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  // Surat Masuk CRUD
  const handleSaveSuratMasuk = (surat: SuratMasuk) => {
    storage.saveSuratMasuk(surat);
    setSuratMasukList(storage.getSuratMasuk());
  };

  const handleDeleteSuratMasuk = (id: string) => {
    storage.deleteSuratMasuk(id);
    setSuratMasukList(storage.getSuratMasuk());
  };

  // Surat Keluar CRUD
  const handleSaveSuratKeluar = (surat: SuratKeluar) => {
    storage.saveSuratKeluar(surat);
    setSuratKeluarList(storage.getSuratKeluar());
  };

  const handleDeleteSuratKeluar = (id: string) => {
    storage.deleteSuratKeluar(id);
    setSuratKeluarList(storage.getSuratKeluar());
  };

  // User CRUD (Admin)
  const handleSaveUser = (savedUser: User) => {
    storage.saveUser(savedUser);
    setUsers(storage.getUsers());
    if (currentUser && currentUser.id === savedUser.id) {
      setCurrentUser(savedUser);
      storage.setCurrentUser(savedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    storage.deleteUser(userId);
    setUsers(storage.getUsers());
  };

  // Category CRUD (Admin)
  const handleSaveCategory = (cat: Category) => {
    storage.saveCategory(cat);
    setCategories(storage.getCategories());
  };

  const handleDeleteCategory = (catId: string) => {
    storage.deleteCategory(catId);
    setCategories(storage.getCategories());
  };

  // Quick navigation helpers from Dashboard or Arsip to detail
  const handleViewSuratMasuk = (surat: SuratMasuk) => {
    setSelectedSuratMasukForDetail(surat);
    setActiveTab('surat-masuk');
  };

  const handleViewSuratKeluar = (surat: SuratKeluar) => {
    setSelectedSuratKeluarForDetail(surat);
    setActiveTab('surat-keluar');
  };

  // Pending counts for sidebar badges
  const getCounts = () => {
    if (!currentUser) return { suratMasukPending: 0, suratKeluarPending: 0 };
    if (currentUser.role === 'pimpinan') {
      return {
        suratMasukPending: suratMasukList.filter(s => s.status === 'MENUNGGU_DISPOSISI').length,
        suratKeluarPending: suratKeluarList.filter(s => s.status === 'MENUNGGU_PERSETUJUAN').length,
      };
    }
    if (currentUser.role === 'tu') {
      return {
        suratMasukPending: suratMasukList.filter(s => s.status === 'DRAF').length,
        suratKeluarPending: suratKeluarList.filter(s => s.status === 'DISETUJUI').length,
      };
    }
    return {
      suratMasukPending: suratMasukList.filter(s => s.status === 'MENUNGGU_DISPOSISI' || s.status === 'DRAF').length,
      suratKeluarPending: suratKeluarList.filter(s => s.status === 'MENUNGGU_PERSETUJUAN').length,
    };
  };

  // Not logged in: Show Login Screen
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const counts = getCounts();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-900 selection:text-white">
      {/* Top Header */}
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onResetData={handleResetData}
      />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          role={currentUser.role}
          counts={counts}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={currentUser}
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              onNavigate={setActiveTab}
              onViewSuratMasuk={handleViewSuratMasuk}
              onViewSuratKeluar={handleViewSuratKeluar}
            />
          )}

          {activeTab === 'surat-masuk' && (
            <SuratMasukView
              user={currentUser}
              suratList={suratMasukList}
              categories={categories}
              onSaveSurat={handleSaveSuratMasuk}
              onDeleteSurat={handleDeleteSuratMasuk}
              onOpenPrintDisposisi={surat => setPrintDisposisiSurat(surat)}
              selectedSuratForDetail={selectedSuratMasukForDetail}
              onClearDetailSelection={() => setSelectedSuratMasukForDetail(null)}
            />
          )}

          {activeTab === 'surat-keluar' && (
            <SuratKeluarView
              user={currentUser}
              suratList={suratKeluarList}
              categories={categories}
              onSaveSurat={handleSaveSuratKeluar}
              onDeleteSurat={handleDeleteSuratKeluar}
              onOpenPrintLetter={surat => setPrintLetterSurat(surat)}
              selectedSuratForDetail={selectedSuratKeluarForDetail}
              onClearDetailSelection={() => setSelectedSuratKeluarForDetail(null)}
            />
          )}

          {activeTab === 'arsip' && (
            <ArsipView
              user={currentUser}
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              categories={categories}
              onViewSuratMasuk={handleViewSuratMasuk}
              onViewSuratKeluar={handleViewSuratKeluar}
              onOpenPrintDisposisi={surat => setPrintDisposisiSurat(surat)}
              onOpenPrintLetter={surat => setPrintLetterSurat(surat)}
            />
          )}

          {activeTab === 'laporan' && (
            <LaporanView
              user={currentUser}
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              categories={categories}
            />
          )}

          {activeTab === 'users' && currentUser.role === 'admin' && (
            <KelolaUserView
              currentUser={currentUser}
              users={users}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'kategori' && currentUser.role === 'admin' && (
            <KelolaKategoriView
              categories={categories}
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              onSaveCategory={handleSaveCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'alur' && (
            <AlurPanduanView currentRole={currentUser.role} />
          )}
        </main>
      </div>

      {/* Official Print Modals */}
      <PrintDisposisiModal
        isOpen={Boolean(printDisposisiSurat)}
        surat={printDisposisiSurat}
        categories={categories}
        onClose={() => setPrintDisposisiSurat(null)}
      />

      <PrintLetterModal
        isOpen={Boolean(printLetterSurat)}
        surat={printLetterSurat}
        categories={categories}
        onClose={() => setPrintLetterSurat(null)}
      />
    </div>
  );
}
