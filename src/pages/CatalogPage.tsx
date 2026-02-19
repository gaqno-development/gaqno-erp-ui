"use client";

import { Link } from "react-router-dom";
import { useErpProducts } from "@gaqno-development/frontcore/hooks/ai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from "@gaqno-development/frontcore/components/ui";
import { useFilteredCatalog } from "@/hooks/useFilteredCatalog";
import { Plus, Search } from "lucide-react";

export default function CatalogPage() {
  const productsQuery = useErpProducts({ limit: 200 });
  const products = productsQuery.data ?? [];
  const {
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    lowStockOnly,
    setLowStockOnly,
    categories,
    filteredProducts,
    clearFilters,
  } = useFilteredCatalog({ products });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Product catalog</h2>
        <Button variant="default" asChild size="sm">
          <Link to="/erp/catalog/new">
            <Plus className="h-4 w-4 mr-2" />
            New product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, SKU, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter || "all"} onValueChange={(v) => setCategoryFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox
            checked={lowStockOnly}
            onCheckedChange={(checked) => setLowStockOnly(checked === true)}
          />
          Low stock only
        </label>
        {(search || categoryFilter || lowStockOnly) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productsQuery.isLoading && (
          <p className="text-muted-foreground">Loading…</p>
        )}
        {!productsQuery.isLoading && filteredProducts.length === 0 && (
          <p className="text-muted-foreground col-span-full">
            No products match the filters.
          </p>
        )}
        {filteredProducts.map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {p.price} · {p.category ?? "—"}
                {typeof p.stock === "number" ? ` · Stock: ${p.stock}` : ""}
              </p>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm">
                <Link to={`/erp/catalog/${p.id}`}>View & AI actions</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
