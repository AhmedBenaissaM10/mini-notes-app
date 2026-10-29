// Types derived from openapi.yml (components.schemas).

export const NOTE_TITLE_MAX_LENGTH = 150; // CreateNoteDto / UpdateNoteDto.title.maxLength

/** NoteResponseDto */
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date-time
  updatedAt: string; // ISO date-time
}

/** CreateNoteDto — both fields required */
export interface CreateNoteInput {
  title: string;
  content: string;
}

/** UpdateNoteDto — both fields optional */
export type UpdateNoteInput = Partial<CreateNoteInput>;

/** SuccessEnvelopeDto + { data } */
export interface SuccessEnvelope<T> {
  success: true;
  statusCode: number;
  path: string;
  method: string;
  timestamp: string;
  data: T;
}

/** ErrorResponseDto — `message` is a string or an array of strings */
export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
}
