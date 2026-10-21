import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  X, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface KelolaUserViewProps {
  currentUser: User;
  users: User[];
  onSaveUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const KelolaUserView: React.FC<KelolaUserViewProps> = ({
  currentUser,
  users,
  onSaveUser,
  onDeleteUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('tu');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setEditingUser(null);
    setUsername('');
    setPassword('');
    setName('');
    setRole('tu');
    setNip('');
    setJabatan('');
    setFormError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (targetUser: User) => {
    setEditingUser(targetUser);
    setUsername(targetUser.username);
    setPassword(targetUser.password || '');
    setName(targetUser.name);
    setRole(targetUser.role);
    setNip(targetUser.nip || '');
    setJabatan(targetUser.jabatan || '');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !name.trim()) {
      setFormError('Username dan Nama Lengkap wajib diisi.');
      return;
    }

    // Check duplicate username if adding or changing username
    const exists = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== editingUser?.id
    );
    if (exists) {
      setFormError('Username sudah digunakan oleh akun lain.');
      return;
    }

    const saved: User = editingUser
      ? {
          ...editingUser,
          username: username.trim().toLowerCase(),
          password: password || editingUser.password || '123456',
          name: name.trim(),
          role,
          nip: nip.trim() || undefined,
          jabatan: jabatan.trim() || undefined,
        }
      : {
          id: `usr-${Date.now()}`,
          username: username.trim().toLowerCase(),
          password: password || '123456',
          name: name.trim(),
          role,
          nip: nip.trim() || undefined,
          jabatan: jabatan.trim() || undefined,
        };

    onSaveUser(saved);
    setIsFormOpen(false);
    resetForm();
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.jabatan && u.jabatan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'admin':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-800 border border-purple-200">Admin</span>;
      case 'tu':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 border border-blue-200">Staf TU</span>;
      case 'pimpinan':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800 border border-emerald-200">Pimpinan</span>;
      default:
        return <span>{r}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Manajemen Pengguna Sistem
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data akun pengguna, hak akses peranan (Admin, Staf TU, Pimpinan), dan kredensial SIMAMAT.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
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
            placeholder="Cari nama, username, atau jabatan..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition-colors"
          />
        </div>
        <div className="text-xs text-slate-500">
          Total Pengguna: <span className="font-semibold text-slate-800">{users.length} Akun</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 w-12 text-center">No</th>
                <th className="px-4 py-3">Username & Kredensial</th>
                <th className="px-4 py-3">Nama Pegawai & NIP</th>
                <th className="px-4 py-3">Jabatan Institusi</th>
                <th className="px-4 py-3">Peranan (Role)</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((item, index) => {
                const isSelf = item.id === currentUser.id;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-400 font-mono">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono font-semibold text-slate-800">
                        @{item.username}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Pass: {item.password}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        NIP: {item.nip || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.jabatan || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getRoleBadge(item.role)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Pengguna"
                        className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Can delete only if not self and not the last admin */}
                      {!isSelf && (
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          title="Hapus Akun Pengguna"
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-slate-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah / Edit User */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-md my-6 overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
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
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Contoh: staff_tu2"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: Rian Anggoro, S.Kom."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hak Akses / Peranan (Role) *
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                >
                  <option value="admin">Admin (Kelola User & Kategori)</option>
                  <option value="tu">Staf TU (Surat Masuk, Keluar, Cetak, Arsip, Laporan)</option>
                  <option value="pimpinan">Pimpinan (Disposisi Surat Masuk, Setujui/Tolak Surat Keluar)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Pegawai
                  </label>
                  <input
                    type="text"
                    value={nip}
                    onChange={e => setNip(e.target.value)}
                    placeholder="199208..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan Institusi
                  </label>
                  <input
                    type="text"
                    value={jabatan}
                    onChange={e => setJabatan(e.target.value)}
                    placeholder="Contoh: Staf Arsiparis"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-900"
                  />
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
                  {editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Delete User */}
      <ConfirmModal
        isOpen={Boolean(confirmDeleteId)}
        title="Hapus Akun Pengguna"
        message="Apakah Anda yakin ingin menghapus akun pengguna ini? Pengguna tersebut tidak akan bisa masuk lagi ke dalam sistem SIMAMAT."
        confirmLabel="Hapus Akun"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={() => {
          if (confirmDeleteId) {
            onDeleteUser(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
