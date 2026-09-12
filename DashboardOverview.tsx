import React from 'react';
import { 
  Building2, 
  UtensilsCrossed, 
  ShieldCheck, 
  ShieldAlert, 
  Baby, 
  ScanLine, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  FileSpreadsheet, 
  FileText, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { Workspace, MenuPlan, HACCPLog, MotherRecord, ToddlerRecord, AKGTarget } from '../types';
import { NavTab } from './Navigation';
import { exportMenuToExcel, exportReportToWord, exportReportToPDF } from '../utils/exporters';

interface DashboardOverviewProps {
  workspace: Workspace;
  menu: MenuPlan;
  haccpLogs: HACCPLog[];
  mothers: MotherRecord[];
  toddlers: ToddlerRecord[];
  targetAKG: AKGTarget;
  macroNutrients: { energy: number; protein: number; fat: number; carbs: number; iron: number; calcium: number };
  onNavigate: (tab: NavTab) => void;
  onOpenWorkspaceModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  workspace,
  menu,
  haccpLogs = [],
  mothers = [],
  toddlers = [],
  targetAKG,
  macroNutrients = { energy: 0, protein: 0, fat: 0, carbs: 0, iron: 0, calcium: 0 },
  onNavigate,
  onOpenWorkspaceModal,
}) => {
  const safeLogs = Array.isArray(haccpLogs) ? haccpLogs : [];
  const safeMothers = Array.isArray(mothers) ? mothers : [];
  const safeToddlers = Array.isArray(toddlers) ? toddlers : [];

  const compliantCount = safeLogs.filter((l) => l.isCompliant).length;
  const nonCompliantLogs = safeLogs.filter((l) => !l.isCompliant);
  const complianceRate = safeLogs.length > 0 
    ? Math.round((compliantCount / safeLogs.length) * 100) 
    : 100;

  const kekMothers = safeMothers.filter((m) => m.hasKEK);
  const falteringToddlers = safeToddlers.filter((t) => t.isFalteringT2);

  const safeEnergy = macroNutrients?.energy || 0;
  const safeProtein = macroNutrients?.protein || 0;
  const targetEnergy = targetAKG?.energyKcal || 1;
  const targetProtein = targetAKG?.proteinG || 1;

  const energyPercent = Math.round((safeEnergy / targetEnergy) * 100);
  const proteinPercent = Math.round((safeProtein / targetProtein) * 100);

  return (
    <div className="space-y-6">
      
      {/* Executive Institutional Cockpit Hero */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#0052CC] to-[#0A2540] text-white rounded-2xl p-6 shadow-xl border border-sky-900/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900/80 text-[#38BDF8] border border-blue-700/50">
                PUSAT KOMANDO MUTU BGN
              </span>
              <span className="text-xs text-sky-200">
                Operasional Terpadu Satuan Pelayanan
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {workspace.name}
            </h2>

            <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
              Monitoring harian produksi <strong>{menu.portionCount.toLocaleString()} porsi</strong> makan siang bergizi gratis, verifikasi titik kritis HACCP, serta surveilans gizi 1000 HPK Posyandu Kelompok 3B.
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-1 text-xs text-sky-200">
              <span>Satker: <strong className="text-white">{workspace.code}</strong></span>
              <span>• Wilayah: <strong className="text-white">{workspace.location}</strong></span>
              <span>• PJ Gizi: <strong className="text-white">{workspace.nutritionistName}</strong></span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-slate-900/60 backdrop-blur-xs p-4 rounded-xl border border-white/10 space-y-2.5 shrink-0">
            <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block">
              Aksi Cepat & Ekspor Dokumen
            </span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => exportMenuToExcel(menu, workspace, targetAKG)}
                className="flex items-center justify-between gap-3 px-3 py-2 text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Unduh Excel Pengadaan Bahan
                </span>
                <ArrowRight className="w-3 h-3 text-emerald-200" />
              </button>

              <button
                onClick={() => exportReportToWord(menu, workspace, haccpLogs, targetAKG, macroNutrients)}
                className="flex items-center justify-between gap-3 px-3 py-2 text-xs font-semibold bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Unduh Word Laporan Resmi BGN
                </span>
                <ArrowRight className="w-3 h-3 text-blue-200" />
              </button>

              <button
                onClick={onOpenWorkspaceModal}
                className="flex items-center justify-between gap-3 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-200 rounded-lg transition-colors border border-slate-700"
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Ganti Satuan Pelayanan (SPPG)
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Vital Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Produksi Porsi */}
        <div 
          onClick={() => onNavigate('nutrition')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#0052CC] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Produksi Harian</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052CC] flex items-center justify-center group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {menu.portionCount.toLocaleString()} <span className="text-xs font-normal text-slate-500">Porsi</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Sasaran: {targetAKG.name.split(' ')[0]}</span>
            <span className="font-semibold text-emerald-600">
              {Math.round((menu.portionCount / workspace.capacityPortions) * 100)}% Kapasitas
            </span>
          </div>
        </div>

        {/* Metric 2: Kepatuhan HACCP */}
        <div 
          onClick={() => onNavigate('haccp')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#0052CC] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kepatuhan FSMS/HACCP</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
              complianceRate >= 95 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {complianceRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Verifikasi: {haccpLogs.length} Titik</span>
            {nonCompliantLogs.length > 0 ? (
              <span className="font-bold text-rose-600">{nonCompliantLogs.length} Deviasi</span>
            ) : (
              <span className="font-bold text-emerald-600">Nol Bahaya</span>
            )}
          </div>
        </div>

        {/* Metric 3: Keterpenuhan AKG */}
        <div 
          onClick={() => onNavigate('nutrition')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#0052CC] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kecukupan Gizi Porsi</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0052CC] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono">
            {energyPercent}% <span className="text-xs font-normal text-slate-500">Energi</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Protein: {proteinPercent}% AKG</span>
            <span className="font-semibold text-blue-700">{macroNutrients.protein.toFixed(1)}g / {targetAKG.proteinG}g</span>
          </div>
        </div>

        {/* Metric 4: Kelompok 3B Alerts */}
        <div 
          onClick={() => onNavigate('posyandu')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-pink-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Posyandu 3B & KMS</span>
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Baby className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-pink-700 font-mono">
            {kekMothers.length + falteringToddlers.length} <span className="text-xs font-normal text-slate-500">Kasus Prioritas</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>{kekMothers.length} Bumil KEK</span>
            <span className="font-bold text-pink-600">{falteringToddlers.length} Balita T2</span>
          </div>
        </div>

      </div>

      {/* Critical Deviation / Early Warning Notice */}
      {(nonCompliantLogs.length > 0 || falteringToddlers.length > 0 || kekMothers.length > 0) && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            ATENSI SEGERA PENANGGUNG JAWAB MUTU & GIZI SPPG:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {nonCompliantLogs.map((log) => (
              <div key={log.id} className="p-3 bg-white rounded-xl border border-rose-300 shadow-xs">
                <div className="flex items-center justify-between font-bold text-rose-800 mb-1">
                  <span>Deviasi {log.ccpType}: {log.foodItemName}</span>
                  <span className="font-mono text-sm">{log.measuredValue} {log.unit}</span>
                </div>
                <p className="text-slate-600">
                  Standar: {log.standardThreshold}. <strong>Tindakan:</strong> {log.correctiveAction || 'Lakukan pemanasan ulang/inspeksi.'}
                </p>
              </div>
            ))}

            {falteringToddlers.map((t) => (
              <div key={t.id} className="p-3 bg-white rounded-xl border border-pink-300 shadow-xs">
                <div className="flex items-center justify-between font-bold text-pink-800 mb-1">
                  <span>Posyandu 3B: {t.name} (Balita T2)</span>
                  <span className="text-[10px] bg-pink-100 px-2 py-0.5 rounded-full font-bold">Growth Faltering</span>
                </div>
                <p className="text-slate-600">
                  Berat badan tidak naik 2 bulan beruntun. Segera alokasikan paket PMT Tinggi Protein Hewani Dapur SPPG.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Kitchen Timeline: Penerimaan -> Masak -> Plating -> Distribusi */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0052CC]" />
          Alur Rantai Kendali Operasional Dapur Sentral Hari Ini
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                05:00 - 06:30 WIB
              </span>
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Penerimaan Bahan (CCP-1)</h4>
            <p className="text-xs text-slate-500 mt-1">
              Ukur suhu daging ayam/ikan ≤ 4.0°C. Validasi sertifikat Halal & uji organoleptik.
            </p>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Lolos & Tersimpan di Chiller
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                07:30 - 09:30 WIB
              </span>
              <Flame className="w-4 h-4 text-rose-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Pengolahan Termal (CCP-2)</h4>
            <p className="text-xs text-slate-500 mt-1">
              Pemasakan dengan ketel uap. Suhu inti masakan wajib tervalidasi ≥ 75.0°C selama minimal 2 menit.
            </p>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Termometer Probe Terkalibrasi
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                09:30 - 10:30 WIB
              </span>
              <UtensilsCrossed className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Plating Ompreng & Segel</h4>
            <p className="text-xs text-slate-500 mt-1">
              Penjamah APD lengkap. Wadah ompreng stainless steril. Penempelan segel stiker jam matang.
            </p>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Sampel Retensi 2x24 Jam Diambil
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                10:30 - 12:30 WIB
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Distribusi & Konsumsi (CCP-3)</h4>
            <p className="text-xs text-slate-500 mt-1">
              Armada box insulator tiba di sekolah sasaran. Batas waktu makan maksimal ≤ 4.0 jam dari matang.
            </p>
            <div className="mt-2 text-[11px] font-bold text-blue-700 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Target Konsumsi Pukul 11:45 WIB
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
