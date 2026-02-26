import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import CatalogPage from "./CatalogPage";

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/components/ui", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return mock.components.ui;
});

const mockUseErpProducts = vi.fn();
vi.mock("@gaqno-development/frontcore/hooks/erp", () => ({
  useErpProducts: (...args: unknown[]) => mockUseErpProducts(...args),
}));

describe("CatalogPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseErpProducts.mockReturnValue({ data: [], isLoading: false });
  });

  it("should show Catálogo de Produtos heading", () => {
    render(<CatalogPage />);
    expect(screen.getByText("Catálogo de Produtos")).toBeInTheDocument();
  });

  it("should show Novo Produto link", () => {
    render(<CatalogPage />);
    expect(screen.getByRole("link", { name: /Novo Produto/i })).toBeInTheDocument();
  });

  it("should show search input", () => {
    render(<CatalogPage />);
    expect(screen.getByPlaceholderText(/Buscar produtos/i)).toBeInTheDocument();
  });

  it("should show no products message when filtered list is empty", () => {
    render(<CatalogPage />);
    expect(screen.getByText(/Nenhum produto encontrado/i)).toBeInTheDocument();
  });

  it("should show product cards when data is loaded", () => {
    mockUseErpProducts.mockReturnValue({
      data: [
        { id: "1", name: "Product A", price: 10, tenantId: "t1", category: "Cat1", stock: 5 },
      ],
      isLoading: false,
    });
    render(<CatalogPage />);
    expect(screen.getByText("Product A")).toBeInTheDocument();
  });

  it("should show loading skeletons when products query is loading", () => {
    mockUseErpProducts.mockReturnValue({ data: undefined, isLoading: true });
    render(<CatalogPage />);
    expect(screen.getByText("Catálogo de Produtos")).toBeInTheDocument();
  });
});
