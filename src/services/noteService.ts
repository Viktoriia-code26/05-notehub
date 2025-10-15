import axios from "axios";
import type { Note, NewNoteData } from "../types/note";

export interface NoteHttpResponse {
  results: Note[];
  page: number;
  total_pages: number;
  total_results: number;
}
export interface ApiNoteResponse {
  notes: Note[];
  totalPages: number;
  totalResults: number;
}
const token = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = "https://notehub-public.goit.study/api/notes";


export async function fetchNotes({
  query = "",
  currentPage = 1,
}: {
  query?: string;
    currentPage?: number;
}): Promise<NoteHttpResponse> {
  try {
    const response = await axios.get<ApiNoteResponse>(BASE_URL, {
      params: {
        search: query || undefined,
        page: currentPage,
        perPage: 12,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Cache-Control": "no-cashe",
      },
    });
    const apiData = response.data;

    return {
      results: apiData.notes,
      page: currentPage,
      total_pages: apiData.totalPages,
      total_results: apiData.totalResults,
    };
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

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete<Note>(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return response.data;
}

