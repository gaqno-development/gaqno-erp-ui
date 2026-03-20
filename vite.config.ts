import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { FEDERATION_SHARED } from "@gaqno-development/frontcore/config/federation-shared";

export default defineConfig(async () => {
  const tailwindcss = (await import("@tailwindcss/vite")).default;
  const isProd = process.env.NODE_ENV === "production";
  const base = isProd ? "/erp/" : "/";

  return {
    base,
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    server: {
      port: 3004,
      origin: "http://localhost:3004",
      fs: {
        allow: [".", "../shared"],
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "erp",
        filename: "remoteEntry.js",
        exposes: {
          "./App": "./src/App.tsx",
          "./ERPLayout": "./src/ERPLayout.tsx",
          "./DashboardPage": "./src/pages/DashboardPage.tsx",
          "./CatalogPage": "./src/pages/CatalogPage.tsx",
          "./ProductDetailPage": "./src/pages/ProductDetailPage.tsx",
          "./ProductWizardPage": "./src/pages/ProductWizardPage.tsx",
          "./InventoryPage": "./src/pages/InventoryPage.tsx",
          "./OrdersListPage": "./src/pages/OrdersListPage.tsx",
          "./OrderDetailPage": "./src/pages/OrderDetailPage.tsx",
          "./AIContentPage": "./src/pages/AIContentPage.tsx",
          "./SuppliersPage": "./src/pages/SuppliersPage.tsx",
          "./PurchaseOrdersPage": "./src/pages/PurchaseOrdersPage.tsx",
          "./ShipmentsPage": "./src/pages/ShipmentsPage.tsx",
        },
        shared: FEDERATION_SHARED as any,
      }),
    ],
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
      commonjsOptions: {
        transformMixedEsModules: true,
        requireReturnsDefault: "preferred",
      },
      rollupOptions: { output: { format: "es" } },
    },
    optimizeDeps: { include: ["use-sync-external-store"] },
  };
});
