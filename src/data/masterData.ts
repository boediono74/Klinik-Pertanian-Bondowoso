import { WilayahTaniItem, ServiceItem, UserProfile, LayananAduan, ResetPasswordRequest } from '../types';

export const WILAYAH_TANI_MASTER: WilayahTaniItem[] = [
  // SUKOSARI
  { id: "PKT001", kecamatan: "SUKOSARI", desa: "Sukosari Lor", poktan: "Poktan Tani Jaya 1", ketua: "Ahmad Fauzi", kontak: "081234567891", jumlahAnggota: 38, komoditasUtama: "Padi Ciherang & Jagung", luasLahanHa: 45.5 },
  { id: "PKT002", kecamatan: "SUKOSARI", desa: "Sukosari Lor", poktan: "Poktan Sumber Rejeki", ketua: "Haji Rusdi", kontak: "081234567812", jumlahAnggota: 29, komoditasUtama: "Padi & Palawija", luasLahanHa: 32.0 },
  { id: "PKT003", kecamatan: "SUKOSARI", desa: "Sukosari Kidul", poktan: "Poktan Makmur Lestari", ketua: "Samsul Hadi", kontak: "081234567834", jumlahAnggota: 42, komoditasUtama: "Padi Inpari & Cabai", luasLahanHa: 51.2 },
  { id: "PKT004", kecamatan: "SUKOSARI", desa: "Nogosari", poktan: "Poktan Subur Abadi", ketua: "Kusnadi", kontak: "081234567856", jumlahAnggota: 35, komoditasUtama: "Tembakau & Jagung", luasLahanHa: 38.0 },
  { id: "PKT005", kecamatan: "SUKOSARI", desa: "Pecalongan", poktan: "Poktan Sri Rejeki", ketua: "Hariyanto", kontak: "081234567878", jumlahAnggota: 26, komoditasUtama: "Padi & Sayuran", luasLahanHa: 28.5 },

  // SUMBERWRINGIN
  { id: "PKT006", kecamatan: "SUMBERWRINGIN", desa: "Sukorejo", poktan: "Poktan Kopi Ijen Makmur", ketua: "Siti Rohmah", kontak: "081398765432", jumlahAnggota: 54, komoditasUtama: "Kopi Arabika Java Ijen", luasLahanHa: 85.0 },
  { id: "PKT007", kecamatan: "SUMBERWRINGIN", desa: "Sukorejo", poktan: "Poktan Arabika Raung", ketua: "Mahfud Effendi", kontak: "081398765455", jumlahAnggota: 48, komoditasUtama: "Kopi Arabika & Robusta", luasLahanHa: 72.4 },
  { id: "PKT008", kecamatan: "SUMBERWRINGIN", desa: "Sumberwringin", poktan: "Poktan Tani Subur", ketua: "Suparman", kontak: "081398765477", jumlahAnggota: 33, komoditasUtama: "Kopi & Hortikultura", luasLahanHa: 41.0 },
  { id: "PKT009", kecamatan: "SUMBERWRINGIN", desa: "Rejoagung", poktan: "Poktan Harapan Bersama", ketua: "Abdul Aziz", kontak: "081398765499", jumlahAnggota: 30, komoditasUtama: "Padi Gogo & Kopi", luasLahanHa: 35.8 },
  { id: "PKT010", kecamatan: "SUMBERWRINGIN", desa: "Tegaljati", poktan: "Poktan Maju Mapan", ketua: "Wahyu Santoso", kontak: "081398765411", jumlahAnggota: 27, komoditasUtama: "Kopi & Cengkeh", luasLahanHa: 30.5 },

  // MAESAN
  { id: "PKT011", kecamatan: "MAESAN", desa: "Maesan", poktan: "Poktan Tembakau Kasturi", ketua: "Supardi", kontak: "082143219876", jumlahAnggota: 62, komoditasUtama: "Tembakau Kasturi & Padi", luasLahanHa: 68.0 },
  { id: "PKT012", kecamatan: "MAESAN", desa: "Pujerbaru", poktan: "Poktan Tani Sejahtera", ketua: "M. Thohir", kontak: "082143219855", jumlahAnggota: 41, komoditasUtama: "Padi Ciherang & Jagung", luasLahanHa: 49.0 },
  { id: "PKT013", kecamatan: "MAESAN", desa: "Suger Lor", poktan: "Poktan Sumber Makmur", ketua: "Rahmat Hidayat", kontak: "082143219833", jumlahAnggota: 36, komoditasUtama: "Tembakau Rajangan", luasLahanHa: 44.2 },
  { id: "PKT014", kecamatan: "MAESAN", desa: "Gambangan", poktan: "Poktan Berkah Tani", ketua: "Zainal Abidin", kontak: "082143219811", jumlahAnggota: 28, komoditasUtama: "Padi Organik", luasLahanHa: 31.0 },

  // TAMANAN
  { id: "PKT015", kecamatan: "TAMANAN", desa: "Tamanan", poktan: "Poktan Padi Mas 1", ketua: "Sulastri", kontak: "081987654321", jumlahAnggota: 45, komoditasUtama: "Padi Varietas Unggul", luasLahanHa: 52.0 },
  { id: "PKT016", kecamatan: "TAMANAN", desa: "Wonolelo", poktan: "Poktan Tebu Manis Mandiri", ketua: "Sudirman", kontak: "081987654344", jumlahAnggota: 39, komoditasUtama: "Tebu Rakyat & Palawija", luasLahanHa: 58.5 },
  { id: "PKT017", kecamatan: "TAMANAN", desa: "Kalianyar", poktan: "Poktan Rukun Tani", ketua: "Bambang Sugiharto", kontak: "081987654366", jumlahAnggota: 34, komoditasUtama: "Padi & Jagung Manis", luasLahanHa: 39.0 },
  { id: "PKT018", kecamatan: "TAMANAN", desa: "Sumber Kemuning", poktan: "Poktan Tani Mulya", ketua: "Suwandi", kontak: "081987654388", jumlahAnggota: 31, komoditasUtama: "Padi & Kedelai", luasLahanHa: 36.4 },

  // GRUJUGAN
  { id: "PKT019", kecamatan: "GRUJUGAN", desa: "Grujugan Kidul", poktan: "Poktan Agro Makmur", ketua: "Didik Haryono", kontak: "085233112233", jumlahAnggota: 37, komoditasUtama: "Padi & Bawang Merah", luasLahanHa: 42.0 },
  { id: "PKT020", kecamatan: "GRUJUGAN", desa: "Dadapan", poktan: "Poktan Tani Berkah", ketua: "Misnadin", kontak: "085233112255", jumlahAnggota: 30, komoditasUtama: "Padi Inpari", luasLahanHa: 33.5 },
  { id: "PKT021", kecamatan: "GRUJUGAN", desa: "Taman", poktan: "Poktan Guyub Rukun", ketua: "Imam Safii", kontak: "085233112277", jumlahAnggota: 25, komoditasUtama: "Sayuran & Jagung", luasLahanHa: 27.0 },

  // BONDOWOSO (KOTA)
  { id: "PKT022", kecamatan: "BONDOWOSO", desa: "Badean", poktan: "Poktan Sayur Organik Kota", ketua: "Endang Sulistyowati", kontak: "081233445501", jumlahAnggota: 24, komoditasUtama: "Hortikultura & Hidroponik", luasLahanHa: 12.5 },
  { id: "PKT023", kecamatan: "BONDOWOSO", desa: "Kademangan", poktan: "Poktan Tani Bersemi", ketua: "Budi Santoso", kontak: "081233445502", jumlahAnggota: 28, komoditasUtama: "Sayuran Daun & Buah", luasLahanHa: 15.0 },
  { id: "PKT024", kecamatan: "BONDOWOSO", desa: "Blindungan", poktan: "Poktan Hidroponik Asri", ketua: "Dyah Retno", kontak: "081233445503", jumlahAnggota: 20, komoditasUtama: "Melon & Selada Urban", luasLahanHa: 8.2 },

  // PUJER
  { id: "PKT025", kecamatan: "PUJER", desa: "Maskuning Kulon", poktan: "Poktan Maskuning Subur", ketua: "Hariyanto", kontak: "085211447788", jumlahAnggota: 43, komoditasUtama: "Padi & Tembakau", luasLahanHa: 48.0 },
  { id: "PKT026", kecamatan: "PUJER", desa: "Maskuning Wetan", poktan: "Poktan Maju Makmur", ketua: "Sujono", kontak: "085211447799", jumlahAnggota: 38, komoditasUtama: "Padi Ciherang", luasLahanHa: 40.5 },
  { id: "PKT027", kecamatan: "PUJER", desa: "Mengok", poktan: "Poktan Sumber Rezeki", ketua: "Ali Mahrus", kontak: "085211447711", jumlahAnggota: 33, komoditasUtama: "Jagung & Kacang Tanah", luasLahanHa: 36.0 },

  // TAPEN
  { id: "PKT028", kecamatan: "TAPEN", desa: "Tapen", poktan: "Poktan Jagung Hibrida", ketua: "Hasan Basri", kontak: "082334455667", jumlahAnggota: 52, komoditasUtama: "Jagung Hibrida Pioneer", luasLahanHa: 64.0 },
  { id: "PKT029", kecamatan: "TAPEN", desa: "Wonokusumo", poktan: "Poktan Tani Sentosa", ketua: "Samsuri", kontak: "082334455688", jumlahAnggota: 35, komoditasUtama: "Padi & Jagung", luasLahanHa: 37.5 },
  { id: "PKT030", kecamatan: "TAPEN", desa: "Cindogo", poktan: "Poktan Karya Tani", ketua: "Yoyok Subagyo", kontak: "082334455699", jumlahAnggota: 29, komoditasUtama: "Padi Sawah", luasLahanHa: 32.0 },

  // IJEN (SEMPOL)
  { id: "PKT031", kecamatan: "IJEN", desa: "Sempol", poktan: "Poktan Kopi Arabika Java Ijen", ketua: "Joko Wiyono", kontak: "085311223344", jumlahAnggota: 65, komoditasUtama: "Kopi Arabika Java Ijen Specialty", luasLahanHa: 110.0 },
  { id: "PKT032", kecamatan: "IJEN", desa: "Kalianyar", poktan: "Poktan Hortikultura Lereng", ketua: "Purnomo", kontak: "085311223366", jumlahAnggota: 40, komoditasUtama: "Kentang, Kubis & Wortel", luasLahanHa: 48.0 },
  { id: "PKT033", kecamatan: "IJEN", desa: "Jampit", poktan: "Poktan Sayur Dataran Tinggi", ketua: "Hadi Purnomo", kontak: "085311223388", jumlahAnggota: 36, komoditasUtama: "Stroberi & Sayuran Dataran Tinggi", luasLahanHa: 39.5 },

  // PRAJEKAN
  { id: "PKT034", kecamatan: "PRAJEKAN", desa: "Prajekan Lor", poktan: "Poktan Tebu Rakyat Prajekan", ketua: "Bambang Sutrisno", kontak: "085231456789", jumlahAnggota: 58, komoditasUtama: "Tebu Rakyat Pabrik Prajekan", luasLahanHa: 75.0 },
  { id: "PKT035", kecamatan: "PRAJEKAN", desa: "Prajekan Kidul", poktan: "Poktan Ratoon Jaya", ketua: "Kuswantoro", kontak: "085231456711", jumlahAnggota: 44, komoditasUtama: "Tebu Varietas Unggul", luasLahanHa: 56.0 },
  { id: "PKT036", kecamatan: "PRAJEKAN", desa: "Walidono", poktan: "Poktan Sumber Urip", ketua: "Fathur Rohman", kontak: "085231456733", jumlahAnggota: 32, komoditasUtama: "Padi & Jagung", luasLahanHa: 35.0 },

  // CURAHDAMI
  { id: "PKT037", kecamatan: "CURAHDAMI", desa: "Curahdami", poktan: "Poktan Harapan Baru", ketua: "M. Salim", kontak: "081333556611", jumlahAnggota: 35, komoditasUtama: "Padi Organik & Ubi", luasLahanHa: 38.0 },
  { id: "PKT038", kecamatan: "CURAHDAMI", desa: "Petung", poktan: "Poktan Tani Makmur", ketua: "Agus Setyo", kontak: "081333556622", jumlahAnggota: 28, komoditasUtama: "Cabai Rawit & Bawang", luasLahanHa: 29.5 },

  // TENGGARANG
  { id: "PKT039", kecamatan: "TENGGARANG", desa: "Tenggarang", poktan: "Poktan Margo Rukun", ketua: "Suwito", kontak: "081333556633", jumlahAnggota: 40, komoditasUtama: "Padi & Sayuran", luasLahanHa: 44.0 },
  { id: "PKT040", kecamatan: "TENGGARANG", desa: "Gebang", poktan: "Poktan Sari Tani", ketua: "Danang Kusuma", kontak: "081333556644", jumlahAnggota: 32, komoditasUtama: "Jagung & Tembakau", luasLahanHa: 34.0 },

  // WONOSARI
  { id: "PKT041", kecamatan: "WONOSARI", desa: "Wonosari", poktan: "Poktan Bina Tani", ketua: "H. Mustofa", kontak: "081333556655", jumlahAnggota: 37, komoditasUtama: "Padi & Tembakau Maesan", luasLahanHa: 42.0 },
  { id: "PKT042", kecamatan: "WONOSARI", desa: "Traktakan", poktan: "Poktan Makmur Abadi", ketua: "Rifa'i", kontak: "081333556666", jumlahAnggota: 30, komoditasUtama: "Jagung & Kedelai", luasLahanHa: 33.0 },

  // CERMEE
  { id: "PKT043", kecamatan: "CERMEE", desa: "Cermee", poktan: "Poktan Jagung Perkasa", ketua: "Lukman Hakim", kontak: "081333556677", jumlahAnggota: 46, komoditasUtama: "Jagung Hibrida & Kacang Hijau", luasLahanHa: 53.0 },
  { id: "PKT044", kecamatan: "CERMEE", desa: "Batu Ampar", poktan: "Poktan Sumber Tani", ketua: "Suraji", kontak: "081333556688", jumlahAnggota: 29, komoditasUtama: "Padi Gogo & Singkong", luasLahanHa: 31.0 }
];

