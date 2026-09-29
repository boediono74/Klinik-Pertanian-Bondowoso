import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, WilayahTaniItem } from '../types';
import { DAFTAR_KECAMATAN } from '../data/masterData';
import { getStoredWilayah } from '../utils/storage';
import {
  X,
  UserPlus,
  Edit3,
  Users,
  Shield,
  Briefcase,
  MapPin,
  Phone,
  Sprout,
  CheckCircle2,
  AlertCircle,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  targetRole: UserRole;
  initialData?: UserProfile | null;
  onClose: () => void;
  onSave: (user: UserProfile) => void;
}

export const AdminUserModal: React.FC<UserModalProps> = ({
  isOpen,
  mode,
  targetRole,
  initialData,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [kelompok, setKelompok] = useState('');
  const [desa, setDesa] = useState('');
  const [kecamatan, setKecamatan] = useState('BONDOWOSO');
  const [wa, setWa] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [error, setError] = useState('');

  const masterWilayah = getStoredWilayah();
  const availableDesa = Array.from(
    new Set(masterWilayah.filter(w => w.kecamatan === kecamatan).map(w => w.desa))
  ).sort();
  const availablePoktan = Array.from(
    new Set(
      masterWilayah
        .filter(w => w.kecamatan === kecamatan && (!desa || w.desa === desa))
        .map(w => w.poktan)
    )
  ).sort();

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setUsername(initialData.username || '');
      setPassword(initialData.password || '');
      setName(initialData.name || '');
      setNik(initialData.nik || '');
      setKelompok(initialData.kelompok || '');
      setDesa(initialData.desa || '');
      setKecamatan(initialData.kecamatan || 'BONDOWOSO');
      setWa(initialData.wa || '');
      setIsSuperAdmin(Boolean(initialData.isSuperAdmin));
    } else {
      setUsername('');
      setPassword('pertanian123');
      setName('');
      setNik('');
      setKelompok(targetRole === 'petani' ? 'Poktan Tani Makmur' : targetRole === 'petugas' ? 'BPP Kecamatan' : 'Sekretariat Dinas');
      setDesa('Pusat');
      setKecamatan('BONDOWOSO');
      setWa('');
      setIsSuperAdmin(targetRole === 'admin');
    }
    setError('');
  }, [initialData, mode, targetRole, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama lengkap wajib diisi.');
      return;
    }

    const effectiveUsername = username.trim() || (targetRole === 'petani' ? nik.trim() : `user_${Date.now()}`);
    if (!effectiveUsername) {
      setError('Username atau NIK wajib diisi.');
      return;
    }

    if (targetRole === 'petani' && (!nik.trim() || nik.trim().length < 8)) {
      setError('Nomor NIK Petani harus valid.');
      return;
    }

    let cleanWa = wa.trim().replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('62')) cleanWa = '0' + cleanWa.slice(2);
    else if (!cleanWa.startsWith('0') && cleanWa.length > 5) cleanWa = '0' + cleanWa;

    const userObj: UserProfile = {
      id: initialData?.id || `U_${Date.now()}`,
      username: effectiveUsername,
      password: password || initialData?.password || 'pertanian123',
      name: name.trim(),
      role: targetRole,
      nik: nik.trim() || effectiveUsername,
      kelompok: kelompok.trim() || (targetRole === 'petani' ? 'Poktan Mandiri' : 'Disperta & KP'),
      desa: desa.trim() || 'Pusat',
      kecamatan: kecamatan || 'BONDOWOSO',
      wa: cleanWa,
      isSuperAdmin: targetRole === 'admin' ? true : isSuperAdmin
    };

    onSave(userObj);
  };

  const getRoleTitle = () => {
    switch (targetRole) {
      case 'petani':
        return 'Petani';
      case 'petugas':
        return 'Petugas Lapangan / BPP';
      case 'admin':
        return 'Administrator';
    }
  };

  const getRoleColor = () => {
    switch (targetRole) {
      case 'petani':
        return 'from-emerald-950 to-emerald-800 text-emerald-400';
      case 'petugas':
        return 'from-blue-950 to-blue-800 text-blue-400';
      case 'admin':
        return 'from-amber-950 to-amber-800 text-amber-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${getRoleColor()} text-white px-6 py-5 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'add' ? `Tambah Data ${getRoleTitle()}` : `Edit Data ${getRoleTitle()}`}
              </h3>
              <p className="text-[11px] text-white/80">
                Pusat Basis Data Kepegawaian & Anggota Tani Disperta Bondowoso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={targetRole === 'petugas' ? 'Contoh: Ir. Hendra Kusuma, S.P.' : 'Contoh: Bpk. Ahmad Fauzi'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {targetRole === 'petani' ? 'NIK KTP (16 Digit)' : 'NIP / NIK Petugas'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nik}
                onChange={e => {
                  setNik(e.target.value);
                  if (targetRole === 'petani' && mode === 'add') setUsername(e.target.value);
                }}
                placeholder={targetRole === 'petani' ? '351108xxxxxxxxxx' : '198205142008011005'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Username Akun <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={targetRole === 'petani' ? 'Sama dengan NIK' : 'petugas_sukosari'}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nomor Kontak WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={wa}
                  onChange={e => setWa(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Sandi login akun"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kecamatan
              </label>
              <select
                value={kecamatan}
                onChange={e => {
                  setKecamatan(e.target.value);
                  setDesa('');
                  setKelompok('');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700/30"
              >
                {targetRole === 'petugas' && <option value="SEMUA">SEMUA KECAMATAN (KABUPATEN)</option>}
                {DAFTAR_KECAMATAN.map(kec => (
                  <option key={kec} value={kec}>
                    {kec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Desa / Kelurahan
              </label>
              {availableDesa.length > 0 ? (
                <select
                  value={desa}
                  onChange={e => setDesa(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700/30"
                >
                  <option value="">-- Pilih Desa --</option>
                  {availableDesa.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="Lainnya">Lainnya / Kantor Pusat</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={desa}
                  onChange={e => setDesa(e.target.value)}
                  placeholder="Nama Desa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {targetRole === 'petani' ? 'Kelompok Tani (Poktan)' : targetRole === 'petugas' ? 'Unit BPP / Jabatan Lapangan' : 'Bidang / Unit Kerja'}
              </label>
              {targetRole === 'petani' && availablePoktan.length > 0 ? (
                <select
                  value={kelompok}
                  onChange={e => setKelompok(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700/30"
                >
                  <option value="">-- Pilih Kelompok Tani --</option>
                  {availablePoktan.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="Petani Mandiri">Petani Mandiri / Belum Berkelompok</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={kelompok}
                  onChange={e => setKelompok(e.target.value)}
                  placeholder={
                    targetRole === 'petani'
                      ? 'Contoh: Poktan Tani Jaya 1'
                      : targetRole === 'petugas'
                      ? 'Contoh: BPP Sukosari / Koordinator Lapangan'
                      : 'Contoh: Bidang Tanaman Pangan & Hortikultura'
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
                />
              )}
            </div>

            {targetRole === 'petugas' && (
              <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chkSuper"
                  checked={isSuperAdmin}
                  onChange={e => setIsSuperAdmin(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700/30"
                />
                <label htmlFor="chkSuper" className="text-slate-700 font-semibold cursor-pointer">
                  Akses Koordinator / Super Petugas (Dapat merespon aduan seluruh kecamatan)
                </label>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{mode === 'add' ? 'Simpan Data Baru' : 'Perbarui Data'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PoktanModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: WilayahTaniItem | null;
  index?: number;
  onClose: () => void;
  onSave: (poktan: WilayahTaniItem, index?: number) => void;
}

export const AdminPoktanModal: React.FC<PoktanModalProps> = ({
  isOpen,
  mode,
  initialData,
  index,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [poktanName, setPoktanName] = useState('');
  const [kecamatan, setKecamatan] = useState('BONDOWOSO');
  const [desa, setDesa] = useState('');
  const [ketua, setKetua] = useState('');
  const [kontak, setKontak] = useState('');
  const [jumlahAnggota, setJumlahAnggota] = useState<number>(30);
  const [komoditasUtama, setKomoditasUtama] = useState('');
  const [luasLahanHa, setLuasLahanHa] = useState<number>(35);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setPoktanName(initialData.poktan || '');
      setKecamatan(initialData.kecamatan || 'BONDOWOSO');
      setDesa(initialData.desa || '');
      setKetua(initialData.ketua || '');
      setKontak(initialData.kontak || '');
      setJumlahAnggota(initialData.jumlahAnggota || 30);
      setKomoditasUtama(initialData.komoditasUtama || '');
      setLuasLahanHa(initialData.luasLahanHa || 35);
    } else {
      setPoktanName('');
      setKecamatan('BONDOWOSO');
      setDesa('');
      setKetua('');
      setKontak('');
      setJumlahAnggota(30);
      setKomoditasUtama('Padi & Jagung');
      setLuasLahanHa(40);
    }
    setError('');
  }, [initialData, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!poktanName.trim()) {
      setError('Nama Kelompok Tani wajib diisi.');
      return;
    }
    if (!desa.trim()) {
      setError('Nama Desa wajib diisi.');
      return;
    }

    let cleanWa = kontak.trim().replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('62')) cleanWa = '0' + cleanWa.slice(2);
    else if (!cleanWa.startsWith('0') && cleanWa.length > 5) cleanWa = '0' + cleanWa;

    const poktanObj: WilayahTaniItem = {
      id: initialData?.id || `PKT_${Date.now()}`,
      poktan: poktanName.trim(),
      kecamatan,
      desa: desa.trim(),
      ketua: ketua.trim() || 'Ketua Poktan',
      kontak: cleanWa,
      jumlahAnggota: Number(jumlahAnggota) || 25,
      komoditasUtama: komoditasUtama.trim() || 'Padi Sawah',
      luasLahanHa: Number(luasLahanHa) || 30
    };

    onSave(poktanObj, index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'add' ? 'Tambah Kelompok Tani (Poktan)' : 'Edit Kelompok Tani (Poktan)'}
              </h3>
              <p className="text-[11px] text-emerald-300">
                Pencatatan Kelembagaan Petani Kabupaten Bondowoso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nama Kelompok Tani (Poktan) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={poktanName}
                onChange={e => setPoktanName(e.target.value)}
                placeholder="Contoh: Poktan Kopi Arabika Java Ijen"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kecamatan <span className="text-red-500">*</span>
              </label>
              <select
                value={kecamatan}
                onChange={e => setKecamatan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700/30"
              >
                {DAFTAR_KECAMATAN.map(kec => (
                  <option key={kec} value={kec}>
                    {kec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Desa / Kelurahan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={desa}
                onChange={e => setDesa(e.target.value)}
                placeholder="Contoh: Sukorejo"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nama Ketua Kelompok Tani
              </label>
              <input
                type="text"
                value={ketua}
                onChange={e => setKetua(e.target.value)}
                placeholder="Contoh: Bpk. Ahmad Fauzi"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Kontak WhatsApp Ketua
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={kontak}
                  onChange={e => setKontak(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Komoditas Utama Lahan
              </label>
              <input
                type="text"
                value={komoditasUtama}
                onChange={e => setKomoditasUtama(e.target.value)}
                placeholder="Contoh: Kopi Arabika, Tembakau Kasturi, Padi Ciherang"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Estimasi Luas Lahan (Hektar)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={luasLahanHa}
                onChange={e => setLuasLahanHa(Number(e.target.value))}
                placeholder="Contoh: 45.5"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Jumlah Anggota Terdaftar
              </label>
              <input
                type="number"
                min="1"
                value={jumlahAnggota}
                onChange={e => setJumlahAnggota(Number(e.target.value))}
                placeholder="Contoh: 35"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{mode === 'add' ? 'Simpan Poktan Baru' : 'Perbarui Poktan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
