import { AKGTarget, TKPIFood, BgnSOP, BumbuDasarRecipe, Workspace, MenuPlan, HACCPLog, MotherRecord, ToddlerRecord } from '../types';

export const BGN_TARGET_AKG_2026: Record<string, AKGTarget> = {
  PAUD_TK: {
    id: 'PAUD_TK',
    name: 'PAUD / TK (Usia 2-5 Tahun)',
    ageRange: '2-5 Tahun',
    energyKcal: 480, // 35% of ~1400 kcal
    proteinG: 14,
    fatG: 16,
    carbsG: 70,
    ironMg: 2.8,
    calciumMg: 220,
    vitAMcg: 160,
    vitCMg: 15,
    fiberG: 6,
    sodiumMg: 350,
    portionRatio: 0.35,
    description: 'Porsi makan siang ramah balita/anak usia dini, tekstur lunak-sedang, minim bumbu pedas, tinggi kalsium dan zat besi.'
  },
  SD_KECIL: {
    id: 'SD_KECIL',
    name: 'SD Kecil (Kelas 1-3 / 7-9 Tahun)',
    ageRange: '7-9 Tahun',
    energyKcal: 580, // 35% of ~1650 kcal
    proteinG: 18,
    fatG: 20,
    carbsG: 85,
    ironMg: 3.5,
    calciumMg: 300,
    vitAMcg: 160,
    vitCMg: 18,
    fiberG: 8,
    sodiumMg: 450,
    portionRatio: 0.35,
    description: 'Porsi makan siang sekolah dasar kelas awal, mendukung kognitif dan pembentukan tulang.'
  },
  SD_BESAR: {
    id: 'SD_BESAR',
    name: 'SD Besar (Kelas 4-6 / 10-12 Tahun)',
    ageRange: '10-12 Tahun',
    energyKcal: 680, // 35% of ~2000 kcal
    proteinG: 22,
    fatG: 24,
    carbsG: 100,
    ironMg: 4.5,
    calciumMg: 350,
    vitAMcg: 160,
    vitCMg: 22,
    fiberG: 10,
    sodiumMg: 500,
    portionRatio: 0.35,
    description: 'Porsi makan siang pra-remaja dengan aktivitas fisik tinggi, pencegahan anemia dan stunting.'
  },
  SMP_SMA: {
    id: 'SMP_SMA',
    name: 'SMP / SMA (Usia 13-18 Tahun)',
    ageRange: '13-18 Tahun',
    energyKcal: 780, // 35% of ~2300 kcal
    proteinG: 28,
    fatG: 28,
    carbsG: 120,
    ironMg: 6.0,
    calciumMg: 420,
    vitAMcg: 160,
    vitCMg: 28,
    fiberG: 12,
    sodiumMg: 600,
    portionRatio: 0.35,
    description: 'Porsi gizi remaja percepatan pertumbuhan (growth spurt), fokus protein tinggi dan mikronutrien zat besi bagi remaja putri.'
  },
  BUMIL: {
    id: 'BUMIL',
    name: 'Ibu Hamil (Bumil Kelompok 3B)',
    ageRange: 'Ibu Hamil Trimester 1-3',
    energyKcal: 820,
    proteinG: 32,
    fatG: 28,
    carbsG: 115,
    ironMg: 9.0,
    calciumMg: 450,    vitAMcg: 160,
    vitCMg: 35,
    fiberG: 12,
    sodiumMg: 550,
    portionRatio: 0.35,
    description: 'Porsi intervensi gizi 1000 HPK, penanganan KEK (LILA < 23.5 cm) dan suplemen mikronutrien pembentukan organ janin.'
  },
  BUSUI: {
    id: 'BUSUI',
    name: 'Ibu Menyusui (Busui Kelompok 3B)',
    ageRange: 'Ibu Menyusui 0-12 Bulan',
    energyKcal: 860,
    proteinG: 34,
    fatG: 30,
    carbsG: 125,
    ironMg: 8.5,
    calciumMg: 480,    vitAMcg: 160,
    vitCMg: 40,
    fiberG: 13,
    sodiumMg: 550,
    portionRatio: 0.35,
    description: 'Porsi pemulihan maternal dan pemicu produksi ASI eksklusif kaya protein hewani, asam folat, dan cairan.'
  }
};