export const DAFTAR_KECAMATAN = [
  "BONDOWOSO",
  "BINAKAL",
  "BOTOLINGGO",
  "CERMEE",
  "CURAHDAMI",
  "GRUJUGAN",
  "IJEN",
  "JAMBESARI DARUS SHOLAH",
  "KLABANG",
  "MAESAN",
  "PAKEM",
  "PRAJEKAN",
  "PUJER",
  "SUKOSARI",
  "SUMBERWRINGIN",
  "TAMAN KROCOK",
  "TAMANAN",
  "TAPEN",
  "TEGALAMPEL",
  "TENGGARANG",
  "TLOGOSARI",
  "WRINGIN",
  "WONOSARI"
].sort();

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 1,
    number: "01",
    title: "Konsultasi Pertanian",
    tagline: "Aduan Teknis & Bimbingan Budidaya",
    description: "Layanan konsultasi teknis komoditas unggulan (Padi, Jagung, Tembakau, Kopi, Hortikultura) langsung dengan pakar agronomi daerah.",
    category: "Agronomi",
    icon: "MessageSquareText",
    accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accentColor: "emerald",
    badge: "Respons Cepat"
  },
  {
    id: 2,
    number: "02",
    title: "Penyuluhan & Pelatihan",
    tagline: "Sekolah Lapang & Alih Teknologi",
    description: "Permohonan bimbingan teknis, sekolah lapang terpadu, pelatihan pertanian organik, hingga adopsi modern smart farming.",
    category: "Edukasi Lapang",
    icon: "GraduationCap",
    accentBg: "bg-teal-50 text-teal-700 border-teal-200",
    accentColor: "teal",
    badge: "Kelompok Tani"
  },
  {
    id: 3,
    number: "03",
    title: "Konsultasi Agribisnis",
    tagline: "Tata Niaga & Skema Permodalan",
    description: "Konsultasi perluasan akses permodalan KUR, tata niaga hasil panen, kemitraan off-taker, dan stabilitas harga komoditas.",
    category: "Ekonomi Pertanian",
    icon: "TrendingUp",
    accentBg: "bg-blue-50 text-blue-700 border-blue-200",
    accentColor: "blue",
    badge: "Kemitraan"
  },
  {
    id: 4,
    number: "04",
    title: "Pembaharuan e-RDKK",
    tagline: "Alokasi Pupuk Bersubsidi",
    description: "Pengajuan pembaharuan dan perbaikan data alokasi pupuk bersubsidi, perubahan luas lahan, maupun penyesuaian kelompok tani.",
    category: "Legalitas & Subsidi",
    icon: "ClipboardCheck",
    accentBg: "bg-amber-50 text-amber-700 border-amber-200",
    accentColor: "amber",
    badge: "Wajib Berkas",
    requiresFiles: true
  },
  {
    id: 5,
    number: "05",
    title: "Pendataan Buruh Tani",
    tagline: "Sinkronisasi Jaminan Sosial",
    description: "Pendaftaran dan validasi basis data buruh tani Kabupaten Bondowoso untuk perlindungan jaminan sosial dan program afirmatif daerah.",
    category: "Sosial Petani",
    icon: "Users",
    accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    accentColor: "indigo",
    badge: "Program Daerah"
  },
  {
    id: 6,
    number: "06",
    title: "Diagnosis Hama Penyakit",
    tagline: "Identifikasi Cepat & Penanganan OPT",
    description: "Identifikasi dini serangan Organisme Pengganggu Tanaman (OPT), wereng, ulat grayak, bercak blast disertai rekomendasi bahan aktif.",
    category: "Proteksi Tanaman",
    icon: "Bug",
    accentBg: "bg-rose-50 text-rose-700 border-rose-200",
    accentColor: "rose",
    badge: "Foto Tanaman",
    requiresFiles: true
  },
  {
    id: 7,
    number: "07",
    title: "Analisis Kesuburan Tanah",
    tagline: "Pemeriksaan Kimiawi & Derajat pH",
    description: "Pemeriksaan profil hara makro/mikro, uji keasaman (pH) tanah vulkanik, dan evaluasi struktur hara lahan pertanian Bondowoso.",
    category: "Laboratorium Tanah",
    icon: "Layers",
    accentBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    accentColor: "cyan",
    badge: "Uji Lab"
  },
  {
    id: 8,
    number: "08",
    title: "Rekomendasi Pupuk & Pestisida",
    tagline: "Formulasi Dosis Tepat Berimbang",
    description: "Perhitungan dosis pemupukan berimbang (Urea, NPK, SP-36, Organik) serta pemilihan pestisida presisi sesuai umur vegetatif tanaman.",
    category: "Manajemen Hara",
    icon: "Droplets",
    accentBg: "bg-violet-50 text-violet-700 border-violet-200",
    accentColor: "violet",
    badge: "Presisi"
  },
  {
    id: 9,
    number: "09",
    title: "Usulan Asuransi Tani (AUTP)",
    tagline: "Proteksi Finansial Risiko Gagal Panen",
    description: "Fasilitasi pendaftaran Asuransi Usaha Tani Padi (AUTP) dari ancaman kekeringan ekstrem, genangan banjir, dan ledakan serangan hama.",
    category: "Mitigasi Risiko",
    icon: "ShieldAlert",
    accentBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
    accentColor: "emerald",
    badge: "Dokumen Resmi",
    requiresFiles: true
  },
  {
    id: 10,
    number: "10",
    title: "Gerakan Pengendalian (GERDAL)",
    tagline: "Aksi Tanggap Darurat Massal",
    description: "Koordinasi aksi lapangan darurat pengendalian OPT secara serentak, penyaluran bantuan pestisida hayati/kimia, dan asistensi regu POPT.",
    category: "Aksi Darurat",
    icon: "ShieldCheck",
    accentBg: "bg-red-50 text-red-700 border-red-200",
    accentColor: "red",
    badge: "Koordinat GPS",
    requiresFiles: true
  },
  {
    id: 11,
    number: "11",
    title: "Bongkar Ratoon Tebu",
    tagline: "Peningkatan Produktivitas Tanaman Tebu",
    description: "Program peremajaan keprasan (bongkar ratoon) tebu rakyat untuk mendongkrak rendemen dan tonase hasil panen tebu Kabupaten Bondowoso.",
    category: "Perkebunan Unggulan",
    icon: "Sparkles",
    accentBg: "bg-lime-50 text-lime-800 border-lime-300",
    accentColor: "lime",
    badge: "Prioritas Komoditas"
  }
];

