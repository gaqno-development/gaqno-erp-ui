"use client";

import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatCard,
  QuickLinksCard,
  AnimatedEntry,
  Button,
  Badge,
} from "@gaqno-development/frontcore/components/ui";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useErpOrders } from "@gaqno-development/frontcore/hooks/erp";
import { formatCurrency } from "@gaqno-development/frontcore/utils";
import type { ErpOrderStatus } from "@gaqno-development/types";
import {
  ShoppingCart,
  Package,
  Warehouse,
  TrendingUp,
  Sparkles,
  LayoutDashboard,
  Building2,
  ClipboardList,
  Truck,
  ArrowRight,
  Clock,
} from "lucide-react";

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const ORDER_STATUS_VARIANT: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "outline",
  processing: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

function formatRelativeTime(iso: string): string {
  try {
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `${mins}min atrás`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  } catch {
    return "";
  }
}

const ICON_MAP: Record<string, typeof Package> = {
  "Total de Produtos": Package,
  "Estoque Baixo": Warehouse,
  "Pedidos (Mês)": ShoppingCart,
  "Faturamento (Mês)": TrendingUp,
};

export default function DashboardPage() {
  const { statCards, isLoading } = useDashboardStats();
  const ordersQuery = useErpOrders({ limit: 5 });
  const recentOrders = ordersQuery.data ?? [];

  return (
    <div className="space-y-8">
      <AnimatedEntry direction="fade" duration={0.2}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Painel ERP</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão geral de produtos, pedidos e estoque
          </p>
        </div>
      </AnimatedEntry>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <AnimatedEntry key={card.title} direction="up" delay={index * 0.06}>
            <StatCard
              title={card.title}
              value={card.value}
              icon={ICON_MAP[card.title]}
              isLoading={isLoading}
              description={card.description}
              trend={card.trend}
            />
          </AnimatedEntry>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <AnimatedEntry direction="up" delay={0.15} className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">Últimos pedidos</CardTitle>
                <CardDescription>Pedidos mais recentes do período</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="group">
                <Link to="/erp/orders" className="text-muted-foreground">
                  Ver todos
                  <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {ordersQuery.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum pedido registrado ainda
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentOrders.map((order, i) => {
                    const total = typeof order.total === "string" ? parseFloat(order.total) : order.total;
                    return (
                      <Link
                        key={order.id}
                        to={`/erp/orders/${order.id}`}
                        className="flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {order.customerName || order.customerEmail || `Pedido ${order.id.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-2">
                          <Badge variant={ORDER_STATUS_VARIANT[order.status] ?? "secondary"} className="text-[10px]">
                            {ORDER_STATUS_LABEL[order.status] ?? order.status}
                          </Badge>
                          <span className="text-sm font-medium tabular-nums">
                            {formatCurrency(Number.isNaN(total) ? 0 : total)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedEntry>

        <AnimatedEntry direction="up" delay={0.2} className="lg:col-span-2">
          <QuickLinksCard
            title="Acesso rápido"
            titleIcon={LayoutDashboard}
            description="Navegue para os módulos do ERP"
            links={[
              { to: "/erp/catalog", label: "Catálogo", icon: Package, variant: "default" },
              { to: "/erp/orders", label: "Pedidos", icon: ShoppingCart },
              { to: "/erp/inventory", label: "Estoque", icon: Warehouse },
              { to: "/erp/suppliers", label: "Fornecedores", icon: Building2 },
              { to: "/erp/purchasing", label: "Compras", icon: ClipboardList },
              { to: "/erp/logistics", label: "Logística", icon: Truck },
              { to: "/erp/ai-content", label: "Conteúdo IA", icon: Sparkles },
            ]}
          />
        </AnimatedEntry>
      </div>
    </div>
  );
}
