import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/test-utils";
import ProductWizardPage from "./ProductWizardPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@gaqno-development/frontcore", async () => {
  const mock = await import("@/__mocks__/frontcore");
  return { ...mock };
});

describe("ProductWizardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render ProductWizard", () => {
    render(<ProductWizardPage />);
    expect(screen.getByPlaceholderText("Nome do produto")).toBeInTheDocument();
  });

  it("should call navigate to catalog when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductWizardPage />);
    const cancelBtn = screen.getByRole("button", { name: "Cancelar" });
    await user.click(cancelBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/erp/catalog");
  });
});
