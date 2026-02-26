import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "@/test/test-utils";
import AIContentPage from "./AIContentPage";

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

vi.mock("@gaqno-development/frontcore/components/ai", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return {
    AIBillingSummary: mock.AIBillingSummary,
    AIAttributionDashboard: mock.AIAttributionDashboard,
  };
});

describe("AIContentPage", () => {
  it("should show Conteúdo de IA heading", () => {
    render(<AIContentPage />);
    expect(screen.getByText("Conteúdo de IA")).toBeInTheDocument();
  });

  it("should render AI billing summary", () => {
    render(<AIContentPage />);
    expect(screen.getByTestId("ai-billing-summary")).toBeInTheDocument();
  });

  it("should render AI attribution dashboard", () => {
    render(<AIContentPage />);
    expect(screen.getByTestId("ai-attribution-dashboard")).toBeInTheDocument();
  });
});
