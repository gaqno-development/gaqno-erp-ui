import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  aiApiClient,
  type BuildProductProfileRequest,
  type ProductProfileResponse,
  type GenerateContentRequest,
  type GenerateContentResponse,
  type GenerateProductImageRequest,
  type GenerateProductImageResponse,
} from "@gaqno-development/frontcore";
import { type ProductData } from "./useProductWizard";

interface UseProductAISuggestionsReturn {
  generateSuggestions: (productData: ProductData) => Promise<void>;
  generateMarketingCopy: (productData: ProductData) => Promise<void>;
  generateProductImage: (
    productData: ProductData,
    prompt?: string,
  ) => Promise<void>;
  suggestions: ProductProfileResponse | null;
  marketingCopy: GenerateContentResponse | null;
  imageGeneration: GenerateProductImageResponse | null;
  isLoading: boolean;
  isGeneratingCopy: boolean;
  isGeneratingImage: boolean;
  error: string | null;
  copyError: string | null;
  imageError: string | null;
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
  const [imageGeneration, setImageGeneration] =
    useState<GenerateProductImageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

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

  const generateImageMutation = useMutation({
    mutationFn: (request: GenerateProductImageRequest) =>
      aiApiClient.generateProductImage(request),
    onSuccess: (data) => {
      setImageGeneration(data);
      setImageError(null);
    },
    onError: (err) => {
      setImageError(
        err instanceof Error ? err.message : "Failed to generate product image",
      );
      setImageGeneration(null);
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

  const generateProductImage = async (
    productData: ProductData,
    prompt?: string,
  ) => {
    if (!productData.name) {
      setImageError("Product name is required for image generation");
      return;
    }

    const request: GenerateProductImageRequest = {
      product: {
        id: "temp-product-id",
        name: productData.name,
        tenantId: "temp-tenant-id",
        description: productData.description,
        category: productData.category,
      },
      prompt: prompt || undefined,
      count: 1,
    };

    generateImageMutation.mutate(request);
  };

  const clearSuggestions = () => {
    setSuggestions(null);
    setError(null);
    setMarketingCopy(null);
    setCopyError(null);
    setImageGeneration(null);
    setImageError(null);
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
    generateProductImage,
    suggestions,
    marketingCopy,
    imageGeneration,
    isLoading: generateMutation.isPending,
    isGeneratingCopy: generateContentMutation.isPending,
    isGeneratingImage: generateImageMutation.isPending,
    error,
    copyError,
    imageError,
    clearSuggestions,
    applySuggestion,
    applyMarketingCopy,
  };
}
