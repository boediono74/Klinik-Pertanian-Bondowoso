import React, { useState } from 'react';
import { ServiceItem, UserProfile } from '../types';
import { submitNewAduan } from '../utils/storage';
import { FormattedRincian } from './FormattedRincian';
import {
  X,
  Send,
  Upload,
  FileCheck,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';

interface FormLayananModalProps {
  service: ServiceItem | null;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSuccess: (idAduan: string) => void;
  onOpenLogin: () => void;
}

export const FormLayananModal: React.FC<FormLayananModalProps> = ({
  service,
  currentUser,
  onClose,
  onSuccess,
  onOpenLogin
}) => {
  if (!service) return null;

  // Form states
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; url: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill farmer data if logged in
  const [guestName, setGuestName] = useState(currentUser?.name || '');
  const [guestNik, setGuestNik] = useState(currentUser?.nik || currentUser?.username || '');
  const [guestKecamatan, setGuestKecamatan] = useState(currentUser?.kecamatan || 'SUKOSARI');
  const [guestWa, setGuestWa] = useState(currentUser?.wa || '081234567890');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxToggle = (val: string) => {
    setSelectedCheckboxes(prev =>
      prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]
    );
  };

  const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUploadedFiles(prev => ({
            ...prev,
            [field]: { name: file.name, url: reader.result as string }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Ensure farmer identification
    const effectiveUser: UserProfile = currentUser || {
      id: `U_${Date.now()}`,
      username: guestNik || '3511080000000001',
      password: '',
      name: guestName || 'Petani Mandiri',
      role: 'petani',
      nik: guestNik || '3511080000000001',
      kelompok: 'Poktan Tani Makmur',
      desa: 'Pusat',
      kecamatan: guestKecamatan,
      wa: guestWa
    };

    if (!effectiveUser.name || !effectiveUser.nik) {
      setErrorMsg('Mohon lengkapi Nama dan NIK Anda.');
      return;
    }

    setIsSubmitting(true);
    setProgressText('Menghubungkan ke server basis data klinik...');

    // Compose rincian string
    let rincianText = '';
    Object.entries(formData).forEach(([k, v]) => {
      if (v) rincianText += `[${k}]: ${v} || `;
    });
    if (selectedCheckboxes.length > 0) {
      rincianText += `[Pilihan Terpilih]: ${selectedCheckboxes.join(', ')}; `;
    }

    // Attachments
    const attachments = {
      fileKTP: uploadedFiles.fileKTP?.url || uploadedFiles.ktp?.url,
      fileKK: uploadedFiles.fileKK?.url,
      fileSPPT: uploadedFiles.fileSPPT?.url,
      fileLahan: uploadedFiles.fileLahan?.url,
      fileSerangan: uploadedFiles.fileSerangan?.url || uploadedFiles.fotoTanaman?.url,
      fileVideo: uploadedFiles.fileVideo?.url
    };

    try {
      await new Promise(r => setTimeout(r, 600));
      setProgressText('Mengunggah dokumen & memproses berkas...');
      await new Promise(r => setTimeout(r, 500));

      const newEntry = submitNewAduan(
        effectiveUser,
        `${service.number}. ${service.title}`,
        rincianText,
        attachments
      );

      setIsSubmitting(false);
      onSuccess(newEntry.idAduan);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg('Terjadi kendala saat menyimpan berkas: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white px-6 py-5 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white p-1.5 shrink-0 flex items-center justify-center shadow-md">
              <img
                src="/logo_klinik_pertanian.png"
                alt="Logo Klinik Pertanian"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-0.5">
                <span>Layanan {service.number}</span>
                <span aria-hidden="true">·</span>
                <span>{service.category}</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
                Formulir {service.title}
              </h2>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                {service.tagline}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice for Guest / Logged in */}
        {!currentUser && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Anda belum login. Data akan dicatat sebagai pemohon mandiri.</span>
            </div>
            <button
              onClick={onOpenLogin}
              className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </button>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Farmer Identity Section (if guest or verification) */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Identitas Pemohon</span>
              {currentUser && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap Petani</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Contoh: Bpk. Ahmad Fauzi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">NIK (Nomor Induk Kependudukan)</label>
                <input
                  type="text"
                  required
                  value={guestNik}
                  onChange={e => setGuestNik(e.target.value)}
                  placeholder="16 digit NIK KTP"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kecamatan Lahan</label>
                <input
                  type="text"
                  required
                  value={guestKecamatan}
                  onChange={e => setGuestKecamatan(e.target.value.toUpperCase())}
                  placeholder="Contoh: SUKOSARI"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nomor WhatsApp Aktif</label>
                <input
                  type="tel"
                  required
                  value={guestWa}
                  onChange={e => setGuestWa(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30 text-xs"
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC SERVICE SPECIFIC FIELDS */}
          {/* SERVICE 1: Konsultasi Pertanian */}
          {service.id === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Komoditas yang Dikonsultasikan:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {['Padi', 'Jagung', 'Tembakau', 'Kopi', 'Hortikultura'].map(k => (
                    <label key={k} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes(k)}
                        onChange={() => handleCheckboxToggle(k)}
                        className="rounded text-emerald-700 focus:ring-emerald-700"
                      />
                      <span>{k}</span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Komoditas lainnya..."
                  onChange={e => handleInputChange('Komoditas_Lainnya', e.target.value)}
                  className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rincian Permasalahan Teknis:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ceritakan kondisi tanaman, fase pertumbuhan, kendala daun/batang/akar yang dihadapi..."
                  onChange={e => handleInputChange('Permasalahan', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>
            </div>
          )}

          {/* SERVICE 2: Penyuluhan & Pelatihan */}
          {service.id === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jenis Bimbingan / Pelatihan yang Dibutuhkan:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Budidaya Presisi', 'Pengendalian Hama & Penyakit', 'Pengolahan Hasil Panen', 'Pertanian Organik', 'Smart Farming & Digital'].map(p => (
                    <label key={p} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes(p)}
                        onChange={() => handleCheckboxToggle(p)}
                        className="rounded text-emerald-700"
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Perkiraan Jumlah Peserta (Orang / Anggota Poktan):
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="Contoh: 25"
                  onChange={e => handleInputChange('Jumlah_Peserta', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          )}

          {/* SERVICE 3: Konsultasi Agribisnis */}
          {service.id === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Agribisnis:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {['Permodalan Usaha & KUR', 'Pemasaran & Offtaker Hasil', 'Kemitraan Usaha Bersama', 'Analisis Harga Pasar Komoditas', 'Pengembangan UMKM Olahan'].map(a => (
                    <label key={a} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes(a)}
                        onChange={() => handleCheckboxToggle(a)}
                        className="rounded text-emerald-700"
                      />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kendala Usaha yang Dihadapi:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Uraikan kendala rantai pasok, harga jual rendah, atau kebutuhan modal kerja..."
                  onChange={e => handleInputChange('Kendala_Usaha', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          )}

          {/* SERVICE 4: Pembaharuan e-RDKK */}
          {service.id === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alasan Pembaharuan e-RDKK:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {['Belum Terdaftar di e-RDKK', 'Perubahan Luas Lahan Garapan', 'Perubahan Jenis Komoditas', 'Pindah Kelompok Tani', 'Perubahan Data Identitas / KTP'].map(r => (
                    <label key={r} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes(r)}
                        onChange={() => handleCheckboxToggle(r)}
                        className="rounded text-emerald-700"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Document Attachments */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Unggah Berkas Lampiran Verifikasi:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">1. Foto KTP Asli</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange('fileKTP', e)}
                      className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-emerald-100 file:text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">2. Foto Kartu Keluarga (KK)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange('fileKK', e)}
                      className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-emerald-100 file:text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">3. File SPPT / Bukti Kepemilikan</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => handleFileChange('fileSPPT', e)}
                      className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-emerald-100 file:text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">4. Foto Kondisi Lahan</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange('fileLahan', e)}
                      className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-emerald-100 file:text-emerald-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SERVICE 5: Pendataan Buruh Tani */}
          {service.id === 5 && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Buruh Tani:</label>
                <input
                  type="text"
                  required
                  placeholder="Nama buruh tani"
                  onChange={e => handleInputChange('Nama_Buruh', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Pekerjaan:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Penanam, Penebas, Pemanen"
                    onChange={e => handleInputChange('Jenis_Pekerjaan', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lama Bekerja:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 4 Tahun"
                    onChange={e => handleInputChange('Lama_Bekerja', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Lahan / Wilayah Bekerja:</label>
                <input
                  type="text"
                  required
                  placeholder="Desa / Kecamatan lokasi kerja rutin"
                  onChange={e => handleInputChange('Lokasi_Kerja', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          )}

          {/* SERVICE 6: Diagnosis Hama Penyakit */}
          {service.id === 6 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Tanaman:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Padi Inpari 32"
                    onChange={e => handleInputChange('Jenis_Tanaman', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimasi Luas Serangan:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 0.5 Hektar / 500 Da"
                    onChange={e => handleInputChange('Luas_Serangan', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gejala Visual yang Muncul di Lapang:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {['Daun Menguning / Klorosis', 'Tanaman Layu Mendadak', 'Bercak / Blas Daun', 'Batang Busuk / Coklat', 'Serangan Ulat Grayak', 'Malai Hampa'].map(g => (
                    <label key={g} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes(g)}
                        onChange={() => handleCheckboxToggle(g)}
                        className="rounded text-emerald-700"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <label className="block font-bold text-slate-700 mb-1">
                  Foto Gejala Tanaman / Bagian yang Sakit:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileChange('fotoTanaman', e)}
                  className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-emerald-100 file:text-emerald-800"
                />
              </div>
            </div>
          )}

          {/* SERVICE 7: Analisis Kesuburan Tanah */}
          {service.id === 7 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Analisis Kesuburan Tanah yang Diinginkan:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Uraikan riwayat pemupukan sebelumnya, masalah tanah (tanah asam, bantat, atau tanaman kerdil)..."
                  onChange={e => handleInputChange('Permasalahan', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          )}

          {/* SERVICE 8: Rekomendasi Pupuk & Pestisida */}
          {service.id === 8 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Tanaman:</label>
                  <input
                    type="text"
                    required
                    placeholder="Padi, Jagung, Tembakau..."
                    onChange={e => handleInputChange('Jenis_Tanaman', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Usia Tanaman Saat Ini:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 21 HST / Fase Vegetatif"
                    onChange={e => handleInputChange('Usia_Tanaman', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kebutuhan Rekomendasi Formulasi:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {['Pupuk Dasar (Organik/NPK)', 'Pupuk Susulan I & II', 'Herbisida Gulma', 'Fungisida Antraknosa/Blas', 'Insektisida Pengendali Hama', 'Nutrisi Mikro / ZPT'].map(k => (
                    <label key={k} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes(k)}
                        onChange={() => handleCheckboxToggle(k)}
                        className="rounded text-emerald-700"
                      />
                      <span>{k}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SERVICE 9: Usulan Asuransi Tani (AUTP) */}
          {service.id === 9 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Asuransi:</label>
                  <input
                    type="text"
                    readOnly
                    value="AUTP (Asuransi Usaha Tani Padi)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Luas Lahan yang Diusulkan:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1.2 Hektar"
                    onChange={e => handleInputChange('Luas_Lahan', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Potensi Risiko Utama:</label>
                  <select
                    onChange={e => handleInputChange('Potensi_Risiko', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Banjir">Banjir Luapan Sungai</option>
                    <option value="Kekeringan">Kekeringan Musim Kemarau</option>
                    <option value="OPT">Serangan Hama Penyakit (OPT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Blok Sawah / Lahan:</label>
                <input
                  type="text"
                  required
                  placeholder="Nama blok sawah dan batas lokasi"
                  onChange={e => handleInputChange('Lokasi_Lahan', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">Unggah Dokumen Usulan:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Foto KTP Pemohon:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange('fileKTP', e)}
                      className="w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Bukti Garap / SPPT:</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => handleFileChange('fileSPPT', e)}
                      className="w-full text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SERVICE 10: Gerakan Pengendalian (GERDAL) */}
          {service.id === 10 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Tanaman:</label>
                  <input
                    type="text"
                    required
                    placeholder="Padi / Jagung"
                    onChange={e => handleInputChange('Jenis_Tanaman', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Hama/OPT:</label>
                  <input
                    type="text"
                    required
                    placeholder="Wereng Coklat, Tikus, Penggerek"
                    onChange={e => handleInputChange('Jenis_Hama', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Serangan:</label>
                  <select
                    onChange={e => handleInputChange('Tingkat_Serangan', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Ringan">Ringan (Ambang Terkendali)</option>
                    <option value="Sedang">Sedang (Mulai Meluas)</option>
                    <option value="Berat">Berat (Kritis / Darurat)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Luas Hamparan Serangan:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3.5 Hektar Hamparan"
                    onChange={e => handleInputChange('Luas_Serangan', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Koordinat GPS / Lokasi:</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="-7.954210, 113.987650"
                      onChange={e => handleInputChange('Titik_Lokasi', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 pr-8"
                    />
                    <MapPin className="w-4 h-4 text-emerald-600 absolute right-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Permohonan Bentuk Dukungan Darurat:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Gerakan Pengendalian Massal', 'Bantuan Pestisida Khusus', 'Pendampingan Tim Ahli POPT'].map(d => (
                    <label key={d} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes(d)}
                        onChange={() => handleCheckboxToggle(d)}
                        className="rounded text-emerald-700"
                      />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SERVICE 11: Bongkar Ratoon Tebu */}
          {service.id === 11 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900">Program Peremajaan Produktivitas Tebu Bondowoso</div>
                  <p className="text-emerald-800/90 mt-0.5">
                    Fasilitasi pembongkaran keprasan tua dan penyediaan varietas unggul baru bersertifikat demi meningkatkan rendemen tebu petani.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian Kendala Lahan & Luas Bongkar Ratoon yang Diajukan:
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Sebutkan berapa kali keprasan sebelumnya, luas lahan tebu yang diajukan, lokasi desa, dan rencana varietas bibit yang diharapkan..."
                  onChange={e => handleInputChange('Permasalahan', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>
            </div>
          )}

          {/* Live Preview of Rincian Isian Formulir */}
          {(() => {
            let previewText = '';
            Object.entries(formData).forEach(([k, v]) => {
              if (v !== undefined && v !== '' && typeof v !== 'object') {
                previewText += `[${k}]: ${v} || `;
              }
            });
            if (selectedCheckboxes.length > 0) {
              previewText += `[Pilihan Spesifik]: ${selectedCheckboxes.join(', ')} || `;
            }
            if (!previewText.trim()) return null;

            return (
              <div className="space-y-2 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 shadow-2xs animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pratinjau Rincian Isian Formulir (Tampilan Menarik & Terstruktur):</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                    Live Preview
                  </span>
                </div>
                <FormattedRincian rincian={previewText} />
              </div>
            );
          })()}

          {/* Submission Feedback & Buttons */}
          {isSubmitting && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 flex items-center gap-2.5 animate-pulse">
              <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              <span>{progressText}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Permohonan Resmi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
