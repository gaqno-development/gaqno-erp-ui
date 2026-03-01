import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Progress,
  Input,
  Label,
  Badge,
} from "@gaqno-development/frontcore/components/ui";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  useProductWizard,
  type ProductData,
} from "../../hooks/useProductWizard";
import { useProductAISuggestions } from "../../hooks/useProductAISuggestions";

export interface ProductWizardProps {
  onComplete: (productData: ProductData) => void;
  onCancel: () => void;
  open?: boolean;
}

export function ProductWizard({
  onComplete,
  onCancel,
  open = true,
}: ProductWizardProps) {
  const {
    currentStep,
    totalSteps,
    productData,
    setProductData,
    isCreating,
    canProceed,
    nextStep,
    previousStep,
    getProgress,
    finish,
    getStepTitle,
  } = useProductWizard({ onComplete });

  const {
    generateSuggestions,
    suggestions,
    isLoading: isAILoading,
    error: aiError,
    clearSuggestions,
    applySuggestion,
    generateMarketingCopy,
    marketingCopy,
    isGeneratingCopy,
    copyError,
    applyMarketingCopy,
  } = useProductAISuggestions(setProductData);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                placeholder="Nome do produto"
                value={productData.name}
                onChange={(e) => setProductData({ name: e.target.value })}
                disabled={isCreating}
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="SKU (opcional)"
                value={productData.sku}
                onChange={(e) => setProductData({ sku: e.target.value })}
                disabled={isCreating}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Preço"
                  value={productData.price || ""}
                  onChange={(e) =>
                    setProductData({ price: parseFloat(e.target.value) || 0 })
                  }
                  disabled={isCreating}
                />
              </div>
              <div>
                <Label htmlFor="stock">Estoque Inicial *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="Estoque inicial"
                  value={productData.stock || ""}
                  onChange={(e) =>
                    setProductData({ stock: parseInt(e.target.value) || 0 })
                  }
                  disabled={isCreating}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Descrição e Categoria</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => generateSuggestions(productData)}
                disabled={
                  !productData.name || !productData.price || isAILoading
                }
                className="flex items-center gap-2"
              >
                {isAILoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Sugestões IA
                  </>
                )}
              </Button>
            </div>

            {aiError && (
              <div className="p-3 border border-destructive/20 bg-destructive/10 rounded-md">
                <p className="text-sm text-destructive">{aiError}</p>
              </div>
            )}

            <div>
              <Label htmlFor="description">Descrição do Produto *</Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                placeholder="Descreva o produto..."
                value={productData.description}
                onChange={(e) =>
                  setProductData({ description: e.target.value })
                }
                disabled={isCreating}
              />
              {suggestions?.profile.description && (
                <div className="mt-2 p-2 border border-muted bg-muted/50 rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Sugestão IA
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(
                        suggestions.profile.description.confidence * 100,
                      )}
                      % confiança
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">
                    {suggestions.profile.description.value}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      applySuggestion(
                        "description",
                        suggestions.profile.description.value,
                      )
                    }
                    disabled={isCreating}
                  >
                    Aplicar sugestão
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Input
                id="category"
                placeholder="Categoria do produto"
                value={productData.category}
                onChange={(e) => setProductData({ category: e.target.value })}
                disabled={isCreating}
              />
              {suggestions?.profile.category && (
                <div className="mt-2 p-2 border border-muted bg-muted/50 rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Sugestão IA
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(
                        suggestions.profile.category.confidence * 100,
                      )}
                      % confiança
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">
                    {suggestions.profile.category.value}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      applySuggestion(
                        "category",
                        suggestions.profile.category.value,
                      )
                    }
                    disabled={isCreating}
                  >
                    Aplicar sugestão
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Imagens do Produto</Label>
              <p className="text-sm text-muted-foreground">
                Funcionalidade de upload de imagens será implementada em breve.
              </p>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Arraste imagens aqui ou clique para upload
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Conteúdo de Marketing</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => generateMarketingCopy(productData)}
                disabled={
                  !productData.name || !productData.price || isGeneratingCopy
                }
                className="flex items-center gap-2"
              >
                {isGeneratingCopy ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Copy
                  </>
                )}
              </Button>
            </div>

            {copyError && (
              <div className="p-3 border border-destructive/20 bg-destructive/10 rounded-md">
                <p className="text-sm text-destructive">{copyError}</p>
              </div>
            )}

            <div>
              <Label htmlFor="marketingCopy">Texto de Marketing</Label>
              <textarea
                id="marketingCopy"
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                placeholder="Texto para marketing..."
                value={productData.marketingCopy}
                onChange={(e) =>
                  setProductData({ marketingCopy: e.target.value })
                }
                disabled={isCreating}
              />
              {marketingCopy && (
                <div className="mt-2 p-2 border border-muted bg-muted/50 rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Sugestão IA
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      AI Generated
                    </Badge>
                  </div>
                  <p className="text-sm mb-2 whitespace-pre-wrap">
                    {marketingCopy.copy}
                  </p>
                  {marketingCopy.assumptions &&
                    marketingCopy.assumptions.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          Premissas:
                        </p>
                        <ul className="text-xs text-muted-foreground list-disc list-inside">
                          {marketingCopy.assumptions.map(
                            (assumption, index) => (
                              <li key={index}>{assumption}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={applyMarketingCopy}
                    disabled={isCreating}
                  >
                    Aplicar sugestão
                  </Button>
                </div>
              )}
            </div>
            <div>
              <Label>Palavras-chave</Label>
              <p className="text-sm text-muted-foreground">
                Funcionalidade de palavras-chave será implementada em breve.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Revisão do Produto</h3>
              <div className="grid gap-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Nome:</span>
                    <p className="text-sm">{productData.name || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">SKU:</span>
                    <p className="text-sm">{productData.sku || "-"}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Preço:</span>
                    <p className="text-sm">R$ {productData.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Estoque:</span>
                    <p className="text-sm">{productData.stock}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Descrição:</span>
                  <p className="text-sm">{productData.description || "-"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Categoria:</span>
                  <p className="text-sm">{productData.category || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Novo Produto</CardTitle>
          <CardDescription>
            Adicione um novo produto ao catálogo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Passo {currentStep} de {totalSteps}: {getStepTitle(currentStep)}
              </span>
              <span className="text-muted-foreground">
                {Math.round(getProgress())}%
              </span>
            </div>
            <Progress
              value={getProgress()}
              className="h-2"
              aria-label="Progresso"
            />
          </div>

          <div className="min-h-[300px]">{renderStep()}</div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              {currentStep === 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isCreating}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={previousStep}
                  disabled={isCreating}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed() || isCreating}
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={finish}
                  disabled={!canProceed() || isCreating}
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Criar Produto
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
