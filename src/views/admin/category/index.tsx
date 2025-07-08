"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ArrowLeft,
    Tag,
    FileText,
    Calendar,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { encryptStorage } from "../../../config/encryptStorage";
import fetchApi from "../../../config/fetchApi";
import { handleError } from "../../../helper";
import axios from "axios";
import toast from "react-hot-toast";
import useDebounce from "../../../config/useDebounce";
// Data kategori contoh

interface Category {
    id: number;
    category_name: string;
}
export default function CategoriesManagement() {
    const userInfo = encryptStorage.getItem("info");
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [datasCategory, setDatasCategody] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [formData, setFormData] = useState<any>({
        category_name: "",
    });
    const debouncedSearchTerm = useDebounce(searchTerm, 1000);
    useEffect(() => {
        if (userInfo?.token) {
            setIsAuthenticated(true);
        } else {
            navigate("/admin");
        }
    }, [userInfo]);

    const getDatasCategory = async () => {
        setIsLoading(true);
        try {
            const url = `${import.meta.env.VITE_PUBLIC_API_URL}/categories?search=${debouncedSearchTerm}`;
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
    // console.log(categoryFilter, categoryFilter);
    const handleSubmitCategory = async () => {
        setIsLoading(true);
        try {
            await fetchApi().post(`/categories`, {
                category_name: formData?.category_name,
            });

            setFormData({
                category_name: "",
            });
            setIsAddDialogOpen(false);
            toast.success("Category berhasil di Tambahkan");
            getDatasCategory();
            // console.log("Response diterima:", response?.data); // Debug 3
            setIsLoading(false);
        } catch (err) {
            setIsAddDialogOpen(false);
            console.error("Error saat fetching:", err); // Debug 4
            setIsLoading(false);
            handleError(err);
        }
    };
    const handleEditCategory = async () => {
        setIsLoading(true);
        try {
            const response = await fetchApi().post(
                `/categories/${selectedCategory?.id}`,
                {
                    category_name: formData?.category_name,
                }
            );

            setFormData({
                category_name: "",
            });
            setIsAddDialogOpen(false);
            toast.success("Category berhasil di Tambahkan");
            getDatasCategory();
            // console.log("Response diterima:", response?.data); // Debug 3
            setIsLoading(false);
        } catch (err) {
            setIsAddDialogOpen(false);
            console.error("Error saat fetching:", err); // Debug 4
            setIsLoading(false);
            handleError(err);
        }
    };

    const handleDeleteCategories = async (complaint: number) => {
        setIsLoading(true);
        try {
            const response = await fetchApi().delete(
                `${import.meta.env.VITE_PUBLIC_API_URL}/categories/${complaint}`
            );
            // console.log("Response diterima:", response?.data); // Debug 3
            getDatasCategory();
            toast.success(" Category Berhasil Menghapus");
            setIsLoading(false);
        } catch (err) {
            console.error("Error saat fetching:", err); // Debug 4
            setIsLoading(false);
            handleError(err);
        }
    };
    // console.log(formData, "formData");

    useEffect(() => {
        getDatasCategory();
    }, [debouncedSearchTerm]);

    if (!isAuthenticated) return <div>Memuat...</div>;

    const openEditDialog = (category: any) => {
        setFormData({
            category_name: category?.category_name,
        });
        setSelectedCategory(category);
        setIsEditDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/admin/dashboard">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke Dashboard
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Manajemen Kategori
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                {/* Pencarian dan Tambah */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Kategori Pengaduan
                                </CardTitle>
                                <CardDescription>
                                    Kelola sistem pengelompokan pengaduan
                                </CardDescription>
                            </div>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Tambah Kategori
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Tambah Kategori Baru</DialogTitle>
                                        <DialogDescription>
                                            Masukkan informasi kategori pengaduan
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <div>
                                                <Label htmlFor="edit-name">Nama Kategori</Label>
                                                <Input
                                                    id="edit-name"
                                                    value={formData.category_name}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            category_name: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Masukkan nama kategori"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setFormData({
                                                        category_name: "",
                                                    });
                                                    setIsAddDialogOpen(false);
                                                }}
                                            >
                                                Batal
                                            </Button>
                                            <Button onClick={handleSubmitCategory}>Tambah</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Cari kategori..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Daftar Kategori */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {datasCategory.map((category: any) => (
                        <Card
                            key={category.id}
                            className="hover:shadow-md transition-shadow"
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Tag className="w-5 h-5" />
                                            {category.category_name}
                                        </CardTitle>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(category)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteCategories(category.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* <p className="text-gray-600 text-sm">{category.description}</p> */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Total Pengaduan:</span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <FileText className="w-4 h-4" />
                                            {category.total_complaints}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Dibuat:</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {category.createdAt}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {datasCategory.length === 0 && !isLoading && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Kategori tidak ditemukan
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm
                                    ? "Coba ubah kata kunci pencarian."
                                    : "Silakan tambahkan kategori pertama Anda."}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Dialog Edit */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ubah Kategori</DialogTitle>
                            <DialogDescription>
                                Perbarui informasi kategori pengaduan
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Nama Kategori</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.category_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category_name: e.target.value })
                                    }
                                    placeholder="Masukkan nama kategori"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFormData({
                                            category_name: "",
                                        });
                                        setIsEditDialogOpen(false);
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button onClick={handleEditCategory}>Perbarui</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
