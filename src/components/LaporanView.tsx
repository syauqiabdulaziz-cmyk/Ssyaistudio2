import React, { useState } from 'react';
import { SuratMasuk, SuratKeluar, Category, User } from '../types';
import { 
  FileText, 
  Printer, 
  Calendar, 
  Inbox, 
  Send, 
  CheckCircle2, 
  Filter, 
  X,
  FileSpreadsheet
} from 'lucide-react';

interface LaporanViewProps {
  user: User;
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  categories: Category[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({
  user,
  suratMasukList,
  suratKeluarList,
  categories,
}) => {
  const currentYear = new Date().getFullYear() || 2026;
  const currentMonth = new Date().getMonth() + 1; // 1-12

  const [selectedMonth, setSelectedMonth] = useState<string>(String(currentMonth));
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Filter items according to month & year
  const filterByDate = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const m = date.getMonth() + 1;
    const y = date.getFullYear();

    const matchesMonth = selectedMonth === 'ALL' || m === parseInt(selectedMonth, 10);
    const matchesYear = y === parseInt(selectedYear, 10);

    return matchesMonth && matchesYear;
  };

  const filteredMasuk = suratMasukList.filter(s => {
    const dateMatch = filterByDate(s.tanggalSurat);
    const catMatch = selectedCategory === 'ALL' || s.kategoriId === selectedCategory;
    return dateMatch && catMatch;
  });

  const filteredKeluar = suratKeluarList.filter(s => {
    const dateMatch = filterByDate(s.tanggalSurat);
    const catMatch = selectedCategory === 'ALL' || s.kategoriId === selectedCategory;
    return dateMatch && catMatch;
  });

  // Calculate summary per category
  const rekapKategori = categories.map(cat => {
    const countMasuk = filteredMasuk.filter(s => s.kategoriId === cat.id).length;
    const countKeluar = filteredKeluar.filter(s => s.kategoriId === cat.id).length;
    return {
      id: cat.id,
      code: cat.code,
      name: cat.name,
      masuk: countMasuk,
      keluar: countKeluar,
      total: countMasuk + countKeluar,
    };
  }).filter(item => selectedCategory === 'ALL' || item.id === selectedCategory);

  const totalMasukPeriode = filteredMasuk.length;
  const totalKeluarPeriode = filteredKeluar.length;
  const totalSemuaPeriode = totalMasukPeriode + totalKeluarPeriode;

  // Combined detailed log sorted by date
  interface DetailedLogItem {
    id: string;
    type: 'Masuk' | 'Keluar';
    noSurat: string;
    tanggal: string;
    pihak: string;
    perihal: string;
    kategoriName: string;
    status: string;
  }

  const detailedLogs: DetailedLogItem[] = [
    ...filteredMasuk.map(m => ({
      id: m.id,
      type: 'Masuk' as const,
      noSurat: m.noSurat,
      tanggal: m.tanggalSurat,
      pihak: m.asalSurat,
      perihal: m.perihal,
      kategoriName: categories.find(c => c.id === m.kategoriId)?.name || '-',
      status: m.status === 'TERARSIP' ? 'Terarsip' : m.status === 'SUDAH_DISPOSISI' ? 'Sudah Disposisi' : m.status,
    })),
    ...filteredKeluar.map(k => ({
      id: k.id,
      type: 'Keluar' as const,
      noSurat: k.noSurat,
      tanggal: k.tanggalSurat,
      pihak: k.tujuanSurat,
      perihal: k.perihal,
      kategoriName: categories.find(c => c.id === k.kategoriId)?.name || '-',
      status: k.status === 'TERARSIP' ? 'Terarsip' : k.status === 'DISETUJUI' ? 'Disetujui' : k.status,
    })),
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const getPeriodeLabel = () => {
    if (selectedMonth === 'ALL') {
      return `Tahun ${selectedYear}`;
    }
    return `Bulan ${MONTH_NAMES[parseInt(selectedMonth, 10) - 1]} Tahun ${selectedYear}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Rekapitulasi & Laporan Surat
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Laporan berkala volume lalu lintas surat masuk dan keluar Universitas Komputama Majenang.
            </p>
          </div>

          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekapitulasi</span>
          </button>
        </div>
      </div>

      {/* Filter Parameters */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Filter Periode:</span>
        </div>

        {/* Bulan */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-600">Bulan:</span>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="py-1 px-2.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-900"
          >
            <option value="ALL">Semua Bulan (Setahun Penuh)</option>
            {MONTH_NAMES.map((name, index) => (
              <option key={index + 1} value={String(index + 1)}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Tahun */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-600">Tahun:</span>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="py-1 px-2.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-900"
          >
            <option value="2027">2027</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        {/* Kategori */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-600">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="py-1 px-2.5 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-900"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          Periode Terpilih: <span className="font-semibold text-blue-900">{getPeriodeLabel()}</span>
        </div>
      </div>

      {/* 3 Metric Cards for Selected Period */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Surat Masuk Periode Ini</span>
            <Inbox className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-2">{totalMasukPeriode}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Dokumen masuk terdata</div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Surat Keluar Periode Ini</span>
            <Send className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-2">{totalKeluarPeriode}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Dokumen surat keluar resmi</div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Total Lalu Lintas Surat</span>
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-2">{totalSemuaPeriode}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Surat Masuk + Keluar</div>
        </div>
      </div>

      {/* Summary Table: Rekap Per Kategori */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Tabel Rekapitulasi Berdasarkan Kategori Dokumen ({getPeriodeLabel()})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-2.5 w-12 text-center">No</th>
                <th className="px-4 py-2.5">Kode</th>
                <th className="px-4 py-2.5">Nama Kategori Dokumen</th>
                <th className="px-4 py-2.5 text-center">Surat Masuk</th>
                <th className="px-4 py-2.5 text-center">Surat Keluar</th>
                <th className="px-4 py-2.5 text-center font-bold">Total Surat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rekapKategori.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-slate-800">{row.code}</td>
                  <td className="px-4 py-2.5 text-slate-700">{row.name}</td>
                  <td className="px-4 py-2.5 text-center font-medium text-blue-900">{row.masuk}</td>
                  <td className="px-4 py-2.5 text-center font-medium text-slate-800">{row.keluar}</td>
                  <td className="px-4 py-2.5 text-center font-bold text-slate-900">{row.total}</td>
                </tr>
              ))}
              {/* Total Footer Row */}
              <tr className="bg-slate-50 font-semibold text-slate-800 border-t border-slate-200">
                <td colSpan={3} className="px-4 py-2.5 text-right uppercase text-[11px]">
                  Jumlah Keseluruhan :
                </td>
                <td className="px-4 py-2.5 text-center text-blue-900">{totalMasukPeriode}</td>
                <td className="px-4 py-2.5 text-center text-slate-800">{totalKeluarPeriode}</td>
                <td className="px-4 py-2.5 text-center font-bold text-slate-950">{totalSemuaPeriode}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Log Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Rincian Seluruh Surat Dalam Periode Terpilih ({detailedLogs.length} Arsip)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-2.5 w-12 text-center">No</th>
                <th className="px-4 py-2.5">Jenis</th>
                <th className="px-4 py-2.5">Nomor Surat</th>
                <th className="px-4 py-2.5">Tanggal</th>
                <th className="px-4 py-2.5">Pihak Pengirim / Tujuan</th>
                <th className="px-4 py-2.5">Perihal</th>
                <th className="px-4 py-2.5">Kategori</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {detailedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada aktivitas surat pada periode {getPeriodeLabel()}.
                  </td>
                </tr>
              ) : (
                detailedLogs.map((log, index) => (
                  <tr key={`${log.type}-${log.id}`} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 text-center text-slate-400 font-mono">{index + 1}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        log.type === 'Masuk' 
                          ? 'bg-blue-50 text-blue-900 border-blue-200' 
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono font-medium text-slate-800">{log.noSurat}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap font-mono text-slate-600">{log.tanggal}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{log.pihak}</td>
                    <td className="px-4 py-2.5 max-w-[240px] text-slate-700 line-clamp-1">{log.perihal}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-600">{log.kategoriName}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT PREVIEW MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded shadow-md w-full max-w-4xl my-8 overflow-hidden">
            {/* Top Bar for Print modal */}
            <div className="no-print px-5 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-sm">
                Pratinjau Lembar Rekapitulasi Surat Dinas
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Printable */}
            <div className="p-10 font-sans text-slate-900 bg-white text-xs leading-relaxed">
              {/* Kop Surat */}
              <div className="text-center pb-3 border-b-2 border-black mb-1">
                <div className="text-xs uppercase tracking-widest text-slate-700 font-bold">
                  YAYASAN PENDIDIKAN KOMPUTAMA MAJENANG
                </div>
                <div className="text-lg font-bold uppercase tracking-wider text-black mt-0.5">
                  UNIVERSITAS KOMPUTAMA MAJENANG
                </div>
                <div className="text-xs text-slate-800">
                  Jl. Raya Diponegoro No. 12, Cigaru, Majenang, Kab. Cilacap, Jawa Tengah 53257
                </div>
                <div className="text-[11px] text-slate-600">
                  Telp. (0280) 621456 | Bagian Tata Usaha dan Kearsipan
                </div>
              </div>
              <div className="border-b border-black mb-6"></div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-base font-bold uppercase tracking-wide underline">
                  LAPORAN REKAPITULASI SURAT MASUK DAN SURAT KELUAR
                </h2>
                <div className="text-xs text-slate-700 mt-1">
                  Periode: <span className="font-semibold">{getPeriodeLabel()}</span>
                </div>
              </div>

              {/* Ringkasan Angka */}
              <div className="mb-4">
                <table className="w-full text-xs border border-slate-800 border-collapse mb-4">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center border-b border-slate-800">
                      <th className="p-2 border-r border-slate-800 w-12">No</th>
                      <th className="p-2 border-r border-slate-800">Klasifikasi Kategori</th>
                      <th className="p-2 border-r border-slate-800 w-32">Surat Masuk</th>
                      <th className="p-2 border-r border-slate-800 w-32">Surat Keluar</th>
                      <th className="p-2 w-32">Total Berkas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rekapKategori.map((row, idx) => (
                      <tr key={row.id} className="border-b border-slate-300">
                        <td className="p-1.5 text-center border-r border-slate-800 font-mono">{idx + 1}</td>
                        <td className="p-1.5 border-r border-slate-800">
                          <span className="font-semibold font-mono mr-1">[{row.code}]</span> {row.name}
                        </td>
                        <td className="p-1.5 text-center border-r border-slate-800">{row.masuk}</td>
                        <td className="p-1.5 text-center border-r border-slate-800">{row.keluar}</td>
                        <td className="p-1.5 text-center font-bold">{row.total}</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-slate-100 border-t-2 border-slate-800">
                      <td colSpan={2} className="p-2 text-right border-r border-slate-800">TOTAL KESELURUHAN:</td>
                      <td className="p-2 text-center border-r border-slate-800">{totalMasukPeriode}</td>
                      <td className="p-2 text-center border-r border-slate-800">{totalKeluarPeriode}</td>
                      <td className="p-2 text-center">{totalSemuaPeriode}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan Pengesahan */}
              <div className="grid grid-cols-2 mt-12 text-xs">
                <div>
                  <div>Dibuat oleh:</div>
                  <div className="font-semibold mt-1">Staf Tata Usaha & Kearsipan,</div>
                  <div className="h-16 flex items-center text-slate-400 italic text-[11px]">
                    [ Tanda Tangan ]
                  </div>
                  <div className="font-bold underline">Siti Rahmawati, A.Md.</div>
                  <div className="text-slate-600">NIP. 19920822 201803 2 004</div>
                </div>

                <div className="text-right">
                  <div>Majenang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div className="font-semibold mt-1">Mengetahui / Mengesahkan:</div>
                  <div className="font-semibold">Rektor Universitas Komputama,</div>
                  <div className="h-16 flex items-center justify-end text-slate-400 italic text-[11px]">
                    [ TTE Digital Sah Rektorat ]
                  </div>
                  <div className="font-bold underline">Dr. H. Ahmad Fauzi, M.Kom.</div>
                  <div className="text-slate-600">NIP. 19750210 200212 1 001</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
