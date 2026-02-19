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
import { Package, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AIContentPage from "./pages/AIContentPage";

function ERPLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const active = pathname.startsWith("/erp/ai-content")
    ? "ai-content"
    : "catalog";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold mb-3">ERP</h1>
          <Tabs value={active}>
            <TabsList>
              <TabsTrigger value="catalog" asChild>
                <Link to="/erp/catalog">
                  <Package className="h-4 w-4" />
                  Catalog
                </Link>
              </TabsTrigger>
              <TabsTrigger value="ai-content" asChild>
                <Link to="/erp/ai-content">
                  <Sparkles className="h-4 w-4" />
                  AI Content
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
              element={<Navigate to="/erp/catalog" replace />}
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
              path="/erp/ai-content"
              element={
                <ERPLayout>
                  <AIContentPage />
                </ERPLayout>
              }
            />
            <Route path="*" element={<Navigate to="/erp/catalog" replace />} />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
