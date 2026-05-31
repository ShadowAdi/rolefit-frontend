import { useEffect, useCallback } from "react";
import { useWebSocket, WebSocketEvent } from "@/context/WebSocketContext";

export const useContentGenerationStatus = (
  docId: string,
  onStatusChange?: (event: WebSocketEvent) => void,
  onCompleted?: () => void,
  onFailed?: (error?: string) => void
) => {
  const { isConnected, subscribe } = useWebSocket();

  useEffect(() => {
    if (!isConnected || !docId) return;

    const unsubscribe = subscribe((event: WebSocketEvent) => {
      // Check if this event is for our document
      if (event.doc_id !== docId) return;

      // Call the general callback
      if (onStatusChange) {
        onStatusChange(event);
      }

      // Call specific callbacks based on event type
      if (event.type === "generate_resume_content" || event.type === "cover_letter_generation_completed") {
        if (event.status === "completed" && onCompleted) {
          onCompleted();
        }
        if (event.status === "failed" && onFailed) {
          onFailed(event.error);
        }
      } else if (event.type === "generate_resume_content_failed" || event.type === "cover_letter_failed") {
        if (onFailed) {
          onFailed(event.error);
        }
      }
    });

    return unsubscribe;
  }, [isConnected, docId, subscribe, onStatusChange, onCompleted, onFailed]);
};
