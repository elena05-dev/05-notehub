import { useState, useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginateLib from "react-paginate";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import type { FetchMoviesResponse } from "../../services/movieService";
import css from "./App.module.css";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching } =
    useQuery<FetchMoviesResponse>({
      queryKey: ["movies", searchQuery, page],
      queryFn: () => fetchMovies(searchQuery, page),
      enabled: searchQuery !== "",
      placeholderData: keepPreviousData,
    });

  useEffect(() => {
    if (data && data.results.length === 0 && !isFetching) {
      toast.error("No movies found for your request.");
    }
  }, [data, isFetching]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setSearchQuery(query);
    setPage(1);
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {isError && <ErrorMessage />}
      {isLoading && !isFetching && <Loader />}

      {data && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginateLib
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => {
                setPage(selected + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              forcePage={page - 1}
              previousLabel="←"
              nextLabel="→"
              renderOnZeroPageCount={null}
              containerClassName={css.pagination}
              activeClassName={css.active}
            />
          )}

          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
