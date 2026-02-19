"use client";

import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@gaqno-development/frontcore/components/ui";
import { ChevronLeft } from "lucide-react";

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to={isEdit ? `/erp/catalog/${id}` : "/erp/catalog"}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          {isEdit ? "Back to product" : "Back to catalog"}
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Edit product" : "New product"}</CardTitle>
          <CardDescription>
            Product create and edit will be available when a product API (ERP or
            PDV) is connected. Use Catalog to view products and Product detail
            for AI actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? `Editing product id: ${id}. Form fields will be wired to the API when the backend is ready.`
              : "Create form will appear here once the product create API is available."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
