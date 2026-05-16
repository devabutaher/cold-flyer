"use client";

import { QuantityInput } from "@/components/carts/quantity-input";
import ImageCarousel from "@/components/products/image-carousel";
import InfoTabs from "@/components/products/info-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { animations } from "@/lib/animation";
import { useCart } from "@/store/cart";
import { motion } from "framer-motion";
import { ShieldCheck, Tag, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DetailBackButton } from "./detail-back-button";
import { DetailMetaInfo } from "./detail-meta-info";
import { DetailPrice } from "./detail-price";
import { DetailTrustBadges } from "./detail-trust-badges";

export function ProductDetailClient({ product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

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
          title: `${product.name} - view ${idx + 1}`,
        }))
      : [{ url: "", title: product.name }];

  const iconMap = { ShieldCheck, Truck, Tag };

  const trustBadges = [
    { icon: ShieldCheck, text: product.warranty ? `${product.warranty} Warranty` : "Genuine Product" },
    { icon: Truck, text: "Free Delivery" },
    { icon: Tag, text: "Best Price" },
  ];

  return (
    <div className="bg-background min-h-screen pb-10">
      <DetailBackButton href="/items" label="Products" />

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
            <span className="text-xs font-medium text-muted-foreground">SKU: {product.sku}</span>
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
              {isOutOfStock ? "Out of Stock" : isLowStock ? `Only ${product.stock} units left` : "In Stock"}
            </span>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-end gap-6 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Quantity</p>
              <QuantityInput
                quantity={quantity}
                onChange={setQuantity}
                min={1}
                max={product.stock || 99}
                disabled={isOutOfStock}
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total</p>
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

          <motion.div
            className="flex gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="lg" className="w-full" disabled={isOutOfStock} onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </motion.div>
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="w-full" disabled={isOutOfStock} onClick={handleBuyNow}>
                Buy Now
              </Button>
            </motion.div>
          </motion.div>

          <DetailTrustBadges items={trustBadges} />

          <DetailMetaInfo
            fields={[
              { label: "Brand", value: product.brand },
              ...(product.warranty ? [{ label: "Warranty", value: product.warranty }] : []),
              ...(product.tag ? [{ label: "Tag", value: product.tag }] : []),
            ]}
          />

          <InfoTabs product={product} />
        </motion.div>
      </div>
    </div>
  );
}
