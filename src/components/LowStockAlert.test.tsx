import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LowStockAlert } from "./LowStockAlert";

describe("LowStockAlert", () => {
  it("returns null when products is empty", () => {
    const { container } = render(<LowStockAlert products={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders alert with product list", () => {
    const products = [
      { id: "p1", name: "Product A", stock: 2 },
      { id: "p2", name: "Product B", stock: 1 },
    ];
    render(<LowStockAlert products={products} />);
    expect(screen.getByTestId("low-stock-alert")).toBeInTheDocument();
    expect(screen.getByTestId("low-stock-title")).toHaveTextContent("Estoque baixo (2)");
    expect(screen.getByTestId("low-stock-list")).toBeInTheDocument();
    expect(screen.getByTestId("low-stock-item-p1")).toBeInTheDocument();
    expect(screen.getByTestId("low-stock-item-p2")).toBeInTheDocument();
  });

  it("renders links with correct catalog paths", () => {
    const products = [{ id: "p1", name: "Product A", stock: 2 }];
    render(<LowStockAlert products={products} />);
    const link = screen.getByTestId("low-stock-link-p1");
    expect(link).toHaveAttribute("href", "/erp/catalog/p1");
  });
});
