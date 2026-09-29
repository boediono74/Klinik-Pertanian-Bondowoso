import React, { useState } from 'react';
import { UserProfile, LayananAduan } from '../types';
import { FormattedRincian } from './FormattedRincian';
import {
  Bell,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  PlusCircle,
  ExternalLink,
  Search,
  MessageCircle,
  Sparkles,
  MapPin
} from 'lucide-react';

interface DashboardPetaniProps {
  currentUser: UserProfile;
  aduanList: LayananAduan[];
  onOpenNewService: () => void;
  onViewPdf: (aduan: LayananAduan) => void;
}

export const DashboardPetani: React.FC<DashboardPetaniProps> = ({
  currentUser,
  aduanList,
  onOpenNewService,
  onViewPdf
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter only aduan submitted by this farmer (by username / NIK or user id)
  const myAduan = aduanList.filter(item => {
    const isOwner =
      item.username === currentUser.username ||
      item.username === currentUser.nik ||
      item.namaPetani.toLowerCase().includes(currentUser.name.toLowerCase());
    if (!isOwner) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.idAduan.toLowerCase().includes(q) ||
      item.layanan.toLowerCase().includes(q) ||
      item.rincian.toLowerCase().includes(q) ||
      (item.jawaban && item.jawaban.toLowerCase().includes(q))
    );
  });

  const totalMyAduan = myAduan.length;
  const totalSelesai = myAduan.filter(a => a.status === 'selesai').length;
  const totalDijawab = myAduan.filter(a => a.status === 'dijawab').length;
  const totalBaru = myAduan.filter(a => a.status === 'baru').length;

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 p-2 shrink-0 flex items-center justify-center shadow-xs">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Portal Mandiri Petani Bondowoso</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Selamat Datang, {currentUser.name}
              </h1>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 font-medium">
                <span>NIK: <span className="font-mono text-slate-700 font-bold">{currentUser.nik || currentUser.username}</span></span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Kec. {currentUser.kecamatan || 'SUKOSARI'}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.kelompok || 'Poktan Mandiri'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewService}
              className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajukan Layanan Baru</span>
            </button>
          </div>
        </div>

        {/* Quick Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="text-xs font-medium text-slate-500">Total Pengajuan</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalMyAduan}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="text-xs font-medium text-slate-500">Menunggu Tindak Lanjut</div>
            <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{totalBaru}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="text-xs font-medium text-slate-500">Telah Diberikan Solusi</div>
            <div className="text-2xl font-bold font-mono text-blue-600 mt-1">{totalDijawab}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <div className="text-xs font-medium text-slate-500">Selesai & Ada Bukti PDF</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">{totalSelesai}</div>
          </div>
        </div>

        {/* Search & List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                Riwayat Konsultasi & Respon Lapangan Resmi
              </h2>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari ID aduan, jenis layanan..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100">
            {myAduan.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-800">Belum Ada Riwayat Konsultasi</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Anda belum mengajukan aduan atau formulir layanan. Klik tombol di bawah untuk memulai konsultasi teknis pertama Anda.
                </p>
                <button
                  onClick={onOpenNewService}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-bold hover:bg-emerald-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Pilih Dari 11 Layanan</span>
                </button>
              </div>
            ) : (
              myAduan.map(item => {
                const isExpanded = expandedId === item.idAduan;
                return (
                  <div key={item.idAduan} className="p-5 hover:bg-slate-50/70 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {item.idAduan}
                          </span>
                          <span className="text-xs font-bold text-emerald-800">
                            {item.layanan}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-xs font-mono text-slate-500">{item.waktu}</span>
                        </div>
                        <div className="pt-1 max-w-xl">
                          <FormattedRincian rincian={item.rincian} variant="compact" />
                        </div>
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === 'selesai' && (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Selesai Terlaksana</span>
                          </span>
                        )}
                        {item.status === 'dijawab' && (
                          <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5 text-blue-700" />
                            <span>Telah Dijawab</span>
                          </span>
                        )}
                        {item.status === 'baru' && (
                          <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Dalam Antrean Analisis</span>
                          </span>
                        )}

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.idAduan)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                        >
                          <span>{isExpanded ? 'Tutup' : 'Rincian'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200/70 space-y-4 animate-in fade-in duration-150">
                        {/* Farmer's Request */}
                        <div className="space-y-2">
                          <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-emerald-700" />
                            <span>Rincian Isian Formulir & Parameter Lapangan:</span>
                          </div>
                          <FormattedRincian rincian={item.rincian} variant="card" />

                          {/* Uploaded Attachments */}
                          {(item.fileKTP || item.fileSerangan || item.fileSPPT || item.fileLahan) && (
                            <div className="pt-2">
                              <span className="font-semibold text-slate-600 block mb-1">
                                Dokumen & Foto Lapangan yang Dilampirkan:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {item.fileKTP && (
                                  <a
                                    href={item.fileKTP}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 bg-white rounded-md border border-slate-300 text-slate-700 hover:border-emerald-600 font-medium inline-flex items-center gap-1 text-[11px]"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Lihat Foto KTP</span>
                                  </a>
                                )}
                                {item.fileSerangan && (
                                  <a
                                    href={item.fileSerangan}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 bg-white rounded-md border border-slate-300 text-slate-700 hover:border-emerald-600 font-medium inline-flex items-center gap-1 text-[11px]"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Lihat Foto Tanaman/OPT</span>
                                  </a>
                                )}
                                {item.fileSPPT && (
                                  <a
                                    href={item.fileSPPT}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 bg-white rounded-md border border-slate-300 text-slate-700 hover:border-emerald-600 font-medium inline-flex items-center gap-1 text-[11px]"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Lihat SPPT/Lahan</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Official Officer Response */}
                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-700" />
                              <span className="font-bold text-emerald-950">
                                Rekomendasi Solusi & Verifikasi Lapangan Petugas:
                              </span>
                            </div>
                            {item.waktuDijawab && (
                              <span className="text-[11px] text-emerald-700 font-mono">
                                Dijawab: {item.waktuDijawab}
                              </span>
                            )}
                          </div>

                          {item.jawaban ? (
                            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-slate-800 leading-relaxed font-sans shadow-2xs">
                              {item.jawaban}
                              {item.namaPetugas && (
                                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-emerald-800">
                                  Konsultan / Petugas Verifikator: {item.namaPetugas}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-3 bg-white/60 rounded-xl border border-dashed border-emerald-300 text-slate-500 italic">
                              Aduan Anda telah masuk ke sistem antrean BPP Kecamatan {item.kecamatan}. Petugas lapangan kami sedang meneliti parameter teknis dan segera mengirimkan diagnosa solusi.
                            </div>
                          )}

                          {/* PDF Report Download Button */}
                          {item.filePelaksanaan && (
                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-emerald-200">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-xs">
                                    Dokumen Resmi Pelaksanaan Kegiatan (PDF)
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    Berita Acara / Sertifikat Pelayanan Disperta Bondowoso
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => onViewPdf(item)}
                                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Buka & Unduh Berkas PDF</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
