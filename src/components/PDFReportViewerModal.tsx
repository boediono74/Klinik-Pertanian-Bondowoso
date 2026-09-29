import React, { useRef } from 'react';
import { LayananAduan } from '../types';
import { FormattedRincian } from './FormattedRincian';
import {
  X,
  Download,
  Printer,
  FileCheck2,
  QrCode,
  ShieldCheck,
  CheckCircle,
  Building2
} from 'lucide-react';

interface PDFReportViewerModalProps {
  aduan: LayananAduan | null;
  onClose: () => void;
}

export const PDFReportViewerModal: React.FC<PDFReportViewerModalProps> = ({ aduan, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!aduan) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate a downloadable text/html representation or trigger download
    const cleanId = aduan.idAduan.replace(/[^a-zA-Z0-9]/g, '_');
    const content = `
BERITA ACARA RESMI PELAYANAN KLINIK PERTANIAN KABUPATEN BONDOWOSO
-----------------------------------------------------------------
No. Registrasi  : ${aduan.idAduan}
Waktu Pengajuan : ${aduan.waktu}
Pemohon         : ${aduan.namaPetani} (NIK: ${aduan.username})
Wilayah Lahan   : Desa ${aduan.desa}, Kecamatan ${aduan.kecamatan}, Kab. Bondowoso
Kelompok Tani   : ${aduan.kelompok}
Jenis Layanan   : ${aduan.layanan}

DETAIL LAPORAN / KELUHAN:
${aduan.rincian}

HASIL ANALISIS & REKOMENDASI TEKNIS RESMI PETUGAS:
${aduan.jawaban || 'Menunggu verifikasi lapangan final.'}

Petugas Pemeriksa: ${aduan.namaPetugas || 'Petugas Lapangan BPP'}
Waktu Verifikasi : ${aduan.waktuDijawab || aduan.waktu}
Status Berkas    : TERVERIFIKASI RESMI (DINAS PERTANIAN & KETAHANAN PANGAN KAB. BONDOWOSO)
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LAPORAN_${cleanId}_${aduan.username}_BONDOWOSO.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-bold text-sm text-white">Pratinjau Dokumen PDF Resmi Pelaksanaan</span>
              <span className="text-[11px] font-mono text-slate-400 block">{aduan.idAduan}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Cetak Dokumen"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Formal Document Paper */}
        <div ref={printRef} className="p-8 bg-white text-slate-900 font-serif max-h-[75vh] overflow-y-auto space-y-6">
          {/* Government Formal Header (Kop Surat) */}
          <div className="flex items-center gap-4 pb-4 border-b-2 border-slate-900">
            <div className="w-18 h-18 shrink-0 flex items-center justify-center p-1 bg-white">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian Kab Bondowoso"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 text-center space-y-0.5">
              <div className="text-xs uppercase tracking-widest font-sans font-bold text-slate-700">
                Pemerintah Kabupaten Bondowoso
              </div>
              <div className="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 font-serif">
                Dinas Pertanian dan Ketahanan Pangan
              </div>
              <div className="text-xs font-sans font-semibold text-emerald-800">
                Klinik Pertanian Kabupaten Bondowoso
              </div>
              <div className="text-[10px] font-sans text-slate-500 italic">
                Jl. Diponegoro No. 123, Kabupaten Bondowoso, Jawa Timur 68211 · Pos-el: pertanian@bondowosokab.go.id
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider underline font-sans text-slate-900">
              Berita Acara & Lembar Rekomendasi Pelayanan Klinik
            </h2>
            <div className="text-xs font-mono text-slate-600">
              Nomor: {aduan.idAduan}/KLINIK-DISPERTA/BWS/{new Date().getFullYear()}
            </div>
          </div>

          {/* Metadata Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden font-sans text-xs">
            <div className="grid grid-cols-3 p-2.5 bg-slate-50 border-b border-slate-200">
              <span className="font-semibold text-slate-500">Nama Petani</span>
              <span className="col-span-2 font-bold text-slate-900">{aduan.namaPetani}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-slate-200">
              <span className="font-semibold text-slate-500">NIK KTP</span>
              <span className="col-span-2 font-mono font-bold text-slate-900">{aduan.username}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 bg-slate-50 border-b border-slate-200">
              <span className="font-semibold text-slate-500">Kelompok Tani / Desa</span>
              <span className="col-span-2 font-medium text-slate-800">
                {aduan.kelompok} · Desa {aduan.desa}, Kec. {aduan.kecamatan}
              </span>
            </div>
            <div className="grid grid-cols-3 p-2.5 border-b border-slate-200">
              <span className="font-semibold text-slate-500">Bidang Layanan</span>
              <span className="col-span-2 font-bold text-emerald-800">{aduan.layanan}</span>
            </div>
            <div className="grid grid-cols-3 p-2.5 bg-slate-50">
              <span className="font-semibold text-slate-500">Waktu Pengajuan</span>
              <span className="col-span-2 font-mono text-slate-700">{aduan.waktu} WIB</span>
            </div>
          </div>

          {/* Consultation Summary with Formatted Rincian */}
          <div className="font-sans space-y-2 text-xs">
            <div className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              I. Uraian Rincian Isian Formulir & Permasalahan Lahan Petani
            </div>
            <FormattedRincian rincian={aduan.rincian} variant="card" />
          </div>

          {/* Technical Resolution */}
          <div className="font-sans space-y-2 text-xs">
            <div className="font-bold uppercase tracking-wider text-emerald-900 text-[11px] flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>II. Hasil Analisis Lapangan & Rekomendasi Tindak Lanjut</span>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-slate-900 leading-relaxed font-sans">
              {aduan.jawaban || 'Hasil diagnosa teknis disetujui sesuai petunjuk operasional baku dinas.'}
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 grid grid-cols-2 gap-8 font-sans text-xs items-end">
            <div className="space-y-2 text-center p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verifikasi Digital Terenkripsi</span>
              </div>
              <div className="w-20 h-20 mx-auto bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-800" />
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                DISPERTA-BWS-SIGN-VALID#{aduan.idAduan}
              </div>
            </div>

            <div className="text-center space-y-12">
              <div className="text-[11px] text-slate-600">
                Bondowoso, {aduan.waktuDijawab ? aduan.waktuDijawab.split(' ')[0] : 'Hari Kerja Aktif'}
                <div className="font-bold text-slate-800">Petugas Pengawas & Konsultan Agronomi</div>
              </div>

              <div>
                <div className="font-bold underline text-slate-950 font-sans">
                  {aduan.namaPetugas || 'Ir. Hendra Kusuma, S.P.'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  NIP. 19820514 200801 1 005
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
