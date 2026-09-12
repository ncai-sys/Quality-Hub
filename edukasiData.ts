import { FoodExchangeItem } from '../types';

export interface PilarGizi {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  details: string[];
  tips: string[];
  iconName: string;
  badge: string;
}

export const EMPAT_PILAR_GIZI: PilarGizi[] = [
  {
    id: 'pilar-1',
    number: 1,
    title: 'Mengonsumsi Anekapangan (Diversifikasi)',
    shortDesc: 'Tidak ada satu pun makanan yang mengandung semua zat gizi lengkap kecuali ASI untuk bayi 0-6 bulan.',
    details: [
      'Nasi merupakan sumber utama karbohidrat namun miskin vitamin dan mineral.',
      'Sayuran dan buah-buahan kaya vitamin, mineral, dan serat pangan tapi minim kalori dan protein.',
      'Ikan, daging, telur, dan susu kaya protein hewani berkualitas tinggi dan asam amino esensial lengkap.',
      'Konsumsi minimal 5 kelompok pangan setiap kali makan: Makanan Pokok, Lauk Hewani, Lauk Nabati, Sayuran, dan Buah.'
    ],
    tips: [
      'Gunakan konsep Isi Piringku: 50% piring sayur & buah, 50% pokok & lauk.',
      'Kombinasikan protein hewani dan nabati dalam perbandingan ideal (30% hewani : 70% nabati untuk dewasa, minimal 50% hewani untuk balita).'
    ],
    iconName: 'Utensils',
    badge: 'Pilar Utama'
  },
  {
    id: 'pilar-2',
    number: 2,
    title: 'Membiasakan Perilaku Hidup Bersih & Sehat (PHBS)',
    shortDesc: 'Mencegah transmisi bakteri patogen yang menyebabkan diare, cacingan, dan infeksi pemicu gizi kurang.',
    details: [
      'Penyakit infeksi menurunkan nafsu makan dan mempercepat kehilangan zat gizi secara drastis.',
      'Sebaliknya, kondisi kurang gizi melemahkan imunitas tubuh sehingga anak lebih mudah sakit (hubungan timbal balik infeksi & malnutrisi).',
      '45% kejadian diare balita dapat dicegah hanya dengan membiasakan cuci tangan pakai sabun di air bersih mengalir.',
      'Gunakan alas kaki untuk memutus rantai transmisi cacing tambang yang mencuri zat besi dan memicu anemia.'
    ],
    tips: [
      'Cuci tangan 6 langkah pakai sabun sebelum makan, sebelum menyiapkan MPASI, setelah BAB/menceboki anak, dan setelah memegang hewan.',
      'Tutup makanan yang telah matang agar tidak dihinggapi lalat vektor penyakit typus dan disentri.'
    ],
    iconName: 'Sparkles',
    badge: 'Pencegah Infeksi'
  },
  {
    id: 'pilar-3',
    number: 3,
    title: 'Melakukan Aktivitas Fisik Teratur',
    shortDesc: 'Menyeimbangkan pemasukan dan pengeluaran energi tubuh serta melancarkan metabolisme glukosa dan lipid.',
    details: [
      'Aktivitas fisik minimal 30 menit setiap hari (atau 150 menit per minggu) menurunkan risiko kematian dini hingga 40%.',
      'Mencegah timbulnya Penyakit Tidak Menular (PTM): Hipertensi, Diabetes Mellitus Tipe 2, Jantung Koroner, dan Stroke.',
      'Pada anak-anak, aktivitas fisik dan bermain di luar ruangan mengoptimalkan densitas tulang dan fungsi kognitif otak.',
      'Bagi usia dewasa dan lansia, latihan fisik menjaga massa otot (mencegah sarkopenia) dan kelenturan sendi.'
    ],
    tips: [
      'Gunakan tangga daripada lift, jalan kaki minimal 6.000 - 10.000 langkah sehari.',
      'Batasi screen-time (gawai/gadget) pada anak maksimal 1-2 jam per hari untuk mencegah obesitas anak.'
    ],
    iconName: 'Activity',
    badge: 'Kebugaran Metabolik'
  },
  {
    id: 'pilar-4',
    number: 4,
    title: 'Memantau Berat Badan Secara Teratur',
    shortDesc: 'Indikator paling objektif apakah asupan zat gizi harian seimbang dengan kebutuhan fisiologis tubuh.',
    details: [
      'Dewasa: Pantau Indeks Massa Tubuh (IMT). Rentang normal Indonesia adalah 18,5 - 25,0 kg/m².',
      'Balita: Penimbangan rutin setiap bulan di Posyandu menggunakan Kartu Menuju Sehat (KMS).',
      'Peringatan Berat Badan Tidak Naik 2x Berturut-turut (T2) merupakan tanda awal weight faltering yang berisiko menjadi stunting.',
      'Lingkar Lengan Atas (LiLA) Ibu Hamil minimal 23,5 cm untuk mencegah Kekurangan Energi Kronis (KEK) dan bayi BBLR (<2.500 g).'
    ],
    tips: [
      'Timbang berat badan balita setiap bulan di Posyandu (hari H Posyandu).',
      'Segera rujuk ke Puskesmas jika grafik anak memotong garis pertumbuhan ke bawah atau berada di Bawah Garis Merah (BGM).'
    ],
    iconName: 'Scale',
    badge: 'Deteksi Dini'
  }
];

