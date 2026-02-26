"use client";

import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@gaqno-development/frontcore/components/ui";
import { ChevronLeft } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/erp/orders">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para pedidos
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Pedido {id ?? "—"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Os detalhes do pedido aparecerão aqui quando a API de pedidos estiver disponível.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
