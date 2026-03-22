"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  AnimatedEntry,
  Separator,
  Skeleton,
} from "@gaqno-development/frontcore/components/ui";
import {
  useErpProduct,
  useCreateErpProduct,
  useUpdateErpProduct,
} from "@gaqno-development/frontcore";
import type { ProductStatus } from "@gaqno-development/types";
import {
  ChevronLeft,
  Package,
  Save,
  X,
  Tag,
  DollarSign,
  Layers,
  FileText,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const STATUS_OPTIONS: { value: ProductStatus; label: string; description: string }[] = [
  { value: "active", label: "Ativo", description: "Visível no catálogo e disponível para venda" },
  { value: "inactive", label: "Inativo", description: "Oculto do catálogo, não disponível para venda" },
  { value: "draft", label: "Rascunho", description: "Em edição, não publicado" },
];

function FormSection({ title, icon: Icon, children, delay = 0 }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <AnimatedEntry direction="up" delay={delay}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
        </div>
        {children}
      </div>
    </AnimatedEntry>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: product, isLoading: isLoadingProduct } = useErpProduct(id);
  const createMutation = useCreateErpProduct();
  const updateMutation = useUpdateErpProduct(id ?? "");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ProductStatus>("active");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name ?? "");
      setDescription(product.description ?? "");
      setSku(product.sku ?? "");
      setPrice(String(product.price ?? ""));
      setStock(String(product.stock ?? ""));
      setCategory(product.category ?? "");
      setStatus((product.status as ProductStatus) ?? "active");
    } else if (!isEdit) {
      setName("");
      setDescription("");
      setSku("");
      setPrice("");
      setStock("");
      setCategory("");
      setStatus("active");
    }
  }, [product, isEdit]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const submitError = createMutation.error ?? updateMutation.error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    const numStock = stock === "" ? undefined : parseInt(stock, 10);
    if (Number.isNaN(numPrice) || numPrice < 0) return;

    if (isEdit && id) {
      const updated = await updateMutation.mutateAsync({
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        sku: sku.trim() || undefined,
        price: numPrice,
        stock: numStock,
        category: category.trim() || undefined,
        status,
      });
      setSaved(true);
      setTimeout(() => navigate(`/erp/catalog/${updated.id}`), 600);
    } else {
      const created = await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        sku: sku.trim() || undefined,
        price: numPrice,
        stock: numStock,
        category: category.trim() || undefined,
        status,
      });
      setSaved(true);
      setTimeout(() => navigate(`/erp/catalog/${created.id}`), 600);
    }
  };

  if (isEdit && isLoadingProduct) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to={`/erp/catalog/${id}`}>
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            Voltar para o produto
          </Link>
        </Button>
        <FormSkeleton />
      </div>
    );
  }

  if (isEdit && product == null && !isLoadingProduct) {
    return (
      <AnimatedEntry direction="fade" className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to="/erp/catalog">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            Voltar para o catálogo
          </Link>
        </Button>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <Package className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Produto não encontrado.</p>
          </CardContent>
        </Card>
      </AnimatedEntry>
    );
  }

  if (saved) {
    return (
      <AnimatedEntry direction="fade" className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <p className="text-lg font-medium">{isEdit ? "Produto atualizado" : "Produto criado"}</p>
        <p className="text-sm text-muted-foreground">Redirecionando…</p>
      </AnimatedEntry>
    );
  }

  return (
    <div className="space-y-6" data-testid="product-form-page">
      <AnimatedEntry direction="fade" duration={0.2}>
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to={isEdit && id ? `/erp/catalog/${id}` : "/erp/catalog"}>
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
            {isEdit ? "Voltar para o produto" : "Voltar para o catálogo"}
          </Link>
        </Button>
      </AnimatedEntry>

      <AnimatedEntry direction="up" delay={0.05}>
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold tracking-tight" data-testid="product-form-title">
            {isEdit ? "Editar produto" : "Novo produto"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEdit
              ? "Altere os dados do produto e salve as mudanças."
              : "Preencha os dados para criar um novo produto no catálogo."}
          </p>
        </div>
      </AnimatedEntry>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <FormSection title="Informações básicas" icon={FileText} delay={0.1}>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do produto</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Camiseta Premium Algodão"
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição do produto"
                  className="h-10"
                />
              </div>
            </CardContent>
          </Card>
        </FormSection>

        <FormSection title="Identificação" icon={Tag} delay={0.15}>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">Código SKU</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SKU-001"
                    className="h-10 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Vestuário"
                    className="h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </FormSection>

        <FormSection title="Preço e estoque" icon={DollarSign} delay={0.2}>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0,00"
                    required
                    className="h-10 tabular-nums"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque inicial</Label>
                  <Input
                    id="stock"
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className="h-10 tabular-nums"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </FormSection>

        <FormSection title="Publicação" icon={Layers} delay={0.25}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
                  <SelectTrigger id="status" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div>
                          <span>{opt.label}</span>
                          <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
                            — {opt.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </FormSection>

        {submitError && (
          <AnimatedEntry direction="fade">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="py-3">
                <p className="text-sm text-destructive">
                  {submitError instanceof Error ? submitError.message : "Erro ao salvar o produto."}
                </p>
              </CardContent>
            </Card>
          </AnimatedEntry>
        )}

        <AnimatedEntry direction="up" delay={0.3}>
          <Separator />
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  Salvando…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isEdit ? "Salvar" : "Criar produto"}
                </span>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(isEdit && id ? `/erp/catalog/${id}` : "/erp/catalog")}
            >
              <X className="h-4 w-4 mr-1.5" />
              Cancelar
            </Button>
          </div>
        </AnimatedEntry>
      </form>
    </div>
  );
}
