import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "../api/client";
import type { Note } from "../types/notes";
import Modal from "./Modal";

interface ConfirmDeleteDialogProps {
  note: Note | null;
  onCancel: () => void;
  onConfirm: (note: Note) => Promise<void>;
}

export default function ConfirmDeleteDialog({ note, onCancel, onConfirm }: ConfirmDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDeleting(false);
    setError(null);
  }, [note]);

  const handleConfirm = async () => {
    if (!note) return;
    setDeleting(true);
    setError(null);
    try {
      await onConfirm(note);
      onCancel();
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleting(false);
    }
  };

  return (
    <Modal open={!!note} onClose={onCancel} labelledBy="delete-title" dismissible={!deleting}>
      <div className="p-6">
        <h2 id="delete-title" className="text-lg font-semibold">
          Delete note?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          “{note?.title}” will be permanently deleted. This action cannot be undone.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
