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
  it("should render the order detail page", () => {
    render(<OrderDetailPage />, {
      routerProps: { initialEntries: ["/erp/orders/ord-1"] },
      routePath: "/erp/orders/:id",
    });
    expect(screen.getByTestId("order-detail-title")).toBeInTheDocument();
  });

  it("should show order id in title", () => {
    render(<OrderDetailPage />, {
      routerProps: { initialEntries: ["/erp/orders/ord-123"] },
      routePath: "/erp/orders/:id",
    });
    expect(screen.getByTestId("order-detail-title")).toHaveTextContent("Pedido ord-123");
  });
});