export const MASTER_TKPI_DATABASE: TKPIFood[] = [
  // Serealia
  {
    id: 'tkpi-001',
    code: 'SER-01',
    name: 'Beras Giling Putih',
    category: 'Serealia',
    bdd: 100,
    energyKcal: 357,
    proteinG: 8.4,
    fatG: 1.7,
    carbsG: 77.1,
    calciumMg: 25,
    ironMg: 1.8,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0.4,
    sodiumMg: 27,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 15500
  },
  {
    id: 'tkpi-002',
    code: 'SER-02',
    name: 'Beras Merah Lokal',
    category: 'Serealia',
    bdd: 100,
    energyKcal: 352,
    proteinG: 7.5,
    fatG: 2.7,
    carbsG: 74.4,
    calciumMg: 32,
    ironMg: 4.2,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 3.5,
    sodiumMg: 15,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 19000
  },
  {
    id: 'tkpi-003',
    code: 'SER-03',
    name: 'Kentang Segar',
    category: 'Serealia',
    bdd: 85,
    energyKcal: 87,
    proteinG: 2.0,
    fatG: 0.1,
    carbsG: 20.1,
    calciumMg: 11,
    ironMg: 0.8,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 17,
    fiberG: 1.8,
    sodiumMg: 6,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 18000
  },
  // Daging & Unggas
  {
    id: 'tkpi-004',
    code: 'DAG-01',
    name: 'Daging Ayam Broiler Karkas',
    category: 'Daging/Unggas',
    bdd: 58, // BDD 58% (ada tulang dan lemak kulit)
    energyKcal: 298,
    proteinG: 18.2,
    fatG: 25.0,
    carbsG: 0,
    calciumMg: 14,
    ironMg: 1.5,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0,
    sodiumMg: 77,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 38000
  },
  {
    id: 'tkpi-005',
    code: 'DAG-02',
    name: 'Daging Ayam Fillet (Dada Tanpa Kulit)',
    category: 'Daging/Unggas',
    bdd: 100,
    energyKcal: 150,
    proteinG: 31.0,
    fatG: 3.2,
    carbsG: 0,
    calciumMg: 12,
    ironMg: 1.0,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0,
    sodiumMg: 65,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 52000
  },
  {
    id: 'tkpi-006',
    code: 'DAG-03',
    name: 'Daging Sapi Murni Semur',
    category: 'Daging/Unggas',
    bdd: 100,
    energyKcal: 201,
    proteinG: 18.8,
    fatG: 14.0,
    carbsG: 0,
    calciumMg: 11,
    ironMg: 2.8,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0,
    sodiumMg: 93,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 125000
  },
  // Ikan & Seafood
  {
    id: 'tkpi-007',
    code: 'IKN-01',
    name: 'Ikan Kembung Segar',
    category: 'Ikan/Kerang/Udang',
    bdd: 80,
    energyKcal: 112,
    proteinG: 21.4,
    fatG: 2.3,
    carbsG: 0,
    calciumMg: 136,
    ironMg: 2.0,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0,
    sodiumMg: 130,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 36000
  },
  {
    id: 'tkpi-008',
    code: 'IKN-02',
    name: 'Ikan Lele Segar',
    category: 'Ikan/Kerang/Udang',
    bdd: 76,
    energyKcal: 105,
    proteinG: 18.7,
    fatG: 2.9,
    carbsG: 0,
    calciumMg: 20,
    ironMg: 1.2,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0,
    sodiumMg: 65,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 28000
  },
  {
    id: 'tkpi-009',
    code: 'IKN-03',
    name: 'Ikan Tongkol Segar',
    category: 'Ikan/Kerang/Udang',
    bdd: 90,
    energyKcal: 117,
    proteinG: 23.2,
    fatG: 2.1,
    carbsG: 0,
    calciumMg: 92,
    ironMg: 1.7,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0,
    sodiumMg: 85,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 34000
  },
  // Telur
  {
    id: 'tkpi-010',
    code: 'TLR-01',
    name: 'Telur Ayam Ras (Butir Utuh)',
    category: 'Telur',
    bdd: 89, // BDD 89% (kulit telur ~11%)
    energyKcal: 154,
    proteinG: 12.4,
    fatG: 10.8,
    carbsG: 0.7,
    calciumMg: 86,
    ironMg: 3.0,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0,
    sodiumMg: 142,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 29000
  },
  {
    id: 'tkpi-011',
    code: 'TLR-02',
    name: 'Telur Puyuh Rebus',
    category: 'Telur',
    bdd: 88,
    energyKcal: 158,
    proteinG: 13.1,
    fatG: 11.1,
    carbsG: 0.4,
    calciumMg: 64,
    ironMg: 3.7,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0,
    sodiumMg: 141,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 36000
  },
  // Kacang/Biji/Bean
  {
    id: 'tkpi-012',
    code: 'KAC-01',
    name: 'Tempe Kedelai Murni',
    category: 'Kacang/Biji/Bean',
    bdd: 100,
    energyKcal: 201,
    proteinG: 20.8,
    fatG: 8.8,
    carbsG: 13.5,
    calciumMg: 155,
    ironMg: 4.0,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 1.4,
    sodiumMg: 9,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 16000
  },
  {
    id: 'tkpi-013',
    code: 'KAC-02',
    name: 'Tahu Putih Segar',
    category: 'Kacang/Biji/Bean',
    bdd: 100,
    energyKcal: 80,
    proteinG: 10.9,
    fatG: 4.7,
    carbsG: 0.8,
    calciumMg: 223,
    ironMg: 3.4,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0.1,
    sodiumMg: 12,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 12000
  },
  {
    id: 'tkpi-014',
    code: 'KAC-03',
    name: 'Kacang Merah Basah',
    category: 'Kacang/Biji/Bean',
    bdd: 100,
    energyKcal: 171,
    proteinG: 11.0,
    fatG: 1.1,
    carbsG: 30.5,
    calciumMg: 60,
    ironMg: 3.2,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 2,
    fiberG: 5.5,
    sodiumMg: 18,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 28000
  },
  // Sayuran
  {
    id: 'tkpi-015',
    code: 'SAY-01',
    name: 'Bayam Segar (Daun)',
    category: 'Sayuran',
    bdd: 71,
    energyKcal: 16,
    proteinG: 0.9,
    fatG: 0.4,
    carbsG: 2.9,
    calciumMg: 166,
    ironMg: 3.5,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 41,
    fiberG: 0.7,
    sodiumMg: 60,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 12000
  },
  {
    id: 'tkpi-016',
    code: 'SAY-02',
    name: 'Wortel Lokal Segar',
    category: 'Sayuran',
    bdd: 88,
    energyKcal: 36,
    proteinG: 1.0,
    fatG: 0.6,
    carbsG: 7.9,
    calciumMg: 45,
    ironMg: 1.0,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 6,
    fiberG: 1.0,
    sodiumMg: 70,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 14000
  },
  {
    id: 'tkpi-017',
    code: 'SAY-03',
    name: 'Kacang Panjang Segar',
    category: 'Sayuran',
    bdd: 92,
    energyKcal: 39,
    proteinG: 3.0,
    fatG: 0.3,
    carbsG: 7.8,
    calciumMg: 49,
    ironMg: 1.1,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 19,
    fiberG: 1.9,
    sodiumMg: 8,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 13000
  },
  {
    id: 'tkpi-018',
    code: 'SAY-04',
    name: 'Labu Siam',
    category: 'Sayuran',
    bdd: 83,
    energyKcal: 26,
    proteinG: 0.6,
    fatG: 0.1,
    carbsG: 6.7,
    calciumMg: 14,
    ironMg: 0.5,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 18,
    fiberG: 1.2,
    sodiumMg: 5,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 10000
  },
  // Buah
  {
    id: 'tkpi-019',
    code: 'BUA-01',
    name: 'Pisang Ambon Segar',
    category: 'Buah',
    bdd: 75,
    energyKcal: 97,
    proteinG: 1.0,
    fatG: 0.2,
    carbsG: 25.8,
    calciumMg: 8,
    ironMg: 0.5,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 9,
    fiberG: 2.1,
    sodiumMg: 1,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 18000
  },
  {
    id: 'tkpi-020',
    code: 'BUA-02',
    name: 'Pepaya Jingga Segar',
    category: 'Buah',
    bdd: 75,
    energyKcal: 46,
    proteinG: 0.5,
    fatG: 0.1,
    carbsG: 12.2,
    calciumMg: 23,
    ironMg: 1.7,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 78,
    fiberG: 1.6,
    sodiumMg: 4,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 10000
  },
  {
    id: 'tkpi-021',
    code: 'BUA-03',
    name: 'Jeruk Manis Lokal',
    category: 'Buah',
    bdd: 72,
    energyKcal: 45,
    proteinG: 0.9,
    fatG: 0.2,
    carbsG: 11.2,
    calciumMg: 33,
    ironMg: 0.4,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 49,
    fiberG: 1.4,
    sodiumMg: 2,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 22000
  },
  // Susu & Olahan
  {
    id: 'tkpi-022',
    code: 'SSU-01',
    name: 'Susu Pasteurisasi UHT Plain',
    category: 'Susu/Olahan',
    bdd: 100,
    energyKcal: 61,
    proteinG: 3.2,
    fatG: 3.3,
    carbsG: 4.8,
    calciumMg: 115,
    ironMg: 0.1,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 1,
    fiberG: 0,
    sodiumMg: 43,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 18500
  },
  // Minyak & Bumbu
  {
    id: 'tkpi-023',
    code: 'MIN-01',
    name: 'Minyak Kelapa Sawit Fortifikasi Vit A',
    category: 'Lemak/Minyak',
    bdd: 100,
    energyKcal: 884,
    proteinG: 0,
    fatG: 100,
    carbsG: 0,
    calciumMg: 0,
    ironMg: 0,
    retinolMcg: 160, betaCaroteneMcg: 0, totalCaroteneMcg: 0, thiaminMg: 0, riboflavinMg: 0, niacinMg: 0,
    vitCMg: 0,
    fiberG: 0,
    sodiumMg: 0,
    waterG: 0, ashG: 0, phosphorusMg: 0, potassiumMg: 0, copperMg: 0, zincMg: 0, standardPricePerKg: 17500
  }
];

