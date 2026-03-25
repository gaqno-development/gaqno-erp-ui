"use client";

import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  AnimatedEntry,
  Badge,
} from "@gaqno-development/frontcore/components/ui";
import { useErpProducts } from "@gaqno-development/frontcore";
import { useFilteredCatalog } from "../hooks/useFilteredCatalog";
import { AlertCircle, Plus, Search, Package, SlidersHorizontal, LayoutGrid } from "lucide-react";
import {
  EmptyState,
  ProductCard,
  Skeleton,
  Card,
  CardContent,
} from "@gaqno-development/frontcore/components/ui";

export default function CatalogPage() {
  const navigate = useNavigate();
  const productsQuery = useErpProducts({ limit: 200 });
  const products = productsQuery.data ?? [];
  const isError = productsQuery.isError;
  const refetchProducts = productsQuery.refetch;
  const {
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    filteredProducts,
  } = useFilteredCatalog({ products });

  const isLoading = productsQuery.isLoading;
  const totalCount = products.length;
  const filteredCount = filteredProducts.length;
  const hasFilters = Boolean(search || categoryFilter);

  return (
    <div className="space-y-6">
      <AnimatedEntry direction="fade" duration={0.25}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-muted-foreground" />
              Catálogo de Produtos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading
                ? "Carregando produtos…"
                : hasFilters
                  ? `${filteredCount} de ${totalCount} produtos`
                  : `${totalCount} produtos no catálogo`}
            </p>
          </div>
          <Button asChild className="group shrink-0">
            <Link to="/erp/catalog/new">
              <Plus className="h-4 w-4 mr-1.5 transition-transform group-hover:rotate-90" />
              Novo Produto
            </Link>
          </Button>
        </div>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.05}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar por nome, SKU ou categoria…"
              className="pl-9 h-10 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={categoryFilter || "all"}
              onValueChange={(v) => setCategoryFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-full sm:w-[180px] h-10">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Categoria" />
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
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 px-3 text-muted-foreground"
                onClick={() => { setSearch(""); setCategoryFilter(""); }}
              >
                Limpar
              </Button>
            )}
          </div>
        </div>
      </AnimatedEntry>

      {isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Erro ao carregar dados</p>
          <Button variant="outline" size="sm" onClick={() => refetchProducts()}>
            Tentar novamente
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-3 space-y-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <AnimatedEntry direction="fade" delay={0.1}>
          <EmptyState
            title="Nenhum produto encontrado"
            description={
              hasFilters
                ? "Tente ajustar sua busca ou filtros para encontrar produtos."
                : "Comece adicionando seu primeiro produto ao catálogo."
            }
            icon={Package}
            action={
              !hasFilters
                ? {
                    label: "Adicionar Produto",
                    onClick: () => navigate("/erp/catalog/new"),
                  }
                : undefined
            }
          />
        </AnimatedEntry>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((p, i) => (
            <AnimatedEntry key={p.id} direction="up" delay={Math.min(i * 0.03, 0.3)}>
              <ProductCard product={p} to={`/erp/catalog/${p.id}`} />
            </AnimatedEntry>
          ))}
        </div>
      )}
    </div>
  );
}
