export type UserRole = 'admin' | 'tu' | 'pimpinan';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  nip?: string;
  jabatan?: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface DisposisiData {
  tujuan: string; // e.g. "Wakil Rektor I (Akademik)", "Dekan Fakultas Ilmu Komputer", "Ka. BAAK"
  instruksi: string[]; // e.g. ["Tindak lanjuti", "Pelajari & laporkan", "Hadiri/Wakili", "Arsipkan"]
  catatan: string;
  tanggalDisposisi: string;
  oleh: string;
}

export type StatusSuratMasuk = 
  | 'DRAF' 
  | 'MENUNGGU_DISPOSISI' 
  | 'SUDAH_DISPOSISI' 
  | 'SELESAI' 
  | 'TERARSIP';

export interface SuratMasuk {
  id: string;
  noSurat: string;
  asalSurat: string;
  tanggalSurat: string;
  tanggalTerima: string;
  perihal: string;
  kategoriId: string;
  lampiranName?: string;
  lampiranSize?: string;
  lampiranDataUrl?: string;
  status: StatusSuratMasuk;
  disposisi?: DisposisiData;
  createdAt: string;
  updatedAt: string;
  arsipAt?: string;
}

export type StatusSuratKeluar = 
  | 'DRAF' 
  | 'MENUNGGU_PERSETUJUAN' 
  | 'DISETUJUI' 
  | 'DITOLAK' 
  | 'TERARSIP';

export interface SuratKeluar {
  id: string;
  noSurat: string;
  tujuanSurat: string;
  tanggalSurat: string;
  perihal: string;
  kategoriId: string;
  isiSurat: string;
  sifatSurat: 'Biasa' | 'Penting' | 'Segera' | 'Rahasia';
  lampiranInfo?: string;
  nomorUrut: number;
  tahun: number;
  status: StatusSuratKeluar;
  catatanPimpinan?: string;
  disetujuiOleh?: string;
  tanggalPersetujuan?: string;
  createdAt: string;
  updatedAt: string;
  arsipAt?: string;
}
