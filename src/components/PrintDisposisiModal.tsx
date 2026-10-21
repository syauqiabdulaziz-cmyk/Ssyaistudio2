import React from 'react';
import { SuratMasuk, Category } from '../types';
import { Printer, X, FileCheck } from 'lucide-react';

interface PrintDisposisiModalProps {
  isOpen: boolean;
  surat: SuratMasuk | null;
  categories: Category[];
  onClose: () => void;
}

export const PrintDisposisiModal: React.FC<PrintDisposisiModalProps> = ({
  isOpen,
  surat,
  categories,
  onClose,
}) => {
  if (!isOpen || !surat) return null;

  const categoryName = categories.find(c => c.id === surat.kategoriId)?.name || 'Umum';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-3xl my-8 overflow-hidden">
        {/* Modal Top Actions (no-print) */}
        <div className="no-print px-5 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-900" />
            <span className="font-semibold text-slate-800 text-sm">
              Lembar Disposisi Surat Masuk
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="p-8 sm:p-10 font-serif text-slate-900 bg-white leading-relaxed">
          {/* Kop Kampus */}
          <div className="text-center pb-3 border-b-2 border-black mb-1">
            <div className="text-xs uppercase tracking-widest text-slate-600 font-sans font-bold">
              YAYASAN PENDIDIKAN KOMPUTAMA MAJENANG
            </div>
            <div className="text-xl font-bold uppercase tracking-wide text-black font-sans">
              UNIVERSITAS KOMPUTAMA MAJENANG
            </div>
            <div className="text-xs text-slate-700 font-sans">
              Jl. Raya Diponegoro No. 12, Cigaru, Majenang, Kabupaten Cilacap, Jawa Tengah 53257
            </div>
            <div className="text-[11px] text-slate-600 font-sans">
              Telepon: (0280) 621456 | Pos-el: rektorat@komputama.ac.id | Laman: www.komputama.ac.id
            </div>
          </div>
          <div className="border-b border-black mb-6"></div>

          {/* Judul Lembar */}
          <div className="text-center mb-6 font-sans">
            <h2 className="text-base font-bold uppercase tracking-wider underline">
              LEMBAR DISPOSISI REKTORAT
            </h2>
            <div className="text-xs text-slate-600 mt-0.5">
              Agenda Tata Usaha & Kearsipan
            </div>
          </div>

          {/* Data Surat Table */}
          <table className="w-full text-xs font-sans border-collapse border border-slate-700 mb-6">
            <tbody>
              <tr>
                <td className="w-1/4 p-2 font-semibold bg-slate-50 border border-slate-700">Nomor Agenda</td>
                <td className="w-1/4 p-2 border border-slate-700 font-mono">REG-SM/{surat.id.toUpperCase()}</td>
                <td className="w-1/4 p-2 font-semibold bg-slate-50 border border-slate-700">Tanggal Terima</td>
                <td className="w-1/4 p-2 border border-slate-700">{surat.tanggalTerima}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold bg-slate-50 border border-slate-700">Nomor Surat Asal</td>
                <td className="p-2 border border-slate-700 font-mono">{surat.noSurat}</td>
                <td className="p-2 font-semibold bg-slate-50 border border-slate-700">Tanggal Surat</td>
                <td className="p-2 border border-slate-700">{surat.tanggalSurat}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold bg-slate-50 border border-slate-700">Asal / Pengirim</td>
                <td colSpan={3} className="p-2 border border-slate-700 font-semibold">{surat.asalSurat}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold bg-slate-50 border border-slate-700">Klasifikasi / Kategori</td>
                <td colSpan={3} className="p-2 border border-slate-700">{categoryName}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold bg-slate-50 border border-slate-700">Perihal / Isi Ringkas</td>
                <td colSpan={3} className="p-2 border border-slate-700 leading-normal">{surat.perihal}</td>
              </tr>
              {surat.lampiranName && (
                <tr>
                  <td className="p-2 font-semibold bg-slate-50 border border-slate-700">Lampiran Fisik/Digital</td>
                  <td colSpan={3} className="p-2 border border-slate-700 font-mono text-[11px]">
                    {surat.lampiranName} ({surat.lampiranSize || 'Tersedia'})
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Section Disposisi */}
          <div className="border border-slate-700 p-4 font-sans text-xs mb-6">
            <div className="font-bold text-sm border-b border-slate-300 pb-1.5 mb-3">
              INSTRUKSI / DISPOSISI PIMPINAN:
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-semibold block text-slate-700 mb-1">Diteruskan Kepada Yth:</span>
                <div className="p-2.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900">
                  {surat.disposisi?.tujuan || '(Belum ditentukan)'}
                </div>
              </div>

              <div>
                <span className="font-semibold block text-slate-700 mb-1">Tanggal Disposisi:</span>
                <div className="p-2.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900">
                  {surat.disposisi?.tanggalDisposisi || '-'}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span className="font-semibold block text-slate-700 mb-1">Instruksi Khusus:</span>
              <div className="flex flex-wrap gap-2">
                {surat.disposisi?.instruksi && surat.disposisi.instruksi.length > 0 ? (
                  surat.disposisi.instruksi.map((inst, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded font-semibold text-slate-800">
                      [&radic;] {inst}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">Belum ada checklist instruksi</span>
                )}
              </div>
            </div>

            <div>
              <span className="font-semibold block text-slate-700 mb-1">Catatan Tambahan Pimpinan:</span>
              <div className="p-3 bg-slate-50 border border-slate-300 rounded min-h-[70px] italic text-slate-800">
                {surat.disposisi?.catatan ? `"${surat.disposisi.catatan}"` : 'Tidak ada catatan khusus.'}
              </div>
            </div>
          </div>

          {/* Tanda Tangan */}
          <div className="flex justify-between items-end font-sans text-xs mt-8">
            <div className="text-slate-600">
              <div>Catatan:</div>
              <div>1. Lembar ini merupakan dokumen dinas resmi.</div>
              <div>2. Harap segera ditindaklanjuti sesuai batas waktu.</div>
            </div>
            <div className="text-center w-64">
              <div>Majenang, {surat.disposisi?.tanggalDisposisi || surat.tanggalTerima}</div>
              <div className="font-semibold mt-1">Rektor Universitas Komputama,</div>
              <div className="h-16 flex items-center justify-center font-serif italic text-slate-400 text-sm">
                [ Tanda Tangan Digital Resmi ]
              </div>
              <div className="font-bold underline">
                {surat.disposisi?.oleh || 'Dr. H. Ahmad Fauzi, M.Kom.'}
              </div>
              <div className="text-slate-600">NIP. 19750210 200212 1 001</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
