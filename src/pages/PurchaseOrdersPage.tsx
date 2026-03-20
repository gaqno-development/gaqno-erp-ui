"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  ColumnDef,
  Badge,
} from "@gaqno-development/frontcore/components/ui";
import { useErpPurchaseOrders } from "@gaqno-development/frontcore";
import type { ErpPurchaseOrder, ErpPurchaseOrderStatus } from "@gaqno-development/types";
import { ClipboardList } from "lucide-react";

const STATUS_VARIANT: Record<ErpPurchaseOrderStatus, string> = {
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

export default function PurchaseOrdersPage() {
  const query = useErpPurchaseOrders({ limit: 100 });

  const columns: ColumnDef<ErpPurchaseOrder>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (row.getValue("id") as string).slice(0, 8),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.getValue("status") as ErpPurchaseOrderStatus;
        return <Badge variant={STATUS_VARIANT[s] as any}>{STATUS_LABEL[s] ?? s}</Badge>;
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        const v = Number(row.getValue("total"));
        return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/\u00a0/g, " ");
      },
    },
    {
      accessorKey: "expectedDeliveryDate",
      header: "Entrega prevista",
      cell: ({ row }) => {
        const d = row.getValue("expectedDeliveryDate") as string | null;
        return d ? new Date(d).toLocaleDateString("pt-BR") : "—";
      },
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => {
        const d = row.getValue("createdAt") as string;
        return d ? new Date(d).toLocaleDateString("pt-BR") : "—";
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <ClipboardList className="h-5 w-5" /> Ordens de Compra
      </h2>

      <Card>
        <CardHeader><CardTitle>Ordens de compra</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={{ data: query.data ?? [], isLoading: query.isLoading }}
            initialPageSize={20}
            cardStyle={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
