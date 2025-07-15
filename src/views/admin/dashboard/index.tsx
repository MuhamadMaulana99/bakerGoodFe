import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
    BarChart3,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Users,
    Package,
    Tag,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { encryptStorage } from "../../../config/encryptStorage";
import fetchApi from "../../../config/fetchApi";
import axios from "axios";
import { handleError } from "../../../helper";

interface Category {
    id: number;
    category_name: string;
}

export default function AdminDashboard() {
    const userInfo = encryptStorage.getItem("info");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [datasCategory, setDatasCategody] = useState<Category[]>([]);
    const [data, setData] = useState<any>({});
    const [dataComplaints, setDataConplaints] = useState<any>([]);
    const [error, setError] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const getAllProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetchApi().get("/complaints/report");
            setData(response?.data?.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("❌ Gagal ambil semua produk:", error);
            throw error;
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
            console.error("Error saat fetching:", err);
            setDatasCategody([]);
            setIsLoading(false);
            handleError(err);
        }
    };

    useEffect(() => {
        if (userInfo?.token) {
            setIsAuthenticated(true);
        } else {
            navigate("/admin");
        }
    }, [userInfo]);

    useEffect(() => {
        getAllProducts();
        getDatasCategory();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        navigate("/admin");
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    if (!isAuthenticated) {
        return <div>Memuat...</div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Menunggu":
                return "bg-yellow-100 text-yellow-800";
            case "Dalam Proses":
                return "bg-blue-100 text-blue-800";
            case "Selesai":
                return "bg-green-100 text-green-800";
            case "Ditolak":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Tinggi":
                return "bg-red-100 text-red-800";
            case "Sedang":
                return "bg-yellow-100 text-yellow-800";
            case "Rendah":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 ml-2 md:ml-0">
                                Dasbor Admin
                            </h1>
                        </div>
                        <nav className="hidden md:flex items-center space-x-4">
                            <Link to="/admin/complaints">
                                <Button variant="ghost">Pengaduan</Button>
                            </Link>
                            <Link to="/admin/products">
                                <Button variant="ghost">Produk</Button>
                            </Link>
                            <Link to="/admin/categories">
                                <Button variant="ghost">Kategori</Button>
                            </Link>
                            <Link to="/admin/reports">
                                <Button variant="ghost">Laporan</Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Keluar</span>
                            </Button>
                        </nav>
                        <div className="md:hidden">
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="flex items-center gap-2"
                                size="sm"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/admin/complaints"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                        >
                            Pengaduan
                        </Link>
                        <Link
                            to="/admin/products"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                        >
                            Produk
                        </Link>
                        <Link
                            to="/admin/categories"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                        >
                            Kategori
                        </Link>
                        <Link
                            to="/admin/reports"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            onClick={toggleMobileMenu}
                        >
                            Laporan
                        </Link>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                {/* Ringkasan Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <Card>
                        <CardHeader className="flex justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Pengaduan
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data?.summary?.totalComplaints}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data?.summary?.pendingComplaints}
                            </div>
                            <p className="text-xs text-muted-foreground">Menunggu ditinjau</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Dalam Proses
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data?.summary?.inProgressComplaints}
                            </div>
                            <p className="text-xs text-muted-foreground">Sedang diproses</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {data?.summary?.resolvedComplaints}
                            </div>
                            <p className="text-xs text-muted-foreground">Selesai ditangani</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Grafik Bulanan & Kategori */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Tren Pengaduan Bulanan
                            </CardTitle>
                            <CardDescription>
                                Jumlah pengaduan dalam 6 bulan terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data?.monthly?.map((item: any, index: number) => (
                                <div key={index} className="flex items-center gap-4 mb-2">
                                    <div className="w-12 text-sm">{item.month}</div>
                                    <div className="flex-1 bg-gray-200 h-2 rounded-full">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${(item.complaints / 70) * 100}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-right text-sm">{item.complaints}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Berdasarkan Kategori
                            </CardTitle>
                            <CardDescription>
                                Distribusi pengaduan berdasarkan jenis
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data?.byCategory?.map((item: any, index: number) => (
                                <div key={index} className="space-y-2 mb-2">
                                    <div className="flex justify-between text-sm">
                                        <span>{item.category}</span>
                                        <span>
                                            {item.count} ({item.percentage}%)
                                        </span>
                                    </div>
                                    <div className="bg-gray-200 h-2 rounded-full">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-6 sm:mb-8">
                    {dataComplaints.map((complaint: any) => (
                        <div
                            key={complaint.id}
                            className="p-3 sm:p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 mb-2"
                        >
                            <div className="w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                    <h4 className="font-medium text-sm sm:text-base">
                                        {complaint.code_complaint}
                                    </h4>
                                    <Badge className={getStatusColor(complaint.status)}>
                                        {complaint.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                    <div>
                                        <Users className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />{" "}
                                        {complaint.customer_name}
                                    </div>
                                    <div>
                                        <Package className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />{" "}
                                        {complaint?.product?.product_name}
                                    </div>
                                    <div>
                                        <Tag className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />{" "}
                                        {complaint.category?.category_name}
                                    </div>
                                    <div>{complaint.date_occurrence}</div>
                                </div>
                            </div>
                            <Link 
                                to={`/admin/complaints/${complaint.id}`}
                                className="mt-2 sm:mt-0 w-full sm:w-auto"
                            >
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    Lihat
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="hover:shadow-md cursor-pointer">
                        <Link to="/admin/complaints">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Kelola Pengaduan
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Lihat dan tanggapi pengaduan pelanggan
                                </CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-md cursor-pointer">
                        <Link to="/admin/products">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Kelola Produk
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Tambah, ubah, dan atur produk
                                </CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-md cursor-pointer">
                        <Link to="/admin/reports">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Buat Laporan
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Buat laporan dan ekspor data
                                </CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}