import { request } from "./client";
import type { CreateNoteInput, Note, UpdateNoteInput } from "../types/notes";

export const notesApi = {
  list: (signal?: AbortSignal) => request<Note[]>("/notes", { signal }),

  get: (id: string, signal?: AbortSignal) =>
    request<Note>(`/notes/${encodeURIComponent(id)}`, { signal }),

  create: (input: CreateNoteInput) =>
    request<Note>("/notes", { method: "POST", body: JSON.stringify(input) }),

  update: (id: string, input: UpdateNoteInput) =>
    request<Note>(`/notes/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  // The API returns the deleted note in `data`.
  remove: (id: string) =>
    request<Note>(`/notes/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
