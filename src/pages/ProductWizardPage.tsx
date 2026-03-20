import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateErpProduct } from "@gaqno-development/frontcore";
import { ProductWizard } from "../components/ProductWizard/ProductWizard";
import { type ProductData } from "../hooks/useProductWizard";

export default function ProductWizardPage() {
  const navigate = useNavigate();
  const createProduct = useCreateErpProduct();
  const [isWizardOpen] = useState(true);

  const handleComplete = async (productData: ProductData) => {
    const result = await createProduct.mutateAsync({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      sku: productData.sku,
      category: productData.category,
      imageUrls: productData.imageUrls,
    });
    navigate(`/erp/catalog/${result.id}`);
  };

  const handleCancel = () => {
    navigate("/erp/catalog");
  };

  return (
    <ProductWizard
      open={isWizardOpen}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}
