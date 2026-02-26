import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import ProductDetailPage from "./ProductDetailPage";

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/components/ui", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return mock.components.ui;
});

vi.mock("@gaqno-development/frontcore/components/ai", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return {
    AIProductProfileBuilder: mock.AIProductProfileBuilder,
    AIContentGenerator: mock.AIContentGenerator,
    AIVideoGenerator: mock.AIVideoGenerator,
  };
});

const mockUseErpProducts = vi.fn();
vi.mock("@gaqno-development/frontcore/hooks/erp", () => ({
  useErpProducts: (...args: unknown[]) => mockUseErpProducts(...args),
}));

describe("ProductDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseErpProducts.mockReturnValue({ data: [], isLoading: false });
  });

  it("should show loading when products are loading", () => {
    mockUseErpProducts.mockReturnValue({ data: undefined, isLoading: true });
    render(<ProductDetailPage />, {
      routerProps: { initialEntries: ["/erp/catalog/1"] },
      routePath: "/erp/catalog/:id",
    });
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it("should show product not found when id does not match", () => {
    render(<ProductDetailPage />, {
      routerProps: { initialEntries: ["/erp/catalog/nonexistent"] },
      routePath: "/erp/catalog/:id",
    });
    expect(screen.getByText(/Produto não encontrado/i)).toBeInTheDocument();
  });

  it("should show product name and actions when product exists", () => {
    mockUseErpProducts.mockReturnValue({
      data: [
        { id: "1", name: "Test Product", price: 99, tenantId: "t1", category: "Cat1", stock: 10 },
      ],
      isLoading: false,
    });
    render(<ProductDetailPage />, {
      routerProps: { initialEntries: ["/erp/catalog/1"] },
      routePath: "/erp/catalog/:id",
    });
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voltar para o catálogo/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Editar produto/i })).toBeInTheDocument();
    expect(screen.getByText(/Gerar conteúdo de marketing/i)).toBeInTheDocument();
  });
});
