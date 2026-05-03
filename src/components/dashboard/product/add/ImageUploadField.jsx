"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

const MAX_IMAGES = 5;

export function ImageUploadField({ value = [], onChange }) {
  const [previews, setPreviews] = useState([]);

  const handleAddImages = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const currentCount = previews.length;
      const remainingSlots = MAX_IMAGES - currentCount;

      if (remainingSlots <= 0) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed`);
        return;
      }

      const filesToAdd = files.slice(0, remainingSlots);
      const newPreviews = filesToAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      const updatedPreviews = [...previews, ...newPreviews];
      setPreviews(updatedPreviews);
      onChange(updatedPreviews);

      if (filesToAdd.length < files.length) {
        toast.warning(`Only ${remainingSlots} more image(s) can be added`);
      }

      e.target.value = "";
    },
    [previews, onChange],
  );

  const handleRemove = useCallback(
    (index) => {
      const removed = previews[index];
      if (removed?.preview && removed.file) {
        URL.revokeObjectURL(removed.preview);
      }
      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);
      onChange(newPreviews);
    },
    [previews, onChange],
  );

  const displayImages = previews.length > 0 ? previews : value;

  return (
    <Field>
      <FieldLabel>Product Images (Max {MAX_IMAGES})</FieldLabel>
      <div className="flex flex-wrap gap-3 mt-2">
        {displayImages.map((item, index) => (
          <div key={index} className="relative w-24 h-24">
            <img
              src={item.preview || item.url}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={() => handleRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {displayImages.length < MAX_IMAGES && (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddImages}
            />
          </label>
        )}
      </div>
    </Field>
  );
}
