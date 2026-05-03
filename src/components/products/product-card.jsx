import { Button } from "@/components/ui/button";
import PriceFormat from "@/components/ui/price-format";
import { Package, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const hasImage = product.images?.[0]?.url;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link
        href={`/items/${product.slug}`}
        className="relative block h-52 overflow-hidden bg-linear-to-br from-muted to-muted/50"
      >
        {hasImage ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            sizes="100%"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package size={48} className="text-muted-foreground/30" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="space-y-1">
          <Link href={`/items/${product.slug}`}>
            <h4 className="truncate font-bold text-foreground hover:text-primary">
              {product.name}
            </h4>
          </Link>

          {product.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <PriceFormat
            originalPrice={product.originalPrice}
            salePrice={product.price}
            classNameSalePrice="text-lg text-primary"
          />

          <Button size="icon" className="shrink-0">
            <ShoppingCart size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
