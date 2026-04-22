import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GlassBackground,
  GlassTopBar,
} from "@gaqno-development/frontcore/components/glass";
import { MobileBottomNav } from "@gaqno-development/frontcore/components/layout";
import { cn } from "@gaqno-development/frontcore/lib/utils";
import { useTranslation } from "@gaqno-development/frontcore/i18n";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Sparkles,
  Building2,
  ClipboardList,
  Truck,
} from "lucide-react";

const TAB_KEYS = [
  { id: "dashboard", href: "/erp/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, tKey: "erp.dashboard" },
  { id: "catalog", href: "/erp/catalog", icon: <Package className="h-4 w-4" />, tKey: "erp.catalog" },
  { id: "orders", href: "/erp/orders", icon: <ShoppingCart className="h-4 w-4" />, tKey: "erp.orders" },
  { id: "inventory", href: "/erp/inventory", icon: <Warehouse className="h-4 w-4" />, tKey: "erp.inventory" },
  { id: "suppliers", href: "/erp/suppliers", icon: <Building2 className="h-4 w-4" />, tKey: "erp.suppliers" },
  { id: "purchasing", href: "/erp/purchasing", icon: <ClipboardList className="h-4 w-4" />, tKey: "erp.purchasing" },
  { id: "logistics", href: "/erp/logistics", icon: <Truck className="h-4 w-4" />, tKey: "erp.logistics" },
  { id: "ai-content", href: "/erp/ai-content", icon: <Sparkles className="h-4 w-4" />, tKey: "erp.aiContent" },
] as const;

const ERP_EYEBROW = "ERP · Operações";

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

  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? null;

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <GlassBackground intensity="subtle" />
      <div className="relative z-10 flex h-full min-h-0 w-full flex-col">
        <GlassTopBar
          eyebrow={ERP_EYEBROW}
          title={t("erp.title")}
          description={activeLabel ?? undefined}
        />
        <nav
          aria-label="ERP sections"
          className="hidden shrink-0 border-b border-border/50 bg-[color-mix(in_srgb,var(--card)_55%,transparent)] backdrop-blur-xl md:block"
        >
          <div className="flex items-center gap-1 overflow-x-auto px-6 py-2.5">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    "text-muted-foreground hover:text-foreground",
                    isActive
                      ? "bg-[var(--erp-accent-soft)] text-[var(--erp-accent-strong)] shadow-[0_8px_24px_-14px_var(--erp-accent-ring)] ring-1 ring-[var(--erp-accent-ring)]"
                      : "hover:bg-[color-mix(in_srgb,var(--muted)_55%,transparent)]",
                  )}
                >
                  <span>{tab.icon}</span>
                  <span className="font-display tracking-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
        <main className="mx-auto flex w-full min-h-0 flex-1 flex-col overflow-auto px-4 pb-20 pt-4 md:px-6 md:pb-6">
          {children}
        </main>
        {typeof document !== "undefined" && (
          <div className="md:hidden">
            <MobileBottomNav
              items={tabs.slice(0, 5).map((tab) => ({ id: tab.id, label: tab.label, icon: tab.icon }))}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              layoutId="erpActiveTab"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ERPLayout;