export const MASTER_TABEL_PENUKAR: FoodExchangeItem[] = [
  // 1. Karbohidrat (1 porsi nasi = 100g = 3/4 gelas = 175 kkal, 4g protein, 40g KH)
  { id: 'ex-01', name: 'Nasi Beras Putih Giling', category: 'Karbohidrat', urt: '¾ Gelas', gram: 100, energyKcal: 175, proteinG: 4, fatG: 0, carbsG: 40, micronutrientHighlight: 'Sumber energi pokok utama' },
  { id: 'ex-02', name: 'Nasi Beras Merah', category: 'Karbohidrat', urt: '¾ Gelas', gram: 100, energyKcal: 175, proteinG: 4, fatG: 0.5, carbsG: 38, micronutrientHighlight: 'Tinggi serat, vitamin B1, indeks glikemik rendah' },
  { id: 'ex-03', name: 'Kentang Rebus', category: 'Karbohidrat', urt: '2 Buah Sedang', gram: 210, energyKcal: 175, proteinG: 4, fatG: 0.2, carbsG: 40, micronutrientHighlight: 'Kaya kalium penstabil tekanan darah' },
  { id: 'ex-04', name: 'Singkong Rebus', category: 'Karbohidrat', urt: '1 ½ Potong Sedang', gram: 120, energyKcal: 175, proteinG: 1.5, fatG: 0.3, carbsG: 40, micronutrientHighlight: 'Pangan lokal bebas gluten' },
  { id: 'ex-05', name: 'Ubi Jalar Kuning / Ungu', category: 'Karbohidrat', urt: '1 Biji Sedang', gram: 135, energyKcal: 175, proteinG: 2.4, fatG: 0.4, carbsG: 41, micronutrientHighlight: 'Tinggi beta-karoten (Vit A) dan antosianin' },
  { id: 'ex-06', name: 'Jagung Segar Rebus', category: 'Karbohidrat', urt: '3 Buah Sedang', gram: 125, energyKcal: 175, proteinG: 4.5, fatG: 1.2, carbsG: 38, micronutrientHighlight: 'Kaya zeaxanthin & lutein untuk kesehatan mata' },
  { id: 'ex-07', name: 'Roti Gandum / Tawar Putih', category: 'Karbohidrat', urt: '3 Iris', gram: 70, energyKcal: 175, proteinG: 5.6, fatG: 1.5, carbsG: 35, micronutrientHighlight: 'Praktis untuk bekal sekolah & sarapan' },
  { id: 'ex-08', name: 'Mie Basah Matang', category: 'Karbohidrat', urt: '2 Gelas', gram: 200, energyKcal: 175, proteinG: 4, fatG: 1.0, carbsG: 38, micronutrientHighlight: 'Alternatif energi cepat cerna' },
  { id: 'ex-09', name: 'Bihun Kering Olah', category: 'Karbohidrat', urt: '½ Gelas', gram: 50, energyKcal: 175, proteinG: 2.5, fatG: 0.1, carbsG: 40, micronutrientHighlight: 'Rendah lemak, cocok untuk sup kuah bening' },
  { id: 'ex-10', name: 'Talas Rebus', category: 'Karbohidrat', urt: '½ Biji Sedang', gram: 125, energyKcal: 175, proteinG: 2.0, fatG: 0.2, carbsG: 41, micronutrientHighlight: 'Pangan lokal pati resisten ramah usus' },

  // 2. Protein Hewani Rendah Lemak (1 porsi = 50 kkal, 7g protein, 2g lemak)
  { id: 'ex-11', name: 'Ikan Kembung Segar', category: 'Protein Hewani Rendah Lemak', urt: '⅓ Ekor Sedang', gram: 30, energyKcal: 50, proteinG: 7, fatG: 2, carbsG: 0, micronutrientHighlight: 'Omega-3 & DHA lebih tinggi dari salmon, anti-stunting' },
  { id: 'ex-12', name: 'Daging Ayam Tanpa Kulit', category: 'Protein Hewani Rendah Lemak', urt: '1 Potong Sedang', gram: 40, energyKcal: 50, proteinG: 7, fatG: 2, carbsG: 0, micronutrientHighlight: 'Asam amino lengkap mudah dicerna anak' },
  { id: 'ex-13', name: 'Ikan Lele / Nila Segar', category: 'Protein Hewani Rendah Lemak', urt: '⅓ Ekor Sedang', gram: 40, energyKcal: 50, proteinG: 7, fatG: 2, carbsG: 0, micronutrientHighlight: 'Pangan lokal budidaya terjangkau' },
  { id: 'ex-14', name: 'Putih Telur Ayam', category: 'Protein Hewani Rendah Lemak', urt: '2 ½ Butir', gram: 65, energyKcal: 50, proteinG: 7, fatG: 0, carbsG: 0, micronutrientHighlight: '100% albumin murni tanpa kolesterol' },
  { id: 'ex-15', name: 'Udang Segar Kupas', category: 'Protein Hewani Rendah Lemak', urt: '5 Ekor Sedang', gram: 35, energyKcal: 50, proteinG: 7, fatG: 1, carbsG: 0, micronutrientHighlight: 'Kaya seng (Zinc) dan yodium' },
  { id: 'ex-16', name: 'Ikan Teri Kering Tawar', category: 'Protein Hewani Rendah Lemak', urt: '1 Sendok Makan', gram: 20, energyKcal: 50, proteinG: 7, fatG: 1.5, carbsG: 0, micronutrientHighlight: 'Juara kalsium organik pembentuk tulang & gigi' },

  // 3. Protein Hewani Sedang Lemak (1 porsi = 75 kkal, 7g protein, 5g lemak)
  { id: 'ex-17', name: 'Telur Ayam Ras Utuh', category: 'Protein Hewani Sedang Lemak', urt: '1 Butir', gram: 55, energyKcal: 75, proteinG: 7, fatG: 5, carbsG: 0.6, micronutrientHighlight: 'Kolin tinggi untuk otak & daya ingat anak' },
  { id: 'ex-18', name: 'Daging Sapi Tanpa Lemak', category: 'Protein Hewani Sedang Lemak', urt: '1 Potong Sedang', gram: 35, energyKcal: 75, proteinG: 7, fatG: 5, carbsG: 0, micronutrientHighlight: 'Besi Heme paling mudah diserap cegah anemia' },
  { id: 'ex-19', name: 'Hati Ayam Kampung', category: 'Protein Hewani Sedang Lemak', urt: '1 Buah Sedang', gram: 30, energyKcal: 75, proteinG: 7, fatG: 4.5, carbsG: 0.8, micronutrientHighlight: 'Superfood pencegah anemia & booster Vit A' },
  { id: 'ex-20', name: 'Telur Puyuh Rebus', category: 'Protein Hewani Sedang Lemak', urt: '5 Butir', gram: 55, energyKcal: 75, proteinG: 7, fatG: 5.5, carbsG: 0.5, micronutrientHighlight: 'Ukuran mungil disukai balita' },
  { id: 'ex-21', name: 'Bakso Daging Sapi Halus', category: 'Protein Hewani Sedang Lemak', urt: '10 Biji Sedang', gram: 170, energyKcal: 75, proteinG: 7, fatG: 4.5, carbsG: 3.5, micronutrientHighlight: 'Variasi lauk MBG anak sekolah' },

  // 4. Protein Hewani Tinggi Lemak (1 porsi = 150 kkal, 7g protein, 13g lemak)
  { id: 'ex-22', name: 'Daging Bebek', category: 'Protein Hewani Tinggi Lemak', urt: '1 Potong Sedang', gram: 45, energyKcal: 150, proteinG: 7, fatG: 13, carbsG: 0, micronutrientHighlight: 'Padat kalori untuk pemulihan berat badan' },
  { id: 'ex-23', name: 'Ayam dengan Kulit', category: 'Protein Hewani Tinggi Lemak', urt: '1 Potong Sedang', gram: 40, energyKcal: 150, proteinG: 7, fatG: 12, carbsG: 0, micronutrientHighlight: 'Batasi konsumsi kulit pada kelompok dewasa' },

  // 5. Protein Nabati (1 porsi tempe = 50g = 2 potong sedang = 80 kkal, 6g protein, 3g lemak, 8g KH)
  { id: 'ex-24', name: 'Tempe Kedelai Murni', category: 'Protein Nabati', urt: '2 Potong Sedang', gram: 50, energyKcal: 80, proteinG: 6, fatG: 3, carbsG: 8, micronutrientHighlight: 'Isoflavon antioksidan & prebiotik usus sehat' },
  { id: 'ex-25', name: 'Tahu Kedelai Putih', category: 'Protein Nabati', urt: '2 Potong Sedang', gram: 100, energyKcal: 80, proteinG: 6, fatG: 3.5, carbsG: 4.5, micronutrientHighlight: 'Tekstur lembut ramah balita & lansia' },
  { id: 'ex-26', name: 'Kacang Hijau Kupas', category: 'Protein Nabati', urt: '2 ½ Sendok Makan', gram: 25, energyKcal: 80, proteinG: 5.5, fatG: 0.5, carbsG: 14, micronutrientHighlight: 'Kaya asam folat & vitamin B kompleks' },
  { id: 'ex-27', name: 'Kacang Merah Basah', category: 'Protein Nabati', urt: '2 ½ Sendok Makan', gram: 25, energyKcal: 80, proteinG: 5.8, fatG: 0.4, carbsG: 15, micronutrientHighlight: 'Tinggi serat larut pengontrol kolesterol' },

  // 6. Sayuran Golongan B (1 porsi 100g = 1 gelas tiris = 25 kkal, 1g protein, 5g KH)
  { id: 'ex-28', name: 'Bayam Hijau', category: 'Sayuran B', urt: '1 Gelas Tiris', gram: 100, energyKcal: 25, proteinG: 1.2, fatG: 0.2, carbsG: 5, micronutrientHighlight: 'Zat besi non-heme & vitamin C alami' },
  { id: 'ex-29', name: 'Wortel Lokal Segar', category: 'Sayuran B', urt: '1 Gelas Tiris', gram: 100, energyKcal: 25, proteinG: 1.0, fatG: 0.3, carbsG: 5.5, micronutrientHighlight: 'Vitamin A (beta-karoten) untuk mata & epitel' },
  { id: 'ex-30', name: 'Brokoli Hijau', category: 'Sayuran B', urt: '1 Gelas Tiris', gram: 100, energyKcal: 25, proteinG: 2.0, fatG: 0.2, carbsG: 4.5, micronutrientHighlight: 'Sulforaphane pelindung sel & imun' },
  { id: 'ex-31', name: 'Labu Siam', category: 'Sayuran B', urt: '1 Gelas Tiris', gram: 100, energyKcal: 25, proteinG: 0.8, fatG: 0.1, carbsG: 5.0, micronutrientHighlight: 'Rendah purin, menyejukkan lambung' },
  { id: 'ex-32', name: 'Buncis Muda', category: 'Sayuran B', urt: '1 Gelas Tiris', gram: 100, energyKcal: 25, proteinG: 1.4, fatG: 0.2, carbsG: 5.2, micronutrientHighlight: 'Kaya serat pangan pengatur gula darah' },

  // 7. Sayuran Golongan C (1 porsi 100g = 50 kkal, 3g protein, 10g KH)
  { id: 'ex-33', name: 'Daun Katuk', category: 'Sayuran C', urt: '1 Gelas Tiris', gram: 100, energyKcal: 50, proteinG: 4.8, fatG: 1.0, carbsG: 9.8, micronutrientHighlight: 'Booster ASI laktogogum terbukti ilmiah' },
  { id: 'ex-34', name: 'Daun Singkong Muda', category: 'Sayuran C', urt: '1 Gelas Tiris', gram: 100, energyKcal: 50, proteinG: 3.5, fatG: 1.2, carbsG: 9.0, micronutrientHighlight: 'Padat kalsium & vitamin A lokal' },
  { id: 'ex-35', name: 'Nangka Muda (Gori)', category: 'Sayuran C', urt: '1 Gelas Tiris', gram: 100, energyKcal: 50, proteinG: 2.0, fatG: 0.4, carbsG: 11.0, micronutrientHighlight: 'Pangan tradisional kaya serat' },

  // 8. Buah-buahan (1 porsi = 50g pisang = 50 kkal, 10g KH)
  { id: 'ex-36', name: 'Pisang Ambon / Raja', category: 'Buah-buahan', urt: '1 Buah Sedang', gram: 50, energyKcal: 50, proteinG: 0.6, fatG: 0.1, carbsG: 12, micronutrientHighlight: 'Kalium instan & pektin pelindung usus' },
  { id: 'ex-37', name: 'Pepaya Matang', category: 'Buah-buahan', urt: '1 Potong Besar', gram: 150, energyKcal: 50, proteinG: 0.8, fatG: 0.2, carbsG: 12, micronutrientHighlight: 'Enzim papain pelancar pencernaan (bebas sembelit)' },
  { id: 'ex-38', name: 'Jeruk Manis Lokal', category: 'Buah-buahan', urt: '2 Buah Sedang', gram: 100, energyKcal: 50, proteinG: 0.9, fatG: 0.2, carbsG: 11, micronutrientHighlight: 'Vitamin C mempercepat penyerapan zat besi telur/sayur' },
  { id: 'ex-39', name: 'Semangka Merah', category: 'Buah-buahan', urt: '2 Potong Sedang', gram: 180, energyKcal: 50, proteinG: 0.9, fatG: 0.3, carbsG: 12, micronutrientHighlight: 'Likopen tinggi & hidrasi air segar 92%' },
  { id: 'ex-40', name: 'Alpukat Mentega', category: 'Buah-buahan', urt: '½ Buah Besar', gram: 50, energyKcal: 50, proteinG: 0.5, fatG: 4.5, carbsG: 2.5, micronutrientHighlight: 'Asam lemak tak jenuh ganda & pelarut vitamin A,D,E,K' },

  // 9. Minyak & Lemak (1 porsi = 50 kkal, 5g lemak)
  { id: 'ex-41', name: 'Minyak Sawit Terfortifikasi', category: 'Minyak/Lemak', urt: '1 Sendok Teh', gram: 5, energyKcal: 50, proteinG: 0, fatG: 5, carbsG: 0, micronutrientHighlight: 'Fortifikasi Vitamin A nasional' },
  { id: 'ex-42', name: 'Santan Kelapa Peras Encer', category: 'Minyak/Lemak', urt: '⅓ Gelas Belimbing', gram: 40, energyKcal: 50, proteinG: 0.5, fatG: 5, carbsG: 1.5, micronutrientHighlight: 'Lemak tambahan gurih untuk MPASI balita' }
];

