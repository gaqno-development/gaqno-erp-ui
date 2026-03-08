import { describe, it, expect } from "vitest";
import * as components from "./index";

describe("components index", () => {
  it("re-exports LowStockAlert", () => {
    expect(components.LowStockAlert).toBeDefined();
  });
});
