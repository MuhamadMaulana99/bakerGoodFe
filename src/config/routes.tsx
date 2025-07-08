import { RouteProps } from "react-router";
import HomePage from "../views/pengaduan";
import TrackPage from "../views/track";
import AdminLoginPage from "../views/admin"
import AdminDashboard from "../views/admin/dashboard";
import ComplaintsManagement from "../views/admin/complaints";
import ProductsManagement from "../views/admin/products"
import CategoriesManagement from "../views/admin/category"
import ReportManagement from "../views/admin/report"

type AppRouteProps = RouteProps & {
  meta?: Record<string, React.ReactNode>;
};

const globalRoutes: AppRouteProps[] = [
  {
    id: "pengaduan",
    element: <HomePage />,
    path: "/pengaduan",
  },
  {
    id: "track",
    element: <TrackPage />,
    path: "/track"
  },
  {
    id: "admin",
    element: <AdminLoginPage />,
    path: "/admin"
  },
  {
    id: "admin-dashboard",
    element: <AdminDashboard />,
    path: "/admin/dashboard"
  },
  {
    id: "admin-complaints",
    element: <ComplaintsManagement />,
    path: "/admin/complaints"
  },
  {
    id: "admin-products",
    element: <ProductsManagement />,
    path: "/admin/products"
  },
  {
    id: "admin-category",
    element: <CategoriesManagement />,
    path: "/admin/categories"
  },
  {
    id: "admin-report",
    element: <ReportManagement />,
    path: "/admin/reports"
  },
];

const allRoutes = [...globalRoutes];

export type { AppRouteProps };
export default allRoutes;
export { globalRoutes };
