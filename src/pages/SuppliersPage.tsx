"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AnimatedEntry,
  EmptyState,
  Badge,
} from "@gaqno-development/frontcore/components/ui";
import { useErpSuppliers, useCreateErpSupplier } from "@gaqno-development/frontcore";
import type { ErpSupplier } from "@gaqno-development/types";
import { Plus, Building2, Mail, Phone, MapPin } from "lucide-react";

export default function SuppliersPage() {
  const suppliersQuery = useErpSuppliers();
  const createMutation = useCreateErpSupplier();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await createMutation.mutateAsync({
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      address: form.address.trim() || undefined,
    });
    setForm({ name: "", email: "", phone: "", address: "" });
    setDialogOpen(false);
  };

  const columns: ColumnDef<ErpSupplier>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string | null;
        return email ? (
          <span className="flex items-center gap-1.5 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {email}
          </span>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string | null;
        return phone ? (
          <span className="flex items-center gap-1.5 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            {phone}
          </span>
        ) : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Cadastro",
      cell: ({ row }) => {
        const d = row.getValue("createdAt") as string;
        return d ? (
          <span className="text-sm text-muted-foreground tabular-nums">
            {new Date(d).toLocaleDateString("pt-BR")}
          </span>
        ) : "—";
      },
    },
  ];

  const supplierCount = (suppliersQuery.data ?? []).length;

  return (
    <div className="space-y-6">
      <AnimatedEntry direction="fade" duration={0.2}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Fornecedores
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {suppliersQuery.isLoading
                ? "Carregando…"
                : `${supplierCount} fornecedor${supplierCount !== 1 ? "es" : ""} cadastrado${supplierCount !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="group shrink-0">
                <Plus className="h-4 w-4 mr-1.5 transition-transform group-hover:rotate-90" />
                Fornecedor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo fornecedor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="sup-name">Nome *</Label>
                  <Input id="sup-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="h-10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sup-email">Email</Label>
                    <Input id="sup-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sup-phone">Telefone</Label>
                    <Input id="sup-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sup-addr">Endereço</Label>
                  <Input id="sup-addr" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="h-10" />
                </div>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Criando…" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.1}>
        <Card className="border-0 shadow-sm bg-card/50">
          <CardContent className="p-0">
            {(suppliersQuery.data ?? []).length === 0 && !suppliersQuery.isLoading ? (
              <div className="p-8 sm:p-12">
                <EmptyState
                  title="Nenhum fornecedor cadastrado"
                  description="Cadastre seu primeiro fornecedor para gerenciar compras e entregas."
                  icon={Building2}
                  action={{
                    label: "Adicionar Fornecedor",
                    onClick: () => setDialogOpen(true),
                  }}
                />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={{ data: suppliersQuery.data ?? [], isLoading: suppliersQuery.isLoading }}
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
