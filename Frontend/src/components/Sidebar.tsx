import { NotebookPen, StickyNote } from "lucide-react";

export default function Sidebar() {
  return (
    <>
      {/* Mobile / tablet top bar */}
      <header className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <NotebookPen className="size-5 text-indigo-600" aria-hidden />
        <span className="font-semibold">Mini Notes</span>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <NotebookPen className="size-6 text-indigo-600" aria-hidden />
          <span className="text-lg font-semibold">Mini Notes</span>
        </div>
        <nav aria-label="Main">
          <a
            href="#"
            aria-current="page"
            className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
          >
            <StickyNote className="size-4" aria-hidden />
            Notes
          </a>
        </nav>
      </aside>
    </>
  );
}
