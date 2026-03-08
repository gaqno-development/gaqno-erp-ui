import { describe, it, expect } from "vitest";
import env from "./environment";

describe("environment", () => {
  it("exports default config object", () => {
    expect(env).toBeDefined();
    expect(typeof env).toBe("object");
  });
});
