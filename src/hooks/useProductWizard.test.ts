import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useProductWizard } from "./useProductWizard";

describe("useProductWizard", () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      expect(result.current.currentStep).toBe(1);
      expect(result.current.totalSteps).toBe(5);
      expect(result.current.productData).toEqual({
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
      expect(result.current.isCreating).toBe(false);
    });
  });

  describe("navigation", () => {
    it("should go to next step when can proceed", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      act(() => {
        result.current.setProductData({
          name: "Test Product",
          price: 10,
          stock: 5,
        });
      });

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it("should not go to next step when cannot proceed", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it("should go to previous step", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      act(() => {
        result.current.setProductData({
          name: "Test Product",
          price: 10,
          stock: 5,
        });
      });

      act(() => {
        result.current.nextStep();
      });

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it("should not go to previous step from first step", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe(1);
    });
  });

  describe("validation", () => {
    it("should validate step 1 - basic info", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      // Empty data should not be valid
      expect(result.current.canProceed()).toBe(false);

      act(() => {
        result.current.setProductData({
          name: "Test Product",
          price: 10,
          stock: 5,
        });
      });

      expect(result.current.canProceed()).toBe(true);
    });

    it("should validate step 2 - description and category", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      act(() => {
        result.current.setProductData({
          name: "Test Product",
          price: 10,
          stock: 5,
        });
        result.current.setCurrentStep(2);
      });

      expect(result.current.canProceed()).toBe(false);

      act(() => {
        result.current.setProductData({
          ...result.current.productData,
          description: "Test description",
          category: "Test category",
        });
      });

      expect(result.current.canProceed()).toBe(true);
    });

    it("should validate step 5 - review", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      act(() => {
        result.current.setCurrentStep(5);
      });

      expect(result.current.canProceed()).toBe(false);

      act(() => {
        result.current.setProductData({
          name: "Test Product",
          description: "Test description",
          price: 10,
          stock: 5,
          category: "Test category",
        });
      });

      expect(result.current.canProceed()).toBe(true);
    });
  });

  describe("progress calculation", () => {
    it("should calculate progress correctly", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      expect(result.current.getProgress()).toBe(0);

      act(() => {
        result.current.setCurrentStep(2);
      });

      expect(result.current.getProgress()).toBe(25);

      act(() => {
        result.current.setCurrentStep(5);
      });

      expect(result.current.getProgress()).toBe(100);
    });
  });

  describe("completion", () => {
    it("should call onComplete when finishing wizard", async () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      const completeProductData = {
        name: "Test Product",
        description: "Test description",
        price: 10,
        stock: 5,
        category: "Test category",
        sku: "",
        imageUrls: [],
        marketingCopy: "",
        keywords: [],
      };

      act(() => {
        result.current.setProductData(completeProductData);
        result.current.setCurrentStep(5);
      });

      await act(async () => {
        await result.current.finish();
      });

      expect(mockOnComplete).toHaveBeenCalledWith(completeProductData);
    });

    it("should not complete if validation fails", async () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      act(() => {
        result.current.setCurrentStep(5);
      });

      await act(async () => {
        await result.current.finish();
      });

      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  describe("step titles", () => {
    it("should return correct step titles", () => {
      const { result } = renderHook(() =>
        useProductWizard({ onComplete: mockOnComplete }),
      );

      expect(result.current.getStepTitle(1)).toBe("Informações Básicas");
      expect(result.current.getStepTitle(2)).toBe("Descrição e Categoria");
      expect(result.current.getStepTitle(3)).toBe("Imagens");
      expect(result.current.getStepTitle(4)).toBe("Conteúdo de Marketing");
      expect(result.current.getStepTitle(5)).toBe("Revisão");
    });
  });
});
