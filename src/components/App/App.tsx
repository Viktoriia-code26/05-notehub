import css from "../App/App.module.css";
import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../NoteModal/NoteModal";
import NoteForm from "../NoteForm/NoteForm";

import { deleteNote, fetchNotes} from "../../services/noteServices";
import { useDebouncedCallback } from "use-debounce";
import type { Note } from "../../types/note";


const useToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

export default function App() {
  const queryClient = useQueryClient();
  const { isOpen, open, close } = useToggle();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  const handleSearch = useDebouncedCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, 600);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["notes", searchQuery, currentPage],
    queryFn: () => fetchNotes({ query: searchQuery, currentPage }),
    placeholderData: keepPreviousData,
    enabled: true,
  });

  const notes = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("🗑 Note deleted!");
    },
    onError: () => toast.error("❌ Failed to delete note."),
  });

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };


  const handleSelectNote = (note: Note) => {
    console.log("Selected note:", note);
  };
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
     
        <SearchBox onSearch={handleSearch} searchQuery={searchQuery} />
        <button className={css.createButton} onClick={open}>
          + Create Note
        </button>
      </header>

      <main className={css.main}>
        {(isLoading || isFetching) && <strong className={css.loading}>Loading notes...</strong>}
        {error && <p className={css.error}>❌ Failed to load notes.</p>}

        {!isLoading && notes.length > 0 ? (
          <>
            <NoteList notes={notes}
              onSelect={handleSelectNote}
              onDelete={handleDeleteNote} />
           
            {totalPages > 1 && (
                 <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
)}
         
          </>
        ) : (
          !isLoading && <p className={css.empty}>No notes found.</p>
        )}
      </main>

      {isOpen && (
        <NoteModal onClose={close}>
          <NoteForm onClose={close} onSuccess={close }/>
        </NoteModal>
      )}

      <Toaster
        position="top-right"
      />
    </div>
  );
}