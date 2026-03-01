import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Package } from "lucide-react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("should render title", () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("should render description when provided", () => {
    render(
      <EmptyState
        title="No items found"
        description="Try adjusting your search criteria"
      />,
    );
    expect(
      screen.getByText("Try adjusting your search criteria"),
    ).toBeInTheDocument();
  });

  it("should render icon when provided", () => {
    const { container } = render(
      <EmptyState title="No items" icon={Package} />,
    );

    // Use container query to find the SVG icon
    const icon = container.querySelector(".lucide-package");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("lucide", "lucide-package");
  });

  it("should render action button when provided", () => {
    const mockAction = vi.fn();
    render(
      <EmptyState
        title="No items"
        action={{ label: "Add Item", onClick: mockAction }}
      />,
    );

    const button = screen.getByText("Add Item");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("should apply custom className", () => {
    const { container } = render(
      <EmptyState title="No items" className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should have proper structure and styling", () => {
    render(<EmptyState title="No items" />);
    const container = screen.getByText("No items").closest("div");
    expect(container).toHaveClass(
      "text-center",
      "py-12",
      "border",
      "rounded-xl",
      "bg-muted/20",
    );
  });
});
