import axios from "axios";
import type { Note, NoteUpdateData, NewNoteData } from "../types/note";

export interface NoteHttpResponse {
  results: Note[];
  page: number;
  total_pages: number;
  total_results: number;
}

const token = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api/docs/notes";


export async function fetchNotes({
  query = "",
  currentPage = 1,
}: {
  query?: string;
  currentPage?: number;
}): Promise<NoteHttpResponse> {
  try {
    const response = await axios.get<NoteHttpResponse>(BASE_URL, {
      params: {
        q: query || undefined,
        page: currentPage,
        perPage: 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    return {
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    };
  }
}

export async function createNote(newNoteData: NewNoteData): Promise<Note> {
  const response = await axios.post<Note>(BASE_URL, newNoteData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
}


export async function deleteNote(id: string): Promise<{ id: string }> {
  const response = await axios.delete<{ id: string }>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
}

export async function updateNote(noteUpdateData: NoteUpdateData): Promise<Note> {
  const { id, ...dataForUpdate } = noteUpdateData;
  const response = await axios.put<Note>(`${BASE_URL}/${id}`, dataForUpdate, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
}
