"use client";

export function DetailMetaInfo({ fields }) {
  if (!fields || !Array.isArray(fields) || fields.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {fields.map((field, index) => (
        <span key={index}>
          {field.label}:{" "}
          <span className="font-bold text-foreground capitalize">
            {field.value}
          </span>
        </span>
      ))}
    </div>
  );
}

export default DetailMetaInfo;
