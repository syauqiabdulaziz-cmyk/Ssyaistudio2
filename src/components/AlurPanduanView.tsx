import React from 'react';
import { 
  Inbox, 
  Send, 
  Printer, 
  Archive, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  FileText,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface AlurPanduanViewProps {
  currentRole: UserRole;
}

export const AlurPanduanView: React.FC<AlurPanduanViewProps> = ({ currentRole }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Panduan Alur Kerja SIMAMAT
        </h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Sistem Informasi Manajemen Arsip Surat (SIMAMAT) Universitas Komputama Majenang dirancang untuk memudahkan standarisasi persuratan, tata kelola disposisi Rektorat, dan pengarsipan digital institusi.
        </p>
      </div>

      {/* Alur Surat Masuk */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <div className="w-8 h-8 rounded bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Alur 1: Tata Kelola Surat Masuk
            </h2>
            <p className="text-xs text-slate-500">
              Staf TU Input &rarr; Teruskan ke Pimpinan &rarr; Pimpinan Beri Disposisi &rarr; Selesai & Tindak Lanjut &rarr; Masuk Buku Arsip
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
            <div className="font-bold text-blue-900 mb-1 flex items-center justify-between">
              <span>Langkah 1: Input</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-sans">TU</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Staf TU mencatat surat masuk fisik/email: nomor surat asal, instansi pengirim, perihal, kategori, serta mengunggah scan lampiran.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
            <div className="font-bold text-amber-800 mb-1 flex items-center justify-between">
              <span>Langkah 2: Teruskan</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-sans">TU &rarr; Pimpinan</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Staf TU meninjau kelengkapan draf lalu mengklik tombol <b>"Teruskan ke Pimpinan"</b>. Status berubah menjadi <i>Menunggu Disposisi</i>.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
            <div className="font-bold text-emerald-800 mb-1 flex items-center justify-between">
              <span>Langkah 3: Disposisi</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-sans">Pimpinan</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Pimpinan membuka surat masuk dan mengisi Lembar Disposisi: pejabat tujuan (Warek/Dekan), instruksi tindakan, dan catatan khusus.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
            <div className="font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>Langkah 4: Arsip</span>
              <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-sans">TU / Arsiparis</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Lembar disposisi dapat dicetak untuk fisik surat, dan Staf TU mengarsipkan surat ke dalam <b>Buku Arsip Digital</b>.
            </p>
          </div>
        </div>
      </div>

      {/* Alur Surat Keluar */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <div className="w-8 h-8 rounded bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Alur 2: Tata Kelola Surat Keluar
            </h2>
            <p className="text-xs text-slate-500">
              Staf TU Buat (Nomor Otomatis) &rarr; Ajukan ke Pimpinan &rarr; Pimpinan Setujui / Revisi &rarr; Cetak Surat Kop Resmi &rarr; Arsipkan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
            <div className="font-bold text-blue-900 mb-1 flex items-center justify-between">
              <span>Langkah 1: Konsep</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-sans">TU</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Staf TU membuat konsep surat. Nomor surat digenerate otomatis sesuai klasifikasi kategori dan urutan tahun berjalan.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
            <div className="font-bold text-amber-800 mb-1 flex items-center justify-between">
              <span>Langkah 2: Ajukan</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-sans">TU &rarr; Pimpinan</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Staf TU klik <b>"Ajukan ke Pimpinan"</b>. Status dokumen berubah menjadi <i>Menunggu Persetujuan</i>.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
            <div className="font-bold text-emerald-800 mb-1 flex items-center justify-between">
              <span>Langkah 3: Persetujuan</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-sans">Pimpinan</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Rektor / Pimpinan meninjau naskah. Pimpinan dapat mengklik <b>"Setujui"</b> atau <b>"Tolak & Minta Revisi"</b> disertai alasan perbaikan.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded">
            <div className="font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>Langkah 4: Cetak & Arsip</span>
              <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-sans">TU</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Setelah disetujui, Staf TU dapat mencetak surat resmi ber-Kop Surat Universitas Komputama Majenang, lalu mengarsipkannya.
            </p>
          </div>
        </div>
      </div>

      {/* Hak Akses Tiap Akun */}
      <div className="bg-white border border-slate-200 rounded p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
          Peran dan Wewenang 3 Akun Pengguna
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Admin */}
          <div className="border border-purple-200 rounded p-4 bg-purple-50/40">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span className="font-bold text-purple-900 text-sm">1. Administrator</span>
            </div>
            <div className="text-[11px] text-purple-800 font-mono mb-2">admin / admin123</div>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li>Kelola akun pengguna (tambah, edit, hapus, atur peran).</li>
              <li>Kelola kategori surat dan kode klasifikasi nomor surat.</li>
              <li>Akses audit seluruh arsip surat dan laporan rekapitulasi.</li>
            </ul>
          </div>

          {/* Staf TU */}
          <div className="border border-blue-200 rounded p-4 bg-blue-50/40">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-blue-900" />
              <span className="font-bold text-blue-950 text-sm">2. Staf Tata Usaha</span>
            </div>
            <div className="text-[11px] text-blue-800 font-mono mb-2">tu / tu123</div>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li>Input dan unggah lampiran berkas surat masuk.</li>
              <li>Meneruskan surat masuk ke Pimpinan untuk disposisi.</li>
              <li>Membuat surat keluar dengan penomoran otomatis.</li>
              <li>Mengajukan surat keluar ke Rektorat.</li>
              <li>Mencetak surat resmi dan lembar disposisi.</li>
              <li>Mengarsipkan dan mencetak laporan bulanan/tahunan.</li>
            </ul>
          </div>

          {/* Pimpinan */}
          <div className="border border-emerald-200 rounded p-4 bg-emerald-50/40">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-emerald-800" />
              <span className="font-bold text-emerald-950 text-sm">3. Pimpinan / Rektor</span>
            </div>
            <div className="text-[11px] text-emerald-800 font-mono mb-2">pimpinan / pimpinan123</div>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li>Memeriksa surat masuk dari instansi luar.</li>
              <li>Memberikan instruksi disposisi kepada pejabat kampus.</li>
              <li>Menyetujui atau menolak (minta revisi) naskah surat keluar.</li>
              <li>Memantau buku arsip dan laporan rekapitulasi rektorat.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
