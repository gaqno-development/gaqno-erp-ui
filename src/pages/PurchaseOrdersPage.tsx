"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  DataTable,
  ColumnDef,
  EmptyState,
  LoadingSkeleton,
  Badge,
  AnimatedEntry,
  SearchField,
} from "@gaqno-development/frontcore/components/ui";
import {
  useErpPurchaseOrders,
  useErpSuppliers,
} from "@gaqno-development/frontcore/hooks/erp";
import { formatCurrency, formatDate } from "@gaqno-development/frontcore/utils";
import {
  ERP_PURCHASE_ORDER_STATUS_LABEL,
  ERP_PURCHASE_ORDER_STATUS_VARIANT,
} from "@gaqno-development/frontcore/config/erp-status";
import type { ErpPurchaseOrder, ErpPurchaseOrderStatus } from "@gaqno-development/types";
import { AlertCircle, ClipboardList } from "lucide-react";

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState("");
  const poQuery = useErpPurchaseOrders({ limit: 200 });
  const suppliersQuery = useErpSuppliers();
  const purchaseOrders = poQuery.data ?? [];
  const isLoading = poQuery.isLoading;

  const supplierNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of suppliersQuery.data ?? []) {
      m.set(s.id, s.name);
    }
    return m;
  }, [suppliersQuery.data]);

  const listError = poQuery.isError || suppliersQuery.isError;
  const refetchList = () => {
    void poQuery.refetch();
    void suppliersQuery.refetch();
  };

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return purchaseOrders;
    const s = search.toLowerCase();
    return purchaseOrders.filter((o) => {
      const supName = supplierNameById.get(o.supplierId) ?? "";
      return (
        o.id.toLowerCase().includes(s) ||
        supName.toLowerCase().includes(s) ||
        (o.notes?.toLowerCase().includes(s) ?? false)
      );
    });
  }, [purchaseOrders, search, supplierNameById]);

  const columns: ColumnDef<ErpPurchaseOrder>[] = [
    {
      accessorKey: "id",
      header: "Nº OC",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {row.original.id.slice(0, 8)}…
        </span>
      ),
    },
    {
      id: "supplier",
      header: "Fornecedor",
      cell: ({ row }) => {
        const name = supplierNameById.get(row.original.supplierId);
        return (
          <span className="truncate max-w-[200px] block font-medium" title={name ?? row.original.supplierId}>
            {name ?? row.original.supplierId.slice(0, 8) + "…"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const st = row.original.status as ErpPurchaseOrderStatus;
        return (
          <Badge variant={ERP_PURCHASE_ORDER_STATUS_VARIANT[st]} className="font-normal">
            {ERP_PURCHASE_ORDER_STATUS_LABEL[st]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        const t = row.original.total;
        const num = typeof t === "string" ? parseFloat(t) : t;
        return (
          <span className="tabular-nums font-medium">
            {formatCurrency(Number.isNaN(num) ? 0 : num)}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AnimatedEntry direction="fade" duration={0.2}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Compras</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Ordens de compra e acompanhamento junto aos fornecedores.
            </p>
          </div>
          <Button size="sm" disabled className="shrink-0">
            Nova Ordem
          </Button>
        </div>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.05}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Buscar por número, fornecedor ou observações…"
        />
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.1}>
        <Card className="border-0 shadow-sm bg-card/50">
          <CardContent className="p-0">
            {listError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-muted-foreground">Erro ao carregar dados</p>
                <Button variant="outline" size="sm" onClick={refetchList}>
                  Tentar novamente
                </Button>
              </div>
            ) : isLoading ? (
              <div className="p-6">
                <LoadingSkeleton count={8} variant="table" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 sm:p-12">
                <EmptyState
                  title={search ? "Nenhuma ordem encontrada" : "Nenhuma ordem de compra ainda"}
                  description={
                    search
                      ? "Tente outro termo de busca."
                      : "As ordens de compra criadas aparecerão aqui."
                  }
                  icon={ClipboardList}
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
