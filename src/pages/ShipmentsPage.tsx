"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  DataTable,
  ColumnDef,
  EmptyState,
  LoadingSkeleton,
  Badge,
  AnimatedEntry,
  SearchField,
  Button,
} from "@gaqno-development/frontcore/components/ui";
import { useErpCarriers, useErpShipments } from "@gaqno-development/frontcore/hooks/erp";
import { formatDate } from "@gaqno-development/frontcore/utils";
import type { ErpShipment, ErpShipmentStatus } from "@gaqno-development/types";
import { AlertCircle, Truck } from "lucide-react";

const ERP_SHIPMENT_STATUS_LABEL: Record<ErpShipmentStatus, string> = {
  preparing: "Preparando",
  shipped: "Enviado",
  in_transit: "Em trânsito",
  delivered: "Entregue",
  returned: "Devolvido",
};

const ERP_SHIPMENT_STATUS_VARIANT: Record<
  ErpShipmentStatus,
  "secondary" | "default" | "destructive" | "outline"
> = {
  preparing: "secondary",
  shipped: "default",
  in_transit: "outline",
  delivered: "default",
  returned: "destructive",
};

export default function ShipmentsPage() {
  const [search, setSearch] = useState("");
  const shipmentsQuery = useErpShipments({ limit: 200 });
  const carriersQuery = useErpCarriers();
  const shipments = shipmentsQuery.data ?? [];
  const isLoading = shipmentsQuery.isLoading;

  const carrierNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of carriersQuery.data ?? []) {
      m.set(c.id, c.name);
    }
    return m;
  }, [carriersQuery.data]);

  const listError = shipmentsQuery.isError || carriersQuery.isError;
  const refetchList = () => {
    void shipmentsQuery.refetch();
    void carriersQuery.refetch();
  };

  const filteredShipments = useMemo(() => {
    if (!search.trim()) return shipments;
    const s = search.toLowerCase();
    return shipments.filter((sh) => {
      const carrier = sh.carrierId ? carrierNameById.get(sh.carrierId) ?? "" : "";
      const track = (sh.trackingCode ?? "").toLowerCase();
      return (
        track.includes(s) ||
        carrier.toLowerCase().includes(s) ||
        sh.orderId.toLowerCase().includes(s) ||
        sh.status.toLowerCase().includes(s)
      );
    });
  }, [shipments, search, carrierNameById]);

  const columns: ColumnDef<ErpShipment>[] = [
    {
      accessorKey: "trackingCode",
      header: "Rastreamento",
      cell: ({ row }) => (
        <span className="font-mono text-xs tabular-nums">
          {row.original.trackingCode ?? "—"}
        </span>
      ),
    },
    {
      id: "carrier",
      header: "Transportadora",
      cell: ({ row }) => {
        const name = row.original.carrierId
          ? carrierNameById.get(row.original.carrierId)
          : undefined;
        return (
          <span className="truncate max-w-[180px] block" title={name ?? undefined}>
            {name ?? "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const st = row.original.status as ErpShipmentStatus;
        return (
          <Badge variant={ERP_SHIPMENT_STATUS_VARIANT[st]} className="font-normal">
            {ERP_SHIPMENT_STATUS_LABEL[st]}
          </Badge>
        );
      },
    },
    {
      id: "destination",
      header: "Destino",
      cell: () => <span className="text-muted-foreground text-sm">—</span>,
    },
    {
      id: "date",
      header: "Data",
      cell: ({ row }) => {
        const raw = row.original.shippedAt ?? row.original.createdAt;
        return (
          <span className="text-muted-foreground text-sm tabular-nums">
            {formatDate(raw)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AnimatedEntry direction="fade" duration={0.2}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Logística</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Envios, transportadoras e acompanhamento de entregas.
          </p>
        </div>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.05}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Buscar por rastreio, pedido ou transportadora…"
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
            ) : filteredShipments.length === 0 ? (
              <div className="p-8 sm:p-12">
                <EmptyState
                  title={search ? "Nenhum envio encontrado" : "Nenhum envio registrado"}
                  description={
                    search
                      ? "Tente outro termo de busca."
                      : "Os envios criados aparecerão aqui com status e rastreamento."
                  }
                  icon={Truck}
                />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={{ data: filteredShipments, isLoading: false }}
                initialPageSize={20}
                cardStyle={false}
                showPagination={filteredShipments.length > 10}
              />
            )}
          </CardContent>
        </Card>
      </AnimatedEntry>
    </div>
  );
}