export const MASTER_BUMBU_DASAR: BumbuDasarRecipe[] = [
  {
    id: 'PUTIH',
    name: 'Bumbu Dasar Putih BGN',
    description: 'Untuk opor, rawon kuah bening, tumisan gurih, semur putih, sayur lodeh gurih.',
    gramPerPortion: 12,
    ingredients: [
      { name: 'Bawang Merah Lokal', percentage: 55 },
      { name: 'Bawang Putih Kating', percentage: 30 },
      { name: 'Kemiri Sangrai', percentage: 10 },
      { name: 'Ketumbar Halus & Garam Beryodium', percentage: 5 }
    ]
  },
  {
    id: 'MERAH',
    name: 'Bumbu Dasar Merah BGN',
    description: 'Untuk balado ayam/telur anak, sambal goreng ati/tempe, rica-rica manis tidak pedas tajam.',
    gramPerPortion: 15,
    ingredients: [
      { name: 'Cabai Merah Besar (Buang Biji)', percentage: 40 },
      { name: 'Bawang Merah', percentage: 30 },
      { name: 'Bawang Putih', percentage: 15 },
      { name: 'Tomat Segar', percentage: 10 },
      { name: 'Gula Merah & Garam', percentage: 5 }
    ]
  },
  {
    id: 'KUNING',
    name: 'Bumbu Dasar Kuning BGN',
    description: 'Untuk ayam ungkep goreng/bakar, pesmol ikan kembung, soto ayam bening berprotein.',
    gramPerPortion: 14,
    ingredients: [
      { name: 'Bawang Merah', percentage: 40 },
      { name: 'Bawang Putih', percentage: 25 },
      { name: 'Kunyit Bakar Kupas', percentage: 15 },
      { name: 'Kemiri & Jahe', percentage: 12 },
      { name: 'Lengkuas & Garam', percentage: 8 }
    ]
  }
];

