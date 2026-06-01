"use client";

import { createContext, useContext, useEffect, useRef, ReactNode, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export interface WebSocketEvent {
  type: string;
  doc_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  message: string;
  error?: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (callback: (event: WebSocketEvent) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProviderBase = ({ children }: { children: ReactNode }) => {
  const { user, token, isLoading: authLoading } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscriptions = useRef<Set<(event: WebSocketEvent) => void>>(new Set());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = useRef(1000);
  const connectionAttempted = useRef(false);

  useEffect(() => {
    if (authLoading) {
      console.log("[WS] Auth still loading, waiting...");
      return;
    }

    if (!user?.id || !token) {
      console.log("[WS] No credentials available", {
        hasUser: !!user,
        hasToken: !!token,
        userId: user?.id,
      });
      return;
    }

    if (connectionAttempted.current && ws.current?.readyState === WebSocket.OPEN) {
      console.log("[WS] Already connected");
      return;
    }

    connectionAttempted.current = true;

    const connectWebSocket = () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:8000";
        const protocol = backendUrl.startsWith("https") ? "wss:" : "ws:";
        const backendHost = backendUrl.replace("https://", "").replace("http://", "");
        const wsUrl = `${protocol}//${backendHost}/api/v1/websocket/ws/${user.id}?token=${token}`;

        console.log("[WS] Attempting connection", {
          url: wsUrl.replace(token, "TOKEN_REDACTED"),
          userId: user.id,
          hasToken: !!token,
          backendUrl,
          protocol,
          backendHost,
        });

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          console.log("[WS] Connection established");
          setIsConnected(true);
          reconnectAttempts.current = 0;
          reconnectDelay.current = 1000;
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketEvent;
            if (data.type !== "pong") {
              console.log("[WS] Event received:", data.type, data.doc_id);
              subscriptions.current.forEach((callback) => callback(data));
            }
          } catch (err) {
            console.error("[WS] Failed to parse message:", err);
          }
        };

        ws.current.onerror = (error) => {
          console.error("[WS] Connection error:", {
            readyState: ws.current?.readyState,
            readyStateText:
              ws.current?.readyState === 0
                ? "CONNECTING"
                : ws.current?.readyState === 1
                  ? "OPEN"
                  : ws.current?.readyState === 2
                    ? "CLOSING"
                    : "CLOSED",
            error: error instanceof Event ? error.type : String(error),
            url: wsUrl.replace(token, "TOKEN_REDACTED"),
          });
          setIsConnected(false);
        };

        ws.current.onclose = (event) => {
          console.log("[WS] Connection closed:", {
            code: event.code,
            codeText:
              event.code === 1000 ? "Normal closure" :
              event.code === 1001 ? "Going away" :
              event.code === 1002 ? "Protocol error" :
              event.code === 1003 ? "Unsupported data" :
              event.code === 1006 ? "Abnormal closure (usually auth/server issue)" :
              event.code === 1008 ? "Policy violation (auth failed)" :
              event.code === 1011 ? "Server error" :
              "Unknown",
            reason: event.reason || "No reason provided",
            wasClean: event.wasClean,
          });
          
          if (event.code === 1008) {
            console.error("[WS] Authentication failed (code 1008) - check your token and user ID");
            setIsConnected(false);
            return;
          }

          setIsConnected(false);
          attemptReconnect();
        };
      } catch (err) {
        console.error("[WS] Connection setup failed:", err);
        attemptReconnect();
      }
    };

    const attemptReconnect = () => {
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        console.log(
          `[WS] Reconnecting in ${reconnectDelay.current}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`
        );
        setTimeout(() => {
          connectWebSocket();
        }, reconnectDelay.current);
        reconnectDelay.current = Math.min(reconnectDelay.current * 2, 10000);
      } else {
        console.error("[WS] Max reconnection attempts reached. WebSocket connection failed.");
        console.error("[WS] Common solutions:");
        console.error("  1. Verify NEXT_PUBLIC_API_URL is set correctly");
        console.error("  2. Ensure backend server is running on the specified URL");
        console.error("  3. Check if WebSocket endpoint is properly registered");
        console.error("  4. Verify authentication token is valid");
      }
    };

    connectWebSocket();

    const pingInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      connectionAttempted.current = false;
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close(1000, "Component unmounting");
      }
    };
  }, [user?.id, token, authLoading]);

  const subscribe = (callback: (event: WebSocketEvent) => void): (() => void) => {
    subscriptions.current.add(callback);
    return () => {
      subscriptions.current.delete(callback);
    };
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};
