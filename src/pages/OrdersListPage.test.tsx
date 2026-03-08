import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/test-utils";
import OrdersListPage from "./OrdersListPage";
import { useErpOrders as mockUseErpOrders } from "@/__mocks__/frontcore";

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/hooks/erp", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { useErpOrders: mock.useErpOrders };
});

vi.mock("@gaqno-development/frontcore/components/ui", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return mock.components.ui;
});

describe("OrdersListPage", () => {
  beforeEach(() => {
    mockUseErpOrders.mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof mockUseErpOrders>);
  });

  it("should show Pedidos heading", () => {
    render(<OrdersListPage />);
    expect(screen.getByRole("heading", { name: "Pedidos" })).toBeInTheDocument();
  });

  it("should show search placeholder", () => {
    render(<OrdersListPage />);
    expect(screen.getByPlaceholderText(/Buscar por cliente/i)).toBeInTheDocument();
  });

  it("should show empty state when no orders", () => {
    render(<OrdersListPage />);
    expect(screen.getByText(/Nenhum pedido ainda/i)).toBeInTheDocument();
  });

  it("should filter by search and show no results message", async () => {
    const user = userEvent.setup();
    render(<OrdersListPage />);
    const searchInput = screen.getByPlaceholderText(/Buscar por cliente/i);
    await user.type(searchInput, "nonexistent");
    const emptyState = screen.getByTestId("empty-state");
    expect(emptyState).toHaveTextContent("Nenhum pedido encontrado");
    expect(emptyState).toHaveTextContent("Tente alterar busca ou filtro de status");
  });
});
