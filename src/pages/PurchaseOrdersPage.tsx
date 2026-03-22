"use client";

import {
  Card,
  CardContent,
  DataTable,
  ColumnDef,
  Badge,
  AnimatedEntry,
  EmptyState,
} from "@gaqno-development/frontcore/components/ui";
import { useErpPurchaseOrders } from "@gaqno-development/frontcore";
import type { ErpPurchaseOrder, ErpPurchaseOrderStatus } from "@gaqno-development/types";
import { ClipboardList } from "lucide-react";

const STATUS_VARIANT: Record<ErpPurchaseOrderStatus, "secondary" | "default" | "destructive" | "outline"> = {
  draft: "secondary",
  pending: "outline",
  approved: "default",
  received: "default",
  cancelled: "destructive",
};

const STATUS_LABEL: Record<ErpPurchaseOrderStatus, string> = {
  draft: "Rascunho",
  pending: "Pendente",
  approved: "Aprovado",
  received: "Recebido",
  cancelled: "Cancelado",
};

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/\u00a0/g, " ");
}

export default function PurchaseOrdersPage() {
  const query = useErpPurchaseOrders({ limit: 100 });

  const columns: ColumnDef<ErpPurchaseOrder>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {(row.getValue("id") as string).slice(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.getValue("status") as ErpPurchaseOrderStatus;
        return <Badge variant={STATUS_VARIANT[s]}>{STATUS_LABEL[s] ?? s}</Badge>;
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">{formatBRL(Number(row.getValue("total")))}</span>
      ),
    },
    {
      accessorKey: "expectedDeliveryDate",
      header: "Entrega prevista",
      cell: ({ row }) => {
        const d = row.getValue("expectedDeliveryDate") as string | null;
        return d ? (
          <span className="text-sm tabular-nums">{new Date(d).toLocaleDateString("pt-BR")}</span>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => {
        const d = row.getValue("createdAt") as string;
        return d ? (
          <span className="text-sm text-muted-foreground tabular-nums">{new Date(d).toLocaleDateString("pt-BR")}</span>
        ) : "—";
      },
    },
  ];

  const count = (query.data ?? []).length;

  return (
    <div className="space-y-6">
      <AnimatedEntry direction="fade" duration={0.2}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            Ordens de Compra
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {query.isLoading
              ? "Carregando…"
              : `${count} ordem${count !== 1 ? "ns" : ""} de compra`}
          </p>
        </div>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.1}>
        <Card className="border-0 shadow-sm bg-card/50">
          <CardContent className="p-0">
            {count === 0 && !query.isLoading ? (
              <div className="p-8 sm:p-12">
                <EmptyState
                  title="Nenhuma ordem de compra"
                  description="As ordens de compra aparecerão aqui quando forem criadas."
                  icon={ClipboardList}
                />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={{ data: query.data ?? [], isLoading: query.isLoading }}
                initialPageSize={20}
                cardStyle={false}
              />
            )}
          </CardContent>
        </Card>
      </AnimatedEntry>
    </div>
  );
}
