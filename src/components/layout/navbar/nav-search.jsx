"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export function NavSearch() {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const inputRef = useRef(null);

  const searchBase = useMemo(() => {
    if (pathname.startsWith("/services")) return pathname;
    if (pathname.startsWith("/items")) return pathname;
    return "/items";
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`${searchBase}?q=${encodeURIComponent(query.trim())}`);
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
    router.push(searchBase);
  };

  return (
    <Field>
      <form onSubmit={handleSearch}>
        <ButtonGroup className={"w-full"}>
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              id="input-button-group"
              placeholder={t("placeholderSearch")}
              className="pr-7 w-full rounded-md rounded-r-none"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="outline"
            className="bg-primary text-muted hover:bg-primary/80 hover:text-muted shrink-0"
          >
            <Search />
          </Button>
        </ButtonGroup>
      </form>
    </Field>
  );
}
