import React, { useState } from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Clock, 
  UserCheck, 
  Wrench, 
  Search, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Thermometer,
  Layers,
  Sparkles
} from 'lucide-react';
import { BGN_PROCESS_PIPELINE_STAGES, BGN_FLOWCHART_NODES } from '../data/flowchartData';
import { FlowchartNode } from '../types';

export const ProcessFlowchart: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNode, setActiveNode] = useState<FlowchartNode>(BGN_FLOWCHART_NODES[0]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const filteredNodes = BGN_FLOWCHART_NODES.filter((node) => {
    const matchStage = selectedStage === 'ALL' || node.stageName.toLowerCase().includes(selectedStage.toLowerCase());
    const matchSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        node.sopNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        node.sopTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (node.criticalLimit && node.criticalLimit.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStage && matchSearch;
  });

  const handleOpenDetail = (node: FlowchartNode) => {
    setActiveNode(node);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0A2540] text-white p-6 sm:p-8 rounded-2xl border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-200 border border-sky-400/30">
                Peta Alur Kerja Resmi BGN RI
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-pink-500/20 text-pink-200 border border-pink-400/30">
                Standar FSMS & HACCP
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Diagram Alir Proses Operasional Satuan Pelayanan (SPPG)
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-3xl">
              Visualisasi alur terintegrasi 14 Master Dokumen SOP BGN dari Perencanaan Menu, Penerimaan Rantai Dingin (CCP-1), Pengolahan Termal (CCP-2), Resting, Pemorsian Ompreng, Distribusi Maks 4 Jam (CCP-3), hingga Manajemen Limbah Pangan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center">
              <div className="text-[11px] text-sky-200">Total Tahap</div>
              <div className="text-xl font-bold text-white">9 Fase Alir</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center">
              <div className="text-[11px] text-pink-200">Titik Kritis</div>
              <div className="text-xl font-bold text-pink-300">3 CCP BGN</div>
            </div>
          </div>
        </div>

        {/* Horizontal Pipeline Steps Ribbon */}
        <div className="mt-6 pt-5 border-t border-slate-700/80 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {BGN_PROCESS_PIPELINE_STAGES.map((stg, idx) => (
              <React.Fragment key={stg.id}>
                <button
                  onClick={() => setSelectedStage(stg.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    selectedStage === stg.id
                      ? 'bg-sky-400 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>{stg.name}</span>
                </button>
                {idx < BGN_PROCESS_PIPELINE_STAGES.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
              </React.Fragment>
            ))}
            <button
              onClick={() => setSelectedStage('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedStage === 'ALL'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-slate-800/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Lihat Semua
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari SOP / Nomor SK / Parameter Suhu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
          />
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Titik Kritis CCP (Wajib Verifikasi)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> SOP Higiene & Prosedur Rutin
          </span>
        </div>
      </div>

      {/* Nodes Cards Grid / Interactive Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNodes.map((node) => {
          const isCCP = Boolean(node.ccpTarget);

          return (
            <div
              key={node.id}
              onClick={() => handleOpenDetail(node)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${
                isCCP
                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {node.stageName}
                  </span>
                  {isCCP ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-rose-600" />
                      {node.ccpTarget}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      Standard SOP
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                  {node.title}
                </h3>
                
                <div className="text-[11px] font-mono text-slate-500 mb-3 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" />
                  {node.sopNumber}
                </div>

                {node.criticalLimit && (
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200/80 text-xs text-rose-950 mb-3 shadow-2xs">
                    <span className="font-bold text-rose-700 block mb-0.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Batas Kritis / Toleransi:
                    </span>
                    {node.criticalLimit}
                  </div>
                )}

                <div className="space-y-1 text-xs text-slate-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>PJ:</strong> {node.responsibleRole}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>Durasi:</strong> {node.standardDuration}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                  Output: {node.outputDocument}
                </span>
                <span className="text-[#0052CC] font-bold flex items-center gap-1 shrink-0">
                  Detail SOP <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail SOP Modal / Drawer */}
      {modalOpen && activeNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0052CC]/10 text-[#0052CC]">
                    {activeNode.stageName}
                  </span>
                  {activeNode.ccpTarget && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300">
                      {activeNode.ccpTarget}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {activeNode.title}
                </h2>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  {activeNode.sopNumber} • {activeNode.sopTitle}
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 my-5">
              {/* Critical Limit Alert if CCP */}
              {activeNode.criticalLimit && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-950">
                  <div className="font-bold text-rose-800 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Batas Kritis HACCP (Critical Limits):
                  </div>
                  {activeNode.criticalLimit}
                </div>
              )}

              {/* Roles & Duration & Output */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="text-slate-500 font-medium">Penanggung Jawab:</div>
                  <div className="font-bold text-slate-900 mt-0.5">{activeNode.responsibleRole}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="text-slate-500 font-medium">Standar Durasi:</div>
                  <div className="font-bold text-slate-900 mt-0.5">{activeNode.standardDuration}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="text-slate-500 font-medium">Dokumen Output:</div>
                  <div className="font-bold text-slate-900 mt-0.5 truncate">{activeNode.outputDocument}</div>
                </div>
              </div>

              {/* Step-by-Step Flow Instructions */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Langkah Prosedur Kerja Resmi:
                </h4>
                <div className="space-y-2">
                  {activeNode.steps.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#0052CC] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Equipment */}
              <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200">
                <div className="text-xs font-bold text-[#0052CC] mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  Peralatan & Formulir Wajib BGN:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.requiredEquipment.map((eq, i) => (
                    <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-slate-700">
                      • {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0052CC] text-white hover:bg-blue-700 transition-colors shadow-xs"
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
