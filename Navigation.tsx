import React from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShieldAlert, 
  Baby, 
  ScanLine, 
  Database,
  Building2,
  Heart,
  GitBranch,
  ClipboardCheck,
  BarChart3,
  HardDrive
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'nutrition' 
  | 'edukasi_gizi'
  | 'flowcharts'
  | 'sop_checklist'
  | 'haccp' 
  | 'posyandu' 
  | 'analytics'
  | 'ocr_vault' 
  | 'database_export'
  | 'master_db';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  haccpIssuesCount: number;
  posyanduAlertsCount: number;
  onOpenWorkspaceModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  haccpIssuesCount,
  posyanduAlertsCount,
  onOpenWorkspaceModal,
}) => {
  const tabs = [
    {
      id: 'dashboard' as NavTab,
      label: 'Ringkasan Operasional',
      subtitle: 'Executive Cockpit',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'nutrition' as NavTab,
      label: 'Kalkulator Gizi & Resep',
      subtitle: 'AKG & Skaler 100-3000 Porsi',
      icon: UtensilsCrossed,
      badge: null,
    },
    {
      id: 'edukasi_gizi' as NavTab,
      label: 'Edukasi Gizi & KIA',
      subtitle: '4 Pilar & Isi Piringku',
      icon: Heart,
      badge: 'KIA 2024',
      badgeColor: 'bg-pink-500 text-white',
    },
    {
      id: 'flowcharts' as NavTab,
      label: 'Peta Alur Kerja & SOP',
      subtitle: 'Diagram Alir 9 Tahap BGN',
      icon: GitBranch,
      badge: null,
    },
    {
      id: 'sop_checklist' as NavTab,
      label: 'Checklist Harian SOP',
      subtitle: '11 Pos Kritis & Skor Mutu',
      icon: ClipboardCheck,
      badge: null,
    },
    {
      id: 'haccp' as NavTab,
      label: 'Matriks HACCP & FSMS',
      subtitle: 'CCP-1, CCP-2, CCP-3 Control',
      icon: ShieldAlert,
      badge: haccpIssuesCount > 0 ? `${haccpIssuesCount} Kritis` : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'posyandu' as NavTab,
      label: 'Posyandu 3B & KMS',
      subtitle: 'Bumil KEK, Busui & Balita',
      icon: Baby,
      badge: posyanduAlertsCount > 0 ? `${posyanduAlertsCount} Alert` : null,
      badgeColor: 'bg-pink-500 text-white',
    },
    {
      id: 'analytics' as NavTab,
      label: 'Analitik & AI Insights',
      subtitle: 'Tren Gizi, HPS & Radar Mutu',
      icon: BarChart3,
      badge: 'AI',
      badgeColor: 'bg-sky-500 text-white',
    },
    {
      id: 'ocr_vault' as NavTab,
      label: 'Smart OCR & Vault SOP',
      subtitle: 'Tesseract & Repositori 14 SOP',
      icon: ScanLine,
      badge: null,
    },
    {
      id: 'database_export' as NavTab,
      label: 'Database & Pusat Ekspor',
      subtitle: 'Multi-SPPG, JSON, Excel, Word',
      icon: HardDrive,
      badge: null,
    },
    {
      id: 'master_db' as NavTab,
      label: 'Basis Data TKPI & AKG',
      subtitle: 'Master Komposisi & Nilai BDD',
      icon: Database,
      badge: null,
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-xs sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto py-2 scrollbar-none gap-1.5">
          <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 relative shrink-0 ${
                    isActive
                      ? 'bg-[#0052CC] text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-[#0052CC] hover:bg-sky-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#38BDF8]' : 'text-slate-500'}`} />
                  <div className="text-left">
                    <div className="leading-tight flex items-center gap-1.5">
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${tab.badgeColor || 'bg-blue-600 text-white'}`}>
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-normal block truncate max-w-[130px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {tab.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="md:hidden flex items-center pl-2">
            <button
              onClick={onOpenWorkspaceModal}
              className="p-2 text-xs font-semibold text-[#0052CC] bg-sky-50 rounded-lg border border-sky-200 flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>SPPG</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
