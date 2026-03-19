import { useERPKPIs } from "@gaqno-development/frontcore";

interface DashboardStatCard {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const formatCurrency = (value: number): string =>
  value
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    .replace(/\u00a0/g, " ");

export function useDashboardStats() {
  const { stats, isLoading, error } = useERPKPIs();

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
    error,
    hasLowStock: !isLoading && (stats?.lowStockCount ?? 0) > 0,
  };
}