export const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'ws-bogor-01',
    name: 'SPPG Dapur Mandiri Bogor Barat',
    code: 'BGN-SPPG-BGR-001',
    location: 'Kec. Dramaga, Kab. Bogor, Jawa Barat',
    capacityPortions: 3000,
    headOfKitchen: 'Mayor (Purn) Bambang Hermanto, S.Sos',
    nutritionistName: 'Siti Nur Aisyah, S.Gz, RD',
    qaOfficerName: 'Rian Hidayat, S.T (Lead Food Safety)',
    createdAt: '2026-01-15'
  },
  {
    id: 'ws-jkt-02',
    name: 'SPPG Dapur Percontohan Jakarta Pusat',
    code: 'BGN-SPPG-JKT-002',
    location: 'Kec. Kemayoran, Kota Jakarta Pusat, DKI Jakarta',
    capacityPortions: 2500,
    headOfKitchen: 'Drs. Hendra Suwandi, M.M',
    nutritionistName: 'Dewi Lestari, S.Gz, M.Gizi',
    qaOfficerName: 'Agus Purnomo, A.Md.AK',
    createdAt: '2026-02-01'
  },
  {
    id: 'ws-skb-03',
    name: 'Pilot Project 3B PAUD & Posyandu Sukabumi',
    code: 'BGN-PILOT-SKB-003',
    location: 'Kec. Cisaat, Kab. Sukabumi, Jawa Barat',
    capacityPortions: 1200,
    headOfKitchen: 'H. Dedi Mulyana, S.Pd',
    nutritionistName: 'Farida Hasanah, S.Tr.Gz',
    qaOfficerName: 'Rina Kusuma, S.Si',
    createdAt: '2026-02-20'
  }
];

