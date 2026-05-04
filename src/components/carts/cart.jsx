"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingCart, X } from "lucide-react";
import Link from "next/link";

import { QuantityInput } from "./quantity-input";

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
}) {
  const subtotal = products.reduce(
    (total, p) => total + p.price * p.quantity,
    0,
  );
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
      <div className="container py-10">
        <div className="mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            My Cart
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">
            Shopping Cart
          </h1>
        </div>

        {isLoading && loadingSkeleton ? (
          loadingSkeleton
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading your cart…
            </p>
          </div>
        ) : null}

        {!isLoading && errorMessage && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && isCartEmpty && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
              <ShoppingCart size={36} className="text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">
              Your cart is empty
            </h2>
            <p className="mb-7 text-sm text-muted-foreground">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Button
              variant="primary"
              onClick={() => onContinueShopping(checkoutPayload)}
            >
              Start Shopping
            </Button>
          </div>
        )}

        {!isLoading && !errorMessage && !isCartEmpty && (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {products.map((product) => {
                const slug = product.slug || product.productId;
                return (
                  <div
                    key={product.id}
                    className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-sm sm:gap-5 sm:p-5"
                  >
                    <Link
                      href={`/items/${slug}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-full">
                          <Link
                            href={`/items/${slug}`}
                            className="font-semibold leading-tight text-foreground hover:text-primary"
                          >
                            {product.name}
                          </Link>
                          {product.description && (
                            <p className="mt-0.5 line-clamp-1 md:line-clamp-2 text-xs text-muted-foreground md:w-1/2">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveProduct(product.id)}
                          className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <QuantityInput
                          quantity={product.quantity}
                          onChange={(q) => onUpdateQuantity(product.id, q)}
                        />
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">
                            {currencyPrefix}
                            {(
                              product.price * product.quantity
                            ).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {currencyPrefix}
                            {product.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => onContinueShopping(checkoutPayload)}
                >
                  ← Continue Shopping
                </Button>
              </div>
            </div>

            <div className="h-fit rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-5 text-lg font-bold text-foreground">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Subtotal ({products.reduce((s, p) => s + p.quantity, 0)}{" "}
                    items)
                  </span>
                  <span className="font-medium text-foreground">
                    {currencyPrefix}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-medium text-foreground">
                    {currencyPrefix}
                    {shippingCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>VAT ({(vatRate * 100).toFixed(0)}%)</span>
                  <span className="font-medium text-foreground">
                    {currencyPrefix}
                    {vatAmount.toFixed(0)}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-xl font-extrabold text-primary">
                  {currencyPrefix}
                  {totalAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => onCheckout(checkoutPayload)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onContinueShopping(checkoutPayload)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
