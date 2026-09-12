import React from 'react';
import { 
  Building2, 
  ChevronDown, 
  ShieldCheck, 
  FileSpreadsheet, 
  FileText, 
  Download,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { Workspace, MenuPlan, HACCPLog, AKGTarget } from '../types';
import { exportMenuToExcel, exportReportToWord, exportReportToPDF } from '../utils/exporters';

interface HeaderProps {
  currentWorkspace: Workspace;
  allWorkspaces?: Workspace[];
  workspaces?: Workspace[];
  activeWorkspace?: Workspace;
  onSelectWorkspace?: (ws: any) => void;
  onOpenWorkspaceModal: () => void;
  activeMenu?: MenuPlan;
  haccpLogs?: HACCPLog[];
  targetAKG?: AKGTarget;
  macroNutrients?: { energy: number; protein: number; fat: number; carbs: number; iron: number; calcium: number };
  onExportExcel?: () => void;
  onExportWord?: () => void;
  onExportPDF?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWorkspace,
  activeWorkspace,
  onOpenWorkspaceModal,
  activeMenu,
  haccpLogs = [],
  targetAKG,
  macroNutrients,
  onExportExcel,
  onExportWord,
  onExportPDF,
}) => {
  const ws = currentWorkspace || activeWorkspace;
  const safeLogs = Array.isArray(haccpLogs) ? haccpLogs : [];

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const compliantLogsCount = safeLogs.filter(l => l.isCompliant).length;
  const compliancePercent = safeLogs.length > 0 
    ? Math.round((compliantLogsCount / safeLogs.length) * 100) 
    : 100;

  return (
    <header className="bg-[#0A2540] text-white sticky top-0 z-40 shadow-lg border-b border-sky-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Agency Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0052CC] to-[#38BDF8] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0A2540] rounded-[10px] flex items-center justify-center">
                <Award className="w-7 h-7 text-[#38BDF8]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold tracking-wider uppercase px-2 py-0.5 bg-blue-900/80 text-[#38BDF8] rounded border border-blue-700/50">
                  REPUBLIK INDONESIA
                </span>
                <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SOP Terverifikasi
                </span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                BADAN GIZI NASIONAL
                <span className="text-xs font-normal text-slate-300 font-mono">| Quality & Safety Hub</span>
              </h1>
            </div>
          </div>

          {/* Center: Workspace Selector Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenWorkspaceModal}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-all shadow-inner group"
              title="Ganti atau Kelola Unit Satuan Pelayanan (SPPG)"
            >
              <div className="w-8 h-8 rounded-md bg-[#0052CC]/40 text-[#38BDF8] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium leading-none">Satuan Pelayanan (SPPG)</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm font-semibold text-white group-hover:text-[#38BDF8] transition-colors">
                    {ws?.name || 'Satuan Pelayanan SPPG'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            </button>
          </div>

          {/* Right Action: Multi-Format Exporters & Date */}
          <div className="flex items-center gap-2.5">
            <div className="hidden xl:flex flex-col text-right mr-2">
              <span className="text-xs text-slate-300 flex items-center justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                {currentDateFormatted}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">
                HACCP Score: {compliancePercent}% Kepatuhan
              </span>
            </div>

            {/* Quick Export Group */}
            <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => {
                  if (onExportExcel) {
                    onExportExcel();
                  } else if (activeMenu && ws && targetAKG) {
                    exportMenuToExcel(activeMenu, ws, targetAKG);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-950/60 hover:text-emerald-200 rounded transition-colors"
                title="Unduh Lembar Kerja Excel dengan Formula Native BDD"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <div className="h-4 w-[1px] bg-slate-700 mx-0.5"></div>
              <button
                onClick={() => {
                  if (onExportWord) {
                    onExportWord();
                  } else if (activeMenu && ws && targetAKG && macroNutrients) {
                    exportReportToWord(activeMenu, ws, safeLogs, targetAKG, macroNutrients);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-950/60 hover:text-sky-200 rounded transition-colors"
                title="Unduh Laporan Resmi Word dengan Kop & Blok Tanda Tangan"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Word</span>
              </button>
              <div className="h-4 w-[1px] bg-slate-700 mx-0.5"></div>
              <button
                onClick={() => {
                  if (onExportPDF) {
                    onExportPDF();
                  } else if (activeMenu && ws && targetAKG && macroNutrients) {
                    exportReportToPDF(activeMenu, ws, safeLogs, targetAKG, macroNutrients);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-950/60 hover:text-rose-200 rounded transition-colors"
                title="Unduh Laporan PDF Siap Cetak"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
