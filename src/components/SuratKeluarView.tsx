import React, { useState } from 'react';
import { SuratKeluar, Category, User, StatusSuratKeluar } from '../types';
import { storage } from '../services/storage';
import { 
  Plus, 
  Search, 
  Printer, 
  Send, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Archive,
  X,
  FileText,
  RotateCcw
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface SuratKeluarViewProps {
  user: User;
  suratList: SuratKeluar[];
  categories: Category[];
  onSaveSurat: (surat: SuratKeluar) => void;
  onDeleteSurat: (id: string) => void;
  onOpenPrintLetter: (surat: SuratKeluar) => void;
  selectedSuratForDetail?: SuratKeluar | null;
  onClearDetailSelection?: () => void;
}

export const SuratKeluarView: React.FC<SuratKeluarViewProps> = ({
  user,
  suratList,
  categories,
  onSaveSurat,
  onDeleteSurat,
  onOpenPrintLetter,
  selectedSuratForDetail,
  onClearDetailSelection,
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<SuratKeluar | null>(null);

  // Modal Approval (Pimpinan)
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [suratForApproval, setSuratForApproval] = useState<SuratKeluar | null>(null);
  const [catatanPimpinan, setCatatanPimpinan] = useState('');
  const [approvalError, setApprovalError] = useState('');

  // Modal Detail
  const [detailSurat, setDetailSurat] = useState<SuratKeluar | null>(selectedSuratForDetail || null);

  // Confirmation states
  const [confirmSubmitSurat, setConfirmSubmitSurat] = useState<SuratKeluar | null>(null);
  const [confirmArchiveSurat, setConfirmArchiveSurat] = useState<SuratKeluar | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Fields
  const [tujuanSurat, setTujuanSurat] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [sifatSurat, setSifatSurat] = useState<'Biasa' | 'Penting' | 'Segera' | 'Rahasia'>('Biasa');
  const [perihal, setPerihal] = useState('');
  const [isiSurat, setIsiSurat] = useState('');
  const [lampiranInfo, setLampiranInfo] = useState('');
  const [manualNoSurat, setManualNoSurat] = useState('');
  const [isManualNumber, setIsManualNumber] = useState(false);
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (selectedSuratForDetail) {
      setDetailSurat(selectedSuratForDetail);
    }
  }, [selectedSuratForDetail]);

  const getAutoNumberPreview = (catId: string, tgl: string) => {
    const cat = categories.find(c => c.id === catId);
    const code = cat?.code || 'TU';
    return storage.generateNoSuratKeluar(code, tgl);
  };

  const resetForm = () => {
    const today = new Date().toISOString().slice(0, 10);
    const initialCat = categories[0]?.id || '';
    const auto = getAutoNumberPreview(initialCat, today);

    setEditingSurat(null);
    setTujuanSurat('');
    setTanggalSurat(today);
    setKategoriId(initialCat);
    setSifatSurat('Biasa');
    setPerihal('');
    setIsiSurat('');
    setLampiranInfo('-');
    setManualNoSurat(auto.noSurat);
    setIsManualNumber(false);
    setFormError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (surat: SuratKeluar) => {
    setEditingSurat(surat);
    setTujuanSurat(surat.tujuanSurat);
    setTanggalSurat(surat.tanggalSurat);
    setKategoriId(surat.kategoriId);
    setSifatSurat(surat.sifatSurat);
    setPerihal(surat.perihal);
    setIsiSurat(surat.isiSurat);
    setLampiranInfo(surat.lampiranInfo || '-');
    setManualNoSurat(surat.noSurat);
    setIsManualNumber(true);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tujuanSurat.trim() || !perihal.trim() || !isiSurat.trim() || !tanggalSurat) {
      setFormError('Harap lengkapi semua kolom yang bertanda bintang (*).');
      return;
    }

    const now = new Date().toISOString();
    const cat = categories.find(c => c.id === kategoriId);
    const auto = storage.generateNoSuratKeluar(cat?.code || 'TU', tanggalSurat);

    const finalNoSurat = isManualNumber && manualNoSurat.trim() 
      ? manualNoSurat.trim() 
      : (editingSurat ? editingSurat.noSurat : auto.noSurat);

    const nomorUrut = editingSurat ? editingSurat.nomorUrut : auto.nomorUrut;
    const tahun = editingSurat ? editingSurat.tahun : auto.tahun;

    const newSurat: SuratKeluar = editingSurat
      ? {
          ...editingSurat,
          noSurat: finalNoSurat,
          tujuanSurat: tujuanSurat.trim(),
          tanggalSurat,
          kategoriId,
          sifatSurat,
          perihal: perihal.trim(),
          isiSurat: isiSurat.trim(),
          lampiranInfo: lampiranInfo.trim() || '-',
          updatedAt: now,
        }
      : {
          id: `sk-${Date.now()}`,
          noSurat: finalNoSurat,
          tujuanSurat: tujuanSurat.trim(),
          tanggalSurat,
          kategoriId,
          sifatSurat,
          perihal: perihal.trim(),
          isiSurat: isiSurat.trim(),
          lampiranInfo: lampiranInfo.trim() || '-',
          nomorUrut,
          tahun,
          status: 'DRAF',
          createdAt: now,
          updatedAt: now,
        };

    onSaveSurat(newSurat);
    setIsFormOpen(false);
    resetForm();
  };

  // Staf TU: Ajukan ke Pimpinan
  const handleSubmitToPimpinan = (surat: SuratKeluar) => {
    const updated: SuratKeluar = {
      ...surat,
      status: 'MENUNGGU_PERSETUJUAN',
      updatedAt: new Date().toISOString(),
    };
    onSaveSurat(updated);
    setConfirmSubmitSurat(null);
  };

  // Pimpinan: Open approval modal
  const handleOpenApprovalModal = (surat: SuratKeluar) => {
    setSuratForApproval(surat);
    setCatatanPimpinan(surat.catatanPimpinan || '');
    setApprovalError('');
    setIsApprovalOpen(true);
  };

  const handleApprove = () => {
    if (!suratForApproval) return;
    const now = new Date();
    const updated: SuratKeluar = {
      ...suratForApproval,
      status: 'DISETUJUI',
      disetujuiOleh: user.name,
      tanggalPersetujuan: now.toISOString().slice(0, 10),
      catatanPimpinan: catatanPimpinan.trim() || 'Disetujui tanpa catatan revisi.',
      updatedAt: now.toISOString(),
    };
    onSaveSurat(updated);
    setIsApprovalOpen(false);
    setSuratForApproval(null);
    if (detailSurat?.id === suratForApproval.id) {
      setDetailSurat(updated);
    }
  };

  const handleReject = () => {
    if (!suratForApproval) return;
    if (!catatanPimpinan.trim()) {
      setApprovalError('Harap cantumkan alasan atau arahan perbaikan sebelum menolak surat.');
      return;
    }
    const now = new Date();
    const updated: SuratKeluar = {
      ...suratForApproval,
      status: 'DITOLAK',
      catatanPimpinan: catatanPimpinan.trim(),
      updatedAt: now.toISOString(),
    };
    onSaveSurat(updated);
    setIsApprovalOpen(false);
    setSuratForApproval(null);
    if (detailSurat?.id === suratForApproval.id) {
      setDetailSurat(updated);
    }
  };

  // Arsipkan
  const handleArchiveSurat = (surat: SuratKeluar) => {
    const now = new Date().toISOString();
    const updated: SuratKeluar = {
      ...surat,
      status: 'TERARSIP',
      arsipAt: now,
      updatedAt: now,
    };
    onSaveSurat(updated);
    setConfirmArchiveSurat(null);
    if (detailSurat?.id === surat.id) {
      setDetailSurat(updated);
    }
  };

  // Filter
  const filteredList = suratList.filter(item => {
    const matchesSearch =
      item.noSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tujuanSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || item.kategoriId === selectedCategory;

    const matchesStatus =
      selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'Surat Dinas';
  };

  const renderStatusBadge = (status: StatusSuratKeluar) => {
    switch (status) {
      case 'DRAF':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700 border border-slate-200">Draf</span>;
      case 'MENUNGGU_PERSETUJUAN':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-800 border border-amber-200">Menunggu Persetujuan</span>;
      case 'DISETUJUI':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-100 text-emerald-800 border border-emerald-200">Disetujui / Siap Cetak</span>;
      case 'DITOLAK':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800 border border-red-200">Perlu Revisi</span>;
      case 'TERARSIP':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-200 text-slate-800 border border-slate-300">Terarsip</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Surat Keluar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pembuatan surat keluar resmi dengan penomoran otomatis, verifikasi persetujuan Pimpinan, cetak berkas, dan pengarsipan.
          </p>
        </div>

        {/* Action: TU or Admin */}
        {(user.role === 'tu' || user.role === 'admin') && (
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Surat Keluar</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari nomor surat keluar, pihak tujuan, atau perihal..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Kategori:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
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

          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="py-1 px-2.5 text-xs bg-white border border-slate-300 rounded text-slate-700 focus:outline-none focus:border-blue-900"
            >
              <option value="ALL">Semua Status</option>
              <option value="DRAF">Draf</option>
              <option value="MENUNGGU_PERSETUJUAN">Menunggu Persetujuan</option>
              <option value="DISETUJUI">Disetujui / Siap Cetak</option>
              <option value="DITOLAK">Perlu Revisi</option>
              <option value="TERARSIP">Terarsip</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3">Nomor Surat</th>
                <th className="px-4 py-3">Tujuan & Tanggal</th>
                <th className="px-4 py-3">Perihal & Sifat</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Tidak ada data surat keluar yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((surat, index) => (
                  <tr key={surat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 font-mono">
                      {surat.noSurat}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{surat.tujuanSurat}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Tgl Surat: {surat.tanggalSurat}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <div className="text-slate-700 line-clamp-2 leading-relaxed">
                        {surat.perihal}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Sifat: <span className="font-medium text-slate-600">{surat.sifatSurat}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {getCategoryName(surat.kategoriId)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderStatusBadge(surat.status)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      {/* Detail button */}
                      <button
                        onClick={() => setDetailSurat(surat)}
                        title="Lihat Detail Naskah"
                        className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Staf TU: Ajukan ke Pimpinan (if Draf or Ditolak) */}
                      {(user.role === 'tu' || user.role === 'admin') && 
                        (surat.status === 'DRAF' || surat.status === 'DITOLAK') && (
                        <button
                          onClick={() => setConfirmSubmitSurat(surat)}
                          title="Ajukan ke Pimpinan untuk Persetujuan"
                          className="px-2 py-1 bg-blue-900 hover:bg-blue-950 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          Ajukan
                        </button>
                      )}

                      {/* Pimpinan: Verifikasi / Setujui / Tolak */}
                      {(user.role === 'pimpinan' || user.role === 'admin') && 
                        surat.status === 'MENUNGGU_PERSETUJUAN' && (
                        <button
                          onClick={() => handleOpenApprovalModal(surat)}
                          title="Tinjau & Setujui Surat"
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold transition-colors"
                        >
                          Verifikasi
                        </button>
                      )}

                      {/* Staf TU: Cetak Surat (hanya jika DISETUJUI atau TERARSIP) */}
                      {(surat.status === 'DISETUJUI' || surat.status === 'TERARSIP') && (
                        <button
                          onClick={() => onOpenPrintLetter(surat)}
                          title="Cetak Surat Resmi (Kop Surat)"
                          className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Cetak</span>
                        </button>
                      )}

                      {/* Arsipkan (Staf TU / Admin, setelah Disetujui) */}
                      {(user.role === 'tu' || user.role === 'admin') && surat.status === 'DISETUJUI' && (
                        <button
                          onClick={() => setConfirmArchiveSurat(surat)}
                          title="Selesai dicetak, pindahkan ke arsip"
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          Arsipkan
                        </button>
                      )}

                      {/* Edit (TU / Admin, saat Draf atau Ditolak) */}
                      {(user.role === 'tu' || user.role === 'admin') && 
                        (surat.status === 'DRAF' || surat.status === 'DITOLAK') && (
                        <button
                          onClick={() => handleOpenEdit(surat)}
                          title="Edit Surat"
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Hapus (Admin or TU saat Draf) */}
                      {(user.role === 'admin' || (user.role === 'tu' && surat.status === 'DRAF')) && (
                        <button
                          onClick={() => setConfirmDeleteId(surat.id)}
                          title="Hapus Surat"
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
          <span>Menampilkan {filteredList.length} dari {suratList.length} surat keluar</span>
          <span className="font-mono">Penomoran Otomatis Aktif</span>
        </div>
      </div>

      {/* MODAL: Buat / Edit Surat Keluar */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-2xl my-6 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                {editingSurat ? 'Edit Surat Keluar' : 'Buat Surat Keluar Baru'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                  {formError}
                </div>
              )}

              {/* Automatic Number Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    Nomor Surat Keluar
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isManualNumber}
                      onChange={e => setIsManualNumber(e.target.checked)}
                      className="rounded border-slate-300 text-blue-900"
                    />
                    <span>Ubah Manual</span>
                  </label>
                </div>

                {isManualNumber ? (
                  <input
                    type="text"
                    value={manualNoSurat}
                    onChange={e => setManualNoSurat(e.target.value)}
                    placeholder="Contoh: 005/UKM-TU/UND/X/2026"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono text-slate-800 focus:outline-none focus:border-blue-900"
                  />
                ) : (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs text-blue-900 font-semibold">
                    <span>
                      {editingSurat 
                        ? editingSurat.noSurat 
                        : getAutoNumberPreview(kategoriId, tanggalSurat).noSurat}
                    </span>
                    <span className="text-[11px] font-sans font-normal text-slate-500">
                      (Generated Otomatis)
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tujuan Surat (Kepada Yth) *
                  </label>
                  <input
                    type="text"
                    required
                    value={tujuanSurat}
                    onChange={e => setTujuanSurat(e.target.value)}
                    placeholder="Contoh: Seluruh Dosen dan Tenaga Kependidikan"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Surat *
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalSurat}
                    onChange={e => setTanggalSurat(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Surat *
                  </label>
                  <select
                    value={kategoriId}
                    onChange={e => setKategoriId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sifat Surat *
                  </label>
                  <select
                    value={sifatSurat}
                    onChange={e => setSifatSurat(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Segera">Segera</option>
                    <option value="Rahasia">Rahasia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lampiran Berkas
                  </label>
                  <input
                    type="text"
                    value={lampiranInfo}
                    onChange={e => setLampiranInfo(e.target.value)}
                    placeholder="Contoh: 1 Berkas / -"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perihal / Hal Surat *
                </label>
                <input
                  type="text"
                  required
                  value={perihal}
                  onChange={e => setPerihal(e.target.value)}
                  placeholder="Contoh: Undangan Rapat Kerja Akademik Semester Genap"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Pokok Surat *
                </label>
                <textarea
                  required
                  rows={5}
                  value={isiSurat}
                  onChange={e => setIsiSurat(e.target.value)}
                  placeholder="Ketikkan teks naskah surat resmi yang akan dicetak di bawah kop surat..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900 leading-relaxed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Salam pembuka dan salam penutup akan otomatis diformat rapi saat dicetak.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded transition-colors shadow-sm cursor-pointer"
                >
                  {editingSurat ? 'Simpan Perubahan' : 'Simpan Draf Surat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Verifikasi & Persetujuan Pimpinan */}
      {isApprovalOpen && suratForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-xl my-6 overflow-hidden">
            <div className="px-5 py-3.5 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  Tinjauan Persetujuan Pimpinan Rektorat
                </h2>
                <p className="text-[11px] text-blue-200">
                  Surat Keluar No. {suratForApproval.noSurat}
                </p>
              </div>
              <button
                onClick={() => setIsApprovalOpen(false)}
                className="text-white hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Review summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                <div>
                  <span className="font-semibold text-slate-600">Tujuan:</span>{' '}
                  <span className="text-slate-900 font-medium">{suratForApproval.tujuanSurat}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Perihal:</span>{' '}
                  <span className="text-slate-900">{suratForApproval.perihal}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Isi Ringkas:</span>
                  <div className="mt-1 p-2 bg-white border border-slate-200 rounded italic text-slate-700 max-h-32 overflow-y-auto">
                    {suratForApproval.isiSurat}
                  </div>
                </div>
              </div>

              {approvalError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                  {approvalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan / Instruksi Rektor (Wajib diisi jika menolak)
                </label>
                <textarea
                  rows={2}
                  value={catatanPimpinan}
                  onChange={e => setCatatanPimpinan(e.target.value)}
                  placeholder="Contoh: Disetujui. / Perbaiki tanggal dan lampirkan rincian anggaran..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsApprovalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                >
                  Tutup
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReject}
                    className="px-3.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Tolak & Minta Revisi</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Setujui Surat Keluar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detail Surat Keluar */}
      {detailSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-xl my-6 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-900" />
                <h2 className="text-sm font-semibold text-slate-800">
                  Detail Surat Keluar
                </h2>
              </div>
              <button
                onClick={() => {
                  setDetailSurat(null);
                  if (onClearDetailSelection) onClearDetailSelection();
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Nomor Surat:</span>
                  <span className="font-semibold text-slate-900 font-mono text-sm">
                    {detailSurat.noSurat}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status Persetujuan:</span>
                  <div className="mt-0.5">{renderStatusBadge(detailSurat.status)}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pihak Tujuan:</span>
                  <span className="font-medium text-slate-800">{detailSurat.tujuanSurat}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Kategori / Sifat:</span>
                  <span className="font-medium text-slate-800">
                    {getCategoryName(detailSurat.kategoriId)} &bull; {detailSurat.sifatSurat}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tanggal Surat:</span>
                  <span className="text-slate-700">{detailSurat.tanggalSurat}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Lampiran:</span>
                  <span className="text-slate-700">{detailSurat.lampiranInfo || '-'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Perihal:</span>
                <div className="font-semibold text-slate-800 text-sm">
                  {detailSurat.perihal}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Isi Surat:</span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {detailSurat.isiSurat}
                </div>
              </div>

              {/* Status Persetujuan & Catatan Pimpinan */}
              {detailSurat.catatanPimpinan && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-semibold text-blue-900 text-xs mb-1">
                    Catatan Pimpinan Rektorat:
                  </div>
                  <div className="italic text-blue-950 text-xs">
                    "{detailSurat.catatanPimpinan}"
                  </div>
                  {detailSurat.disetujuiOleh && (
                    <div className="text-[11px] text-blue-800 mt-1">
                      Oleh: {detailSurat.disetujuiOleh} ({detailSurat.tanggalPersetujuan})
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <div>
                  {(detailSurat.status === 'DISETUJUI' || detailSurat.status === 'TERARSIP') && (
                    <button
                      onClick={() => onOpenPrintLetter(detailSurat)}
                      className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Format Kop Resmi</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(user.role === 'tu' || user.role === 'admin') && 
                    detailSurat.status === 'DISETUJUI' && (
                    <button
                      onClick={() => handleArchiveSurat(detailSurat)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Arsipkan</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setDetailSurat(null);
                      if (onClearDetailSelection) onClearDetailSelection();
                    }}
                    className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation: Submit to Pimpinan */}
      <ConfirmModal
        isOpen={Boolean(confirmSubmitSurat)}
        title="Ajukan Surat Keluar ke Pimpinan"
        message={`Apakah Anda yakin ingin mengajukan Surat Keluar No. "${confirmSubmitSurat?.noSurat}" kepada Rektor / Pimpinan untuk persetujuan resmi?`}
        confirmLabel="Ya, Ajukan Sekarang"
        cancelLabel="Batal"
        onConfirm={() => confirmSubmitSurat && handleSubmitToPimpinan(confirmSubmitSurat)}
        onCancel={() => setConfirmSubmitSurat(null)}
      />

      {/* Confirmation: Archive */}
      <ConfirmModal
        isOpen={Boolean(confirmArchiveSurat)}
        title="Arsipkan Surat Keluar"
        message={`Surat Keluar No. "${confirmArchiveSurat?.noSurat}" yang telah disetujui dan dicetak akan dipindahkan ke buku arsip permanen. Lanjutkan?`}
        confirmLabel="Ya, Arsipkan"
        cancelLabel="Batal"
        onConfirm={() => confirmArchiveSurat && handleArchiveSurat(confirmArchiveSurat)}
        onCancel={() => setConfirmArchiveSurat(null)}
      />

      {/* Confirmation: Delete */}
      <ConfirmModal
        isOpen={Boolean(confirmDeleteId)}
        title="Hapus Surat Keluar"
        message="Apakah Anda yakin ingin menghapus draf surat keluar ini? Data yang terhapus tidak dapat dipulihkan kembali."
        confirmLabel="Hapus Surat"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={() => {
          if (confirmDeleteId) {
            onDeleteSurat(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
