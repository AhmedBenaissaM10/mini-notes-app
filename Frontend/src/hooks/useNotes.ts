import { useCallback, useEffect, useState } from "react";
import { getErrorMessage, isAbortError } from "../api/client";
import { notesApi } from "../api/notes";
import type { CreateNoteInput, Note, UpdateNoteInput } from "../types/notes";

interface FetchOptions {
  silent?: boolean;
  signal?: AbortSignal;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async ({ silent, signal }: FetchOptions = {}) => {
    if (!silent) setLoading(true);
    try {
      setNotes(await notesApi.list(signal));
      setError(null);
    } catch (err) {
      if (isAbortError(err)) return;
      setError(getErrorMessage(err));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchNotes({ signal: controller.signal });
    return () => controller.abort();
  }, [fetchNotes]);

  // Mutations throw on failure so the calling form/dialog can display the error.
  const createNote = useCallback(
    async (input: CreateNoteInput) => {
      await notesApi.create(input);
      await fetchNotes({ silent: true });
    },
    [fetchNotes],
  );

  const updateNote = useCallback(
    async (id: string, input: UpdateNoteInput) => {
      await notesApi.update(id, input);
      await fetchNotes({ silent: true });
    },
    [fetchNotes],
  );

  const deleteNote = useCallback(async (id: string) => {
    await notesApi.remove(id);
    setNotes((current) => current.filter((note) => note.id !== id));
  }, []);

  return { notes, loading, error, reload: fetchNotes, createNote, updateNote, deleteNote };
}
