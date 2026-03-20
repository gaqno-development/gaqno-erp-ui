import { Routes, Route, Navigate } from "react-router-dom";
import { initI18n, I18nProvider } from "@gaqno-development/frontcore/i18n";
import DashboardPage from "./pages/DashboardPage";
import CatalogPage from "./pages/CatalogPage";
import ProductFormPage from "./pages/ProductFormPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrdersListPage from "./pages/OrdersListPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import InventoryPage from "./pages/InventoryPage";
import AIContentPage from "./pages/AIContentPage";
import SuppliersPage from "./pages/SuppliersPage";
import PurchaseOrdersPage from "./pages/PurchaseOrdersPage";
import ShipmentsPage from "./pages/ShipmentsPage";

initI18n();

export default function App() {
  return (
    <I18nProvider>
      <Routes>
        <Route path="/erp" element={<Navigate to="/erp/dashboard" replace />} />
        <Route path="/erp/dashboard" element={<DashboardPage />} />
        <Route path="/erp/catalog" element={<CatalogPage />} />
        <Route path="/erp/catalog/new" element={<ProductFormPage />} />
        <Route path="/erp/catalog/:id/edit" element={<ProductFormPage />} />
        <Route path="/erp/catalog/:id" element={<ProductDetailPage />} />
        <Route path="/erp/orders" element={<OrdersListPage />} />
        <Route path="/erp/orders/:id" element={<OrderDetailPage />} />
        <Route path="/erp/inventory" element={<InventoryPage />} />
        <Route path="/erp/suppliers" element={<SuppliersPage />} />
        <Route path="/erp/purchasing" element={<PurchaseOrdersPage />} />
        <Route path="/erp/logistics" element={<ShipmentsPage />} />
        <Route path="/erp/ai-content" element={<AIContentPage />} />
        <Route path="/erp/*" element={<Navigate to="/erp/dashboard" replace />} />
      </Routes>
    </I18nProvider>
  );
}
