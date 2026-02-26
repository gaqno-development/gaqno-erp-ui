import { Link } from "react-router-dom";
import { Button } from "@gaqno-development/frontcore/components/ui";

interface LowStockAlertProps {
  products: Array<{
    id: string;
    name: string;
    stock: number;
  }>;
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  if (products.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
        Estoque baixo ({products.length})
      </p>
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
        {products.map((p) => (
          <li key={p.id}>
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link to={`/erp/catalog/${p.id}`}>
                {p.name} — {p.stock} unidades
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
