import {
  UserProfile,
  LayananAduan,
  ResetPasswordRequest,
  WilayahTaniItem
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ADUAN,
  INITIAL_RESET_REQUESTS,
  WILAYAH_TANI_MASTER
} from '../data/masterData';

const STORAGE_KEYS = {
  USERS: 'klinik_bws_users',
  ADUAN: 'klinik_bws_aduan',
  RESETS: 'klinik_bws_resets',
  CURRENT_USER: 'klinik_bws_active_user',
  WILAYAH: 'klinik_bws_wilayah'
};

export const getStoredUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
};

export const saveUsers = (users: UserProfile[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getStoredAduan = (): LayananAduan[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADUAN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADUAN, JSON.stringify(INITIAL_ADUAN));
      return INITIAL_ADUAN;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADUAN;
  }
};

export const saveAduan = (aduan: LayananAduan[]) => {
  localStorage.setItem(STORAGE_KEYS.ADUAN, JSON.stringify(aduan));
};

export const getStoredResets = (): ResetPasswordRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RESETS, JSON.stringify(INITIAL_RESET_REQUESTS));
      return INITIAL_RESET_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RESET_REQUESTS;
  }
};

export const saveResets = (resets: ResetPasswordRequest[]) => {
  localStorage.setItem(STORAGE_KEYS.RESETS, JSON.stringify(resets));
};

export const getStoredCurrentUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getStoredWilayah = (): WilayahTaniItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WILAYAH);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WILAYAH, JSON.stringify(WILAYAH_TANI_MASTER));
      return WILAYAH_TANI_MASTER;
    }
    return JSON.parse(raw);
  } catch {
    return WILAYAH_TANI_MASTER;
  }
};

export const saveWilayah = (items: WilayahTaniItem[]) => {
  localStorage.setItem(STORAGE_KEYS.WILAYAH, JSON.stringify(items));
};

export const addWilayah = (item: WilayahTaniItem) => {
  const current = getStoredWilayah();
  const updated = [item, ...current];
  saveWilayah(updated);
  return updated;
};

export const updateWilayah = (index: number, item: WilayahTaniItem) => {
  const current = getStoredWilayah();
  if (index >= 0 && index < current.length) {
    current[index] = item;
    saveWilayah(current);
  }
  return current;
};

export const deleteWilayah = (index: number) => {
  const current = getStoredWilayah();
  if (index >= 0 && index < current.length) {
    current.splice(index, 1);
    saveWilayah(current);
  }
  return current;
};

export const addUser = (newUser: UserProfile) => {
  const users = getStoredUsers();
  const updated = [newUser, ...users];
  saveUsers(updated);
  return updated;
};

export const updateUser = (updatedUser: UserProfile) => {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === updatedUser.id || u.username === updatedUser.username);
  if (idx !== -1) {
    users[idx] = updatedUser;
    saveUsers(users);
  }
  return users;
};

export const deleteUser = (userId: string) => {
  const users = getStoredUsers();
  const updated = users.filter(u => u.id !== userId && u.username !== userId);
  saveUsers(updated);
  return updated;
};

// HELPER GENERATE FORMATTED NOW TIME
export const getFormattedNow = (): string => {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = now.getFullYear();
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${d}/${m}/${y} ${h}:${min}`;
};

// HELPER GENERATE PASSWORD
export const generateSecurePassword = (length = 8): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
};

// SUBMIT NEW ADUAN
export const submitNewAduan = (
  user: UserProfile,
  layananTitle: string,
  rincian: string,
  attachments?: {
    fileKTP?: string;
    fileKK?: string;
    fileSPPT?: string;
    fileLahan?: string;
    fileSerangan?: string;
    fileVideo?: string;
  }
): LayananAduan => {
  const currentList = getStoredAduan();
  const nextNumber = currentList.length + 1;
  const idAduan = `ADN${String(nextNumber).padStart(4, '0')}`;
  const waktu = getFormattedNow();

  const newEntry: LayananAduan = {
    idAduan,
    waktu,
    username: user.nik || user.username,
    namaPetani: user.name,
    kecamatan: user.kecamatan || 'BONDOWOSO',
    desa: user.desa || 'Pusat',
    kelompok: user.kelompok || 'Poktan Mandiri',
    noWa: user.wa || '',
    layanan: layananTitle,
    rincian,
    status: 'baru',
    ...(attachments || {})
  };

  const updatedList = [newEntry, ...currentList];
  saveAduan(updatedList);
  return newEntry;
};

// OFFICER ANSWER SAVE
export const submitOfficerAnswer = (
  idAduan: string,
  jawaban: string,
  officerName: string
): boolean => {
  const list = getStoredAduan();
  const idx = list.findIndex(item => item.idAduan === idAduan);
  if (idx === -1) return false;

  const item = list[idx];
  const waktuDijawab = getFormattedNow();
  const status = item.filePelaksanaan ? 'selesai' : 'dijawab';

  list[idx] = {
    ...item,
    jawaban,
    waktuDijawab,
    namaPetugas: officerName,
    status
  };

  saveAduan(list);
  return true;
};

// OFFICER PDF ATTACHMENT SAVE
export const submitOfficerPdf = (
  idAduan: string,
  pdfUrlOrName: string,
  officerName: string
): { success: boolean; generatedFileName: string } => {
  const list = getStoredAduan();
  const idx = list.findIndex(item => item.idAduan === idAduan);
  if (idx === -1) return { success: false, generatedFileName: '' };

  const item = list[idx];
  const nowStamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const cleanId = item.idAduan.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanNik = (item.username || 'PETANI').replace(/[^a-zA-Z0-9]/g, '_');
  const cleanKec = (item.kecamatan || 'BONDOWOSO').replace(/[^a-zA-Z0-9]/g, '_');
  const cleanLay = item.layanan.replace(/[^a-zA-Z0-9]/g, '_');

  const generatedFileName = `LAPORAN_${cleanId}_${cleanNik}_${cleanKec}_${cleanLay}_${nowStamp}.pdf`;
  const finalPdfUrl = pdfUrlOrName.startsWith('http') || pdfUrlOrName.startsWith('blob:')
    ? pdfUrlOrName
    : `https://drive.google.com/viewer?id=${cleanId}_certificate`;

  list[idx] = {
    ...item,
    filePelaksanaan: finalPdfUrl,
    namaPetugas: officerName || item.namaPetugas,
    status: 'selesai'
  };

  saveAduan(list);
  return { success: true, generatedFileName };
};

