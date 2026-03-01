import { useERPKPIs } from "@gaqno-development/frontcore";

interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  monthlyOrders: number;
  monthlyRevenue: string;
}

interface DashboardStatCard {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function useDashboardStats() {
  const { stats, isLoading, error } = useERPKPIs();

  const getStatCards = (): DashboardStatCard[] => {
    const baseStats: DashboardStats = {
      totalProducts: stats?.totalProducts ?? 0,
      lowStockCount: stats?.lowStockCount ?? 0,
      monthlyOrders: 0,
      monthlyRevenue: "R$ 0,00",
    };

    return [
      {
        title: "Total de Produtos",
        value: isLoading ? "…" : baseStats.totalProducts,
      },
      {
        title: "Estoque Baixo",
        value: isLoading ? "…" : baseStats.lowStockCount,
        description:
          !isLoading && baseStats.lowStockCount > 0
            ? "Ação recomendada: Reposição"
            : undefined,
        trend:
          !isLoading && baseStats.lowStockCount > 0
            ? { value: "Atenção", isPositive: false }
            : undefined,
      },
      {
        title: "Pedidos (Mês)",
        value: baseStats.monthlyOrders,
        description: "Aguardando integração",
      },
      {
        title: "Faturamento (Mês)",
        value: baseStats.monthlyRevenue,
        description: "Aguardando integração",
      },
    ];
  };

  return {
    statCards: getStatCards(),
    isLoading,
    error,
    hasLowStock: !isLoading && (stats?.lowStockCount ?? 0) > 0,
  };
}
