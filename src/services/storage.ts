import { User, Category, SuratMasuk, SuratKeluar } from '../types';

const STORAGE_KEYS = {
  USERS: 'simamat_users_v1',
  CATEGORIES: 'simamat_categories_v1',
  SURAT_MASUK: 'simamat_surat_masuk_v1',
  SURAT_KELUAR: 'simamat_surat_keluar_v1',
  CURRENT_USER: 'simamat_current_user_v1',
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'admin',
    password: 'admin123',
    name: 'Bagus Wicaksono, S.T.',
    role: 'admin',
    nip: '19870415 201201 1 002',
    jabatan: 'Administrator IT & Sistem',
  },
  {
    id: 'usr-2',
    username: 'tu',
    password: 'tu123',
    name: 'Siti Rahmawati, A.Md.',
    role: 'tu',
    nip: '19920822 201803 2 004',
    jabatan: 'Staf Tata Usaha & Kearsipan',
  },
  {
    id: 'usr-3',
    username: 'pimpinan',
    password: 'pimpinan123',
    name: 'Dr. H. Ahmad Fauzi, M.Kom.',
    role: 'pimpinan',
    nip: '19750210 200212 1 001',
    jabatan: 'Rektor Universitas Komputama',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    code: 'UND',
    name: 'Surat Undangan',
    description: 'Undangan rapat dinas, pertemuan, seminar, atau acara resmi kampus.',
  },
  {
    id: 'cat-2',
    code: 'ED',
    name: 'Surat Edaran',
    description: 'Edaran akademik, hari libur, tata tertib, dan pengumuman umum.',
  },
  {
    id: 'cat-3',
    code: 'PMH',
    name: 'Surat Permohonan',
    description: 'Permohonan kerjasama, izin tempat, audiensi, atau permohonan sponsor.',
  },
  {
    id: 'cat-4',
    code: 'SK',
    name: 'Surat Keputusan',
    description: 'Surat Keputusan (SK) Rektor pengangkatan, kepanitiaan, atau kebijakan.',
  },
  {
    id: 'cat-5',
    code: 'ST',
    name: 'Surat Tugas',
    description: 'Surat penugasan dinas, pendampingan lomba, atau pelatihan dosen/staf.',
  },
  {
    id: 'cat-6',
    code: 'PBT',
    name: 'Surat Pemberitahuan',
    description: 'Pemberitahuan agenda kampus, pelaporan, atau balasan surat.',
  },
];

export const INITIAL_SURAT_MASUK: SuratMasuk[] = [
  {
    id: 'sm-1',
    noSurat: '420/LLDIKTI6/TU/2026',
    asalSurat: 'LLDIKTI Wilayah VI Jawa Tengah',
    tanggalSurat: '2026-10-14',
    tanggalTerima: '2026-10-16',
    perihal: 'Undangan Koordinasi Pelaporan PDDIKTI Semester Gasal TA 2026/2027',
    kategoriId: 'cat-1',
    lampiranName: 'Jadwal_Koordinasi_LLDIKTI.pdf',
    lampiranSize: '1.2 MB',
    status: 'MENUNGGU_DISPOSISI',
    createdAt: '2026-10-16T08:30:00Z',
    updatedAt: '2026-10-16T09:00:00Z',
  },
  {
    id: 'sm-2',
    noSurat: '088/DINKES-CLP/III/2026',
    asalSurat: 'Dinas Kesehatan Kabupaten Cilacap',
    tanggalSurat: '2026-10-08',
    tanggalTerima: '2026-10-10',
    perihal: 'Permohonan Kerjasama Program KKN Tematik Pencegahan Stunting',
    kategoriId: 'cat-3',
    lampiranName: 'Kerangka_Acuan_KKN_Cilacap.pdf',
    lampiranSize: '840 KB',
    status: 'SUDAH_DISPOSISI',
    disposisi: {
      tujuan: 'Wakil Rektor III (Bidang Kerjasama & Kemahasiswaan)',
      instruksi: ['Tindak lanjuti', 'Pelajari & Laporkan', 'Siapkan Bahan Kerjasama'],
      catatan: 'Segera koordinasikan dengan LPPM untuk penyesuaian jadwal mahasiswa KKN.',
      tanggalDisposisi: '2026-10-11',
      oleh: 'Dr. H. Ahmad Fauzi, M.Kom.',
    },
    createdAt: '2026-10-10T10:15:00Z',
    updatedAt: '2026-10-11T13:45:00Z',
  },
  {
    id: 'sm-3',
    noSurat: '025/SMK-MJG/X/2026',
    asalSurat: 'SMK Komputama Majenang',
    tanggalSurat: '2026-10-18',
    tanggalTerima: '2026-10-19',
    perihal: 'Permohonan Dosen Tamu Guru Kejuruan RPL dan Informatika',
    kategoriId: 'cat-3',
    lampiranName: 'Daftar_Materi_Workshop_SMK.pdf',
    lampiranSize: '450 KB',
    status: 'DRAF',
    createdAt: '2026-10-19T09:20:00Z',
    updatedAt: '2026-10-19T09:20:00Z',
  },
  {
    id: 'sm-4',
    noSurat: '114/BAN-PT/AK/2026',
    asalSurat: 'Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT)',
    tanggalSurat: '2026-09-02',
    tanggalTerima: '2026-09-05',
    perihal: 'Penyampaian SK Penetapan Akreditasi Program Studi Sistem Informasi',
    kategoriId: 'cat-4',
    lampiranName: 'SK_Akreditasi_BANPT_2026.pdf',
    lampiranSize: '2.4 MB',
    status: 'TERARSIP',
    disposisi: {
      tujuan: 'Dekan Fakultas Ilmu Komputer & Ka. BPM',
      instruksi: ['Arsipkan', 'Sosialisasikan'],
      catatan: 'Alhamdulillah akreditasi Baik Sekali telah terbit. Publikasikan di portal resmi.',
      tanggalDisposisi: '2026-09-06',
      oleh: 'Dr. H. Ahmad Fauzi, M.Kom.',
    },
    createdAt: '2026-09-05T08:00:00Z',
    updatedAt: '2026-09-07T11:00:00Z',
    arsipAt: '2026-09-07T11:00:00Z',
  },
];

