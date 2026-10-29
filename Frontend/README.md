# Mini Notes App

React + Vite + TypeScript + Tailwind CSS v4 frontend for the Mini Notes NestJS API.

## Getting started

```bash
npm install
cp .env.example .env      # VITE_API_BASE_URL=http://localhost:3000/api
npm run dev               # http://localhost:5173
npm run build             # type-check + production build into dist/
npm run preview           # serve the production build
```

The backend must be running and must allow CORS from `http://localhost:5173`
(NestJS: `app.enableCors({ origin: 'http://localhost:5173' })`).

## Structure

```
src/
├── api/          client.ts (fetch wrapper, error normalization), notes.ts (typed endpoints)
├── components/   Modal, NoteCard, NoteFormModal, ConfirmDeleteDialog, EmptyState, Sidebar
├── config/       env.ts (reads VITE_API_BASE_URL)
├── hooks/        useNotes.ts (fetching + mutations)
├── lib/          format.ts
├── pages/        DashboardPage.tsx
└── types/        notes.ts (from openapi.yml schemas)
```

## OpenAPI gaps / notes

- `servers` is empty → base URL comes from `VITE_API_BASE_URL`.
- No `minLength` on `title`/`content`; "required" is enforced client-side as non-empty after trimming.
  Confirm the backend rejects empty strings (a 400 would be shown in the form).
- `UpdateNoteDto` has no `required` fields and no `maxLength` on `content`; the UI always sends both fields.
- `404` responses are described as "User not found" (copy-paste error in the spec); the UI shows the server's `message`.
- `ErrorResponseDto.message` is `string | string[]`; both are handled.
- No CORS, pagination, or server-side search is described; search and sorting are client-side.
