"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PriceFormat from "@/components/ui/price-format";
import { useCart } from "@/context/cart-context";
import { Package, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const TAG_STYLES = {
  Sale: "bg-destructive text-destructive-foreground",
  New: "bg-blue-500 text-white",
  "Best Seller": "bg-primary text-primary-foreground",
  Hot: "bg-orange-500 text-white",
};

export default function ProductCard({ product, animate = true }) {
  const { addItem } = useCart();
  const hasImage = product.images?.[0]?.url;
  const isOutOfStock = product.stock === 0 || !product.stock;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const cardContent = (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link
        href={`/items/${product.slug}`}
        className="relative block h-52 overflow-hidden bg-linear-to-br from-muted to-muted/50"
      >
        {product.tag && product.tag !== "none" && (
          <Badge
            className={`absolute left-2 top-2 z-10 ${
              TAG_STYLES[product.tag] || "bg-primary"
            }`}
          >
            {product.tag}
          </Badge>
        )}
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
            <h4 className="truncate font-bold text-foreground hover:text-primary transition-colors">
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

          <Button 
            size="icon" 
            className="shrink-0" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  if (!animate) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {cardContent}
    </motion.div>
  );
}