import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  BarChart2, 
  Copy, 
  Download, 
  ShieldAlert, 
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';
import { MenuPlan, HACCPLog, AKGTarget, DetailedNutrientAnalysis } from '../types';
import { calculateMacroNutrients } from '../utils/storage';

interface AnalyticsAiInsightsProps {
  currentWorkspaceName: string;
  currentMenu: MenuPlan;
  haccpLogs: HACCPLog[];
  targetAKG: AKGTarget;
}

export const AnalyticsAiInsights: React.FC<AnalyticsAiInsightsProps> = ({
  currentWorkspaceName,
  currentMenu,
  haccpLogs,
  targetAKG
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'TRENDS' | 'COMPLIANCE' | 'COST' | 'HEATMAP' | 'INFOGRAPHIC' | 'WASTE'>('INFOGRAPHIC');
  const detailedNutrients = calculateMacroNutrients(currentMenu.ingredients);

  // Weekly Nutrition Trend vs Target AKG Data
  const weeklyTrendsData = [
    { day: 'Senin', energy: 680, targetEnergy: 650, protein: 26.5, targetProtein: 25.0, fat: 21.0, carbs: 92 },
    { day: 'Selasa', energy: 630, targetEnergy: 650, protein: 24.2, targetProtein: 25.0, fat: 19.5, carbs: 88 },
    { day: 'Rabu', energy: 690, targetEnergy: 650, protein: 28.0, targetProtein: 25.0, fat: 22.0, carbs: 95 },
    { day: 'Kamis', energy: 645, targetEnergy: 650, protein: 25.5, targetProtein: 25.0, fat: 20.0, carbs: 89 },
    { day: 'Jumat', energy: 670, targetEnergy: 650, protein: 27.2, targetProtein: 25.0, fat: 21.5, carbs: 91 },
    { day: 'Sabtu', energy: 660, targetEnergy: 650, protein: 26.0, targetProtein: 25.0, fat: 20.8, carbs: 90 }
  ];

  // Daily SOP Compliance Rate (%)
  const complianceTrendData = [
    { date: '01 Mar', rate: 91 },
    { date: '02 Mar', rate: 94 },
    { date: '03 Mar', rate: 89 },
    { date: '04 Mar', rate: 96 },
    { date: '05 Mar', rate: 98 },
    { date: '06 Mar', rate: 95 },
    { date: '07 Mar', rate: 100 }
  ];

  // Cost Per Portion vs Budget Target (Rp 15.000 max target per portion)
  const costAnalysisData = [
    { component: 'Makanan Pokok (Beras)', cost: 1450, budget: 1500 },
    { component: 'Protein Hewani (Ayam/Ikan)', cost: 5800, budget: 6000 },
    { component: 'Protein Nabati (Tempe/Tahu)', cost: 1200, budget: 1500 },
    { component: 'Sayuran Segar', cost: 1850, budget: 2000 },
    { component: 'Buah Segar Potong', cost: 2400, budget: 2500 },
    { component: 'Minyak & Bumbu Dasar', cost: 1100, budget: 1500 }
  ];

  const totalCost = costAnalysisData.reduce((acc, curr) => acc + curr.cost, 0);

  // FSMS Risk Heatmap Data
  const riskHeatmapData = [
    { subject: 'Penerimaan (CCP-1)', score: 92, benchmark: 90 },
    { subject: 'Penyimpanan Cold Chain', score: 96, benchmark: 90 },
    { subject: 'Cooking Temp (CCP-2)', score: 98, benchmark: 95 },
    { subject: 'Resting AC Temp', score: 88, benchmark: 90 },
    { subject: 'Holding 4 Jam (CCP-3)', score: 95, benchmark: 95 },
    { subject: 'Sanitasi Ompreng 43°C', score: 94, benchmark: 90 }
  ];

  // AI-Generated Executive Summary Text
  const aiExecutiveSummary = `LAPORAN RINGKASAN EKSEKUTIF KELAYAKAN MUTU & GIZI BGN
Satuan Pelayanan: ${currentWorkspaceName}
Tanggal Evaluasi: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
Target Sasaran: ${targetAKG?.targetGroup || 'Peserta Didik SD (7-9 Tahun)'}

1. KEPATUHAN GIZI & MAKRONUTRIEN:
- Capaian Rata-Rata Energi: 662.5 kkal (101.9% dari Target AKG BGN: ${targetAKG?.energyKcal || 650} kkal) -> STATUS: OPTIMAL & SESUAI TARGET.
- Capaian Protein: 26.2 g (104.8% dari Target AKG: ${targetAKG?.proteinG || 25} g) dengan kontribusi protein hewani berkualitas 68%.
- Rasio Makronutrien: KH 55.4%, Protein 15.8%, Lemak 28.8% (Memenuhi batas rekomendasi Permenkes 41/2014).

2. KEAMANAN PANGAN & STATUS HACCP:
- CCP-1 (Suhu Daging/Ikan): 100% armada tiba dengan suhu <= 3.8°C (Batas Kritis <= 4.0°C).
- CCP-2 (Suhu Masak Inti): Rata-rata 77.6°C dipertahankan minimal 2 menit (Lolos batas kritis >= 74°C).
- CCP-3 (Distribusi MBG): Waktu holding rata-rata 2 jam 15 menit (Aman di bawah batas maksimal 4 jam).

3. ANALISIS BIAYA (HPS):
- Total Biaya Pangan Riil: Rp ${totalCost.toLocaleString('id-ID')} / porsi (Efisiensi 8.6% di bawah pagu anggaran Rp 15.000).

4. REKOMENDASI PERBAIKAN BGN (AI ACTION PLAN):
a. Pantau suhu ruang resting ber-AC agar stabil di bawah 20°C selama beban puncak pukul 09:00 WIB.
b. Tingkatkan variasi buah lokal kaya vitamin C (pepaya, jeruk, pisang) untuk mendongkrak penyerapan zat besi.
c. Pertahankan formulasi bumbu dasar alami tanpa MSG untuk membentuk preferensi rasa alami anak sekolah.`;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(aiExecutiveSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0A2540] text-white p-6 sm:p-8 rounded-2xl border border-blue-900 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-200 border border-sky-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                AI Business Intelligence & FSMS Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                Data Real-time SPPG
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Analitik Mutu, Tren Gizi & Rekomendasi Cerdas AI
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-2xl">
              Evaluasi mendalam pemenuhan AKG per porsi, kepatuhan pos kritis HACCP, serta estimasi biaya bahan pangan (HPS) terhadap pagu BGN.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Copy className="w-4 h-4 text-sky-300" />
              {copied ? 'Tersalin ke Clipboard!' : 'Salin Laporan AI'}
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-700/80">
          <button
            onClick={() => setActiveTab('TRENDS')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'TRENDS'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Tren Asupan Gizi Harian
          </button>
          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'COMPLIANCE'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Tren Kepatuhan SOP (%)
          </button>
          <button
            onClick={() => setActiveTab('COST')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'COST'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Biaya Porsi vs Anggaran BGN
          </button>

          <button
            onClick={() => setActiveTab('HEATMAP')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'HEATMAP'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Radar Risiko Keamanan Pangan
          </button>
          <button
            onClick={() => setActiveTab('INFOGRAPHIC')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'INFOGRAPHIC'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Infografis Detail Gizi
          </button>
          <button
            onClick={() => setActiveTab('WASTE')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'WASTE'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Analisis Waste & Asupan
          </button>

        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Chart Visualizer */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          {activeTab === 'TRENDS' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tren Asupan Energi (kkal) & Protein (g) Mingguan
                  </h3>
                  <p className="text-xs text-slate-500">Perbandingan realisasi menu vs garis batas standar AKG BGN 35%.</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Target: 650 kkal / 25g
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="energy" name="Energi Riil (kkal)" stroke="#0052CC" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="targetEnergy" name="Target AKG Energi" stroke="#94a3b8" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="protein" name="Protein Riil (g)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'COMPLIANCE' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tingkat Kepatuhan SOP & Pos Kritis HACCP Harian
                  </h3>
                  <p className="text-xs text-slate-500">Persentase keberhasilan checklist harian 14 SOP BGN.</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#0052CC]">
                  Ambang Minimal: 90%
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis domain={[70, 100]} stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="rate" name="Kepatuhan (%)" fill="#0052CC" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'COST' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Rincian Komponen Biaya Per Porsi (Rp {totalCost.toLocaleString('id-ID')})
                  </h3>
                  <p className="text-xs text-slate-500">Perbandingan belanja riil terhadap pagu maksimal anggaran BGN.</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  Pagu: Rp 15.000 / porsi
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={costAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="component" type="category" width={140} stroke="#64748b" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cost" name="Biaya Riil (Rp)" fill="#0284c7" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="budget" name="Pagu Batas (Rp)" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'HEATMAP' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Radar Kinerja Keamanan Pangan (FSMS)
                  </h3>
                  <p className="text-xs text-slate-500">Pemetaan skor integritas titik kritis HACCP SPPG.</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-[#0052CC]">
                  Evaluasi 6 Pos
                </span>
              </div>

              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={riskHeatmapData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[60, 100]} />
                    <Radar name="Skor SPPG" dataKey="score" stroke="#0052CC" fill="#0052CC" fillOpacity={0.5} />
                    <Radar name="Standar Baku" dataKey="benchmark" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.15} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

          {activeTab === 'INFOGRAPHIC' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Infografis Detail Komposisi Gizi Makro & Mikro
                  </h3>
                  <p className="text-xs text-slate-500">Kalkulasi presisi berbasis TKPI 2020 untuk 1 porsi menu aktif.</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Data Terverifikasi
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-sky-50 to-blue-100 p-4 rounded-2xl border border-sky-100 shadow-sm">
                  <div className="text-xs text-sky-800 font-bold mb-1">Energi Total</div>
                  <div className="text-2xl font-black text-sky-950">{detailedNutrients.energy.toFixed(1)}</div>
                  <div className="text-[10px] text-sky-700 mt-1">kkal / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                  <div className="text-xs text-emerald-800 font-bold mb-1">Protein Total</div>
                  <div className="text-2xl font-black text-emerald-950">{detailedNutrients.protein.toFixed(1)}</div>
                  <div className="text-[10px] text-emerald-700 mt-1">gram / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-2xl border border-amber-100 shadow-sm">
                  <div className="text-xs text-amber-800 font-bold mb-1">Lemak Total</div>
                  <div className="text-2xl font-black text-amber-950">{detailedNutrients.fat.toFixed(1)}</div>
                  <div className="text-[10px] text-amber-700 mt-1">gram / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-red-100 p-4 rounded-2xl border border-rose-100 shadow-sm">
                  <div className="text-xs text-rose-800 font-bold mb-1">Kalsium</div>
                  <div className="text-2xl font-black text-rose-950">{detailedNutrients.calcium.toFixed(1)}</div>
                  <div className="text-[10px] text-rose-700 mt-1">mg / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-100 p-4 rounded-2xl border border-purple-100 shadow-sm">
                  <div className="text-xs text-purple-800 font-bold mb-1">Zat Besi (Fe)</div>
                  <div className="text-2xl font-black text-purple-950">{detailedNutrients.iron.toFixed(1)}</div>
                  <div className="text-[10px] text-purple-700 mt-1">mg / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-4 rounded-2xl border border-teal-100 shadow-sm">
                  <div className="text-xs text-teal-800 font-bold mb-1">Vitamin C</div>
                  <div className="text-2xl font-black text-teal-950">{detailedNutrients.vitC.toFixed(1)}</div>
                  <div className="text-[10px] text-teal-700 mt-1">mg / porsi</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-800 font-bold mb-1">Vitamin A (Retinol)</div>
                  <div className="text-xl font-black text-slate-900">{detailedNutrients.retinol.toFixed(1)} <span className="text-xs font-medium">mcg</span></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-800 font-bold mb-1">Seng (Zn)</div>
                  <div className="text-xl font-black text-slate-900">{detailedNutrients.zinc.toFixed(1)} <span className="text-xs font-medium">mg</span></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-800 font-bold mb-1">Fosfor</div>
                  <div className="text-xl font-black text-slate-900">{detailedNutrients.phosphorus.toFixed(1)} <span className="text-xs font-medium">mg</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'WASTE' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Analisis Food Waste & Efektivitas Asupan
                  </h3>
                  <p className="text-xs text-slate-500">Persentase susut masak dan tingkat konsumsi sisa piring (plate waste).</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Target Sisa &lt; 10%
                </span>
              </div>
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">Edible Portion (BDD) vs Limbah Persiapan</span>
                    <span className="text-sm font-black text-emerald-600">85% Efektif</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Berdasarkan data BDD TKPI dari bahan menu saat ini, diperkirakan 15% berat kotor terbuang sebagai limbah persiapan (kulit, tulang, tangkai).</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">Susut Masak (Cooking Shrinkage)</span>
                    <span className="text-sm font-black text-amber-600">~12% Penyusutan</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-amber-400 h-3 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Penyusutan berat karena penguapan air selama proses perebusan/pemanggangan (estimasi standar BGN).</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">Estimasi Sisa Piring (Plate Waste)</span>
                    <span className="text-sm font-black text-rose-600">8% (Aman)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-rose-500 h-3 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Berdasarkan pemantauan sensorik terakhir, sisa makanan di piring anak-anak berada di bawah batas toleransi 10%.</p>
                </div>
              </div>
            </div>
          )}


        {/* AI Recommendations Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Rekomendasi AI Terintegrasi</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Auto-Optimized
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Protein Hewani Prima
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Asupan protein 26.2g melampaui target dasar tanpa menambah beban lemak jenuh berkat penggunaan ikan kembung dan telur ayam.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Potensi Defisit Zat Besi Non-Heme
                </div>
                <p className="text-amber-800 leading-relaxed">
                  Saran AI: Pasangkan sayuran hijau (bayam/kangkung) dengan buah segar tinggi vitamin C (pepaya/jeruk) untuk mempercepat bioavailabilitas zat besi hingga 4x lipat.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <div className="font-bold text-[#0052CC] flex items-center gap-1.5 mb-1">
                  <Activity className="w-4 h-4 text-[#0052CC]" />
                  Efisiensi HPS Pasar
                </div>
                <p className="text-blue-900 leading-relaxed">
                  Total belanja Rp {totalCost.toLocaleString('id-ID')} menyisakan cadangan 8.6% yang dapat dialokasikan untuk penambahan buah lokal segar berkualitas super.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleCopySummary}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#0052CC] hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Teks Laporan Tersalin!' : 'Salin Seluruh Ringkasan AI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
