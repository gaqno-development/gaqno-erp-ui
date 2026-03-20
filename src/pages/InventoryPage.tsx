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
} from "@gaqno-development/frontcore/components/ui";
import {
  useERPInventory,
  useStockMovements,
  useWarehouses,
  useCreateStockMovement,
  useCreateWarehouse,
} from "@gaqno-development/frontcore";
import type { ErpStockMovement, StockMovementType } from "@gaqno-development/types";
import { LowStockAlert } from "../components/LowStockAlert";
import { Plus, ArrowDownToLine, ArrowUpFromLine, RefreshCw, ArrowLeftRight } from "lucide-react";

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

export default function InventoryPage() {
  const { inventory, isLoading: isLoadingProducts } = useERPInventory({ limit: 200 });
  const { withStock, lowStock } = inventory;
  const movementsQuery = useStockMovements({ limit: 100 });
  const warehousesQuery = useWarehouses();
  const createMovement = useCreateStockMovement();
  const createWarehouse = useCreateWarehouse();

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
    { accessorKey: "name", header: "Produto" },
    {
      accessorKey: "stock",
      header: "Estoque",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        const isLow = lowStock.some((p: any) => p.id === row.original.id);
        return (
          <span className={isLow ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
            {stock}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/erp/catalog/${row.original.id}`}>Ver</Link>
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
        return (
          <span className="flex items-center gap-1.5 text-sm">
            <Icon className="h-3.5 w-3.5" />
            {MOVEMENT_TYPE_LABELS[type] ?? type}
          </span>
        );
      },
    },
    { accessorKey: "quantity", header: "Qtd" },
    { accessorKey: "productId", header: "Produto ID" },
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
        return d ? new Date(d).toLocaleDateString("pt-BR") : "—";
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Gestão de Estoque</h2>
        <div className="flex gap-2">
          <Dialog open={warehouseDialogOpen} onOpenChange={setWarehouseDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Depósito
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo depósito</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateWarehouse} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="wh-name">Nome</Label>
                  <Input
                    id="wh-name"
                    value={warehouseName}
                    onChange={(e) => setWarehouseName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={createWarehouse.isPending}>
                  {createWarehouse.isPending ? "Criando…" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={movementDialogOpen} onOpenChange={setMovementDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Movimentação
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
                    <SelectTrigger id="mv-product">
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {withStock.map((p: any) => (
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
                      <SelectTrigger id="mv-type">
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

      <LowStockAlert products={lowStock} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Movimentações recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={movementColumns}
                data={{ data: movementsQuery.data ?? [], isLoading: movementsQuery.isLoading }}
                initialPageSize={20}
                cardStyle={false}
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Níveis de estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={stockColumns}
                data={{ data: withStock, isLoading: isLoadingProducts }}
                initialPageSize={10}
                cardStyle={false}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Depósitos</CardTitle>
            </CardHeader>
            <CardContent>
              {warehousesQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando…</p>
              ) : (warehousesQuery.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum depósito cadastrado.</p>
              ) : (
                <ul className="space-y-1">
                  {(warehousesQuery.data ?? []).map((w) => (
                    <li key={w.id} className="text-sm">{w.name}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
