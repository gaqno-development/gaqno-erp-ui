import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import App from "./App";

vi.mock("@gaqno-development/frontcore", async (importOriginal) => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/components/ui", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return mock.components.ui;
});

vi.mock("@gaqno-development/frontcore/hooks/erp", () => ({
  useErpProducts: vi.fn(() => ({ data: [], isLoading: false })),
  useERPKPIs: vi.fn(() => ({ stats: { totalProducts: 0, lowStockCount: 0 }, isLoading: false })),
  useERPInventory: vi.fn(() => ({ inventory: { withStock: [], lowStock: [] }, isLoading: false })),
}));
vi.mock("@gaqno-development/frontcore/hooks/ai", () => ({
  useBillingSummary: vi.fn(() => ({ data: null, isLoading: false })),
}));

vi.mock("@gaqno-development/frontcore/components/ai", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return {
    AIBillingSummary: mock.AIBillingSummary,
    AIAttributionDashboard: mock.AIAttributionDashboard,
  };
});

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render ERP layout with title", () => {
    render(<App />, { routerProps: { initialEntries: ["/erp/dashboard"] } });
    expect(screen.getByText("ERP")).toBeInTheDocument();
  });

  it("should show dashboard when at /erp/dashboard", () => {
    render(<App />, { routerProps: { initialEntries: ["/erp/dashboard"] } });
    expect(screen.getByText(/Painel ERP/i)).toBeInTheDocument();
  });

  it("should show catalog when at /erp/catalog", () => {
    render(<App />, { routerProps: { initialEntries: ["/erp/catalog"] } });
    expect(screen.getByText(/Catálogo de Produtos/i)).toBeInTheDocument();
  });

  it("should show orders when at /erp/orders", () => {
    render(<App />, { routerProps: { initialEntries: ["/erp/orders"] } });
    expect(screen.getByText("Pedidos de venda")).toBeInTheDocument();
  });

  it("should show inventory when at /erp/inventory", () => {
    render(<App />, { routerProps: { initialEntries: ["/erp/inventory"] } });
    expect(screen.getByText("Níveis de estoque")).toBeInTheDocument();
  });

  it("should show AI Content when at /erp/ai-content", () => {
    render(<App />, { routerProps: { initialEntries: ["/erp/ai-content"] } });
    expect(screen.getAllByText("Conteúdo de IA").length).toBeGreaterThanOrEqual(1);
  });

  it("should redirect /erp to dashboard", () => {
    render(<App />, { routerProps: { initialEntries: ["/erp"] } });
    expect(screen.getByText(/Painel ERP/i)).toBeInTheDocument();
  });

  it("should redirect unknown path to dashboard", () => {
    render(<App />, { routerProps: { initialEntries: ["/erp/unknown"] } });
    expect(screen.getByText(/Painel ERP/i)).toBeInTheDocument();
  });
});
