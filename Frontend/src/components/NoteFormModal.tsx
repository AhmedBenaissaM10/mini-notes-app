import { useEffect, useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import { getErrorMessage } from "../api/client";
import { NOTE_TITLE_MAX_LENGTH, type CreateNoteInput, type Note } from "../types/notes";
import Modal from "./Modal";

interface NoteFormModalProps {
  open: boolean;
  /** `null` = create mode, a note = edit mode */
  note: Note | null;
  onClose: () => void;
  onSubmit: (values: CreateNoteInput) => Promise<void>;
}

interface FieldErrors {
  title?: string;
  content?: string;
}

function validate({ title, content }: CreateNoteInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!title.trim()) errors.title = "Title is required.";
  else if (title.length > NOTE_TITLE_MAX_LENGTH)
    errors.title = `Title must be at most ${NOTE_TITLE_MAX_LENGTH} characters.`;
  if (!content.trim()) errors.content = "Content is required.";
  return errors;
}

export default function NoteFormModal({ open, note, onClose, onSubmit }: NoteFormModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Reset the form each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
    setErrors({});
    setApiError(null);
    setSaving(false);
  }, [open, note]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const values = { title: title.trim(), content: content.trim() };
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setApiError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setApiError(getErrorMessage(err));
      setSaving(false);
    }
  };

  const inputClass = (invalid: boolean) =>
    `mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-2 focus:outline-indigo-600 ${
      invalid ? "border-red-400" : "border-slate-300"
    }`;

  return (
    <Modal open={open} onClose={onClose} labelledBy="note-form-title" dismissible={!saving}>
      <form onSubmit={handleSubmit} noValidate className="p-6">
        <div className="flex items-center justify-between">
          <h2 id="note-form-title" className="text-lg font-semibold">
            {note ? "Edit note" : "New note"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="note-title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={NOTE_TITLE_MAX_LENGTH}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "note-title-error" : undefined}
              className={inputClass(!!errors.title)}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span id="note-title-error" role="alert" className="text-red-600">
                {errors.title}
              </span>
              <span className="text-slate-400">
                {title.length}/{NOTE_TITLE_MAX_LENGTH}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="note-content" className="text-sm font-medium">
              Content
            </label>
            <textarea
              id="note-content"
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              aria-invalid={!!errors.content}
              aria-describedby={errors.content ? "note-content-error" : undefined}
              className={inputClass(!!errors.content)}
            />
            <p id="note-content-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.content}
            </p>
          </div>
        </div>

        {apiError && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {apiError}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {saving ? "Saving…" : note ? "Save changes" : "Create note"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
