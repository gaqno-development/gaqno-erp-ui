import { useState } from 'react';
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
} from '@gaqno-development/frontcore/components/ui';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useProductWizard, type ProductData } from '../../hooks/useProductWizard';

export interface ProductWizardProps {
  onComplete: (productData: ProductData) => void;
  onCancel: () => void;
  open?: boolean;
}

export function ProductWizard({ onComplete, onCancel, open = true }: ProductWizardProps) {
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
    getStepTitle
  } = useProductWizard({ onComplete });

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
                  value={productData.price || ''}
                  onChange={(e) => setProductData({ price: parseFloat(e.target.value) || 0 })}
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
                  value={productData.stock || ''}
                  onChange={(e) => setProductData({ stock: parseInt(e.target.value) || 0 })}
                  disabled={isCreating}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Descrição do Produto *</Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                placeholder="Descreva o produto..."
                value={productData.description}
                onChange={(e) => setProductData({ description: e.target.value })}
                disabled={isCreating}
              />
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
                <p className="text-muted-foreground">Arraste imagens aqui ou clique para upload</p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="marketingCopy">Texto de Marketing</Label>
              <textarea
                id="marketingCopy"
                className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                placeholder="Texto para marketing..."
                value={productData.marketingCopy}
                onChange={(e) => setProductData({ marketingCopy: e.target.value })}
                disabled={isCreating}
              />
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
                    <p className="text-sm">{productData.name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">SKU:</span>
                    <p className="text-sm">{productData.sku || '-'}</p>
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
                  <p className="text-sm">{productData.description || '-'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Categoria:</span>
                  <p className="text-sm">{productData.category || '-'}</p>
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

          <div className="min-h-[300px]">
            {renderStep()}
          </div>

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
