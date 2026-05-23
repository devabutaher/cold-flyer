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

      const currentCount = value.filter((img) => !img.file).length + value.filter((img) => img.file).length;
      const remainingSlots = MAX_IMAGES - currentCount;

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

      // Revoke object URL for new files to free memory
      if (item?.preview && item?.file) {
        URL.revokeObjectURL(item.preview);
      }

      // Filter out the removed image
      const newImages = value.filter((_, i) => i !== index);
      onChange(newImages);
    },
    [value, onChange],
  );

  return (
    <Field>
      <FieldLabel>Product Images (Max {MAX_IMAGES})</FieldLabel>
      <div className="flex flex-wrap gap-3 mt-2">
        {value.map((item, index) => (
          <div key={index} className="relative w-24 h-24">
            <div className="relative w-full h-full rounded-lg overflow-hidden border">
              {(item.preview || item.url) ? (
                <Image
                  src={item.preview || item.url}
                  alt={`Image ${index + 1}`}
                  fill
                  sizes="256px"
                  quality={100}
                  loading="eager"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs">
                  No image
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 z-10"
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
