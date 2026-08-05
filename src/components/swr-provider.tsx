"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

interface SWRProviderProps {
  children: ReactNode;
  fallback: Record<string, any>;
}

export function SWRProvider({ children, fallback }: SWRProviderProps) {
  return (
    <SWRConfig value={{ fallback }}>
      {children}
    </SWRConfig>
  );
}
