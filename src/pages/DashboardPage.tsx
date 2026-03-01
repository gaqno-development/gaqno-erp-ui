"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { ShoppingCart, Package, Warehouse, TrendingUp } from "lucide-react";
import { QuickLinksCard } from "../components/QuickLinksCard";
import { StatCard } from "../components/shared";

export default function DashboardPage() {
  const { statCards, isLoading } = useDashboardStats();

  const getIcon = (title: string) => {
    switch (title) {
      case "Total de Produtos":
        return Package;
      case "Estoque Baixo":
        return Warehouse;
      case "Pedidos (Mês)":
        return ShoppingCart;
      case "Faturamento (Mês)":
        return TrendingUp;
      default:
        return undefined;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Painel ERP</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={getIcon(card.title)}
            isLoading={isLoading}
            description={card.description}
            trend={card.trend}
          />
        ))}
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
