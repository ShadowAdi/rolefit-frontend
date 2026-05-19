import { UUID } from "./common";

export type WsEventType =
  | "resume_completed"
  | "resume_failed"
  | "cover_letter_completed"
  | "cover_letter_failed"
  | "pdf_ready"
  | "ping"
  | "pong";

export interface WsBaseEvent {
  type: WsEventType;
}

export interface WsDocEvent extends WsBaseEvent {
  doc_id: UUID;
  status: string;
  message?: string;
  error?: string;
}

export type WsServerEvent = WsBaseEvent | WsDocEvent;

export interface WsClientPing {
  type: "ping";
}
