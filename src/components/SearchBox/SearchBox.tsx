
import styles from "../SearchBox/SearchBox.module.css";

interface SearchBoxProps {
  onSearch:(query: string) => void,
  searchQuery: string;
}

export default function SearchBox({ onSearch, searchQuery }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
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
      </div>
    </header>
  );
}