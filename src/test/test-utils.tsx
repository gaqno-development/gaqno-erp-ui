import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter, Route, Routes, type MemoryRouterProps } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

interface WrapperProps {
  children: React.ReactNode;
  routerProps?: MemoryRouterProps;
  queryClient?: QueryClient;
  routePath?: string;
}

function AllTheProviders({
  children,
  routerProps = {},
  queryClient = defaultQueryClient,
  routePath,
}: WrapperProps) {
  const content = routePath ? (
    <Routes>
      <Route path={routePath} element={children} />
    </Routes>
  ) : (
    children
  );
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...routerProps}>{content}</MemoryRouter>
    </QueryClientProvider>
  );
}

function customRender(
  ui: React.ReactElement,
  options: RenderOptions & {
    routerProps?: MemoryRouterProps;
    queryClient?: QueryClient;
    routePath?: string;
  } = {}
) {
  const { routerProps, queryClient, routePath, ...renderOptions } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        routerProps={routerProps}
        queryClient={queryClient}
        routePath={routePath}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
}

export { customRender as render, defaultQueryClient };