export const INITIAL_USERS: UserProfile[] = [
  // --- PETANI ---
  {
    id: "U001",
    username: "3511081504820001",
    password: "petani123",
    name: "Bpk. Ahmad Fauzi",
    role: "petani",
    nik: "3511081504820001",
    kelompok: "Poktan Tani Jaya 1",
    desa: "Sukosari Lor",
    kecamatan: "SUKOSARI",
    wa: "081234567891"
  },
  {
    id: "U002",
    username: "3511124508850002",
    password: "petani123",
    name: "Ibu Siti Rohmah",
    role: "petani",
    nik: "3511124508850002",
    kelompok: "Poktan Kopi Ijen Makmur",
    desa: "Sukorejo",
    kecamatan: "SUMBERWRINGIN",
    wa: "081398765432"
  },
  {
    id: "U003",
    username: "3511011203780003",
    password: "petani123",
    name: "Bpk. Bambang Sutrisno",
    role: "petani",
    nik: "3511011203780003",
    kelompok: "Poktan Tebu Rakyat Prajekan",
    desa: "Prajekan Lor",
    kecamatan: "PRAJEKAN",
    wa: "085231456789"
  },
  {
    id: "U004",
    username: "3511052309790004",
    password: "petani123",
    name: "Bpk. Supardi",
    role: "petani",
    nik: "3511052309790004",
    kelompok: "Poktan Tembakau Kasturi",
    desa: "Maesan",
    kecamatan: "MAESAN",
    wa: "082143219876"
  },
  {
    id: "U005",
    username: "3511046102870005",
    password: "petani123",
    name: "Ibu Sulastri",
    role: "petani",
    nik: "3511046102870005",
    kelompok: "Poktan Padi Mas 1",
    desa: "Tamanan",
    kecamatan: "TAMANAN",
    wa: "081987654321"
  },
  {
    id: "U006",
    username: "3511191006840006",
    password: "petani123",
    name: "Bpk. Joko Wiyono",
    role: "petani",
    nik: "3511191006840006",
    kelompok: "Poktan Kopi Arabika Java Ijen",
    desa: "Sempol",
    kecamatan: "IJEN",
    wa: "085311223344"
  },
  {
    id: "U007",
    username: "3511091807830007",
    password: "petani123",
    name: "Bpk. Hasan Basri",
    role: "petani",
    nik: "3511091807830007",
    kelompok: "Poktan Jagung Hibrida",
    desa: "Tapen",
    kecamatan: "TAPEN",
    wa: "082334455667"
  },

  // --- PETUGAS LAPANGAN / KONSULTAN BPP ---
  {
    id: "P001",
    username: "petugas_sukosari",
    password: "petugas123",
    name: "Ir. Hendra Kusuma, S.P.",
    role: "petugas",
    nik: "198205142008011005",
    kelompok: "BPP Sukosari",
    desa: "Sukosari Lor",
    kecamatan: "SUKOSARI",
    wa: "081223344556"
  },
  {
    id: "P002",
    username: "petugas_semua",
    password: "petugas123",
    name: "Bambang Wijaya, S.ST (Koordinator Lapangan)",
    role: "petugas",
    nik: "197802102005011002",
    kelompok: "BPP Kabupaten",
    desa: "Pusat",
    kecamatan: "SEMUA",
    wa: "081334455667",
    isSuperAdmin: true
  },
  {
    id: "P003",
    username: "petugas_sumberwringin",
    password: "petugas123",
    name: "Siti Nurhaliza, S.P.",
    role: "petugas",
    nik: "198904122014022003",
    kelompok: "BPP Sumberwringin",
    desa: "Sukorejo",
    kecamatan: "SUMBERWRINGIN",
    wa: "082233445588"
  },
  {
    id: "P004",
    username: "petugas_prajekan",
    password: "petugas123",
    name: "Dewi Kartika, S.ST",
    role: "petugas",
    nik: "198607152011012004",
    kelompok: "BPP Prajekan",
    desa: "Prajekan Lor",
    kecamatan: "PRAJEKAN",
    wa: "085211998877"
  },
  {
    id: "P005",
    username: "petugas_maesan",
    password: "petugas123",
    name: "Agus Prasetyo, S.P.",
    role: "petugas",
    nik: "198403212009011006",
    kelompok: "BPP Maesan",
    desa: "Maesan",
    kecamatan: "MAESAN",
    wa: "081299887766"
  },

  // --- ADMINISTRATOR ---
  {
    id: "A001",
    username: "admin",
    password: "admin123",
    name: "Administrator Disperta & KP Bondowoso",
    role: "admin",
    nik: "198509122010011008",
    kelompok: "Sekretariat Dinas",
    desa: "Kademangan",
    kecamatan: "BONDOWOSO",
    wa: "081133221100",
    isSuperAdmin: true
  },
  {
    id: "A002",
    username: "admin_sim",
    password: "admin123",
    name: "Subur Rahardjo, S.Kom (Pranata Komputer)",
    role: "admin",
    nik: "198811052015031002",
    kelompok: "Bidang Data & SIM",
    desa: "Badean",
    kecamatan: "BONDOWOSO",
    wa: "081233441122",
    isSuperAdmin: true
  },
  {
    id: "A003",
    username: "admin_sarpras",
    password: "admin123",
    name: "Nur Hidayat, S.TP (Admin Sarana & Prasarana)",
    role: "admin",
    nik: "198302182008011003",
    kelompok: "Bidang Sarpras & Perlindungan",
    desa: "Blindungan",
    kecamatan: "BONDOWOSO",
    wa: "085733221144",
    isSuperAdmin: true
  }
];

