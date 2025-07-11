import { useEffect } from "react";
import ReactDOM from "react-dom";
import css from "./MovieModal.module.css";
import type { Movie } from "../../types/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const { backdrop_path, title, overview, release_date, vote_average } = movie;

  const imagePath = backdrop_path
    ? `https://image.tmdb.org/t/p/original${backdrop_path}`
    : null;

  const formattedDate = release_date
    ? new Date(release_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown";

  const ratingText =
    typeof vote_average === "number" ? `${vote_average}/10` : "No rating";

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {imagePath ? (
          <img
            src={imagePath}
            alt={title || "Movie image"}
            className={css.image}
          />
        ) : (
          <div className={css.fallback}>No image available</div>
        )}

        <div className={css.content}>
          <h2>{title || "No title available"}</h2>
          <p>{overview?.trim() || "No overview available."}</p>
          <p>
            <strong>Release Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Rating:</strong> {ratingText}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