// ADMIN RESET APPROVAL
export const approvePasswordReset = (
  username: string
): { success: boolean; newPassword: string; whatsappUrl: string; message: string } => {
  const users = getStoredUsers();
  const userIdx = users.findIndex(u => u.username === username || u.nik === username);

  if (userIdx === -1) {
    return {
      success: false,
      newPassword: '',
      whatsappUrl: '',
      message: 'User dengan NIK/Username tersebut tidak ditemukan di database.'
    };
  }

  const newPassword = generateSecurePassword(8);
  users[userIdx].password = newPassword;
  saveUsers(users);

  // Update reset request status
  const resets = getStoredResets();
  const resetIdx = resets.findIndex(r => r.username === username);
  if (resetIdx !== -1) {
    resets[resetIdx].status = 'Success';
    resets[resetIdx].newPassword = newPassword;
    saveResets(resets);
  }

  const targetUser = users[userIdx];
  let waNumber = (targetUser.wa || '').replace(/[^0-9]/g, '');
  if (waNumber.startsWith('0')) waNumber = '62' + waNumber.slice(1);
  else if (waNumber.startsWith('8')) waNumber = '62' + waNumber;

  const textWa = `*[KLINIK PERTANIAN KABUPATEN BONDOWOSO]*\n\n` +
    `Yth. *${targetUser.name}* (NIK: ${targetUser.nik || targetUser.username}),\n` +
    `Permintaan pemulihan password akun Anda telah disetujui oleh Administrator Disperta & KP Bondowoso.\n\n` +
    `Berikut adalah kredensial akun baru Anda:\n` +
    `👤 *Username/NIK:* ${targetUser.username}\n` +
    `🔑 *Password Baru:* ${newPassword}\n\n` +
    `Silakan masuk kembali ke aplikasi Klinik Pertanian Kabupaten Bondowoso menggunakan password di atas.\n\n` +
    `_Pesan resmi dibuat otomatis oleh Sistem Administrator Klinik Pertanian Bondowoso._`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(textWa)}`;

  return {
    success: true,
    newPassword,
    whatsappUrl,
    message: `Password akun ${targetUser.name} berhasil di-reset menjadi "${newPassword}".`
  };
};

// COMPUTE DASHBOARD RECAP
export const computeAdminDashboardMetrics = () => {
  const aduanList = getStoredAduan();

  let total = 0;
  let baru = 0;
  let dijawab = 0;
  let selesai = 0;

  const rekapKecamatan: Record<string, number> = {};
  const rekapLayanan: Record<string, number> = {};
  const trenBulanan: Record<string, number> = {};

  const namaBulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agus", "Sep", "Okt", "Nov", "Des"];

  aduanList.forEach(item => {
    total++;

    const hasJawaban = Boolean(item.jawaban && item.jawaban.trim() !== '');
    const hasPdf = Boolean(item.filePelaksanaan && item.filePelaksanaan.trim() !== '');

    if (!hasJawaban && !hasPdf) {
      baru++;
    } else if (hasJawaban && !hasPdf) {
      dijawab++;
    } else if (hasPdf) {
      selesai++;
    }

    // Kecamatan
    const kec = (item.kecamatan || 'BONDOWOSO').toUpperCase();
    rekapKecamatan[kec] = (rekapKecamatan[kec] || 0) + 1;

    // Layanan
    const lay = item.layanan || 'Konsultasi';
    rekapLayanan[lay] = (rekapLayanan[lay] || 0) + 1;

    // Parse month
    let keyBulan = '';
    if (item.waktu) {
      const parts = item.waktu.split(' ')[0].split(/[\/\-]/);
      if (parts.length >= 3) {
        const mIdx = parseInt(parts[1], 10) - 1;
        const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        if (mIdx >= 0 && mIdx < 12) {
          keyBulan = `${namaBulanIndo[mIdx]} ${year}`;
        }
      }
    }
    if (!keyBulan) {
      keyBulan = `${namaBulanIndo[new Date().getMonth()]} ${new Date().getFullYear()}`;
    }

    trenBulanan[keyBulan] = (trenBulanan[keyBulan] || 0) + 1;
  });

  return {
    rekapUtama: { total, baru, dijawab, selesai },
    rekapKecamatan,
    rekapLayanan,
    trenBulanan
  };
};
