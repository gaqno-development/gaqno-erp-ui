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
      <h2 className="text-lg font-semibold">Pedidos</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Pedidos de venda
          </CardTitle>
          <CardDescription>
            A lista de pedidos aparecerá aqui quando a API de pedidos estiver disponível. Você pode
            integrar com o PDV ou um serviço de pedidos ERP dedicado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-6 text-center">
            Nenhum pedido para exibir ainda
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
