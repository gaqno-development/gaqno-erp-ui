import { Routes, Route, Navigate } from "react-router-dom";
import { initI18n, I18nProvider } from "@gaqno-development/frontcore/i18n";
import { ERPLayout } from "./ERPLayout";
import DashboardPage from "./pages/DashboardPage";
import CatalogPage from "./pages/CatalogPage";
import ProductFormPage from "./pages/ProductFormPage";
import OrdersListPage from "./pages/OrdersListPage";
import InventoryPage from "./pages/InventoryPage";
import AIContentPage from "./pages/AIContentPage";

initI18n();

export default function App() {
  return (
    <I18nProvider>
      <Routes>
        <Route path="/erp" element={<Navigate to="/erp/dashboard" replace />} />
        <Route
          path="/erp/dashboard"
          element={
            <ERPLayout>
              <DashboardPage />
            </ERPLayout>
          }
        />
        <Route
          path="/erp/catalog"
          element={
            <ERPLayout>
              <CatalogPage />
            </ERPLayout>
          }
        />
        <Route
          path="/erp/catalog/new"
          element={
            <ERPLayout>
              <ProductFormPage />
            </ERPLayout>
          }
        />
        <Route
          path="/erp/catalog/:id/edit"
          element={
            <ERPLayout>
              <ProductFormPage />
            </ERPLayout>
          }
        />
        <Route
          path="/erp/orders"
          element={
            <ERPLayout>
              <OrdersListPage />
            </ERPLayout>
          }
        />
        <Route
          path="/erp/inventory"
          element={
            <ERPLayout>
              <InventoryPage />
            </ERPLayout>
          }
        />
        <Route
          path="/erp/ai-content"
          element={
            <ERPLayout>
              <AIContentPage />
            </ERPLayout>
          }
        />
        <Route path="/erp/*" element={<Navigate to="/erp/dashboard" replace />} />
      </Routes>
    </I18nProvider>
  );
}
