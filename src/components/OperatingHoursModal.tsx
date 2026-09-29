import React from 'react';
import {
  X,
  Clock,
  Phone,
  Building,
  Calendar,
  AlertCircle,
  ExternalLink,
  MapPin
} from 'lucide-react';

interface OperatingHoursModalProps {
  onClose: () => void;
}

export const OperatingHoursModal: React.FC<OperatingHoursModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
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
              <h3 className="text-base font-bold text-white">Jam Operasional & Kontak Klinik</h3>
              <p className="text-[11px] text-emerald-300">Dinas Pertanian dan Ketahanan Pangan Kab. Bondowoso</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Schedule Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 text-xs block">
              Jadwal Pelayanan Tatap Muka & Bimbingan Lapang:
            </span>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="font-sans font-semibold text-slate-700">Senin – Kamis</span>
                <span className="font-bold text-emerald-800">08:00 – 16:00 WIB</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                <span className="font-sans font-semibold text-slate-700">Jumat</span>
                <span className="font-bold text-emerald-800">08:00 – 11:00 WIB</span>
              </div>
              <div className="flex justify-between items-center py-1.5 text-rose-700">
                <span className="font-sans font-semibold">Sabtu, Minggu & Hari Libur</span>
                <span className="font-bold">Libur Pelayanan Kantor</span>
              </div>
            </div>
          </div>

          {/* Electronic Submission Note */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              <strong>Layanan Formulir Daring:</strong> Pengiriman formulir aduan online dapat dilakukan 24 jam setiap hari. Notifikasi verifikasi dan respon teknis diproses petugas pada hari dan jam kerja operasional aktif.
            </p>
          </div>

          {/* Office Contact Info */}
          <div className="space-y-2.5 pt-1">
            <span className="font-bold text-slate-800 block">Informasi Kantor & Narahubung:</span>

            <div className="flex items-start gap-2.5 text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>Jl. Diponegoro No. 123, Kabupaten Bondowoso, Jawa Timur 68211</span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-600">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Hotline Pengaduan Tani: 0812-3456-7890 / (0332) 421234</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href="https://pertanian.bondowosokab.go.id/"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-800 font-bold hover:underline flex items-center gap-1"
            >
              <span>Kunjungi Portal Resmi Pemkab</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
