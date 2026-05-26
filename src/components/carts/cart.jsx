"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, ShoppingCart, X, Loader2, Check, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { QuantityInput } from "./quantity-input";

function CartItem({ product, currencyPrefix, onUpdateQuantity, onRemoveProduct }) {
  const t = useTranslations("cart");
  const slug = product.slug || product.productId;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: "auto" }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-sm sm:gap-5 sm:p-5"
    >
      <Link
        href={`/items/${slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28"
      >
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill sizes="100px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={24} className="text-muted-foreground/40" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="w-full">
            <Link href={`/items/${slug}`} className="font-semibold leading-tight text-foreground hover:text-primary">
              {product.name}
            </Link>
            {product.description && (
              <p className="mt-0.5 line-clamp-1 md:line-clamp-2 text-xs text-muted-foreground md:w-1/2">
                {product.description}
              </p>
            )}
          </div>
          <motion.button
            onClick={() => onRemoveProduct(product.id)}
            className="shrink-0 rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive min-h-11 min-w-11 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={15} />
          </motion.button>
        </div>

        <div className="flex items-center justify-between">
          <QuantityInput quantity={product.quantity} onChange={(q) => onUpdateQuantity(product.id, q)} />
          <motion.div
            className="text-right"
            key={`${product.id}-${product.quantity}`}
            initial={{ scale: 1.1, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <p className="text-sm font-bold text-foreground">
              {currencyPrefix}
              {(product.price * product.quantity).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {currencyPrefix}
              {product.price.toLocaleString()} {t("each")}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function Cart({
  currencyPrefix = "৳",
  errorMessage = "",
  isLoading = false,
  products = [],
  shippingCost = 60,
  vatRate = 0.05,
  loadingSkeleton = null,
  onCheckout = () => {},
  onContinueShopping = () => {},
  onUpdateQuantity = () => {},
  onRemoveProduct = () => {},
  isProcessing = false,
  paymentProvider = "stripe",
  onPaymentProviderChange = () => {},
  paymentProviders = [],
}) {
  const t = useTranslations("cart");
  const subtotal = products.reduce((total, p) => total + p.price * p.quantity, 0);
  const vatAmount = subtotal * vatRate;
  const totalAmount = subtotal + shippingCost + vatAmount;
  const isCartEmpty = !products || products.length === 0;

  const checkoutPayload = {
    currencyPrefix,
    products: [...(products || [])],
    shippingCost,
    subtotal,
    totalAmount,
    vatAmount,
    vatRate,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 pb-28 lg:py-10 lg:pb-10">
        <div className="mb-8">
          <span className="text-xxs font-bold uppercase tracking-widest text-primary">{t("myCart")}</span>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">{t("pageTitle")}</h1>
        </div>

        {isLoading && loadingSkeleton ? (
          loadingSkeleton
        ) : isLoading ? (
          <div className="space-y-4 py-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                <Skeleton className="h-24 w-24 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive"
          >
            {errorMessage}
          </motion.div>
        )}

        {!isLoading && !errorMessage && isCartEmpty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <motion.div
              className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShoppingBag size={36} className="text-muted-foreground" />
            </motion.div>
            <h2 className="mb-2 text-xl font-bold text-foreground">{t("emptyTitle")}</h2>
            <p className="mb-7 text-sm text-muted-foreground">{t("emptyDesc")}</p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={() => onContinueShopping(checkoutPayload)}>{t("startShopping")}</Button>
            </motion.div>
          </motion.div>
        )}

        {!isLoading && !errorMessage && !isCartEmpty && (
          <div className="grid gap-4 lg:gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    currencyPrefix={currencyPrefix}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveProduct={onRemoveProduct}
                  />
                ))}
              </AnimatePresence>

              <motion.div
                className="pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => onContinueShopping(checkoutPayload)}
                >
                  {t("continueShoppingBack")}
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="h-fit rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="mb-5 text-lg font-bold text-foreground">{t("orderSummary")}</h2>

              <div className="space-y-3 text-sm">
                <motion.div
                  className="flex justify-between text-muted-foreground"
                  key={`subtotal-${subtotal}`}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  <span>
                    {t("subtotal")} ({t("itemCount", { count: products.reduce((s, p) => s + p.quantity, 0) })})
                  </span>
                  <span className="font-medium text-foreground">
                    {currencyPrefix}
                    {subtotal.toLocaleString()}
                  </span>
                </motion.div>

                <div className="flex justify-between text-muted-foreground">
                  <span>{t("shipping")}</span>
                  <span className="font-medium text-foreground">
                    {currencyPrefix}
                    {shippingCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>
                    {t("vat")} ({(vatRate * 100).toFixed(0)}%)
                  </span>
                  <span className="font-medium text-foreground">
                    {currencyPrefix}
                    {vatAmount.toFixed(0)}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <motion.div
                className="flex items-center justify-between"
                key={`total-${totalAmount}`}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <span className="font-bold text-foreground">{t("total")}</span>
                <span className="text-xl font-extrabold text-primary">
                  {currencyPrefix}
                  {totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </motion.div>

              {paymentProviders.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">{t("paymentMethod")}</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:grid-cols-1 lg:gap-1.5 lg:overflow-visible lg:pb-0">
                    {paymentProviders.map((p) => {
                      const Icon = p.icon;
                      const selected = paymentProvider === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => onPaymentProviderChange(p.value)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs transition-colors",
                            selected
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-muted-foreground/30",
                          )}
                        >
                          <Icon size={14} />
                          <span className="flex-1">{p.label}</span>
                          {selected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                              <Check size={12} className="text-primary" />
                            </motion.span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => onCheckout(checkoutPayload)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("payWith", {
                      provider: paymentProviders.find((p) => p.value === paymentProvider)?.label || "Card",
                    })
                  )}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => onContinueShopping(checkoutPayload)}>
                  {t("continueShopping")}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Mobile sticky checkout bar */}
        {!isLoading && !errorMessage && !isCartEmpty && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{t("total")}</span>
              <span className="text-xl font-extrabold text-primary">
                {currencyPrefix}
                {totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full" size="lg" onClick={() => onCheckout(checkoutPayload)} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  t("payWith", { provider: paymentProviders.find((p) => p.value === paymentProvider)?.label || "Card" })
                )}
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
