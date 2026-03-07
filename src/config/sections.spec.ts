import { describe, it, expect } from "vitest";
import {
  ERP_BASE,
  ERP_DASHBOARD_BASE,
  CATALOG_BASE,
  ORDERS_BASE,
  INVENTORY_BASE,
  AI_CONTENT_BASE,
} from "./sections";

describe("sections", () => {
  it("exports ERP_BASE as /erp", () => {
    expect(ERP_BASE).toBe("/erp");
  });

  it("exports ERP_DASHBOARD_BASE as /erp/dashboard", () => {
    expect(ERP_DASHBOARD_BASE).toBe("/erp/dashboard");
  });

  it("exports CATALOG_BASE as /erp/catalog", () => {
    expect(CATALOG_BASE).toBe("/erp/catalog");
  });

  it("exports ORDERS_BASE as /erp/orders", () => {
    expect(ORDERS_BASE).toBe("/erp/orders");
  });

  it("exports INVENTORY_BASE as /erp/inventory", () => {
    expect(INVENTORY_BASE).toBe("/erp/inventory");
  });

  it("exports AI_CONTENT_BASE as /erp/ai-content", () => {
    expect(AI_CONTENT_BASE).toBe("/erp/ai-content");
  });
});
