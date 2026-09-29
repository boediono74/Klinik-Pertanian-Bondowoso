import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Briefcase,
  Sprout,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenOperatingHours?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  activeView,
  setActiveView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigate to portal dashboard based on user role
  const handleGoToPortal = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }

    if (currentUser.role === 'petani') {
      setActiveView('dashboard-petani');
    } else if (currentUser.role === 'petugas') {
      setActiveView('dashboard-petugas');
    } else if (currentUser.role === 'admin') {
      setActiveView('dashboard-admin');
    }
  };

  const isPortalActive = activeView.startsWith('dashboard');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 text-left group transition-transform focus:outline-hidden cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-emerald-800/10 shadow-sm flex items-center justify-center group-hover:scale-105 transition-all">
                <img
                  src="/logo_klinik_pertanian.png"
                  alt="Logo Klinik Pertanian Kab Bondowoso"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-emerald-950 block leading-tight">
                  Klinik Pertanian Bondowoso
                </span>
                <span className="text-[11px] font-medium text-emerald-700/80 block">
                  Dinas Pertanian & Ketahanan Pangan
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Menu: Strictly "Beranda" & "Masuk Portal" */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {/* 1. Beranda */}
            <button
              onClick={() => {
                setActiveView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeView === 'landing'
                  ? 'text-emerald-950 font-bold bg-emerald-50/80'
                  : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>

            {/* 2. Masuk Portal */}
            <button
              onClick={handleGoToPortal}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-98 ${
                isPortalActive
                  ? 'bg-emerald-900 text-white shadow-emerald-900/20'
                  : currentUser
                  ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/15'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/15'
              }`}
            >
              {currentUser ? (
                <>
                  <LayoutDashboard className="w-4 h-4 text-emerald-300" />
                  <span>
                    Masuk Portal ({currentUser.role === 'petani' ? 'Petani' : currentUser.role === 'petugas' ? 'Petugas' : 'Admin'})
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk Portal</span>
                </>
              )}
            </button>

            {/* Logged in User Profile & Logout */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={handleGoToPortal}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
                  title="Masuk ke Panel Portal Anda"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="truncate max-w-[120px]">{currentUser.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Keluar dari akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={handleGoToPortal}
              className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Portal</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer: Strictly "Beranda" & "Masuk Portal" */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-sm shadow-lg animate-in fade-in slide-in-from-top-2">
          {/* Beranda */}
          <button
            onClick={() => {
              setActiveView('landing');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`block w-full text-left py-2.5 px-3 rounded-xl font-bold transition-colors ${
              activeView === 'landing' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Beranda
          </button>

          {/* Masuk Portal */}
          <button
            onClick={() => {
              handleGoToPortal();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl font-bold text-left text-white bg-emerald-800 hover:bg-emerald-900 flex items-center gap-2 transition-colors"
          >
            {currentUser ? (
              <>
                <LayoutDashboard className="w-4 h-4 text-emerald-300" />
                <span>
                  Masuk Portal ({currentUser.role === 'petani' ? 'Petani' : currentUser.role === 'petugas' ? 'Petugas' : 'Admin'})
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Masuk Portal</span>
              </>
            )}
          </button>

          {/* Logout if logged in */}
          {currentUser && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-1">
              <div>
                <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">{currentUser.role}</div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold transition-colors"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
