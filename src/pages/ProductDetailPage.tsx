"use client";

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@gaqno-development/frontcore/components/ui";
import {
  AIProductProfileBuilder,
  AIContentGenerator,
  AIVideoGenerator,
} from "@gaqno-development/frontcore/components/ai";
import { useErpProducts } from "@gaqno-development/frontcore";
import type { ErpProduct } from "@gaqno-development/types";
import { ChevronLeft, FileText, Film, Pencil } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contentSheetOpen, setContentSheetOpen] = useState(false);
  const [videoSheetOpen, setVideoSheetOpen] = useState(false);

  const productsQuery = useErpProducts({ limit: 100 });
  const products = productsQuery.data ?? [];
  const found = id ? products.find((p: any) => p.id === id) : undefined;
  const product = found ?? null;

  const productForProfile = product
    ? {
        id: product.id,
        name: product.name,
        price: product.price,
        tenantId: product.tenantId,
        description: product.description,
        sku: product.sku,
        stock: product.stock,
        category: product.category,
        imageUrls: product.imageUrls,
      }
    : null;

  const productForContent: any = productForProfile;

  if (productsQuery.isLoading || !product) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/erp/catalog">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para o catálogo
          </Link>
        </Button>
        <p className="text-muted-foreground">
          {productsQuery.isLoading ? "Carregando…" : "Produto não encontrado."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/erp/catalog">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para o catálogo
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Preço: {product.price} · Categoria: {product.category ?? "—"}
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to={`/erp/catalog/${id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar produto
            </Link>
          </Button>
          <Button variant="default" size="sm" onClick={() => setContentSheetOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Gerar conteúdo de marketing
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setVideoSheetOpen(true)}
          >
            <Film className="h-4 w-4 mr-2" />
            Criar vídeo
          </Button>
        </CardContent>
      </Card>

      <AIProductProfileBuilder
        initialData={productForProfile}
        title="Perfil de produto com IA"
      />

      <Sheet open={contentSheetOpen} onOpenChange={setContentSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Gerar conteúdo de marketing</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <AIContentGenerator
              productData={productForContent}
              compact={false}
              title=""
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={videoSheetOpen} onOpenChange={setVideoSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Criar vídeo do produto</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <AIVideoGenerator
              productName={product.name}
              productDescription={product.description}
              compact={false}
              title=""
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
