import React from "react";
import {
  QueryProvider,
  AuthProvider,
  TenantProvider,
} from "@gaqno-development/frontcore";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@gaqno-development/frontcore/components/ui";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Sparkles,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductFormPage from "./pages/ProductFormPage";
import AIContentPage from "./pages/AIContentPage";
import OrdersListPage from "./pages/OrdersListPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import InventoryPage from "./pages/InventoryPage";

function getErpActiveTab(pathname: string): string {
  if (pathname.startsWith("/erp/dashboard")) return "dashboard";
  if (pathname.startsWith("/erp/catalog")) return "catalog";
  if (pathname.startsWith("/erp/orders")) return "orders";
  if (pathname.startsWith("/erp/inventory")) return "inventory";
  if (pathname.startsWith("/erp/ai-content")) return "ai-content";
  return "dashboard";
}

function ERPLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const active = getErpActiveTab(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold mb-3">ERP</h1>
          <Tabs value={active}>
            <TabsList className="flex flex-wrap gap-1">
              <TabsTrigger value="dashboard" asChild>
                <Link to="/erp/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Painel
                </Link>
              </TabsTrigger>
              <TabsTrigger value="catalog" asChild>
                <Link to="/erp/catalog">
                  <Package className="h-4 w-4" />
                  Catálogo
                </Link>
              </TabsTrigger>
              <TabsTrigger value="orders" asChild>
                <Link to="/erp/orders">
                  <ShoppingCart className="h-4 w-4" />
                  Pedidos
                </Link>
              </TabsTrigger>
              <TabsTrigger value="inventory" asChild>
                <Link to="/erp/inventory">
                  <Warehouse className="h-4 w-4" />
                  Estoque
                </Link>
              </TabsTrigger>
              <TabsTrigger value="ai-content" asChild>
                <Link to="/erp/ai-content">
                  <Sparkles className="h-4 w-4" />
                  Conteúdo de IA
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <TenantProvider>
          <Routes>
            <Route
              path="/erp"
              element={<Navigate to="/erp/dashboard" replace />}
            />
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
              path="/erp/catalog/:id"
              element={
                <ERPLayout>
                  <ProductDetailPage />
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
              path="/erp/orders/:id"
              element={
                <ERPLayout>
                  <OrderDetailPage />
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
            <Route path="*" element={<Navigate to="/erp/dashboard" replace />} />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