export const INITIAL_ADUAN: LayananAduan[] = [
  {
    idAduan: "ADN0001",
    waktu: "25/09/2026 09:15",
    username: "3511081504820001",
    namaPetani: "Bpk. Ahmad Fauzi",
    kecamatan: "SUKOSARI",
    desa: "Sukosari Lor",
    kelompok: "Poktan Tani Jaya 1",
    noWa: "081234567891",
    layanan: "6. Diagnosis Hama Penyakit",
    rincian: "[Jenis Tanaman]: Padi Ciherang || [Luas Serangan]: 0.75 Ha || [Pilihan]: Daun Menguning, Batang Busuk; Gejala tampak mengering dari ujung pelepah dan pangkal batang berubah kecokelatan.",
    fileKTP: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    fileSerangan: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
    jawaban: "Berdasarkan gejala khas, tanaman terindikasi infeksi Bakteri Hawar Daun (Xanthomonas oryzae pv. oryzae) disertai bercak pelepah. Segera keringkan air sawah secara berkala (intermittent), kurangi dosis pupuk Urea/N, dan semprotkan bakterisida berbahan aktif Tembaga Hidroksida 77% dengan dosis 2 gr/liter air pada pagi hari.",
    waktuDijawab: "25/09/2026 14:30",
    namaPetugas: "Ir. Hendra Kusuma, S.P.",
    filePelaksanaan: "https://drive.google.com/uc?export=view&id=1b22l07Rf5EVbG9m7togY0skWi0WzPZyk",
    status: "selesai"
  },
  {
    idAduan: "ADN0002",
    waktu: "26/09/2026 10:20",
    username: "3511124508850002",
    namaPetani: "Ibu Siti Rohmah",
    kecamatan: "SUMBERWRINGIN",
    desa: "Sukorejo",
    kelompok: "Poktan Kopi Ijen Makmur",
    noWa: "081398765432",
    layanan: "1. Konsultasi Pertanian",
    rincian: "[Komoditas]: Kopi Arabika Ijen || [Permasalahan]: Tanaman kopi umur 4 tahun daunnya menunjukkan gejala klorosis menguning antar tulang daun, perkembangan buah muda rontok sebelum mengembang optimal.",
    fileKTP: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    jawaban: "Gejala tersebut mencirikan defisiensi hara mikro Seng (Zn) dan Magnesium (Mg) yang lazim terjadi pada tanah vulkanik ber-pH masam. Rekomendasi: lakukan pengapuran dolomit 300-500 gram/pohon serta aplikasi pupuk daun kaya ZnSO4 0.2% setiap 14 hari.",
    waktuDijawab: "26/09/2026 16:45",
    namaPetugas: "Bambang Wijaya, S.ST",
    status: "dijawab"
  },
  {
    idAduan: "ADN0003",
    waktu: "27/09/2026 08:45",
    username: "3511011203780003",
    namaPetani: "Bpk. Bambang Sutrisno",
    kecamatan: "PRAJEKAN",
    desa: "Prajekan Lor",
    kelompok: "Poktan Tebu Rakyat Prajekan",
    noWa: "085231456789",
    layanan: "11. Bongkar Ratoon Tebu",
    rincian: "[Deskripsi: Peningkatan Produktivitas Tanaman Tebu] Permasalahan: Lahan tebu keprasan ke-4 mengalami penurunan populasi batang hingga 40%, anakan kerdil, tanah memadat keras butuh peremajaan bongkar ratoon musim tanam ini seluas 1.5 Ha.",
    status: "baru"
  },
  {
    idAduan: "ADN0004",
    waktu: "27/09/2026 11:10",
    username: "3511081504820001",
    namaPetani: "Bpk. Ahmad Fauzi",
    kecamatan: "SUKOSARI",
    desa: "Sukosari Lor",
    kelompok: "Poktan Tani Jaya 1",
    noWa: "081234567891",
    layanan: "10. Gerakan Pengendalian (GERDAL)",
    rincian: "[Jenis Tanaman]: Padi || [Jenis Hama/Penyakit]: Wereng Batang Coklat (WBC) || [Luas Serangan]: 3.5 Ha Blok Sawah Timur || [Tingkat Serangan]: Sedang || [Permohonan]: Pengendalian Massal, Pendampingan POPT || [Titik Lokasi]: -7.954210, 113.987650",
    fileKTP: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    status: "baru"
  },
  {
    idAduan: "ADN0005",
    waktu: "27/09/2026 13:30",
    username: "3511124508850002",
    namaPetani: "Ibu Siti Rohmah",
    kecamatan: "SUMBERWRINGIN",
    desa: "Sukorejo",
    kelompok: "Poktan Kopi Ijen Makmur",
    noWa: "081398765432",
    layanan: "4. Pembaharuan e-RDKK",
    rincian: "[Pilihan]: Perubahan Luas Lahan, Perubahan Komoditas || Ada penambahan garapan tanaman kopi tumpangsang jahe merah seluas 0.6 Ha butuh penyesuaian kuota pupuk NPK bersubsidi.",
    fileKTP: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    fileKK: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80",
    fileSPPT: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
    status: "baru"
  },
  {
    idAduan: "ADN0006",
    waktu: "24/09/2026 15:00",
    username: "3511011203780003",
    namaPetani: "Bpk. Bambang Sutrisno",
    kecamatan: "PRAJEKAN",
    desa: "Prajekan Lor",
    kelompok: "Poktan Tebu Rakyat Prajekan",
    noWa: "085231456789",
    layanan: "9. Usulan Asuransi Tani",
    rincian: "[Jenis Asuransi]: AUTP || [Luas Lahan]: 2.0 Ha || [Lokasi Lahan]: Blok Prajekan Lor || [Potensi Risiko]: Kekeringan di musim kemarau.",
    fileKTP: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
    fileSPPT: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
    fileLahan: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
    jawaban: "Berkas usulan AUTP telah diverifikasi lengkap oleh Dinas Pertanian dan Ketahanan Pangan Bondowoso. Data registrasi diteruskan ke PT Asuransi Jasa Indonesia (Jasindo) Cabang Jember. Polis aktif per tanggal 28 September 2026.",
    waktuDijawab: "25/09/2026 11:00",
    namaPetugas: "Bambang Wijaya, S.ST",
    filePelaksanaan: "https://drive.google.com/uc?export=view&id=1b22l07Rf5EVbG9m7togY0skWi0WzPZyk",
    status: "selesai"
  }
];

export const INITIAL_RESET_REQUESTS: ResetPasswordRequest[] = [
  {
    username: "3511011203780003",
    name: "Bpk. Bambang Sutrisno",
    noWa: "085231456789",
    kecamatan: "PRAJEKAN",
    status: "Pending",
    waktu: "27/09/2026 14:15"
  },
  {
    username: "3511081504820001",
    name: "Bpk. Ahmad Fauzi",
    noWa: "081234567891",
    kecamatan: "SUKOSARI",
    status: "Success",
    waktu: "26/09/2026 11:20",
    newPassword: "Tani88#Fz"
  }
];
