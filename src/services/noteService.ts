import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  results: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  try {
    const cleanParams = { ...params };
    if (!cleanParams.search?.trim()) {
      delete cleanParams.search;
    }

    const { data } = await instance.get<{ notes: Note[]; totalPages: number }>(
      "/notes",
      { params: cleanParams }
    );

    return {
      results: data.notes,
      totalPages: data.totalPages,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch notes");
  }
}

export async function createNote(note: CreateNotePayload): Promise<Note> {
  try {
    const { data } = await instance.post<Note>("/notes", note);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create note");
  }
}

export async function deleteNote(id: number): Promise<Note> {
  try {
    const { data } = await instance.delete<Note>(`/notes/${id}`);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to delete note");
  }
}
