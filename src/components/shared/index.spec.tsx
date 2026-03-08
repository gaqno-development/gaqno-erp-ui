import { describe, it, expect } from "vitest";
import * as shared from "./index";

describe("components/shared index", () => {
  it("re-exports ErrorBoundary", () => {
    expect(shared.ErrorBoundary).toBeDefined();
  });
});
