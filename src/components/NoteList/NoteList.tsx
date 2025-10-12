import css from "../NoteList/NoteList.module.css";
import type { Note, NoteUpdateData } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote, deleteNote } from "../../services/noteServices";

interface NoteProps{
  notes: Note[];
  onSelect: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteList({ notes }: NoteProps) {
  const quertClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess() {
      quertClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: (updatedNote: NoteUpdateData) => updateNote(updatedNote),
    onSuccess() {
      quertClient.invalidateQueries({ queryKey: ["notes"] });
        
    },
  });


  const handleUpdate = (note: Note) => {
    updateNoteMutation.mutate({
     id: note.id,
    title: note.title,
    content: note.content,
    tag: note.tag,

    })
  }


  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <input
            type="checkbox"
            defaultChecked={!note.content}
            className={css.checkbox}
            onChange={() => handleUpdate(note)}
                      name="query"
                      autoComplete="off"
                      placeholder="Update notes..."
                      autoFocus
          />
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              type="button"
              onClick={() => deleteNoteMutation.mutate(note.id)}
              className={css.button}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

