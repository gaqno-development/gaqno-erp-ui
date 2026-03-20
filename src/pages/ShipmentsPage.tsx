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
import { useErpShipments } from "@gaqno-development/frontcore";
import type { ErpShipment, ErpShipmentStatus } from "@gaqno-development/types";
import { Truck } from "lucide-react";

const STATUS_VARIANT: Record<ErpShipmentStatus, string> = {
  preparing: "secondary",
  shipped: "outline",
  in_transit: "default",
  delivered: "default",
  returned: "destructive",
};

const STATUS_LABEL: Record<ErpShipmentStatus, string> = {
  preparing: "Preparando",
  shipped: "Enviado",
  in_transit: "Em trânsito",
  delivered: "Entregue",
  returned: "Devolvido",
};

export default function ShipmentsPage() {
  const query = useErpShipments({ limit: 100 });

  const columns: ColumnDef<ErpShipment>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (row.getValue("id") as string).slice(0, 8),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.getValue("status") as ErpShipmentStatus;
        return <Badge variant={STATUS_VARIANT[s] as any}>{STATUS_LABEL[s] ?? s}</Badge>;
      },
    },
    {
      accessorKey: "trackingCode",
      header: "Rastreio",
      cell: ({ row }) => row.getValue("trackingCode") || "—",
    },
    {
      accessorKey: "orderId",
      header: "Pedido",
      cell: ({ row }) => (row.getValue("orderId") as string).slice(0, 8),
    },
    {
      accessorKey: "shippedAt",
      header: "Enviado em",
      cell: ({ row }) => {
        const d = row.getValue("shippedAt") as string | null;
        return d ? new Date(d).toLocaleDateString("pt-BR") : "—";
      },
    },
    {
      accessorKey: "deliveredAt",
      header: "Entregue em",
      cell: ({ row }) => {
        const d = row.getValue("deliveredAt") as string | null;
        return d ? new Date(d).toLocaleDateString("pt-BR") : "—";
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Truck className="h-5 w-5" /> Logística
      </h2>

      <Card>
        <CardHeader><CardTitle>Remessas</CardTitle></CardHeader>
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
