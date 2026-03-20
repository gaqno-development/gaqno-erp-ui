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

vi.mock("@gaqno-development/frontcore/components/layout", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { PageLayout: mock.PageLayout };
});

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

  it("should render dashboard at /erp/dashboard", () => {
    const { container } = render(<App />, {
      routerProps: { initialEntries: ["/erp/dashboard"] },
    });
    expect(container.innerHTML).not.toBe("");
  });

  it("should redirect /erp to dashboard", () => {
    const { container } = render(<App />, {
      routerProps: { initialEntries: ["/erp"] },
    });
    expect(container.innerHTML).not.toBe("");
  });

  it("should render product form at /erp/catalog/new", () => {
    render(<App />, { routerProps: { initialEntries: ["/erp/catalog/new"] } });
    expect(screen.getByTestId("product-form-page")).toBeInTheDocument();
  });

  it("should redirect unknown path to dashboard", () => {
    const { container } = render(<App />, {
      routerProps: { initialEntries: ["/erp/unknown"] },
    });
    expect(container.innerHTML).not.toBe("");
  });
});
