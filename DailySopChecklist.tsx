import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Camera, 
  Save,
  ShieldCheck,
  FileCheck2,
  Calendar,
  Building,
  Video,
  Loader2,
  XCircle
} from 'lucide-react';
import { SOPChecklistItem, DailyChecklistSession } from '../types';

interface DailySopChecklistProps {
  currentWorkspaceName: string;
  nutritionistName: string;
}

const INITIAL_CHECKLIST_ITEMS: SOPChecklistItem[] = [
  // Penerimaan & Rantai Dingin
  {
    id: 'chk-01',
    code: 'CHK-RCV-01',
    sopRef: 'SOP-018 / SOP-012',
    title: 'Pemeriksaan Suhu Penerimaan Daging, Ayam & Ikan (CCP-1)',
    category: 'Penerimaan',
    standard: 'Suhu daging/ikan maksimal 4.0°C; produk beku maksimal -18.0°C; dicatat di Formulir CCP-1.',
    isCompliant: true,
    isCCP: true,
    ccpCode: 'CCP-1',
    notes: 'Suhu tiba daging ayam 3.2°C, ikan kembung 2.8°C (lolos spek)',
    checkedAt: '06:15 WIB',
    checkedBy: 'Siti Nur Aisyah (Nutrisionis)'
  },
  {
    id: 'chk-02',
    code: 'CHK-RCV-02',
    sopRef: 'SOP-020',
    title: 'Pemeriksaan Suhu & Segel Susu Pasteurisasi',
    category: 'Penerimaan',
    standard: 'Susu diterima suhu <= 4.0°C, karton tidak kembung, segel kedap, expired date > 7 hari.',
    isCompliant: true,
    isCCP: true,
    ccpCode: 'CCP-1',
    notes: 'Susu UHT & pasteurisasi dingin 3.5°C segel utuh 100 karton',
    checkedAt: '06:30 WIB',
    checkedBy: 'Rian Hidayat (QA)'
  },
  {
    id: 'chk-03',
    code: 'CHK-RCV-03',
    sopRef: 'SOP-021',
    title: 'Manajemen Gudang Kering & Palet Beras (FIFO/FEFO)',
    category: 'Penerimaan',
    standard: 'Bahan kering di atas palet min 15 cm dari lantai, 20 cm dari dinding, RH < 70%, suhu < 25°C.',
    isCompliant: true,
    isCCP: false,
    notes: 'Beras pandan wangi disusun berpalet rapi, kartu stok FEFO terpasang',
    checkedAt: '07:00 WIB',
    checkedBy: 'Logistik SPPG'
  },

  // Higiene & Sanitasi
  {
    id: 'chk-04',
    code: 'CHK-SAN-01',
    sopRef: 'SOP-040',
    title: 'Skrining Kesehatan & APD Relawan Penjamah Pangan',
    category: 'Higiene',
    standard: 'Suhu tubuh < 37.3°C, kuku pendek bersih tanpa cat kuku, memakai hairnet, masker medis, apron, sarung tangan nitril.',
    isCompliant: true,
    isCCP: false,
    notes: '18 relawan hadir, semua suhu < 36.8°C, APD lengkap',
    checkedAt: '05:30 WIB',
    checkedBy: 'Rian Hidayat (QA)'
  },
  {
    id: 'chk-05',
    code: 'CHK-SAN-02',
    sopRef: 'SOP-047',
    title: 'Kesesuaian Penggunaan Talenan & Pisau Berwarna',
    category: 'Higiene',
    standard: 'Merah (Daging mentah), Biru (Ikan mentah), Hijau (Sayur/Buah), Putih (Makanan matang).',
    isCompliant: true,
    isCCP: false,
    notes: 'Dipatuhi 100%, dilarang mencampur talenan ikan ke sayuran',
    checkedAt: '06:45 WIB',
    checkedBy: 'Tim Prep SPPG'
  },

  // Pengolahan Termal (CCP-2)
  {
    id: 'chk-06',
    code: 'CHK-PRD-01',
    sopRef: 'SOP-024 / SOP-026',
    title: 'Verifikasi Suhu Inti Masakan Protein Hewani (CCP-2)',
    category: 'Pengolahan',
    standard: 'Suhu probe daging/ikan matang WAJIB minimal 74°C s/d 75°C tahan 2 menit sebelum diangkat.',
    isCompliant: true,
    isCCP: true,
    ccpCode: 'CCP-2',
    notes: 'Ketel 1 (Ayam Teriyaki): 78.4°C; Ketel 2 (Ikan Kembung Pesmol): 76.9°C (Lolos)',
    checkedAt: '08:45 WIB',
    checkedBy: 'Jurutama Masak & QA'
  },
  {
    id: 'chk-07',
    code: 'CHK-PRD-02',
    sopRef: 'SOP-015',
    title: 'Protokol Pendinginan / Resting di Ruang Ber-AC',
    category: 'Pengolahan',
    standard: 'Suhu ruang AC < 20°C, uap panas diturunkan hingga < 60°C, durasi resting maksimal 60 menit.',
    isCompliant: true,
    isCCP: false,
    notes: 'Troli gastronorm masuk ruang AC pukul 09:00, siap porsi pukul 09:35',
    checkedAt: '09:35 WIB',
    checkedBy: 'Pengawas Gizi'
  },

  // Pemorsian & Distribusi (CCP-3)
  {
    id: 'chk-08',
    code: 'CHK-DST-01',
    sopRef: 'SOP-014',
    title: 'Uji Petik Berat Porsi Ompreng & Pemasangan Segel 7x5 cm',
    category: 'Distribusi',
    standard: 'Toleransi berat porsi ±5% dari standar AKG; stiker segel tamper-evident terpasang di 2 sisi tutup.',
    isCompliant: true,
    isCCP: false,
    notes: 'Uji petik 5 ompreng: Nasi 132g, Ayam 62g, Tempe 51g, Capcay 82g (Rata-rata 98% akurasi)',
    checkedAt: '09:50 WIB',
    checkedBy: 'Siti Nur Aisyah (Nutrisionis)'
  },
  {
    id: 'chk-09',
    code: 'CHK-DST-02',
    sopRef: 'SOP-031 / SOP-032',
    title: 'Batas Waktu Konsumsi Maksimal 4 Jam (CCP-3)',
    category: 'Distribusi',
    standard: 'Makanan WAJIB dikonsumsi maksimal 4 jam sejak selesai matang (Jam matang tertera pada segel).',
    isCompliant: true,
    isCCP: true,
    ccpCode: 'CCP-3',
    notes: 'Jam matang: 09:00 WIB. Jam batas akhir makan: 13:00 WIB. Siswa makan pukul 11:30 WIB.',
    checkedAt: '10:00 WIB',
    checkedBy: 'Koordinator Distribusi'
  },

  // Retensi Sampel & Sanitasi Limbah
  {
    id: 'chk-10',
    code: 'CHK-LAB-01',
    sopRef: 'SOP-033',
    title: 'Pengambilan 2 Sampel Menu Retensi (Organoleptik & Chiller)',
    category: 'Sampling & Lab',
    standard: '2 sampel per menu (min 100g): 1 diuji sensori harian, 1 disimpan 3x24 jam di chiller bank 2-8°C.',
    isCompliant: true,
    isCCP: false,
    notes: 'Sampel ayam teriyaki & capcay disimpan di Chiller Sampel Bank Rak 2',
    checkedAt: '10:15 WIB',
    checkedBy: 'Pengawas Gizi'
  },
  {
    id: 'chk-11',
    code: 'CHK-WST-01',
    sopRef: 'SOP-052 / SOP-049',
    title: 'Pencucian Ompreng Air 43°C & Pemilahan 5 Sisa Makanan',
    category: 'Sanitasi',
    standard: 'Air panas 43°C food-grade; limbah sisa makanan dipilah 5 wadah untuk timbang food waste.',
    isCompliant: true,
    isCCP: false,
    notes: 'Sisa ompreng dipulangkan pukul 13:30, dicuci di bak 3 bilasan, grease trap dibersihkan',
    checkedAt: '14:00 WIB',
    checkedBy: 'Tim Kebersihan SPPG'
  }
];

