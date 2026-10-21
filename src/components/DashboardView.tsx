import React from 'react';
import { User, SuratMasuk, SuratKeluar } from '../types';
import { 
  Inbox, 
  Send, 
  Clock, 
  Archive, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  user: User;
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  onNavigate: (tab: ActiveTab) => void;
  onViewSuratMasuk: (surat: SuratMasuk) => void;
  onViewSuratKeluar: (surat: SuratKeluar) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  suratMasukList,
  suratKeluarList,
  onNavigate,
  onViewSuratMasuk,
  onViewSuratKeluar,
}) => {
  // Calculations
  const totalMasuk = suratMasukList.length;
  const totalKeluar = suratKeluarList.length;

  // Menunggu proses:
  // Surat Masuk: MENUNGGU_DISPOSISI or DRAF
  // Surat Keluar: MENUNGGU_PERSETUJUAN
  const smPendingDisposisi = suratMasukList.filter(s => s.status === 'MENUNGGU_DISPOSISI').length;
  const skPendingPersetujuan = suratKeluarList.filter(s => s.status === 'MENUNGGU_PERSETUJUAN').length;
  const smDraf = suratMasukList.filter(s => s.status === 'DRAF').length;
  const skDisetujuiSiapCetak = suratKeluarList.filter(s => s.status === 'DISETUJUI').length;

  const totalMenunggu = smPendingDisposisi + skPendingPersetujuan + smDraf;

  const totalArsipMasuk = suratMasukList.filter(s => s.status === 'TERARSIP').length;
  const totalArsipKeluar = suratKeluarList.filter(s => s.status === 'TERARSIP').length;
  const totalArsip = totalArsipMasuk + totalArsipKeluar;

  // Recent lists (latest 4)
  const recentMasuk = [...suratMasukList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const recentKeluar = [...suratKeluarList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const renderBadgeMasuk = (status: string) => {
    switch (status) {
      case 'DRAF':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700 border border-slate-200">Draf TU</span>;
      case 'MENUNGGU_DISPOSISI':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-800 border border-amber-200">Menunggu Disposisi</span>;
      case 'SUDAH_DISPOSISI':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800 border border-blue-200">Sudah Disposisi</span>;
      case 'SELESAI':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-100 text-emerald-800 border border-emerald-200">Selesai</span>;
      case 'TERARSIP':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-200 text-slate-800 border border-slate-300">Terarsip</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const renderBadgeKeluar = (status: string) => {
    switch (status) {
      case 'DRAF':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700 border border-slate-200">Draf</span>;
      case 'MENUNGGU_PERSETUJUAN':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-800 border border-amber-200">Perlu Persetujuan</span>;
      case 'DISETUJUI':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-100 text-emerald-800 border border-emerald-200">Disetujui / Siap Cetak</span>;
      case 'DITOLAK':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800 border border-red-200">Ditolak</span>;
      case 'TERARSIP':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-200 text-slate-800 border border-slate-300">Terarsip</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Greeting Banner */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Dashboard SIMAMAT
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Selamat bertugas, <span className="font-semibold text-slate-700">{user.name}</span>. 
              {user.role === 'pimpinan' && ' Anda memiliki akses untuk mendisposisikan surat masuk dan menyetujui surat keluar.'}
              {user.role === 'tu' && ' Anda memiliki wewenang untuk input surat masuk, membuat surat keluar, cetak, dan pengarsipan.'}
              {user.role === 'admin' && ' Anda memiliki akses penuh sistem termasuk manajemen pengguna dan kategori surat.'}
            </p>
          </div>
          <div className="text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded self-start sm:self-center">
            Tahun Kerja: 2026 / 2027
          </div>
        </div>
      </div>

      {/* Role-Specific Action Alert */}
      {user.role === 'pimpinan' && (smPendingDisposisi > 0 || skPendingPersetujuan > 0) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-amber-900">
                Pemberitahuan Tugas Pimpinan
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                Terdapat <span className="font-bold">{smPendingDisposisi}</span> surat masuk menunggu disposisi Anda dan <span className="font-bold">{skPendingPersetujuan}</span> surat keluar menunggu persetujuan Rektor.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {smPendingDisposisi > 0 && (
              <button
                onClick={() => onNavigate('surat-masuk')}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium rounded transition-colors"
              >
                Disposisi Surat Masuk
              </button>
            )}
            {skPendingPersetujuan > 0 && (
              <button
                onClick={() => onNavigate('surat-keluar')}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-medium rounded transition-colors"
              >
                Persetujuan Surat Keluar
              </button>
            )}
          </div>
        </div>
      )}

      {user.role === 'tu' && (skDisetujuiSiapCetak > 0 || smDraf > 0) && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-blue-900">
                Agenda Tugas Staf Tata Usaha
              </div>
              <div className="text-xs text-blue-800 mt-0.5">
                Ada <span className="font-bold">{skDisetujuiSiapCetak}</span> surat keluar yang telah disetujui Pimpinan dan siap dicetak/diarsipkan. Terdapat <span className="font-bold">{smDraf}</span> surat masuk dalam draf.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('surat-keluar')}
              className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-medium rounded transition-colors"
            >
              Cetak Surat Disetujui
            </button>
          </div>
        </div>
      )}

      {/* 4 Summary Cards (as specified: jumlah surat masuk, surat keluar, menunggu proses, arsip) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Surat Masuk */}
        <div 
          onClick={() => onNavigate('surat-masuk')}
          className="bg-white border border-slate-200 rounded p-4 shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Surat Masuk
            </span>
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-blue-900">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-800">{totalMasuk}</div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-between">
              <span>{smPendingDisposisi} butuh disposisi</span>
              <span className="text-blue-900 font-medium">Buka &rarr;</span>
            </p>
          </div>
        </div>

        {/* Card 2: Surat Keluar */}
        <div 
          onClick={() => onNavigate('surat-keluar')}
          className="bg-white border border-slate-200 rounded p-4 shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Surat Keluar
            </span>
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-blue-900">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-800">{totalKeluar}</div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-between">
              <span>{skPendingPersetujuan} butuh persetujuan</span>
              <span className="text-blue-900 font-medium">Buka &rarr;</span>
            </p>
          </div>
        </div>

        {/* Card 3: Menunggu Proses */}
        <div 
          onClick={() => onNavigate(user.role === 'pimpinan' ? 'surat-masuk' : 'surat-keluar')}
          className="bg-white border border-slate-200 rounded p-4 shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menunggu Proses
            </span>
            <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-800">{totalMenunggu}</div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-between">
              <span>Draf & Persetujuan</span>
              <span className="text-amber-800 font-medium">Lihat &rarr;</span>
            </p>
          </div>
        </div>

        {/* Card 4: Arsip */}
        <div 
          onClick={() => onNavigate('arsip')}
          className="bg-white border border-slate-200 rounded p-4 shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Surat Terarsip
            </span>
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-700">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-800">{totalArsip}</div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-between">
              <span>{totalArsipMasuk} Masuk &bull; {totalArsipKeluar} Keluar</span>
              <span className="text-slate-700 font-medium">Buka &rarr;</span>
            </p>
          </div>
        </div>
      </div>

      {/* Alur Ringkas Visual Box */}
      <div className="bg-slate-50 border border-slate-200 rounded p-4">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Alur Tata Kelola Arsip SIMAMAT:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="bg-white p-3 rounded border border-slate-200 flex items-center gap-2">
            <span className="font-semibold text-blue-950 shrink-0">Surat Masuk:</span>
            <span className="text-slate-500">Staf TU Input</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">Pimpinan Disposisi</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">Selesai</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">Arsip</span>
          </div>
          <div className="bg-white p-3 rounded border border-slate-200 flex items-center gap-2">
            <span className="font-semibold text-blue-950 shrink-0">Surat Keluar:</span>
            <span className="text-slate-500">Staf TU Buat</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">Pimpinan Setujui</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">Cetak</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-800">Arsip</span>
          </div>
        </div>
      </div>

      {/* Two Recent Tables Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Surat Masuk Terbaru */}
        <div className="bg-white border border-slate-200 rounded shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Surat Masuk Terbaru</h2>
              <p className="text-[11px] text-slate-500">4 data surat masuk paling akhir diterima</p>
            </div>
            <button
              onClick={() => onNavigate('surat-masuk')}
              className="text-xs text-blue-900 font-semibold hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="px-4 py-2.5">No. Surat & Asal</th>
                  <th className="px-4 py-2.5">Perihal</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMasuk.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      Belum ada surat masuk.
                    </td>
                  </tr>
                ) : (
                  recentMasuk.map(surat => (
                    <tr key={surat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 font-mono text-[11px]">
                          {surat.noSurat}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {surat.asalSurat}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <div className="line-clamp-2 text-slate-700">
                          {surat.perihal}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Tgl: {surat.tanggalSurat}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderBadgeMasuk(surat.status)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onViewSuratMasuk(surat)}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Surat Keluar Terbaru */}
        <div className="bg-white border border-slate-200 rounded shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Surat Keluar Terbaru</h2>
              <p className="text-[11px] text-slate-500">4 data surat keluar terakhir diajukan</p>
            </div>
            <button
              onClick={() => onNavigate('surat-keluar')}
              className="text-xs text-blue-900 font-semibold hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="px-4 py-2.5">No. Surat & Tujuan</th>
                  <th className="px-4 py-2.5">Perihal</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentKeluar.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                      Belum ada surat keluar.
                    </td>
                  </tr>
                ) : (
                  recentKeluar.map(surat => (
                    <tr key={surat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 font-mono text-[11px]">
                          {surat.noSurat}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">
                          {surat.tujuanSurat}
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <div className="line-clamp-2 text-slate-700">
                          {surat.perihal}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Tgl: {surat.tanggalSurat}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderBadgeKeluar(surat.status)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onViewSuratKeluar(surat)}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
