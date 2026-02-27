import React from "react";
import { vi } from "vitest";

export const useERPKPIs = vi.fn(() => ({
  stats: { totalProducts: 0, lowStockCount: 0 },
  isLoading: false,
}));
export const useErpProducts = vi.fn(() => ({ data: [], isLoading: false }));
export const useERPInventory = vi.fn(() => ({
  inventory: { withStock: [], lowStock: [] },
  isLoading: false,
}));

const Div = ({ children, ...props }: { children?: React.ReactNode; [k: string]: unknown }) => (
  <div {...props}>{children}</div>
);

export const QueryProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const AuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TenantProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Card = Div;
export const CardContent = Div;
export const CardDescription = ({ children, ...p }: { children?: React.ReactNode }) => <p {...p}>{children}</p>;
export const CardHeader = Div;
export const CardTitle = ({ children, ...p }: { children?: React.ReactNode }) => <h3 {...p}>{children}</h3>;

export const Button = React.forwardRef(
  ({ children, asChild, ...props }: { children?: React.ReactNode; asChild?: boolean; [k: string]: unknown }, ref: React.Ref<HTMLButtonElement>) =>
    asChild ? React.Children.only(children as React.ReactElement) : <button ref={ref} {...props}>{children}</button>
);

export const Input = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<HTMLInputElement>) => (
  <input ref={ref} {...props} />
));

export const Select = Div;
export const SelectContent = Div;
export const SelectItem = ({ children, value, ...p }: { children?: React.ReactNode; value?: string }) => (
  <option value={value} {...p}>{children}</option>
);
export const SelectTrigger = Div;
export const SelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>;

export const Checkbox = ({ checked, onCheckedChange, ...p }: { checked?: boolean; onCheckedChange?: (v: boolean) => void }) => (
  <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange?.(e.target.checked)} {...p} />
);

export const Tabs = Div;
export const TabsList = Div;
export const TabsTrigger = React.forwardRef(
  ({ children, asChild, ...props }: { children?: React.ReactNode; asChild?: boolean }, ref: React.Ref<HTMLButtonElement>) =>
    asChild ? React.Children.only(children as React.ReactElement) : <button ref={ref} {...props}>{children}</button>
);

export const LoaderPinwheelIcon = ({ size }: { size?: number }) => <span data-testid="loader" aria-hidden>{size}</span>;

export const Sheet = ({ children, open }: { children?: React.ReactNode; open?: boolean }) => (open ? <div data-testid="sheet">{children}</div> : null);
export const SheetContent = Div;
export const SheetHeader = Div;
export const SheetTitle = ({ children }: { children?: React.ReactNode }) => <h2>{children}</h2>;

export const DataTable = ({ data, columns }: { data?: { data?: unknown[] }; columns?: unknown[] }) => {
  const rows = data?.data ?? [];
  return (
    <div data-testid="data-table">
      {rows.map((row: { id?: string; name?: string }) => (
        <div key={row.id}>{row.name}</div>
      ))}
    </div>
  );
};

export const components = {
  ui: {
    Card: Div,
    CardContent: Div,
    CardDescription: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
    CardHeader: Div,
    CardTitle: ({ children }: { children?: React.ReactNode }) => <h3>{children}</h3>,
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Checkbox,
    Tabs,
    TabsList,
    TabsTrigger,
    LoaderPinwheelIcon,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    DataTable,
  },
};

export const AIProductProfileBuilder = () => <div data-testid="ai-product-profile" />;
export const AIContentGenerator = () => <div data-testid="ai-content-generator" />;
export const AIVideoGenerator = () => <div data-testid="ai-video-generator" />;
export const AIBillingSummary = ({ title }: { title?: string }) => <div data-testid="ai-billing-summary">{title}</div>;
export const AIAttributionDashboard = ({ title }: { title?: string }) => <div data-testid="ai-attribution-dashboard">{title}</div>;
