"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { useERPKPIs } from "@gaqno-development/frontcore";
import { ShoppingCart, Package, Warehouse, TrendingUp } from "lucide-react";
import { QuickLinksCard } from "../components/QuickLinksCard";
import { StatCard } from "../components/shared";

export default function DashboardPage() {
  const { stats, isLoading } = useERPKPIs();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Painel ERP</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Produtos"
          value={isLoading ? "…" : stats.totalProducts}
          icon={Package}
          isLoading={isLoading}
        />
        <StatCard
          title="Estoque Baixo"
          value={isLoading ? "…" : stats.lowStockCount}
          icon={Warehouse}
          isLoading={isLoading}
          description={
            !isLoading && stats.lowStockCount > 0
              ? "Ação recomendada: Reposição"
              : undefined
          }
          trend={
            !isLoading && stats.lowStockCount > 0
              ? { value: "Atenção", isPositive: false }
              : undefined
          }
        />
        <StatCard
          title="Pedidos (Mês)"
          value="0"
          icon={ShoppingCart}
          description="Aguardando integração"
        />
        <StatCard
          title="Faturamento (Mês)"
          value="R$ 0,00"
          icon={TrendingUp}
          description="Aguardando integração"
        />
      </div>

      <QuickLinksCard />

      <Card>
        <CardHeader>
          <CardTitle>Atividade recente</CardTitle>
          <CardDescription>
            Pedidos recentes e mudanças de estoque aparecerão aqui quando a API
            de pedidos estiver disponível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-4 text-center">
            Nenhuma atividade recente ainda
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
