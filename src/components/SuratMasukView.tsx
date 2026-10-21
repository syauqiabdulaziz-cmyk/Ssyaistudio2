import React, { useState } from 'react';
import { SuratMasuk, Category, User, DisposisiData, StatusSuratMasuk } from '../types';
import { 
  Plus, 
  Search, 
  Paperclip, 
  FileText, 
  Printer, 
  Send, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Eye, 
  Archive,
  X
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface SuratMasukViewProps {
  user: User;
  suratList: SuratMasuk[];
  categories: Category[];
  onSaveSurat: (surat: SuratMasuk) => void;
  onDeleteSurat: (id: string) => void;
  onOpenPrintDisposisi: (surat: SuratMasuk) => void;
  selectedSuratForDetail?: SuratMasuk | null;
  onClearDetailSelection?: () => void;
}

const PEJABAT_KAMPUS = [
  'Wakil Rektor I (Bidang Akademik & Riset)',
  'Wakil Rektor II (Bidang Administrasi Umum & Keuangan)',
  'Wakil Rektor III (Bidang Kemahasiswaan & Kerjasama)',
  'Dekan Fakultas Ilmu Komputer',
  'Dekan Fakultas Bisnis & Manajemen',
  'Kepala BAAK (Biro Administrasi Akademik & Kemahasiswaan)',
  'Kepala BAU (Biro Administrasi Umum)',
  'Kepala LPPM (Lembaga Penelitian & Pengabdian Masyarakat)',
  'Kepala BPM (Badan Penjaminan Mutu)',
  'Kepala UPT Perpustakaan & Laboratorium',
];

const OPSI_INSTRUKSI = [
  'Tindak lanjuti',
  'Pelajari & laporkan',
  'Hadiri / Wakili',
  'Arsipkan',
  'Siapkan bahan / tanggapan',
  'Koordinasikan dengan unit terkait',
];

export const SuratMasukView: React.FC<SuratMasukViewProps> = ({
  user,
  suratList,
  categories,
  onSaveSurat,
  onDeleteSurat,
  onOpenPrintDisposisi,
  selectedSuratForDetail,
  onClearDetailSelection,
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<SuratMasuk | null>(null);

  const [isDisposisiOpen, setIsDisposisiOpen] = useState(false);
  const [suratForDisposisi, setSuratForDisposisi] = useState<SuratMasuk | null>(null);

  const [detailSurat, setDetailSurat] = useState<SuratMasuk | null>(selectedSuratForDetail || null);

  // Confirmation modals
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmForwardSurat, setConfirmForwardSurat] = useState<SuratMasuk | null>(null);
  const [confirmArchiveSurat, setConfirmArchiveSurat] = useState<SuratMasuk | null>(null);

  // Form inputs
  const [noSurat, setNoSurat] = useState('');
  const [asalSurat, setAsalSurat] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState('');
  const [tanggalTerima, setTanggalTerima] = useState('');
  const [perihal, setPerihal] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [lampiranName, setLampiranName] = useState('');
  const [lampiranSize, setLampiranSize] = useState('');
  const [formError, setFormError] = useState('');

  // Disposisi inputs
  const [disposisiTujuan, setDisposisiTujuan] = useState('');
  const [disposisiInstruksi, setDisposisiInstruksi] = useState<string[]>([]);
  const [disposisiCatatan, setDisposisiCatatan] = useState('');
  const [disposisiError, setDisposisiError] = useState('');

  // Handle external selection prop change
  React.useEffect(() => {
    if (selectedSuratForDetail) {
      setDetailSurat(selectedSuratForDetail);
    }
  }, [selectedSuratForDetail]);

  const resetForm = () => {
    setEditingSurat(null);
    setNoSurat('');
    setAsalSurat('');
    setTanggalSurat(new Date().toISOString().slice(0, 10));
    setTanggalTerima(new Date().toISOString().slice(0, 10));
    setPerihal('');
    setKategoriId(categories[0]?.id || '');
    setLampiranName('');
    setLampiranSize('');
    setFormError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (surat: SuratMasuk) => {
    setEditingSurat(surat);
    setNoSurat(surat.noSurat);
    setAsalSurat(surat.asalSurat);
    setTanggalSurat(surat.tanggalSurat);
    setTanggalTerima(surat.tanggalTerima);
    setPerihal(surat.perihal);
    setKategoriId(surat.kategoriId);
    setLampiranName(surat.lampiranName || '');
    setLampiranSize(surat.lampiranSize || '');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLampiranName(file.name);
      const sizeKb = Math.round(file.size / 1024);
      setLampiranSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noSurat.trim() || !asalSurat.trim() || !perihal.trim() || !tanggalSurat) {
      setFormError('Harap lengkapi semua kolom wajib.');
      return;
    }

    const now = new Date().toISOString();
    const newSurat: SuratMasuk = editingSurat
      ? {
          ...editingSurat,
          noSurat: noSurat.trim(),
          asalSurat: asalSurat.trim(),
          tanggalSurat,
          tanggalTerima: tanggalTerima || tanggalSurat,
          perihal: perihal.trim(),
          kategoriId: kategoriId || categories[0]?.id || 'cat-1',
          lampiranName: lampiranName || undefined,
          lampiranSize: lampiranSize || undefined,
          updatedAt: now,
        }
      : {
          id: `sm-${Date.now()}`,
          noSurat: noSurat.trim(),
          asalSurat: asalSurat.trim(),
          tanggalSurat,
          tanggalTerima: tanggalTerima || tanggalSurat,
          perihal: perihal.trim(),
          kategoriId: kategoriId || categories[0]?.id || 'cat-1',
          lampiranName: lampiranName || undefined,
          lampiranSize: lampiranSize || undefined,
          status: 'DRAF',
          createdAt: now,
          updatedAt: now,
        };

    onSaveSurat(newSurat);
    setIsFormOpen(false);
    resetForm();
  };

  // Open Disposisi modal (for Pimpinan)
  const handleOpenDisposisi = (surat: SuratMasuk) => {
    setSuratForDisposisi(surat);
    setDisposisiTujuan(surat.disposisi?.tujuan || PEJABAT_KAMPUS[0]);
    setDisposisiInstruksi(surat.disposisi?.instruksi || ['Tindak lanjuti']);
    setDisposisiCatatan(surat.disposisi?.catatan || '');
    setDisposisiError('');
    setIsDisposisiOpen(true);
  };

  const handleToggleInstruksi = (inst: string) => {
    if (disposisiInstruksi.includes(inst)) {
      setDisposisiInstruksi(disposisiInstruksi.filter(i => i !== inst));
    } else {
      setDisposisiInstruksi([...disposisiInstruksi, inst]);
    }
  };

  const handleSaveDisposisi = () => {
    if (!suratForDisposisi) return;
    if (!disposisiTujuan.trim()) {
      setDisposisiError('Harap tentukan pejabat penerima disposisi.');
      return;
    }
    if (disposisiInstruksi.length === 0) {
      setDisposisiError('Harap centang minimal satu instruksi.');
      return;
    }

    const disposisiData: DisposisiData = {
      tujuan: disposisiTujuan,
      instruksi: disposisiInstruksi,
      catatan: disposisiCatatan,
      tanggalDisposisi: new Date().toISOString().slice(0, 10),
      oleh: user.name,
    };

    const updated: SuratMasuk = {
      ...suratForDisposisi,
      status: 'SUDAH_DISPOSISI',
      disposisi: disposisiData,
      updatedAt: new Date().toISOString(),
    };

    onSaveSurat(updated);
    setIsDisposisiOpen(false);
    setSuratForDisposisi(null);
  };

  // Staf TU: Teruskan ke Pimpinan
  const handleForwardToPimpinan = (surat: SuratMasuk) => {
    const updated: SuratMasuk = {
      ...surat,
      status: 'MENUNGGU_DISPOSISI',
      updatedAt: new Date().toISOString(),
    };
    onSaveSurat(updated);
    setConfirmForwardSurat(null);
  };

  // Arsipkan Surat
  const handleArchiveSurat = (surat: SuratMasuk) => {
    const updated: SuratMasuk = {
      ...surat,
      status: 'TERARSIP',
      arsipAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveSurat(updated);
    setConfirmArchiveSurat(null);
    if (detailSurat?.id === surat.id) {
      setDetailSurat(updated);
    }
  };

  // Filtered List
  const filteredList = suratList.filter(item => {
    const matchesSearch =
      item.noSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asalSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || item.kategoriId === selectedCategory;

    const matchesStatus =
      selectedStatus === 'ALL' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || 'Umum';
  };

  const renderStatusBadge = (status: StatusSuratMasuk) => {
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

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Surat Masuk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan surat masuk institusi, penerusan ke Pimpinan, dan lembar disposisi.
          </p>
        </div>

        {/* Action button: TU or Admin can add */}
        {(user.role === 'tu' || user.role === 'admin') && (
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Surat Masuk</span>
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
            placeholder="Cari nomor surat, instansi asal, atau perihal..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
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
              <option value="DRAF">Draf TU</option>
              <option value="MENUNGGU_DISPOSISI">Menunggu Disposisi</option>
              <option value="SUDAH_DISPOSISI">Sudah Disposisi</option>
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
                <th className="px-4 py-3">Asal Surat & Tanggal</th>
                <th className="px-4 py-3">Perihal</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Lampiran</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                    Tidak ada data surat masuk yang sesuai filter.
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
                      <div className="font-medium text-slate-800">{surat.asalSurat}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Tgl Surat: {surat.tanggalSurat} | Diterima: {surat.tanggalTerima}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <div className="text-slate-700 line-clamp-2 leading-relaxed">
                        {surat.perihal}
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
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {surat.lampiranName ? (
                        <span 
                          title={`${surat.lampiranName} (${surat.lampiranSize || ''})`} 
                          className="inline-flex items-center gap-1 text-[11px] text-blue-900 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>File</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      {/* Detail button */}
                      <button
                        onClick={() => setDetailSurat(surat)}
                        title="Lihat Detail & Disposisi"
                        className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Staf TU: Teruskan ke Pimpinan button */}
                      {(user.role === 'tu' || user.role === 'admin') && surat.status === 'DRAF' && (
                        <button
                          onClick={() => setConfirmForwardSurat(surat)}
                          title="Teruskan ke Pimpinan"
                          className="px-2 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          Teruskan
                        </button>
                      )}

                      {/* Pimpinan: Beri Disposisi button */}
                      {(user.role === 'pimpinan' || user.role === 'admin') && (
                        <button
                          onClick={() => handleOpenDisposisi(surat)}
                          title="Beri Disposisi"
                          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                            surat.status === 'MENUNGGU_DISPOSISI'
                              ? 'bg-blue-900 hover:bg-blue-950 text-white font-semibold'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {surat.disposisi ? 'Ubah Disposisi' : 'Disposisi'}
                        </button>
                      )}

                      {/* Cetak Disposisi (if disposisi exists) */}
                      {surat.disposisi && (
                        <button
                          onClick={() => onOpenPrintDisposisi(surat)}
                          title="Cetak Lembar Disposisi"
                          className="p-1 text-slate-700 hover:text-blue-900 hover:bg-blue-50 rounded border border-slate-200 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Arsipkan (Staf TU / Admin, when already disposed) */}
                      {(user.role === 'tu' || user.role === 'admin') && 
                        (surat.status === 'SUDAH_DISPOSISI' || surat.status === 'SELESAI') && (
                        <button
                          onClick={() => setConfirmArchiveSurat(surat)}
                          title="Pindahkan ke Arsip"
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          Arsipkan
                        </button>
                      )}

                      {/* Edit (TU/Admin, only before archived) */}
                      {(user.role === 'tu' || user.role === 'admin') && surat.status !== 'TERARSIP' && (
                        <button
                          onClick={() => handleOpenEdit(surat)}
                          title="Edit Surat"
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Hapus (Admin or TU if Draf) */}
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
          <span>Menampilkan {filteredList.length} dari {suratList.length} surat masuk</span>
          <span className="font-mono">SIMAMAT &bull; Universitas Komputama</span>
        </div>
      </div>

      {/* MODAL: Tambah / Edit Surat Masuk */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-xl my-6 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                {editingSurat ? 'Edit Surat Masuk' : 'Tambah Surat Masuk Baru'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-3.5">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Surat Asal *
                  </label>
                  <input
                    type="text"
                    required
                    value={noSurat}
                    onChange={e => setNoSurat(e.target.value)}
                    placeholder="Contoh: 420/LLDIKTI6/TU/2026"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instansi / Pengirim Asal *
                  </label>
                  <input
                    type="text"
                    required
                    value={asalSurat}
                    onChange={e => setAsalSurat(e.target.value)}
                    placeholder="Contoh: LLDIKTI Wilayah VI Jateng"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Diterima TU *
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggalTerima}
                    onChange={e => setTanggalTerima(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  />
                </div>

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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Perihal / Hal Surat *
                </label>
                <textarea
                  required
                  rows={2}
                  value={perihal}
                  onChange={e => setPerihal(e.target.value)}
                  placeholder="Ringkasan perihal isi surat..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                />
              </div>

              {/* Upload Lampiran */}
              <div className="border border-slate-200 rounded p-3 bg-slate-50">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Lampiran Berkas (PDF / Scan Surat)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-slate-300 file:text-xs file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                  />
                  {lampiranName && (
                    <div className="text-xs text-slate-700 font-mono flex items-center gap-1">
                      <span className="font-semibold">{lampiranName}</span>
                      <span className="text-slate-400">({lampiranSize})</span>
                    </div>
                  )}
                </div>
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
                  {editingSurat ? 'Simpan Perubahan' : 'Simpan Surat Masuk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Beri Disposisi Pimpinan */}
      {isDisposisiOpen && suratForDisposisi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-lg my-6 overflow-hidden">
            <div className="px-5 py-3.5 bg-blue-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  Disposisi Pimpinan Rektorat
                </h2>
                <p className="text-[11px] text-blue-200">
                  Surat Masuk: {suratForDisposisi.noSurat}
                </p>
              </div>
              <button
                onClick={() => setIsDisposisiOpen(false)}
                className="text-white hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Ringkasan Surat */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <div><span className="font-semibold text-slate-700">Pengirim:</span> {suratForDisposisi.asalSurat}</div>
                <div><span className="font-semibold text-slate-700">Perihal:</span> {suratForDisposisi.perihal}</div>
              </div>

              {disposisiError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                  {disposisiError}
                </div>
              )}

              {/* Diteruskan Kepada */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diteruskan Kepada Yth (Tujuan Disposisi) *
                </label>
                <select
                  value={disposisiTujuan}
                  onChange={e => setDisposisiTujuan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                >
                  {PEJABAT_KAMPUS.map((jabatan, i) => (
                    <option key={i} value={jabatan}>
                      {jabatan}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instruksi Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Instruksi / Disposisi (Bisa pilih lebih dari satu) *
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {OPSI_INSTRUKSI.map((inst, i) => (
                    <label key={i} className="flex items-center gap-2 p-1.5 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disposisiInstruksi.includes(inst)}
                        onChange={() => handleToggleInstruksi(inst)}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                      />
                      <span className="text-slate-800 text-[11px]">{inst}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Catatan Tambahan Pimpinan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan Pimpinan
                </label>
                <textarea
                  rows={3}
                  value={disposisiCatatan}
                  onChange={e => setDisposisiCatatan(e.target.value)}
                  placeholder="Tambahkan arahan atau catatan khusus bila diperlukan..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDisposisiOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveDisposisi}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 rounded transition-colors shadow-sm cursor-pointer"
                >
                  Simpan & Teruskan Disposisi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detail Surat Masuk */}
      {detailSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-xl my-6 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-900" />
                <h2 className="text-sm font-semibold text-slate-800">
                  Detail Surat Masuk
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
                  <span className="text-slate-400 block text-[11px]">Status Dokumen:</span>
                  <div className="mt-0.5">{renderStatusBadge(detailSurat.status)}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pengirim / Asal Surat:</span>
                  <span className="font-medium text-slate-800">{detailSurat.asalSurat}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Kategori Klasifikasi:</span>
                  <span className="font-medium text-slate-800">{getCategoryName(detailSurat.kategoriId)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tanggal Surat:</span>
                  <span className="text-slate-700">{detailSurat.tanggalSurat}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tanggal Diterima TU:</span>
                  <span className="text-slate-700">{detailSurat.tanggalTerima}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Perihal:</span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 leading-relaxed">
                  {detailSurat.perihal}
                </div>
              </div>

              {detailSurat.lampiranName && (
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Berkas Lampiran:</span>
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded flex items-center justify-between text-blue-950">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-blue-900" />
                      <span className="font-semibold font-mono">{detailSurat.lampiranName}</span>
                      <span className="text-xs text-blue-700">({detailSurat.lampiranSize})</span>
                    </div>
                    <span className="text-[11px] text-blue-800 font-medium bg-white px-2 py-0.5 rounded border border-blue-200">
                      Tersimpan di Arsip
                    </span>
                  </div>
                </div>
              )}

              {/* Info Disposisi */}
              <div className="border border-slate-200 rounded p-3.5 bg-slate-50 space-y-2">
                <div className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>Lembar Disposisi Rektor</span>
                  {detailSurat.disposisi ? (
                    <span className="text-[11px] text-blue-800 font-normal">
                      Oleh: {detailSurat.disposisi.oleh} ({detailSurat.disposisi.tanggalDisposisi})
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-700 font-normal">
                      Belum didisposisikan
                    </span>
                  )}
                </div>

                {detailSurat.disposisi ? (
                  <div className="space-y-1.5 text-[11px] pt-1">
                    <div>
                      <span className="font-medium text-slate-600">Diteruskan Kepada: </span>
                      <span className="font-bold text-slate-900">{detailSurat.disposisi.tujuan}</span>
                    </div>
                    <div>
                      <span className="font-medium text-slate-600">Instruksi: </span>
                      <span className="text-slate-800 font-medium">
                        {detailSurat.disposisi.instruksi.join(', ')}
                      </span>
                    </div>
                    {detailSurat.disposisi.catatan && (
                      <div className="p-2 bg-white rounded border border-slate-200 italic text-slate-700">
                        "{detailSurat.disposisi.catatan}"
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-[11px] italic">
                    Menunggu Pimpinan memberikan instruksi disposisi surat ini.
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <div>
                  {detailSurat.disposisi && (
                    <button
                      onClick={() => onOpenPrintDisposisi(detailSurat)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Lembar Disposisi</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(user.role === 'tu' || user.role === 'admin') && 
                    detailSurat.status !== 'TERARSIP' && 
                    detailSurat.disposisi && (
                    <button
                      onClick={() => handleArchiveSurat(detailSurat)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Arsipkan Sekarang</span>
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

      {/* Confirmation: Forward to Pimpinan */}
      <ConfirmModal
        isOpen={Boolean(confirmForwardSurat)}
        title="Teruskan Surat ke Pimpinan"
        message={`Apakah Anda yakin ingin meneruskan Surat Masuk No. "${confirmForwardSurat?.noSurat}" kepada Pimpinan Rektorat untuk mendapatkan disposisi?`}
        confirmLabel="Ya, Teruskan Sekarang"
        cancelLabel="Batal"
        onConfirm={() => confirmForwardSurat && handleForwardToPimpinan(confirmForwardSurat)}
        onCancel={() => setConfirmForwardSurat(null)}
      />

      {/* Confirmation: Archive */}
      <ConfirmModal
        isOpen={Boolean(confirmArchiveSurat)}
        title="Arsipkan Surat Masuk"
        message={`Surat Masuk No. "${confirmArchiveSurat?.noSurat}" yang telah selesai didisposisikan akan dipindahkan ke buku arsip permanen. Lanjutkan?`}
        confirmLabel="Ya, Arsipkan"
        cancelLabel="Batal"
        onConfirm={() => confirmArchiveSurat && handleArchiveSurat(confirmArchiveSurat)}
        onCancel={() => setConfirmArchiveSurat(null)}
      />

      {/* Confirmation: Delete */}
      <ConfirmModal
        isOpen={Boolean(confirmDeleteId)}
        title="Hapus Surat Masuk"
        message="Apakah Anda yakin ingin menghapus data surat masuk ini? Data yang terhapus tidak dapat dikembalikan."
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
