import React, { useState } from 'react';
import { Category, SuratMasuk, SuratKeluar } from '../types';
import { 
  Tags, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Search,
  FileText
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface KelolaKategoriViewProps {
  categories: Category[];
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  onSaveCategory: (cat: Category) => void;
  onDeleteCategory: (catId: string) => void;
}

export const KelolaKategoriView: React.FC<KelolaKategoriViewProps> = ({
  categories,
  suratMasukList,
  suratKeluarList,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setEditingCat(null);
    setCode('');
    setName('');
    setDescription('');
    setFormError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setCode(cat.code);
    setName(cat.name);
    setDescription(cat.description);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setFormError('Kode Kategori dan Nama Kategori wajib diisi.');
      return;
    }

    const cleanCode = code.trim().toUpperCase();
    const duplicate = categories.find(
      c => c.code.toUpperCase() === cleanCode && c.id !== editingCat?.id
    );
    if (duplicate) {
      setFormError(`Kode kategori "${cleanCode}" sudah digunakan.`);
      return;
    }

    const saved: Category = editingCat
      ? {
          ...editingCat,
          code: cleanCode,
          name: name.trim(),
          description: description.trim(),
        }
      : {
          id: `cat-${Date.now()}`,
          code: cleanCode,
          name: name.trim(),
          description: description.trim(),
        };

    onSaveCategory(saved);
    setIsFormOpen(false);
    resetForm();
  };

  const getUsageCount = (catId: string) => {
    const masuk = suratMasukList.filter(s => s.kategoriId === catId).length;
    const keluar = suratKeluarList.filter(s => s.kategoriId === catId).length;
    return { masuk, keluar, total: masuk + keluar };
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Klasifikasi & Kategori Surat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola jenis kategori surat resmi (undangan, edaran, permohonan, SK, surat tugas) dan kode penomoran otomatis.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-3.5 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari kode atau nama kategori surat..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-colors"
          />
        </div>
        <div className="text-xs text-slate-500">
          Total: <span className="font-semibold text-slate-800">{categories.length} Kategori</span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3 w-28">Kode Surat</th>
                <th className="px-4 py-3">Nama Kategori</th>
                <th className="px-4 py-3">Deskripsi / Peruntukan</th>
                <th className="px-4 py-3 text-center">Penggunaan Arsip</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((cat, index) => {
                const usage = getUsageCount(cat.id);
                return (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                        {cat.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-sm">
                      {cat.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {usage.total} Dokumen ({usage.masuk} Masuk, {usage.keluar} Keluar)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        title="Edit Kategori"
                        className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setConfirmDeleteId(cat.id)}
                        title="Hapus Kategori"
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah / Edit Kategori */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-md my-6 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                {editingCat ? 'Edit Kategori Surat' : 'Tambah Kategori Surat'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-3.5">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Singkatan Surat (Untuk Penomoran) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: UND, ED, PMH, SK, ST"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900 font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Akan dimasukkan ke format nomor surat keluar otomatis: .../UKM-TU/[KODE]/...
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kategori Surat *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Surat Undangan Rapat Dinas"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi / Keterangan Peruntukan
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Keterangan singkat jenis surat ini..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                />
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
                  {editingCat ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Delete Category */}
      <ConfirmModal
        isOpen={Boolean(confirmDeleteId)}
        title="Hapus Kategori Surat"
        message="Apakah Anda yakin ingin menghapus kategori surat ini? Surat yang sudah terdaftar dengan kategori ini tetap tersimpan namun klasifikasinya akan menjadi umum."
        confirmLabel="Hapus Kategori"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={() => {
          if (confirmDeleteId) {
            onDeleteCategory(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