export const INITIAL_SURAT_KELUAR: SuratKeluar[] = [
  {
    id: 'sk-1',
    noSurat: '001/UKM-TU/ED/X/2026',
    tujuanSurat: 'Seluruh Dosen dan Tenaga Kependidikan Universitas Komputama',
    tanggalSurat: '2026-10-05',
    perihal: 'Jadwal dan Tata Tertib Pelaksanaan Ujian Tengah Semester Gasal TA 2026/2027',
    kategoriId: 'cat-2',
    sifatSurat: 'Penting',
    isiSurat: 'Diberitahukan kepada seluruh sivitas akademika Universitas Komputama Majenang bahwa pelaksanaan Ujian Tengah Semester (UTS) Gasal TA 2026/2027 akan diselenggarakan mulai tanggal 26 Oktober s.d. 06 November 2026. Dimohon para dosen pengampu telah mengumpulkan naskah soal paling lambat H-3 ujian.',
    lampiranInfo: '1 Berkas Jadwal',
    nomorUrut: 1,
    tahun: 2026,
    status: 'DISETUJUI',
    catatanPimpinan: 'Disetujui. Pastikan BAAK memantau ketepatan waktu pengumpulan soal.',
    disetujuiOleh: 'Dr. H. Ahmad Fauzi, M.Kom.',
    tanggalPersetujuan: '2026-10-06',
    createdAt: '2026-10-05T09:00:00Z',
    updatedAt: '2026-10-06T10:30:00Z',
  },
  {
    id: 'sk-2',
    noSurat: '002/UKM-TU/ST/X/2026',
    tujuanSurat: 'Rizki Pratama, M.Kom. (Dosen Informatika)',
    tanggalSurat: '2026-10-15',
    perihal: 'Surat Tugas Pembimbing Tim Mahasiswa Lomba Inovasi Teknologi Nasional di Semarang',
    kategoriId: 'cat-5',
    sifatSurat: 'Penting',
    isiSurat: 'Memberikan tugas kepada saudara yang namanya tersebut di atas untuk mendampingi dan membimbing tim mahasiswa Universitas Komputama Majenang dalam Kompetisi Inovasi Teknologi Nasional 2026 di Semarang pada tanggal 28-30 Oktober 2026.',
    lampiranInfo: '-',
    nomorUrut: 2,
    tahun: 2026,
    status: 'MENUNGGU_PERSETUJUAN',
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-15T11:30:00Z',
  },
  {
    id: 'sk-3',
    noSurat: '003/UKM-TU/PMH/IX/2026',
    tujuanSurat: 'Pimpinan Bank Jateng Kantor Cabang Majenang',
    tanggalSurat: '2026-09-18',
    perihal: 'Permohonan Dukungan dan Kerjasama Sponsor Acara Wisuda Sarjana Ke-VIII',
    kategoriId: 'cat-3',
    sifatSurat: 'Biasa',
    isiSurat: 'Sehubungan dengan akan dilaksanakannya Sidang Terbuka Senat Wisuda Sarjana Ke-VIII Universitas Komputama Majenang pada bulan November 2026, kami mengajukan permohonan kerjasama sponsorship paket Platinum dalam rangkaian kegiatan tersebut.',
    lampiranInfo: '1 Eksemplar Proposal',
    nomorUrut: 3,
    tahun: 2026,
    status: 'TERARSIP',
    catatanPimpinan: 'Disetujui untuk diajukan ke pihak perbankan mitra.',
    disetujuiOleh: 'Dr. H. Ahmad Fauzi, M.Kom.',
    tanggalPersetujuan: '2026-09-19',
    createdAt: '2026-09-18T14:00:00Z',
    updatedAt: '2026-09-25T16:00:00Z',
    arsipAt: '2026-09-25T16:00:00Z',
  },
  {
    id: 'sk-4',
    noSurat: '004/UKM-TU/UND/X/2026',
    tujuanSurat: 'Anggota Senat Akademik Universitas Komputama Majenang',
    tanggalSurat: '2026-10-20',
    perihal: 'Undangan Rapat Pleno Senat Akademik Pembahasan Kurikulum MBKM Mandiri',
    kategoriId: 'cat-1',
    sifatSurat: 'Biasa',
    isiSurat: 'Mengharap kehadiran Bapak/Ibu Anggota Senat Akademik Universitas Komputama pada hari Kamis, 24 Oktober 2026, Pukul 09.00 WIB bertempat di Ruang Rapat Rektorat Lantai 2, guna membahas penyesuaian kurikulum Program Merdeka Belajar Kampus Merdeka.',
    lampiranInfo: 'Draf Dokumen Kurikulum',
    nomorUrut: 4,
    tahun: 2026,
    status: 'DRAF',
    createdAt: '2026-10-20T08:00:00Z',
    updatedAt: '2026-10-20T08:00:00Z',
  },
];