export const BGN_SOPS: BgnSOP[] = [
  {
    id: 'sop-01',
    code: 'SOP-BGN-01',
    title: 'Penerimaan & Seleksi Mutu Bahan Baku Segar & Kering',
    category: 'Penerimaan',
    version: 'v2.4-2026',
    effectiveDate: '01 Januari 2026',
    objective: 'Menjamin semua bahan hewani, nabati, dan sembako yang masuk memenuhi spesifikasi gizi, bebas cemaran fisik, mikrobiologi, serta rantai dingin terjaga (CCP-1).',
    criticalPoints: [
      'Suhu daging ayam/sapi segar saat tiba maksimal 4.0°C; beku maksimal -18°C.',
      'Ikan segar: insang merah cerah, mata jernih cembung, elastisitas daging kenyal.',
      'Sayuran hijau tidak layu, bebas ulat masif, bebas residu pestisida berbau tajam.',
      'Sertifikat Halal & COA (Certificate of Analysis) dari supplier wajib tervalidasi.'
    ],
    steps: [
      '1. Petugas logistik memeriksa kelengkapan Surat Jalan dan jam kedatangan armada pendingin.',
      '2. Kalibrasi termometer tusuk inframerah dan ukur suhu inti bahan pangan hewani (catat di form CCP-1).',
      '3. Uji organoleptik: rupa, warna, bau, dan tekstur sesuai formulir standar grading BGN.',
      '4. Timbang berat kotor (bruto) dan berat tara kemasan, hitung estimasi BDD.',
      '5. Tempelkan label barcode/tag identitas lot: Tanggal Penerimaan, Expired Date, Nama Supplier.'
    ],
    verificationFrequency: 'Setiap pengiriman armada supplier (Harian).'
  },
  {
    id: 'sop-02',
    code: 'SOP-BGN-02',
    title: 'Penyimpanan & Manajemen FIFO/FEFO Rantai Dingin',
    category: 'Penyimpanan',
    version: 'v2.4-2026',
    effectiveDate: '01 Januari 2026',
    objective: 'Mencegah perkembangbiakan patogen pada bahan makanan sebelum diproses dengan sistem rotasi ketat.',
    criticalPoints: [
      'Chiller suhu 1°C - 4°C; Freezer suhu -18°C s/d -22°C; Dry Storage 20°C - 25°C kelembaban < 65%.',
      'Penyusunan bahan mentah unggas/daging di rak paling bawah untuk mencegah tetesan (drip cross-contamination).',
      'Bahan matang dan siap konsumsi di rak terpisah paling atas tertutup rapat.'
    ],
    steps: [
      '1. Segera masukkan bahan basah maksimal 15 menit setelah lolos inspeksi penerimaan.',
      '2. Terapkan prinsip FIFO (First In First Out) dan FEFO (First Expired First Out).',
      '3. Pengecekan dan pencatatan thermohygrometer 3 kali sehari (Pukul 06:00, 12:00, 18:00).'
    ],
    verificationFrequency: 'Pemeriksaan suhu 3x sehari.'
  },
  {
    id: 'sop-03',
    code: 'SOP-BGN-03',
    title: 'Pencucian, Pemotongan & Sanitasi Pangan (Food Prep)',
    category: 'Pengolahan',
    version: 'v2.4-2026',
    effectiveDate: '01 Januari 2026',
    objective: 'Menghilangkan residu kimia, tanah, dan mikroorganisme patogen sebelum perlakuan panas.',
    criticalPoints: [
      'Pemisahan talenan dan pisau warna (Merah: Daging mentah, Biru: Ikan mentah, Hijau: Sayur/Buah, Putih: Makanan matang).',
      'Pencucian sayur menggunakan air mengalir food grade dengan klorinasi aman 50 ppm atau ozonizer.',
      'Air bilasan akhir wajib memenuhi Permenkes baku mutu air minum.'
    ],
    steps: [
      '1. Kupas dan sortir sayuran, timbang berat kotor dan berat bersih untuk validasi BDD TKPI.',
      '2. Cuci bahan hewani di wastafel stainless steel terpisah dari area sayur/buah.',
      '3. Sanitasi talenan setiap selesai 1 batch pengolahan dengan larutan sanitizer food-grade.'
    ],
    verificationFrequency: 'Setiap pergantian jenis komoditas bahan baku.'
  },
  {
    id: 'sop-04',
    code: 'SOP-BGN-04',
    title: 'Pengolahan Termal & Verifikasi Titik Kritis Suhu Inti (CCP-2)',
    category: 'Pengolahan',
    version: 'v2.4-2026',
    effectiveDate: '01 Januari 2026',
    objective: 'Memastikan proses pemanasan mematikan bakteri patogen Salmonella, E. coli, Listeria, dan Clostridium perfringens.',
    criticalPoints: [
      'Suhu inti bahan pangan matang WAJIB mencapai minimal 75.0°C dipertahankan minimal 2 menit berturut-turut.',
      'Pengecekan menggunakan termometer probe digital yang telah terkalibrasi berkala.',
      'Makanan yang tidak mencapai 75°C dilarang dikeluarkan dari panci/ketel masak komersial.'
    ],
    steps: [
      '1. Masukkan probe termometer ke bagian paling tebal dari daging atau pusat masakan kuah.',
      '2. Tunggu angka termometer stabil selama 30 detik.',
      '3. Catat nilai suhu inti, nomor wajan/ketel, dan nama juru masak ke lembar log CCP-2 digital BGN.',
      '4. Jika < 75°C, perintahkan penambahan waktu masak minimal 5-10 menit hingga batas kritis tercapai.'
    ],
    verificationFrequency: 'Setiap batch masakan (100% verifikasi wajib).'
  },
  {
    id: 'sop-05',
    code: 'SOP-BGN-05',
    title: 'Porsiing, Pengemasan Ompreng Stainless & Segel Keamanan',
    category: 'Distribusi',
    version: 'v2.4-2026',
    effectiveDate: '01 Januari 2026',
    objective: 'Menjamin porsi sesuai AKG kelompok usia penerima manfaat dan higienis tanpa sentuhan tangan telanjang.',
    criticalPoints: [
      'Wadah ompreng stainless steel 304 food-grade telah disterilisasi oven/dryer suhu 85°C.',
      'Penjamah memakai APD lengkap: Hairnet, Masker medis, Sarung tangan nitril food-grade, Apron bersih.',
      'Pemasangan segel stiker BGN tamper-evident bertuliskan Jam Matang dan Jam Batas Konsumsi.'
    ],
    steps: [
      '1. Gunakan centong porsi terkalibrasi (scoop gramatur standar: Nasi 100-150g, Lauk hewani 50-70g, Sayur 75-100g, Buah 1 potong/100g).',
      '2. Timbang uji petik 5 sampel per 100 ompreng dengan toleransi gramatur ±5%.',
      '3. Tutup ompreng rapat, kunci klip pengaman, dan tempel segel stiker verifikasi mutu.'
    ],
    verificationFrequency: 'Kontinu selama proses plating porsi.'
  },
  {
    id: 'sop-06',
    code: 'SOP-BGN-06',
    title: 'Distribusi & Batas Waktu Konsumsi Maksimal 4 Jam (CCP-3)',
    category: 'Distribusi',
    version: 'v2.4-2026',
    effectiveDate: '01 Januari 2026',
    objective: 'Mencegah proliferasi bakteri spora pada rentang bahaya (Danger Zone: 5°C s/d 60°C).',
    criticalPoints: [
      'Makanan WAJIB dikonsumsi oleh siswa/penerima manfaat dalam waktu MAKSIMAL 4 JAM sejak selesai matang.',
      'Box insulator distribusi kendaraan tertutup dan bersuhu terkontrol.',
      'Jika melebihi 4 jam dan tidak di-holding panas >60°C, makanan WAJIB DIAFKIR (ditolak & dimusnahkan).'
    ],
    steps: [
      '1. Cetak label waktu: "Matang: [Jam:Menit] | Batas Akhir Makan: [Jam+4:Menit]".',
      '2. Driver logistik mencatat jam keberangkatan dan jam serah terima di sekolah/posyandu sasaran.',
      '3. Guru PJ Gizi Sekolah menandatangani Berita Acara Penerimaan dan memeriksa keutuhan segel.',
      '4. Makanan dibagikan tepat waktu pada jam istirahat makan siang siswa (11:30 - 12:30).'
    ],
    verificationFrequency: 'Setiap pengiriman rute armada.'
  },
  {
    id: 'sop-07',
    code: 'SOP-BGN-07',
    title: 'Higiene Personal Penjamah Makanan & Protokol Sanitasi Harian',
    category: 'Sanitasi',
    version: 'v2.4-2026',
    effectiveDate: '01 Januari 2026',
    objective: 'Meniadakan transmisi penyakit bawaan makanan (foodborne illness) dari penjamah ke makanan.',
    criticalPoints: [
      'Pemeriksaan harian: suhu badan < 37.3°C, tidak batuk, pilek, diare, atau luka terbuka.',
      'Cuci tangan 7 langkah WHO sebelum dan sesudah menyentuh makanan.',
      'Kuku dipotong pendek, tanpa pewarna kuku (kutek), tanpa perhiasan/jam tangan di ruang produksi.'
    ],
    steps: [
      '1. Morning briefing dan visual health check sebelum masuk ke ruang steril dapur.',
      '2. Melewati air shower / ruang loker ganti pakaian kerja dan cuci tangan air sabun mengalir.',
      '3. Sanitasi lantai dan meja kerja menggunakan desinfektan tersertifikasi setiap akhir shift.'
    ],
    verificationFrequency: 'Harian setiap awal pergantian shift kerja.'
  },
  {
    id: 'sop-08',
    code: 'SOP-BGN-08',
    title: 'Pengambilan Sampel Makanan Uji Retensi 2x24 Jam (Food Sample Retention)',
    category: 'Retensi Lab',
    version: 'v2.4-2026',
    effectiveDate: '01 Januari 2026',
    objective: 'Menyediakan bukti sampel hukum dan investigasi mikrobiologis jika terjadi dugaan Kejadian Luar Biasa (KLB) keracunan pangan.',
    criticalPoints: [
      'Setiap menu yang dimasak WAJIB disisihkan minimal 100 gram per komponen menu.',
      'Disimpan dalam wadah steril kedap udara di kulkas retensi khusus berlabel suhu 1°C - 4°C selama minimal 48 jam (2x24 jam).',
      'Kulkas retensi dikunci khusus oleh Petugas Quality Assurance / Ahli Gizi.'
    ],
    steps: [
      '1. Petugas QA mengambil sampel makanan steril menggunakan capit dan sarung tangan steril.',
      '2. Masukkan ke dalam plastik klip steril atau pot steril food grade bertutup ulir.',
      '3. Beri label tanggal, jam masak, nama menu, nama juru masak, dan paraf petugas.',
      '4. Simpan selama 48 jam; jika tidak ada komplain, sampel dimusnahkan secara higienis dengan berita acara.'
    ],
    verificationFrequency: 'Setiap siklus menu harian (wajib 100%).'
  }
];

