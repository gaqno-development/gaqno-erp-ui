import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@gaqno-development/frontcore/components/ui";
import { ShoppingCart, Package, Warehouse, Sparkles, LayoutDashboard } from "lucide-react";

export function QuickLinksCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          Links rápidos
        </CardTitle>
        <CardDescription>
          Ir para catálogo, pedidos, estoque ou conteúdo de IA
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button variant="default" asChild size="sm">
          <Link to="/erp/catalog">
            <Package className="h-4 w-4 mr-2" />
            Catálogo
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/erp/orders">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Pedidos
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/erp/inventory">
            <Warehouse className="h-4 w-4 mr-2" />
            Estoque
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/erp/ai-content">
            <Sparkles className="h-4 w-4 mr-2" />
            Conteúdo de IA
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
