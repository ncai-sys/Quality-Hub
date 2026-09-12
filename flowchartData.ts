import { FlowchartNode } from '../types';

export const BGN_PROCESS_PIPELINE_STAGES = [
  { id: 'perencanaan', name: '1. Perencanaan & HPS', icon: 'FileSpreadsheet', desc: 'Penyusunan siklus menu 20 hari & survei 3 sumber pasar' },
  { id: 'penerimaan', name: '2. Penerimaan Bahan (CCP-1)', icon: 'Truck', desc: 'Validasi PO, rantai dingin daging/ikan/susu <= 4°C, uji organoleptik' },
  { id: 'persiapan', name: '3. Persiapan Bahan (Prep)', icon: 'Scissors', desc: 'Talenan warna, pencucian sayur/buah air mengalir, BDD ratio' },
  { id: 'pengolahan', name: '4. Pengolahan Termal (CCP-2)', icon: 'Flame', desc: 'Pemasakan suhu inti minimal 74°C-75°C, kalibrasi termometer' },
  { id: 'pendinginan', name: '5. Pendinginan / Resting', icon: 'Snowflake', desc: 'Ruangan AC < 20°C, penurunan uap panas, maksimal 60 menit' },
  { id: 'pemorsian', name: '6. Pemorsian & Pelabelan', icon: 'Box', desc: 'Ompreng stainless 304, segel stiker 7x5 cm, penimbangan ±5%' },
  { id: 'distribusi', name: '7. Distribusi MBG (CCP-3)', icon: 'Navigation', desc: 'Armada tertutup, radius 6 km / 30 mnt, batas makan max 4 jam' },
  { id: 'sampling', name: '8. Sampling & Organoleptik', icon: 'ClipboardCheck', desc: '2 sampel (1 diuji sensori, 1 retensi 3x24 jam chiller 2-8°C)' },
  { id: 'sanitasi', name: '9. Sanitasi, Cuci & Limbah', icon: 'Trash2', desc: 'Cuci ompreng 43°C, pilah 5 jenis sisa makanan, grease trap & IPAL' }
];

