"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { WebSocketProvider } from "@/context/WebSocketContext";

function ProvidersContent({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();

  return (
    <WebSocketProvider userId={user?.id || undefined} token={token || undefined}>
      {children}
    </WebSocketProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProvidersContent>
        {children}
      </ProvidersContent>
    </QueryClientProvider>
  );
}
