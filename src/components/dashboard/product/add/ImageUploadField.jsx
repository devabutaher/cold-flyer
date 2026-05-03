"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { useUploadImage } from "@/hooks/use-upload-image";
import { ImagePlus, Loader2, X } from "lucide-react";

export function ImageUploadField({ value = [], onChange, multiple = true }) {
  const [previews, setPreviews] = useState(value);
  const uploadImage = useUploadImage();

  const handleAddImages = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      for (const file of files) {
        const preview = URL.createObjectURL(file);
        const newPreview = { file, preview };
        setPreviews((prev) => [...prev, newPreview]);

        try {
          const result = await uploadImage.mutateAsync({ file });
          const uploadedUrl = result.url;
          setPreviews((prev) =>
            prev.map((p) =>
              p.preview === preview ? { ...p, url: uploadedUrl } : p
            )
          );
          onChange((prev) => {
            const arr = [...prev, { url: uploadedUrl }];
            return multiple ? arr : arr.slice(-1);
          });
        } catch (error) {
          setPreviews((prev) => prev.filter((p) => p.preview !== preview));
        }
      }
      e.target.value = "";
    },
    [uploadImage, onChange, multiple]
  );

  const handleRemove = useCallback(
    (index) => {
      const removed = previews[index];
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      setPreviews((prev) => prev.filter((_, i) => i !== index));
      onChange((prev) => prev.filter((_, i) => i !== index));
    },
    [previews, onChange]
  );

  return (
    <Field>
      <FieldLabel>Product Images {multiple && "(Multiple)"}</FieldLabel>
      <div className="flex flex-wrap gap-3 mt-2">
        {previews.map(
          (item, index) =>
            item.url && (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={item.url}
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
            )
        )}

        {(!multiple || previews.length < 5) && (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            {uploadImage.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {multiple ? "Add" : "Upload"}
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              className="hidden"
              onChange={handleAddImages}
              disabled={uploadImage.isPending}
            />
          </label>
        )}
      </div>
    </Field>
  );
}