import { FileText, Plus } from "lucide-react";

interface EmptyStateProps {
  hasSearch: boolean;
  onCreate: () => void;
}

export default function EmptyState({ hasSearch, onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="rounded-full bg-indigo-50 p-3">
        <FileText className="size-6 text-indigo-600" aria-hidden />
      </div>
      <h2 className="mt-4 font-semibold">{hasSearch ? "No matching notes" : "No notes yet"}</h2>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        {hasSearch
          ? "Try a different search term."
          : "Capture your first idea — it only takes a moment."}
      </p>
      {!hasSearch && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="size-4" aria-hidden /> Create a note
        </button>
      )}
    </div>
  );
}
