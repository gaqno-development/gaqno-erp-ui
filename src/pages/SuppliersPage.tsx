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
import { useErpSuppliers } from "@gaqno-development/frontcore/hooks/erp";
import { formatDate } from "@gaqno-development/frontcore/utils";
import type { ErpSupplier } from "@gaqno-development/types";
import { AlertCircle, Building2 } from "lucide-react";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const suppliersQuery = useErpSuppliers();
  const suppliers = suppliersQuery.data ?? [];
  const isLoading = suppliersQuery.isLoading;

  const filteredSuppliers = useMemo(() => {
    if (!search.trim()) return suppliers;
    const s = search.toLowerCase();
    return suppliers.filter(
      (x) =>
        x.name.toLowerCase().includes(s) ||
        (x.email?.toLowerCase().includes(s) ?? false) ||
        (x.phone?.toLowerCase().includes(s) ?? false),
    );
  }, [suppliers, search]);

  const columns: ColumnDef<ErpSupplier>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium truncate max-w-[220px] block" title={row.original.name}>
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "E-mail de contato",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm truncate max-w-[200px] block">
          {row.original.email ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => (
        <span className="tabular-nums text-sm">{row.original.phone ?? "—"}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: () => (
        <Badge variant="secondary" className="font-normal">
          Ativo
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
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
            <h1 className="text-xl font-semibold tracking-tight">Fornecedores</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Cadastre e gerencie fornecedores e dados de contato.
            </p>
          </div>
          <Button size="sm" disabled className="shrink-0">
            Novo Fornecedor
          </Button>
        </div>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.05}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome, e-mail ou telefone…"
        />
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.1}>
        <Card className="border-0 shadow-sm bg-card/50">
          <CardContent className="p-0">
            {suppliersQuery.isError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-muted-foreground">Erro ao carregar dados</p>
                <Button variant="outline" size="sm" onClick={() => suppliersQuery.refetch()}>
                  Tentar novamente
                </Button>
              </div>
            ) : isLoading ? (
              <div className="p-6">
                <LoadingSkeleton count={8} variant="table" />
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="p-8 sm:p-12">
                <EmptyState
                  title={search ? "Nenhum fornecedor encontrado" : "Nenhum fornecedor ainda"}
                  description={
                    search
                      ? "Tente outro termo de busca."
                      : "Os fornecedores cadastrados aparecerão nesta lista."
                  }
                  icon={Building2}
                />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={{ data: filteredSuppliers, isLoading: false }}
                initialPageSize={20}
                cardStyle={false}
                showPagination={filteredSuppliers.length > 10}
              />
            )}
          </CardContent>
        </Card>
      </AnimatedEntry>
    </div>
  );
}