export const INITIAL_MENU_PLAN: MenuPlan = {
  id: 'menu-default-01',
  name: 'Paket Gizi Seimbang Ayam Ungkep Kuning & Sayur Bening Bayam Wortel',
  targetGroup: 'SD_BESAR',
  portionCount: 1500,
  mealType: 'Makan Siang',
  date: new Date().toISOString().split('T')[0],
  selectedBumbu: 'KUNING',
  bumbuGramsPerPortion: 14,
  notes: 'Menu siklus hari ke-3 SPPG: Tinggi Protein Hewani, Kalsium, & Vitamin A untuk anak usia sekolah dasar.',
  ingredients: [
    {
      id: 'ing-01',
      foodId: 'tkpi-001',
      foodName: 'Beras Giling Putih',
      category: 'Serealia',
      netWeightGrams: 100, // porsi bersih
      bdd: 100,
      grossWeightGrams: 100,
      pricePerKg: 15500
    },
    {
      id: 'ing-02',
      foodId: 'tkpi-004',
      foodName: 'Daging Ayam Broiler Karkas',
      category: 'Daging/Unggas',
      netWeightGrams: 60, // daging bersih
      bdd: 58, // BDD 58% -> bruto: 60 / 0.58 = ~103.4g
      grossWeightGrams: 103.4,
      pricePerKg: 38000
    },
    {
      id: 'ing-03',
      foodId: 'tkpi-012',
      foodName: 'Tempe Kedelai Murni',
      category: 'Kacang/Biji/Bean',
      netWeightGrams: 40,
      bdd: 100,
      grossWeightGrams: 40,
      pricePerKg: 16000
    },
    {
      id: 'ing-04',
      foodId: 'tkpi-015',
      foodName: 'Bayam Segar (Daun)',
      category: 'Sayuran',
      netWeightGrams: 50,
      bdd: 71, // BDD 71% -> bruto: 50 / 0.71 = ~70.4g
      grossWeightGrams: 70.4,
      pricePerKg: 12000
    },
    {
      id: 'ing-05',
      foodId: 'tkpi-016',
      foodName: 'Wortel Lokal Segar',
      category: 'Sayuran',
      netWeightGrams: 30,
      bdd: 88, // BDD 88% -> bruto: 30 / 0.88 = ~34.1g
      grossWeightGrams: 34.1,
      pricePerKg: 14000
    },
    {
      id: 'ing-06',
      foodId: 'tkpi-019',
      foodName: 'Pisang Ambon Segar',
      category: 'Buah',
      netWeightGrams: 80,
      bdd: 75, // BDD 75% -> bruto: 80 / 0.75 = ~106.7g
      grossWeightGrams: 106.7,
      pricePerKg: 18000
    },
    {
      id: 'ing-07',
      foodId: 'tkpi-023',
      foodName: 'Minyak Kelapa Sawit Fortifikasi Vit A',
      category: 'Lemak/Minyak',
      netWeightGrams: 5,
      bdd: 100,
      grossWeightGrams: 5,
      pricePerKg: 17500
    }
  ]
};

