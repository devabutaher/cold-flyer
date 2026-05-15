"use client";

import { useCallback } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

const MAX_IMAGES = 5;

export function ImageUploadField({ value = [], onChange }) {
  const handleAddImages = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const remainingSlots = MAX_IMAGES - value.length;

      if (remainingSlots <= 0) {
        toast.error(`Maximum ${MAX_IMAGES} images allowed`);
        return;
      }

      const filesToAdd = files.slice(0, remainingSlots);
      const newImages = filesToAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        url: null,
      }));

      const updatedImages = [...value, ...newImages];
      onChange(updatedImages);

      if (filesToAdd.length < files.length) {
        toast.warning(`Only ${remainingSlots} more image(s) can be added`);
      }

      e.target.value = "";
    },
    [value, onChange],
  );

  const handleRemove = useCallback(
    (index) => {
      const item = value[index];

      if (item?.preview && item?.file) {
        URL.revokeObjectURL(item.preview);
      }

      const newImages = value.filter((_, i) => i !== index);
      onChange(newImages);
    },
    [value, onChange],
  );

  return (
    <Field>
      <FieldLabel>Service Images (Max {MAX_IMAGES})</FieldLabel>
      <div className="flex flex-wrap gap-3 mt-2">
        {value.map((item, index) => (
          <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border">
            <Image
              src={item.preview || item.url}
              alt={`Image ${index + 1}`}
              fill
              sizes="96px"
              quality={80}
              className="object-cover"
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

        {value.length < MAX_IMAGES && (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Add</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleAddImages} />
          </label>
        )}
      </div>
    </Field>
  );
}
