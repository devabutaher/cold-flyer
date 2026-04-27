import { Button } from "@/components/ui/button";
import PriceFormat from "@/components/ui/price-format";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link
        href={`/items/${product.id}`}
        className="relative block h-52 overflow-hidden bg-muted"
      >
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
      </Link>

      <div className="flex flex-1 items-end justify-between gap-3 p-4">
        <div className="min-w-0 space-y-2">
          <div>
            <Link href={`/items/${product.id}`}>
              <h4 className="truncate font-bold text-foreground hover:text-primary">
                {product.name}
              </h4>
            </Link>

            {product.sub && (
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                {product.sub}
              </p>
            )}
          </div>

          <PriceFormat
            originalPrice={product.originalPrice}
            salePrice={product.price}
            classNameSalePrice="text-lg text-primary"
          />
        </div>

        <Button size="icon" className="shrink-0">
          <ShoppingCart size={16} />
        </Button>
      </div>
    </div>
  );
}
