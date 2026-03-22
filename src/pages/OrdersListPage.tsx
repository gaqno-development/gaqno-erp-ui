"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Input,
  DataTable,
  ColumnDef,
  EmptyState,
  LoadingSkeleton,
  Badge,
  AnimatedEntry,
} from "@gaqno-development/frontcore/components/ui";
import { useErpOrders } from "@gaqno-development/frontcore/hooks/erp";
import { formatCurrency } from "@gaqno-development/frontcore/utils";
import type { ErpOrder, ErpOrderStatus } from "@gaqno-development/types";
import { ShoppingCart, Search, ExternalLink } from "lucide-react";

const STATUS_LABELS: Record<ErpOrderStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  processing: "Em processamento",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const STATUS_VARIANTS: Record<ErpOrderStatus, "secondary" | "default" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "outline",
  processing: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

const ALL_STATUSES: readonly (ErpOrderStatus | "all")[] = [
  "all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled",
] as const;

function formatOrderDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function OrdersListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ErpOrderStatus | "all">("all");

  const ordersQuery = useErpOrders({ limit: 200 });
  const orders = ordersQuery.data ?? [];
  const isLoading = ordersQuery.isLoading;

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.customerName?.toLowerCase().includes(s) ||
          o.customerEmail?.toLowerCase().includes(s) ||
          o.id?.toLowerCase().includes(s)
      );
    }
    return list;
  }, [orders, statusFilter, search]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const o of orders) {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    }
    return counts;
  }, [orders]);

  const columns: ColumnDef<ErpOrder>[] = [
    {
      accessorKey: "id",
      header: "Pedido",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Button variant="ghost" size="sm" className="h-auto p-0 font-mono text-xs text-muted-foreground hover:text-foreground" asChild>
            <Link to={`/erp/orders/${id}`}>{id.slice(0, 8)}…</Link>
          </Button>
        );
      },
    },
    {
      accessorKey: "customerName",
      header: "Cliente",
      cell: ({ row }) => {
        const name = row.original.customerName || row.original.customerEmail || "—";
        return <span className="truncate max-w-[180px] block font-medium" title={String(name)}>{name}</span>;
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        const t = row.original.total;
        const num = typeof t === "string" ? parseFloat(t) : t;
        return <span className="tabular-nums font-medium">{formatCurrency(Number.isNaN(num) ? 0 : num)}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status as ErpOrderStatus;
        return (
          <Badge variant={STATUS_VARIANTS[s]} className="font-normal">
            {STATUS_LABELS[s]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">{formatOrderDate(row.original.createdAt)}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to={`/erp/orders/${row.original.id}`}>
            <ExternalLink className="h-3.5 w-3.5 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            Ver
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AnimatedEntry direction="fade" duration={0.2}>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Pedidos</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie pedidos de venda e acompanhe status e totais.
            </p>
          </div>
        </div>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.05}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por cliente, e-mail ou ID…"
              className="pl-9 h-10 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map((key) => {
              const isActive = statusFilter === key;
              const count = statusCounts[key] ?? 0;
              return (
                <Button
                  key={key}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(key)}
                  className={`h-8 text-xs ${isActive ? "font-medium" : "text-muted-foreground"}`}
                >
                  {key === "all" ? "Todos" : STATUS_LABELS[key]}
                  {count > 0 && (
                    <span className={`ml-1.5 text-[10px] tabular-nums ${isActive ? "text-foreground" : "text-muted-foreground/60"}`}>
                      {count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.1}>
        <Card className="border-0 shadow-sm bg-card/50">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6">
                <LoadingSkeleton count={8} variant="table" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 sm:p-12">
                <EmptyState
                  title={search || statusFilter !== "all" ? "Nenhum pedido encontrado" : "Nenhum pedido ainda"}
                  description={
                    search || statusFilter !== "all"
                      ? "Tente alterar busca ou filtro de status."
                      : "Os pedidos aparecerão aqui quando forem criados pelo PDV ou pela API."
                  }
                  icon={ShoppingCart}
                />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={{ data: filteredOrders, isLoading: false }}
                initialPageSize={20}
                cardStyle={false}
                showPagination={filteredOrders.length > 10}
              />
            )}
          </CardContent>
        </Card>
      </AnimatedEntry>
    </div>
  );
}
