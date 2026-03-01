"use client";

import { Link } from "react-router-dom";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gaqno-development/frontcore/components/ui";
import { useErpProducts } from "@gaqno-development/frontcore";
import { useFilteredCatalog } from "../hooks/useFilteredCatalog";
import { Plus, Search, Package } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { LoadingSkeleton, EmptyState } from "../components/shared";

export default function CatalogPage() {
  const productsQuery = useErpProducts({ limit: 200 });
  const products = productsQuery.data ?? [];
  const {
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    filteredProducts,
  } = useFilteredCatalog({ products });

  const isLoading = productsQuery.isLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Catálogo de Produtos</h2>
        <Button asChild>
          <Link to="/erp/catalog/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter || "all"}
          onValueChange={(v) => setCategoryFilter(v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingSkeleton count={6} variant="card" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description={
            search || categoryFilter
              ? "Tente ajustar sua busca ou filtros para encontrar produtos."
              : "Comece adicionando seu primeiro produto ao catálogo."
          }
          icon={Package}
          action={
            !search && !categoryFilter
              ? {
                  label: "Adicionar Produto",
                  onClick: () => (window.location.href = "/erp/catalog/new"),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      )}
    </div>
  );
}
