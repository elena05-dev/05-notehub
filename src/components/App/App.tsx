import { useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import toast, { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import css from "./App.module.css";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateSearchQuery = useDebouncedCallback((newSearchQuery: string) => {
    setPage(1);
    setSearchQuery(newSearchQuery);
  }, 300);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery<FetchNotesResponse>(
    {
      queryKey: ["notes", page, searchQuery],
      queryFn: () =>
        fetchNotes({ page, perPage: PER_PAGE, search: searchQuery }),
      placeholderData: keepPreviousData,
    }
  );

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  console.log("Fetched notes:", data);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load notes.");
    }
  }, [isError]);

  return (
    <div className={css.app}>
      <Toaster position="top-right" />

      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={updateSearchQuery} />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isFetching && !isLoading && <p>Updating...</p>}
      {isError && <p>Failed to load notes.</p>}

      {!isLoading &&
        !isFetching &&
        data &&
        (!Array.isArray(data.results) || data.results.length === 0) && (
          <p>No notes found.</p>
        )}

      {!isLoading &&
        !isFetching &&
        data &&
        Array.isArray(data.results) &&
        data.results.length > 0 && (
          <NoteList
            notes={data.results}
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />
        )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
