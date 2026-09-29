import React, { useState } from 'react';
import { UserProfile, LayananAduan, ResetPasswordRequest, WilayahTaniItem, UserRole } from '../types';
import {
  computeAdminDashboardMetrics,
  approvePasswordReset,
  getStoredUsers,
  getStoredResets,
  getStoredWilayah,
  addUser,
  updateUser,
  deleteUser,
  addWilayah,
  updateWilayah,
  deleteWilayah
} from '../utils/storage';
import { DAFTAR_KECAMATAN } from '../data/masterData';
import { AdminUserModal, AdminPoktanModal } from './AdminEntityModals';
import {
  ShieldAlert,
  KeyRound,
  FileBarChart2,
  PieChart,
  RefreshCw,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Download,
  Share2,
  Users,
  Sparkles,
  ExternalLink,
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  UserCheck,
  Briefcase,
  Sprout,
  Building2,
  Filter,
  ShieldCheck,
  AlertCircle,
  FileText,
  UserPlus,
  Layers,
  Activity,
  X
} from 'lucide-react';

interface DashboardAdminProps {
  currentUser: UserProfile;
  aduanList: LayananAduan[];
  onRefresh: () => void;
  onOpenFarmerProfile: (username: string) => void;
}

type AdminTab = 'petani' | 'petugas' | 'admin' | 'poktan' | 'reset' | 'rekap' | 'analisis';

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({
  currentUser,
  aduanList,
  onRefresh,
  onOpenFarmerProfile
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('petani');
  const [usersList, setUsersList] = useState<UserProfile[]>(getStoredUsers());
  const [wilayahList, setWilayahList] = useState<WilayahTaniItem[]>(getStoredWilayah());
  const [resetList, setResetList] = useState<ResetPasswordRequest[]>(getStoredResets());

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('SEMUA');

  // Modals States
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<'add' | 'edit'>('add');
  const [userModalRole, setUserModalRole] = useState<UserRole>('petani');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const [poktanModalOpen, setPoktanModalOpen] = useState(false);
  const [poktanModalMode, setPoktanModalMode] = useState<'add' | 'edit'>('add');
  const [selectedPoktan, setSelectedPoktan] = useState<WilayahTaniItem | null>(null);
  const [selectedPoktanIndex, setSelectedPoktanIndex] = useState<number | undefined>(undefined);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'user' | 'poktan';
    title: string;
    idOrIndex: string | number;
  } | null>(null);

  // Toast / Feedback message
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Reset feedback
  const [resetFeedback, setResetFeedback] = useState<{
    message: string;
    waUrl?: string;
    pass?: string;
  } | null>(null);

  const metrics = computeAdminDashboardMetrics();

  // Show Toast Helper
  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  // Reload local state
  const refreshLocalState = () => {
    setUsersList(getStoredUsers());
    setWilayahList(getStoredWilayah());
    setResetList(getStoredResets());
    onRefresh();
  };

  // Filtered lists
  const farmersList = usersList.filter(u => u.role === 'petani');
  const officersList = usersList.filter(u => u.role === 'petugas');
  const adminsList = usersList.filter(u => u.role === 'admin');

  // Filtered Farmers
  const displayedFarmers = farmersList.filter(f => {
    const matchSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.desa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.kelompok.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKec = filterKecamatan === 'SEMUA' || f.kecamatan.toUpperCase() === filterKecamatan.toUpperCase();
    return matchSearch && matchKec;
  });

  // Filtered Officers
  const displayedOfficers = officersList.filter(o => {
    const matchSearch =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.username && o.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.nik && o.nik.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.kelompok && o.kelompok.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchKec = filterKecamatan === 'SEMUA' || o.kecamatan.toUpperCase() === filterKecamatan.toUpperCase() || o.kecamatan.toUpperCase() === 'SEMUA';
    return matchSearch && matchKec;
  });

  // Filtered Admins
  const displayedAdmins = adminsList.filter(a => {
    return (
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.kelompok && a.kelompok.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Filtered Poktan
  const displayedPoktan = wilayahList.filter((p, idx) => {
    const matchSearch =
      p.poktan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.ketua && p.ketua.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.komoditasUtama && p.komoditasUtama.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchKec = filterKecamatan === 'SEMUA' || p.kecamatan.toUpperCase() === filterKecamatan.toUpperCase();
    return matchSearch && matchKec;
  });

  // Handle Save User
  const handleSaveUser = (user: UserProfile) => {
    if (userModalMode === 'add') {
      addUser(user);
      showToast(`Data ${user.name} berhasil ditambahkan ke sistem.`);
    } else {
      updateUser(user);
      showToast(`Data ${user.name} berhasil diperbarui.`);
    }
    setUserModalOpen(false);
    refreshLocalState();
  };

  // Handle Save Poktan
  const handleSavePoktan = (poktan: WilayahTaniItem, idx?: number) => {
    if (poktanModalMode === 'add') {
      addWilayah(poktan);
      showToast(`Kelompok Tani "${poktan.poktan}" berhasil ditambahkan.`);
    } else if (idx !== undefined) {
      updateWilayah(idx, poktan);
      showToast(`Kelompok Tani "${poktan.poktan}" berhasil diperbarui.`);
    }
    setPoktanModalOpen(false);
    refreshLocalState();
  };

  // Handle Execute Delete
  const handleExecuteDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'user') {
      const targetId = String(deleteConfirm.idOrIndex);
      deleteUser(targetId);
      showToast(`Data pengguna berhasil dihapus.`);
    } else if (deleteConfirm.type === 'poktan') {
      const targetIdx = Number(deleteConfirm.idOrIndex);
      deleteWilayah(targetIdx);
      showToast(`Kelompok tani berhasil dihapus.`);
    }

    setDeleteConfirm(null);
    refreshLocalState();
  };

  // Handle Admin Reset Approval
  const handleApproveReset = (username: string) => {
    const res = approvePasswordReset(username);
    if (res.success) {
      setResetFeedback({
        message: res.message,
        waUrl: res.whatsappUrl,
        pass: res.newPassword
      });
      setResetList(getStoredResets());
      refreshLocalState();
    } else {
      setResetFeedback({ message: res.message });
    }
  };

  // Helper WhatsApp Link
  const getWhatsAppLink = (phone: string, name: string, context: string) => {
    let clean = (phone || '').replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    else if (clean.startsWith('8')) clean = '62' + clean;
    const msg = `Halo Bpk/Ibu ${name}, kami dari Administrator Dinas Pertanian dan Ketahanan Pangan Kabupaten Bondowoso mengenai ${context}.`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

  // Export CSV
  const exportCsv = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = '';

    if (activeAdminTab === 'petani') {
      headers = ['NIK', 'Nama Petani', 'Kecamatan', 'Desa', 'Kelompok Tani', 'Nomor WA'];
      rows = farmersList.map(f => [
        `"${f.nik || f.username}"`,
        `"${f.name}"`,
        `"${f.kecamatan}"`,
        `"${f.desa}"`,
        `"${f.kelompok}"`,
        `"${f.wa}"`
      ]);
      filename = `DAFTAR_PETANI_BONDOWOSO_${Date.now()}.csv`;
    } else if (activeAdminTab === 'petugas') {
      headers = ['NIP/Username', 'Nama Petugas', 'Wilayah Binaan BPP', 'Nomor WA', 'Super Admin'];
      rows = officersList.map(o => [
        `"${o.nik || o.username}"`,
        `"${o.name}"`,
        `"${o.kecamatan}"`,
        `"${o.wa}"`,
        `"${o.isSuperAdmin ? 'Ya' : 'Tidak'}"`
      ]);
      filename = `DAFTAR_PETUGAS_BPP_BONDOWOSO_${Date.now()}.csv`;
    } else if (activeAdminTab === 'admin') {
      headers = ['Username', 'NIP/NIK', 'Nama Lengkap', 'Bidang Tugas', 'Nomor WA'];
      rows = adminsList.map(a => [
        `"${a.username}"`,
        `"${a.nik || '-'}"`,
        `"${a.name}"`,
        `"${a.kelompok}"`,
        `"${a.wa}"`
      ]);
      filename = `DAFTAR_ADMIN_DISPERTA_BONDOWOSO_${Date.now()}.csv`;
    } else if (activeAdminTab === 'poktan') {
      headers = ['Kode Poktan', 'Nama Kelompok Tani', 'Kecamatan', 'Desa', 'Ketua Poktan', 'Kontak WA', 'Komoditas Utama', 'Luas Lahan (Ha)', 'Jumlah Anggota'];
      rows = wilayahList.map(w => [
        `"${w.id || '-'}"`,
        `"${w.poktan}"`,
        `"${w.kecamatan}"`,
        `"${w.desa}"`,
        `"${w.ketua || '-'}"`,
        `"${w.kontak || '-'}"`,
        `"${w.komoditasUtama || '-'}"`,
        `"${w.luasLahanHa || 0}"`,
        `"${w.jumlahAnggota || 0}"`
      ]);
      filename = `DAFTAR_KELOMPOK_TANI_BONDOWOSO_${Date.now()}.csv`;
    } else {
      headers = [
        'ID Aduan',
        'Waktu',
        'NIK Pemohon',
        'Nama Petani',
        'Kecamatan',
        'Desa',
        'Layanan',
        'Status',
        'Petugas',
        'Jawaban'
      ];
      rows = aduanList.map(a => [
        `"${a.idAduan}"`,
        `"${a.waktu}"`,
        `"${a.username}"`,
        `"${a.namaPetani}"`,
        `"${a.kecamatan}"`,
        `"${a.desa}"`,
        `"${a.layanan}"`,
        `"${a.status}"`,
        `"${a.namaPetugas || '-'}"`,
        `"${(a.jawaban || '').replace(/"/g, '""')}"`
      ]);
      filename = `REKAP_LAYANAN_BONDOWOSO_${Date.now()}.csv`;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Rankings
  const sortedKecamatan = Object.entries(metrics.rekapKecamatan)
    .filter(([k]) => k.toUpperCase() !== 'PELATIHAN')
    .sort((a, b) => b[1] - a[1]);

  const sortedLayanan = Object.entries(metrics.rekapLayanan)
    .filter(([l]) => isNaN(Number(l)))
    .sort((a, b) => b[1] - a[1]);

  const maxKecValue = Math.max(...sortedKecamatan.map(k => k[1]), 1);
  const maxTrenValue = Math.max(...Object.values(metrics.trenBulanan), 1);

  // Total poktan stats
  const totalLuasLahan = wilayahList.reduce((acc, curr) => acc + (curr.luasLahanHa || 0), 0);
  const totalAnggotaTani = wilayahList.reduce((acc, curr) => acc + (curr.jumlahAnggota || 0), 0);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Administrator Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 p-2 shrink-0 flex items-center justify-center shadow-xs">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-amber-900 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Pusat Kendali Administrator Dinas Pertanian & Ketahanan Pangan Kab. Bondowoso</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dashboard Manajemen Data & Pelayanan Pertanian
              </h1>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Kelola data terpadu Petani, Petugas BPP Lapangan, Administrator, Kelompok Tani (Poktan), permohonan reset sandi WA, dan analisis agribisnis 23 kecamatan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={exportCsv}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
              title="Unduh berkas spreadsheet CSV sesuai tab aktif"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Ekspor Data CSV</span>
            </button>
            <button
              onClick={refreshLocalState}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              title="Segarkan data terbaru"
            >
              <RefreshCw className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {feedbackToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-800 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>{feedbackToast}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="p-1 text-emerald-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation Menu (Integrated with Petani, Petugas, Admin, Kelompok Tani) */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Menu Navigasi Administrator:
          </div>
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl">
            {/* 1. Petani */}
            <button
              onClick={() => {
                setActiveAdminTab('petani');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'petani'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>Daftar Petani</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono">
                {farmersList.length}
              </span>
            </button>

            {/* 2. Petugas */}
            <button
              onClick={() => {
                setActiveAdminTab('petugas');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'petugas'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-700" />
              <span>Daftar Petugas</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-mono">
                {officersList.length}
              </span>
            </button>

            {/* 3. Admin */}
            <button
              onClick={() => {
                setActiveAdminTab('admin');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'admin'
                  ? 'bg-white text-amber-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Daftar Admin</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-mono">
                {adminsList.length}
              </span>
            </button>

            {/* 4. Kelompok Tani */}
            <button
              onClick={() => {
                setActiveAdminTab('poktan');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'poktan'
                  ? 'bg-white text-teal-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-teal-700" />
              <span>Daftar Kelompok Tani</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-teal-100 text-teal-800 font-mono">
                {wilayahList.length}
              </span>
            </button>

            {/* 5. Reset Sandi WA */}
            <button
              onClick={() => setActiveAdminTab('reset')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'reset'
                  ? 'bg-white text-red-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4 text-red-600" />
              <span>Antrean Reset Sandi WA</span>
              {resetList.filter(r => r.status === 'Pending').length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-600 text-white font-mono animate-pulse">
                  {resetList.filter(r => r.status === 'Pending').length}
                </span>
              )}
            </button>

            {/* 6. Rekapitulasi Pelayanan */}
            <button
              onClick={() => setActiveAdminTab('rekap')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'rekap'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileBarChart2 className="w-4 h-4 text-emerald-600" />
              <span>Rekapitulasi Pelayanan</span>
            </button>

            {/* 7. Analisis Tren */}
            <button
              onClick={() => setActiveAdminTab('analisis')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'analisis'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-4 h-4 text-blue-600" />
              <span>Grafik Tren Bulanan</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: DAFTAR PETANI                                           */}
        {/* ============================================================== */}
        {activeAdminTab === 'petani' && (
          <div className="space-y-4">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Petani Terdata
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-900 mt-1 block">
                  {farmersList.length} Orang
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Akun aktif teregistrasi</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Petani Mengajukan Aduan
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
                  {new Set(aduanList.map(a => a.username)).size} Orang
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Pernah konsultasi klinik</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Cakupan Wilayah
                </span>
                <span className="text-2xl font-bold font-mono text-blue-900 mt-1 block">
                  {new Set(farmersList.map(f => f.kecamatan)).size} Kecamatan
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Dari 23 kecamatan Bondowoso</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Tindakan Cepat
                </span>
                <button
                  onClick={() => {
                    setUserModalMode('add');
                    setUserModalRole('petani');
                    setSelectedUser(null);
                    setUserModalOpen(true);
                  }}
                  className="mt-2 w-full py-1.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Petani Baru</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Filter & Search Header */}
              <div className="p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    <span>Daftar Petani Kabupaten Bondowoso</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data profil petani, kepemilikan kelompok tani, kontak WhatsApp, dan riwayat konsultasi agribisnis.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search Input */}
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cari NIK, Nama, Desa, Poktan..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
                    />
                  </div>

                  {/* Kecamatan Selector */}
                  <select
                    value={filterKecamatan}
                    onChange={e => setFilterKecamatan(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-medium text-slate-700 focus:ring-2 focus:ring-emerald-700/30 cursor-pointer"
                  >
                    <option value="SEMUA">Semua Kecamatan ({farmersList.length})</option>
                    {DAFTAR_KECAMATAN.map(kec => (
                      <option key={kec} value={kec}>
                        {kec}
                      </option>
                    ))}
                  </select>

                  {/* Add Button */}
                  <button
                    onClick={() => {
                      setUserModalMode('add');
                      setUserModalRole('petani');
                      setSelectedUser(null);
                      setUserModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Petani</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">NIK & Nama Petani</th>
                      <th className="py-3 px-4">Wilayah (Kecamatan / Desa)</th>
                      <th className="py-3 px-4">Kelompok Tani (Poktan)</th>
                      <th className="py-3 px-4">Kontak WhatsApp</th>
                      <th className="py-3 px-4 text-center">Pengajuan Aduan</th>
                      <th className="py-3 px-4 text-right">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {displayedFarmers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Tidak ditemukan data petani yang cocok dengan filter.
                        </td>
                      </tr>
                    ) : (
                      displayedFarmers.map(farmer => {
                        const countAduan = aduanList.filter(
                          a => a.username === farmer.nik || a.username === farmer.username
                        ).length;

                        return (
                          <tr key={farmer.id || farmer.username} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <button
                                  onClick={() => onOpenFarmerProfile(farmer.username)}
                                  className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
                                  title="Lihat Profil Petani Lengkap"
                                >
                                  {farmer.name.charAt(0)}
                                </button>
                                <div>
                                  <button
                                    onClick={() => onOpenFarmerProfile(farmer.username)}
                                    className="font-bold text-slate-900 hover:text-emerald-800 hover:underline text-left block"
                                  >
                                    {farmer.name}
                                  </button>
                                  <span className="text-[11px] text-slate-500 font-mono">
                                    NIK: {farmer.nik || farmer.username}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-800">{farmer.kecamatan}</div>
                              <div className="text-[11px] text-slate-500">{farmer.desa || 'Desa Binaan'}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                                {farmer.kelompok || 'Petani Mandiri'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <a
                                href={getWhatsAppLink(farmer.wa, farmer.name, 'koordinasi pelayanan pertanian')}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-mono font-medium transition-colors"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>{farmer.wa}</span>
                              </a>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                                {countAduan} Aduan
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={getWhatsAppLink(farmer.wa, farmer.name, 'informasi klinik pertanian')}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                                  title="Kirim Pesan WhatsApp"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => {
                                    setSelectedUser(farmer);
                                    setUserModalMode('edit');
                                    setUserModalRole('petani');
                                    setUserModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 cursor-pointer"
                                  title="Edit Data Petani"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: 'user',
                                      title: `Hapus akun petani "${farmer.name}" (NIK: ${farmer.nik})?`,
                                      idOrIndex: farmer.id || farmer.username
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                                  title="Hapus Petani"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DAFTAR PETUGAS                                          */}
        {/* ============================================================== */}
        {activeAdminTab === 'petugas' && (
          <div className="space-y-4">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Petugas BPP
                </span>
                <span className="text-2xl font-bold font-mono text-blue-900 mt-1 block">
                  {officersList.length} Orang
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Penyuluh & Konsultan POPT</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Akses Koordinator Wilayah
                </span>
                <span className="text-2xl font-bold font-mono text-blue-700 mt-1 block">
                  {officersList.filter(o => o.isSuperAdmin || o.kecamatan === 'SEMUA').length} Petugas
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Merespon lintas kecamatan</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Solusi Terdistribusi
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
                  {aduanList.filter(a => a.status === 'dijawab' || a.status === 'selesai').length} Kasus
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Solusi teknis agronomi</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Manajemen Petugas
                </span>
                <button
                  onClick={() => {
                    setUserModalMode('add');
                    setUserModalRole('petugas');
                    setSelectedUser(null);
                    setUserModalOpen(true);
                  }}
                  className="mt-2 w-full py-1.5 px-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Petugas Baru</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-700" />
                    <span>Daftar Petugas Lapangan & Konsultan BPP Bondowoso</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Aparatur penyuluh pertanian lapangan (PPL), pengamat OPT, dan pakar klinis wilayah binaan kecamatan.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cari NIP, Nama Petugas, BPP..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-700/30"
                    />
                  </div>

                  <select
                    value={filterKecamatan}
                    onChange={e => setFilterKecamatan(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-700/30 cursor-pointer"
                  >
                    <option value="SEMUA">Semua Wilayah Binaan</option>
                    {DAFTAR_KECAMATAN.map(kec => (
                      <option key={kec} value={kec}>
                        {kec}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setUserModalMode('add');
                      setUserModalRole('petugas');
                      setSelectedUser(null);
                      setUserModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Petugas</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Nama Petugas & Gelar</th>
                      <th className="py-3 px-4">NIP / Username</th>
                      <th className="py-3 px-4">Wilayah Binaan (BPP)</th>
                      <th className="py-3 px-4">Kontak WhatsApp</th>
                      <th className="py-3 px-4 text-center">Solusi Dijawab</th>
                      <th className="py-3 px-4 text-right">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {displayedOfficers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Tidak ditemukan data petugas yang sesuai kriteria.
                        </td>
                      </tr>
                    ) : (
                      displayedOfficers.map(officer => {
                        const totalAnswered = aduanList.filter(
                          a => a.namaPetugas && a.namaPetugas.toLowerCase().includes(officer.name.toLowerCase().split(',')[0])
                        ).length;

                        return (
                          <tr key={officer.id || officer.username} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                                  {officer.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">{officer.name}</span>
                                  <span className="text-[11px] text-blue-700 font-medium">
                                    {officer.kelompok || 'BPP Kecamatan'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-mono font-semibold text-slate-800">{officer.nik || officer.username}</div>
                              <div className="text-[11px] text-slate-400 font-mono">@{officer.username}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                                  officer.kecamatan === 'SEMUA'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                                }`}
                              >
                                {officer.kecamatan === 'SEMUA' ? 'SELURUH KABUPATEN' : `Kecamatan ${officer.kecamatan}`}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <a
                                href={getWhatsAppLink(officer.wa, officer.name, 'koordinasi tugas klinik pertanian')}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-mono font-medium transition-colors"
                              >
                                <Phone className="w-3 h-3 text-blue-600" />
                                <span>{officer.wa}</span>
                              </a>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                {totalAnswered} Kasus
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={getWhatsAppLink(officer.wa, officer.name, 'tugas kedinasan')}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                                  title="Chat WA Petugas"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => {
                                    setSelectedUser(officer);
                                    setUserModalMode('edit');
                                    setUserModalRole('petugas');
                                    setUserModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 cursor-pointer"
                                  title="Edit Data Petugas"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: 'user',
                                      title: `Hapus petugas "${officer.name}"?`,
                                      idOrIndex: officer.id || officer.username
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                                  title="Hapus Petugas"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: DAFTAR ADMINISTRATOR                                    */}
        {/* ============================================================== */}
        {activeAdminTab === 'admin' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Administrator
                </span>
                <span className="text-2xl font-bold font-mono text-amber-900 mt-1 block">
                  {adminsList.length} Pengelola
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Akses penuh sistem Disperta</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Akun Anda Saat Ini
                </span>
                <span className="text-lg font-bold text-slate-900 mt-1 block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                  Super Administrator (Aktif)
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Tambah Administrator
                </span>
                <button
                  onClick={() => {
                    setUserModalMode('add');
                    setUserModalRole('admin');
                    setSelectedUser(null);
                    setUserModalOpen(true);
                  }}
                  className="mt-2 w-full py-1.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Administrator Baru</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Daftar Administrator Sistem Disperta Bondowoso</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pejabat dinas dan operator data sistem informasi pertanian kabupaten.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cari Username, Nama, Bidang..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-700/30"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setUserModalMode('add');
                      setUserModalRole('admin');
                      setSelectedUser(null);
                      setUserModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Admin</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Nama Administrator & Bidang</th>
                      <th className="py-3 px-4">Username & NIP</th>
                      <th className="py-3 px-4">Unit Kerja / Bidang</th>
                      <th className="py-3 px-4">Kontak WhatsApp</th>
                      <th className="py-3 px-4">Tingkat Hak Akses</th>
                      <th className="py-3 px-4 text-right">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {displayedAdmins.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Tidak ditemukan data admin.
                        </td>
                      </tr>
                    ) : (
                      displayedAdmins.map(admin => {
                        const isSelf = admin.username === currentUser.username;

                        return (
                          <tr key={admin.id || admin.username} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
                                  {admin.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{admin.name}</span>
                                    {isSelf && (
                                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                        Anda
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-500 font-mono">
                                    {admin.desa || 'Dinas Pertanian Bondowoso'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-mono font-bold text-slate-800">{admin.username}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{admin.nik || '-'}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium">
                                {admin.kelompok || 'Sekretariat Dinas'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <a
                                href={getWhatsAppLink(admin.wa, admin.name, 'koordinasi sistem informasi')}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-mono font-medium transition-colors"
                              >
                                <Phone className="w-3 h-3 text-amber-600" />
                                <span>{admin.wa}</span>
                              </a>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                <ShieldCheck className="w-3 h-3 text-amber-700" />
                                <span>Super Admin</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedUser(admin);
                                    setUserModalMode('edit');
                                    setUserModalRole('admin');
                                    setUserModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 cursor-pointer"
                                  title="Edit Admin"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                {!isSelf ? (
                                  <button
                                    onClick={() =>
                                      setDeleteConfirm({
                                        type: 'user',
                                        title: `Hapus administrator "${admin.name}"?`,
                                        idOrIndex: admin.id || admin.username
                                      })
                                    }
                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                                    title="Hapus Admin"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-slate-400 italic px-1">Terkunci</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: DAFTAR KELOMPOK TANI (POKTAN)                           */}
        {/* ============================================================== */}
        {activeAdminTab === 'poktan' && (
          <div className="space-y-4">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Kelompok Tani
                </span>
                <span className="text-2xl font-bold font-mono text-teal-900 mt-1 block">
                  {wilayahList.length} Poktan
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Terdaftar resmi di SIMLUHTAN</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Total Estimasi Lahan
                </span>
                <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
                  {totalLuasLahan.toFixed(1)} Ha
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Lahan binaan terkelola</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Estimasi Anggota Tani
                </span>
                <span className="text-2xl font-bold font-mono text-blue-900 mt-1 block">
                  {totalAnggotaTani} Petani
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Anggota terakumulasi</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Tambah Kelembagaan
                </span>
                <button
                  onClick={() => {
                    setPoktanModalMode('add');
                    setSelectedPoktan(null);
                    setSelectedPoktanIndex(undefined);
                    setPoktanModalOpen(true);
                  }}
                  className="mt-2 w-full py-1.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poktan Baru</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-700" />
                    <span>Daftar Kelompok Tani (Poktan) Binaan se-Kabupaten Bondowoso</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Basis data kelembagaan tani, komoditas unggulan (Kopi Arabika Ijen, Tembakau Kasturi, Padi Ciherang), luas hamparan, dan kontak pengurus.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cari Poktan, Desa, Ketua, Komoditas..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-700/30"
                    />
                  </div>

                  <select
                    value={filterKecamatan}
                    onChange={e => setFilterKecamatan(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-medium text-slate-700 focus:ring-2 focus:ring-teal-700/30 cursor-pointer"
                  >
                    <option value="SEMUA">Semua Kecamatan ({wilayahList.length})</option>
                    {DAFTAR_KECAMATAN.map(kec => (
                      <option key={kec} value={kec}>
                        {kec}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setPoktanModalMode('add');
                      setSelectedPoktan(null);
                      setSelectedPoktanIndex(undefined);
                      setPoktanModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Poktan</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Nama Kelompok Tani (Poktan)</th>
                      <th className="py-3 px-4">Kecamatan & Desa</th>
                      <th className="py-3 px-4">Ketua Poktan & Kontak</th>
                      <th className="py-3 px-4">Komoditas Utama</th>
                      <th className="py-3 px-4 text-center">Luas Hamparan</th>
                      <th className="py-3 px-4 text-center">Anggota</th>
                      <th className="py-3 px-4 text-right">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {displayedPoktan.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          Tidak ditemukan kelompok tani yang sesuai.
                        </td>
                      </tr>
                    ) : (
                      displayedPoktan.map((poktan, idx) => {
                        const originalIndex = wilayahList.findIndex(
                          w => w.poktan === poktan.poktan && w.desa === poktan.desa && w.kecamatan === poktan.kecamatan
                        );

                        return (
                          <tr key={poktan.id || `${poktan.poktan}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center shrink-0">
                                  <Users className="w-4 h-4 text-teal-700" />
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">{poktan.poktan}</span>
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    ID: {poktan.id || `PKT${String(idx + 1).padStart(3, '0')}`}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-800">Kec. {poktan.kecamatan}</div>
                              <div className="text-[11px] text-slate-500">Desa {poktan.desa}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-800">{poktan.ketua || 'Bpk. Ketua Poktan'}</div>
                              {poktan.kontak ? (
                                <a
                                  href={getWhatsAppLink(poktan.kontak, poktan.ketua || poktan.poktan, 'kelembagaan kelompok tani')}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono hover:underline"
                                >
                                  <Phone className="w-3 h-3 text-emerald-600" />
                                  <span>{poktan.kontak}</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-slate-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium">
                                {poktan.komoditasUtama || 'Padi & Palawija'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                {poktan.luasLahanHa ? `${poktan.luasLahanHa} Ha` : '30 Ha'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                {poktan.jumlahAnggota || 30} Orang
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {poktan.kontak && (
                                  <a
                                    href={getWhatsAppLink(poktan.kontak, poktan.ketua || poktan.poktan, 'program pembinaan poktan')}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
                                    title="Hubungi Ketua via WhatsApp"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <button
                                  onClick={() => {
                                    setSelectedPoktan(poktan);
                                    setSelectedPoktanIndex(originalIndex !== -1 ? originalIndex : idx);
                                    setPoktanModalMode('edit');
                                    setPoktanModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-50 cursor-pointer"
                                  title="Edit Kelompok Tani"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: 'poktan',
                                      title: `Hapus kelompok tani "${poktan.poktan}" di Desa ${poktan.desa}?`,
                                      idOrIndex: originalIndex !== -1 ? originalIndex : idx
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                                  title="Hapus Kelompok Tani"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: RESET PASSWORD QUEUE (Existing)                         */}
        {/* ============================================================== */}
        {activeAdminTab === 'reset' && (
          <div className="space-y-4">
            {resetFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">{resetFeedback.message}</div>
                    {resetFeedback.pass && (
                      <div className="text-[11px] text-emerald-800 mt-0.5 font-mono">
                        Password Baru: <span className="font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">{resetFeedback.pass}</span>
                      </div>
                    )}
                  </div>
                </div>

                {resetFeedback.waUrl && (
                  <a
                    href={resetFeedback.waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Buka WhatsApp Sekarang</span>
                  </a>
                )}
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200/80">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-red-600" />
                  <span>Daftar Permintaan Pemulihan Sandi Petani</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Saat disetujui, sistem membuat password baru dan menyusun pesan resmi WhatsApp otomatis ke nomor kontak terdaftar.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Waktu Pengajuan</th>
                      <th className="py-3 px-4">NIK / Username</th>
                      <th className="py-3 px-4">Nama Lengkap</th>
                      <th className="py-3 px-4">Status Pengajuan</th>
                      <th className="py-3 px-4 text-right">Tindakan Administrator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {resetList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          Tidak ada permohonan reset password saat ini.
                        </td>
                      </tr>
                    ) : (
                      resetList.map(item => (
                        <tr key={item.username} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-500">{item.waktu}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {item.username}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{item.name}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                item.status === 'Success'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.status === 'Success' ? 'Sudah Diproses' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {item.status === 'Pending' ? (
                              <button
                                onClick={() => handleApproveReset(item.username)}
                                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer active:scale-98"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                                <span>Setujui & Buat Sandi Baru</span>
                              </button>
                            ) : (
                              <span className="text-xs font-semibold text-emerald-700">
                                Selesai
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: REKAPITULASI PELAYANAN (Existing)                       */}
        {/* ============================================================== */}
        {activeAdminTab === 'rekap' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs font-semibold text-slate-500">Total Berkas Layanan</div>
                <div className="text-3xl font-bold font-mono text-slate-900 mt-1">
                  {metrics.rekapUtama.total}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Akumulasi seluruh kecamatan</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs font-semibold text-amber-600">Aduan Baru (Antrean)</div>
                <div className="text-3xl font-bold font-mono text-amber-600 mt-1">
                  {metrics.rekapUtama.baru}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Menunggu analisis lapangan</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs font-semibold text-blue-600">Telah Diberikan Solusi</div>
                <div className="text-3xl font-bold font-mono text-blue-600 mt-1">
                  {metrics.rekapUtama.dijawab}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Menunggu upload PDF realisasi</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-xs font-semibold text-emerald-600">Selesai Terlaksana</div>
                <div className="text-3xl font-bold font-mono text-emerald-600 mt-1">
                  {metrics.rekapUtama.selesai}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Dokumen PDF resmi terbit</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Rekapitulasi Berkas Masuk Per Kecamatan</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">23 Wilayah</span>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2 text-xs pr-1">
                  {sortedKecamatan.map(([kec, count]) => {
                    const pct = Math.round((count / maxKecValue) * 100);
                    return (
                      <div key={kec} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-800">Kecamatan {kec}</span>
                          <span className="font-mono font-bold text-emerald-800">{count} Berkas</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileBarChart2 className="w-4 h-4 text-blue-700" />
                    <span>Rekapitulasi Per Bidang Layanan</span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">11 Layanan</span>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2 text-xs pr-1">
                  {sortedLayanan.map(([lay, count]) => {
                    const totalCase = metrics.rekapUtama.total || 1;
                    const pct = Math.round((count / totalCase) * 100);
                    return (
                      <div key={lay} className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-800 line-clamp-1">{lay}</span>
                          <span className="font-mono font-bold text-blue-800 shrink-0 ml-2">
                            {count} Kasus ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(pct, 5)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: ANALISIS TREN (Existing)                                */}
        {/* ============================================================== */}
        {activeAdminTab === 'analisis' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                    <span>Grafik Tren Pengajuan Bulanan Seluruh Kecamatan</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Volumetrik permohonan petani terakumulasi per bulan kalender.
                  </p>
                </div>
              </div>

              <div className="pt-6 pb-2 px-4 border-b border-slate-200 flex items-end justify-around gap-2 h-64 overflow-x-auto">
                {Object.entries(metrics.trenBulanan).map(([bulan, count]) => {
                  const heightPct = Math.round((count / maxTrenValue) * 100);
                  return (
                    <div key={bulan} className="flex flex-col items-center gap-2 group min-w-[60px]">
                      <span className="text-xs font-mono font-bold text-emerald-800 group-hover:scale-110 transition-transform">
                        {count}
                      </span>
                      <div
                        className="w-10 rounded-t-xl bg-gradient-to-t from-emerald-800 to-emerald-600 group-hover:from-emerald-700 group-hover:to-emerald-500 transition-all shadow-xs"
                        style={{ height: `${Math.max(heightPct * 1.8, 16)}px` }}
                        title={`${bulan}: ${count} permohonan`}
                      />
                      <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap mt-1">
                        {bulan}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Distribusi Volume Pelayanan
                </h4>
                <div className="space-y-3 text-xs">
                  {sortedLayanan.slice(0, 5).map(([lay, count]) => {
                    const totalCase = metrics.rekapUtama.total || 1;
                    const pct = Math.round((count / totalCase) * 100);
                    return (
                      <div key={lay} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium line-clamp-1">{lay}</span>
                          <span className="font-mono font-bold text-slate-900">{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Kecamatan Paling Partisipatif
                </h4>
                <div className="space-y-3 text-xs">
                  {sortedKecamatan.slice(0, 5).map(([kec, count]) => {
                    const pct = Math.round((count / maxKecValue) * 100);
                    return (
                      <div key={kec} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">Kecamatan {kec}</span>
                          <span className="font-mono font-bold text-slate-900">{count} Aduan</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODALS                                                         */}
      {/* ============================================================== */}

      {/* User Modal (Petani / Petugas / Admin) */}
      <AdminUserModal
        isOpen={userModalOpen}
        mode={userModalMode}
        targetRole={userModalRole}
        initialData={selectedUser}
        onClose={() => setUserModalOpen(false)}
        onSave={handleSaveUser}
      />

      {/* Poktan Modal */}
      <AdminPoktanModal
        isOpen={poktanModalOpen}
        mode={poktanModalMode}
        initialData={selectedPoktan}
        index={selectedPoktanIndex}
        onClose={() => setPoktanModalOpen(false)}
        onSave={handleSavePoktan}
      />

      {/* Delete Confirmation Safeguard Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Konfirmasi Penghapusan</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {deleteConfirm.title}
            </p>
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl">
              Perhatian: Tindakan ini akan menghapus data dari penyimpanan aplikasi.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
