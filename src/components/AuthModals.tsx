import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  getStoredUsers,
  saveUsers,
  getStoredWilayah,
  getStoredResets,
  saveResets,
  getFormattedNow
} from '../utils/storage';
import {
  X,
  LogIn,
  UserPlus,
  KeyRound,
  ShieldCheck,
  Briefcase,
  User,
  AlertCircle,
  CheckCircle2,
  Lock,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalsProps {
  modalType: 'login' | 'register' | 'forgot' | null;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onOpenModal: (type: 'login' | 'register' | 'forgot') => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  modalType,
  onClose,
  onLoginSuccess,
  onOpenModal
}) => {
  if (!modalType) return null;

  // Login states
  const [loginRole, setLoginRole] = useState<UserRole>('petani');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register states
  const [regNik, setRegNik] = useState('');
  const [regName, setRegName] = useState('');
  const [regWa, setRegWa] = useState('');
  const [regKecamatan, setRegKecamatan] = useState('');
  const [regDesa, setRegDesa] = useState('');
  const [regPoktan, setRegPoktan] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Forgot password states
  const [forgotNik, setForgotNik] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Master Wilayah
  const masterWilayah = getStoredWilayah();
  const kecamatanList = Array.from(new Set(masterWilayah.map(w => w.kecamatan))).sort();
  const desaList = regKecamatan
    ? Array.from(new Set(masterWilayah.filter(w => w.kecamatan === regKecamatan).map(w => w.desa))).sort()
    : [];
  const poktanList = regKecamatan && regDesa
    ? Array.from(
        new Set(
          masterWilayah
            .filter(w => w.kecamatan === regKecamatan && w.desa === regDesa)
            .map(w => w.poktan)
        )
      ).sort()
    : [];

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const users = getStoredUsers();
    const user = users.find(
      u =>
        (u.username === loginUsername.trim() || u.nik === loginUsername.trim()) &&
        u.password === loginPassword.trim()
    );

    if (!user) {
      setLoginError('Username / NIK atau Password yang Anda masukkan tidak cocok.');
      return;
    }

    if (user.role !== loginRole && !user.isSuperAdmin) {
      setLoginError(`Hak akses akun tidak sesuai. Akun ini terdaftar sebagai role "${user.role}".`);
      return;
    }

    onLoginSuccess(user);
    onClose();
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regNik.length < 10) {
      setRegError('Nomor NIK KTP harus valid (minimal 10-16 digit).');
      return;
    }

    const users = getStoredUsers();
    if (users.some(u => u.nik === regNik.trim() || u.username === regNik.trim())) {
      setRegError('NIK tersebut sudah terdaftar di sistem. Silakan langsung masuk atau gunakan menu Lupa Password.');
      return;
    }

    const newId = `U${String(users.length + 1).padStart(3, '0')}`;
    const newUser: UserProfile = {
      id: newId,
      username: regNik.trim(),
      password: regPassword,
      name: regName.trim(),
      role: 'petani',
      nik: regNik.trim(),
      kelompok: regPoktan || 'Poktan Mandiri',
      desa: regDesa || 'Pusat',
      kecamatan: regKecamatan || 'SUKOSARI',
      wa: regWa.trim()
    };

    saveUsers([...users, newUser]);
    setRegSuccess(true);
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 1200);
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);

    const users = getStoredUsers();
    const user = users.find(u => u.username === forgotNik.trim() || u.nik === forgotNik.trim());

    if (!user) {
      setForgotMsg({
        type: 'error',
        text: 'NIK tersebut tidak terdaftar di database klinik.'
      });
      return;
    }

    const resets = getStoredResets();
    const newReset = {
      username: user.username,
      name: user.name,
      noWa: user.wa,
      kecamatan: user.kecamatan,
      status: 'Pending' as const,
      waktu: getFormattedNow()
    };

    saveResets([newReset, ...resets]);
    setForgotMsg({
      type: 'success',
      text: 'Permintaan reset berhasil dikirim ke Admin. Password baru akan dikonfirmasi via WhatsApp terdaftar Anda.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white block leading-tight">
                {modalType === 'login' && 'Masuk Panel Pelayanan'}
                {modalType === 'register' && 'Registrasi Akun Petani'}
                {modalType === 'forgot' && 'Pemulihan Kata Sandi'}
              </span>
              <span className="text-[10px] text-emerald-300">Klinik Pertanian Kab. Bondowoso</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOGIN MODAL */}
        {modalType === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Official Guidance Notice */}
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 text-xs text-emerald-950 flex items-start gap-2.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-bold text-emerald-900">Portal Pelayanan Publik Resmi</div>
                <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                  Gunakan 16 digit NIK KTP Anda untuk akun Petani, atau kredensial NIP/Username penugasan resmi untuk Petugas PPL & Administrator Dinas.
                </p>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Peran Hak Akses:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'petani', label: 'Petani (NIK)' },
                  { id: 'petugas', label: 'Petugas' },
                  { id: 'admin', label: 'Admin' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setLoginRole(r.id as UserRole)}
                    className={`py-2 px-1 text-center font-bold rounded-xl border text-[11px] transition-all cursor-pointer ${
                      loginRole === r.id
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {loginRole === 'petani' ? 'Nomor Induk Kependudukan (NIK KTP)' : 'Username Petugas / Admin'}
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                placeholder={loginRole === 'petani' ? 'Masukkan 16 digit NIK KTP Anda' : 'Masukkan username resmi'}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700/30"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => onOpenModal('forgot')}
                  className="text-emerald-800 hover:underline text-[11px] font-semibold cursor-pointer"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Aplikasi</span>
            </button>

            <div className="pt-2 text-center text-slate-500 text-xs">
              Belum memiliki akun petani?{' '}
              <button
                type="button"
                onClick={() => onOpenModal('register')}
                className="text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                Daftar Akun Petani
              </button>
            </div>
          </form>
        )}

        {/* REGISTER MODAL */}
        {modalType === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
            {regError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}
            {regSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Registrasi berhasil! Mengalihkan ke panel petani...</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">NIK KTP (16 Digit):</label>
              <input
                type="number"
                required
                value={regNik}
                onChange={e => setRegNik(e.target.value)}
                placeholder="Contoh: 3511081504820001"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Sesuai KTP:</label>
              <input
                type="text"
                required
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="Nama lengkap petani"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif:</label>
              <input
                type="tel"
                required
                value={regWa}
                onChange={e => setRegWa(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            {/* Cascading Wilayah */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kecamatan:</label>
                <select
                  required
                  value={regKecamatan}
                  onChange={e => {
                    setRegKecamatan(e.target.value);
                    setRegDesa('');
                    setRegPoktan('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                >
                  <option value="">Pilih Kecamatan...</option>
                  {kecamatanList.map(kec => (
                    <option key={kec} value={kec}>
                      {kec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Desa:</label>
                <select
                  required
                  disabled={!regKecamatan}
                  value={regDesa}
                  onChange={e => {
                    setRegDesa(e.target.value);
                    setRegPoktan('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs disabled:bg-slate-100"
                >
                  <option value="">Pilih Desa...</option>
                  {desaList.map(desa => (
                    <option key={desa} value={desa}>
                      {desa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kelompok Tani (Poktan):</label>
              <select
                required
                disabled={!regDesa}
                value={regPoktan}
                onChange={e => setRegPoktan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs disabled:bg-slate-100"
              >
                <option value="">Pilih Kelompok Tani...</option>
                {poktanList.map(pok => (
                  <option key={pok} value={pok}>
                    {pok}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password Baru:</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftarkan Akun Mandiri</span>
            </button>

            <div className="text-center text-slate-500 pt-1">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => onOpenModal('login')}
                className="text-emerald-800 font-bold hover:underline cursor-pointer"
              >
                Masuk di sini
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD MODAL */}
        {modalType === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="p-6 space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Masukkan NIK Anda yang terdaftar di sistem. Permintaan reset akan masuk ke antrean Admin Dinas dan tautan password baru dikirimkan via WhatsApp Anda.
            </p>

            {forgotMsg && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 ${
                  forgotMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {forgotMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{forgotMsg.text}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">NIK Terdaftar:</label>
              <input
                type="text"
                required
                value={forgotNik}
                onChange={e => setForgotNik(e.target.value)}
                placeholder="16 digit NIK KTP Anda"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Kirim Permintaan Pemulihan</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => onOpenModal('login')}
                className="text-emerald-800 font-semibold hover:underline"
              >
                Kembali ke Form Masuk
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
