import React, { useState, useEffect } from 'react';
import { UserProfile, ServiceItem, LayananAduan } from './types';
import {
  getStoredCurrentUser,
  setCurrentUser,
  getStoredAduan,
  getStoredUsers
} from './utils/storage';
import { SERVICES_LIST } from './data/masterData';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServiceCatalog } from './components/ServiceCatalog';
import { FormLayananModal } from './components/FormLayananModal';
import { DashboardPetani } from './components/DashboardPetani';
import { DashboardPetugas } from './components/DashboardPetugas';
import { DashboardAdmin } from './components/DashboardAdmin';
import { AuthModals } from './components/AuthModals';
import { FarmerProfileModal } from './components/FarmerProfileModal';
import { PDFReportViewerModal } from './components/PDFReportViewerModal';
import { OperatingHoursModal } from './components/OperatingHoursModal';
import { Footer } from './components/Footer';

// Icons & Visuals
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Building2,
  PhoneCall
} from 'lucide-react';

export default function App() {
  const [currentUser, setLocalCurrentUser] = useState<UserProfile | null>(() => getStoredCurrentUser());
  const [activeView, setActiveView] = useState<string>('landing');
  const [aduanList, setAduanList] = useState<LayananAduan[]>(() => getStoredAduan());

  // Modal triggers
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'forgot' | null>(null);
  const [viewFarmerUsername, setViewFarmerUsername] = useState<string | null>(null);
  const [viewPdfAduan, setViewPdfAduan] = useState<LayananAduan | null>(null);
  const [operatingHoursOpen, setOperatingHoursOpen] = useState(false);

  // Success Notification Banner
  const [notification, setNotification] = useState<{ idAduan: string; message: string } | null>(null);

  // Refresh aduan list from storage
  const handleRefreshData = () => {
    setAduanList(getStoredAduan());
  };

  // Switch User / Login
  const handleLoginSuccess = (user: UserProfile) => {
    setLocalCurrentUser(user);
    setCurrentUser(user);
    handleRefreshData();

    if (user.role === 'petani') setActiveView('dashboard-petani');
    else if (user.role === 'petugas') setActiveView('dashboard-petugas');
    else if (user.role === 'admin') setActiveView('dashboard-admin');
  };

  // Logout
  const handleLogout = () => {
    setLocalCurrentUser(null);
    setCurrentUser(null);
    setActiveView('landing');
  };

  // After form submission success
  const handleFormSuccess = (idAduan: string) => {
    setSelectedService(null);
    handleRefreshData();
    setNotification({
      idAduan,
      message: `Permohonan formulir ${idAduan} berhasil dicatat dan masuk ke antrean petugas BPP!`
    });

    // Auto open farmer dashboard if logged in as farmer
    if (currentUser?.role === 'petani') {
      setActiveView('dashboard-petani');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-emerald-700 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setAuthModal('login')}
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenOperatingHours={() => setOperatingHoursOpen(true)}
      />

      {/* Floating Success Toast / Banner */}
      {notification && (
        <div className="bg-emerald-800 text-white px-4 py-3 shadow-lg flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="font-semibold">{notification.message}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (currentUser) setActiveView('dashboard-petani');
                  else setAuthModal('login');
                  setNotification(null);
                }}
                className="font-bold underline hover:text-emerald-200 cursor-pointer text-[11px]"
              >
                Lihat di Riwayat
              </button>
              <button
                onClick={() => setNotification(null)}
                className="text-emerald-300 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1">
        {/* LANDING VIEW */}
        {activeView === 'landing' && (
          <div>
            {/* Cinematic Hero Section */}
            <HeroSection
              onOpenRegister={() => setAuthModal('register')}
              onExploreServices={() => {
                const el = document.getElementById('layanan');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onCheckStatus={() => {
                if (currentUser) {
                  if (currentUser.role === 'petani') setActiveView('dashboard-petani');
                  else if (currentUser.role === 'petugas') setActiveView('dashboard-petugas');
                  else setActiveView('dashboard-admin');
                } else {
                  setAuthModal('login');
                }
              }}
            />

            {/* 11 Primary Services Section */}
            <ServiceCatalog
              onSelectService={service => setSelectedService(service)}
            />

            {/* Institutional Information & Process Flow */}
            <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Alur Pelayanan Modern</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Mudah, Cepat, dan Transparan dalam 4 Tahap
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Klinik Pertanian Bondowoso menghubungkan petani langsung ke laboratorium tanah dan pakar proteksi tanaman di setiap Balai Penyuluhan Pertanian (BPP).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  {[
                    {
                      step: '01',
                      title: 'Pilih & Isi Formulir',
                      desc: 'Pilih dari 11 layanan spesifik, deskripsikan kendala lapangan, serta unggah foto gejala tanaman atau dokumen pendukung.'
                    },
                    {
                      step: '02',
                      title: 'Registrasi Real-Time',
                      desc: 'Sistem otomatis merekam ID registrasi aduan dan memetakan penugasan ke BPP kecamatan lokasi lahan garapan.'
                    },
                    {
                      step: '03',
                      title: 'Analisis & Verifikasi',
                      desc: 'Petugas lapangan dan konsultan agronomi menganalisis data, memberikan rekomendasi bahan aktif serta formulasi pupuk.'
                    },
                    {
                      step: '04',
                      title: 'Penerbitan Dokumen PDF',
                      desc: 'Petugas mengunggah bukti realisasi lapangan dan menerbitkan surat rekomendasi resmi berstandar Dinas Pertanian Bondowoso.'
                    }
                  ].map((s, idx) => (
                    <div
                      key={s.step}
                      className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-600/30 hover:bg-emerald-50/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-mono text-2xl font-extrabold text-emerald-800 mb-3">
                          {s.step}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">
                          {s.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Action Callout Card */}
                <div className="mt-14 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                      <Award className="w-4 h-4" />
                      <span>Pelayanan Prima Gratis Untuk Seluruh Petani Bondowoso</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Menghadapi Kendala Hama Wereng atau Butuh Konsultasi Pemupukan?
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                      Konsultasikan segera permasalahan pertanian Anda secara mandiri atau hubungi petugas lapangan BPP terdekat.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        const first = SERVICES_LIST[0];
                        setSelectedService(first);
                      }}
                      className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Mulai Konsultasi Mandiri</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setOperatingHoursOpen(true)}
                      className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Hubungi Hotline Dinas</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PETANI DASHBOARD VIEW */}
        {activeView === 'dashboard-petani' && currentUser && (
          <DashboardPetani
            currentUser={currentUser}
            aduanList={aduanList}
            onOpenNewService={() => {
              const el = document.getElementById('layanan');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else {
                setActiveView('landing');
                setTimeout(() => {
                  const target = document.getElementById('layanan');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            onViewPdf={aduan => setViewPdfAduan(aduan)}
          />
        )}

        {/* PETUGAS DASHBOARD VIEW */}
        {activeView === 'dashboard-petugas' && currentUser && (
          <DashboardPetugas
            currentUser={currentUser}
            aduanList={aduanList}
            onRefresh={handleRefreshData}
            onOpenFarmerProfile={username => setViewFarmerUsername(username)}
            onViewPdf={aduan => setViewPdfAduan(aduan)}
          />
        )}

        {/* ADMIN DASHBOARD VIEW */}
        {activeView === 'dashboard-admin' && currentUser && (
          <DashboardAdmin
            currentUser={currentUser}
            aduanList={aduanList}
            onRefresh={handleRefreshData}
            onOpenFarmerProfile={username => setViewFarmerUsername(username)}
          />
        )}
      </main>

      {/* Global Modals */}
      {/* 1. Form Service Modal */}
      <FormLayananModal
        service={selectedService}
        currentUser={currentUser}
        onClose={() => setSelectedService(null)}
        onSuccess={handleFormSuccess}
        onOpenLogin={() => setAuthModal('login')}
      />

      {/* 2. Authentication Modals (Login, Register, Forgot Password) */}
      <AuthModals
        modalType={authModal}
        onClose={() => setAuthModal(null)}
        onLoginSuccess={handleLoginSuccess}
        onOpenModal={type => setAuthModal(type)}
      />

      {/* 3. Farmer Profile Modal with WhatsApp Link */}
      <FarmerProfileModal
        username={viewFarmerUsername}
        onClose={() => setViewFarmerUsername(null)}
      />

      {/* 4. Formal Official PDF Report Certificate Viewer */}
      <PDFReportViewerModal
        aduan={viewPdfAduan}
        onClose={() => setViewPdfAduan(null)}
      />

      {/* 5. Operating Hours Modal */}
      {operatingHoursOpen && (
        <OperatingHoursModal onClose={() => setOperatingHoursOpen(false)} />
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
