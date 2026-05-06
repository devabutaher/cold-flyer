"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

function OptimizedImage({
  src,
  alt,
  className,
  fill = true,
  priority = false,
  sizes = "100vw",
  ...props
}) {
  return (
    <Image
      src={src}
      alt={alt || ""}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}

export { OptimizedImage };