export const INITIAL_HACCP_LOGS: HACCPLog[] = [
  {
    id: 'haccp-01',
    timestamp: '2026-09-11 05:30',
    ccpType: 'CCP-1',
    stepName: 'Penerimaan Daging Ayam Segar',
    parameterChecked: 'Suhu armada pendingin & suhu inti daging',
    standardThreshold: 'Maksimal <= 4.0 °C',
    measuredValue: 3.2,
    unit: '°C',
    isCompliant: true,
    batchNumber: 'LOT-AYM-260911-01',
    inspectorName: 'Rian Hidayat (QA)',
    hazardRisk: 'RENDAH',
    foodItemName: 'Daging Ayam Karkas Broiler'
  },
  {
    id: 'haccp-02',
    timestamp: '2026-09-11 06:15',
    ccpType: 'CCP-1',
    stepName: 'Penerimaan Telur Ayam Ras',
    parameterChecked: 'Kebersihan cangkang, retak, berat per butir',
    standardThreshold: 'Bebas kotoran kotor feses, retak 0%',
    measuredValue: 0.0,
    unit: '% retak',
    isCompliant: true,
    batchNumber: 'LOT-TLR-260911-04',
    inspectorName: 'Rian Hidayat (QA)',
    hazardRisk: 'RENDAH',
    foodItemName: 'Telur Ayam Ras'
  },
  {
    id: 'haccp-03',
    timestamp: '2026-09-11 08:45',
    ccpType: 'CCP-2',
    stepName: 'Proses Pemasakan Ungkep Ayam (Ketel Uap 1)',
    parameterChecked: 'Suhu inti daging matang & durasi pemanasan',
    standardThreshold: 'Minimal >= 75.0 °C (min 2 menit)',
    measuredValue: 78.4,
    unit: '°C',
    isCompliant: true,
    batchNumber: 'BATCH-COOK-01',
    inspectorName: 'Siti Nur Aisyah (Ahli Gizi)',
    hazardRisk: 'RENDAH',
    foodItemName: 'Ayam Ungkep Bumbu Kuning'
  },
  {
    id: 'haccp-04',
    timestamp: '2026-09-11 09:10',
    ccpType: 'CCP-2',
    stepName: 'Perebusan Telur & Sup Sayur Bening (Ketel Uap 2)',
    parameterChecked: 'Suhu inti masakan matang',
    standardThreshold: 'Minimal >= 75.0 °C',
    measuredValue: 73.1, // deviasi!
    unit: '°C',
    isCompliant: false,
    batchNumber: 'BATCH-COOK-02',
    inspectorName: 'Rian Hidayat (QA)',
    correctiveAction: 'Pemanasan diteruskan selama 8 menit tambahan hingga suhu inti mencapai 81.2°C sebelum plating.',
    hazardRisk: 'SEDANG',
    foodItemName: 'Sayur Bening Bayam Jagung'
  },
  {
    id: 'haccp-05',
    timestamp: '2026-09-11 10:15',
    ccpType: 'CCP-3',
    stepName: 'Holding & Loading Ompreng ke Mobil Distribusi',
    parameterChecked: 'Waktu dari selesai matang s/d konsumsi & segel',
    standardThreshold: 'Maksimal <= 4.0 Jam dari matang',
    measuredValue: 1.2,
    unit: 'Jam berlalu',
    isCompliant: true,
    batchNumber: 'DIST-ROUTE-A1',
    inspectorName: 'Mayor (Purn) Bambang Hermanto',
    hazardRisk: 'RENDAH',
    foodItemName: 'Paket Ompreng Sekolah Dasar'
  }
];

export const INITIAL_MOTHERS: MotherRecord[] = [
  {
    id: 'mom-01',
    type: 'BUMIL',
    nik: '3201155403980002',
    name: 'Ny. Dewi Kurniawati',
    age: 26,
    gestationalWeek: 18,
    prePregnancyWeightKg: 44.5,
    currentWeightKg: 47.8,
    heightCm: 151,
    lilaCm: 22.8, // ALERT KEK (< 23.5)
    hbLevelGdl: 10.4, // ALERT Anemia (< 11)
    hasKEK: true,
    hasAnemia: true,
    posyanduName: 'Posyandu Melati 03, Dramaga',
    notes: 'Teridentifikasi Kurang Energi Kronis (KEK) Trimester 2. Diberikan paket PMT Gizi Spesifik BGN ekstra protein & TTD (Tablet Tambah Darah).',
    lastUpdated: '2026-09-08'
  },
  {
    id: 'mom-02',
    type: 'BUMIL',
    nik: '3201156208950005',
    name: 'Ny. Siti Rahmah',
    age: 30,
    gestationalWeek: 28,
    prePregnancyWeightKg: 52.0,
    currentWeightKg: 61.2,
    heightCm: 156,
    lilaCm: 25.4,
    hbLevelGdl: 11.8,
    hasKEK: false,
    hasAnemia: false,
    posyanduName: 'Posyandu Mawar Indah, Cisaat',
    notes: 'Kenaikan BB adekuat (GWG normal), status gizi maternal baik.',
    lastUpdated: '2026-09-10'
  },
  {
    id: 'mom-03',
    type: 'BUSUI',
    nik: '3201154101990001',
    name: 'Ny. Anisa Rahmawati',
    age: 24,
    childAgeMonths: 4,
    currentWeightKg: 49.0,
    heightCm: 153,
    lilaCm: 23.2, // KEK flag
    hbLevelGdl: 11.2,
    hasKEK: true,
    hasAnemia: false,
    posyanduName: 'Posyandu Anggrek 01, Kemayoran',
    notes: 'Ibu menyusui eksklusif, LILA berisiko KEK pasca melahirkan. Direkomendasikan tambahan asupan kalori 500 kkal/hari.',
    lastUpdated: '2026-09-05'
  }
];

