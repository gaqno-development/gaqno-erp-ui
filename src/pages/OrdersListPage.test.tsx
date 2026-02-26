import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import OrdersListPage from "./OrdersListPage";

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/components/ui", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return mock.components.ui;
});

describe("OrdersListPage", () => {
  it("should show Pedidos heading", () => {
    render(<OrdersListPage />);
    expect(screen.getByText("Pedidos")).toBeInTheDocument();
  });

  it("should show Pedidos de venda card", () => {
    render(<OrdersListPage />);
    expect(screen.getByText("Pedidos de venda")).toBeInTheDocument();
  });

  it("should show empty state message", () => {
    render(<OrdersListPage />);
    expect(screen.getByText(/Nenhum pedido para exibir ainda/i)).toBeInTheDocument();
  });
});
