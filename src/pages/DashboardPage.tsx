"use client";

import { Link } from "react-router-dom";
import { useErpProducts } from "@gaqno-development/frontcore/hooks/ai";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  LoaderPinwheelIcon,
} from "@gaqno-development/frontcore/components/ui";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const LOW_STOCK_THRESHOLD = 10;

export default function DashboardPage() {
  const productsQuery = useErpProducts({ limit: 500 });
  const products = productsQuery.data ?? [];
  const lowStockCount = products.filter(
    (p) => typeof p.stock === "number" && p.stock <= LOW_STOCK_THRESHOLD
  ).length;

  if (productsQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <LoaderPinwheelIcon size={32} />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">ERP Overview</h2>
        <p className="text-muted-foreground mt-1">
          KPIs and quick links to catalog, orders, and inventory
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{products.length}</span>
            <Button variant="link" className="p-0 h-auto ml-2" asChild>
              <Link to="/erp/catalog">
                View catalog
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low stock</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{lowStockCount}</span>
            <Button variant="link" className="p-0 h-auto ml-2" asChild>
              <Link to="/erp/inventory">
                View inventory
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">—</span>
            <p className="text-xs text-muted-foreground mt-1">
              Order API coming soon
            </p>
            <Button variant="link" className="p-0 h-auto mt-1" asChild>
              <Link to="/erp/orders">Orders</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Content</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link to="/erp/ai-content">
                Open AI Content
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Quick links
          </CardTitle>
          <CardDescription>
            Jump to catalog, orders, inventory, or AI content
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/erp/catalog">
              <Package className="h-4 w-4 mr-2" />
              Catalog
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/erp/orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/erp/inventory">
              <Warehouse className="h-4 w-4 mr-2" />
              Inventory
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/erp/ai-content">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Content
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>
            Recent orders and stock changes will appear here when the order API
            is available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-4 text-center">
            No recent activity yet
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
