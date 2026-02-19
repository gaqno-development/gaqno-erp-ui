"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { ShoppingCart } from "lucide-react";

export default function OrdersListPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Orders</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Sales orders
          </CardTitle>
          <CardDescription>
            Order list will appear here when the order API is available. You can
            integrate with PDV or a dedicated ERP order service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-6 text-center">
            No orders to display yet
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
