"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  DataTable,
  ColumnDef,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AnimatedEntry,
  Badge,
  StockIndicator,
} from "@gaqno-development/frontcore/components/ui";
import {
  useERPInventory,
  useStockMovements,
  useWarehouses,
  useCreateStockMovement,
  useCreateWarehouse,
} from "@gaqno-development/frontcore";
import { formatDate } from "@gaqno-development/frontcore/utils";
import type { ErpStockMovement, StockMovementType } from "@gaqno-development/types";
import { LowStockAlert } from "../components/LowStockAlert";
import {
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  ArrowLeftRight,
  Warehouse,
  BarChart3,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

const MOVEMENT_TYPE_LABELS: Record<StockMovementType, string> = {
  inbound: "Entrada",
  outbound: "Saída",
  adjustment: "Ajuste",
  transfer: "Transferência",
};

const MOVEMENT_TYPE_ICONS: Record<StockMovementType, typeof ArrowDownToLine> = {
  inbound: ArrowDownToLine,
  outbound: ArrowUpFromLine,
  adjustment: RefreshCw,
  transfer: ArrowLeftRight,
};

const MOVEMENT_TYPE_COLORS: Record<StockMovementType, string> = {
  inbound: "text-emerald-600 dark:text-emerald-400",
  outbound: "text-red-600 dark:text-red-400",
  adjustment: "text-blue-600 dark:text-blue-400",
  transfer: "text-violet-600 dark:text-violet-400",
};


export default function InventoryPage() {
  const inventoryQuery = useERPInventory({ limit: 200 });
  const { inventory, isLoading: isLoadingProducts } = inventoryQuery;
  const { withStock, lowStock } = inventory;
  const allProducts = inventoryQuery.data ?? [];
  const movementsQuery = useStockMovements({ limit: 100 });
  const warehousesQuery = useWarehouses();
  const createMovement = useCreateStockMovement();
  const createWarehouse = useCreateWarehouse();

  const pageError =
    inventoryQuery.isError ||
    movementsQuery.isError ||
    warehousesQuery.isError;
  const refetchPage = () => {
    void inventoryQuery.refetch();
    void movementsQuery.refetch();
    void warehousesQuery.refetch();
  };

  const [movementForm, setMovementForm] = useState({
    productId: "",
    type: "inbound" as StockMovementType,
    quantity: "",
    reference: "",
    notes: "",
  });
  const [warehouseName, setWarehouseName] = useState("");
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);

  const handleCreateMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(movementForm.quantity, 10);
    if (!movementForm.productId || Number.isNaN(qty) || qty < 1) return;
    await createMovement.mutateAsync({
      productId: movementForm.productId,
      type: movementForm.type,
      quantity: qty,
      reference: movementForm.reference || undefined,
      notes: movementForm.notes || undefined,
    });
    setMovementForm({ productId: "", type: "inbound", quantity: "", reference: "", notes: "" });
    setMovementDialogOpen(false);
  };

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseName.trim()) return;
    await createWarehouse.mutateAsync({ name: warehouseName.trim() });
    setWarehouseName("");
    setWarehouseDialogOpen(false);
  };

  const stockColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Produto",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Estoque",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        return <StockIndicator stock={stock} showUnit={false} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <Button variant="ghost" size="sm" asChild className="group">
            <Link to={`/erp/catalog/${row.original.id}`}>
              <ExternalLink className="h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              Ver
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  const movementColumns: ColumnDef<ErpStockMovement>[] = [
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => {
        const type = row.getValue("type") as StockMovementType;
        const Icon = MOVEMENT_TYPE_ICONS[type] ?? RefreshCw;
        const color = MOVEMENT_TYPE_COLORS[type] ?? "";
        return (
          <span className={`flex items-center gap-1.5 text-sm font-medium ${color}`}>
            <Icon className="h-3.5 w-3.5" />
            {MOVEMENT_TYPE_LABELS[type] ?? type}
          </span>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Qtd",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">{row.getValue("quantity")}</span>
      ),
    },
    {
      accessorKey: "productId",
      header: "Produto",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {(row.getValue("productId") as string).slice(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: "reference",
      header: "Referência",
      cell: ({ row }) => row.getValue("reference") || "—",
    },
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ row }) => {
        const d = row.getValue("createdAt") as string;
        return d ? (
          <span className="text-sm text-muted-foreground tabular-nums">
            {formatDate(d)}
          </span>
        ) : "—";
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AnimatedEntry direction="fade" duration={0.2}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              Gestão de Estoque
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Movimentações, níveis de estoque e depósitos
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={warehouseDialogOpen} onOpenChange={setWarehouseDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="group">
                  <Plus className="h-4 w-4 mr-1 transition-transform group-hover:rotate-90" />
                  Depósito
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo depósito</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateWarehouse} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="wh-name">Nome</Label>
                    <Input id="wh-name" value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} required className="h-10" />
                  </div>
                  <Button type="submit" disabled={createWarehouse.isPending}>
                    {createWarehouse.isPending ? "Criando…" : "Criar"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={movementDialogOpen} onOpenChange={setMovementDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="group">
                  <Plus className="h-4 w-4 mr-1 transition-transform group-hover:rotate-90" />
                  Movimentação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova movimentação</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateMovement} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="mv-product">Produto</Label>
                    <Select
                      value={movementForm.productId}
                      onValueChange={(v) => setMovementForm((f) => ({ ...f, productId: v }))}
                    >
                      <SelectTrigger id="mv-product" className="h-10">
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {allProducts.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mv-type">Tipo</Label>
                      <Select
                        value={movementForm.type}
                        onValueChange={(v) => setMovementForm((f) => ({ ...f, type: v as StockMovementType }))}
                      >
                        <SelectTrigger id="mv-type" className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(MOVEMENT_TYPE_LABELS) as [StockMovementType, string][]).map(
                            ([val, label]) => (
                              <SelectItem key={val} value={val}>{label}</SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mv-qty">Quantidade</Label>
                      <Input
                        id="mv-qty"
                        type="number"
                        min={1}
                        value={movementForm.quantity}
                        onChange={(e) => setMovementForm((f) => ({ ...f, quantity: e.target.value }))}
                        required
                        className="h-10 tabular-nums"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mv-ref">Referência</Label>
                    <Input
                      id="mv-ref"
                      value={movementForm.reference}
                      onChange={(e) => setMovementForm((f) => ({ ...f, reference: e.target.value }))}
                      placeholder="Ex: NF-123"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mv-notes">Observações</Label>
                    <Textarea
                      id="mv-notes"
                      value={movementForm.notes}
                      onChange={(e) => setMovementForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Opcional"
                      className="min-h-[80px] resize-y"
                    />
                  </div>
                  <Button type="submit" disabled={createMovement.isPending}>
                    {createMovement.isPending ? "Registrando…" : "Registrar"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </AnimatedEntry>

      {pageError && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-lg border border-border">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Erro ao carregar dados</p>
          <Button variant="outline" size="sm" onClick={refetchPage}>
            Tentar novamente
          </Button>
        </div>
      )}

      {!pageError && (
        <>
          <AnimatedEntry direction="up" delay={0.05}>
            <LowStockAlert products={lowStock} />
          </AnimatedEntry>

          <div className="grid gap-6 lg:grid-cols-3">
        <AnimatedEntry direction="up" delay={0.1} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Movimentações recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={movementColumns}
                data={{ data: movementsQuery.data ?? [], isLoading: movementsQuery.isLoading }}
                initialPageSize={20}
                cardStyle={false}
              />
            </CardContent>
          </Card>
        </AnimatedEntry>

        <AnimatedEntry direction="up" delay={0.2} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Níveis de estoque</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={stockColumns}
                data={{ data: withStock, isLoading: isLoadingProducts }}
                initialPageSize={10}
                cardStyle={false}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Depósitos</CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {(warehousesQuery.data ?? []).length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {warehousesQuery.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
                  ))}
                </div>
              ) : (warehousesQuery.data ?? []).length === 0 ? (
                <div className="py-4 text-center">
                  <Warehouse className="h-6 w-6 text-muted-foreground/30 mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">Nenhum depósito cadastrado</p>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {(warehousesQuery.data ?? []).map((w) => (
                    <li key={w.id} className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Warehouse className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{w.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </AnimatedEntry>
          </div>
        </>
      )}
    </div>
  );
}