export const BGN_FLOWCHART_NODES: FlowchartNode[] = [
  // 1. Perencanaan & HPS
  {
    id: 'flow-01',
    stageName: '1. Perencanaan & HPS',
    title: 'Perencanaan Menu Siklus 20 Hari',
    sopNumber: '010/05/00/SOP.10/09/2026',
    sopTitle: 'SOP Perencanaan Menu Makan Bergizi Gratis',
    responsibleRole: 'Pengawas Gizi (Nutrisionis) & Kepala SPPG',
    standardDuration: '1 Hari sebelum periode berjalan',
    requiredEquipment: ['Buku Komposisi Pangan (TKPI)', 'Dokumen Angka Kecukupan Gizi (AKG 2019)', 'Akun SIPGN', 'Komputer/Laptop'],
    outputDocument: 'Lampiran 3 Formulir Siklus Menu 20 Hari & Lampiran 6 Jadwal Penyaluran',
    colorScheme: 'indigo',
    steps: [
      'Mendata dan mengklasifikasikan sasaran: Peserta Didik (PAUD s/d SMA) dan Kelompok 3B (Bumil, Busui, Balita).',
      'Mengidentifikasi jenis bahan baku spesifik sesuai kebutuhan gizi per jenjang umur.',
      'Menyusun resep standar dan menentukan frekuensi bahan baku dalam siklus 20 hari (Lampiran 2).',
      'Koordinasi siklus menu antar wilayah SPPG untuk mencegah lonjakan kelangkaan komoditas di pasar lokal.',
      'Unggah draf rencana menu ke fitur Menu Planner aplikasi SIPGN.'
    ]
  },
  {
    id: 'flow-02',
    stageName: '1. Perencanaan & HPS',
    title: 'Survei Harga Pasar & Penetapan HPS',
    sopNumber: '017/05/00/SOP.17/09/2026',
    sopTitle: 'SOP Survei Harga Pasar Bahan Pangan SPPG',
    responsibleRole: 'Pengawas Keuangan, Kepala SPPG & Asisten Lapangan',
    standardDuration: '2 Jam setiap 2 minggu sekali',
    requiredEquipment: ['Buku Catatan Survei Harga Pasar', 'Daftar HET / HAT Wilayah Setempat', 'Handphone Kamera', 'Kalkulator'],
    outputDocument: 'Lampiran 2 Formulir Survei Harga Pasar & Penetapan Nilai HPS',
    colorScheme: 'indigo',
    steps: [
      'Kunjungi minimal 3 (tiga) lokasi berbeda: pasar tradisional, agen resmi, dan distributor independen.',
      'Catat harga penawaran masing-masing pemasok, periksa legalitas dan ketiadaan afiliasi kepentingan.',
      'Dokumentasikan foto lapak, papan harga tertulis, atau kuitansi survei resmi.',
      'Tetapkan nilai Harga Perkiraan Sendiri (HPS) dengan rumus median atau mean dari data tervalidasi.',
      'Tandatangani Formulir Lampiran 2 bersama Kepala Pasar dan Pengawas Keuangan SPPG.'
    ]
  },

  // 2. Penerimaan Bahan (CCP-1)
  {
    id: 'flow-03',
    stageName: '2. Penerimaan Bahan (CCP-1)',
    title: 'Penerimaan Daging, Unggas & Ikan Segar',
    sopNumber: '018/05/00/SOP.18/09/2026 & 012/05/00/SOP.12/09/2026',
    sopTitle: 'SOP Penerimaan dan Penyimpanan Daging, Unggas dan Ikan',
    responsibleRole: 'Pengawas Gizi & Tim Persiapan',
    standardDuration: '15-30 Menit per pengiriman',
    ccpTarget: 'CCP-1 (Cold Chain Ingestion)',
    criticalLimit: 'Daging/Unggas/Ikan segar <= 4.0°C; Produk beku <= -18°C; Bebas lendir berlebih, bau busuk/amonia, insang merah cerah.',
    requiredEquipment: ['Termometer Tusuk Digital Terkalibrasi', 'Pisau & Talenan Biru (Ikan) & Merah (Daging)', 'APD Lengkap', 'Kamera HP'],
    outputDocument: 'Lampiran 2 Formulir Penerimaan Bahan Baku & Kartu Stok FIFO Lampiran 3',
    colorScheme: 'rose',
    steps: [
      'Gunakan APD lengkap: Masker, Sarung Tangan, Celemek, Hairnet, Sepatu Safety.',
      'Periksa kecocokan dokumen Purchase Order (PO), Surat Jalan, dan sertifikasi Halal.',
      'Ukur suhu permukaan dan suhu inti daging/ikan menggunakan termometer probe steril (wajib <= 4°C).',
      'Uji sensori organoleptik: Ikan (mata cembung, insang merah, kenyal); Daging (merah cerah, elastis, tidak pucat).',
      'Tolak seketika dan beri label "DITOLAK" jika suhu di atas 4°C atau terdapat tanda pembusukan/thawing berulang.',
      'Bahan lolos dipindahkan ke Chiller 0-4°C atau Freezer <= -18°C dalam wadah food grade tertutup (posisi rak paling bawah).'
    ]
  },
  {
    id: 'flow-04',
    stageName: '2. Penerimaan Bahan (CCP-1)',
    title: 'Penerimaan Susu Pasteurisasi & Bahan Kering',
    sopNumber: '020/05/00/SOP.20/09/2026 & 021/05/00/SOP.21/09/2026',
    sopTitle: 'SOP Penerimaan Susu Pasteurisasi & Bahan Baku Kering',
    responsibleRole: 'Pengawas Keuangan & Pengawas Gizi',
    standardDuration: '15 Menit',
    ccpTarget: 'CCP-1 (Integritas Kemasan & Rantai Dingin Susu)',
    criticalLimit: 'Susu diterima suhu <= 4.0°C; Gudang kering suhu <= 25°C, RH <= 70%; Beras/sembako palet min 15 cm dari lantai.',
    requiredEquipment: ['Termometer Inframerah', 'Thermohygrometer Digital', 'Palet Plastik Food Grade min 15 cm', 'Formulir Kontrol'],
    outputDocument: 'Formulir Penerimaan Susu & Formulir Kontrol Bahan Baku Kering Lampiran 2',
    colorScheme: 'blue',
    steps: [
      'Pemeriksaan segel kemasan susu: tidak kembung, tidak sobek/bocor, tanggal kedaluwarsa jelas.',
      'Catat suhu kedatangan susu pasteurisasi pada formulir penerimaan susu (maksimal 4°C).',
      'Bahan baku kering (beras, tepung, gula) ditempatkan di atas palet berjarak minimal 15 cm dari lantai dan 20 cm dari dinding.',
      'Terapkan rotasi stok ketat dengan prinsip First Expired First Out (FEFO) dan First In First Out (FIFO).'
    ]
  },

  // 3. Persiapan Bahan
  {
    id: 'flow-05',
    stageName: '3. Persiapan Bahan (Prep)',
    title: 'Pencucian, Pemotongan & Kode Warna Talenan',
    sopNumber: '047/05/00/SOP.47/09/2026 & 022/05/00/SOP.22/09/2026',
    sopTitle: 'SOP Penggunaan Talenan dan Pisau & Persiapan Sayuran/Buah',
    responsibleRole: 'Tim Persiapan Relawan',
    standardDuration: '30-45 Menit',
    criticalLimit: 'Talenan warna wajib terpisah untuk cegah kontaminasi silang (Merah: Daging, Biru: Ikan, Hijau: Sayur/Buah, Kuning: Unggas, Putih: Makanan Matang).',
    requiredEquipment: ['Set Talenan Food Grade 5 Warna', 'Pisau Stainless Steel', 'Sink Pencucian Sayur Khusus', 'Timbangan Digital'],
    outputDocument: 'Formulir Persiapan Sayuran & Daging (Lampiran 2 SOP masing-masing)',
    colorScheme: 'emerald',
    steps: [
      'Siapkan meja kerja stainless steel bersih dan disinfeksi dengan cairan food grade.',
      'Cuci beras dengan air mengalir 2-3 kali bilasan agar vitamin B1 tidak larut berlebih.',
      'Sayuran dicuci di bawah air mengalir bersih sebelum dipotong; tiriskan di wadah berlubang.',
      'Daging ayam/ikan disiangi di sink terpisah dari sayuran dan buah-buahan.',
      'Potong sesuai gramasi standar menu SPPG menggunakan talenan dan pisau berwarna yang tepat.'
    ]
  },

  // 4. Pengolahan Termal (CCP-2)
  {
    id: 'flow-06',
    stageName: '4. Pengolahan Termal (CCP-2)',
    title: 'Pemasakan Utama & Uji Suhu Inti Masakan',
    sopNumber: '024/05/00/SOP.24/09/2026 & 026/05/00/SOP.26/09/2026',
    sopTitle: 'SOP Pengolahan Daging/Unggas, Nasi & Lauk MBG',
    responsibleRole: 'Jurutama Masak & Pengawas Gizi',
    standardDuration: '45-90 Menit',
    ccpTarget: 'CCP-2 (Thermal Lethality Pathogen Inactivation)',
    criticalLimit: 'Suhu inti daging/unggas/ikan WAJIB mencapai minimal 74°C - 75°C dipertahankan minimal 2 menit. Nasi kukus matang pulen merata.',
    requiredEquipment: ['Rice Steamer Commercial', 'Wajan/Ketel Masak Stainless', 'Food Thermometer Tusuk Digital', 'Sendok Cicip'],
    outputDocument: 'Lampiran 2 Formulir Uji Organoleptik & Suhu Memasak (QC Produksi)',
    colorScheme: 'rose',
    steps: [
      'Nasi ditanak dengan rasio air tepat pada rice steamer komersial (45-60 menit hingga matang sempurna).',
      'Tumis bumbu dasar hingga matang tanak (suhu bumbu minimal 85°C) sebelum memasukkan protein.',
      'Masak protein hewani hingga matang sempurna. Tusuk bagian tengah/tertebal daging dengan probe termometer.',
      'Verifikasi suhu internal: pastikan display menunjukkan minimal 74°C untuk unggas/ikan dan 75°C untuk olahan balita.',
      'Pengawas Gizi mencicipi dengan sendok uji terpisah (metode 2 sendok) untuk validasi rasa, aroma, dan tekstur.'
    ]
  },

  // 5. Pendinginan / Resting
  {
    id: 'flow-07',
    stageName: '5. Pendinginan / Resting',
    title: 'Pendinginan Makanan (Resting Process)',
    sopNumber: '015/05/00/SOP.15/09/2026',
    sopTitle: 'SOP Pendinginan Makanan (Resting)',
    responsibleRole: 'Tim Pengolahan & Pengawas Gizi',
    standardDuration: 'Maksimal 60 Menit',
    criticalLimit: 'Ruang pendinginan AC beroperasi suhu < 20°C; makanan diturunkan uap panasnya hingga suhu aman (< 60°C) sebelum diporsi; dilarang didiamkan > 2 jam di danger zone.',
    requiredEquipment: ['Ruang Pendinginan Khusus (AC 1-1.5 PK)', 'Troli Rak Makanan Stainless (Gastronorm)', 'Termometer Higrometer'],
    outputDocument: 'Lampiran 2 Formulir Pencatatan Suhu & Waktu Pendinginan Makanan',
    colorScheme: 'amber',
    steps: [
      'Pindahkan masakan panas dari wajan ke wadah gastronorm pan stainless steel bersih.',
      'Susun pan pada troli rak dengan jarak cukup agar sirkulasi udara dingin merata (jangan ditumpuk berlebihan).',
      'Nyalakan AC ruang pendinginan pada suhu < 20°C.',
      'Catat jam mulai resting dan suhu awal makanan pada Formulir Lampiran 2.',
      'Setelah uap panas hilang dan suhu turun di bawah 60°C, segera bawa ke meja pemorsian (durasi total < 60 menit).'
    ]
  },

  // 6. Pemorsian & Pelabelan
  {
    id: 'flow-08',
    stageName: '6. Pemorsian & Pelabelan',
    title: 'Plating Ompreng & Pemasangan Segel Stiker 7x5 cm',
    sopNumber: '014/05/00/SOP.14/09/2026',
    sopTitle: 'SOP Pemorsian dan Pelabelan Ompreng',
    responsibleRole: 'Tim Pemorsian & Pengawas Gizi',
    standardDuration: '30-45 Menit per batch',
    criticalLimit: 'Ompreng stainless steel 304 food-grade kering steril; toleransi berat porsi ±5%; segel stiker tamper-evident 7x5 cm terpasang di 2 sisi tutup.',
    requiredEquipment: ['Timbangan Digital Terkalibrasi', 'Sendok Takar Porsi (Scoop)', 'Ompreng Stainless 304', 'Stiker Segel 7x5 cm'],
    outputDocument: 'Lampiran 2 Formulir Checklist Pemorsian dan Berat Porsi MBG',
    colorScheme: 'pink',
    steps: [
      'Sanitasi meja pemorsian dan tim pemorsian memakai APD lengkap (sarung tangan nitril food grade).',
      'Isi kompartemen ompreng: Makanan Pokok, Lauk Hewani, Lauk Nabati, Sayuran (kuah tertutup/terpisah), Buah segar.',
      'Lakukan uji petik penimbangan acak (sampling weight control) minimal 3 ompreng per batch (toleransi ±5%).',
      'Tutup ompreng rapat dan tempelkan stiker segel 7x5 cm di 2 sisi dengan tulisan: "HARUS DIKONSUMSI SEBELUM PUKUL ..."',
      'Susun ompreng pada rak atau boks hantar tertutup rapi siap serah terima ke tim armada distribusi.'
    ]
  },

  // 7. Distribusi MBG (CCP-3)
  {
    id: 'flow-09',
    stageName: '7. Distribusi MBG (CCP-3)',
    title: 'Pengantaran Armada & Batas Waktu 4 Jam',
    sopNumber: '031/05/00/SOP.31/09/2026 & 032/05/00/SOP.32/09/2026',
    sopTitle: 'SOP Penyaluran MBG Peserta Didik & Kelompok 3B',
    responsibleRole: 'Sopir Ekspedisi, Asisten Lapangan & PJ Sekolah/Kader Posyandu',
    standardDuration: 'Maksimal 30 Menit perjalanan (Radius 6 km)',
    ccpTarget: 'CCP-3 (Holding Time & Batas Konsumsi Maksimal)',
    criticalLimit: 'Makanan WAJIB dikonsumsi maksimal 4 jam sejak selesai matang. Kendaraan bersih, boks tertutup rapat.',
    requiredEquipment: ['Mobil/Motor Pengantar MBG Resmi', 'Boks Thermal Insulator', 'Surat Jalan Rangkap 3', 'Kamera Timestamp'],
    outputDocument: 'Lampiran 2 Surat Jalan Penyaluran Paket MBG (Berita Acara Serah Terima)',
    colorScheme: 'amber',
    steps: [
      'Periksa kebersihan interior kendaraan pengantar sebelum pemuatan boks ompreng.',
      'Muat boks ompreng dengan prinsip penataan aman (tidak bergeser atau terguncang keras).',
      'Antarkan paket ke sekolah/posyandu sasaran dalam radius maksimal 6 km (durasi < 30 menit).',
      'Serahkan paket kepada PJ Sekolah/Kader Posyandu, lakukan verifikasi jumlah dan keutuhan stiker segel.',
      'Isi Berita Acara Serah Terima (BAST), tanda tangan bersama, dan foto dokumentasi bertimestamp.',
      'Siswa mengonsumsi makanan bersama pada jam istirahat teratur (sebelum batas waktu 4 jam tercapai).'
    ]
  },

  // 8. Sampling & Organoleptik
  {
    id: 'flow-10',
    stageName: '8. Sampling & Organoleptik',
    title: 'Pengambilan Sampel Retensi & Sensori Sensual',
    sopNumber: '033/05/00/SOP.33/09/2026 s/d 035/05/00/SOP.35/09/2026',
    sopTitle: 'SOP Pengambilan, Penyimpanan Sampel & Uji Organoleptik',
    responsibleRole: 'Pengawas Gizi & Kepala SPPG',
    standardDuration: '15 Menit di SPPG + 10 Menit saat tiba di sekolah/posyandu',
    criticalLimit: '2 sampel minimal 100g diambil setiap menu harian. Sampel bank retensi disimpan 3x24 jam di chiller suhu 2-8°C untuk uji laboratorium jika ada insiden KLB.',
    requiredEquipment: ['Plastik Klip Steril Bertanggal', 'Sendok Stainless Uji', 'Chiller Bank Sampel Khusus', 'Formulir Uji Sensori'],
    outputDocument: 'Lampiran 2 Checklist Sampel Makanan & Lampiran 3 Checklist Uji Organoleptik',
    colorScheme: 'blue',
    steps: [
      'Ambil 2 (dua) sampel representatif dari setiap komponen menu harian (min 100 gram/sampel).',
      'Sampel 1: Lakukan penilaian organoleptik (Warna, Aroma, Rasa, Tekstur) dengan skala skor 1-5 di SPPG.',
      'Sampel 2: Masukkan ke dalam plastik klip steril berlabel tanggal & batch, simpan di chiller bank sampel 2-8°C selama 3 hari (3x24 jam).',
      'Di Satuan Pendidikan/Posyandu: Guru PJ/Kader melakukan uji organoleptik tahap kedatangan sebelum pembagian ke siswa.',
      'Input hasil uji organoleptik ke dalam website resmi SIPGN Badan Gizi Nasional.'
    ]
  },

  // 9. Sanitasi & Limbah
  {
    id: 'flow-11',
    stageName: '9. Sanitasi, Cuci & Limbah',
    title: 'Pencucian Ompreng 3 Bak & Pemilahan 5 Sisa Pangan',
    sopNumber: '049/05/00/SOP.49/09/2026 & 052/05/00/SOP.52/09/2026',
    sopTitle: 'SOP Pembersihan Ompreng & Manajemen Sampah/Sisa Pangan',
    responsibleRole: 'Tim Kebersihan & Asisten Lapangan',
    standardDuration: '60 Menit pasca pemulangan ompreng',
    criticalLimit: 'Pencucian air panas minimal 43°C (110°F); penimbangan sisa makanan (food waste) dipilah ke 5 wadah (Nasi, Hewani, Nabati, Sayur, Buah).',
    requiredEquipment: ['Sink Pencucian 3 Kompartemen (Cuci, Bilas, Sanitasi Panas)', 'Pemanas Air (Water Heater 43°C)', '5 Wadah Pemilah Sisa Pangan', 'Grease Trap'],
    outputDocument: 'Formulir Checklist Kebersihan Ompreng & Formulir Pencatatan Sisa Makanan (Lampiran 3)',
    colorScheme: 'emerald',
    steps: [
      'Ompreng kotor ditarik dari sekolah, pisahkan sisa makanan ke 5 wadah berlabel: Karbohidrat, Hewani, Nabati, Sayur, Buah.',
      'Timbang berat sisa pangan (food waste) untuk evaluasi daya terima menu oleh siswa.',
      'Rendam ompreng dalam air panas sabun food grade suhu minimal 43°C untuk melunakkan lemak dan minyak.',
      'Sikat dengan spons pembersih, bilas air mengalir 2 kali hingga bebas busa dan bau sabun.',
      'Keringkan di rak pengering steril / UV cabinet, simpan di lemari tertutup rapat.',
      'Bersihkan saringan grease trap setiap hari dan salurkan air buangan ke instalasi IPAL SPPG berizin.'
    ]
  }
];
