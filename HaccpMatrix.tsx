import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Thermometer, 
  Clock, 
  Truck, 
  Flame, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Filter,
  FileCheck,
  AlertOctagon
} from 'lucide-react';
import { HACCPLog, CCPType, Workspace } from '../types';

interface HaccpMatrixProps {
  logs: HACCPLog[];
  onAddLog: (newLog: HACCPLog) => void;
  workspace: Workspace;
}

export const HaccpMatrix: React.FC<HaccpMatrixProps> = ({
  logs = [],
  onAddLog,
  workspace,
}) => {
  const safeLogs = Array.isArray(logs) ? logs : [];
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form states
  const [ccpType, setCcpType] = useState<CCPType>('CCP-2');
  const [stepName, setStepName] = useState<string>('Pengolahan Termal Daging / Unggas');
  const [parameterChecked, setParameterChecked] = useState<string>('Suhu inti makanan matang');
  const [measuredValue, setMeasuredValue] = useState<number>(76.5);
  const [batchNumber, setBatchNumber] = useState<string>(`LOT-${Date.now().toString().slice(-6)}`);
  const [foodItemName, setFoodItemName] = useState<string>('Ayam Ungkep Bumbu Kuning');
  const [inspectorName, setInspectorName] = useState<string>(workspace.qaOfficerName);
  const [correctiveAction, setCorrectiveAction] = useState<string>('');

  // Threshold definitions per CCP
  const getThresholdInfo = (type: CCPType) => {
    switch (type) {
      case 'CCP-1':
        return {
          thresholdText: 'Suhu Penerimaan Dingin <= 4.0 °C (Beku <= -18 °C)',
          unit: '°C',
          checkCompliant: (val: number) => val <= 4.0,
          riskIfFail: 'KRITIS' as const,
        };
      case 'CCP-2':
        return {
          thresholdText: 'Suhu Inti Termal >= 75.0 °C (min 2 menit)',
          unit: '°C',
          checkCompliant: (val: number) => val >= 75.0,
          riskIfFail: 'KRITIS' as const,
        };
      case 'CCP-3':
        return {
          thresholdText: 'Durasi Matang s/d Konsumsi Siswa <= 4.0 Jam',
          unit: 'Jam',
          checkCompliant: (val: number) => val <= 4.0,
          riskIfFail: 'SEDANG' as const,
        };
    }
  };

  const handleCcpTypeChange = (type: CCPType) => {
    setCcpType(type);
    if (type === 'CCP-1') {
      setStepName('Penerimaan Bahan Mentah Hewani (Chilled)');
      setParameterChecked('Suhu armada pendingin & inti daging');
      setMeasuredValue(3.5);
    } else if (type === 'CCP-2') {
      setStepName('Pengolahan Termal Daging / Unggas (Ketel Masak)');
      setParameterChecked('Suhu inti makanan matang');
      setMeasuredValue(78.0);
    } else {
      setStepName('Holding & Pengiriman Distribusi Ompreng');
      setParameterChecked('Durasi dari kompor matang s/d tiba di sekolah');
      setMeasuredValue(1.5);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const threshold = getThresholdInfo(ccpType);
    const isCompliant = threshold.checkCompliant(measuredValue);

    const newLog: HACCPLog = {
      id: `haccp-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ccpType,
      stepName,
      parameterChecked,
      standardThreshold: threshold.thresholdText,
      measuredValue: Number(measuredValue),
      unit: threshold.unit,
      isCompliant,
      batchNumber,
      inspectorName: inspectorName || 'Auditor QA SPPG',
      correctiveAction: !isCompliant ? correctiveAction || 'Tindakan korektif wajib dicatat.' : undefined,
      hazardRisk: isCompliant ? 'RENDAH' : threshold.riskIfFail,
      foodItemName,
    };

    onAddLog(newLog);
    setIsModalOpen(false);
    setCorrectiveAction('');
  };

  const filteredLogs = safeLogs.filter((log) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'NON_COMPLIANT') return !log.isCompliant;
    return log.ccpType === activeFilter;
  });

  const compliantCount = safeLogs.filter((l) => l.isCompliant).length;
  const nonCompliantCount = safeLogs.filter((l) => !l.isCompliant).length;
  const complianceRate = safeLogs.length > 0 ? Math.round((compliantCount / safeLogs.length) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Title & Stats Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-[#0052CC]">
                HACCP & FSMS CONTROL
              </span>
              <span className="text-xs text-slate-500">
                Food Safety Management System BGN
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mt-1">
              Matriks Titik Kendali Kritis (Critical Control Points)
            </h2>
            <p className="text-xs text-slate-500">
              Pemantauan berkelanjutan CCP-1 (Penerimaan), CCP-2 (Pemasakan Termal), dan CCP-3 (Distribusi 4 Jam).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-right">
              <span className="text-[11px] text-slate-500 block">Indeks Kepatuhan (Compliance):</span>
              <span className={`text-lg font-extrabold font-mono ${complianceRate >= 95 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {complianceRate}%
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0052CC] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Catat Verifikasi CCP
            </button>
          </div>
        </div>
      </div>

      {/* The 3 Core CCP Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CCP-1 Receiving */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-700">CCP-1 (Penerimaan)</span>
                <h4 className="text-sm font-extrabold text-slate-800">Cold Chain Receiving</h4>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
              ≤ 4.0 °C
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Daging ayam, sapi, dan ikan segar wajib diukur menggunakan probe inframerah saat armada tiba. Tolak (reject) jika suhu melebihi 4.0°C.
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <strong>Batas Bahaya:</strong> Bakteri Salmonella & Listeria bereplikasi cepat jika rantai dingin terputus.
          </div>
        </div>

        {/* CCP-2 Cooking */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-600"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-700">CCP-2 (Pengolahan)</span>
                <h4 className="text-sm font-extrabold text-slate-800">Thermal Lethality</h4>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
              ≥ 75.0 °C
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Suhu inti (core temperature) pada bagian terdalam daging matang wajib mencapai minimal 75.0°C dan dipertahankan minimal 2 menit.
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <strong>Batas Bahaya:</strong> Clostridium perfringens & E. coli hanya mati total pada perlakuan panas tervalidasi.
          </div>
        </div>

        {/* CCP-3 Holding & Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-700">CCP-3 (Distribusi)</span>
                <h4 className="text-sm font-extrabold text-slate-800">Time-Temperature Limit</h4>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
              ≤ 4.0 Jam
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Makanan siap saji dalam wadah ompreng wajib dikonsumsi maksimal 4 jam sejak selesai matang. Melebihi 4 jam wajib diafkir.
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            <strong>Batas Bahaya:</strong> Zona Bahaya Suhu (5°C - 60°C) memicu pertumbuhan toksin spora Bacillus cereus.
          </div>
        </div>

      </div>

      {/* Filter and Audit Log Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#0052CC]" />
            <h3 className="text-sm font-bold text-slate-800">
              Logbook Verifikasi Digital HACCP ({filteredLogs.length} Catatan)
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {['ALL', 'CCP-1', 'CCP-2', 'CCP-3', 'NON_COMPLIANT'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeFilter === f
                    ? 'bg-[#0052CC] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'ALL' ? 'Semua CCP' : f === 'NON_COMPLIANT' ? 'Deviasi Kritis' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Waktu & Lot</th>
                <th className="py-2.5 px-2">Titik Kritis</th>
                <th className="py-2.5 px-3">Objek / Bahan</th>
                <th className="py-2.5 px-2">Standar Kritis</th>
                <th className="py-2.5 px-2 text-right">Hasil Ukur</th>
                <th className="py-2.5 px-2 text-center">Status</th>
                <th className="py-2.5 px-3">Tindakan Korektif & Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className={`hover:bg-slate-50 transition-colors ${!log.isCompliant ? 'bg-rose-50/40' : ''}`}>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{log.timestamp}</div>
                    <div className="font-mono text-[10px] text-slate-500">{log.batchNumber}</div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.ccpType === 'CCP-1' 
                        ? 'bg-blue-100 text-blue-800' 
                        : log.ccpType === 'CCP-2' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.ccpType}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{log.foodItemName || log.stepName}</div>
                    <div className="text-[11px] text-slate-500">{log.parameterChecked}</div>
                  </td>
                  <td className="py-3 px-2 font-mono text-[11px] text-slate-600">
                    {log.standardThreshold}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-slate-900 text-sm">
                    {log.measuredValue} {log.unit}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {log.isCompliant ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> SESUAI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> DEVIASI
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {log.correctiveAction ? (
                      <div className="text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-200 text-[11px] font-medium mb-1">
                        <strong>Koreksi:</strong> {log.correctiveAction}
                      </div>
                    ) : (
                      <div className="text-emerald-700 text-[11px]">Memenuhi seluruh standar SOP BGN.</div>
                    )}
                    <div className="text-[10px] text-slate-400">Pemeriksa: {log.inspectorName}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record CCP Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="font-bold text-base">Entri Pemeriksaan Titik Kritis (HACCP)</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Titik Kritis (CCP) *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CCP-1', 'CCP-2', 'CCP-3'] as CCPType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleCcpTypeChange(t)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        ccpType === t 
                          ? 'border-[#0052CC] bg-blue-50 text-[#0052CC]' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Bahan / Menu yang Diuji *</label>
                <input
                  type="text"
                  required
                  value={foodItemName}
                  onChange={(e) => setFoodItemName(e.target.value)}
                  placeholder="misal: Daging Ayam Karkas, Sayur Bening, atau Box Distribusi"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hasil Pengukuran ({getThresholdInfo(ccpType).unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={measuredValue}
                    onChange={(e) => setMeasuredValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Batch / Lot</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block">Ambang Batas Standar BGN:</span>
                <span className="font-bold text-slate-800">{getThresholdInfo(ccpType).thresholdText}</span>
              </div>

              {/* Conditional Corrective Action if non-compliant */}
              {!getThresholdInfo(ccpType).checkCompliant(measuredValue) && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    DEVIASI TERDETEKSI: Wajib Mengisi Tindakan Korektif!
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    placeholder="misal: Pemanasan dilanjutkan selama 10 menit, atau bahan baku ditolak dikembalikan ke armada supplier."
                    className="w-full p-2 text-xs border border-rose-300 rounded-lg bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Petugas QA / Pemeriksa</label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0052CC] hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Simpan Verifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
