import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "@gaqno-development/frontcore/components/layout";
import { useTranslation } from "@gaqno-development/frontcore/i18n";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Sparkles,
} from "lucide-react";

const TAB_KEYS = [
  { id: "dashboard", href: "/erp/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, tKey: "erp.dashboard" },
  { id: "catalog", href: "/erp/catalog", icon: <Package className="h-4 w-4" />, tKey: "erp.catalog" },
  { id: "orders", href: "/erp/orders", icon: <ShoppingCart className="h-4 w-4" />, tKey: "erp.orders" },
  { id: "inventory", href: "/erp/inventory", icon: <Warehouse className="h-4 w-4" />, tKey: "erp.inventory" },
  { id: "ai-content", href: "/erp/ai-content", icon: <Sparkles className="h-4 w-4" />, tKey: "erp.aiContent" },
] as const;

function getActiveTab(pathname: string): string {
  for (const tab of TAB_KEYS) {
    if (pathname.startsWith(tab.href)) return tab.id;
  }
  return "dashboard";
}

export function ERPLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("navigation");
  const activeTab = getActiveTab(pathname);

  const tabs = TAB_KEYS.map((tab) => ({
    id: tab.id,
    label: t(tab.tKey),
    icon: tab.icon,
    href: tab.href,
  }));

  const handleTabChange = (tabId: string) => {
    const tab = TAB_KEYS.find((k) => k.id === tabId);
    if (tab) navigate(tab.href);
  };

  return (
    <PageLayout
      title={t("erp.title")}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      layoutId="erpActiveTab"
    >
      {children}
    </PageLayout>
  );
}

export default ERPLayout;