export const storage = {
  // Users
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      this.setUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  setUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.setUsers(users);
  },

  deleteUser(userId: string): boolean {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    this.setUsers(filtered);
    return true;
  },

  // Current session
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  },

  // Categories
  getCategories(): Category[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      this.setCategories(INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  setCategories(cats: Category[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
  },

  saveCategory(cat: Category): void {
    const cats = this.getCategories();
    const index = cats.findIndex(c => c.id === cat.id);
    if (index >= 0) {
      cats[index] = cat;
    } else {
      cats.push(cat);
    }
    this.setCategories(cats);
  },

  deleteCategory(catId: string): boolean {
    const cats = this.getCategories();
    this.setCategories(cats.filter(c => c.id !== catId));
    return true;
  },

  // Surat Masuk
  getSuratMasuk(): SuratMasuk[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SURAT_MASUK);
    if (!raw) {
      this.setSuratMasuk(INITIAL_SURAT_MASUK);
      return INITIAL_SURAT_MASUK;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SURAT_MASUK;
    }
  },

  setSuratMasuk(letters: SuratMasuk[]): void {
    localStorage.setItem(STORAGE_KEYS.SURAT_MASUK, JSON.stringify(letters));
  },

  saveSuratMasuk(letter: SuratMasuk): void {
    const list = this.getSuratMasuk();
    const idx = list.findIndex(l => l.id === letter.id);
    if (idx >= 0) {
      list[idx] = letter;
    } else {
      list.unshift(letter);
    }
    this.setSuratMasuk(list);
  },

  deleteSuratMasuk(id: string): void {
    const list = this.getSuratMasuk();
    this.setSuratMasuk(list.filter(l => l.id !== id));
  },

  // Surat Keluar
  getSuratKeluar(): SuratKeluar[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SURAT_KELUAR);
    if (!raw) {
      this.setSuratKeluar(INITIAL_SURAT_KELUAR);
      return INITIAL_SURAT_KELUAR;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SURAT_KELUAR;
    }
  },

  setSuratKeluar(letters: SuratKeluar[]): void {
    localStorage.setItem(STORAGE_KEYS.SURAT_KELUAR, JSON.stringify(letters));
  },

  saveSuratKeluar(letter: SuratKeluar): void {
    const list = this.getSuratKeluar();
    const idx = list.findIndex(l => l.id === letter.id);
    if (idx >= 0) {
      list[idx] = letter;
    } else {
      list.unshift(letter);
    }
    this.setSuratKeluar(list);
  },

  deleteSuratKeluar(id: string): void {
    const list = this.getSuratKeluar();
    this.setSuratKeluar(list.filter(l => l.id !== id));
  },

  // Generate next automatic letter number for Surat Keluar
  generateNoSuratKeluar(categoryCode: string, dateStr: string): { noSurat: string; nomorUrut: number; tahun: number } {
    const date = dateStr ? new Date(dateStr) : new Date();
    const year = date.getFullYear() || 2026;
    const month = (date.getMonth() + 1) || 10;
    
    // Roman numerals for months
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const romanMonth = romanMonths[month - 1] || 'X';

    const list = this.getSuratKeluar().filter(s => s.tahun === year);
    let maxNumber = 0;
    list.forEach(s => {
      if (s.nomorUrut && s.nomorUrut > maxNumber) {
        maxNumber = s.nomorUrut;
      }
    });

    const nextNumber = maxNumber + 1;
    const padded = String(nextNumber).padStart(3, '0');
    const safeCode = (categoryCode || 'TU').toUpperCase();
    const noSurat = `${padded}/UKM-TU/${safeCode}/${romanMonth}/${year}`;

    return {
      noSurat,
      nomorUrut: nextNumber,
      tahun: year,
    };
  },

  // Reset all data to initial defaults
  resetAllData(): void {
    this.setUsers(INITIAL_USERS);
    this.setCategories(INITIAL_CATEGORIES);
    this.setSuratMasuk(INITIAL_SURAT_MASUK);
    this.setSuratKeluar(INITIAL_SURAT_KELUAR);
  },
};
