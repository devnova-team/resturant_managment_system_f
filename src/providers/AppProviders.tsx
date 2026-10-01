"use client";

import QueryProvider from "./QueryProvider";
import { Toaster } from "sonner";

interface AppProvidersProps {
  children: React.ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      {children}
      <Toaster position="top-center" richColors />
    </QueryProvider>
  );
}
