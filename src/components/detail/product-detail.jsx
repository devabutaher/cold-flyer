"use client";

import ImageCarousel from "@/components/products/image-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/queries";
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
  const { product, loading, error } = useProduct(productSlug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="bg-background min-h-screen pb-10 flex items-center justify-center">
        <div className="text-destructive">Failed to load product</div>
      </div>
    );
  }

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;
  const total = product.price * quantity;

  const handleAddToCart = () => {
    if (product && !isOutOfStock) {
      addItem(product, quantity);
      toast.success(`${quantity} × ${product.name} added to cart`);
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
          title: `${product.name} — view ${idx + 1}`,
        }))
      : [{ url: "", title: product.name }];

  return (
    <div className="bg-background min-h-screen pb-10">
      <DetailBackButton href="/items" label="Products" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="relative">
          {(product.tag || product.onSale) && (
            <div className="absolute top-2 left-2 z-20">
              <Badge
                variant={
                  product.tag === "Sale" || product.onSale
                    ? "destructive"
                    : "default"
                }
              >
                {product.tag || "Sale"}
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
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {product.category}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              SKU: {product.sku}
            </span>
          </div>

          <div className="mb-4">
            <h1 className="font-sans font-bold text-2xl md:text-3xl text-foreground leading-tight tracking-tight mb-2">
              {product.name}
            </h1>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-4">
                {product.description}
              </p>
            )}
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
                isOutOfStock
                  ? "bg-destructive"
                  : isLowStock
                    ? "bg-amber-500 animate-pulse"
                    : "bg-green-500",
              )}
            />
            <span
              className={cn(
                "text-xs font-bold",
                isOutOfStock
                  ? "text-destructive"
                  : isLowStock
                    ? "text-amber-600"
                    : "text-green-600",
              )}
            >
              {isOutOfStock
                ? "Out of Stock"
                : isLowStock
                  ? `Only ${product.stock} units left`
                  : "In Stock"}
            </span>
          </div>

          <div className="flex flex-wrap items-end gap-6 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Quantity
              </p>
              <QuantityInput
                quantity={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stock}
                disabled={isOutOfStock}
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Total
              </p>
              <p className="font-bold text-2xl text-foreground">
                <span className="font-black">৳</span>
                {total.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              size="lg"
              className="flex-1"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>

          <DetailTrustBadges
            items={[
              { icon: ShieldCheck, text: `${product.warranty} Warranty` },
              { icon: Truck, text: "Free Delivery" },
              { icon: Tag, text: "Best Price" },
            ]}
          />

          <DetailMetaInfo
            fields={[
              { label: "Brand", value: product.brand },
              ...(product.warranty
                ? [{ label: "Warranty", value: product.warranty }]
                : []),
              ...(product.tag ? [{ label: "Tag", value: product.tag }] : []),
            ]}
          />

          <InfoTabs product={product} />
        </div>
      </div>
    </div>
  );
}
