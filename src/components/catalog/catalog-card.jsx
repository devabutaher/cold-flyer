"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PriceFormat from "@/components/ui/price-format";
import { haptic } from "@/lib/haptic";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { motion } from "framer-motion";
import { Heart, Package, ShoppingCart, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import { toast } from "sonner";

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
      haptic.success();
      addItem(item, 1);
      toast.success(t("addedToCart", { name }));
    } else {
      haptic.click();
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
    <div className="group flex h-full flex-col rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl">
      <Link href={href} className="relative block h-36 sm:h-48 overflow-hidden rounded-t-xl bg-linear-to-br from-muted to-muted/50">
        {isProduct && item.tag && item.tag !== "none" && (
          <Badge className={`absolute left-2 top-2 z-10 ${TAG_STYLES[item.tag] || "bg-primary"}`}>{item.tag}</Badge>
        )}
        {!isProduct && item.isFeatured && (
          <Badge className="absolute left-2 top-2 z-10 bg-primary text-primary-foreground">{t("featured")}</Badge>
        )}

        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className="absolute right-2 top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label={isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
        >
          <motion.div animate={isWishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
            <Heart
              size={16}
              className={cn(
                "transition-colors duration-200",
                isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground",
              )}
            />
          </motion.div>
        </button>

        {/* Image with loading shimmer */}
        {image && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-linear-to-r from-muted via-muted/50 to-muted bg-size-[200%_100%] animate-pulse" />
            )}
            <Image
              src={image}
              alt={name}
              fill
              priority={index < 3}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0",
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

      <div className="flex flex-1 flex-col justify-between gap-2 p-3 sm:p-4">
        <div className="space-y-1">
          <Link href={href}>
            <h4 className="truncate font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors">
              {name}
            </h4>
          </Link>

          {description && <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground">{description}</p>}

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

          {isProduct ? (
            <Button size="icon" onClick={handleAction} disabled={item.stock === 0 || !item.stock}>
              <ShoppingCart size={16} />
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href={`/dashboard/bookings/new/${item._id}`}>{t("book")}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (!animate) return cardContent;

  return cardContent;
}

export const MemoizedCatalogCard = memo(function MemoizedCatalogCard(props) {
  return <CatalogCard {...props} />;
});

export default CatalogCard;
