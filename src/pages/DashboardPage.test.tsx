import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import DashboardPage from "./DashboardPage";

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/components/ui", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return mock.components.ui;
});

const mockUseERPKPIs = vi.fn();
vi.mock("@gaqno-development/frontcore/hooks/erp", () => ({
  useERPKPIs: (...args: unknown[]) => mockUseERPKPIs(...args),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseERPKPIs.mockReturnValue({
      stats: { totalProducts: 0, lowStockCount: 0 },
      isLoading: false,
    });
  });

  it("should show loading state when KPIs are loading", () => {
    mockUseERPKPIs.mockReturnValue({
      stats: { totalProducts: 0, lowStockCount: 0 },
      isLoading: true,
    });
    render(<DashboardPage />);
    expect(screen.getByText("Painel ERP")).toBeInTheDocument();
  });

  it("should show Painel ERP when loaded", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Painel ERP")).toBeInTheDocument();
  });

  it("should show Total de Produtos card with count", () => {
    mockUseERPKPIs.mockReturnValue({
      stats: { totalProducts: 5, lowStockCount: 0 },
      isLoading: false,
    });
    render(<DashboardPage />);
    expect(screen.getByText("Total de Produtos")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should show Estoque Baixo and links", () => {
    mockUseERPKPIs.mockReturnValue({
      stats: { totalProducts: 0, lowStockCount: 2 },
      isLoading: false,
    });
    render(<DashboardPage />);
    expect(screen.getByText("Estoque Baixo")).toBeInTheDocument();
    expect(screen.getByText("Links rápidos")).toBeInTheDocument();
  });

  it("should show quick links to catalog, orders, inventory, AI content", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Links rápidos")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Catálogo/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /Pedidos/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /Estoque/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /Conteúdo de IA/i }).length).toBeGreaterThanOrEqual(1);
  });
});
