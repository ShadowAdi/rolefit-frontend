"use client";

import { createContext, useContext, useEffect, useRef, ReactNode, useState } from "react";

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

export const WebSocketProvider = ({ children, userId, token }: { children: ReactNode; userId?: string; token?: string }) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscriptions = useRef<Set<(event: WebSocketEvent) => void>>(new Set());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = useRef(1000);

  useEffect(() => {
    if (!userId || !token) return;

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${window.location.host}/api/v1/ws/${userId}?token=${token}`;

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
          console.log("[WS] Connected");
          setIsConnected(true);
          reconnectAttempts.current = 0;
          reconnectDelay.current = 1000;
        };

        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketEvent;
            if (data.type !== "pong") {
              console.log("[WS] Event:", data);
              subscriptions.current.forEach((callback) => callback(data));
            }
          } catch (err) {
            console.error("[WS] Failed to parse message:", err);
          }
        };

        ws.current.onerror = (error) => {
          console.error("[WS] Error:", error);
          setIsConnected(false);
        };

        ws.current.onclose = () => {
          console.log("[WS] Disconnected");
          setIsConnected(false);
          attemptReconnect();
        };
      } catch (err) {
        console.error("[WS] Connection failed:", err);
        attemptReconnect();
      }
    };

    const attemptReconnect = () => {
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current += 1;
        console.log(`[WS] Reconnecting in ${reconnectDelay.current}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
        setTimeout(() => {
          connectWebSocket();
        }, reconnectDelay.current);
        reconnectDelay.current = Math.min(reconnectDelay.current * 2, 10000);
      } else {
        console.error("[WS] Max reconnection attempts reached");
      }
    };

    connectWebSocket();

    // Ping heartbeat every 30 seconds
    const pingInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId, token]);

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
