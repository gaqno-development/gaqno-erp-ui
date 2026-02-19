import { useMemo, useState, useCallback } from "react";
import type { ErpProduct } from "@gaqno-development/frontcore/utils/api";

const LOW_STOCK_THRESHOLD = 10;

export interface UseFilteredCatalogProps {
  products: ErpProduct[];
}

export function useFilteredCatalog({ products }: UseFilteredCatalogProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category?.trim()) set.add(p.category.trim());
    });
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = products;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku?.toLowerCase().includes(q) ?? false) ||
          (p.category?.toLowerCase().includes(q) ?? false)
      );
    }
    if (categoryFilter) {
      list = list.filter((p) => (p.category ?? "").trim() === categoryFilter);
    }
    if (lowStockOnly) {
      list = list.filter(
        (p) => typeof p.stock === "number" && p.stock <= LOW_STOCK_THRESHOLD
      );
    }
    return list;
  }, [products, search, categoryFilter, lowStockOnly]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategoryFilter("");
    setLowStockOnly(false);
  }, []);

  return {
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    lowStockOnly,
    setLowStockOnly,
    categories,
    filteredProducts,
    clearFilters,
  };
}