export interface MpasiRecipeGuide {
  id: string;
  stage: '6-8 Bulan (Lumat)' | '9-11 Bulan (Lembik)' | '12-23 Bulan (Keluarga)';
  name: string;
  frequency: string;
  amountPerMeal: string;
  texture: string;
  ingredients: string[];
  steps: string[];
  nutrition: {
    energyKcal: number;
    proteinG: number;
    fatG: number;
    ironMg: number;
    vitAMcg: number;
    zincMg: number;
  };
  kiaNotes: string;
}

export const RESEP_MPASI_BUKU_KIA: MpasiRecipeGuide[] = [
  {
    id: 'mpasi-01',
    stage: '6-8 Bulan (Lumat)',
    name: 'Bubur Sumsum Kacang Hijau Gurih (MP-ASI Sederhana)',
    frequency: '2-3 kali makan utama + 1-2 kali selingan ASI',
    amountPerMeal: '2-3 sendok makan penuh, bertahap hingga ½ mangkuk 250 ml',
    texture: 'Lumat & kental (tidak tumpah saat sendok dimiringkan)',
    ingredients: [
      '15 gr (1.5 sdm) tepung beras lokal',
      '10 gr (1 sdm) kacang hijau rebus dihaluskan',
      '75 cc (⅓ gelas belimbing) santan encer segar',
      '20 gr daun bayam segar diiris halus'
    ],
    steps: [
      '1. Rebus kacang hijau dan daun bayam hingga lunak, saring menggunakan saringan kawat atau blender halus.',
      '2. Campurkan tepung beras dengan sedikit air hangat hingga larut merata.',
      '3. Masak larutan tepung beras dengan santan encer di atas api kecil sambil terus diaduk hingga meletup-letup.',
      '4. Masukkan kacang hijau dan bayam saring, aduk rata 2 menit, angkat dan sajikan hangat.'
    ],
    nutrition: {
      energyKcal: 152.7,
      proteinG: 3.3,
      fatG: 7.8,
      ironMg: 1.5,
      vitAMcg: 104.0,
      zincMg: 0.6
    },
    kiaNotes: 'Buku KIA 2024: Jangan menambahkan gula pasir atau penyedap rasa sintetis. Lemak santan membantu penyerapan vitamin A bayam.'
  },
  {
    id: 'mpasi-02',
    stage: '6-8 Bulan (Lumat)',
    name: 'Bubur Beras Merah Ikan Kembung Saus Jeruk (MP-ASI Lengkap)',
    frequency: '2-3 kali makan utama + ASI',
    amountPerMeal: '½ mangkuk ukuran 250 ml',
    texture: 'Lumat halus saring, bebas duri ikan 100%',
    ingredients: [
      '15 gr beras merah (atau 30 gr nasi aron beras merah)',
      '10 gr (1 sdm datar) daging ikan kembung segar, kukus & haluskan',
      '10 gr (1 sdm) kacang tolo / kacang merah haluskan',
      '20 gr daun bayam iris tipis',
      '1 sdt minyak kelapa / kelapa sawit',
      '50 gr (1 buah sedang) jeruk manis peras'
    ],
    steps: [
      '1. Masak beras merah dan kacang tolo dengan air hingga menjadi bubur lunak.',
      '2. Masukkan daging ikan kembung cincang halus dan minyak kelapa, aduk hingga matang sempurna.',
      '3. Sesaat sebelum matang, masukkan daun bayam, masak 2 menit.',
      '4. Saring bubur di atas saringan kawat stainless steel. Sajikan dengan 1-2 sdm perasan jeruk manis segar.'
    ],
    nutrition: {
      energyKcal: 150.0,
      proteinG: 4.9,
      fatG: 6.0,
      ironMg: 1.2,
      vitAMcg: 110.8,
      zincMg: 0.6
    },
    kiaNotes: 'Kombinasi asam amino ikan kembung + zat besi bayam diserap maksimal berkat vitamin C jeruk peras.'
  },
  {
    id: 'mpasi-03',
    stage: '9-11 Bulan (Lembik)',
    name: 'Nasi Tim Kangkung Hati Ayam Saus Pepaya (MP-ASI Lengkap)',
    frequency: '3-4 kali makan utama + 1-2 kali selingan ASI',
    amountPerMeal: '½ mangkuk ukuran 250 ml per makan',
    texture: 'Lembik / dicincang halus (belajar mengunyah dengan gusi)',
    ingredients: [
      '50 gr nasi aron bersih',
      '20 gr hati ayam kampung segar cincang halus',
      '20 gr tempe kedelai potong dadu mikro',
      '15 gr kangkung segar cincang',
      '10 gr tomat buang kulit & biji',
      '1 sdt minyak kelapa',
      '75 cc kaldu ayam asli',
      '50 gr pepaya manis haluskan'
    ],
    steps: [
      '1. Masukkan nasi aron, cincangan hati ayam, tempe, dan minyak kelapa ke dalam mangkok tim stainless steel.',
      '2. Tuangkan air kaldu ayam asli hingga merendam bahan.',
      '3. Kukus dalam dandang/steamer selama 25-30 menit hingga lunak dan bumbu meresap.',
      '4. Masukkan kangkung dan tomat 5 menit sebelum matang. Angkat, sajikan berdampingan dengan saos pepaya segar.'
    ],
    nutrition: {
      energyKcal: 187.5,
      proteinG: 7.9,
      fatG: 7.2,
      ironMg: 2.3,
      vitAMcg: 185.0,
      zincMg: 0.8
    },
    kiaNotes: 'Hati ayam adalah booster zat besi terbaik untuk mencegah anemia defisiensi besi dan gagal tumbuh pada usia 9 bulan.'
  },
  {
    id: 'mpasi-04',
    stage: '12-23 Bulan (Keluarga)',
    name: 'Menu Makanan Keluarga Seimbang BGN (Ayam Suwir & Sup Jagung)',
    frequency: '3-4 kali makan utama + 2 kali selingan sehat',
    amountPerMeal: '¾ mangkuk ukuran 250 ml (porsi anak)',
    texture: 'Makanan keluarga dipotong kecil-kecil, tekstur padat normal',
    ingredients: [
      '75 gr nasi putih pulen hangat',
      '40 gr ayam bumbu kuning tanpa tulang, disuwir halus',
      '25 gr tahu goreng dadu kecil',
      '40 gr sup jagung manis, wortel, dan buncis',
      '50 gr pisang raja potong bulat'
    ],
    steps: [
      '1. Sajikan nasi pulen hangat dengan porsi ¾ mangkuk.',
      '2. Berikan ayam suwir bumbu kuning (pastikan empuk dan tidak pedas tajam).',
      '3. Siramkan sup sayur jagung dan wortel kaya serat.',
      '4. Ajarkan anak memegang sendok sendiri dan makan bersama anggota keluarga di meja makan.'
    ],
    nutrition: {
      energyKcal: 280.0,
      proteinG: 12.5,
      fatG: 9.0,
      ironMg: 2.8,
      vitAMcg: 220.0,
      zincMg: 1.2
    },
    kiaNotes: 'Anak sudah makan menu keluarga! Jangan biasakan jajan snack tinggi garam/micin atau minuman manis dalam kemasan.'
  }
];

