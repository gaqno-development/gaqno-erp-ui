import { renderHook, act } from "@testing-library/react";
import { useFilteredCatalog } from "./useFilteredCatalog";
import type { ErpProduct } from "@gaqno-development/frontcore/utils/api";

function makeProduct(overrides: Partial<ErpProduct> = {}): ErpProduct {
  return {
    id: "1",
    name: "Product A",
    price: 10,
    tenantId: "t1",
    category: "Cat1",
    stock: 5,
    ...overrides,
  };
}

describe("useFilteredCatalog", () => {
  it("should return all products when no filters are set", () => {
    const products = [makeProduct({ id: "1" }), makeProduct({ id: "2", name: "Product B" })];
    const { result } = renderHook(() => useFilteredCatalog({ products }));

    expect(result.current.filteredProducts).toHaveLength(2);
    expect(result.current.categories).toEqual(["Cat1"]);
  });

  it("should filter by search (name)", () => {
    const products = [
      makeProduct({ id: "1", name: "Apple" }),
      makeProduct({ id: "2", name: "Banana" }),
    ];
    const { result } = renderHook(() => useFilteredCatalog({ products }));

    act(() => result.current.setSearch("app"));
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Apple");
  });

  it("should filter by category", () => {
    const products = [
      makeProduct({ id: "1", category: "A" }),
      makeProduct({ id: "2", category: "B" }),
    ];
    const { result } = renderHook(() => useFilteredCatalog({ products }));

    act(() => result.current.setCategoryFilter("B"));
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].category).toBe("B");
  });

  it("should filter by low stock only", () => {
    const products = [
      makeProduct({ id: "1", stock: 3 }),
      makeProduct({ id: "2", stock: 20 }),
    ];
    const { result } = renderHook(() => useFilteredCatalog({ products }));

    act(() => result.current.setLowStockOnly(true));
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].stock).toBe(3);
  });

  it("should clear all filters", () => {
    const products = [makeProduct({ id: "1" })];
    const { result } = renderHook(() => useFilteredCatalog({ products }));

    act(() => result.current.setSearch("x"));
    act(() => result.current.setCategoryFilter("Cat1"));
    act(() => result.current.setLowStockOnly(true));
    act(() => result.current.clearFilters());

    expect(result.current.search).toBe("");
    expect(result.current.categoryFilter).toBe("");
    expect(result.current.lowStockOnly).toBe(false);
    expect(result.current.filteredProducts).toHaveLength(1);
  });
});
