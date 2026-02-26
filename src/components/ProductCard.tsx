import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@gaqno-development/frontcore/components/ui";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string | number;
    category?: string;
    stock?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {product.price} · {product.category ?? "—"}
          {typeof product.stock === "number" ? ` · Estoque: ${product.stock}` : ""}
        </p>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm">
          <Link to={`/erp/catalog/${product.id}`}>Ver e ações de IA</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
