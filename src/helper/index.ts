import toast from "react-hot-toast";

let isErrorNotified: boolean = false;
let errorTimeout: NodeJS.Timeout;

interface ErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

interface NotifyOptions {
  title: string;
  description: string;
  duration: number;
}

const Notify = {
  error: (options: NotifyOptions) => {
    // Implementation of your notification system
  }
};

export const handleError = (error: any): void => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || "Terjadi kesalahan";

  const showNotifyOnce = (title: string, description: string): void => {
    if (isErrorNotified) return;
    isErrorNotified = true;
    toast.error(message || "Server Error");
    // Notify.error({ title, description, duration: 3000 });

    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => {
      isErrorNotified = false;
    }, 1000); // Reset after 1 second (changed from comment which said 3 seconds)
  };

  const auth = (): void => {
    showNotifyOnce("Unauthorized", "Silakan login ulang");
    // redirect to login if needed
  };

  if (status === 401) {
    auth();
    return;
  }

  switch (status) {
    case 400:
      showNotifyOnce("Gagal Menghapus Data", message);
      break;
    case 403:
      showNotifyOnce("Akses Ditolak", "Anda tidak memiliki akses.");
      break;
    case 404:
      showNotifyOnce(
        "Data Tidak Ditemukan",
        "Data yang Anda cari tidak tersedia atau mungkin sudah dihapus."
      );
      break;
    case 409:
      showNotifyOnce("Gagal Menghapus Data", message);
      break;
    case 500:
      showNotifyOnce(
        "Kesalahan Sistem",
        "Terjadi gangguan pada sistem. Silakan coba lagi nanti atau hubungi administrator."
      );
      break;
    default:
      showNotifyOnce(
        "Gangguan Sistem",
        "Kami mengalami kendala saat memproses permintaan Anda."
      );
  }
};