"use client";

import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  DataTable,
  ColumnDef,
} from "@gaqno-development/frontcore/components/ui";
import { useERPInventory } from "@gaqno-development/frontcore/hooks/erp";
import { LowStockAlert } from "../components/LowStockAlert";

export default function InventoryPage() {
  const { inventory, isLoading } = useERPInventory({ limit: 200 });
  const { withStock, lowStock } = inventory;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Produto",
    },
    {
      accessorKey: "stock",
      header: "Estoque",
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        const id = row.original.id;
        const isLow = lowStock.some((p: any) => p.id === id);
        return (
          <div className="text-right">
            {isLow ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {stock}
              </span>
            ) : (
              stock
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/erp/catalog/${row.original.id}`}>Ver</Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Gestão de Estoque</h2>

      <Card>
        <CardHeader>
          <CardTitle>Níveis de estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <LowStockAlert products={lowStock} />

          <DataTable
            columns={columns}
            data={{ data: withStock, isLoading }}
            initialPageSize={50}
            cardStyle={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
