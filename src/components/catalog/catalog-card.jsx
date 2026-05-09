"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PriceFormat from "@/components/ui/price-format";
import { useCart } from "@/context/cart-context";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

const TAG_STYLES = {
  Sale: "bg-destructive text-destructive-foreground",
  New: "bg-blue-500 text-white",
  "Best Seller": "bg-primary text-primary-foreground",
  Hot: "bg-orange-500 text-white",
};

export function CatalogCard({ item, type = "product", animate = true }) {
  const isProduct = type === "product";
  const { addItem } = useCart();

  const slug = item.slug || item._id;
  const href = `/${isProduct ? "items" : "services"}/${slug}`;
  const image = item.images?.[0]?.url || item.image;
  const name = item.name;
  const description = item.description || item.shortDescription;

  const formatPrice = (price, priceType) => {
    if (priceType === "quote") return "Quote Based";
    if (priceType === "hourly") return `৳${price}/hr`;
    return `৳${price?.toLocaleString()}`;
  };

  const handleAction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProduct) {
      const isOutOfStock = item.stock === 0 || !item.stock;
      if (isOutOfStock) return;
      addItem(item, 1);
      toast.success(`${name} added to cart`);
    } else {
      toast.success(`Booking initiated for ${name}`);
    }
  };

  const cardContent = (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link
        href={href}
        className="relative block h-48 overflow-hidden bg-linear-to-br from-muted to-muted/50"
      >
        {isProduct && item.tag && item.tag !== "none" && (
          <Badge
            className={`absolute left-2 top-2 z-10 ${
              TAG_STYLES[item.tag] || "bg-primary"
            }`}
          >
            {item.tag}
          </Badge>
        )}
        {!isProduct && item.isFeatured && (
          <Badge className="absolute left-2 top-2 z-10 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            loading="eager"
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
          <Link href={href}>
            <h4 className="truncate font-bold text-foreground hover:text-primary transition-colors">
              {name}
            </h4>
          </Link>

          {description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          )}

          {item.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-medium">{item.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({item.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          {isProduct ? (
            <PriceFormat
              originalPrice={item.originalPrice}
              salePrice={item.price}
              classNameSalePrice="text-lg text-primary"
            />
          ) : (
            <span className="text-lg font-bold text-primary">
              {formatPrice(item.basePrice, item.priceType)}
            </span>
          )}

          <Button
            size={isProduct ? "icon" : "sm"}
            onClick={handleAction}
            disabled={isProduct && (item.stock === 0 || !item.stock)}
          >
            {isProduct ? <ShoppingCart size={16} /> : "Book"}
          </Button>
        </div>
      </div>
    </div>
  );

  if (!animate) return cardContent;

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

export default CatalogCard;
