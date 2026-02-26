"use client";

import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@gaqno-development/frontcore/components/ui";
import { ChevronLeft } from "lucide-react";

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to={isEdit ? `/erp/catalog/${id}` : "/erp/catalog"}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          {isEdit ? "Voltar para o produto" : "Voltar para o catálogo"}
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar produto" : "Novo produto"}</CardTitle>
          <CardDescription>
            A criação e edição de produtos estarão disponíveis quando uma API de produto (ERP ou
            PDV) for conectada. Use o Catálogo para ver produtos e o Detalhe do Produto
            para ações de IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? `Editando produto id: ${id}. Os campos do formulário serão conectados à API quando o backend estiver pronto.`
              : "O formulário de criação aparecerá aqui assim que a API de criação de produto estiver disponível."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
