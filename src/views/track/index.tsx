import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Badge } from "../../components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Search,
    ArrowLeft,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileText,
    Calendar,
    User,
    Package,
    Tag,
} from "lucide-react";
import { Link } from "react-router-dom";
import { handleError } from "../../helper";
import axios from "axios";

const statusConfig = {
    Masuk: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Menunggu",
    },
    Diproses: {
        color: "bg-blue-100 text-blue-800",
        icon: AlertCircle,
        label: "Sedang Diproses",
    },
    Selesai: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Selesai",
    },
    Ditolak: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        label: "Ditolak",
    },
};

type ApiComplaint = {
    id: number;
    code_complaint: string;
    customer_name: string;
    status: string;
    product: { product_name: string };
    category: { category_name: string };
    createdAt: string;
    incidentDate?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    description: string;
    responses?: Array<{
        id: number;
        message: string;
        createdAt: string;
        isAdmin: boolean;
    }>;
};

export default function TrackPage() {
    const [searchParams] = useSearchParams();

    // State
    const [trackingCode, setTrackingCode] = useState(
        searchParams.get("code") || ""
    );
    const [todayComplaints, setTodayComplaints] = useState<ApiComplaint[]>([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchResult, setSearchResult] = useState<ApiComplaint | null>(null);
    // console.log(todayComplaints, "todayComplaints");

    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Helpers untuk badge/status icon
    const getStatusIcon = (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        const Icon = config?.icon || Clock;
        return <Icon className="w-4 h-4" />;
    };

    const getStatusBadge = (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
            <Badge className={`${config?.color} flex items-center gap-1`}>
                {getStatusIcon(status)}
                {config?.label}
            </Badge>
        );
    };

    // 🟡 Fetch pengaduan hari ini
    const getDatasProduct = async () => {
        setIsLoading(true);
        try {
            const resp = await axios.get(
                `${import.meta.env.VITE_PUBLIC_API_URL}/complaints/today`
            );
            setTodayComplaints(resp.data.data);
        } catch (err) {
            console.error(err);
            handleError(err);
            setTodayComplaints([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔵 Filter berdasarkan status (rujukan API kedua)
    const filterByStatus = async (status: string) => {
        setIsLoading(true);
        try {
            const resp = await axios.get(
                `${import.meta.env.VITE_PUBLIC_API_URL}/complaints/filter/${status}`
            );
            setTodayComplaints(resp.data);
        } catch (err) {
            console.error(err);
            handleError(err);
            setTodayComplaints([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔍 Pencarian berdasarkan code (API ketiga)
    const searchByCodeAPI = async (code: string) => {
        if (!code.trim()) return;
        setIsSearching(true);
        try {
            const resp = await axios.get(
                `${import.meta.env.VITE_PUBLIC_API_URL}/complaints/search/${code}`
            );
            setTodayComplaints(resp.data?.data || []);
        } catch (err) {
            console.error(err);
            handleError(err);
            setTodayComplaints([]);
        } finally {
            setIsSearching(false);
        }
    };

    // 🕐 Hook: load data saat mount
    useEffect(() => {
        if (trackingCode === "") {
            getDatasProduct();
        }
    }, [trackingCode]);

    // 🧭 Hook: re-fetch saat ubah filter status
    useEffect(() => {
        if (statusFilter === "all") {
            getDatasProduct();
        } else {
            filterByStatus(statusFilter);
        }
    }, [statusFilter]);

    // 🔁 Trigger search dari param di URL saat mount
    useEffect(() => {
        if (searchParams.get("code")) {
            searchByCodeAPI(searchParams.get("code")!);
        }
    }, []);

    // Handler tombol cari
    const handleSearch = () => {
        searchByCodeAPI(trackingCode);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Lacak Pengaduan
                            </h1>
                        </div>
                        <Link to="/admin">
                            <Button variant="outline">Login Admin</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto p-6">
                {/* 🔍 Pencarian berdasarkan kode */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="w-5 h-5" /> Cari Berdasarkan Kode Pelacakan
                        </CardTitle>
                        <CardDescription>
                            Masukkan kode pelacakan pengaduan Anda untuk melihat status dan
                            pembaruan secara detail.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search">Kode Pelacakan</Label>
                                <Input
                                    id="search"
                                    placeholder="contoh: CMP-123456"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    onClick={handleSearch}
                                    disabled={isSearching || !trackingCode.trim()}
                                >
                                    {isSearching ? "Mencari..." : "Cari"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 💬 Hasil pencarian */}
                {searchResult && (
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" /> Detail Pengaduan
                                    </CardTitle>
                                    <CardDescription>
                                        Kode Pelacakan: {searchResult.code_complaint}
                                    </CardDescription>
                                </div>
                                {getStatusBadge(searchResult.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Info pelanggan & produk */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">Pelanggan:</span>
                                        <span>{searchResult.customer_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">Produk:</span>
                                        <span>{searchResult.product.product_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">Kategori:</span>
                                        <span>{searchResult.category.category_name}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">Tanggal Pengaduan:</span>
                                        <span>{searchResult.createdAt}</span>
                                    </div>
                                    {searchResult.incidentDate && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">Tanggal Kejadian:</span>
                                            <span>{searchResult.incidentDate}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <h4 className="font-medium mb-2">Deskripsi Masalah:</h4>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    {searchResult.description}
                                </p>
                            </div>

                            {/* Riwayat komunikasi */}
                            {/* {searchResult.responses?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-4">Riwayat Komunikasi:</h4>
                  <div className="space-y-3">
                    {searchResult.responses.map((res) => (
                      <div key={res.id} className={`p-4 rounded-lg ${res.isAdmin ? "bg-blue-50 border-l-4 border-blue-400" : "bg-gray-50 border-l-4 border-gray-400"}`}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-sm">{res.isAdmin ? "Tim Dukungan" : "Anda"}</span>
                          <span className="text-xs text-gray-500">{res.createdAt}</span>
                        </div>
                        <p className="text-gray-700">{res.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
                        </CardContent>
                    </Card>
                )}

                {/* 🚫 Saat pencarian kosong */}
                {todayComplaints?.length === 0 && trackingCode && (
                    <Card className="mb-8">
                        <CardContent className="text-center py-8">
                            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Pengaduan Tidak Ditemukan
                            </h3>
                            <p className="text-gray-600">
                                Tidak ditemukan pengaduan dengan kode "{trackingCode}". Silakan
                                periksa kembali kode Anda.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* 📋 Pengaduan Terbaru / Filter */}

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Pengaduan Terbaru</CardTitle>
                                <CardDescription>
                                    Ringkasan pengaduan yang baru saja dikirim
                                </CardDescription>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="Masuk">Menunggu</SelectItem>
                                    <SelectItem value="Diproses">Sedang Diproses</SelectItem>
                                    <SelectItem value="Selesai">Selesai</SelectItem>
                                    <SelectItem value="Ditolak">Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    {todayComplaints?.length !== 0 && (
                        <CardContent>
                            {isLoading ? (
                                <p className="text-center py-8 text-gray-500">Memuat...</p>
                            ) : (
                                <div className="space-y-4">
                                    {todayComplaints.map((c) => (
                                        <div
                                            key={c.id}
                                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-medium">{c.code_complaint}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {c.customer_name}
                                                    </p>
                                                </div>
                                                {getStatusBadge(c.status)}
                                            </div>
                                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium">Produk:</span>{" "}
                                                    {c.product.product_name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Kategori:</span>{" "}
                                                    {c.category.category_name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Tanggal:</span>{" "}
                                                    {c.createdAt}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                {c.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    )}
                </Card>
                {/* <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Pengaduan Terbaru</CardTitle>
                <CardDescription>
                  Ringkasan pengaduan yang baru saja dikirim
                </CardDescription>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Masuk">Menunggu</SelectItem>
                  <SelectItem value="Diproses">Sedang Diproses</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-gray-500">Memuat...</p>
            ) : (
              <div className="space-y-4">
                {todayComplaints.map((c) => (
                  <div
                    key={c.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{c.code_complaint}</h4>
                        <p className="text-sm text-gray-600">
                          {c.customer_name}
                        </p>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Produk:</span>{" "}
                        {c.product.product_name}
                      </div>
                      <div>
                        <span className="font-medium">Kategori:</span>{" "}
                        {c.category.category_name}
                      </div>
                      <div>
                        <span className="font-medium">Tanggal:</span>{" "}
                        {c.createdAt}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card> */}
            </div>
        </div>
    );
}
