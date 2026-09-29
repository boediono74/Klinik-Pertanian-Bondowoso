import React from 'react';
import {
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  UserPlus,
  Compass,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface HeroSectionProps {
  onOpenRegister: () => void;
  onExploreServices: () => void;
  onCheckStatus: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenRegister,
  onExploreServices,
  onCheckStatus
}) => {
  // Check if clinic is currently open (WIB time)
  const isOperatingNow = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
    const hours = now.getHours();
    if (day >= 1 && day <= 4) {
      return hours >= 8 && hours < 16;
    } else if (day === 5) {
      return hours >= 8 && hours < 11;
    }
    return false;
  };

  const isOpen = isOperatingNow();

  return (
    <div className="relative overflow-hidden bg-emerald-950 text-white border-b border-emerald-900">
      {/* Background Image with Measured Scrim for WCAG AAA legibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/bondowoso_agriculture_landscape_1790554018559.jpg"
          alt="Lanskap Pertanian Kabupaten Bondowoso dan Lereng Gunung Ijen"
          className="w-full h-full object-cover object-center transform scale-105 motion-safe:animate-subtle-zoom"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/85 to-emerald-950/60" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-emerald-950/40 to-emerald-950/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-emerald-900/80 border border-emerald-600/50 backdrop-blur-md text-xs font-semibold text-emerald-100 shadow-md">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian"
                className="w-5 h-5 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-amber-300">KLINIK PERTANIAN</span>
              <span className="text-emerald-400">·</span>
              <span>Disperta & KP Kabupaten Bondowoso</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Layanan & Solusi Terpadu Pertanian Unggul Bondowoso
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 font-normal leading-relaxed max-w-2xl">
              Pusat konsultasi klinis tanaman, diagnosis serangan OPT, rekomendasi pemupukan presisi,
              serta pendampingan terintegrasi bagi kelompok tani dan petani mandiri di 23 kecamatan.
            </p>

            {/* Quick Proof Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-emerald-200/90 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>23 Kecamatan Terhubung</span>
              </span>
              <span className="text-emerald-700">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>11 Layanan Gratis untuk Petani</span>
              </span>
              <span className="text-emerald-700">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Dokumen PDF Pelaksanaan Resmi</span>
              </span>
            </div>

            {/* Call To Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={onExploreServices}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Compass className="w-4 h-4" />
                <span>Jelajahi 11 Layanan</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenRegister}
                className="px-5 py-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/50 text-white font-semibold text-sm backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-300" />
                <span>Registrasi Akun Petani</span>
              </button>

              <button
                onClick={onCheckStatus}
                className="px-4 py-3 rounded-xl text-emerald-200 hover:text-white font-medium text-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Pantau Aduan Saya</span>
              </button>
            </div>
          </div>

          {/* Right Card: Operating Schedule & Institutional Guarantee */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl text-white space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/60 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Jam Operasional Pelayanan</h2>
                    <p className="text-[11px] text-emerald-200/80">Klinik Pertanian Kabupaten Bondowoso</p>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                  isOpen ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isOpen ? 'Sedang Buka' : 'Di Luar Jam Kerja'}</span>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="space-y-2.5 text-xs text-emerald-100/90 font-mono">
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="font-sans text-slate-300">Senin – Kamis</span>
                  <span className="font-semibold text-white">08:00 – 16:00 WIB</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                  <span className="font-sans text-slate-300">Jumat</span>
                  <span className="font-semibold text-white">08:00 – 11:00 WIB</span>
                </div>
                <div className="flex justify-between items-center py-1.5 text-rose-300">
                  <span className="font-sans">Sabtu, Minggu & Libur Nasional</span>
                  <span className="font-semibold">Tutup</span>
                </div>
              </div>

              {/* Quick Notice */}
              <div className="rounded-xl bg-emerald-900/60 border border-emerald-700/40 p-3 text-xs text-emerald-200/90 flex items-start gap-2.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Pengajuan formulir aduan online tetap dapat dikirim 24 jam. Respon petugas lapangan dan penerbitan berkas diverifikasi pada hari kerja aktif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
