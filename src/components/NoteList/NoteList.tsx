import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { mutate } = useMutation<Note, Error, number>({
    mutationFn: deleteNote,
    onMutate: (id: number) => {
      setDeletingId(id);
    },
    onSuccess: () => {
      toast.success("Note deleted");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Failed to delete note");
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={deletingId === note.id}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
