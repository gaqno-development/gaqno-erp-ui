"use client";

import { lazy, Suspense, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  AnimatedEntry,
  Skeleton,
  CopyableId,
  DetailRow,
  StockIndicator,
} from "@gaqno-development/frontcore/components/ui";
import { useErpProducts } from "@gaqno-development/frontcore";
import { formatCurrency } from "@gaqno-development/frontcore/utils";
import { ERP_PRODUCT_STATUS_THEME } from "@gaqno-development/frontcore/config/erp-status";
import {
  ChevronLeft,
  FileText,
  Film,
  Pencil,
  Package,
  Layers,
  Tag,
  BarChart3,
  Sparkles,
} from "lucide-react";

const AIProductProfileBuilder = lazy(() =>
  import("@gaqno-development/frontcore/components/ai").then((m) => ({
    default: m.AIProductProfileBuilder,
  }))
);
const AIContentGenerator = lazy(() =>
  import("@gaqno-development/frontcore/components/ai").then((m) => ({
    default: m.AIContentGenerator,
  }))
);
const AIVideoGenerator = lazy(() =>
  import("@gaqno-development/frontcore/components/ai").then((m) => ({
    default: m.AIVideoGenerator,
  }))
);

function AIFallback() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
      <Sparkles className="h-5 w-5 text-muted-foreground animate-pulse" />
      <span className="text-sm text-muted-foreground">Carregando ferramentas de IA…</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contentSheetOpen, setContentSheetOpen] = useState(false);
  const [videoSheetOpen, setVideoSheetOpen] = useState(false);

  const productsQuery = useErpProducts({ limit: 100 });
  const products = productsQuery.data ?? [];
  const found = id ? products.find((p: any) => p.id === id) : undefined;
  const product = found ?? null;

  if (productsQuery.isLoading) {
    return (
      <div className="space-y-4" data-testid="product-detail-fallback">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to="/erp/catalog">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            Voltar para o catálogo
          </Link>
        </Button>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <AnimatedEntry direction="fade" className="space-y-4">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to="/erp/catalog">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            Voltar para o catálogo
          </Link>
        </Button>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <Package className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground" data-testid="product-not-found">
              Produto não encontrado.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/erp/catalog">Ver catálogo</Link>
            </Button>
          </CardContent>
        </Card>
      </AnimatedEntry>
    );
  }

  const status = ERP_PRODUCT_STATUS_THEME[product.status ?? "active"] ?? ERP_PRODUCT_STATUS_THEME.active;
  const price = typeof product.price === "number" ? formatCurrency(product.price) : "—";

  const productForProfile = {
    id: product.id,
    name: product.name,
    price: product.price,
    tenantId: product.tenantId,
    description: product.description,
    sku: product.sku,
    stock: product.stock,
    category: product.category,
    imageUrls: product.imageUrls,
  };

  return (
    <div className="space-y-6" data-testid="product-detail-page">
      <AnimatedEntry direction="fade" duration={0.25}>
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to="/erp/catalog">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            Voltar para o catálogo
          </Link>
        </Button>
      </AnimatedEntry>

      <div className="grid gap-6 lg:grid-cols-3">
        <AnimatedEntry direction="up" delay={0.05} className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <div className="aspect-[21/9] bg-muted/30 overflow-hidden">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[21/9] bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground/15" />
                </div>
              )}
              <div className="absolute bottom-3 left-3">
                <Badge className={`${status.class} border`}>{status.label}</Badge>
              </div>
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-xl" data-testid="product-detail-name">
                    {product.name}
                  </CardTitle>
                  {product.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold tracking-tight">{price}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" asChild className="group">
                  <Link to={`/erp/catalog/${id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5 transition-transform group-hover:rotate-12" />
                    Editar
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContentSheetOpen(true)}
                  className="group"
                >
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Gerar conteúdo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setVideoSheetOpen(true)}
                  className="group"
                >
                  <Film className="h-3.5 w-3.5 mr-1.5" />
                  Criar vídeo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Suspense fallback={<AIFallback />}>
            <AIProductProfileBuilder
              initialData={productForProfile}
              title="Perfil de produto com IA"
            />
          </Suspense>
        </AnimatedEntry>

        <AnimatedEntry direction="up" delay={0.15} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Detalhes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border/50">
                <DetailRow label="ID" value={<CopyableId id={product.id} />} />
                {product.sku && <DetailRow label="SKU" value={product.sku} icon={Tag} />}
                {product.category && <DetailRow label="Categoria" value={product.category} icon={Layers} />}
                <DetailRow
                  label="Estoque"
                  value={<StockIndicator stock={product.stock} />}
                  icon={BarChart3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Ações rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                <Link to="/erp/inventory">
                  <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  Ver estoque
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                <Link to="/erp/orders">
                  <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                  Ver pedidos
                </Link>
              </Button>
            </CardContent>
          </Card>
        </AnimatedEntry>
      </div>

      <Sheet open={contentSheetOpen} onOpenChange={setContentSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Gerar conteúdo de marketing</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <Suspense fallback={<AIFallback />}>
              <AIContentGenerator productData={productForProfile as any} compact={false} title="" />
            </Suspense>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={videoSheetOpen} onOpenChange={setVideoSheetOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Criar vídeo do produto</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <Suspense fallback={<AIFallback />}>
              <AIVideoGenerator
                productName={product.name}
                productDescription={product.description}
                compact={false}
                title=""
              />
            </Suspense>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
