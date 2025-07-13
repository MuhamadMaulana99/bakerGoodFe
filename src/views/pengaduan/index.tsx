/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  CalendarIcon,
  Upload,
  Search,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { format, isValid } from "date-fns";
import { Link } from "react-router-dom";
import { handleError } from "../../helper";
import axios from "axios";
import toast from "react-hot-toast";

interface Product {
  id: number;
  product_name: string;
}
interface Category {
  id: number;
  category_name: string;
}
interface ComplaintForm {
  user_id: number | null;
  product_id: number | null;
  category_id: number | null;
  customer_name: string;
  email: string;
  contact: string;
  description: string;
  image?: any; // base64 string (opsional)
  imageName: any;
  date_occurrence: string; // dalam format YYYY-MM-DD
  status: string;
}

export default function HomePage() {
  const [formData, setFormData] = useState<ComplaintForm>({
    user_id: null,
    product_id: null,
    category_id: null,
    customer_name: "",
    contact: "",
    email: "",
    description: "",
    image: null,
    imageName: "",
    date_occurrence: "",
    status: "Masuk",
  });
  console.log(formData, "formData");
  const [trackingCode, setTrackingCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const code = `CMP-${Date.now().toString().slice(-6)}`;
    setGeneratedCode(code);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Filter file valid (maks 2MB)
      const validFiles = fileArray.filter((file) => {
        if (file.size > maxSize) {
          toast.error(`❌ File "${file.name}" melebihi batas 2MB!`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        toast.error("⚠️ Tidak ada file valid yang diunggah.");
        return;
      }

      const file = validFiles[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev: any) => ({
            ...prev,
            image: reader.result,
          }));

          toast.success(`✅ File "${file.name}" berhasil diunggah!`);
        } else {
          toast.error("❌ Gagal mengonversi file ke base64.");
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast.error("❌ Terjadi kesalahan saat membaca file.");
      };
    }
  };

  const [datasProduct, setDatasProduct] = useState<Product[]>([]);
  const [datasCategory, setDatasCategody] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDatasProduct = async () => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_PUBLIC_API_URL}/products`;
      const response = await axios.get(url);
      setIsLoading(false);
      setDatasProduct(response.data);
    } catch (err) {
      console.error("Error saat fetching:", err); // Debug 4
      setDatasProduct([]);
      setIsLoading(false);
      handleError(err);
    }
  };
  const getDatasCategory = async () => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_PUBLIC_API_URL}/categories`;
      const response = await axios.get(url);
      setIsLoading(false);
      setDatasCategody(response.data);
    } catch (err) {
      console.error("Error saat fetching:", err); // Debug 4
      setDatasCategody([]);
      setIsLoading(false);
      handleError(err);
    }
  };

  function isValidWithException(obj: Record<string, any>): boolean {
    return Object.entries(obj).every(([key, value]) => {
      if (key === "image" || key === "imageName") return true;
      if (key === "user_id") return true;
      return Boolean(value);
    });
  }

  const handleSubmitComplaints = async () => {
    const payload = {
      user_id: formData?.user_id,
      product_id: formData?.product_id,
      category_id: formData?.category_id,
      customer_name: formData?.customer_name,
      contact: formData?.contact,
      email: formData?.email,
      description: formData?.description,
      image: formData?.image,
      date_occurrence: formData?.date_occurrence,
      status: "Masuk",
    };
    if (!isValidWithException(payload)) return;
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_PUBLIC_API_URL}/complaints`;
      await axios.post(url, payload);
      setFormData({
        user_id: null,
        product_id: null,
        category_id: null,
        customer_name: "",
        contact: "",
        email: "",
        description: "",
        image: null,
        imageName: "",
        date_occurrence: "",
        status: "Masuk",
      });
      setSubmitted(true);
      toast.success("Pengaduan berhasil");
      // console.log("Response diterima:", response?.data); // Debug 3
      setIsLoading(false);
    } catch (err) {
      setSubmitted(false);
      console.error("Error saat fetching:", err); // Debug 4
      setIsLoading(false);
      handleError(err);
    }
  };

  useEffect(() => {
    getDatasProduct();
    getDatasCategory();
  }, []);
  // console.log(
  //   import.meta.env.VITE_PUBLIC_API_URL,
  //   "import.meta.env.VITE_PUBLIC_API_URL"
  // );
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Pengaduan Terkirim!
            </CardTitle>
            <CardDescription>
              Pengaduan Anda berhasil dikirim dan mendapatkan kode pelacakan:
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">
                {generatedCode}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Silakan simpan kode ini untuk melacak status pengaduan Anda.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    user_id: null,
                    product_id: null,
                    category_id: null,
                    customer_name: "",
                    contact: "",
                    email: "",
                    description: "",
                    image: null,
                    imageName: "",
                    date_occurrence: "",
                    status: "Masuk",
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Kirim Lagi
              </Button>
              <Link to="/track" className="flex-1">
                <Button className="w-full">Lacak Status</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Kayu Manis Baked Goods
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/track">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Lacak Pengaduan
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline">Login Admin</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Kirim Pengaduan
              </CardTitle>
              {/* <CardDescription>
                Isi formulir berikut untuk mengajukan pengaduan. Anda akan
                menerima kode pelacakan untuk memantau statusnya.
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nama Lengkap *</Label>
                    <Input
                      id="fullName"
                      value={formData.customer_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customer_name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          value={formData.contact}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              contact: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Alamat Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product">Produk *</Label>
                      <Select
                        value={formData.product_id?.toString() || ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            product_id: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih produk" />
                        </SelectTrigger>
                        <SelectContent>
                          {datasProduct.map((product) => (
                            <SelectItem
                              key={product?.id}
                              value={product?.id.toString()}
                            >
                              {product?.product_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori Pengaduan *</Label>
                      <Select
                        value={formData.category_id?.toString() || ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            category_id: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {datasCategory.map((category) => (
                            <SelectItem
                              key={category?.id}
                              value={category?.id.toString()}
                            >
                              {category?.category_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Tanggal Kejadian *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date_occurrence
                            ? format(new Date(formData.date_occurrence), "PPP")
                            : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            formData.date_occurrence
                              ? new Date(formData.date_occurrence)
                              : undefined
                          }
                          onSelect={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              date_occurrence: date
                                ? format(date, "yyyy-MM-dd")
                                : "",
                            }))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi Masalah *</Label>
                    <Textarea
                      id="description"
                      placeholder="Jelaskan masalah Anda secara rinci..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="files">File Pendukung (Opsional)</Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {!formData.image && (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4 text-center">
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="files"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                                >
                                  <span>Unggah file</span>
                                  <input
                                    id="files"
                                    type="file"
                                    // value={formData.image}
                                    className="sr-only"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                  />
                                </label>
                                <p className="pl-1">atau seret ke sini</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, maksimal 10MB per file
                              </p>
                            </div>
                          </>
                        )}

                        {formData.image && (
                          <div className="mt-4 text-center">
                            <p className="text-sm text-gray-700 font-medium">
                              {/* File: {formData?.image} */}
                            </p>
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="mt-2 mx-auto h-16 rounded object-contain border"
                            />
                            <button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  image: null,
                                  imageName: "",
                                }))
                              }
                              className="mt-2 text-red-500 hover:underline text-sm"
                            >
                              Hapus file
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  onClick={handleSubmitComplaints}
                  disabled={
                    !isValidWithException(formData) || isSubmitting || isLoading
                  }
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pengaduan"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Panel Pelacakan */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Lacak Pengaduan Anda
                </CardTitle>
                <CardDescription>
                  Masukkan kode pelacakan untuk memeriksa status pengaduan Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div>
                  <Label htmlFor="trackingCode">Kode Pelacakan</Label>
                  <Input
                    id="trackingCode"
                    placeholder="contoh: CMP-123456"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                  />
                </div> */}
                <Link to={`/track?code=${trackingCode}`}>
                  <Button
                    className="w-full"
                    // disabled={!trackingCode}
                  >
                    Lacak Status
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>
                  Isi formulir berikut untuk mengajukan pengaduan. Anda akan
                  menerima kode pelacakan untuk memantau statusnya.
                </CardDescription>
                <CardTitle>Bagaimana Cara Kerjanya?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Ajukan Pengaduan</h4>
                    <p className="text-sm text-gray-600">
                      Isi formulir dengan detail masalah Anda
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Dapatkan Kode Pelacakan</h4>
                    <p className="text-sm text-gray-600">
                      Terima kode unik langsung ke whatsApp anda untuk melacak
                      pengaduan
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Pantau Proses</h4>
                    <p className="text-sm text-gray-600">
                      Lihat pembaruan status dan tanggapan yang otomatis
                      dikirimkan oleh whatsApp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
