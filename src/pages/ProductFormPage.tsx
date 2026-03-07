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
} from "@gaqno-development/frontcore/components/ui";
import {
  useErpProduct,
  useCreateErpProduct,
  useUpdateErpProduct,
} from "@gaqno-development/frontcore";
import type { ProductStatus } from "@gaqno-development/types";
import { ChevronLeft } from "lucide-react";

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "draft", label: "Rascunho" },
];

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
      navigate(`/erp/catalog/${updated.id}`);
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
      navigate(`/erp/catalog/${created.id}`);
    }
  };

  if (isEdit && isLoadingProduct) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/erp/catalog/${id}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para o produto
          </Link>
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Carregando produto…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEdit && product == null && !isLoadingProduct) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/erp/catalog">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para o catálogo
          </Link>
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Produto não encontrado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to={isEdit && id ? `/erp/catalog/${id}` : "/erp/catalog"}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          {isEdit ? "Voltar para o produto" : "Voltar para o catálogo"}
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar produto" : "Novo produto"}</CardTitle>
          <CardDescription>
            {isEdit
              ? "Altere os dados do produto e salve."
              : "Preencha os dados para criar um novo produto no catálogo."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do produto"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição opcional"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Código SKU"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Categoria"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {submitError && (
              <p className="text-sm text-destructive">
                {submitError instanceof Error ? submitError.message : "Erro ao salvar."}
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando…" : isEdit ? "Salvar" : "Criar produto"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isEdit && id ? `/erp/catalog/${id}` : "/erp/catalog")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
