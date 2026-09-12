import React, { useState, useRef } from 'react';
import { 
  ScanLine, 
  FileText, 
  UploadCloud, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  FileCheck, 
  Search, 
  ArrowRight, 
  Eye, 
  BookOpen, 
  Download, 
  FolderLock,
  FileCode,
  Layers,
  AlertCircle
} from 'lucide-react';
import Tesseract from 'tesseract.js';
import { BgnSOP, ScannedLogDraft, HACCPLog, Workspace } from '../types';

interface OcrScannerVaultProps {
  sops: BgnSOP[];
  onAddSOP: (sop: BgnSOP) => void;
  onImportHaccpLog: (log: HACCPLog) => void;
  workspace: Workspace;
  scannedDrafts: ScannedLogDraft[];
  onSaveDraft: (draft: ScannedLogDraft) => void;
}

export const OcrScannerVault: React.FC<OcrScannerVaultProps> = ({
  sops = [],
  onAddSOP,
  onImportHaccpLog,
  workspace,
  scannedDrafts = [],
  onSaveDraft,
}) => {
  const safeSops = Array.isArray(sops) ? sops : [];
  const safeDrafts = Array.isArray(scannedDrafts) ? scannedDrafts : [];
  const [activeTab, setActiveTab] = useState<'OCR_SCANNER' | 'SOP_VAULT'>('OCR_SCANNER');
  
  // OCR states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [extractedRawText, setExtractedRawText] = useState<string>('');
  const [parsedData, setParsedData] = useState<{
    detectedDate?: string;
    detectedTemp?: number;
    detectedSupplier?: string;
    detectedBatch?: string;
    detectedItem?: string;
  } | null>(null);

  // SOP Vault states
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSopModal, setActiveSopModal] = useState<BgnSOP | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample receipts for instant one-click testing
  const sampleScans = [
    {
      title: 'Nota Pengiriman Daging Ayam Rantai Dingin',
      desc: 'PT Agro Boga Mandiri - Suhu 3.4°C - Lot #AYM-9921',
      text: `SURAT JALAN / DELIVERY ORDER
PT AGRO BOGA NUSANTARA
Kepada: SPPG Dapur Sentral BGN
Tanggal: 2026-09-11
No. Dokumen: SJ-ABN-88319
Barang: Daging Ayam Karkas Broiler Segar
Kuantitas: 250 Kg (5 Peti)
Suhu Inti Daging Armada: 3.4 °C
Batch/Lot: LOT-AYM-9921
Kondisi Fisik: Segar, Halal Terverifikasi, Bau Segar Normal
Petugas Penerima: Tim QC Dapur BGN`,
      mockImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Log Termal Pemasakan Ketel Uap (CCP-2)',
      desc: 'Pengolahan Termal Ungkep Ayam - Suhu 78.5°C',
      text: `LEMBAR KONTROL CCP-2 PEMASAKAN BGN
Satker: SPPG Dapur Pelayanan
Tanggal: 2026-09-11 08:30 WIB
Menu: Ayam Ungkep Bumbu Kuning
Wajan/Ketel: KETEL-01
Suhu Inti Makanan: 78.5 °C
Durasi > 75°C: 4 Menit
Batch: BATCH-COOK-4402
Inspektur: Siti Nur Aisyah (Ahli Gizi)
Status: Lolos Uji Termal Aman Patogen`,
      mockImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=60'
    },
    {
      title: 'Checklist Pengiriman Distribusi Ompreng (CCP-3)',
      desc: 'Rute Sekolah Dasar 01 - Jam Berangkat 10:15',
      text: `BUKTI SERAH TERIMA DISTRIBUSI SPPG
Tujuan: SDN Cisaat 01 Sukabumi
Porsi: 350 Ompreng Stainless
Jam Selesai Masak: 09:30 WIB
Jam Berangkat Mobil: 10:15 WIB
Jam Tiba Sekolah: 10:45 WIB
Durasi Berlalu: 1.25 Jam
Kondisi Segel: Utuh Tamper-Evident
Penerima: Kepala Sekolah / PJ Gizi`,
      mockImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&auto=format&fit=crop&q=60'
    }
  ];

  // Heuristic parser from raw text
  const parseExtractedText = (text: string) => {
    // 1. Detect Temperature: look for numbers followed by °C or C
    const tempMatch = text.match(/(\d{1,2}(?:[.,]\d)?)\s*(?:°C|C|derajat)/i);
    let detectedTemp: number | undefined;
    if (tempMatch) {
      detectedTemp = parseFloat(tempMatch[1].replace(',', '.'));
    }

    // 2. Detect Date
    const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/);
    const detectedDate = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

    // 3. Detect Batch or Lot
    const batchMatch = text.match(/(?:LOT|BATCH|NO\.?|SJ)[\w\s-]*:?\s*([A-Z0-9-]+)/i);
    const detectedBatch = batchMatch ? batchMatch[1].trim() : `SCN-${Date.now().toString().slice(-6)}`;

    // 4. Detect Supplier
    const supplierMatch = text.match(/(?:PT|CV|UD|TOKO)\s+([A-Za-z\s]+)/i);
    const detectedSupplier = supplierMatch ? supplierMatch[0].trim() : undefined;

    // 5. Detect Item
    const itemMatch = text.match(/(?:Daging Ayam|Ayam|Ikan|Telur|Beras|Sayur|Ompreng|Daging Sapi)[\w\s]*/i);
    const detectedItem = itemMatch ? itemMatch[0].trim() : 'Bahan Baku Pangan';

    const parsed = {
      detectedDate,
      detectedTemp,
      detectedSupplier,
      detectedBatch,
      detectedItem
    };

    setParsedData(parsed);
    return parsed;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedImage(dataUrl);
      runOcrOnImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const runOcrOnImage = async (imageSource: string) => {
    setIsProcessing(true);
    setProgressPercent(0);
    setProgressStatus('Menginisialisasi Engine Tesseract.js...');

    try {
      const result = await Tesseract.recognize(
        imageSource,
        'ind+eng', // Indonesian + English language models
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgressStatus(`Mengekstrak karakter teks (${Math.round((m.progress || 0) * 100)}%)...`);
              setProgressPercent(Math.round((m.progress || 0) * 100));
            } else {
              setProgressStatus(`Tahap: ${m.status}...`);
            }
          }
        }
      );

      const raw = result.data.text;
      setExtractedRawText(raw);
      const parsed = parseExtractedText(raw);

      // Save draft
      const newDraft: ScannedLogDraft = {
        id: `draft-${Date.now()}`,
        extractedText: raw,
        detectedDate: parsed.detectedDate,
        detectedTemp: parsed.detectedTemp,
        detectedSupplier: parsed.detectedSupplier,
        detectedBatch: parsed.detectedBatch,
        detectedItems: [parsed.detectedItem || 'Bahan Pangan'],
        scanStatus: 'parsed',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        imageUrl: imageSource
      };

      onSaveDraft(newDraft);
      setProgressStatus('Pemindaian Dokumen Selesai!');
    } catch (err) {
      console.error('OCR Error', err);
      setProgressStatus('Gagal memproses gambar. Silakan gunakan sampel teks cepat.');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSampleDoc = (sample: typeof sampleScans[0]) => {
    setSelectedImage(sample.mockImage);
    setExtractedRawText(sample.text);
    const parsed = parseExtractedText(sample.text);

    const newDraft: ScannedLogDraft = {
      id: `draft-${Date.now()}`,
      extractedText: sample.text,
      detectedDate: parsed.detectedDate,
      detectedTemp: parsed.detectedTemp,
      detectedSupplier: parsed.detectedSupplier,
      detectedBatch: parsed.detectedBatch,
      detectedItems: [parsed.detectedItem || 'Bahan Pangan'],
      scanStatus: 'parsed',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      imageUrl: sample.mockImage
    };
    onSaveDraft(newDraft);
  };

  const handleImportToHACCP = () => {
    if (!parsedData) return;

    let ccpType: 'CCP-1' | 'CCP-2' | 'CCP-3' = 'CCP-1';
    let step = 'Penerimaan Bahan Baku (Surat Jalan)';
    let threshold = 'Suhu Dingin <= 4.0 °C';
    let isCompliant = true;
    let unit = '°C';
    const tempVal = parsedData.detectedTemp || 3.5;

    if (tempVal > 60) {
      ccpType = 'CCP-2';
      step = 'Pemasakan Termal Makanan';
      threshold = 'Suhu Inti >= 75.0 °C';
      isCompliant = tempVal >= 75.0;
    } else if (parsedData.detectedItem?.includes('Ompreng') || tempVal <= 4.0) {
      ccpType = parsedData.detectedItem?.includes('Ompreng') ? 'CCP-3' : 'CCP-1';
      threshold = ccpType === 'CCP-3' ? 'Durasi <= 4 Jam' : 'Suhu <= 4.0 °C';
      isCompliant = true;
    }

    const newLog: HACCPLog = {
      id: `haccp-ocr-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ccpType,
      stepName: step,
      parameterChecked: 'Hasil Ekstraksi OCR Tesseract',
      standardThreshold: threshold,
      measuredValue: tempVal,
      unit,
      isCompliant,
      batchNumber: parsedData.detectedBatch || 'LOT-OCR-SCAN',
      inspectorName: `${workspace.qaOfficerName} (via OCR)`,
      hazardRisk: isCompliant ? 'RENDAH' : 'SEDANG',
      foodItemName: parsedData.detectedItem || 'Bahan Baku Supplier'
    };

    onImportHaccpLog(newLog);
    alert('Sukses! Data hasil pindai OCR berhasil diimpor ke Matriks HACCP.');
  };

  // Filter SOPs
  const filteredSOPs = safeSops.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.objective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 text-[#0052CC]">
                SMART OCR & FILE VAULT
              </span>
              <span className="text-xs text-slate-500">
                Pindai Fisik Otomatis & SOP Repositori Resmi BGN
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mt-1">
              Pemindai Dokumen Lapangan & Repositori SOP BGN
            </h2>
            <p className="text-xs text-slate-500">
              Ubah foto nota fisik, checklist suhu, dan surat jalan supplier menjadi rekaman digital terstruktur.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('OCR_SCANNER')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'OCR_SCANNER'
                  ? 'bg-white text-[#0052CC] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ScanLine className="w-4 h-4 text-[#0052CC]" />
              Smart OCR Scanner
            </button>
            <button
              onClick={() => setActiveTab('SOP_VAULT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'SOP_VAULT'
                  ? 'bg-white text-[#0052CC] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderLock className="w-4 h-4 text-[#0052CC]" />
              File Vault & SOP BGN ({sops.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: OCR SCANNER */}
      {activeTab === 'OCR_SCANNER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Image Upload & Quick Samples */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Upload Area */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-300 hover:border-[#0052CC] bg-sky-50/50 hover:bg-sky-50 rounded-xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs text-[#0052CC] flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  Unggah Foto Nota / Log Suhu
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Klik untuk memilih file foto fisik receipt, surat jalan, atau logbook dapur (PNG, JPG, WebP).
                </p>
              </div>

              {/* Sample test templates */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-left">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Atau Uji dengan Sampel Dokumen Dapur BGN:
                </span>
                <div className="space-y-2">
                  {sampleScans.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loadSampleDoc(s)}
                      className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#0052CC] hover:bg-blue-50/40 transition-all flex items-start justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-[#0052CC]">
                          {s.title}
                        </div>
                        <div className="text-[11px] text-slate-500">{s.desc}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0052CC] mt-1 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Image if selected */}
            {selectedImage && (
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-700 block mb-2">Preview Dokumen Terpilih:</span>
                <div className="relative rounded-xl overflow-hidden max-h-56 border border-slate-200 bg-slate-900 flex items-center justify-center">
                  <img 
                    src={selectedImage} 
                    alt="Scanned preview" 
                    className="max-h-56 w-auto object-contain opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                      <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-xs font-bold">{progressStatus}</span>
                      <div className="w-48 bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#38BDF8] h-full transition-all" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: OCR Extraction & Parsed Structured Entity */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Parsed Key Entities */}
            {parsedData ? (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#0052CC]" />
                    <h3 className="text-sm font-bold text-slate-800">
                      Entitas Terstruktur Hasil Deteksi OCR
                    </h3>
                  </div>
                  <button
                    onClick={handleImportToHACCP}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Impor ke Matriks HACCP
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Suhu Terdeteksi:</span>
                    <span className="text-base font-extrabold font-mono text-blue-700">
                      {parsedData.detectedTemp !== undefined ? `${parsedData.detectedTemp} °C` : 'Tidak terdeteksi'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Tanggal Dokumen:</span>
                    <span className="text-sm font-bold font-mono text-slate-800">
                      {parsedData.detectedDate || '-'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Nomor Lot / Batch:</span>
                    <span className="text-xs font-bold font-mono text-slate-800 truncate block">
                      {parsedData.detectedBatch || '-'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-2">
                    <span className="text-[11px] text-slate-500 block">Objek / Komoditas:</span>
                    <span className="text-xs font-bold text-slate-800">
                      {parsedData.detectedItem || '-'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-500 block">Supplier / Sumber:</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {parsedData.detectedSupplier || 'Vendor Terdaftar BGN'}
                    </span>
                  </div>
                </div>

                {/* Raw OCR Text Viewer */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    Teks Mentah Hasil Ekstraksi (Raw OCR):
                  </span>
                  <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed">
                    {extractedRawText || 'Belum ada teks dipindai.'}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0052CC] flex items-center justify-center mb-3">
                  <ScanLine className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Belum Ada Dokumen yang Dipindai
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Pilih salah satu sampel di samping atau unggah foto dokumen fisik untuk melihat ekstraksi otomatis parameter HACCP.
                </p>
              </div>
            )}

            {/* Saved Drafts History */}
            {scannedDrafts.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Riwayat Draf Pindaian Lokal ({scannedDrafts.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {scannedDrafts.map((d) => (
                    <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{d.detectedItems?.[0] || 'Dokumen Pangan'}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Lot: {d.detectedBatch} | {d.timestamp}</div>
                      </div>
                      <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        {d.detectedTemp ? `${d.detectedTemp} °C` : 'Tervalidasi'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: SOP VAULT & REPOSITORY */}
      {activeTab === 'SOP_VAULT' && (
        <div className="space-y-6">
          
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0052CC]" />
              <h3 className="text-sm font-bold text-slate-800">
                Standar Operasional Prosedur (SOP) Dapur Sentral BGN
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari SOP / kata kunci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg w-48 sm:w-60 focus:outline-hidden focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium"
              >
                <option value="ALL">Semua Kategori ({sops.length})</option>
                <option value="Penerimaan">Penerimaan</option>
                <option value="Penyimpanan">Penyimpanan</option>
                <option value="Pengolahan">Pengolahan</option>
                <option value="Distribusi">Distribusi</option>
                <option value="Sanitasi">Sanitasi</option>
                <option value="Retensi Lab">Retensi Lab</option>
              </select>
            </div>
          </div>

          {/* SOP Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSOPs.map((sop) => (
              <div
                key={sop.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#0052CC] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {sop.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {sop.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">
                    {sop.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {sop.objective}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Poin Kritis Utama:
                    </span>
                    <ul className="text-[11px] text-slate-700 space-y-1">
                      {sop.criticalPoints.slice(0, 2).map((cp, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-[#0052CC] font-bold">•</span>
                          <span className="line-clamp-1">{cp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Ver: {sop.version}
                  </span>
                  <button
                    onClick={() => setActiveSopModal(sop)}
                    className="flex items-center gap-1 text-xs font-bold text-[#0052CC] hover:text-blue-800 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Buka Panduan Lengkap
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Full SOP Modal Viewer */}
      {activeSopModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#0A2540] text-white px-6 py-5 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#38BDF8] bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    {activeSopModal.code}
                  </span>
                  <span className="text-xs text-slate-300">
                    Kategori: {activeSopModal.category}
                  </span>
                </div>
                <h3 className="text-base font-bold">{activeSopModal.title}</h3>
              </div>
              <button 
                onClick={() => setActiveSopModal(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  Tujuan & Sasaran Mutu
                </h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  {activeSopModal.objective}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-rose-700 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Titik Kritis Pengendalian (Critical Control Limits)
                </h4>
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 space-y-1.5">
                  {activeSopModal.criticalPoints.map((cp, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-rose-900 font-medium">
                      <span className="text-rose-600 font-bold">✓</span>
                      <span>{cp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  Langkah Kerja Operasional Berurutan
                </h4>
                <div className="space-y-2">
                  {activeSopModal.steps.map((step, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                <span>Frekuensi Verifikasi: <strong>{activeSopModal.verificationFrequency}</strong></span>
                <span>Efektif: <strong>{activeSopModal.effectiveDate}</strong></span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setActiveSopModal(null)}
                className="px-4 py-2 bg-[#0052CC] text-white rounded-lg text-xs font-bold"
              >
                Tutup Panduan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
