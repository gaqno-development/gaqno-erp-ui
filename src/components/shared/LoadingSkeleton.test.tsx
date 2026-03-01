import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoadingSkeleton } from "./LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("should render default skeleton", () => {
    const { container } = render(<LoadingSkeleton />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(1);
    expect(skeletons[0]).toHaveClass("h-32", "rounded-xl");
  });

  it("should render multiple skeletons when count is provided", () => {
    const { container } = render(<LoadingSkeleton count={3} />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons).toHaveLength(3);
  });

  it("should render card variant", () => {
    const { container } = render(<LoadingSkeleton variant="card" />);
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toHaveClass("h-32", "rounded-xl");
  });

  it("should render list variant", () => {
    const { container } = render(<LoadingSkeleton variant="list" />);
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toHaveClass("h-12", "rounded-md", "w-full");
  });

  it("should render stat variant", () => {
    const { container } = render(<LoadingSkeleton variant="stat" />);
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toHaveClass("h-8", "rounded-md", "w-20");
  });

  it("should apply custom className", () => {
    const { container } = render(<LoadingSkeleton className="custom-class" />);
    const skeleton = container.querySelector(".custom-class");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("custom-class");
  });

  it("should have animation classes", () => {
    const { container } = render(<LoadingSkeleton />);
    const skeleton = container.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("animate-pulse", "bg-muted");
  });
});
