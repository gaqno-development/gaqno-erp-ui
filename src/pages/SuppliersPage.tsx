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
} from "@gaqno-development/frontcore/components/ui";
import { useErpSuppliers, useCreateErpSupplier } from "@gaqno-development/frontcore";
import type { ErpSupplier } from "@gaqno-development/types";
import { Plus, Building2 } from "lucide-react";

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
    { accessorKey: "name", header: "Nome" },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email") || "—",
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => row.getValue("phone") || "—",
    },
    {
      accessorKey: "createdAt",
      header: "Cadastro",
      cell: ({ row }) => {
        const d = row.getValue("createdAt") as string;
        return d ? new Date(d).toLocaleDateString("pt-BR") : "—";
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5" /> Fornecedores
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Fornecedor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo fornecedor</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="sup-name">Nome *</Label>
                <Input id="sup-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sup-email">Email</Label>
                  <Input id="sup-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sup-phone">Telefone</Label>
                  <Input id="sup-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sup-addr">Endereço</Label>
                <Input id="sup-addr" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
              </div>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Criando…" : "Criar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Lista de fornecedores</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={{ data: suppliersQuery.data ?? [], isLoading: suppliersQuery.isLoading }}
            initialPageSize={20}
            cardStyle={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
