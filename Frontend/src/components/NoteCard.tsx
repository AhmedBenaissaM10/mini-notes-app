import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../lib/format";
import type { Note } from "../types/notes";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const itemClass =
    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none";

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h2 className="break-words font-semibold leading-snug">{note.title}</h2>
        <div ref={menuRef} className="relative -mr-2 -mt-1">
          <button
            type="button"
            aria-label={`Actions for ${note.title}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <MoreHorizontal className="size-5" aria-hidden />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            >
              <button
                role="menuitem"
                type="button"
                className={itemClass}
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(note);
                }}
              >
                <Pencil className="size-4" aria-hidden /> Edit
              </button>
              <button
                role="menuitem"
                type="button"
                className={`${itemClass} text-red-600`}
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(note);
                }}
              >
                <Trash2 className="size-4" aria-hidden /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-sm text-slate-600">
        {note.content}
      </p>

      <p className="mt-4 pt-1 text-xs text-slate-400">
        Updated <time dateTime={note.updatedAt}>{formatDate(note.updatedAt)}</time>
      </p>
    </article>
  );
}
