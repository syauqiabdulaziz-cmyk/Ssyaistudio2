import React, { useState } from 'react';
import { SuratMasuk, SuratKeluar, Category, User } from '../types';
import { 
  Search, 
  Archive, 
  Inbox, 
  Send, 
  Printer, 
  Paperclip, 
  Eye, 
  Calendar,
  FileCheck,
  FolderOpen
} from 'lucide-react';

interface ArsipViewProps {
  user: User;
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  categories: Category[];
  onViewSuratMasuk: (surat: SuratMasuk) => void;
  onViewSuratKeluar: (surat: SuratKeluar) => void;
  onOpenPrintDisposisi: (surat: SuratMasuk) => void;
  onOpenPrintLetter: (surat: SuratKeluar) => void;
}

interface UnifiedArsipItem {
  id: string;
  type: 'MASUK' | 'KELUAR';
  noSurat: string;
  pihak: string; // Asal Surat (Masuk) or Tujuan (Keluar)
  tanggalSurat: string;
  perihal: string;
  kategoriId: string;
  arsipAt?: string;
  lampiranName?: string;
  lampiranSize?: string;
  rawMasuk?: SuratMasuk;
  rawKeluar?: SuratKeluar;
}

export const ArsipView: React.FC<ArsipViewProps> = ({
  user,
  suratMasukList,
  suratKeluarList,
  categories,
  onViewSuratMasuk,
  onViewSuratKeluar,
  onOpenPrintDisposisi,
  onOpenPrintLetter,
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MASUK' | 'KELUAR'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');

  // Combine items that are archived (or completed)
  const arsipMasuk: UnifiedArsipItem[] = suratMasukList
    .filter(s => s.status === 'TERARSIP' || (s.status === 'SUDAH_DISPOSISI' && s.arsipAt))
    .map(s => ({
      id: s.id,
      type: 'MASUK',
      noSurat: s.noSurat,
      pihak: `Dari: ${s.asalSurat}`,
      tanggalSurat: s.tanggalSurat,
      perihal: s.perihal,
      kategoriId: s.kategoriId,
      arsipAt: s.arsipAt || s.updatedAt,
      lampiranName: s.lampiranName,
      lampiranSize: s.lampiranSize,
      rawMasuk: s,
    }));

  const arsipKeluar: UnifiedArsipItem[] = suratKeluarList
    .filter(s => s.status === 'TERARSIP' || (s.status === 'DISETUJUI' && s.arsipAt))
    .map(s => ({
      id: s.id,
      type: 'KELUAR',
      noSurat: s.noSurat,
      pihak: `Kepada: ${s.tujuanSurat}`,
      tanggalSurat: s.tanggalSurat,
      perihal: s.perihal,
      kategoriId: s.kategoriId,
      arsipAt: s.arsipAt || s.updatedAt,
      lampiranName: s.lampiranInfo && s.lampiranInfo !== '-' ? s.lampiranInfo : undefined,
      rawKeluar: s,
    }));

  const allArsip = [...arsipMasuk, ...arsipKeluar].sort((a, b) => {
    return new Date(b.tanggalSurat).getTime() - new Date(a.tanggalSurat).getTime();
  });

  // Extract available years
  const availableYears = Array.from(
    new Set(allArsip.map(item => new Date(item.tanggalSurat).getFullYear()))
  ).sort((a, b) => b - a);

  // Filter
  const filteredArsip = allArsip.filter(item => {
    const matchesSearch =
      item.noSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pihak.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesCat = categoryFilter === 'ALL' || item.kategoriId === categoryFilter;
    const matchesYear =
      yearFilter === 'ALL' ||
      new Date(item.tanggalSurat).getFullYear().toString() === yearFilter;

    return matchesSearch && matchesType && matchesCat && matchesYear;
  });

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'Umum';
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Buku Arsip Surat Universitas
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pusat penyimpanan arsip digital surat masuk dan surat keluar yang telah selesai diproses.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-200">
              Total Arsip: {allArsip.length} Berkas
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari dalam arsip: nomor surat, pihak terkait, perihal..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Jenis Surat */}
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Jenis:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="py-1 px-2.5 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:border-blue-900"
            >
              <option value="ALL">Semua Jenis</option>
              <option value="MASUK">Surat Masuk</option>
              <option value="KELUAR">Surat Keluar</option>
            </select>
          </div>

          {/* Tahun Filter */}
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Tahun:</span>
            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="py-1 px-2.5 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:border-blue-900"
            >
              <option value="ALL">Semua Tahun</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr.toString()}>
                  Tahun {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Kategori Filter */}
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Kategori:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="py-1 px-2.5 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:border-blue-900"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Arsip */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3">Nomor Surat</th>
                <th className="px-4 py-3">Pihak Terkait</th>
                <th className="px-4 py-3">Perihal Dokumen</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Tanggal Surat</th>
                <th className="px-4 py-3 text-right">Aksi Arsip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArsip.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <div>Tidak ada arsip yang cocok dengan pencarian atau filter Anda.</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Surat yang telah selesai diproses oleh TU / Pimpinan dapat diarsipkan agar muncul di sini.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredArsip.map((item, index) => (
                  <tr key={`${item.type}-${item.id}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.type === 'MASUK' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          <Inbox className="w-3 h-3" />
                          <span>Masuk</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
                          <Send className="w-3 h-3" />
                          <span>Keluar</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 font-mono">
                      {item.noSurat}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-800 font-medium">{item.pihak}</div>
                      {item.lampiranName && (
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                          <Paperclip className="w-2.5 h-2.5" />
                          <span>{item.lampiranName}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[260px]">
                      <div className="text-slate-700 line-clamp-2 leading-relaxed">
                        {item.perihal}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {getCategoryName(item.kategoriId)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-600">
                      {item.tanggalSurat}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      {/* Lihat detail */}
                      <button
                        onClick={() => {
                          if (item.type === 'MASUK' && item.rawMasuk) {
                            onViewSuratMasuk(item.rawMasuk);
                          } else if (item.type === 'KELUAR' && item.rawKeluar) {
                            onViewSuratKeluar(item.rawKeluar);
                          }
                        }}
                        title="Lihat Detail Arsip"
                        className="px-2 py-1 text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Detail</span>
                      </button>

                      {/* Cetak ulang */}
                      {item.type === 'MASUK' && item.rawMasuk?.disposisi && (
                        <button
                          onClick={() => item.rawMasuk && onOpenPrintDisposisi(item.rawMasuk)}
                          title="Cetak Lembar Disposisi"
                          className="px-2 py-1 text-blue-900 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Disposisi</span>
                        </button>
                      )}

                      {item.type === 'KELUAR' && item.rawKeluar && (
                        <button
                          onClick={() => item.rawKeluar && onOpenPrintLetter(item.rawKeluar)}
                          title="Cetak Surat Keluar Resmi"
                          className="px-2 py-1 text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Cetak</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Menampilkan {filteredArsip.length} dokumen dalam arsip</span>
          <span>Universitas Komputama Majenang</span>
        </div>
      </div>
    </div>
  );
};
