import css from "../App/App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import { fetchNotes} from "../../services/noteService";
import { useDebounce } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";


const useToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

export default function App() {
  const { isOpen, open, close } = useToggle();
  const [ searchTerm, setSearchTerm ] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["notes", debouncedSearch, currentPage],
    queryFn: () => fetchNotes({ query: debouncedSearch, currentPage }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleCreateNote = () => {
    close();
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
     
        <SearchBox onSearch={setSearchTerm} searchQuery={searchTerm} />
        
         { totalPages > 1 && notes.length > 0 && (
          <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
)}
        <button className={css.button} onClick={open}>
          + Create Note
        </button>
      </header>

      <main className={css.main}>
        {(isLoading || isFetching) && <Loader/>}
        {error && <ErrorMessage/>}

        {!isLoading && notes.length > 0 ? (
        
            <NoteList notes={notes} />
        ) : (
          !isLoading && <p className={css.empty}>No notes found.</p>
        )}
      </main>

      {isOpen && (
        <NoteModal open={ isOpen } onClose={close}>
          <NoteForm onClose={close} onSuccess={ handleCreateNote }/>
        </NoteModal>
      )}

      <Toaster
        position="top-right"
      />
    </div>
  );
}