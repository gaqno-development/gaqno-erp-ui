import { useState, useCallback } from "react";

export interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category: string;
  imageUrls: string[];
  marketingCopy: string;
  keywords: string[];
}

export interface UseProductWizardProps {
  onComplete: (productData: ProductData) => void;
}

export function useProductWizard({ onComplete }: UseProductWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
    category: "",
    imageUrls: [],
    marketingCopy: "",
    keywords: [],
  });
  const [isCreating, setIsCreating] = useState(false);

  const totalSteps = 5;

  const getStepTitle = useCallback((step: number): string => {
    const titles: Record<number, string> = {
      1: "Informações Básicas",
      2: "Descrição e Categoria",
      3: "Imagens",
      4: "Conteúdo de Marketing",
      5: "Revisão",
    };
    return titles[step] || "";
  }, []);

  const validateStep = useCallback(
    (step: number, data: ProductData): boolean => {
      switch (step) {
        case 1:
          return Boolean(data.name.trim() && data.price > 0 && data.stock >= 0);
        case 2:
          return Boolean(
            data.name.trim() &&
            data.price > 0 &&
            data.stock >= 0 &&
            data.description.trim() &&
            data.category.trim(),
          );
        case 3:
          return Boolean(
            data.name.trim() &&
            data.price > 0 &&
            data.stock >= 0 &&
            data.description.trim() &&
            data.category.trim(),
          );
        case 4:
          return Boolean(
            data.name.trim() &&
            data.price > 0 &&
            data.stock >= 0 &&
            data.description.trim() &&
            data.category.trim(),
          );
        case 5:
          return Boolean(
            data.name.trim() &&
            data.price > 0 &&
            data.stock >= 0 &&
            data.description.trim() &&
            data.category.trim(),
          );
        default:
          return false;
      }
    },
    [],
  );

  const canProceed = useCallback(() => {
    return validateStep(currentStep, productData);
  }, [currentStep, productData, validateStep]);

  const nextStep = useCallback(() => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [canProceed, currentStep, totalSteps]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const getProgress = useCallback(() => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  }, [currentStep, totalSteps]);

  const finish = useCallback(async () => {
    if (!canProceed()) {
      return;
    }

    setIsCreating(true);
    try {
      await onComplete(productData);
    } finally {
      setIsCreating(false);
    }
  }, [canProceed, onComplete, productData]);

  const updateProductData = useCallback((updates: Partial<ProductData>) => {
    setProductData((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    currentStep,
    totalSteps,
    productData,
    setProductData: updateProductData,
    setCurrentStep,
    isCreating,
    canProceed,
    nextStep,
    previousStep,
    getProgress,
    finish,
    getStepTitle,
  };
}
