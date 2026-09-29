import React, { useState } from 'react';
import { ServiceItem } from '../types';
import { SERVICES_LIST } from '../data/masterData';
import {
  MessageSquareText,
  GraduationCap,
  TrendingUp,
  ClipboardCheck,
  Users,
  Bug,
  Layers,
  Droplets,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

interface ServiceCatalogProps {
  onSelectService: (service: ServiceItem) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({ onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Layanan (11)' },
    { id: 'Agronomi', label: 'Agronomi & Budidaya' },
    { id: 'Proteksi Tanaman', label: 'Proteksi OPT & Lab' },
    { id: 'Legalitas & Subsidi', label: 'Subsidi & Pupuk' },
    { id: 'Mitigasi Risiko', label: 'Asuransi & Darurat' },
    { id: 'Perkebunan Unggulan', label: 'Tebu & Kopi' }
  ];

  const filteredServices = selectedCategory === 'all'
    ? SERVICES_LIST
    : SERVICES_LIST.filter(s => {
        if (selectedCategory === 'Proteksi Tanaman') {
          return s.category === 'Proteksi Tanaman' || s.category === 'Laboratorium Tanah' || s.category === 'Aksi Darurat';
        }
        if (selectedCategory === 'Legalitas & Subsidi') {
          return s.category === 'Legalitas & Subsidi' || s.category === 'Sosial Petani' || s.category === 'Manajemen Hara';
        }
        if (selectedCategory === 'Mitigasi Risiko') {
          return s.category === 'Mitigasi Risiko' || s.category === 'Aksi Darurat';
        }
        return s.category === selectedCategory;
      });

  const getIcon = (iconName: string) => {
    const props = { className: "w-5 h-5" };
    switch (iconName) {
      case 'MessageSquareText': return <MessageSquareText {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'ClipboardCheck': return <ClipboardCheck {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Bug': return <Bug {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Droplets': return <Droplets {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      default: return <MessageSquareText {...props} />;
    }
  };

  return (
    <section id="layanan" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Standar Pelayanan Publik Mandiri</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              11 Layanan Utama Klinik Pertanian
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Pilih layanan sesuai kendala budidaya di lahan Anda. Formulir dilengkapi panduan pengisian teknis dan fasilitas unggah berkas pendukung.
            </p>
          </div>

          {/* Interactive Category Filter Tabs (Zero-Pill compliant segmented button controls) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto max-w-full">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 11 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map(service => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-600/40 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Header row with editorial number and category badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-emerald-700 transition-colors">
                    {service.number}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <span>{service.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-semibold">{service.badge}</span>
                  </div>
                </div>

                {/* Service Icon and Title */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className={`p-2.5 rounded-xl ${service.accentBg} group-hover:scale-110 transition-transform`}>
                    {getIcon(service.icon)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs font-medium text-emerald-700/80">
                      {service.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>

              {/* Action Trigger Foot */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-950">
                <span>Isi Formulir Layanan</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
