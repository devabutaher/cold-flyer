"use client";

import ProtectedRoute from "@/components/auth/protected-routes";
import AddProductForm from "@/components/dashboard/product/add/add-product";
import { acParts, acUnits } from "@/data/products-data";
import { useState } from "react";

export default function AddProductPage() {
  const [units, setUnits] = useState(acUnits);
  console.log("✏️ => units:", units);
  const [parts, setParts] = useState(acParts);
  console.log("✏️ => parts:", parts);

  return (
    <ProtectedRoute>
      <div className="py-8">
        <AddProductForm
          onAddUnit={(newUnit) => setUnits((prev) => [...prev, newUnit])}
          onAddPart={(newPart) => setParts((prev) => [...prev, newPart])}
          unitsCount={units.length}
          partsCount={parts.length}
        />
      </div>
    </ProtectedRoute>
  );
}
