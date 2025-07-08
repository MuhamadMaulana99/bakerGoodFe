// utils/encryptStorage.ts
import { EncryptStorage } from 'encrypt-storage';

// Pastikan variabel environment sudah diset di .env.local
export const encryptStorage = new EncryptStorage(
  import.meta.env.VITE_PUBLIC_ENCRYPT_STORAGE_SECRET_KEY!,
  {
    storageType: 'localStorage', // Bisa juga 'sessionStorage' jika perlu
  }
);
