import { useEffect, useRef } from "react";
import { useWebSocket, WebSocketEvent } from "@/context/WebSocketContext";

/**
 * Listen for PDF generation WebSocket events for a single document.
 *
 * Mirrors `useContentGenerationStatus` but for the PDF build pipeline
 * (resume + cover letter). The backend Celery tasks publish:
 *   - *_pdf_processing  (status: "processing")  — generation started
 *   - *_pdf_generated   (status: "completed")   — PDF ready
 *   - *_pdf_error       (status: "failed")      — generation failed
 *
 * Pass the docId you care about; callbacks only fire for that document.
 */
export const usePdfGenerationStatus = (
  docId: string | null,
  callbacks?: {
    onStatusChange?: (event: WebSocketEvent) => void;
    onProcessing?: (event: WebSocketEvent) => void;
    onCompleted?: (event: WebSocketEvent) => void;
    onFailed?: (error?: string) => void;
  }
) => {
  const { isConnected, subscribe } = useWebSocket();

  // Keep the latest callbacks in a ref so consumers can pass an inline
  // object without forcing the subscription to tear down on every render.
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!isConnected || !docId) return;

    const unsubscribe = subscribe((event: WebSocketEvent) => {
      // Only react to PDF events for this document
      if (event.doc_id !== docId) return;
      if (!event.type.includes("_pdf_")) return;

      const cb = callbacksRef.current;
      cb?.onStatusChange?.(event);

      if (event.type.endsWith("_pdf_processing")) {
        cb?.onProcessing?.(event);
      } else if (event.type.endsWith("_pdf_generated")) {
        cb?.onCompleted?.(event);
      } else if (event.type.endsWith("_pdf_error")) {
        cb?.onFailed?.(event.error);
      }
    });

    return unsubscribe;
  }, [isConnected, docId, subscribe]);
};
