
import styles from "../SearchBox/SearchBox.module.css";
import type { DebouncedState } from "use-debounce";

interface SearchBoxProps {
  onSearch: DebouncedState<(query: string) => void>,
  searchQuery: string;
}

export default function SearchBox({ onSearch, searchQuery }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search notes..."
            autoFocus
            value={searchQuery}
            onChange={handleChange}
          />
        </form>
      </div>
    </header>
  );
}