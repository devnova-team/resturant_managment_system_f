import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { render, type RenderOptions } from "@testing-library/react";

import type { ReactElement, ReactNode } from "react";

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

const TestProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  return render(ui, {
    wrapper: TestProviders,
    ...options,
  });
};
