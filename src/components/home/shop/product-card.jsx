import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden bg-muted">
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="100%"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.tag && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            {product.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-end justify-between gap-3 p-4">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold text-foreground">
            {product.name}
          </h4>

          {product.sub && (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {product.sub}
            </p>
          )}

          <p className="mt-2 text-base font-bold text-primary">
            ${product.price.toLocaleString()}
          </p>
        </div>

        <Button size="icon" className="shrink-0">
          <ShoppingCart size={16} />
        </Button>
      </div>
    </div>
  );
}
