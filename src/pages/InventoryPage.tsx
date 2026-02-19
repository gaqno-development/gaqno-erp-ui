"use client";

import { Link } from "react-router-dom";
import { useErpProducts } from "@gaqno-development/frontcore/hooks/ai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  LoaderPinwheelIcon,
} from "@gaqno-development/frontcore/components/ui";
import { Warehouse } from "lucide-react";

const LOW_STOCK_THRESHOLD = 10;

export default function InventoryPage() {
  const productsQuery = useErpProducts({ limit: 200 });
  const products = productsQuery.data ?? [];
  const withStock = products.filter((p) => typeof p.stock === "number");
  const lowStock = withStock.filter((p) => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD);

  if (productsQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <LoaderPinwheelIcon size={32} />
        <p className="text-sm text-muted-foreground">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Inventory / Stock</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Stock levels
          </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Products with stock data. Low stock threshold: {LOW_STOCK_THRESHOLD}
            </p>
            {withStock.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No products with stock data yet
              </p>
            ) : (
              <div className="space-y-2">
                {lowStock.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                      Low stock ({lowStock.length})
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {lowStock.map((p) => (
                        <li key={p.id}>
                          <Button variant="link" className="p-0 h-auto" asChild>
                            <Link to={`/erp/catalog/${p.id}`}>
                              {p.name} — {p.stock} units
                            </Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Product</th>
                        <th className="text-right p-3 font-medium">Stock</th>
                        <th className="text-left p-3 font-medium w-24" />
                      </tr>
                    </thead>
                    <tbody>
                      {withStock.map((p) => (
                        <tr key={p.id} className="border-b last:border-0">
                          <td className="p-3">{p.name}</td>
                          <td className="p-3 text-right">
                            {(p.stock ?? 0) <= LOW_STOCK_THRESHOLD ? (
                              <span className="text-amber-600 dark:text-amber-400">
                                {p.stock}
                              </span>
                            ) : (
                              p.stock
                            )}
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/erp/catalog/${p.id}`}>View</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
