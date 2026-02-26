import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import ProductFormPage from "./ProductFormPage";

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/components/ui", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return mock.components.ui;
});

describe("ProductFormPage", () => {
  it("should show Novo produto when no id in route", () => {
    render(<ProductFormPage />, {
      routerProps: { initialEntries: ["/erp/catalog/new"] },
      routePath: "/erp/catalog/new",
    });
    expect(screen.getByText("Novo produto")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voltar para o catálogo/i })).toBeInTheDocument();
  });

  it("should show Editar produto when id in route", () => {
    render(<ProductFormPage />, {
      routerProps: { initialEntries: ["/erp/catalog/123/edit"] },
      routePath: "/erp/catalog/:id/edit",
    });
    expect(screen.getByText("Editar produto")).toBeInTheDocument();
    expect(screen.getByText(/Editando produto id: 123/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voltar para o produto/i })).toBeInTheDocument();
  });
});
