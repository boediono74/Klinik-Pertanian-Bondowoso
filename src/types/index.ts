export type UserRole = 'petani' | 'petugas' | 'admin';

export interface UserProfile {
  id: string;
  username: string; // NIK for petani, or staff username
  password: string;
  name: string;
  role: UserRole;
  nik: string;
  kelompok: string;
  desa: string;
  kecamatan: string;
  wa: string;
  isSuperAdmin?: boolean;
}

export type AduanStatus = 'baru' | 'dijawab' | 'selesai';

export interface LayananAduan {
  idAduan: string;
  waktu: string;
  username: string; // NIK
  namaPetani: string;
  kecamatan: string;
  desa: string;
  kelompok: string;
  noWa: string;
  layanan: string;
  rincian: string;
  fileKTP?: string;
  fileKK?: string;
  fileSPPT?: string;
  fileLahan?: string;
  fileSerangan?: string;
  fileVideo?: string;
  jawaban?: string;
  waktuDijawab?: string;
  namaPetugas?: string;
  filePelaksanaan?: string;
  status: AduanStatus;
}

export interface ResetPasswordRequest {
  username: string; // NIK
  name: string;
  noWa: string;
  kecamatan: string;
  status: 'Pending' | 'Success';
  waktu: string;
  newPassword?: string;
}

export interface WilayahTaniItem {
  id?: string;
  kecamatan: string;
  desa: string;
  poktan: string;
  ketua?: string;
  kontak?: string;
  jumlahAnggota?: number;
  komoditasUtama?: string;
  luasLahanHa?: number;
}

export interface ServiceItem {
  id: number;
  number: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  icon: string;
  accentBg: string;
  accentColor: string;
  badge: string;
  requiresFiles?: boolean;
}
