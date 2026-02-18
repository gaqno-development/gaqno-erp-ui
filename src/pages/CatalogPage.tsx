"use client";

import { Link } from "react-router-dom";
import { useErpProducts } from "@gaqno-development/frontcore/hooks/ai";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@gaqno-development/frontcore/components/ui";

export default function CatalogPage() {
  const productsQuery = useErpProducts({ limit: 50 });
  const products = productsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Product catalog</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productsQuery.isLoading && (
          <p className="text-muted-foreground">Loading…</p>
        )}
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {p.price} · {p.category ?? "—"}
              </p>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm">
                <Link to={`/erp/catalog/${p.id}`}>View & AI actions</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
