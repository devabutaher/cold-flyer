"use client";

import { QuantityInput } from "@/components/carts/quantity-input";
import ImageCarousel from "@/components/products/image-carousel";
import InfoTabs from "@/components/products/info-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { animations } from "@/lib/animation";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Tag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { haptic } from "@/lib/haptic";
import { DetailBackButton } from "./detail-back-button";
import { DetailMetaInfo } from "./detail-meta-info";
import { DetailPrice } from "./detail-price";
import { DetailTrustBadges } from "./detail-trust-badges";

export function ProductDetailClient({ product }) {
  const t = useTranslations("common");
  const { addItem } = useCart();
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId, "product");

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;
  const total = product.price * quantity;

  const handleAddToCart = () => {
    if (product && !isOutOfStock) {
      haptic.success();
      addItem(product, quantity);
      toast.success(t("addedToCart", { name: `${quantity} × ${product.name}` }));
    }
  };

  const handleBuyNow = () => {
    if (product && !isOutOfStock) {
      haptic.heavy();
      addItem(product, quantity);
      window.location.href = "/cart";
    }
  };

  const images =
    product.images?.length > 0
      ? product.images.map((img, idx) => ({
          url: img.url,
          title: t("productView", { name: product.name, n: idx + 1 }),
        }))
      : [{ url: "", title: product.name }];

  const iconMap = { ShieldCheck, Truck, Tag };

  const trustBadges = [
    { icon: ShieldCheck, text: product.warranty ? `${product.warranty} Warranty` : t("genuineProduct") },
    { icon: Truck, text: t("freeDelivery") },
    { icon: Tag, text: t("bestPrice") },
  ];

  return (
    <div className="bg-background min-h-screen pb-10">
      <DetailBackButton href="/items" label={t("products")} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <motion.div
          className="relative"
          variants={animations.entrance.fadeLeft}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          {(product.tag || product.onSale) && (
            <div className="absolute top-2 left-2 z-20">
              <Badge variant={product.tag === "Sale" || product.onSale ? "destructive" : "default"}>
                {product.tag || t("sale")}
              </Badge>
            </div>
          )}
          <ImageCarousel
            images={images}
            aspectRatio="square"
            imageFit="contain"
            thumbPosition="bottom"
            className="mx-auto max-w-full"
          />
        </motion.div>

        <motion.div
          className="flex flex-col"
          variants={animations.entrance.fadeRight}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{product.category}</span>
            <span className="text-xs font-medium text-muted-foreground">
              {t("sku")}: {product.sku}
            </span>
          </div>

          <div className="mb-4">
            <h1 className="font-sans font-bold text-2xl md:text-3xl text-foreground leading-tight tracking-tight mb-2">
              {product.name}
            </h1>

            {product.description && <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>}
          </div>

          <DetailPrice
            mode="product"
            originalPrice={product.originalPrice}
            salePrice={product.price}
            showSavePercentage
          />

          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                isOutOfStock ? "bg-destructive" : isLowStock ? "bg-amber-500" : "bg-green-500",
              )}
              animate={isLowStock ? { opacity: [1, 0.5, 1] } : {}}
              transition={isLowStock ? { duration: 1.5, repeat: Infinity } : {}}
            />
            <span
              className={cn(
                "text-xs font-bold",
                isOutOfStock ? "text-destructive" : isLowStock ? "text-amber-600" : "text-green-600",
              )}
            >
              {isOutOfStock
                ? t("outOfStock")
                : isLowStock
                  ? t("onlyUnitsLeft", { stock: product.stock })
                  : t("inStock")}
            </span>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-end gap-6 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("quantity")}</p>
              <QuantityInput
                quantity={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stock || 99}
                disabled={isOutOfStock}
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{t("total")}</p>
              <motion.p
                className="font-bold text-2xl text-foreground"
                key={`total-${total}`}
                initial={{ scale: 1.1, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <span className="font-black">৳</span>
                {total.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>

          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <Button variant="outline" size="lg" className="w-full" disabled={isOutOfStock} onClick={handleAddToCart}>
                {t("addToCart")}
              </Button>
            </div>
            <div className="flex-1">
              <Button size="lg" className="w-full" disabled={isOutOfStock} onClick={handleBuyNow}>
                {t("buyNow")}
              </Button>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (isWishlisted) {
                  removeWishlistItem(productId, "product");
                  toast.success(t("removedFromWishlist"));
                } else {
                  addWishlistItem({
                    itemId: productId,
                    type: "product",
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.images?.[0]?.url || "",
                  });
                  toast.success(t("addedToWishlist"));
                }
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted"
              aria-label={isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
            >
              <Heart
                size={18}
                className={cn(
                  "transition-colors",
                  isWishlisted ? "fill-destructive text-destructive" : "text-muted-foreground",
                )}
              />
            </button>
          </div>

          <DetailTrustBadges items={trustBadges} />

          <DetailMetaInfo
            fields={[
              { label: t("brand"), value: product.brand },
              ...(product.warranty ? [{ label: t("warranty"), value: product.warranty }] : []),
              ...(product.tag ? [{ label: t("tag"), value: product.tag }] : []),
            ]}
          />

          <InfoTabs product={product} />
        </motion.div>
      </div>
    </div>
  );
}
