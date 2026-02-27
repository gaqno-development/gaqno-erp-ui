import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import { useERPInventory as mockUseERPInventory } from "@/__mocks__/frontcore";
import InventoryPage from "./InventoryPage";

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/components/ui", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return mock.components.ui;
});

describe("InventoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseERPInventory.mockReturnValue({
      inventory: { withStock: [], lowStock: [] },
      isLoading: false,
    });
  });

  it("should show loading state when inventory is loading", () => {
    mockUseERPInventory.mockReturnValue({
      inventory: { withStock: [], lowStock: [] },
      isLoading: true,
    });
    render(<InventoryPage />);
    expect(screen.getByText("Gestão de Estoque")).toBeInTheDocument();
  });

  it("should show Gestão de Estoque heading", () => {
    render(<InventoryPage />);
    expect(screen.getByText("Gestão de Estoque")).toBeInTheDocument();
  });

  it("should show Níveis de estoque card", () => {
    render(<InventoryPage />);
    expect(screen.getByText("Níveis de estoque")).toBeInTheDocument();
  });

  it("should show table when inventory has stock", () => {
    mockUseERPInventory.mockReturnValue({
      inventory: {
        withStock: [
          { id: "1", name: "Item A", price: 10, tenantId: "t1", category: "C1", stock: 3 },
          { id: "2", name: "Item B", price: 20, tenantId: "t1", category: "C1", stock: 50 },
        ],
        lowStock: [{ id: "1", name: "Item A", stock: 3 }],
      },
      isLoading: false,
    });
    render(<InventoryPage />);
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
  });
});
