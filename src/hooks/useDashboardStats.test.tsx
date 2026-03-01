import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDashboardStats } from "./useDashboardStats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Mock the frontcore module
vi.mock("@gaqno-development/frontcore", () => ({
  useERPKPIs: vi.fn(),
}));

import { useERPKPIs } from "@gaqno-development/frontcore";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useDashboardStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return stat cards with loading state", () => {
    vi.mocked(useERPKPIs).mockReturnValue({
      stats: undefined,
      isLoading: true,
      error: null,
    } as any);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.statCards).toHaveLength(4);
    expect(result.current.statCards[0].value).toBe("…");
    expect(result.current.statCards[1].value).toBe("…");
  });

  it("should return stat cards with data", () => {
    const mockStats = {
      totalProducts: 150,
      lowStockCount: 5,
    };

    vi.mocked(useERPKPIs).mockReturnValue({
      stats: mockStats,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.statCards).toHaveLength(4);
    expect(result.current.statCards[0].value).toBe(150);
    expect(result.current.statCards[1].value).toBe(5);
    expect(result.current.hasLowStock).toBe(true);
  });

  it("should show low stock warning when count > 0", () => {
    const mockStats = {
      totalProducts: 100,
      lowStockCount: 3,
    };

    vi.mocked(useERPKPIs).mockReturnValue({
      stats: mockStats,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    const lowStockCard = result.current.statCards[1];
    expect(lowStockCard.description).toBe("Ação recomendada: Reposição");
    expect(lowStockCard.trend).toEqual({ value: "Atenção", isPositive: false });
    expect(result.current.hasLowStock).toBe(true);
  });

  it("should not show low stock warning when count is 0", () => {
    const mockStats = {
      totalProducts: 100,
      lowStockCount: 0,
    };

    vi.mocked(useERPKPIs).mockReturnValue({
      stats: mockStats,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    const lowStockCard = result.current.statCards[1];
    expect(lowStockCard.description).toBeUndefined();
    expect(lowStockCard.trend).toBeUndefined();
    expect(result.current.hasLowStock).toBe(false);
  });

  it("should handle error state", () => {
    vi.mocked(useERPKPIs).mockReturnValue({
      stats: undefined,
      isLoading: false,
      error: new Error("API Error"),
    } as any);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.statCards).toHaveLength(4);
  });

  it("should provide default values when stats is undefined", () => {
    vi.mocked(useERPKPIs).mockReturnValue({
      stats: undefined,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.statCards[0].value).toBe(0);
    expect(result.current.statCards[1].value).toBe(0);
    expect(result.current.statCards[2].value).toBe(0);
    expect(result.current.statCards[3].value).toBe("R$ 0,00");
  });
});
