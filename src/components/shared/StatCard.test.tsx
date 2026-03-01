import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Package } from "lucide-react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("should render title and value", () => {
    render(<StatCard title="Test Title" value="100" />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should render icon when provided", () => {
    render(<StatCard title="Test" value="100" icon={Package} />);

    // Use container query to find the SVG icon
    const { container } = render(
      <StatCard title="Test" value="100" icon={Package} />,
    );
    const icon = container.querySelector(".lucide-package");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("lucide", "lucide-package");
  });

  it("should render description when provided", () => {
    render(
      <StatCard title="Test" value="100" description="Test description" />,
    );

    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("should render trend when provided", () => {
    render(
      <StatCard
        title="Test"
        value="100"
        trend={{ value: "+10%", isPositive: true }}
      />,
    );

    expect(screen.getByText("+10%")).toBeInTheDocument();
  });

  it("should show loading state when isLoading is true", () => {
    render(<StatCard title="Test" value="100" isLoading={true} />);

    expect(screen.getByText("…")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <StatCard title="Test" value="100" className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should render positive trend in green", () => {
    render(
      <StatCard
        title="Test"
        value="100"
        trend={{ value: "+10%", isPositive: true }}
      />,
    );

    const trendElement = screen.getByText("+10%");
    expect(trendElement).toHaveClass("text-green-600");
  });

  it("should render negative trend in red", () => {
    render(
      <StatCard
        title="Test"
        value="100"
        trend={{ value: "-10%", isPositive: false }}
      />,
    );

    const trendElement = screen.getByText("-10%");
    expect(trendElement).toHaveClass("text-red-600");
  });
});
