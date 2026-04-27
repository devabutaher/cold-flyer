"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export function NavSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/items?q=${encodeURIComponent(query.trim())}`);
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
    router.push("/items");
  };

  return (
    <Field className="mt-8 md:mt-0">
      <form onSubmit={handleSearch}>
        <ButtonGroup>
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              id="input-button-group"
              placeholder="Type to search..."
              className="pr-7"
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
            className="bg-primary text-muted hover:bg-primary/80 hover:text-muted"
          >
            <Search />
          </Button>
        </ButtonGroup>
      </form>
    </Field>
  );
}
