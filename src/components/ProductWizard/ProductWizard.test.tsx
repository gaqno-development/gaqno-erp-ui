import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { ProductWizard } from "./ProductWizard";

describe("ProductWizard", () => {
  const mockOnComplete = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderProductWizard = (props = {}) => {
    return render(
      <ProductWizard
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
        open={true}
        {...props}
      />,
    );
  };

  describe("initialization", () => {
    it("should render wizard with initial step", () => {
      renderProductWizard();

      expect(screen.getByText("Novo Produto")).toBeInTheDocument();
      expect(
        screen.getByText("Passo 1 de 5: Informações Básicas"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Nome do produto"),
      ).toBeInTheDocument();
    });

    it("should show progress bar", () => {
      renderProductWizard();

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("should disable next button when form is invalid", () => {
      renderProductWizard();

      const nextButton = screen.getByText("Próximo");
      expect(nextButton).toBeDisabled();
    });

    it("should enable next button when form is valid", async () => {
      renderProductWizard();

      const nameInput = screen.getByPlaceholderText("Nome do produto");
      const priceInput = screen.getByPlaceholderText("Preço");
      const stockInput = screen.getByPlaceholderText("Estoque inicial");

      await fireEvent.change(nameInput, { target: { value: "Test Product" } });
      await fireEvent.change(priceInput, { target: { value: "10.50" } });
      await fireEvent.change(stockInput, { target: { value: "5" } });

      const nextButton = screen.getByText("Próximo");
      expect(nextButton).not.toBeDisabled();
    });

    it("should navigate to next step when clicking next", async () => {
      renderProductWizard();

      const nameInput = screen.getByPlaceholderText("Nome do produto");
      const priceInput = screen.getByPlaceholderText("Preço");
      const stockInput = screen.getByPlaceholderText("Estoque inicial");

      await fireEvent.change(nameInput, { target: { value: "Test Product" } });
      await fireEvent.change(priceInput, { target: { value: "10.50" } });
      await fireEvent.change(stockInput, { target: { value: "5" } });

      const nextButton = screen.getByText("Próximo");
      await fireEvent.click(nextButton);

      expect(
        screen.getByText("Passo 2 de 5: Descrição e Categoria"),
      ).toBeInTheDocument();
    });

    it("should show cancel button on first step", () => {
      renderProductWizard();

      const cancelButton = screen.getByText("Cancelar");
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe("form inputs", () => {
    it("should update product data when typing", async () => {
      renderProductWizard();

      const nameInput = screen.getByPlaceholderText("Nome do produto");
      await fireEvent.change(nameInput, { target: { value: "Test Product" } });

      expect(nameInput).toHaveValue("Test Product");
    });

    it("should validate price input", async () => {
      renderProductWizard();

      const nameInput = screen.getByPlaceholderText("Nome do produto");
      const priceInput = screen.getByPlaceholderText("Preço");
      const stockInput = screen.getByPlaceholderText("Estoque inicial");

      await fireEvent.change(nameInput, { target: { value: "Test Product" } });
      await fireEvent.change(priceInput, { target: { value: "0" } });
      await fireEvent.change(stockInput, { target: { value: "5" } });

      const nextButton = screen.getByText("Próximo");
      expect(nextButton).toBeDisabled();

      await fireEvent.change(priceInput, { target: { value: "10.50" } });
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe("progress", () => {
    it("should update progress when navigating steps", async () => {
      renderProductWizard();

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toBeInTheDocument();

      // Fill form and go to next step
      const nameInput = screen.getByPlaceholderText("Nome do produto");
      const priceInput = screen.getByPlaceholderText("Preço");
      const stockInput = screen.getByPlaceholderText("Estoque inicial");

      await fireEvent.change(nameInput, { target: { value: "Test Product" } });
      await fireEvent.change(priceInput, { target: { value: "10.50" } });
      await fireEvent.change(stockInput, { target: { value: "5" } });

      const nextButton = screen.getByText("Próximo");
      await fireEvent.click(nextButton);

      expect(progressBar).toBeInTheDocument();
    });
  });

  describe("completion", () => {
    it("should show final step with review", async () => {
      renderProductWizard();

      // Fill step 1
      const nameInput = screen.getByPlaceholderText("Nome do produto");
      const priceInput = screen.getByPlaceholderText("Preço");
      const stockInput = screen.getByPlaceholderText("Estoque inicial");

      await fireEvent.change(nameInput, { target: { value: "Test Product" } });
      await fireEvent.change(priceInput, { target: { value: "10.50" } });
      await fireEvent.change(stockInput, { target: { value: "5" } });

      // Go to step 2
      const nextButton = screen.getByText("Próximo");
      await fireEvent.click(nextButton);

      // Fill step 2
      const descriptionInput = screen.getByPlaceholderText(
        "Descreva o produto...",
      );
      const categoryInput = screen.getByPlaceholderText("Categoria do produto");

      await fireEvent.change(descriptionInput, {
        target: { value: "Test description" },
      });
      await fireEvent.change(categoryInput, {
        target: { value: "Test category" },
      });

      // Go through remaining steps
      for (let i = 0; i < 3; i++) {
        const nextBtn = screen.getByText("Próximo");
        await fireEvent.click(nextBtn);
      }

      expect(screen.getByText("Passo 5 de 5: Revisão")).toBeInTheDocument();
      expect(screen.getByText("Criar Produto")).toBeInTheDocument();
    });

    it("should call onComplete when finishing wizard", async () => {
      renderProductWizard();

      // Fill step 1
      const nameInput = screen.getByPlaceholderText("Nome do produto");
      const priceInput = screen.getByPlaceholderText("Preço");
      const stockInput = screen.getByPlaceholderText("Estoque inicial");

      await fireEvent.change(nameInput, { target: { value: "Test Product" } });
      await fireEvent.change(priceInput, { target: { value: "10.50" } });
      await fireEvent.change(stockInput, { target: { value: "5" } });

      // Go to step 2
      const nextButton = screen.getByText("Próximo");
      await fireEvent.click(nextButton);

      // Fill step 2
      const descriptionInput = screen.getByPlaceholderText(
        "Descreva o produto...",
      );
      const categoryInput = screen.getByPlaceholderText("Categoria do produto");

      await fireEvent.change(descriptionInput, {
        target: { value: "Test description" },
      });
      await fireEvent.change(categoryInput, {
        target: { value: "Test category" },
      });

      // Go through remaining steps
      for (let i = 0; i < 3; i++) {
        const nextBtn = screen.getByText("Próximo");
        await fireEvent.click(nextBtn);
      }

      const createButton = screen.getByText("Criar Produto");
      await fireEvent.click(createButton);

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Test Product",
            price: 10.5,
            stock: 5,
            description: "Test description",
            category: "Test category",
          }),
        );
      });
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA labels", () => {
      renderProductWizard();

      expect(screen.getByRole("progressbar")).toHaveAttribute(
        "aria-label",
        "Progresso",
      );
    });
  });
});
