import { useERPKPIs } from "@gaqno-development/frontcore";
import { formatCurrency } from "@gaqno-development/frontcore/utils";

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
  const { stats, isLoading, isError, refetch, error } = useERPKPIs();

  const getStatCards = (): DashboardStatCard[] => {
    return [
      {
        title: "Total de Produtos",
        value: isLoading ? "…" : (stats?.totalProducts ?? 0),
      },
      {
        title: "Estoque Baixo",
        value: isLoading ? "…" : (stats?.lowStockCount ?? 0),
        description:
          !isLoading && (stats?.lowStockCount ?? 0) > 0
            ? "Ação recomendada: Reposição"
            : undefined,
        trend:
          !isLoading && (stats?.lowStockCount ?? 0) > 0
            ? { value: "Atenção", isPositive: false }
            : undefined,
      },
      {
        title: "Pedidos (Mês)",
        value: isLoading ? "…" : (stats?.totalOrders ?? 0),
      },
      {
        title: "Faturamento (Mês)",
        value: isLoading ? "…" : formatCurrency(stats?.totalGmv ?? 0),
      },
    ];
  };

  return {
    statCards: getStatCards(),
    isLoading,
    isError,
    refetch,
    error,
    hasLowStock: !isLoading && (stats?.lowStockCount ?? 0) > 0,
  };
}
