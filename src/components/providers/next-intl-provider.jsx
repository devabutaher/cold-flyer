"use client";

import { NextIntlClientProvider } from "next-intl";

export function NextIntlProvider({ children, ...props }) {
  return (
    <NextIntlClientProvider onError={() => {}} {...props}>
      {children}
    </NextIntlClientProvider>
  );
}
