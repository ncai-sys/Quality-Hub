/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  loadAppData, 
  saveAppData, 
  calculateMacroNutrients 
} from './utils/storage';
import { 
  BGN_TARGET_AKG_2026, 
  BGN_SOPS 
} from './data/masterData';
import { 
  Workspace, 
  MenuPlan, 
  RecipeIngredient, 
  HACCPLog, 
  MotherRecord, 
  ToddlerRecord, 
  ToddlerMeasurement, 
  BgnSOP, 
  ScannedLogDraft, 
  AgeGroupCategory 
} from './types';

// Core Components
import { SupervisorChatbot } from './components/SupervisorChatbot';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardOverview } from './components/DashboardOverview';
import { NutritionCalculator } from './components/NutritionCalculator';
import { EdukasiGiziSeimbang } from './components/EdukasiGiziSeimbang';
import { ProcessFlowchart } from './components/ProcessFlowchart';
import { DailySopChecklist } from './components/DailySopChecklist';
import { HaccpMatrix } from './components/HaccpMatrix';
import { PosyanduModule } from './components/PosyanduModule';
import { AnalyticsAiInsights } from './components/AnalyticsAiInsights';
import { OcrScannerVault } from './components/OcrScannerVault';
import { DatabaseExportManager } from './components/DatabaseExportManager';
import { MasterDatabaseViewer } from './components/MasterDatabaseViewer';
import { WorkspaceModal } from './components/WorkspaceModal';

// Exporters
import { 
  exportMenuToExcel, 
  exportReportToWord, 
  exportReportToPDF 
} from './utils/exporters';

