import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import OrderDetailPage from "./OrderDetailPage";

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/components/ui", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return mock.components.ui;
});

describe("OrderDetailPage", () => {
  it("should show Voltar para pedidos link", () => {
    render(<OrderDetailPage />, {
      routerProps: { initialEntries: ["/erp/orders/ord-1"] },
      routePath: "/erp/orders/:id",
    });
    expect(screen.getByRole("link", { name: /Voltar para pedidos/i })).toBeInTheDocument();
  });

  it("should show order id in title", () => {
    render(<OrderDetailPage />, {
      routerProps: { initialEntries: ["/erp/orders/ord-123"] },
      routePath: "/erp/orders/:id",
    });
    expect(screen.getByText(/Pedido ord-123/i)).toBeInTheDocument();
  });

  it("should show placeholder for order detail", () => {
    render(<OrderDetailPage />, {
      routerProps: { initialEntries: ["/erp/orders/1"] },
      routePath: "/erp/orders/:id",
    });
    expect(screen.getByText(/detalhes do pedido aparecerão/i)).toBeInTheDocument();
  });
});