export interface GiziKelompokGuide {
  id: string;
  groupName: string;
  targetKcal: string;
  focusNutrients: string[];
  keyRecommendations: string[];
  restrictions: string[];
  colorBadge: string;
}

export const PANDUAN_GIZI_KELOMPOK: GiziKelompokGuide[] = [
  {
    id: 'grp-bumil',
    groupName: 'Ibu Hamil (Bumil 1000 HPK)',
    targetKcal: '+180 kkal (TM1) s/d +300 kkal (TM2-3) di atas kebutuhan normal (~2.500 kkal)',
    focusNutrients: ['Asam Folat (600 mcg/hari)', 'Zat Besi Fe (27 mg/hari)', 'Kalsium (1.200 mg/hari)', 'Yodium', 'Protein Hewani (+30g di TM3)'],
    keyRecommendations: [
      'Minum minimal 1 Tablet Tambah Darah (TTD) setiap hari selama kehamilan minimal 90 tablet.',
      'Konsumsi minimal 2-3 Liter air putih (8-12 gelas) per hari untuk sirkulasi plasenta dan cairan ketuban.',
      'Konsumsi protein hewani setiap kali makan: Telur, ikan laut segar (kembung/tongkol), daging tanpa lemak.',
      'Atasi mual (hiperemesis) dengan makan porsi kecil tapi sering (small frequent meals).'
    ],
    restrictions: [
      'Batasi kafein kopi/teh maksimal 1-2 cangkir/hari (<100 mg) karena menghambat penyerapan zat besi.',
      'Batasi garam (<2.000 mg Na/hari atau 1 sdt garam) untuk mencegah pre-eklamsia dan hipertensi gestasional.',
      'Hindari makanan mentah/setengah matang (daging mentah, sushi mentah, telur setengah matang) pemicu toksoplasma/listeria.'
    ],
    colorBadge: 'bg-pink-100 text-pink-700 border-pink-200'
  },
  {
    id: 'grp-busui',
    groupName: 'Ibu Menyusui (Busui 0-24 Bulan)',
    targetKcal: '+330 kkal (6 bln pertama) s/d +400 kkal (6 bln kedua) (~2.500 - 2.600 kkal)',
    focusNutrients: ['Protein (+20 g/hari)', 'Kalsium (1.200 mg/hari)', 'Cairan (3.000 ml / 12-13 gelas)', 'Vitamin A & D', 'Zat Besi'],
    keyRecommendations: [
      'Minum air putih minimal 3 Liter (12-13 gelas) per hari untuk menjaga volume produksi ASI 600-850 ml/hari.',
      'Konsumsi sayuran hijau pelancar ASI lokal: Daun katuk, daun torbangun, bayam, dan kacang-kacangan.',
      'Berjemur sinar matahari pagi 15 menit untuk sintesis Vitamin D pengoptimal penyerapan kalsium ASI.',
      'Lanjutkan minum Tablet Tambah Darah (TTD) selama masa nifas (40 hari pasca persalinan).'
    ],
    restrictions: [
      'Hindari konsumsi kafein berlebih (>300 mg) karena kafein masuk ke ASI dan menurunkan kadar zat besi ASI hingga 30%.',
      'Hindari rokok dan alkohol yang mencemari ASI dan mengganggu refleks let-down ASI.'
    ],
    colorBadge: 'bg-rose-100 text-rose-700 border-rose-200'
  },
  {
    id: 'grp-balita',
    groupName: 'Balita (0-59 Bulan) & Balita 3B',
    targetKcal: '800 kkal (6-11 bln) | 1.350 kkal (1-3 thn) | 1.400 kkal (4-6 thn)',
    focusNutrients: ['Protein Hewani Tinggi (Telur, Ikan, Daging)', 'Lemak Esensial (Minyak/Santan)', 'Zat Besi', 'Seng (Zinc)', 'Vitamin A'],
    keyRecommendations: [
      'Inisiasi Menyusu Dini (IMD) minimal 1 jam setelah lahir dan ASI Eksklusif 0-6 bulan.',
      'Mulai MPASI tepat pada usia 6 bulan secara bertahap (lumat -> lembik -> keluarga).',
      'Wajib berikan protein hewani setiap hari (1 butir telur sehari terbukti menurunkan stunting hingga 47%).',
      'Ikuti Posyandu rutin setiap bulan untuk plot KMS dan dapatkan Kapsul Vitamin A (Februari & Agustus) serta Obat Cacing.'
    ],
    restrictions: [
      'Jangan beri MPASI hanya berupa air tajin, bubur nasi polosan, atau bubur sayur tanpa lauk hewani.',
      'Jangan tambahkan MSG, gula buatan berlebih, dan hindari jajanan chiki/permen yang membuat kenyang semu.'
    ],
    colorBadge: 'bg-sky-100 text-sky-700 border-sky-200'
  },
  {
    id: 'grp-sekolah',
    groupName: 'Peserta Didik (SD - SMP - SMA)',
    targetKcal: '1.650 kkal (SD Kecil) | 2.000 kkal (SD Besar) | 2.400 - 2.650 kkal (Remaja)',
    focusNutrients: ['Karbohidrat Kompleks', 'Protein Pembangun Jaringan', 'Zat Besi (Remaja Putri)', 'Kalsium Tulang', 'Serat'],
    keyRecommendations: [
      'Wajib Sarapan Sehat sebelum jam 07:00 pagi untuk menyuplai glukosa otak (konsentrasi belajar).',
      'Makan siang Program Makan Bergizi Gratis (MBG) porsi 35% AKG tepat waktu pada jam istirahat sekolah.',
      'Remaja putri wajib konsumsi Tablet Tambah Darah (TTD) 1 tablet setiap minggu di sekolah untuk cegah anemia.',
      'Bawa botol air minum pribadi dari rumah dan habiskan minimal 1,5 - 2 Liter sehari di sekolah.'
    ],
    restrictions: [
      'Batasi konsumsi gorengan bertepung minyak jelantah dan minuman manis boba/sachet di kantin sekolah.',
      'Hindari melewatkan sarapan yang berakibat lemas, kantuk, dan penurunan prestasi belajar.'
    ],
    colorBadge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  {
    id: 'grp-dewasa-lansia',
    groupName: 'Dewasa & Usia Lanjut (>60 Tahun)',
    targetKcal: '2.150 - 2.550 kkal (Dewasa) | 1.400 - 1.800 kkal (Lansia)',
    focusNutrients: ['Kalsium & Vitamin D (Cegah Osteoporosis)', 'Serat Pangan Tinggi', 'Rendah Gula, Garam, Lemak (GGL)', 'Air 1.5 - 2 L'],
    keyRecommendations: [
      'Terapkan batasan G4-G1-L5: Gula maks 4 sdm (50g), Garam maks 1 sdt (2.000 mg Na), Lemak maks 5 sdm (67g) per orang/hari.',
      'Lansia: perbanyak sayuran dan buah segar tinggi serat untuk mencegah konstipasi (BAB keras).',
      'Aktivitas fisik ringan teratur: Senam lansia, jalan santai pagi 30 menit 3-5 kali seminggu.',
      'Pertahankan Indeks Massa Tubuh (IMT) di rentang normal 18,5 - 25,0 kg/m².'
    ],
    restrictions: [
      'Batasi makanan tinggi purin (jeroan, melinjo, ekstrak daging) bagi lansia penderita asam urat.',
      'Hindari makanan olahan awetan ultra-processed food (UPF) berkadar natrium tinggi.'
    ],
    colorBadge: 'bg-amber-100 text-amber-700 border-amber-200'
  }
];
