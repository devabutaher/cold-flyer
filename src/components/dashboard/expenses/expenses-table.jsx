"use client";

import { useMemo, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/table/data-table";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { buildExpenseColumns } from "./expenses-columns";
import { ExpenseFormDialog } from "./expense-form-dialog";
import { getClient } from "@/lib/http-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Plus, DollarSign } from "lucide-react";
import { toast } from "sonner";

const mapRow = (e) => ({
  item: e.item,
  category: e.category,
  amount: e.amount,
  date: e.date ? new Date(e.date).toLocaleDateString() : "—",
  addedBy: e.addedBy?.name || e.addedBy || "—",
});

const PDF_COLUMNS = [
  { header: "Item", accessorKey: "item", width: 2 },
  { header: "Category", accessorKey: "category", width: 1.5 },
  { header: "Amount", accessorKey: "amount", width: 1 },
  { header: "Date", accessorKey: "date", width: 1 },
  { header: "Added By", accessorKey: "addedBy", width: 1.5 },
];

export default function ExpensesTable() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const { data: expenses = [], isLoading, error } = useQuery({
    queryKey: ["admin-expenses"],
    queryFn: async () => {
      const res = await getClient().get("/expenses");
      return res.data?.data?.expenses || [];
    },
  });

  const totalAmount = useMemo(() => expenses.reduce((sum, e) => sum + (e.amount || 0), 0), [expenses]);

  const deleteMutation = useMutation({
    mutationFn: (id) => getClient().delete(`/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-expenses"] });
      toast.success("Expense deleted.");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  const handleEdit = useCallback((expense) => {
    setEditingExpense(expense);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (!confirm("Delete this expense?")) return;
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const handleFormSuccess = useCallback(() => {
    setFormOpen(false);
    setEditingExpense(null);
    queryClient.invalidateQueries({ queryKey: ["admin-expenses"] });
  }, [queryClient]);

  const columns = useMemo(
    () => buildExpenseColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete],
  );

  const categoryOptions = [
    "utilities",
    "salary",
    "rent",
    "maintenance",
    "transport",
    "office_supplies",
    "marketing",
    "food",
    "other",
  ];

  return (
    <>
      <ExpenseFormDialog
        mode={editingExpense ? "edit" : "create"}
        expense={editingExpense}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingExpense(null);
        }}
        onSuccess={handleFormSuccess}
      />

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-destructive" />
            <span className="text-2xl font-bold">৳{totalAmount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={expenses}
        loading={isLoading}
        error={error}
        rowCount="expenses"
        defaultSort={[{ id: "date", desc: true }]}
        emptyMessage="No expenses found."
        emptyIcon={<Receipt size={40} />}
        searchFields={["item", "category", "amount", "date", "addedBy.name", "addedBy"]}
        toolbar={(table) => (
          <TableToolbar
            table={table}
            searchPlaceholder="Search expenses..."
            selectedLabel="expenses"
            filters={[
              {
                columnId: "category",
                placeholder: "All Categories",
                allLabel: "All Categories",
                options: categoryOptions,
              },
            ]}
            actions={
              <>
                <Button size="sm" className="h-9 gap-1.5" onClick={() => setFormOpen(true)}>
                  <Plus size={14} />
                  Add Expense
                </Button>
                <ExportMenu
                  table={table}
                  filename="expenses"
                  mapRow={mapRow}
                  pdfTitle="ColdFlyer — Expenses Report"
                  pdfColumns={PDF_COLUMNS}
                />
              </>
            }
          />
        )}
      />
    </>
  );
}
