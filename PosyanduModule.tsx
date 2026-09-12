import React, { useState, useMemo } from 'react';
import { 
  Baby, 
  HeartPulse, 
  AlertTriangle, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  Info,
  Calendar,
  User,
  Activity,
  UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { MotherRecord, ToddlerRecord, ToddlerMeasurement, Workspace } from '../types';
import { KMS_WHO_CURVE_DATA } from '../data/masterData';

interface PosyanduModuleProps {
  mothers: MotherRecord[];
  toddlers: ToddlerRecord[];
  onAddMother: (mom: MotherRecord) => void;
  onAddToddler: (tod: ToddlerRecord) => void;
  onAddMeasurement: (toddlerId: string, measurement: ToddlerMeasurement) => void;
  workspace: Workspace;
}

export const PosyanduModule: React.FC<PosyanduModuleProps> = ({
  mothers = [],
  toddlers = [],
  onAddMother,
  onAddToddler,
  onAddMeasurement,
  workspace,
}) => {
  const safeMothers = Array.isArray(mothers) ? mothers : [];
  const safeToddlers = Array.isArray(toddlers) ? toddlers : [];

  const [activeSubTab, setActiveSubTab] = useState<'BALITA' | 'MATERNAL'>('BALITA');
  const [selectedToddlerId, setSelectedToddlerId] = useState<string>(safeToddlers[0]?.id || '');
  
  // Modal states
  const [isAddMotherOpen, setIsAddMotherOpen] = useState(false);
  const [isAddToddlerOpen, setIsAddToddlerOpen] = useState(false);
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);

  // New Mother Form
  const [momType, setMomType] = useState<'BUMIL' | 'BUSUI'>('BUMIL');
  const [momName, setMomName] = useState('');
  const [momNik, setMomNik] = useState('');
  const [momAge, setMomAge] = useState(25);
  const [momGestationalWeek, setMomGestationalWeek] = useState(16);
  const [momChildAgeMonths, setMomChildAgeMonths] = useState(3);
  const [momCurrentWeight, setMomCurrentWeight] = useState(52);
  const [momHeight, setMomHeight] = useState(154);
  const [momLila, setMomLila] = useState(23.0); // alert if < 23.5
  const [momHb, setMomHb] = useState(11.2);
  const [momPosyandu, setMomPosyandu] = useState('Posyandu Melati 03');
  const [momNotes, setMomNotes] = useState('');

  // New Toddler Form
  const [todName, setTodName] = useState('');
  const [todNik, setTodNik] = useState('');
  const [todGender, setTodGender] = useState<'L' | 'P'>('L');
  const [todDob, setTodDob] = useState('2024-06-01');
  const [todParentName, setTodParentName] = useState('');
  const [todPhone, setTodPhone] = useState('');
  const [todPosyandu, setTodPosyandu] = useState('Posyandu Melati 03');

  // New Measurement Form
  const [measWeight, setMeasWeight] = useState(10.5);
  const [measHeight, setMeasHeight] = useState(83.0);
  const [measAgeMonths, setMeasAgeMonths] = useState(24);
  const [measDate, setMeasDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedToddler = toddlers.find((t) => t.id === selectedToddlerId) || toddlers[0];

  // Merge WHO standard curve with selected toddler's measurements
  const chartData = useMemo(() => {
    if (!selectedToddler) return KMS_WHO_CURVE_DATA;

    // Create month map
    return KMS_WHO_CURVE_DATA.map((curvePoint) => {
      const actualMeas = selectedToddler.measurements.find(
        (m) => Math.round(m.ageMonths) === curvePoint.month
      );

      return {
        ...curvePoint,
        actualWeight: actualMeas ? actualMeas.weightKg : null,
      };
    });
  }, [selectedToddler]);

  const handleCreateMother = (e: React.FormEvent) => {
    e.preventDefault();
    const hasKEK = momLila < 23.5;
    const hasAnemia = momHb < 11.0;

    const newMom: MotherRecord = {
      id: `mom-${Date.now()}`,
      type: momType,
      nik: momNik || `3201${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      name: momName,
      age: Number(momAge),
      gestationalWeek: momType === 'BUMIL' ? Number(momGestationalWeek) : undefined,
      childAgeMonths: momType === 'BUSUI' ? Number(momChildAgeMonths) : undefined,
      currentWeightKg: Number(momCurrentWeight),
      heightCm: Number(momHeight),
      lilaCm: Number(momLila),
      hbLevelGdl: Number(momHb),
      hasKEK,
      hasAnemia,
      posyanduName: momPosyandu,
      notes: momNotes || (hasKEK ? 'Terindikasi KEK (LILA < 23.5 cm), butuh PMT Spesifik BGN' : 'Kondisi stabil'),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onAddMother(newMom);
    setIsAddMotherOpen(false);
    setMomName('');
  };

  const handleCreateToddler = (e: React.FormEvent) => {
    e.preventDefault();
    const newTod: ToddlerRecord = {
      id: `tod-${Date.now()}`,
      nik: todNik || `3201${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      name: todName,
      gender: todGender,
      dob: todDob,
      parentName: todParentName,
      phone: todPhone,
      posyanduName: todPosyandu,
      measurements: [],
      isStuntingRisk: false,
      isUnderweight: false,
      isFalteringT2: false,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onAddToddler(newTod);
    setSelectedToddlerId(newTod.id);
    setIsAddToddlerOpen(false);
    setTodName('');
  };

  const handleCreateMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToddler) return;

    // Evaluate z-scores (simplified WHO 2-year old reference: median ~12kg, SD ~1.2kg; height median ~86cm, SD ~3.5cm)
    const zBBU = Number(((measWeight - 12.0) / 1.2).toFixed(1));
    const zTBU = Number(((measHeight - 86.0) / 3.5).toFixed(1));
    const zBBTB = Number(((measWeight / (measHeight / 100) ** 2 - 16.0) / 1.5).toFixed(1));

    // Check T2 Growth Faltering (check last measurement)
    const sortedMeas = [...selectedToddler.measurements].sort((a, b) => a.ageMonths - b.ageMonths);
    const lastMeas = sortedMeas[sortedMeas.length - 1];
    const isT2 = lastMeas ? measWeight <= lastMeas.weightKg : false;

    const newM: ToddlerMeasurement = {
      id: `m-${Date.now()}`,
      date: measDate,
      ageMonths: Number(measAgeMonths),
      weightKg: Number(measWeight),
      heightCm: Number(measHeight),
      t2Faltering: isT2,
      zScoreBBU: zBBU,
      zScoreTBU: zTBU,
      zScoreBBTB: zBBTB,
    };

    onAddMeasurement(selectedToddler.id, newM);
    setIsAddMeasurementOpen(false);
  };

  // Aggregated Alert Counters
  const kekMothersCount = safeMothers.filter((m) => m.hasKEK).length;
  const falteringToddlersCount = safeToddlers.filter((t) => t.isFalteringT2).length;
  const stuntingRiskToddlersCount = safeToddlers.filter((t) => t.isStuntingRisk).length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-pink-100 text-pink-700">
                POSYANDU KELOMPOK 3B
              </span>
              <span className="text-xs text-slate-500">
                1000 Hari Pertama Kehidupan (HPK)
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mt-1">
              Surveilans Gizi Maternal & KMS Digital Balita
            </h2>
            <p className="text-xs text-slate-500">
              Deteksi dini KEK Ibu Hamil (LILA &lt; 23.5 cm), Growth Faltering (T2), dan Kurva Pertumbuhan Standar WHO.
            </p>
          </div>

          {/* Sub Tab Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('BALITA')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'BALITA'
                  ? 'bg-white text-[#0052CC] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Baby className="w-4 h-4 text-[#0052CC]" />
              Balita & KMS Digital
              {falteringToddlersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {falteringToddlersCount} T2
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('MATERNAL')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'MATERNAL'
                  ? 'bg-white text-pink-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-pink-600" />
              Ibu Hamil & Menyusui
              {kekMothersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-pink-500 text-white font-bold">
                  {kekMothersCount} KEK
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* BALITA & KMS DIGITAL TAB */}
      {activeSubTab === 'BALITA' && (
        <div className="space-y-6">
          
          {/* Top Selection & Quick Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            
            {/* Toddler Profile Selector */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Data Anak Terdaftar
                </span>
                <button
                  onClick={() => setIsAddToddlerOpen(true)}
                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#0052CC] rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Anak
                </button>
              </div>

              <div className="space-y-2">
                {toddlers.map((t) => {
                  const isSelected = t.id === selectedToddlerId;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedToddlerId(t.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#0052CC] bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-sm">{t.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.gender === 'L' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'}`}>
                          {t.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Ortu: {t.parentName}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {t.isFalteringT2 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded">
                            Alert T2
                          </span>
                        )}
                        {t.isStuntingRisk && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                            Risiko Stunting
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KMS Chart Viewer & Diagnostic Alert Card */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              
              {selectedToddler && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-800">{selectedToddler.name}</h3>
                        <span className="text-xs font-mono text-slate-500">NIK: {selectedToddler.nik}</span>
                        <span className="text-xs text-slate-500">| Posyandu: {selectedToddler.posyanduName}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Tanggal Lahir: {selectedToddler.dob} | Ortu: {selectedToddler.parentName}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAddMeasurementOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0052CC] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Input Penimbangan Baru (KMS)
                    </button>
                  </div>

                  {/* Diagnostic Alert Box */}
                  {selectedToddler.isFalteringT2 ? (
                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-rose-800 flex items-center gap-2">
                          PERINGATAN DINI BGN: PERTUMBUHAN TIDAK NAIK (T2 / GROWTH FALTERING)
                        </div>
                        <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                          Berat badan anak tidak mengalami kenaikan selama 2 bulan berturut-turut. Segera lakukan rujukan evaluasi asupan gizi Puskesmas dan masukkan ke alokasi PMT Pemulihan Dapur SPPG BGN (ekstra protein hewani telur/ayam).
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Pertumbuhan anak dalam rentang normal dan mengikuti garis KMS standar WHO.</span>
                    </div>
                  )}

                  {/* KMS Digital WHO Graph */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700">
                        Kurva Pertumbuhan Berat Badan menurut Umur (BB/U) Standar WHO 2006
                      </span>
                      <span className="text-slate-400 text-[11px]">Garis hijau: Median | Garis merah: -3 SD</span>
                    </div>

                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis 
                            dataKey="month" 
                            label={{ value: 'Usia (Bulan)', position: 'insideBottomRight', offset: -5, fontSize: 10 }}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis 
                            label={{ value: 'Berat (kg)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                            tick={{ fontSize: 11 }}
                            domain={[0, 18]}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0A2540', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                          
                          {/* Standard Curve Lines */}
                          <Line type="monotone" dataKey="plus2SD" name="+2 SD (Batas Atas)" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                          <Line type="monotone" dataKey="median" name="Median WHO (Ideal)" stroke="#10B981" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="minus2SD" name="-2 SD (Garis Waspada)" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                          <Line type="monotone" dataKey="minus3SD" name="-3 SD (Gizi Buruk)" stroke="#EF4444" strokeWidth={2} dot={false} />
                          
                          {/* Actual Measurements */}
                          <Line 
                            type="monotone" 
                            dataKey="actualWeight" 
                            name={`BB ${selectedToddler.name} (kg)`} 
                            stroke="#0052CC" 
                            strokeWidth={3} 
                            dot={{ r: 5, fill: '#0052CC' }} 
                            connectNulls
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Measurement History Table */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Riwayat Penimbangan & Pengukuran
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <th className="py-2 px-3">Tanggal</th>
                            <th className="py-2 px-2">Usia (Bulan)</th>
                            <th className="py-2 px-2 text-right">Berat (kg)</th>
                            <th className="py-2 px-2 text-right">Tinggi (cm)</th>
                            <th className="py-2 px-2 text-center">Z-Score TB/U</th>
                            <th className="py-2 px-2 text-center">Status Pertumbuhan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedToddler.measurements.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-semibold text-slate-800">{m.date}</td>
                              <td className="py-2 px-2 font-mono">{m.ageMonths} bln</td>
                              <td className="py-2 px-2 text-right font-mono font-bold text-blue-700">{m.weightKg} kg</td>
                              <td className="py-2 px-2 text-right font-mono text-slate-700">{m.heightCm} cm</td>
                              <td className="py-2 px-2 text-center font-mono">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${m.zScoreTBU < -2 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                                  {m.zScoreTBU} SD
                                </span>
                              </td>
                              <td className="py-2 px-2 text-center">
                                {m.t2Faltering ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                    Tidak Naik (T2)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    Naik (N)
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

            </div>

          </div>

        </div>
      )}

      {/* MATERNAL (IBU HAMIL & IBU MENYUSUI) TAB */}
      {activeSubTab === 'MATERNAL' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-pink-600" />
                  Surveilans Ibu Hamil (Bumil) & Ibu Menyusui (Busui) Kelompok 3B
                </h3>
                <p className="text-xs text-slate-500">
                  Pemantauan Lingkar Lengan Atas (LILA &lt; 23.5 cm = KEK) dan Kadar Hemoglobin (Hb &lt; 11 g/dL = Anemia).
                </p>
              </div>

              <button
                onClick={() => setIsAddMotherOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Daftarkan Bumil / Busui
              </button>
            </div>

            {/* Mother Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-3">Nama & NIK</th>
                    <th className="py-3 px-2">Kategori</th>
                    <th className="py-3 px-2">Usia / Usia Kehamilan</th>
                    <th className="py-3 px-2 text-right">BB / TB</th>
                    <th className="py-3 px-2 text-center bg-pink-50/50 text-pink-800">LILA (cm)</th>
                    <th className="py-3 px-2 text-center">Kadar Hb (g/dL)</th>
                    <th className="py-3 px-2 text-center">Status Gizi Maternal</th>
                    <th className="py-3 px-3">Catatan & Intervensi BGN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mothers.map((mom) => (
                    <tr key={mom.id} className={`hover:bg-slate-50 ${mom.hasKEK ? 'bg-pink-50/30' : ''}`}>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{mom.name}</div>
                        <div className="font-mono text-[10px] text-slate-500">{mom.nik}</div>
                        <div className="text-[10px] text-slate-400">{mom.posyanduName}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          mom.type === 'BUMIL' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {mom.type === 'BUMIL' ? 'Ibu Hamil' : 'Ibu Menyusui'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-700">
                        <div>{mom.age} Tahun</div>
                        <div className="text-[11px] text-slate-500">
                          {mom.type === 'BUMIL' ? `Minggu ke-${mom.gestationalWeek}` : `Bayi ${mom.childAgeMonths} bln`}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-mono">
                        <div>{mom.currentWeightKg} kg</div>
                        <div className="text-[11px] text-slate-400">{mom.heightCm} cm</div>
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold text-sm bg-pink-50/30">
                        <span className={mom.lilaCm < 23.5 ? 'text-pink-700' : 'text-slate-800'}>
                          {mom.lilaCm} cm
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono">
                        <span className={`font-bold ${mom.hbLevelGdl && mom.hbLevelGdl < 11 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {mom.hbLevelGdl ? `${mom.hbLevelGdl} g/dL` : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="space-y-1">
                          {mom.hasKEK ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-300 animate-pulse">
                              RISIKO KEK
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Gizi Normal
                            </span>
                          )}
                          {mom.hasAnemia && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              Anemia
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-600">
                        {mom.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Add Mother Modal Dialog */}
      {isAddMotherOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-pink-400" />
                <h3 className="font-bold text-base">Registrasi Ibu Hamil / Menyusui (3B)</h3>
              </div>
              <button onClick={() => setIsAddMotherOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMother} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Sasaran *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMomType('BUMIL')}
                    className={`py-2 text-xs font-bold rounded-lg border ${momType === 'BUMIL' ? 'bg-purple-50 border-purple-600 text-purple-700' : 'border-slate-200'}`}
                  >
                    Ibu Hamil (Bumil)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMomType('BUSUI')}
                    className={`py-2 text-xs font-bold rounded-lg border ${momType === 'BUSUI' ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'border-slate-200'}`}
                  >
                    Ibu Menyusui (Busui)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Ibu *</label>
                  <input
                    type="text"
                    required
                    value={momName}
                    onChange={(e) => setMomName(e.target.value)}
                    placeholder="misal: Ny. Rahmawati"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIK (16 Digit)</label>
                  <input
                    type="text"
                    value={momNik}
                    onChange={(e) => setMomNik(e.target.value)}
                    placeholder="3201..."
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Usia Ibu (Tahun)</label>
                  <input
                    type="number"
                    value={momAge}
                    onChange={(e) => setMomAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {momType === 'BUMIL' ? 'Minggu Kehamilan' : 'Usia Bayi (Bulan)'}
                  </label>
                  <input
                    type="number"
                    value={momType === 'BUMIL' ? momGestationalWeek : momChildAgeMonths}
                    onChange={(e) => momType === 'BUMIL' ? setMomGestationalWeek(Number(e.target.value)) : setMomChildAgeMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={momCurrentWeight}
                    onChange={(e) => setMomCurrentWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={momHeight}
                    onChange={(e) => setMomHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* LILA & Hb Checks */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-pink-50/50 rounded-xl border border-pink-200">
                <div>
                  <label className="block text-xs font-bold text-pink-900 mb-1">
                    Lingkar Lengan (LILA cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={momLila}
                    onChange={(e) => setMomLila(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold border border-pink-300 rounded-lg bg-white"
                  />
                  <span className="text-[10px] text-pink-700 block mt-1">
                    Alert KEK jika &lt; 23.5 cm
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kadar Hb (g/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={momHb}
                    onChange={(e) => setMomHb(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg bg-white"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Alert Anemia jika &lt; 11 g/dL
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Posyandu Wilayah</label>
                <input
                  type="text"
                  value={momPosyandu}
                  onChange={(e) => setMomPosyandu(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMotherOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-sm"
                >
                  Simpan Data Ibu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Toddler Modal */}
      {isAddToddlerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="font-bold text-base">Registrasi Balita Baru</h3>
              </div>
              <button onClick={() => setIsAddToddlerOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateToddler} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Balita *</label>
                <input
                  type="text"
                  required
                  value={todName}
                  onChange={(e) => setTodName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={todGender}
                    onChange={(e) => setTodGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    required
                    value={todDob}
                    onChange={(e) => setTodDob(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Orang Tua</label>
                <input
                  type="text"
                  value={todParentName}
                  onChange={(e) => setTodParentName(e.target.value)}
                  placeholder="Ayah / Ibu"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Posyandu</label>
                <input
                  type="text"
                  value={todPosyandu}
                  onChange={(e) => setTodPosyandu(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddToddlerOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0052CC] hover:bg-blue-700 rounded-lg"
                >
                  Simpan Balita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Measurement Modal */}
      {isAddMeasurementOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="font-bold text-base">Input Data Penimbangan (KMS)</h3>
              </div>
              <button onClick={() => setIsAddMeasurementOpen(false)} className="text-slate-300 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMeasurement} className="p-6 space-y-3">
              <div className="text-xs text-slate-600 pb-2 border-b border-slate-100">
                Balita: <strong>{selectedToddler?.name}</strong>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Timbang</label>
                  <input
                    type="date"
                    required
                    value={measDate}
                    onChange={(e) => setMeasDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Usia (Bulan)</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    required
                    value={measAgeMonths}
                    onChange={(e) => setMeasAgeMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Berat Badan (kg) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={measWeight}
                    onChange={(e) => setMeasWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tinggi / Panjang (cm) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={measHeight}
                    onChange={(e) => setMeasHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMeasurementOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0052CC] hover:bg-blue-700 rounded-lg"
                >
                  Plot ke Kurva KMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
