// src/config/fetchApi.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { EncryptStorage } from "encrypt-storage";

interface UserInfo {
  token: string;
}

const fetchApi = (type: string = ""): AxiosInstance => {
  const encryptStorage = new EncryptStorage(import.meta.env.VITE_PUBLIC_ENCRYPT_STORAGE_SECRET_KEY!);
  const baseURL = import.meta.env.VITE_PUBLIC_API_URL!;

  const userInfo: UserInfo | any = encryptStorage.getItem("info");
  const accessToken: string = userInfo?.token || "";

  const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "en",
    },
  });

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (type !== "auth" && error?.response?.status === 403) {
        encryptStorage.clear();
        localStorage.clear();
        window.location.href = "/admin";
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default fetchApi;
