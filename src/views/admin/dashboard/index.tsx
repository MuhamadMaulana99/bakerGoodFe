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
    const navigate = useNavigate();

    const getAllProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetchApi().get("/complaints/report");
            // console.log(response, 'sss')
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
            // console.log("Response diterima:", response?.data); // Debug 3
            setIsLoading(false);
            setDatasCategody(response.data);
        } catch (err) {
            console.error("Error saat fetching:", err); // Debug 4
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
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-900">Dasbor Admin</h1>
                        <nav className="flex items-center space-x-4">
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
                                Keluar
                            </Button>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                {/* Ringkasan Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                            {/* <p className="text-xs text-muted-foreground">
                +{data?.summary?.thisMonth - data?.summary?.lastMonth} dari
                bulan lalu
              </p> */}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
                                    <div className="w-12">{item.month}</div>
                                    <div className="flex-1 bg-gray-200 h-2 rounded-full">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${(item.complaints / 70) * 100}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-right">{item.complaints}</div>
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

                <div className="">
                    {dataComplaints.map((complaint: any) => (
                        <div
                            key={complaint.id}
                            className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50"
                        >
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <h4 className="font-medium">
                                        {complaint.code_complaint}
                                    </h4>
                                    <Badge className={getStatusColor(complaint.status)}>
                                        {complaint.status}
                                    </Badge>
                                    {/* <Badge className={getPriorityColor(complaint.priority)}>
                        {complaint.priority}
                      </Badge> */}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                    <div>
                                        <Users className="inline w-4 h-4 mr-1" />{" "}
                                        {complaint.customer_name}
                                    </div>
                                    <div>
                                        <Package className="inline w-4 h-4 mr-1" />{" "}
                                        {complaint?.product?.product_name}
                                    </div>
                                    <div>
                                        <Tag className="inline w-4 h-4 mr-1" />{" "}
                                        {complaint.category?.category_name}
                                    </div>
                                    <div>{complaint.date_occurrence}</div>
                                </div>
                            </div>
                            <Link to={`/admin/complaints/${complaint.id}`}>
                                <Button variant="outline" size="sm">
                                    Lihat
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-1">
                    <Card className="hover:shadow-md cursor-pointer">
                        <Link to="/admin/complaints">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Kelola Pengaduan
                                </CardTitle>
                                <CardDescription>
                                    Lihat dan tanggapi pengaduan pelanggan
                                </CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-md cursor-pointer">
                        <Link to="/admin/products">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Kelola Produk
                                </CardTitle>
                                <CardDescription>Tambah, ubah, dan atur produk</CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-md cursor-pointer">
                        <Link to="/admin/reports">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Buat Laporan
                                </CardTitle>
                                <CardDescription>Buat laporan dan ekspor data</CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
