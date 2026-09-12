import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Sparkles, 
  Apple, 
  Utensils, 
  Activity, 
  Scale, 
  Baby, 
  Info, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Calculator, 
  AlertCircle, 
  Droplet, 
  BookmarkCheck,
  BookOpen
} from 'lucide-react';
import { 
  EMPAT_PILAR_GIZI, 
  MASTER_TABEL_PENUKAR, 
  RESEP_MPASI_BUKU_KIA, 
  PANDUAN_GIZI_KELOMPOK,
  MpasiRecipeGuide
} from '../data/edukasiData';

export const EdukasiGiziSeimbang: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'4PILAR' | 'PIRINGKU' | 'PENUKAR' | 'MPASI' | 'KELOMPOK' | 'KALKULATOR'>('4PILAR');
  
  // Interactive Plate State
  const [selectedPlateSection, setSelectedPlateSection] = useState<'pokok' | 'lauk' | 'sayur' | 'buah'>('sayur');
  
  // Food Exchange Table Search & Filter State
  const [exchangeSearch, setExchangeSearch] = useState('');
  const [selectedExchangeCat, setSelectedExchangeCat] = useState<string>('ALL');
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);

  // BMI & Pregnancy Calculator State
  const [calcGender, setCalcGender] = useState<'P' | 'L'>('P');
  const [calcWeight, setCalcWeight] = useState<number>(55);
  const [calcHeight, setCalcHeight] = useState<number>(160);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [gestationalWeek, setGestationalWeek] = useState<number>(20);
  const [prePregnancyWeight, setPrePregnancyWeight] = useState<number>(52);

  // Selected Recipe Modal / Detail
  const [selectedRecipe, setSelectedRecipe] = useState<MpasiRecipeGuide | null>(RESEP_MPASI_BUKU_KIA[0]);

  // BMI Calculation
  const bmiResult = useMemo(() => {
    const heightM = calcHeight / 100;
    if (heightM <= 0 || calcWeight <= 0) return { bmi: 0, status: 'Tidak Valid', color: 'text-slate-500' };
    const bmi = Number((calcWeight / (heightM * heightM)).toFixed(1));
    
    // Indonesian Permenkes standard
    if (bmi < 17.0) return { bmi, status: 'Sangat Kurus (KEK Berat)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (bmi < 18.5) return { bmi, status: 'Kurus (KEK Ringan)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (bmi <= 25.0) return { bmi, status: 'Normal / Ideal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bmi <= 27.0) return { bmi, status: 'Gemuk (Overweight)', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { bmi, status: 'Obesitas', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  }, [calcWeight, calcHeight]);

  // Pregnancy Weight Gain recommendation
  const pregnancyGainRecommendation = useMemo(() => {
    const heightM = calcHeight / 100;
    const preBmi = Number((prePregnancyWeight / (heightM * heightM)).toFixed(1));
    let targetTotal = '11.5 - 16.0 kg';
    let trimesterRate = '0.4 kg/minggu (Trimester 2 & 3)';

    if (preBmi < 18.5) {
      targetTotal = '12.5 - 18.0 kg';
      trimesterRate = '0.5 kg/minggu (Perlu asupan ekstra kalori)';
    } else if (preBmi >= 25.0 && preBmi <= 29.9) {
      targetTotal = '7.0 - 11.5 kg';
      trimesterRate = '0.3 kg/minggu (Pantau ketat kenaikan berat)';
    } else if (preBmi >= 30.0) {
      targetTotal = '5.0 - 9.0 kg';
      trimesterRate = '0.2 kg/minggu (Cegah obesitas gestasional)';
    }

    const currentGain = Number((calcWeight - prePregnancyWeight).toFixed(1));
    return { preBmi, targetTotal, trimesterRate, currentGain };
  }, [calcWeight, calcHeight, prePregnancyWeight]);

  // Filtered Food Exchange Items
  const filteredExchanges = useMemo(() => {
    return MASTER_TABEL_PENUKAR.filter((item) => {
      const matchCat = selectedExchangeCat === 'ALL' || item.category === selectedExchangeCat;
      const matchSearch = item.name.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(exchangeSearch.toLowerCase()) ||
                          (item.micronutrientHighlight && item.micronutrientHighlight.toLowerCase().includes(exchangeSearch.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedExchangeCat, exchangeSearch]);

  const categories = useMemo(() => {
    const cats = new Set(MASTER_TABEL_PENUKAR.map((item) => item.category));
    return ['ALL', ...Array.from(cats)];
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner - Soft Blue & Soft Pink Theme */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0052CC] via-[#0A2540] to-[#1E3A8A] p-6 sm:p-8 text-white shadow-lg border border-blue-200/20">
        {/* Soft Pink decorative accent glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-pink-400/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-200 border border-pink-300/30">
                <Heart className="w-3.5 h-3.5 text-pink-300 fill-pink-300" />
                Permenkes No. 41 / 2014 & Buku KIA 2024
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-400/20 text-sky-200 border border-sky-300/20">
                Standar Nasional BGN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pusat Edukasi Gizi Seimbang & Buku KIA 2024
            </h1>
            <p className="mt-1 text-sm sm:text-base text-blue-100/90 max-w-2xl">
              Panduan interaktif 4 Pilar Gizi Seimbang, visualisasi piring makan BGN, tabel penukar bahan makanan (URT), serta resep MPASI kaya protein hewani pencegah stunting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center min-w-[120px]">
              <div className="text-xs text-pink-200 font-medium">Slogan Resmi</div>
              <div className="text-xs font-bold text-white mt-0.5">Gizi Seimbang Bangsa Berprestasi</div>
            </div>
          </div>
        </div>

        {/* Navigation Pills inside Edukasi Module */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/15">
          <button
            onClick={() => setActiveSubTab('4PILAR')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeSubTab === '4PILAR'
                ? 'bg-white text-[#0052CC] shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            4 Pilar Gizi Seimbang
          </button>
          <button
            onClick={() => setActiveSubTab('PIRINGKU')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeSubTab === 'PIRINGKU'
                ? 'bg-white text-[#0052CC] shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Utensils className="w-4 h-4 text-emerald-300" />
            Isi Piringku & Tumpeng Gizi
          </button>
          <button
            onClick={() => setActiveSubTab('PENUKAR')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeSubTab === 'PENUKAR'
                ? 'bg-white text-[#0052CC] shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Scale className="w-4 h-4 text-sky-300" />
            Tabel Bahan Penukar (URT)
          </button>
          <button
            onClick={() => setActiveSubTab('MPASI')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeSubTab === 'MPASI'
                ? 'bg-pink-500 text-white shadow-md font-bold'
                : 'bg-pink-500/30 hover:bg-pink-500/40 text-pink-100 border border-pink-400/30'
            }`}
          >
            <Baby className="w-4 h-4 text-pink-200" />
            Panduan MPASI Buku KIA
          </button>
          <button
            onClick={() => setActiveSubTab('KELOMPOK')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeSubTab === 'KELOMPOK'
                ? 'bg-white text-[#0052CC] shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Apple className="w-4 h-4 text-rose-300" />
            Panduan Kelompok 3B & Sekolah
          </button>
          <button
            onClick={() => setActiveSubTab('KALKULATOR')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeSubTab === 'KALKULATOR'
                ? 'bg-white text-[#0052CC] shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-300" />
            Kalkulator IMT & BB Hamil
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: 4 PILAR GIZI SEIMBANG */}
      {activeSubTab === '4PILAR' && (
        <div className="space-y-6">
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-[#0052CC] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700">
              <span className="font-bold text-[#0052CC]">Prinsip Pengganti 4 Sehat 5 Sempurna:</span> Slogan 4 Sehat 5 Sempurna (1952) hanya menekankan jenis bahan. <strong className="text-slate-900">Pedoman Gizi Seimbang (Permenkes 41/2014)</strong> menekankan <strong>proporsi porsi terukur</strong>, perilaku hidup bersih (PHBS), aktivitas fisik, dan pemantauan berat badan rutin untuk mencegah beban ganda masalah gizi (stunting & obesitas).
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {EMPAT_PILAR_GIZI.map((pilar) => (
              <div 
                key={pilar.id} 
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0052CC] text-white font-black text-sm">
                      {pilar.number}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200">
                      {pilar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {pilar.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 italic leading-relaxed">
                    "{pilar.shortDesc}"
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kaidah Klinis & Standar:</div>
                    <ul className="space-y-1.5">
                      {pilar.details.map((detail, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 bg-slate-50/60 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-[#0052CC] mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Penerapan Praktis SPPG:
                  </div>
                  {pilar.tips.map((tip, idx) => (
                    <p key={idx} className="text-[11px] text-slate-600 leading-normal">
                      • {tip}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ISI PIRINGKU & TUMPENG GIZI SEIMBANG */}
      {activeSubTab === 'PIRINGKU' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Plate Simulator */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-[#0052CC]" />
                    Simulator Interaktif: "Isi Piringku: Sekali Makan"
                  </h2>
                  <p className="text-xs text-slate-500">Klik sektor piring untuk melihat rasio gramasi, panduan URT, dan fungsi biologis.</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-pink-100 text-pink-700 border border-pink-200">
                  Standar BGN
                </span>
              </div>

              {/* Graphical Plate Layout */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto my-6 rounded-full border-8 border-slate-100 shadow-inner bg-slate-50 p-2 flex items-center justify-center">
                <div className="relative w-full h-full rounded-full overflow-hidden grid grid-cols-2 grid-rows-2 gap-1.5 p-1 bg-white">
                  {/* Sektor 1: Makanan Pokok (2/3 dari 50% = 33.3% piring) */}
                  <button
                    onClick={() => setSelectedPlateSection('pokok')}
                    className={`rounded-tl-full flex flex-col items-center justify-center p-4 transition-all duration-200 ${
                      selectedPlateSection === 'pokok'
                        ? 'bg-amber-400 text-slate-950 font-bold scale-102 ring-4 ring-amber-300 z-10'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">Makanan Pokok</span>
                    <span className="text-[11px] opacity-80">⅔ dari ½ Piring (33%)</span>
                  </button>

                  {/* Sektor 2: Sayuran (2/3 dari 50% = 33.3% piring) */}
                  <button
                    onClick={() => setSelectedPlateSection('sayur')}
                    className={`rounded-tr-full flex flex-col items-center justify-center p-4 transition-all duration-200 ${
                      selectedPlateSection === 'sayur'
                        ? 'bg-emerald-500 text-white font-bold scale-102 ring-4 ring-emerald-300 z-10'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">Sayur-Mayur</span>
                    <span className="text-[11px] opacity-80">⅔ dari ½ Piring (33%)</span>
                  </button>

                  {/* Sektor 3: Lauk Pauk (1/3 dari 50% = 16.7% piring) */}
                  <button
                    onClick={() => setSelectedPlateSection('lauk')}
                    className={`rounded-bl-full flex flex-col items-center justify-center p-4 transition-all duration-200 ${
                      selectedPlateSection === 'lauk'
                        ? 'bg-sky-500 text-white font-bold scale-102 ring-4 ring-sky-300 z-10'
                        : 'bg-sky-100 hover:bg-sky-200 text-sky-900'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">Lauk Pauk</span>
                    <span className="text-[11px] opacity-80">⅓ dari ½ (17%)</span>
                  </button>

                  {/* Sektor 4: Buah-Buahan (1/3 dari 50% = 16.7% piring) */}
                  <button
                    onClick={() => setSelectedPlateSection('buah')}
                    className={`rounded-br-full flex flex-col items-center justify-center p-4 transition-all duration-200 ${
                      selectedPlateSection === 'buah'
                        ? 'bg-pink-400 text-white font-bold scale-102 ring-4 ring-pink-300 z-10'
                        : 'bg-pink-100 hover:bg-pink-200 text-pink-900'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">Buah-Buahan</span>
                    <span className="text-[11px] opacity-80">⅓ dari ½ (17%)</span>
                  </button>
                </div>
              </div>

              {/* Accompanying Water & Hygiene Bar */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-sky-50 border border-sky-200/60">
                  <Droplet className="w-5 h-5 text-sky-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Minum Air Bersih</div>
                    <div className="text-[11px] text-slate-500">1-2 gelas per makan (total 8 gelas/hari)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-pink-50 border border-pink-200/60">
                  <Sparkles className="w-5 h-5 text-pink-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Cuci Tangan Sabun</div>
                    <div className="text-[11px] text-slate-500">Air mengalir 40-60 detik (6 langkah)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Plate Details Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detail Sektor Terpilih</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {selectedPlateSection === 'pokok' && 'Makanan Pokok (33%)'}
                    {selectedPlateSection === 'sayur' && 'Sayuran Hijau & Warna (33%)'}
                    {selectedPlateSection === 'lauk' && 'Lauk Pauk Protein (17%)'}
                    {selectedPlateSection === 'buah' && 'Buah-buahan Segar (17%)'}
                  </span>
                </div>

                {selectedPlateSection === 'pokok' && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-amber-900">Sumber Karbohidrat & Energi Tubuh</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Memasok glukosa stabil untuk fungsi otak anak sekolah dan energi beraktivitas fisik.
                    </p>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-bold">Standar Porsi Sekali Makan MBG:</div>
                      <div>• Nasi: 100 - 150 gram (¾ s/d 1 mangkuk sedang = 175 - 250 kkal)</div>
                      <div>• Padanan: Kentang rebus 210g atau Singkong 120g atau Ubi 135g.</div>
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>Anjuran BGN:</strong> Kombinasikan dengan beras merah atau jagung untuk menambah serat pangan dan vitamin B1.
                    </div>
                  </div>
                )}

                {selectedPlateSection === 'sayur' && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-emerald-900">Sayur-Mayur (Sumber Vitamin, Mineral & Serat)</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Porsi sayur dalam Isi Piringku <strong>setara dengan porsi makanan pokok</strong>. Mencegah sembelit, menstabilkan gula darah, dan memasok antioksidan alami.
                    </p>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                      <div className="font-bold">Standar Porsi Sekali Makan MBG:</div>
                      <div>• Sayuran Masak: 100 - 150 gram (1 s/d 1½ mangkuk tiris)</div>
                      <div>• Pilihan Terbaik: Bayam, wortel, brokoli, labu siam, kacang panjang, buncis.</div>
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>Kaidah Pengolahan SOP 022:</strong> Cuci sayuran sebelum dipotong di bawah air mengalir. Masak jangan terlalu layu agar vitamin C tidak rusak.
                    </div>
                  </div>
                )}

                {selectedPlateSection === 'lauk' && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-sky-900">Lauk Pauk (Protein Hewani & Nabati)</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Zat pembangun sel, otot, dan enzim imunitas. Protein hewani terbukti paling esensial dalam mencegah stunting.
                    </p>
                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-950 space-y-1">
                      <div className="font-bold">Standar Porsi Sekali Makan MBG:</div>
                      <div>• Protein Hewani: 1 potong sedang ikan (40-60g) / ayam (50-70g) / 1 butir telur (55g).</div>
                      <div>• Protein Nabati: 1-2 potong sedang tempe (50g) atau tahu (100g).</div>
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>Prioritas BGN:</strong> Utamakan protein hewani lokal kaya omega-3 seperti ikan kembung, tongkol, lele, atau telur ayam.
                    </div>
                  </div>
                )}

                {selectedPlateSection === 'buah' && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-pink-900">Buah-Buahan (Vitamin C & Enzim Alami)</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Mempercepat penyerapan zat besi dari lauk dan sayuran hingga 4x lipat, menjaga elastisitas pembuluh darah.
                    </p>
                    <div className="p-3 bg-pink-50 rounded-xl border border-pink-200 text-xs text-pink-950 space-y-1">
                      <div className="font-bold">Standar Porsi Sekali Makan MBG:</div>
                      <div>• 1 buah pisang ambon / raja (50g) atau 1 potong besar pepaya (100-150g) atau 1-2 buah jeruk manis.</div>
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>Kaidah Higiene SOP 023:</strong> Buah potong dibatasi kontak suhu ruang maksimal 15 menit dan ditutup cling wrap rapat.
                    </div>
                  </div>
                )}
              </div>

              {/* Tumpeng Gizi Seimbang Guidelines */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2">
                <div className="font-bold text-pink-300 flex items-center justify-between">
                  <span>Pedoman G4 - G1 - L5 (Batas Harian):</span>
                  <span className="text-[10px] bg-pink-950 text-pink-200 px-2 py-0.5 rounded border border-pink-700">Permenkes 30/2013</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[10px]">Gula (G4)</div>
                    <div className="font-bold text-amber-300 text-sm">Maks 4 sdm</div>
                    <div className="text-[10px] text-slate-400">(50 gram)</div>
                  </div>
                  <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[10px]">Garam (G1)</div>
                    <div className="font-bold text-blue-300 text-sm">Maks 1 sdt</div>
                    <div className="text-[10px] text-slate-400">(2.000 mg Na)</div>
                  </div>
                  <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-[10px]">Lemak (L5)</div>
                    <div className="font-bold text-pink-300 text-sm">Maks 5 sdm</div>
                    <div className="text-[10px] text-slate-400">(67 gram)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TABEL BAHAN PENUKAR (URT) */}
      {activeSubTab === 'PENUKAR' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#0052CC]" />
                  Tabel Bahan Makanan Penukar (Ukuran Rumah Tangga - URT)
                </h2>
                <p className="text-xs text-slate-500">
                  Data resmi Lampiran Permenkes 41/2014 untuk merancang rotasi menu MBG dan substitusi bahan pangan lokal.
                </p>
              </div>

              {/* Portion Multiplier Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Simulasi Porsi:</span>
                <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
                  {[1, 2, 3, 5].map((mult) => (
                    <button
                      key={mult}
                      onClick={() => setPortionMultiplier(mult)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                        portionMultiplier === mult
                          ? 'bg-[#0052CC] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {mult}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari bahan penukar (misal: beras merah, ikan, tempe, bayam, pepaya)..."
                  value={exchangeSearch}
                  onChange={(e) => setExchangeSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:bg-white"
                />
              </div>

              <select
                value={selectedExchangeCat}
                onChange={(e) => setSelectedExchangeCat(e.target.value)}
                className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'Semua Golongan Makanan' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Food Exchange Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {filteredExchanges.map((item) => {
                const scaledGram = item.gram * portionMultiplier;
                const scaledKcal = item.energyKcal * portionMultiplier;
                const scaledProtein = (item.proteinG * portionMultiplier).toFixed(1);
                const scaledFat = (item.fatG * portionMultiplier).toFixed(1);
                const scaledCarbs = (item.carbsG * portionMultiplier).toFixed(1);

                return (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all duration-150 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#0052CC] border border-sky-200">
                          {item.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {scaledGram} gram
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium mb-3">
                        Takaran URT: <strong className="text-slate-800">{item.urt}</strong> {portionMultiplier > 1 && `(x${portionMultiplier})`}
                      </p>

                      {item.micronutrientHighlight && (
                        <div className="p-2 rounded-lg bg-pink-50/60 border border-pink-200/60 text-[11px] text-pink-800 mb-3">
                          ✨ {item.micronutrientHighlight}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1 pt-2 border-t border-slate-200/80 text-center">
                      <div className="p-1 rounded bg-amber-50/80">
                        <div className="text-[9px] text-amber-700">Kalori</div>
                        <div className="text-xs font-bold text-amber-900">{scaledKcal}</div>
                      </div>
                      <div className="p-1 rounded bg-sky-50/80">
                        <div className="text-[9px] text-sky-700">Protein</div>
                        <div className="text-xs font-bold text-sky-900">{scaledProtein}g</div>
                      </div>
                      <div className="p-1 rounded bg-rose-50/80">
                        <div className="text-[9px] text-rose-700">Lemak</div>
                        <div className="text-xs font-bold text-rose-900">{scaledFat}g</div>
                      </div>
                      <div className="p-1 rounded bg-emerald-50/80">
                        <div className="text-[9px] text-emerald-700">Karbo</div>
                        <div className="text-xs font-bold text-emerald-900">{scaledCarbs}g</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PANDUAN MPASI BUKU KIA 2024 */}
      {activeSubTab === 'MPASI' && (
        <div className="space-y-6">
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 flex items-start gap-3">
            <Baby className="w-6 h-6 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-pink-900">
                Prinsip Utama MP-ASI Berbasis Pangan Lokal (Buku KIA 2024):
              </h3>
              <p className="text-xs text-pink-800 mt-1 leading-relaxed">
                Mulai tepat usia 6 bulan. MPASI <strong>wajib padat gizi</strong> dan mengandung <strong>Protein Hewani (Telur, Ikan, Hati Ayam, Daging)</strong> setiap kali makan. Hindari MPASI yang hanya berupa bubur tepung atau sayur saring tanpa lemak tambahan. Tekstur ditingkatkan bertahap sesuai usia motorik oral anak!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Stage Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tahapan Tekstur & Resep BGN:</div>
              {RESEP_MPASI_BUKU_KIA.map((recipe) => {
                const isSelected = selectedRecipe?.id === recipe.id;
                return (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-pink-50/80 border-pink-400 shadow-sm ring-2 ring-pink-300'
                        : 'bg-white border-slate-200 hover:border-pink-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-200 mb-1.5">
                        {recipe.stage}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{recipe.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">Tekstur: {recipe.texture}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-2 shrink-0 ${isSelected ? 'text-pink-600' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Detailed Recipe Viewer */}
            {selectedRecipe && (
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800">
                      {selectedRecipe.stage}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      {selectedRecipe.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Nilai Kalori</div>
                    <div className="text-base font-black text-pink-600">{selectedRecipe.nutrition.energyKcal} kkal</div>
                  </div>
                </div>

                {/* Macro & Micro badges */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4 text-center">
                  <div className="p-2 rounded-lg bg-sky-50 border border-sky-100">
                    <div className="text-[10px] text-sky-700">Protein</div>
                    <div className="text-xs font-bold text-sky-900">{selectedRecipe.nutrition.proteinG}g</div>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
                    <div className="text-[10px] text-rose-700">Lemak</div>
                    <div className="text-xs font-bold text-rose-900">{selectedRecipe.nutrition.fatG}g</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="text-[10px] text-amber-700">Zat Besi Fe</div>
                    <div className="text-xs font-bold text-amber-900">{selectedRecipe.nutrition.ironMg}mg</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <div className="text-[10px] text-emerald-700">Vit A</div>
                    <div className="text-xs font-bold text-emerald-900">{selectedRecipe.nutrition.vitAMcg}µg</div>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50 border border-purple-100">
                    <div className="text-[10px] text-purple-700">Seng (Zn)</div>
                    <div className="text-xs font-bold text-purple-900">{selectedRecipe.nutrition.zincMg}mg</div>
                  </div>
                  <div className="p-2 rounded-lg bg-pink-50 border border-pink-100">
                    <div className="text-[10px] text-pink-700">Frekuensi</div>
                    <div className="text-[10px] font-bold text-pink-900">2-3x / hari</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  {/* Ingredients */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-[#0052CC]" />
                      Bahan Baku Lokal (Per Porsi):
                    </div>
                    <ul className="space-y-1">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Feeding Schedule & Rules */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-pink-500" />
                      Aturan Pemberian Makanan:
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div>• <strong>Porsi:</strong> {selectedRecipe.amountPerMeal}</div>
                      <div>• <strong>Frekuensi:</strong> {selectedRecipe.frequency}</div>
                      <div>• <strong>Tekstur:</strong> {selectedRecipe.texture}</div>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-bold text-slate-800">Cara Pengolahan Higienis (SOP 027 BGN):</div>
                  <div className="space-y-1.5">
                    {selectedRecipe.steps.map((step, idx) => (
                      <div key={idx} className="text-xs text-slate-600 p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buku KIA Special Note */}
                <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-900 flex items-start gap-2">
                  <BookmarkCheck className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Catatan Klinis Buku KIA 2024: </span>
                    {selectedRecipe.kiaNotes}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PANDUAN KELOMPOK 3B & SEKOLAH */}
      {activeSubTab === 'KELOMPOK' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PANDUAN_GIZI_KELOMPOK.map((grp) => (
              <div key={grp.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${grp.colorBadge}`}>
                      {grp.groupName}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {grp.targetKcal}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Zat Gizi Prioritas:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {grp.focusNutrients.map((n, i) => (
                        <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Anjuran Operasional & Pola Makan:
                    </div>
                    <ul className="space-y-1">
                      {grp.keyRecommendations.map((rec, i) => (
                        <li key={i} className="text-xs text-slate-600 pl-2 border-l-2 border-emerald-400">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 bg-rose-50/50 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-rose-800 mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Batasan & Hal yang Dihindari:
                  </div>
                  <ul className="space-y-1 text-[11px] text-rose-900">
                    {grp.restrictions.map((rst, i) => (
                      <li key={i}>• {rst}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: KALKULATOR IMT & BERAT BADAN HAMIL */}
      {activeSubTab === 'KALKULATOR' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs Card */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#0052CC]" />
                  Kalkulator Indeks Massa Tubuh (IMT) & Kehamilan
                </h3>
                <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg">
                  Kemenkes RI
                </span>
              </div>

              {/* Gender Toggle */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Jenis Kelamin</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setCalcGender('P'); setIsPregnant(false); }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      calcGender === 'P'
                        ? 'bg-pink-50 text-pink-700 border-pink-300 ring-2 ring-pink-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Perempuan
                  </button>
                  <button
                    onClick={() => { setCalcGender('L'); setIsPregnant(false); }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      calcGender === 'L'
                        ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Laki-Laki
                  </button>
                </div>
              </div>

              {/* Weight Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Berat Badan Saat Ini:</span>
                  <span className="text-sm font-bold text-[#0052CC]">{calcWeight} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="140"
                  step="0.5"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0052CC]"
                />
              </div>

              {/* Height Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Tinggi Badan:</span>
                  <span className="text-sm font-bold text-[#0052CC]">{calcHeight} cm</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="210"
                  step="1"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0052CC]"
                />
              </div>

              {/* Pregnant Checkbox (Only for female) */}
              {calcGender === 'P' && (
                <div className="p-4 rounded-xl bg-pink-50/70 border border-pink-200 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPregnant}
                      onChange={(e) => setIsPregnant(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 accent-pink-500"
                    />
                    <span className="text-xs font-bold text-pink-950">Sedang Hamil (Kelompok Sasaran Bumil 3B)</span>
                  </label>

                  {isPregnant && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-[11px] font-semibold text-pink-900 block mb-1">Usia Kehamilan</label>
                        <select
                          value={gestationalWeek}
                          onChange={(e) => setGestationalWeek(parseInt(e.target.value))}
                          className="w-full text-xs bg-white border border-pink-200 rounded-lg p-2 text-slate-700"
                        >
                          <option value={8}>Trimester 1 (Mg 8)</option>
                          <option value={16}>Trimester 2 (Mg 16)</option>
                          <option value={24}>Trimester 2 (Mg 24)</option>
                          <option value={32}>Trimester 3 (Mg 32)</option>
                          <option value={36}>Trimester 3 (Mg 36)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-pink-900 block mb-1">BB Pra-Hamil (kg)</label>
                        <input
                          type="number"
                          value={prePregnancyWeight}
                          onChange={(e) => setPrePregnancyWeight(parseFloat(e.target.value) || 0)}
                          className="w-full text-xs bg-white border border-pink-200 rounded-lg p-2 text-slate-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results Card */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hasil Evaluasi Status Gizi</div>
                
                <div className="flex items-baseline gap-3 mb-4">
                  <div className="text-4xl font-extrabold text-slate-900">{bmiResult.bmi}</div>
                  <div className="text-xs text-slate-500">kg/m² (IMT)</div>
                </div>

                <div className={`p-3.5 rounded-xl border font-bold text-sm mb-4 ${bmiResult.color}`}>
                  Kategori: {bmiResult.status}
                </div>

                {/* Official Cutoff Table */}
                <div className="text-xs font-bold text-slate-700 mb-2">Batas Ambang IMT Dewasa (Kemenkes RI):</div>
                <div className="space-y-1 text-xs text-slate-600 mb-4">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Sangat Kurus (KEK Berat)</span>
                    <span className="font-semibold text-rose-600">&lt; 17,0</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Kurus (KEK Ringan)</span>
                    <span className="font-semibold text-amber-600">17,0 - &lt; 18,5</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 bg-emerald-50/50 px-1 rounded">
                    <span className="font-bold text-emerald-800">Normal / Gizi Baik</span>
                    <span className="font-bold text-emerald-800">18,5 - 25,0</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Gemuk (Overweight Ringan)</span>
                    <span className="font-semibold text-orange-600">&gt; 25,0 - 27,0</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Obesitas (Overweight Berat)</span>
                    <span className="font-semibold text-rose-600">&gt; 27,0</span>
                  </div>
                </div>

                {/* Pregnancy specific guidance if active */}
                {isPregnant && (
                  <div className="p-3.5 rounded-xl bg-pink-50 border border-pink-200 text-xs space-y-1 text-pink-950">
                    <div className="font-bold text-pink-900 flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4 text-pink-600" />
                      Rekomendasi Kenaikan Berat Badan Kehamilan:
                    </div>
                    <div>• IMT Pra-Hamil: <strong>{pregnancyGainRecommendation.preBmi}</strong></div>
                    <div>• Total Kenaikan Berat Dianjurkan: <strong>{pregnancyGainRecommendation.targetTotal}</strong></div>
                    <div>• Laju Kenaikan Trimester 2 & 3: <strong>{pregnancyGainRecommendation.trimesterRate}</strong></div>
                    <div>• Kenaikan saat ini: <strong>+{pregnancyGainRecommendation.currentGain} kg</strong></div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
                Data mengacu pada Permenkes No. 41 Tahun 2014 & Panduan Pelayanan Gizi Ibu Hamil Kementerian Kesehatan RI.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
