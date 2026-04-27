import { UserDropdown } from "@/components/auth/user-dropdown";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export function LinkItem({
  label,
  description,
  icon,
  className,
  href,
  ...props
}) {
  return (
    <a
      className={cn("flex items-center gap-x-2", className)}
      href={href}
      {...props}
    >
      <div
        className={cn(
          "flex aspect-square size-6 items-center justify-center rounded-md border bg-card text-sm shadow-sm",
          "[&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='size-'])]:text-foreground",
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col items-start justify-center">
        <span className="font-medium">{label}</span>
      </div>
    </a>
  );
}

export function NavButtons() {
  const { user, loading } = useAuth();

  if (loading) return null;
  return (
    <>
      {user ? (
        <>
          <Link href={"/dashboard"}>
            <Button>Dashboard</Button>
          </Link>
          <UserDropdown user={user} />
        </>
      ) : (
        <div className="mt-5 md:mt-0 flex flex-col md:flex-row gap-2">
          <Link href={"/auth"}>
            <Button variant="destructive">Sign In</Button>
          </Link>
          <Link href={"/auth"}>
            <Button>Register</Button>
          </Link>
        </div>
      )}
    </>
  );
}

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
