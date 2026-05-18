"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import PriceFormat from "@/components/ui/price-format";
import { useCart } from "@/store/cart";
import { animations, staggerItem, transitionTokens } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Package, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

const TAG_STYLES = {
  Sale: "bg-destructive text-destructive-foreground",
  New: "bg-blue-500 text-white",
  "Best Seller": "bg-primary text-primary-foreground",
  Hot: "bg-orange-500 text-white",
};

export function CatalogCard({ item, type = "product", animate = true, index = 0 }) {
  const t = useTranslations("common");
  const isProduct = type === "product";
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const slug = item.slug || item._id;
  const href = `/${isProduct ? "items" : "services"}/${slug}`;
  const image = item.images?.[0]?.url || item.image;
  const name = item.name;
  const description = item.description || item.shortDescription;

  const formatPrice = (price, priceType) => {
    if (priceType === "quote") return t("quoteBased");
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
      toast.success(t("addedToCart", { name }));
    } else {
      toast.success(t("bookingInitiated", { name }));
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
    toast.success(isWishlisted ? t("removedFromWishlist") : t("addedToWishlist"));
  };

  const cardContent = (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link href={href} className="relative block h-48 overflow-hidden bg-linear-to-br from-muted to-muted/50">
        {isProduct && item.tag && item.tag !== "none" && (
          <Badge className={`absolute left-2 top-2 z-10 ${TAG_STYLES[item.tag] || "bg-primary"}`}>{item.tag}</Badge>
        )}
        {!isProduct && item.isFeatured && (
          <Badge className="absolute left-2 top-2 z-10 bg-primary text-primary-foreground">{t("featured")}</Badge>
        )}

        {/* Wishlist button */}
        <motion.button
          onClick={toggleWishlist}
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
        >
          <motion.div
            animate={isWishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={16}
              className={cn(
                "transition-colors duration-200",
                isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground"
              )}
            />
          </motion.div>
        </motion.button>

        {/* Image with loading shimmer */}
        {image && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-linear-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-pulse" />
            )}
            <Image
              src={image}
              alt={name}
              fill
              priority={index < 3}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        )}
        {!image && (
          <div className="flex h-full items-center justify-center">
            <Package size={48} className="text-muted-foreground/30" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="space-y-1">
          <Link href={href}>
            <h4 className="truncate font-bold text-foreground hover:text-primary transition-colors">{name}</h4>
          </Link>

          {description && <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>}

          {item.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-medium">{item.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({item.reviewCount || 0})</span>
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
            <span className="text-lg font-bold text-primary">{formatPrice(item.basePrice, item.priceType)}</span>
          )}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size={isProduct ? "icon" : "sm"}
              onClick={handleAction}
              disabled={isProduct && (item.stock === 0 || !item.stock)}
            >
              {isProduct ? <ShoppingCart size={16} /> : t("book")}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );

  if (!animate) return cardContent;

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={animations.inView.once}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
    >
      {cardContent}
    </motion.div>
  );
}

export default CatalogCard;
