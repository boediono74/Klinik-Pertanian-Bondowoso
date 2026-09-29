import React, { useState } from 'react';
import { UserProfile, LayananAduan } from '../types';
import { DAFTAR_KECAMATAN } from '../data/masterData';
import { submitOfficerAnswer, submitOfficerPdf } from '../utils/storage';
import { FormattedRincian } from './FormattedRincian';
import {
  Briefcase,
  Filter,
  Search,
  Hourglass,
  CheckCircle2,
  FileText,
  Upload,
  User,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Phone,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface DashboardPetugasProps {
  currentUser: UserProfile;
  aduanList: LayananAduan[];
  onRefresh: () => void;
  onOpenFarmerProfile: (username: string) => void;
  onViewPdf: (aduan: LayananAduan) => void;
}

export const DashboardPetugas: React.FC<DashboardPetugasProps> = ({
  currentUser,
  aduanList,
  onRefresh,
  onOpenFarmerProfile,
  onViewPdf
}) => {
  // District filter: if officer is assigned to a specific district (and not SEMUA), default to it
  const isAssignedSpecific = Boolean(
    currentUser.kecamatan &&
    currentUser.kecamatan.toUpperCase() !== 'SEMUA' &&
    currentUser.kecamatan.toUpperCase() !== 'ALL' &&
    !currentUser.isSuperAdmin
  );

  const [selectedKecamatan, setSelectedKecamatan] = useState<string>(
    isAssignedSpecific ? currentUser.kecamatan.toUpperCase() : ''
  );
  const [activeTab, setActiveTab] = useState<'pending' | 'selesai'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // clean pagination

  // Modal Action state
  const [selectedAduan, setSelectedAduan] = useState<LayananAduan | null>(null);
  const [jawabanInput, setJawabanInput] = useState('');
  const [pdfFileInput, setPdfFileInput] = useState<File | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter list
  const filteredList = aduanList.filter(item => {
    // District filter
    if (selectedKecamatan && selectedKecamatan !== 'SEMUA') {
      if (item.kecamatan.toUpperCase() !== selectedKecamatan.toUpperCase()) return false;
    }

    // Tab filter
    const isCompleted = Boolean(item.filePelaksanaan && item.filePelaksanaan.trim() !== '');
    if (activeTab === 'pending' && isCompleted) return false;
    if (activeTab === 'selesai' && !isCompleted) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.idAduan.toLowerCase().includes(q) ||
        item.namaPetani.toLowerCase().includes(q) ||
        item.username.toLowerCase().includes(q) ||
        item.layanan.toLowerCase().includes(q) ||
        item.rincian.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Pagination calculation
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedItems = filteredList.slice(startIndex, startIndex + itemsPerPage);

  // Handle open action modal
  const handleOpenActionModal = (aduan: LayananAduan) => {
    setSelectedAduan(aduan);
    setJawabanInput(aduan.jawaban || '');
    setPdfFileInput(null);
    setActionFeedback(null);
  };

  // Submit Answer Step
  const handleSaveAnswer = () => {
    if (!selectedAduan || !jawabanInput.trim()) {
      setActionFeedback({ type: 'error', message: 'Harap ketik jawaban solusi teknis terlebih dahulu.' });
      return;
    }

    setIsProcessing(true);
    const success = submitOfficerAnswer(selectedAduan.idAduan, jawabanInput, currentUser.name);
    setIsProcessing(false);

    if (success) {
      setActionFeedback({
        type: 'success',
        message: 'Jawaban dan rekomendasi awal berhasil disimpan ke database klinik!'
      });
      onRefresh();
    } else {
      setActionFeedback({ type: 'error', message: 'Gagal memperbarui status aduan.' });
    }
  };

  // Submit PDF Step
  const handleUploadPdf = () => {
    if (!selectedAduan) return;
    if (!pdfFileInput) {
      setActionFeedback({
        type: 'error',
        message: 'Silakan pilih berkas dokumen PDF pelaksanaan kegiatan terlebih dahulu.'
      });
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = () => {
      const pdfDataUrl = (reader.result as string) || URL.createObjectURL(pdfFileInput);
      const { success, generatedFileName } = submitOfficerPdf(
        selectedAduan.idAduan,
        pdfDataUrl,
        currentUser.name
      );
      setIsProcessing(false);

      if (success) {
        setActionFeedback({
          type: 'success',
          message: `Sukses! Berkas ${generatedFileName} berhasil diunggah dan status aduan menjadi Selesai Terlaksana.`
        });
        onRefresh();
        setTimeout(() => {
          setSelectedAduan(null);
        }, 1200);
      }
    };
    reader.onerror = () => {
      setIsProcessing(false);
      setActionFeedback({
        type: 'error',
        message: 'Gagal memproses berkas PDF. Silakan coba kembali.'
      });
    };
    reader.readAsDataURL(pdfFileInput);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Officer Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200/80 p-2 shrink-0 flex items-center justify-center shadow-xs">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-teal-700" />
                <span>Panel Kerja Konsultan Agronomi & Petugas Lapangan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Ruang Kendali Petugas BPP Bondowoso
              </h1>
              <p className="text-xs text-slate-500">
                Petugas: <span className="font-semibold text-slate-800">{currentUser.name}</span> ·
                Wilayah Tugas: <span className="font-bold text-teal-700">{currentUser.kecamatan || 'Semua Kecamatan'}</span>
              </p>
            </div>
          </div>

          {/* Quick Refresh */}
          <button
            onClick={onRefresh}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-emerald-700" />
            <span>Segarkan Data Real-Time</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Saring Wilayah:</span>
            </div>

            <select
              value={selectedKecamatan}
              disabled={isAssignedSpecific}
              onChange={e => {
                setSelectedKecamatan(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800 disabled:bg-slate-100"
            >
              <option value="">-- Semua Kecamatan Bondowoso (23) --</option>
              {DAFTAR_KECAMATAN.map(kec => (
                <option key={kec} value={kec}>
                  Kecamatan {kec}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari NIK, nama petani, ID aduan..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Segmented Status Tabs (Zero-Pill compliant button control) */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit">
          <button
            onClick={() => {
              setActiveTab('pending');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hourglass className="w-4 h-4 text-amber-600" />
            <span>Belum Selesai / Menunggu Verifikasi & PDF</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('selesai');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'selesai'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Selesai Terlaksana & Dokumen PDF Terbit</span>
          </button>
        </div>

        {/* High-density Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Waktu</th>
                  <th className="py-3.5 px-4">Identitas Petani</th>
                  <th className="py-3.5 px-4">Kecamatan</th>
                  <th className="py-3.5 px-4">Layanan</th>
                  <th className="py-3.5 px-4 max-w-xs">Rincian Isian Formulir</th>
                  <th className="py-3.5 px-4">Lampiran</th>
                  <th className="py-3.5 px-4 text-right">Tindakan Lapang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Tidak ada aduan dengan kriteria filter saat ini.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map(item => (
                    <tr key={item.idAduan} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{item.idAduan}</div>
                        <div className="text-[10px] text-slate-400">{item.waktu}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onOpenFarmerProfile(item.username)}
                          className="text-left group cursor-pointer"
                        >
                          <div className="font-bold text-emerald-800 group-hover:underline flex items-center gap-1">
                            <span>{item.namaPetani}</span>
                            <User className="w-3 h-3 text-slate-400" />
                          </div>
                          <div className="font-mono text-[11px] text-slate-500">
                            {item.username}
                          </div>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {item.kecamatan}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.desa}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 line-clamp-1">
                          {item.layanan}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <FormattedRincian rincian={item.rincian} variant="compact" />
                      </td>

                      {/* Attachments Column */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {item.fileKTP && (
                            <a
                              href={item.fileKTP}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-amber-700 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>Foto KTP</span>
                            </a>
                          )}
                          {item.fileSerangan && (
                            <a
                              href={item.fileSerangan}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-rose-700 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>Foto Hama/OPT</span>
                            </a>
                          )}
                          {item.fileSPPT && (
                            <a
                              href={item.fileSPPT}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-700 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>SPPT/Lahan</span>
                            </a>
                          )}
                          {item.filePelaksanaan && (
                            <button
                              onClick={() => onViewPdf(item)}
                              className="text-[10px] text-emerald-700 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <FileText className="w-2.5 h-2.5 text-red-600" />
                              <span>PDF Berita Acara</span>
                            </button>
                          )}
                          {!item.fileKTP && !item.fileSerangan && !item.fileSPPT && !item.filePelaksanaan && (
                            <span className="text-[11px] text-slate-400 italic">Tanpa lampiran</span>
                          )}
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenActionModal(item)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                            item.status === 'selesai'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : item.status === 'dijawab'
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>
                            {item.status === 'selesai'
                              ? 'Lihat / Edit'
                              : item.status === 'dijawab'
                              ? 'Unggah PDF Bukti'
                              : 'Jawab & Tanggapi'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <div>
              Menampilkan <span className="font-bold text-slate-900 font-mono">{startIndex + 1}</span> –{' '}
              <span className="font-bold text-slate-900 font-mono">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{' '}
              dari total <span className="font-bold text-slate-900 font-mono">{totalItems}</span> berkas aduan
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold px-2 font-mono">
                Hal {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OFFICER ACTION & PDF RESOLUTION MODAL */}
      {selectedAduan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in duration-150">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-300 font-bold">
                  {selectedAduan.idAduan} · Kec. {selectedAduan.kecamatan}
                </span>
                <h3 className="text-base font-bold text-white">
                  Tindak Lanjut Petugas Lapangan
                </h3>
              </div>
              <button
                onClick={() => setSelectedAduan(null)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {actionFeedback && (
                <div
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    actionFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {actionFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{actionFeedback.message}</span>
                </div>
              )}

              {/* Consultation Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="font-bold text-slate-800 text-xs">
                    {selectedAduan.namaPetani} ({selectedAduan.username})
                  </span>
                  <span className="font-bold text-emerald-800 text-xs">
                    {selectedAduan.layanan}
                  </span>
                </div>
                <FormattedRincian rincian={selectedAduan.rincian} variant="card" />
              </div>

              {/* STEP 1: JAWABAN REKOMENDASI */}
              <div className="p-4 rounded-2xl bg-white border border-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 block">
                    Langkah 1: Jawaban Analisis & Solusi Teknis Petugas
                  </label>
                  {selectedAduan.jawaban && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Sudah Tersimpan
                    </span>
                  )}
                </div>

                <textarea
                  rows={4}
                  value={jawabanInput}
                  onChange={e => setJawabanInput(e.target.value)}
                  placeholder="Ketik rekomendasi perlakuan lapangan, bahan aktif pestisida, jadwal pengairan, atau anjuran dosis pemupukan..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
                />

                <button
                  type="button"
                  onClick={handleSaveAnswer}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Simpan Rekomendasi Solusi</span>
                </button>
              </div>

              {/* STEP 2: UPLOAD DOKUMEN PDF PELAKSANAAN */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-emerald-950 block">
                      Langkah 2: Unggah Berkas PDF Bukti Pelaksanaan
                    </label>
                    <span className="text-[11px] text-emerald-800/80">
                      Wajib untuk menyelesaikan aduan & menerbitkan berita acara resmi.
                    </span>
                  </div>
                  {selectedAduan.filePelaksanaan && (
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Dokumen Terbit
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={e => setPdfFileInput(e.target.files?.[0] || null)}
                  className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-800 file:text-white file:font-semibold"
                />

                <button
                  type="button"
                  onClick={handleUploadPdf}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah PDF & Tandai Selesai Terlaksana</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