export const INITIAL_TODDLERS: ToddlerRecord[] = [
  {
    id: 'tod-01',
    nik: '3201150106240001',
    name: 'Muhammad Farhan',
    gender: 'L',
    dob: '2024-06-01',
    parentName: 'Bpk. Ahmad Fauzi / Ny. Dewi',
    phone: '0812-3456-7890',
    posyanduName: 'Posyandu Melati 03, Dramaga',
    isStuntingRisk: true,
    isUnderweight: true,
    isFalteringT2: true, // T2 Faltering alert!
    lastUpdated: '2026-09-08',
    measurements: [
      { id: 'm-01', date: '2026-06-08', ageMonths: 24, weightKg: 10.4, heightCm: 82.5, t2Faltering: false, zScoreBBU: -1.6, zScoreTBU: -2.3, zScoreBBTB: -0.8 },
      { id: 'm-02', date: '2026-07-08', ageMonths: 25, weightKg: 10.5, heightCm: 83.1, t2Faltering: false, zScoreBBU: -1.7, zScoreTBU: -2.4, zScoreBBTB: -0.9 },
      { id: 'm-03', date: '2026-08-08', ageMonths: 26, weightKg: 10.5, heightCm: 83.4, t2Faltering: true, zScoreBBU: -1.9, zScoreTBU: -2.5, zScoreBBTB: -1.1 },
      { id: 'm-04', date: '2026-09-08', ageMonths: 27, weightKg: 10.4, heightCm: 83.8, t2Faltering: true, zScoreBBU: -2.1, zScoreTBU: -2.6, zScoreBBTB: -1.4 }
    ]
  },
  {
    id: 'tod-02',
    nik: '3201154508240003',
    name: 'Aisyah Putri Azzahra',
    gender: 'P',
    dob: '2024-08-15',
    parentName: 'Bpk. Rizky Pratama / Ny. Siti',
    phone: '0813-8877-6655',
    posyanduName: 'Posyandu Mawar Indah, Cisaat',
    isStuntingRisk: false,
    isUnderweight: false,
    isFalteringT2: false,
    lastUpdated: '2026-09-10',
    measurements: [
      { id: 'm-11', date: '2026-06-10', ageMonths: 22, weightKg: 11.2, heightCm: 84.8, t2Faltering: false, zScoreBBU: 0.1, zScoreTBU: -0.2, zScoreBBTB: 0.3 },
      { id: 'm-12', date: '2026-07-10', ageMonths: 23, weightKg: 11.5, heightCm: 85.6, t2Faltering: false, zScoreBBU: 0.2, zScoreTBU: -0.1, zScoreBBTB: 0.4 },
      { id: 'm-13', date: '2026-08-10', ageMonths: 24, weightKg: 11.8, heightCm: 86.4, t2Faltering: false, zScoreBBU: 0.2, zScoreTBU: 0.0, zScoreBBTB: 0.3 },
      { id: 'm-14', date: '2026-09-10', ageMonths: 25, weightKg: 12.1, heightCm: 87.2, t2Faltering: false, zScoreBBU: 0.3, zScoreTBU: 0.1, zScoreBBTB: 0.4 }
    ]
  },
  {
    id: 'tod-03',
    nik: '3201151201250002',
    name: 'Kenzo Alfarizi',
    gender: 'L',
    dob: '2025-01-12',
    parentName: 'Bpk. Dimas / Ny. Rika',
    phone: '0857-1122-3344',
    posyanduName: 'Posyandu Melati 03, Dramaga',
    isStuntingRisk: false,
    isUnderweight: false,
    isFalteringT2: false,
    lastUpdated: '2026-09-09',
    measurements: [
      { id: 'm-21', date: '2026-06-09', ageMonths: 17, weightKg: 10.6, heightCm: 81.0, t2Faltering: false, zScoreBBU: -0.2, zScoreTBU: -0.4, zScoreBBTB: 0.0 },
      { id: 'm-22', date: '2026-07-09', ageMonths: 18, weightKg: 10.9, heightCm: 82.2, t2Faltering: false, zScoreBBU: -0.1, zScoreTBU: -0.3, zScoreBBTB: 0.1 },
      { id: 'm-23', date: '2026-08-09', ageMonths: 19, weightKg: 11.2, heightCm: 83.1, t2Faltering: false, zScoreBBU: 0.0, zScoreTBU: -0.2, zScoreBBTB: 0.2 },
      { id: 'm-24', date: '2026-09-09', ageMonths: 20, weightKg: 11.4, heightCm: 84.0, t2Faltering: false, zScoreBBU: 0.0, zScoreTBU: -0.1, zScoreBBTB: 0.1 }
    ]
  }
];

// KMS Reference Curves WHO 2006 (Median, -2SD, -3SD, +2SD for 0-36 months Boys/Girls average)
export const KMS_WHO_CURVE_DATA = [
  { month: 0, minus3SD: 2.1, minus2SD: 2.5, median: 3.3, plus2SD: 4.4 },
  { month: 3, minus3SD: 4.4, minus2SD: 5.0, median: 6.0, plus2SD: 7.5 },
  { month: 6, minus3SD: 5.7, minus2SD: 6.4, median: 7.5, plus2SD: 9.3 },
  { month: 9, minus3SD: 6.7, minus2SD: 7.4, median: 8.6, plus2SD: 10.5 },
  { month: 12, minus3SD: 7.4, minus2SD: 8.2, median: 9.6, plus2SD: 11.5 },
  { month: 15, minus3SD: 8.0, minus2SD: 8.8, median: 10.3, plus2SD: 12.4 },
  { month: 18, minus3SD: 8.6, minus2SD: 9.4, median: 11.0, plus2SD: 13.2 },
  { month: 21, minus3SD: 9.1, minus2SD: 10.0, median: 11.6, plus2SD: 14.0 },
  { month: 24, minus3SD: 9.7, minus2SD: 10.6, median: 12.2, plus2SD: 14.8 },
  { month: 27, minus3SD: 10.2, minus2SD: 11.1, median: 12.8, plus2SD: 15.6 },
  { month: 30, minus3SD: 10.7, minus2SD: 11.6, median: 13.4, plus2SD: 16.3 },
  { month: 33, minus3SD: 11.2, minus2SD: 12.1, median: 14.0, plus2SD: 17.1 },
  { month: 36, minus3SD: 11.6, minus2SD: 12.6, median: 14.6, plus2SD: 17.8 }
];
