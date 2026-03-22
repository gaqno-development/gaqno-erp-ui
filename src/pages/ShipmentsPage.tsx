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
import { useErpShipments } from "@gaqno-development/frontcore";
import type { ErpShipment, ErpShipmentStatus } from "@gaqno-development/types";
import { Truck, MapPin } from "lucide-react";

const STATUS_VARIANT: Record<ErpShipmentStatus, "secondary" | "default" | "destructive" | "outline"> = {
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
        const s = row.getValue("status") as ErpShipmentStatus;
        return <Badge variant={STATUS_VARIANT[s]}>{STATUS_LABEL[s] ?? s}</Badge>;
      },
    },
    {
      accessorKey: "trackingCode",
      header: "Rastreio",
      cell: ({ row }) => {
        const code = row.getValue("trackingCode") as string | null;
        return code ? (
          <span className="flex items-center gap-1.5 text-sm font-mono">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            {code}
          </span>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "orderId",
      header: "Pedido",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {(row.getValue("orderId") as string).slice(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: "shippedAt",
      header: "Enviado em",
      cell: ({ row }) => {
        const d = row.getValue("shippedAt") as string | null;
        return d ? (
          <span className="text-sm tabular-nums">{new Date(d).toLocaleDateString("pt-BR")}</span>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "deliveredAt",
      header: "Entregue em",
      cell: ({ row }) => {
        const d = row.getValue("deliveredAt") as string | null;
        return d ? (
          <span className="text-sm tabular-nums text-emerald-600 dark:text-emerald-400">{new Date(d).toLocaleDateString("pt-BR")}</span>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
  ];

  const count = (query.data ?? []).length;

  return (
    <div className="space-y-6">
      <AnimatedEntry direction="fade" duration={0.2}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            Logística
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {query.isLoading
              ? "Carregando…"
              : `${count} remessa${count !== 1 ? "s" : ""}`}
          </p>
        </div>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.1}>
        <Card className="border-0 shadow-sm bg-card/50">
          <CardContent className="p-0">
            {count === 0 && !query.isLoading ? (
              <div className="p-8 sm:p-12">
                <EmptyState
                  title="Nenhuma remessa registrada"
                  description="As remessas aparecerão aqui quando pedidos forem enviados."
                  icon={Truck}
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