export default function App() {
  // 1. App State Initialization from LocalStorage
  const [appData, setAppData] = useState(() => loadAppData());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  // Sync to LocalStorage on every state update
  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  // Current Workspace
  const currentWorkspace = useMemo(() => {
    const list = Array.isArray(appData?.workspaces) ? appData.workspaces : [];
    return (
      list.find((w) => w.id === appData?.activeWorkspaceId) ||
      list[0] || {
        id: 'ws-bogor-01',
        name: 'SPPG Dapur Mandiri Bogor',
        code: 'BGN-SPPG-BGR-001',
        location: 'Kec. Bogor Tengah, Kota Bogor, Jawa Barat',
        capacityPortions: 3000,
        headOfKitchen: 'Mayor (Purn) Hendra Gunawan',
        nutritionistName: 'Siti Nur Aisyah, S.Gz, RD',
        qaOfficerName: 'Rian Hidayat, S.TP (Lead QA)',
        createdAt: '2026-01-15'
      }
    );
  }, [appData?.workspaces, appData?.activeWorkspaceId]);

  // Current Menu Plan for this workspace
  const currentMenu = useMemo(() => {
    const menus = Array.isArray(appData?.menus) ? appData.menus : [];
    return (
      menus.find((m) => m.id.includes(currentWorkspace.id)) ||
      menus[0]
    );
  }, [appData?.menus, currentWorkspace.id]);

  // Current Target AKG
  const currentTargetAKG = useMemo(() => {
    return BGN_TARGET_AKG_2026[currentMenu?.targetGroup] || BGN_TARGET_AKG_2026.SD_BESAR;
  }, [currentMenu?.targetGroup]);

  // Current Macro & Micronutrients for the active menu
  const macroNutrients = useMemo(() => {
    return calculateMacroNutrients(currentMenu?.ingredients || []);
  }, [currentMenu?.ingredients]);

  // Filter HACCP logs for current workspace
  const currentHaccpLogs = useMemo(() => {
    const logs = Array.isArray(appData?.haccpLogs) ? appData.haccpLogs : [];
    return logs.filter((l) => !l.id.includes('other'));
  }, [appData?.haccpLogs]);

  // Alert counters for Navigation badge indicators
  const haccpAlerts = useMemo(() => {
    return currentHaccpLogs.filter((l) => !l.isCompliant).length;
  }, [currentHaccpLogs]);

  const posyanduAlerts = useMemo(() => {
    const moms = Array.isArray(appData?.mothers) ? appData.mothers : [];
    const tods = Array.isArray(appData?.toddlers) ? appData.toddlers : [];
    const kekCount = moms.filter((m) => m.hasKEK).length;
    const t2Count = tods.filter((t) => t.isFalteringT2).length;
    return kekCount + t2Count;
  }, [appData?.mothers, appData?.toddlers]);

  // --- HANDLERS ---

  // Workspace Switch & Management
  const handleSelectWorkspace = (target: string | Workspace) => {
    const id = typeof target === 'string' ? target : target.id;
    setAppData((prev) => ({ ...prev, activeWorkspaceId: id }));
  };

  const handleSaveWorkspace = (updated: Workspace) => {
    setAppData((prev) => {
      const workspaces = Array.isArray(prev.workspaces) ? prev.workspaces : [];
      const exists = workspaces.some((w) => w.id === updated.id);
      const newWorkspaces = exists
        ? workspaces.map((w) => (w.id === updated.id ? updated : w))
        : [...workspaces, updated];
      return {
        ...prev,
        workspaces: newWorkspaces,
        activeWorkspaceId: updated.id,
      };
    });
  };

  const handleDeleteWorkspace = (id: string) => {
    if (appData.workspaces.length <= 1) {
      alert('Tidak dapat menghapus satuan pelayanan terakhir.');
      return;
    }
    setAppData((prev) => {
      const nextWorkspaces = prev.workspaces.filter((w) => w.id !== id);
      return {
        ...prev,
        workspaces: nextWorkspaces,
        activeWorkspaceId: nextWorkspaces[0].id,
      };
    });
  };

  // Menu Updates
  const handleUpdateMenu = (updated: MenuPlan) => {
    setAppData((prev) => {
      const menus = Array.isArray(prev.menus) ? prev.menus : [];
      const exists = menus.some((m) => m.id === updated.id);
      const newMenus = exists
        ? menus.map((m) => (m.id === updated.id ? updated : m))
        : [...menus, updated];
      return { ...prev, menus: newMenus };
    });
  };

  // HACCP Handlers
  const handleAddHaccpLog = (newLog: HACCPLog) => {
    setAppData((prev) => ({
      ...prev,
      haccpLogs: [newLog, ...(Array.isArray(prev.haccpLogs) ? prev.haccpLogs : [])],
    }));
  };

  // Posyandu 3B Handlers
  const handleAddMother = (newMom: MotherRecord) => {
    setAppData((prev) => ({
      ...prev,
      mothers: [newMom, ...(Array.isArray(prev.mothers) ? prev.mothers : [])],
    }));
  };

  const handleAddToddler = (newTod: ToddlerRecord) => {
    setAppData((prev) => ({
      ...prev,
      toddlers: [newTod, ...(Array.isArray(prev.toddlers) ? prev.toddlers : [])],
    }));
  };

  const handleAddMeasurement = (toddlerId: string, measurement: ToddlerMeasurement) => {
    setAppData((prev) => {
      const toddlers = Array.isArray(prev.toddlers) ? prev.toddlers : [];
      const updatedToddlers = toddlers.map((t) => {
        if (t.id === toddlerId) {
          const newMeasurements = [...(Array.isArray(t.measurements) ? t.measurements : []), measurement];
          return {
            ...t,
            measurements: newMeasurements,
            isFalteringT2: measurement.t2Faltering || false,
            isStuntingRisk: (measurement.zScoreTBU !== undefined && measurement.zScoreTBU < -2.0),
            isUnderweight: (measurement.zScoreBBU !== undefined && measurement.zScoreBBU < -2.0),
            lastUpdated: measurement.date,
          };
        }
        return t;
      });
      return { ...prev, toddlers: updatedToddlers };
    });
  };

  // SOP & OCR Handlers
  const handleAddSOP = (sop: BgnSOP) => {
    setAppData((prev) => ({
      ...prev,
      sops: [...(Array.isArray(prev.sops) ? prev.sops : []), sop],
    }));
  };

  const handleSaveDraft = (draft: ScannedLogDraft) => {
    setAppData((prev) => ({
      ...prev,
      scannedDrafts: [draft, ...(Array.isArray(prev.scannedDrafts) ? prev.scannedDrafts : [])],
    }));
  };

  // Global Export Triggers
  const handleExportExcel = () => {
    exportMenuToExcel(currentMenu, currentWorkspace, currentTargetAKG);
  };

  const handleExportWord = () => {
    exportReportToWord(
      currentMenu,
      currentWorkspace,
      currentHaccpLogs,
      currentTargetAKG,
      macroNutrients
    );
  };

  const handleExportPDF = () => {
    exportReportToPDF(
      currentMenu,
      currentWorkspace,
      currentHaccpLogs,
      currentTargetAKG,
      macroNutrients
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-200 selection:text-blue-900">
      
      {/* 1. Official Header & Workspace Selector */}
      <Header
        currentWorkspace={currentWorkspace}
        allWorkspaces={appData.workspaces}
        workspaces={appData.workspaces}
        activeWorkspace={currentWorkspace}
        onSelectWorkspace={handleSelectWorkspace}
        onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
        activeMenu={currentMenu}
        haccpLogs={currentHaccpLogs}
        targetAKG={currentTargetAKG}
        macroNutrients={macroNutrients}
        onExportExcel={handleExportExcel}
        onExportWord={handleExportWord}
        onExportPDF={handleExportPDF}
      />

      {/* 2. Top Navigation Tabs Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        haccpIssuesCount={haccpAlerts}
        posyanduAlertsCount={posyanduAlerts}
        onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
      />

      {/* 3. Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            workspace={currentWorkspace}
            menu={currentMenu}
            haccpLogs={currentHaccpLogs}
            mothers={appData.mothers}
            toddlers={appData.toddlers}
            targetAKG={currentTargetAKG}
            macroNutrients={macroNutrients}
            onNavigate={setActiveTab}
            onOpenWorkspaceModal={() => setIsWorkspaceModalOpen(true)}
          />
        )}

        {/* TAB 2: NUTRITION CALCULATOR & LOGISTICS */}
        {activeTab === 'nutrition' && (
          <NutritionCalculator
            menu={currentMenu}
            onUpdateMenu={handleUpdateMenu}
            workspace={currentWorkspace}
          />
        )}

        {/* TAB 3: EDUKASI GIZI SEIMBANG & BUKU KIA 2024 */}
        {activeTab === 'edukasi_gizi' && (
          <EdukasiGiziSeimbang
            currentWorkspaceName={currentWorkspace.name}
          />
        )}

        {/* TAB 4: PROCESS FLOWCHART & OPERATIONAL PIPELINE */}
        {activeTab === 'flowcharts' && (
          <ProcessFlowchart />
        )}

        {/* TAB 5: DAILY SOP CHECKLIST */}
        {activeTab === 'sop_checklist' && (
          <DailySopChecklist
            currentWorkspaceName={currentWorkspace.name}
            nutritionistName={currentWorkspace.nutritionistName}
          />
        )}

        {/* TAB 6: HACCP & FSMS CONTROL MATRIX */}
        {activeTab === 'haccp' && (
          <HaccpMatrix
            logs={currentHaccpLogs}
            onAddLog={handleAddHaccpLog}
            workspace={currentWorkspace}
          />
        )}

        {/* TAB 7: POSYANDU KELOMPOK 3B & KMS DIGITAL */}
        {activeTab === 'posyandu' && (
          <PosyanduModule
            mothers={appData.mothers}
            toddlers={appData.toddlers}
            onAddMother={handleAddMother}
            onAddToddler={handleAddToddler}
            onAddMeasurement={handleAddMeasurement}
            workspace={currentWorkspace}
          />
        )}

        {/* TAB 8: ANALYTICS & AI INSIGHTS */}
        {activeTab === 'analytics' && (
          <AnalyticsAiInsights
            currentWorkspaceName={currentWorkspace.name}
            currentMenu={currentMenu}
            haccpLogs={currentHaccpLogs}
            targetAKG={currentTargetAKG}
          />
        )}

        {/* TAB 9: SMART OCR & SOP FILE VAULT */}
        {activeTab === 'ocr_vault' && (
          <OcrScannerVault
            sops={appData.sops?.length > 0 ? appData.sops : BGN_SOPS}
            onAddSOP={handleAddSOP}
            onImportHaccpLog={handleAddHaccpLog}
            workspace={currentWorkspace}
            scannedDrafts={appData.scannedDrafts}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {/* TAB 10: MULTI-DATABASE & ADVANCED EXPORT CENTER */}
        {activeTab === 'database_export' && (
          <DatabaseExportManager
            currentWorkspace={currentWorkspace}
            allWorkspaces={appData.workspaces}
            onSelectWorkspace={handleSelectWorkspace}
            onCreateWorkspace={handleSaveWorkspace}
            currentMenu={currentMenu}
            haccpLogs={currentHaccpLogs}
            mothers={appData.mothers}
            toddlers={appData.toddlers}
            targetAKG={currentTargetAKG}
          />
        )}

        {/* TAB 11: MASTER DATABASE TKPI & AKG 2026 */}
        {activeTab === 'master_db' && (
          <MasterDatabaseViewer />
        )}

      </main>

      {/* 4. Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#0A2540] flex items-center justify-center text-[#38BDF8] font-black text-[10px]">
              G
            </div>
            <span className="font-bold text-slate-700">
              BGN Quality &amp; Safety Hub
            </span>
            <span>— Sistem Manajemen Mutu, Gizi, HACCP &amp; SOP Satuan Pelayanan BGN</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Standar AKG 2026</span>
            <span>•</span>
            <span>ISO 22000 / Codex HACCP</span>
            <span>•</span>
            <span>Permenkes No. 41 / 2014 &amp; Buku KIA 2024</span>
          </div>
        </div>
      </footer>

      {/* Workspace Management Modal */}
      <WorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        workspaces={appData.workspaces}
        activeWorkspace={currentWorkspace}
        onSelectWorkspace={handleSelectWorkspace}
        onSaveWorkspace={handleSaveWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
      />

      {/* Syafina Chatbot Widget */}
      <SupervisorChatbot />
    </div>
  );
}
