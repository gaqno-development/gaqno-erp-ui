import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  aiApiClient,
  type BuildProductProfileRequest,
  type ProductProfileResponse,
  type GenerateContentRequest,
  type GenerateContentResponse,
} from "@gaqno-development/frontcore";
import { type ProductData } from "./useProductWizard";

interface UseProductAISuggestionsReturn {
  generateSuggestions: (productData: ProductData) => Promise<void>;
  generateMarketingCopy: (productData: ProductData) => Promise<void>;
  suggestions: ProductProfileResponse | null;
  marketingCopy: GenerateContentResponse | null;
  isLoading: boolean;
  isGeneratingCopy: boolean;
  error: string | null;
  copyError: string | null;
  clearSuggestions: () => void;
  applySuggestion: (field: keyof ProductData, value: any) => void;
  applyMarketingCopy: () => void;
}

export function useProductAISuggestions(
  onUpdateProduct: (updates: Partial<ProductData>) => void,
): UseProductAISuggestionsReturn {
  const [suggestions, setSuggestions] = useState<ProductProfileResponse | null>(
    null,
  );
  const [marketingCopy, setMarketingCopy] =
    useState<GenerateContentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: (request: BuildProductProfileRequest) =>
      aiApiClient.buildProductProfile(request),
    onSuccess: (data) => {
      setSuggestions(data);
      setError(null);
    },
    onError: (err) => {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate AI suggestions",
      );
      setSuggestions(null);
    },
  });

  const generateContentMutation = useMutation({
    mutationFn: (request: GenerateContentRequest) =>
      aiApiClient.generateProductContent(request),
    onSuccess: (data) => {
      setMarketingCopy(data);
      setCopyError(null);
    },
    onError: (err) => {
      setCopyError(
        err instanceof Error
          ? err.message
          : "Failed to generate marketing copy",
      );
      setMarketingCopy(null);
    },
  });

  const generateSuggestions = async (productData: ProductData) => {
    if (!productData.name || !productData.price) {
      setError("Product name and price are required for AI suggestions");
      return;
    }

    const request: BuildProductProfileRequest = {
      product: {
        id: "temp-product-id", // Temporary ID for AI suggestions
        name: productData.name,
        price: productData.price,
        tenantId: "temp-tenant-id", // Will be replaced with actual tenant ID
        stock: productData.stock || 0,
        sku: productData.sku,
        description: productData.description,
        category: productData.category,
      },
      inferMissing: true,
    };

    generateMutation.mutate(request);
  };

  const generateMarketingCopy = async (productData: ProductData) => {
    if (!productData.name || !productData.price) {
      setCopyError(
        "Product name and price are required for marketing copy generation",
      );
      return;
    }

    const request: GenerateContentRequest = {
      product: {
        id: "temp-product-id",
        name: productData.name,
        price: productData.price,
        tenantId: "temp-tenant-id",
      },
    };

    generateContentMutation.mutate(request);
  };

  const clearSuggestions = () => {
    setSuggestions(null);
    setError(null);
    setMarketingCopy(null);
    setCopyError(null);
  };

  const applySuggestion = (field: keyof ProductData, value: any) => {
    onUpdateProduct({ [field]: value });
  };

  const applyMarketingCopy = () => {
    if (marketingCopy?.copy) {
      onUpdateProduct({ marketingCopy: marketingCopy.copy });
    }
  };

  return {
    generateSuggestions,
    generateMarketingCopy,
    suggestions,
    marketingCopy,
    isLoading: generateMutation.isPending,
    isGeneratingCopy: generateContentMutation.isPending,
    error,
    copyError,
    clearSuggestions,
    applySuggestion,
    applyMarketingCopy,
  };
}
