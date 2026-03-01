import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductWizard } from '../components/ProductWizard/ProductWizard';
import { type ProductData } from '../hooks/useProductWizard';

export default function ProductWizardPage() {
  const navigate = useNavigate();
  const [isWizardOpen, setIsWizardOpen] = useState(true);

  const handleComplete = (productData: ProductData) => {
    // TODO: Integrate with actual product creation API
    console.log('Product created:', productData);
    
    // Navigate back to catalog after creation
    navigate('/erp/catalog');
  };

  const handleCancel = () => {
    // Navigate back to catalog
    navigate('/erp/catalog');
  };

  return (
    <ProductWizard
      open={isWizardOpen}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
}
