import React from 'react';
import { UserProfile, LayananAduan } from '../types';
import { getStoredUsers, getStoredAduan } from '../utils/storage';
import {
  X,
  User,
  MapPin,
  Users,
  MessageCircle,
  FileText,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface FarmerProfileModalProps {
  username: string | null;
  onClose: () => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({ username, onClose }) => {
  if (!username) return null;

  const users = getStoredUsers();
  const aduanList = getStoredAduan();

  const farmer = users.find(u => u.username === username || u.nik === username) || {
    id: 'U_AUTO',
    username,
    name: 'Petani Terdaftar',
    role: 'petani' as const,
    nik: username,
    kelompok: 'Kelompok Tani Wilayah',
    desa: 'Desa Binaan',
    kecamatan: 'BONDOWOSO',
    wa: '081234567890',
    password: ''
  };

  const farmerAduan = aduanList.filter(
    a => a.username === username || a.namaPetani.toLowerCase().includes(farmer.name.toLowerCase())
  );

  let cleanWa = (farmer.wa || '').replace(/[^0-9]/g, '');
  if (cleanWa.startsWith('0')) cleanWa = '62' + cleanWa.slice(1);
  else if (cleanWa.startsWith('8')) cleanWa = '62' + cleanWa;

  const waLink = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    `Halo Bpk/Ibu ${farmer.name}, kami dari Tim Petugas Klinik Pertanian Disperta & KP Kabupaten Bondowoso.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Profil Petani Terdaftar</h3>
              <p className="text-[11px] text-emerald-300 font-mono">NIK: {farmer.nik || farmer.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Lengkap</span>
              <span className="text-sm font-bold text-slate-900">{farmer.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kecamatan</span>
                <span className="font-semibold text-slate-800">{farmer.kecamatan}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Desa</span>
                <span className="font-semibold text-slate-800">{farmer.desa || '-'}</span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Kelompok Tani</span>
              <span className="font-semibold text-emerald-800">{farmer.kelompok || 'Petani Mandiri'}</span>
            </div>

            <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kontak WhatsApp</span>
                <span className="font-mono font-bold text-slate-900">{farmer.wa || '-'}</span>
              </div>

              {farmer.wa && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Recent History */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Riwayat Pengajuan ({farmerAduan.length})</span>
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1.5">
              {farmerAduan.length === 0 ? (
                <div className="text-slate-400 text-center py-4 italic">Belum ada riwayat berkas</div>
              ) : (
                farmerAduan.map(a => (
                  <div key={a.idAduan} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{a.layanan}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{a.waktu}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
