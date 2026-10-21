import React from 'react';
import { SuratKeluar, Category } from '../types';
import { Printer, X, FileCheck } from 'lucide-react';

interface PrintLetterModalProps {
  isOpen: boolean;
  surat: SuratKeluar | null;
  categories: Category[];
  onClose: () => void;
}

export const PrintLetterModal: React.FC<PrintLetterModalProps> = ({
  isOpen,
  surat,
  categories,
  onClose,
}) => {
  if (!isOpen || !surat) return null;

  const categoryName = categories.find(c => c.id === surat.kategoriId)?.name || 'Surat Dinas';

  const handlePrint = () => {
    window.print();
  };

  const formatDateIndo = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-3xl my-8 overflow-hidden">
        {/* Modal Top Actions (no-print) */}
        <div className="no-print px-5 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-900" />
            <span className="font-semibold text-slate-800 text-sm">
              Cetak Naskah Resmi Surat Keluar
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Cetak ke PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Printable Official Letter */}
        <div className="p-10 sm:p-12 font-serif text-slate-900 bg-white leading-relaxed text-sm">
          {/* Official Letterhead (KOP SURAT) */}
          <div className="text-center pb-3 border-b-2 border-black mb-1 font-sans">
            <div className="text-xs uppercase tracking-widest text-slate-700 font-bold">
              YAYASAN PENDIDIKAN KOMPUTAMA MAJENANG
            </div>
            <div className="text-xl font-bold uppercase tracking-wider text-black mt-0.5">
              UNIVERSITAS KOMPUTAMA MAJENANG
            </div>
            <div className="text-xs text-slate-800 mt-0.5">
              Jl. Raya Diponegoro No. 12, Cigaru, Majenang, Kab. Cilacap, Jawa Tengah 53257
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Telp. (0280) 621456 | Email: sekretariat@komputama.ac.id | Web: https://komputama.ac.id
            </div>
          </div>
          <div className="border-b border-black mb-6"></div>

          {/* Tanggal & Tempat Surat */}
          <div className="flex justify-end mb-4 font-sans text-xs">
            <div>Majenang, {formatDateIndo(surat.tanggalSurat)}</div>
          </div>

          {/* Letter Info Block */}
          <div className="grid grid-cols-12 gap-y-1 mb-6 font-sans text-xs">
            <div className="col-span-2 text-slate-700">Nomor</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-9 font-mono font-semibold">{surat.noSurat}</div>

            <div className="col-span-2 text-slate-700">Sifat</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-9">{surat.sifatSurat || 'Biasa'}</div>

            <div className="col-span-2 text-slate-700">Lampiran</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-9">{surat.lampiranInfo || '-'}</div>

            <div className="col-span-2 text-slate-700 font-semibold">Hal / Perihal</div>
            <div className="col-span-1 text-center font-semibold">:</div>
            <div className="col-span-9 font-semibold text-slate-900 underline">
              {surat.perihal}
            </div>
          </div>

          {/* Tujuan Surat */}
          <div className="mb-6 font-sans text-xs">
            <div className="text-slate-700">Kepada Yth.</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">
              {surat.tujuanSurat}
            </div>
            <div className="text-slate-700">di Tempat</div>
          </div>

          {/* Salam Pembuka */}
          <div className="mb-4">
            Dengan hormat,
          </div>

          {/* Isi Surat */}
          <div className="space-y-3 text-justify leading-relaxed indent-8 mb-6">
            <p>
              {surat.isiSurat}
            </p>
            <p>
              Demikian surat ini kami sampaikan untuk diketahui dan dipergunakan sebagaimana mestinya. Atas perhatian, perkenan, dan kerjasama yang terjalin dengan baik, kami ucapkan terima kasih.
            </p>
          </div>

          {/* Salam Penutup */}
          <div className="mb-8">
            Wassalamu'alaikum Wr. Wb.
          </div>

          {/* Signature Block */}
          <div className="flex justify-end font-sans text-xs">
            <div className="text-center w-64">
              <div className="font-semibold">Rektor Universitas Komputama,</div>
              {/* Digital Stamp Simulation */}
              <div className="h-20 flex items-center justify-center relative">
                <div className="border border-blue-800 text-blue-900 font-mono text-[10px] px-2 py-1 rounded rotate-[-4deg] opacity-80 uppercase">
                  [ TTE SAH REKTORAT ]
                </div>
              </div>
              <div className="font-bold text-sm underline text-slate-900">
                {surat.disetujuiOleh || 'Dr. H. Ahmad Fauzi, M.Kom.'}
              </div>
              <div className="text-slate-600 mt-0.5">NIP. 19750210 200212 1 001</div>
            </div>
          </div>

          {/* Tembusan */}
          <div className="mt-8 pt-4 border-t border-slate-200 font-sans text-[11px] text-slate-600">
            <div className="font-semibold text-slate-700">Tembusan Yth:</div>
            <ol className="list-decimal pl-4 space-y-0.5 mt-0.5">
              <li>Ketua Yayasan Pendidikan Komputama Majenang</li>
              <li>Para Wakil Rektor di lingkungan Universitas Komputama</li>
              <li>Bagian Tata Usaha dan Kearsipan (Sebagai Arsip)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