export const DailySopChecklist: React.FC<DailySopChecklistProps> = ({
  currentWorkspaceName,
  nutritionistName
}) => {
  const [items, setItems] = useState<SOPChecklistItem[]>(INITIAL_CHECKLIST_ITEMS);
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [inspectorName, setInspectorName] = useState<string>(nutritionistName || 'Siti Nur Aisyah, S.Gz');
  const [verificationSaved, setVerificationSaved] = useState<boolean>(false);
  const [photoMockOpen, setPhotoMockOpen] = useState<string | null>(null);

  const toggleCompliant = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextVal = !item.isCompliant;
          return {
            ...item,
            isCompliant: nextVal,
            checkedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            checkedBy: inspectorName
          };
        }
        return item;
      })
    );
    setVerificationSaved(false);
  };

  const handleNotesChange = (id: string, newNotes: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: newNotes } : item))
    );
    setVerificationSaved(false);
  };

  const compliantCount = items.filter((it) => it.isCompliant).length;
  const complianceRate = Math.round((compliantCount / items.length) * 100);

  const filteredItems = items.filter((it) => {
    if (selectedCat === 'ALL') return true;
    if (selectedCat === 'CCP') return it.isCCP;
    return it.category === selectedCat;
  });

  const handleVerify = () => {
    setVerificationSaved(true);
    setTimeout(() => {
      setVerificationSaved(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Compliance Score */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0052CC]/10 text-[#0052CC]">
              {currentWorkspaceName}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Checklist Harian Mutu & SOP Operasional BGN
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verifikasi real-time kepatuhan 11 pos kritis operasional SPPG sesuai 14 Master Dokumen SOP BGN RI.
          </p>
        </div>

        {/* Live Compliance Gauge */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[240px]">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={complianceRate >= 90 ? 'text-emerald-500' : complianceRate >= 70 ? 'text-amber-500' : 'text-rose-500'}
                strokeDasharray={`${complianceRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-slate-900">{complianceRate}%</span>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tingkat Kepatuhan</div>
            <div className={`text-sm font-bold ${complianceRate >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {complianceRate >= 90 ? 'Sangat Patuh (A+)' : 'Perlu Perbaikan'}
            </div>
            <div className="text-[11px] text-slate-500">{compliantCount} dari {items.length} pos terverifikasi</div>
          </div>
        </div>
      </div>

      {/* Category Filter & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'CCP', 'Penerimaan', 'Higiene', 'Pengolahan', 'Distribusi', 'Sampling & Lab', 'Sanitasi'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                selectedCat === cat
                  ? 'bg-[#0052CC] text-white font-bold shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'CCP' ? '🔥 Hanya CCP (Titik Kritis)' : cat === 'ALL' ? 'Semua Pos' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerify}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Validasi & Tanda Tangan Digital
          </button>
        </div>
      </div>

      {/* Verification Success Banner */}
      {verificationSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Checklist Harian Berhasil Divalidasi & Disimpan ke Sistem Audit BGN (Skor: {complianceRate}%)!
          </div>
          <span className="text-xs text-emerald-700">Digital Sign: {inspectorName}</span>
        </div>
      )}

      {/* Checklist Table / Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              item.isCompliant
                ? 'bg-white border-slate-200'
                : 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-300'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleCompliant(item.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    item.isCompliant
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border-2 border-rose-400 bg-white text-rose-500'
                  }`}
                >
                  {item.isCompliant ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.code}
                    </span>
                    <span className="text-[10px] font-bold text-[#0052CC] bg-blue-50 px-2 py-0.5 rounded">
                      {item.sopRef}
                    </span>
                    {item.isCCP && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                        {item.ccpCode} WAJIB
                      </span>
                    )}
                  </div>

                  <h3 className={`text-sm font-bold ${item.isCompliant ? 'text-slate-900' : 'text-rose-900'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    <strong>Standar Mutu:</strong> {item.standard}
                  </p>

                  {/* Notes input */}
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      placeholder="Catatan inspeksi / nilai suhu / batch..."
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 w-full sm:w-96 focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
                    />
                    <button
                      onClick={() => setPhotoMockOpen(item.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center gap-1 shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      Foto Bukti
                    </button>
                  </div>
                </div>
              </div>

              {/* Status and Timestamp Badge */}
              <div className="text-right shrink-0 text-xs">
                <span
                  className={`inline-block px-2.5 py-1 rounded-full font-bold text-[11px] ${
                    item.isCompliant
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.isCompliant ? 'Memenuhi Standar' : 'Tidak Memenuhi (Temuan)'}
                </span>
                <div className="text-[11px] text-slate-400 mt-1">
                  {item.checkedAt} • {item.checkedBy}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Photo Modal */}
      {photoMockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl border border-slate-200 animate-in fade-in">
            <Camera className="w-10 h-10 text-[#0052CC] mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">Dokumentasi Inspeksi Mutu</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Simulasi lampiran foto inspeksi termometer tusuk, segel ompreng, atau surat jalan armada.
            </p>
            <div className="h-40 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs p-4 mb-4">
              <span>[Kamera Terhubung - Timestamp BGN Otomatis]</span>
              <span className="text-[10px] text-slate-400 mt-1">Latitude/Longitude GPS tervalidasi</span>
            </div>
            <button
              onClick={() => setPhotoMockOpen(null)}
              className="w-full py-2 bg-[#0052CC] text-white rounded-xl text-xs font-bold"
            >
              Simpan Lampiran Bukti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
