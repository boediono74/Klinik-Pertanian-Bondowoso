import React from 'react';
import { Sprout, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-700 flex items-center justify-center">
                <img
                  src="/logo_klinik_pertanian.png"
                  alt="Logo Klinik Pertanian Kab Bondowoso"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Klinik Pertanian Kabupaten Bondowoso
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Sistem pelayanan terpadu konsultasi budidaya tanaman, diagnosa organisme pengganggu tumbuhan (OPT), evaluasi kesuburan tanah, dan respon cepat pertanian terintegrasi Dinas Pertanian dan Ketahanan Pangan Kabupaten Bondowoso.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Layanan Resmi Pemerintah Kabupaten Bondowoso · Jawa Timur</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pelayanan Utama
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#layanan" className="hover:text-emerald-400 transition-colors">Konsultasi Tanaman</a></li>
              <li><a href="#layanan" className="hover:text-emerald-400 transition-colors">Diagnosis Hama & OPT</a></li>
              <li><a href="#layanan" className="hover:text-emerald-400 transition-colors">Pembaharuan e-RDKK</a></li>
              <li><a href="#layanan" className="hover:text-emerald-400 transition-colors">Bongkar Ratoon Tebu</a></li>
              <li><a href="#layanan" className="hover:text-emerald-400 transition-colors">Gerakan Pengendalian (GERDAL)</a></li>
            </ul>
          </div>

          {/* Institutional External */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Tautan Eksternal
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://pertanian.bondowosokab.go.id/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Portal Disperta & KP</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://bondowosokab.go.id/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Website Resmi Pemkab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://drive.google.com/file/d/1dx-Xi6h2qoIuZOmlRRGCMUDwoVoUILZ_/view?usp=drive_link"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors inline-flex items-center gap-1 font-semibold text-amber-500"
                >
                  <span>Unduh Panduan PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Dinas Pertanian dan Ketahanan Pangan Kabupaten Bondowoso. Hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-1">
            <span>Didedikasikan untuk kesejahteraan petani Republik Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
