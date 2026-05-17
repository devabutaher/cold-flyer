"use client";

import ImageCarousel from "@/components/products/image-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useProduct } from "@/hooks/queries/products";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { ShieldCheck, Tag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import InfoTabs from "../products/info-tabs";
import QuantityInput from "../ui/quantity-input";
import { DetailBackButton } from "./detail-back-button";
import { DetailMetaInfo } from "./detail-meta-info";
import { DetailPrice } from "./detail-price";
import { DetailSkeleton } from "./detail-skeleton";
import { DetailTrustBadges } from "./detail-trust-badges";

export default function ProductDetail({ productSlug }) {
  const t = useTranslations("common");
  const te = useTranslations("errors");
  const { product, loading, error } = useProduct(productSlug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="bg-background min-h-screen pb-10 flex items-center justify-center">
        <div className="text-destructive">{te("productsLoadFailed")}</div>
      </div>
    );
  }

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;
  const total = product.price * quantity;

  const handleAddToCart = () => {
    if (product && !isOutOfStock) {
      addItem(product, quantity);
      toast.success(t("addedToCart", { name: `${quantity} × ${product.name}` }));
    }
  };

  const handleBuyNow = () => {
    if (product && !isOutOfStock) {
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

  return (
    <div className="bg-background min-h-screen pb-10">
      <DetailBackButton href="/items" label={t("products")} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="relative">
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
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{product.category}</span>
            <span className="text-xs font-medium text-muted-foreground">{t("sku")}: {product.sku}</span>
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

          <div className="flex items-center gap-2 mb-6">
            <span
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                isOutOfStock ? "bg-destructive" : isLowStock ? "bg-amber-500 animate-pulse" : "bg-green-500",
              )}
            />
            <span
              className={cn(
                "text-xs font-bold",
                isOutOfStock ? "text-destructive" : isLowStock ? "text-amber-600" : "text-green-600",
              )}
            >
              {isOutOfStock ? t("outOfStock") : isLowStock ? t("onlyUnitsLeft", { stock: product.stock }) : t("inStock")}
            </span>
          </div>

          <div className="flex flex-wrap items-end gap-6 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("quantity")}</p>
              <QuantityInput
                quantity={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stock}
                disabled={isOutOfStock}
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{t("total")}</p>
              <p className="font-bold text-2xl text-foreground">
                <span className="font-black">৳</span>
                {total.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button variant="outline" size="lg" className="flex-1" disabled={isOutOfStock} onClick={handleAddToCart}>
              {t("addToCart")}
            </Button>
            <Button size="lg" className="flex-1" disabled={isOutOfStock} onClick={handleBuyNow}>
              {t("buyNow")}
            </Button>
          </div>

          <DetailTrustBadges
            items={[
              { icon: ShieldCheck, text: `${product.warranty} Warranty` },
              { icon: Truck, text: t("freeDelivery") },
              { icon: Tag, text: t("bestPrice") },
            ]}
          />

          <DetailMetaInfo
            fields={[
              { label: t("brand"), value: product.brand },
              ...(product.warranty ? [{ label: t("warranty"), value: product.warranty }] : []),
              ...(product.tag ? [{ label: t("tag"), value: product.tag }] : []),
            ]}
          />

          <InfoTabs product={product} />
        </div>
      </div>
    </div>
  );
}
