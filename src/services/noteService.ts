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
  tag?: string;
}

export interface FetchNotesResponse {
  results: Note[];
  totalPages: number;
}
export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const cleanParams = { ...params };
  if (!cleanParams.search?.trim()) {
    delete cleanParams.search;
  }

  const { data } = await instance.get("/notes", { params: cleanParams });

  return {
    results: data.notes,
    totalPages: data.totalPages,
  };
}
export async function createNote(note: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> {
  const { data } = await instance.post("/notes", note);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await instance.delete<Note>(`/notes/${id}`);
  return response.data;
}
