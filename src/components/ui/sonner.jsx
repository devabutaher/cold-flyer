"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme}
      richColors
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast has-[>button]:button-root",
          error: "!bg-destructive !text-destructive-foreground !border-destructive/30",
          success: "!bg-green-600 !text-white !border-green-700",
          warning: "!bg-amber-500 !text-white !border-amber-600",
          info: "!bg-blue-600 !text-white !border-blue-700",
        },
      }}
      position="top-right"
      {...props}
    />
  );
};

export { Toaster };