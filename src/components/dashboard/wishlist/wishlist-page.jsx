"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlist } from "@/store/wishlist";
import { motion } from "framer-motion";
import { Heart, Package, Trash2, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function WishlistPage() {
  const t = useTranslations("common");
  const { items, removeItem, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <Heart size={36} className="text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground">Wishlist is empty</h2>
        <p className="mb-7 text-sm text-muted-foreground">Items you add to your wishlist will appear here</p>
        <Button asChild>
          <Link href="/items">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Wishlist</span>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground">My Wishlist</h1>
          <p className="text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { clearWishlist(); toast.success("Wishlist cleared"); }}>
          <Trash2 size={14} className="mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => {
          const href = `/${item.type === "service" ? "services" : "items"}/${item.slug}`;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
                <Link href={href} className="relative block h-40 overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      {item.type === "service" ? (
                        <Wrench size={40} className="text-muted-foreground/30" />
                      ) : (
                        <Package size={40} className="text-muted-foreground/30" />
                      )}
                    </div>
                  )}
                  <div className="absolute right-2 top-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeItem(item.itemId, item.type);
                        toast.success("Removed from wishlist");
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={href}>
                    <h3 className="truncate font-semibold text-foreground transition-colors hover:text-primary">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground capitalize">{item.type}</span>
                    {item.price > 0 && (
                      <span className="font-bold text-primary">৳{item.price.toLocaleString()}</span>
                    )}
                  </div>
                  <Button size="sm" className="mt-3 w-full" asChild>
                    <Link href={href}>{item.type === "service" ? "View Service" : "View Product"}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
