import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  FileDown, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  MapPin, 
  Users, 
  ChefHat, 
  ShieldCheck, 
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { Workspace, MenuPlan, HACCPLog, MotherRecord, ToddlerRecord, AKGTarget, BgnDatabaseBackup } from '../types';
import { exportMenuToExcel, exportMenuToDocx, exportReportToPdf } from '../utils/exporters';
import { DEFAULT_WORKSPACES } from '../data/masterData';

interface DatabaseExportManagerProps {
  currentWorkspace: Workspace;
  allWorkspaces: Workspace[];
  onSelectWorkspace: (wsId: string) => void;
  onCreateWorkspace: (newWs: Workspace) => void;
  currentMenu: MenuPlan;
  haccpLogs: HACCPLog[];
  mothers: MotherRecord[];
  toddlers: ToddlerRecord[];
  targetAKG: AKGTarget;
}

export const DatabaseExportManager: React.FC<DatabaseExportManagerProps> = ({
  currentWorkspace,
  allWorkspaces,
  onSelectWorkspace,
  onCreateWorkspace,
  currentMenu,
  haccpLogs,
  mothers,
  toddlers,
  targetAKG
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsCode, setNewWsCode] = useState('');
  const [newWsLocation, setNewWsLocation] = useState('');
  const [newWsCapacity, setNewWsCapacity] = useState(3000);
  const [newWsHead, setNewWsHead] = useState('');
  const [newWsNutritionist, setNewWsNutritionist] = useState('');
  const [newWsQA, setNewWsQA] = useState('');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim() || !newWsCode.trim()) {
      showNotify('Nama unit dan kode unit SPPG wajib diisi!', 'error');
      return;
    }

    const createdWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: newWsName.trim(),
      code: newWsCode.trim(),
      location: newWsLocation.trim() || 'Wilayah Operasional BGN',
      capacityPortions: Number(newWsCapacity) || 3000,
      headOfKitchen: newWsHead.trim() || 'Kepala Satuan Pelayanan',
      nutritionistName: newWsNutritionist.trim() || 'Ahli Gizi SPPG, S.Gz',
      qaOfficerName: newWsQA.trim() || 'Lead Food Safety SPPG',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateWorkspace(createdWs);
    setShowCreateModal(false);
    showNotify(`Database unit "${createdWs.name}" berhasil dibuat & diaktifkan!`, 'success');

    // Reset form
    setNewWsName('');
    setNewWsCode('');
    setNewWsLocation('');
    setNewWsHead('');
    setNewWsNutritionist('');
    setNewWsQA('');
  };

  // Export Full JSON Backup
  const handleExportJSON = () => {
    try {
      const backupData: BgnDatabaseBackup = {
        appName: 'BGN Quality & Safety Hub',
        exportedAt: new Date().toISOString(),
        version: 'v2.4-2026',
        activeWorkspaceId: currentWorkspace.id,
        workspaces: allWorkspaces,
        workspaceData: {
          [currentWorkspace.id]: {
            menu: currentMenu,
            haccpLogs,
            mothers,
            toddlers
          }
        }
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BGN_Database_Backup_${currentWorkspace.code}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotify('Berkas cadangan penuh (.json) berhasil diunduh!', 'success');
    } catch (err) {
      showNotify('Gagal membuat cadangan JSON: ' + String(err), 'error');
    }
  };

  // Import JSON Restore
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.workspaces || !Array.isArray(parsed.workspaces)) {
          throw new Error('Format berkas cadangan JSON tidak valid.');
        }

        // Save imported workspaces and data to localStorage
        localStorage.setItem('BGN_HUB_v1_workspaces', JSON.stringify(parsed.workspaces));
        if (parsed.activeWorkspaceId) {
          localStorage.setItem('BGN_HUB_v1_active_ws', parsed.activeWorkspaceId);
        }

        showNotify('Database berhasil dipulihkan dari cadangan! Memuat ulang...', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        showNotify('Gagal membaca cadangan JSON: ' + String(err), 'error');
      }
    };
    reader.readAsText(file);
  };

  // Quick Exports
  const handleExportExcel = () => {
    try {
      exportMenuToExcel(currentMenu, currentWorkspace, targetAKG);
      showNotify('Laporan Pengadaan Excel (.xlsx) dengan formula berhasil diunduh!', 'success');
    } catch (err) {
      showNotify('Gagal ekspor Excel: ' + String(err), 'error');
    }
  };

  const handleExportDocx = () => {
    try {
      exportMenuToDocx(currentMenu, currentWorkspace, haccpLogs, targetAKG);
      showNotify('Dossier Resmi Word (.docx) dengan kop surat BGN berhasil diunduh!', 'success');
    } catch (err) {
      showNotify('Gagal ekspor Word: ' + String(err), 'error');
    }
  };

  const handleExportPdf = () => {
    try {
      exportReportToPdf(currentMenu, currentWorkspace, haccpLogs, targetAKG);
      showNotify('Dokumen Audit PDF (.pdf) siap cetak berhasil diunduh!', 'success');
    } catch (err) {
      showNotify('Gagal ekspor PDF: ' + String(err), 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0A2540] text-white p-6 sm:p-8 rounded-2xl border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-200 border border-sky-400/30 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                Multi-Tenant Workspace & Export Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200">
                Offline First (Local Storage)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manajemen Basis Data & Pusat Ekspor Dokumen BGN
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Kelola beberapa unit SPPG terisolasi (Dapur Bogor, Jakarta Pusat, Pilot Sukabumi), cadangkan seluruh basis data ke berkas JSON terenkripsi, atau unduh laporan operasional berstandar resmi BGN (Excel, Word, PDF).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[#0052CC] hover:bg-blue-600 text-white flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Buat Unit Dapur Baru
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 shadow-sm animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border border-rose-300 text-rose-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* SECTION 1: WORKSPACES LIST */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0052CC]" />
              Daftar Satuan Pelayanan (SPPG) Aktif
            </h2>
            <p className="text-xs text-slate-500">
              Setiap SPPG memiliki isolasi data menu, log CCP-1/2/3, serta pemantauan sasaran 3B masing-masing.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-[#0052CC]">
            {allWorkspaces.length} Unit Terdaftar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allWorkspaces.map((ws) => {
            const isActive = ws.id === currentWorkspace.id;

            return (
              <div
                key={ws.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-blue-50/40 border-[#0052CC] ring-2 ring-blue-400/30 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {ws.code}
                  </span>
                  {isActive ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Sedang Aktif
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectWorkspace(ws.id)}
                      className="text-xs font-bold text-[#0052CC] hover:underline"
                    >
                      Beralih ke Unit Ini
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">{ws.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{ws.location}</span>
                </p>

                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Kapasitas Porsi:</span>
                    <span className="font-bold text-slate-800">{ws.capacityPortions.toLocaleString('id-ID')} Porsi/Hari</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Kepala SPPG:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[140px]">{ws.headOfKitchen}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Pengawas Gizi:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[140px]">{ws.nutritionistName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: EXPORT & BACKUP CENTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Formats */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileDown className="w-5 h-5 text-[#0052CC]" />
                Ekspor Laporan Operasional Resmi BGN
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unduh berkas laporan dengan format dan kop resmi siap kirim ke pimpinan BGN Pusat.
              </p>
            </div>

            <div className="space-y-3">
              {/* Excel */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-emerald-50/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Microsoft Excel (.xlsx)</h4>
                    <p className="text-[11px] text-slate-500">Kalkulasi formula gramasi bruto, BDD, dan estimasi anggaran HPS.</p>
                  </div>
                </div>
                <button
                  onClick={handleExportExcel}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 transition-colors shadow-2xs"
                >
                  Unduh Excel
                </button>
              </div>

              {/* Word */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-blue-50/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0052CC] text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Microsoft Word (.docx)</h4>
                    <p className="text-[11px] text-slate-500">Dossier lengkap dengan Kop Surat resmi dan 3 blok tanda tangan pengesahan.</p>
                  </div>
                </div>
                <button
                  onClick={handleExportDocx}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0052CC] hover:bg-blue-700 text-white shrink-0 transition-colors shadow-2xs"
                >
                  Unduh Word
                </button>
              </div>

              {/* PDF */}
              <div className="p-3.5 rounded-xl border border-slate-200 hover:border-rose-300 bg-rose-50/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Dokumen PDF (.pdf)</h4>
                    <p className="text-[11px] text-slate-500">Laporan ringkasan audit mutu siap cetak dengan matriks CCP terverifikasi.</p>
                  </div>
                </div>
                <button
                  onClick={handleExportPdf}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shrink-0 transition-colors shadow-2xs"
                >
                  Unduh PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Database JSON Backup & Restore */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#0052CC]" />
                Cadangkan & Pulihkan Basis Data (JSON)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simpan seluruh data workspace, resep gizi, log CCP, dan data KMS ke berkas JSON lokal untuk backup aman tanpa internet.
              </p>
            </div>

            <div className="space-y-4">
              {/* Backup */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Unduh Cadangan Lengkap (.json)</h4>
                  <p className="text-[11px] text-slate-500">Mencakup menu, log CCP, ibu hamil, balita, dan checklist.</p>
                </div>
                <button
                  onClick={handleExportJSON}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  Ekspor JSON
                </button>
              </div>

              {/* Restore */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Pulihkan dari Berkas (.json)</h4>
                  <p className="text-[11px] text-slate-500">Impor cadangan sebelumnya untuk memulihkan seluruh rekaman.</p>
                </div>
                <label className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs">
                  <Upload className="w-4 h-4 text-[#0052CC]" />
                  <span>Pilih File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Data tersimpan di penyimpanan lokal peramban (IndexedDB / LocalStorage) dengan enkripsi integritas BGN.
          </div>
        </div>
      </div>

      {/* CREATE WORKSPACE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0052CC]" />
                Tambah Satuan Pelayanan (SPPG) Baru
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Unit SPPG *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SPPG Dapur Mandiri Bandung Wetan"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kode Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="BGN-SPPG-BDG-004"
                    value={newWsCode}
                    onChange={(e) => setNewWsCode(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kapasitas Porsi/Hari</label>
                  <input
                    type="number"
                    value={newWsCapacity}
                    onChange={(e) => setNewWsCapacity(parseInt(e.target.value) || 0)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Lokasi Dapur</label>
                <input
                  type="text"
                  placeholder="Kec. Cidadap, Kota Bandung, Jawa Barat"
                  value={newWsLocation}
                  onChange={(e) => setNewWsLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kepala Satuan Pelayanan</label>
                  <input
                    type="text"
                    placeholder="Mayor (Purn) Bambang Hermanto"
                    value={newWsHead}
                    onChange={(e) => setNewWsHead(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ahli Gizi (Nutrisionis)</label>
                  <input
                    type="text"
                    placeholder="Siti Nur Aisyah, S.Gz, RD"
                    value={newWsNutritionist}
                    onChange={(e) => setNewWsNutritionist(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0052CC] hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  Simpan & Buat Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
