import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, Plus, Search } from "lucide-react";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import EmptyState from "../components/EmptyState";
import NoteCard from "../components/NoteCard";
import NoteFormModal from "../components/NoteFormModal";
import Sidebar from "../components/Sidebar";
import { useNotes } from "../hooks/useNotes";
import type { CreateNoteInput, Note } from "../types/notes";

export default function DashboardPage() {
  const { notes, loading, error, reload, createNote, updateNote, deleteNote } = useNotes();

  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState<Note | null>(null);

  const visibleNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...notes]
      .filter((n) => !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, query]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (note: Note) => {
    setEditing(note);
    setFormOpen(true);
  };
  const handleSubmit = (values: CreateNoteInput) =>
    editing ? updateNote(editing.id, values) : createNote(values);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">My Notes</h1>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="size-4" aria-hidden /> New Note
          </button>
        </div>

        <div className="relative mt-6 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes…"
            aria-label="Search notes by title or content"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-2 focus:outline-indigo-600"
          />
        </div>

        <div className="mt-8">
          {error && (
            <div role="alert" className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
              <span className="flex-1">{error}</span>
              <button type="button" onClick={() => void reload()} className="font-medium underline">
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-slate-500" role="status">
              <Loader2 className="size-5 animate-spin" aria-hidden /> Loading notes…
            </div>
          ) : visibleNotes.length === 0 ? (
            !error && <EmptyState hasSearch={query.trim().length > 0} onCreate={openCreate} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleNotes.map((note) => (
                <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={setDeleting} />
              ))}
            </div>
          )}
        </div>
      </main>

      <NoteFormModal
        open={formOpen}
        note={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
      <ConfirmDeleteDialog
        note={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={(note) => deleteNote(note.id)}
      />
    </div>
  );
}
