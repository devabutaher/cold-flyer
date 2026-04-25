import { UserDropdown } from "@/components/auth/user-dropdown";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

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
          <Button className="w-full md:w-min">Booking Now</Button>
          <UserDropdown user={user} />
        </>
      ) : (
        <div className="mt-5 md:mt-0 flex flex-col md:flex-row gap-2">
          <Button className="w-full md:w-min" variant="destructive">
            Sign In
          </Button>
          <Button className="w-full md:w-min">Select Service</Button>
        </div>
      )}
    </>
  );
}

export function NavSearch() {
  return (
    <Field className={"mt-8 md:mt-0"}>
      <ButtonGroup>
        <Input id="input-button-group" placeholder="Type to search..." />
        <Button
          variant="outline"
          className={
            "bg-primary text-muted hover:bg-primary/80 hover:text-muted"
          }
        >
          <Search />
        </Button>
      </ButtonGroup>
    </Field>
  );
}
