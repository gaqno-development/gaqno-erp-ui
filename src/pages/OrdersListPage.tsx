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
} from "@gaqno-development/frontcore/components/ui";
import { useErpOrders } from "@gaqno-development/frontcore/hooks/erp";
import { formatCurrency } from "@gaqno-development/frontcore/utils";
import type { ErpOrder, ErpOrderStatus } from "@gaqno-development/types";
import { ShoppingCart, Search } from "lucide-react";

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

function formatOrderDate(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

function OrderStatusBadge({ status }: { status: ErpOrderStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className="font-normal">
      {STATUS_LABELS[status]}
    </Badge>
  );
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

  const columns: ColumnDef<ErpOrder>[] = [
    {
      accessorKey: "id",
      header: "Pedido",
      cell: ({ row }) => {
        const id = row.original.id;
        const short = id.length > 8 ? `${id.slice(0, 8)}…` : id;
        return (
          <Button variant="ghost" size="sm" className="h-auto p-0 font-mono text-muted-foreground" asChild>
            <Link to={`/erp/orders/${id}`}>{short}</Link>
          </Button>
        );
      },
    },
    {
      accessorKey: "customerName",
      header: "Cliente",
      cell: ({ row }) => {
        const name = row.original.customerName || row.original.customerEmail || "—";
        return <span className="truncate max-w-[180px] block" title={String(name)}>{name}</span>;
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        const t = row.original.total;
        const num = typeof t === "string" ? parseFloat(t) : t;
        return <span className="tabular-nums">{formatCurrency(Number.isNaN(num) ? 0 : num)}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <OrderStatusBadge status={row.original.status as ErpOrderStatus} />,
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatOrderDate(row.original.createdAt)}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/erp/orders/${row.original.id}`}>Ver</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Gerencie pedidos de venda e acompanhe status e totais.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por cliente, e-mail ou ID..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const).map(
              (key) => (
                <Button
                  key={key}
                  variant={statusFilter === key ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(key)}
                >
                  {key === "all" ? "Todos" : STATUS_LABELS[key]}
                </Button>
              )
            )}
          </div>
        </div>
      </div>

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
                variant="icon"
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
    </div>
  );
}
