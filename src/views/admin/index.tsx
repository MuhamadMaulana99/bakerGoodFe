import { useState } from "react";
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
import { Lock, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import fetchApi from "../../config/fetchApi";
import { EncryptStorage } from "encrypt-storage";

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loginService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetchApi("auth").post("/login", {
        username: credentials.username,
        password: credentials.password,
      });

      console.log("✅ Login Response:", response.data);

      const encryptStorage = new EncryptStorage(
        import.meta.env.VITE_PUBLIC_ENCRYPT_STORAGE_SECRET_KEY!
      );
      encryptStorage.setItem("info", response.data);

      window.location.href = "/admin/dashboard"
    } catch (err: any) {
      console.error("❌ Login Error:", err);
      setError("Gagal login. Periksa kembali username/password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Login Admin</CardTitle>
            <CardDescription>
              Masuk untuk mengelola sistem pengaduan pelanggan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={loginService} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    className="pl-10"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sedang masuk..." : "Masuk"}
              </Button>

              {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Akun Demo:</p>
                <p className="text-sm font-mono">
                  Username: <strong>admin</strong>
                  <br />
                  Password: <strong>admin123</strong>
                </p>
              </div> */}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
