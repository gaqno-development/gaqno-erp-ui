import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

const storage: Record<string, string> = {};
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (k: string) => storage[k] ?? null,
    setItem: (k: string, v: string) => { storage[k] = v; },
    removeItem: (k: string) => { delete storage[k]; },
    clear: () => Object.keys(storage).forEach((k) => delete storage[k]),
  },
  writable: true,
});

vi.mock("@gaqno-development/frontcore", () => ({
  useLanguage: () => ({ t: (k: string) => k, language: "en" }),
  useAuth: () => ({ user: { name: "Test" }, isAuthenticated: true }),
  useTenantTheme: () => ({ theme: {} }),
  AppProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

vi.mock("@gaqno-development/frontcore/i18n", () => ({
  initI18n: vi.fn(),
  I18nProvider: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  useTranslation: () => ({ t: (k: string) => k, i18n: {}, language: "en" }),
}));

vi.mock("@gaqno-development/frontcore/hooks/useAuth", () => ({
  useAuth: () => ({ user: { name: "Test" }, isAuthenticated: true }),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    Link: ({ children, to, ...props }: { children: React.ReactNode; to: string }) => React.createElement("a", { href: to, ...props }, children),
    Outlet: () => React.createElement("div", { "data-testid": "outlet" }),
  };
});
