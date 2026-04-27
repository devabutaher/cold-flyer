"use client";

import ImageCarousel from "@/components/products/image-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PriceFormat from "@/components/ui/price-format";
import { acParts, acUnits } from "@/data/products-data";
import { cn } from "@/lib/utils";
import { ChevronLeft, ShieldCheck, Tag, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import QuantityInput from "../ui/quantity-input";
import InfoTabs from "./info-tabs";

// ProductDetail
export default function ProductDetail({ productId }) {
  const all = [...acUnits, ...acParts];
  const product = all.find((p) => p.id === productId);

  const [quantity, setQuantity] = useState(1);

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;
  const total = product.price * quantity;

  const images = [
    { url: product.img, title: product.name },
    { url: product.img, title: `${product.name} — view 2` },
    { url: product.img, title: `${product.name} — view 3` },
  ];

  return (
    <div className="bg-background min-h-screen pb-10">
      <Link href="/items">
        <Button variant="link" className={"px-0 py-6"}>
          <ChevronLeft size={15} />
          Back to Products
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Left: Image Carousel */}
        <div className="relative">
          {product.tag && (
            <div className="absolute top-2 left-2 z-20">
              <Badge
                variant={product.tag === "Sale" ? "destructive" : "default"}
              >
                {product.tag}
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

        {/* Right: Product Info */}
        <div className="flex flex-col">
          {/* Category + SKU */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              {product.category}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              SKU: {product.sku}
            </span>
          </div>

          {/* Name & Sub */}
          <div className="mb-4">
            <h1 className="font-sans font-bold text-2xl md:text-3xl text-foreground leading-tight tracking-tight mb-2">
              {product.name}
            </h1>

            <p className="text-muted-foreground leading-relaxed mb-4">
              {product.sub}
            </p>
          </div>

          {/* Price */}
          <div className="mb-2">
            <PriceFormat
              originalPrice={product.originalPrice}
              salePrice={product.price}
              showSavePercentage
              className="text-3xl"
              classNameSalePrice="font-bold text-foreground"
              classNameOriginalPrice="text-lg"
              classNameSalePercentage="text-xs"
            />
          </div>

          {/* Stock status */}
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

          {/* Quantity + Total */}
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

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={isOutOfStock}
            >
              Add to Cart
            </Button>
            <Button size="lg" className="flex-1" disabled={isOutOfStock}>
              Buy Now
            </Button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: ShieldCheck, text: `${product.warranty} Warranty` },
              { icon: Truck, text: "Free Delivery" },
              { icon: Tag, text: "Best Price" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-accent text-center"
              >
                <Icon size={16} className="text-accent-foreground" />
                <span className="text-xs font-bold text-accent-foreground leading-tight">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>
              Brand:{" "}
              <span className="font-bold text-foreground">{product.brand}</span>
            </span>
            <span>
              Warranty:{" "}
              <span className="font-bold text-foreground">
                {product.warranty}
              </span>
            </span>
          </div>

          {/* Info Tabs */}
          <InfoTabs product={product} />
        </div>
      </div>
    </div>
  );
}
