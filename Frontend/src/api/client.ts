import { API_BASE_URL } from "../config/env";
import type { ErrorResponse, SuccessEnvelope } from "../types/notes";

export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];

  constructor(message: string, status: number, messages: string[] = [message]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.messages = messages;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

/** Single entry point for all HTTP calls: unwraps `data`, normalizes errors. */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new ApiError("Unable to reach the server. Check your connection and try again.", 0);
  }

  const body = (await response.json().catch(() => null)) as
    | SuccessEnvelope<T>
    | ErrorResponse
    | null;

  if (!response.ok) {
    const raw = body && "message" in body ? body.message : undefined;
    const messages = Array.isArray(raw) ? raw : raw ? [raw] : [`Request failed (${response.status}).`];
    throw new ApiError(messages.join(". "), response.status, messages);
  }

  if (!body || !("data" in body)) {
    throw new ApiError("Unexpected response from the server.", response.status);
  }
  return body.data;
}
