import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import Back from "../assets/NewAssets/Back.svg";
import Search from "../assets/NewAssets/Search.svg";
import Cancel from "../assets/NewAssets/Cancel.svg";

const API_ENDPOINT = "http://skunkworks.ignitesol.com:8000";

const BookListPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef();
  const abortController = useRef(new AbortController());

  const fetchBooks = useCallback(
    async (reset = false) => {
      setIsLoading(true);
      abortController.current.abort();
      abortController.current = new AbortController();

      const params = new URLSearchParams({
        topic: category, // ✅ fixed
        search: searchQuery,
        has_cover: "true",
        mime_type: "image/jpeg",
        page: reset ? 1 : page,
      });

      try {
        const res = await fetch(`${API_ENDPOINT}/books?${params}`, {
          signal: abortController.current.signal,
        });

        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();
        const receivedBooks = data.results || [];
        const hasMoreResults = data.next !== null;

        setBooks((prev) =>
          reset ? receivedBooks : [...prev, ...receivedBooks]
        );
        setHasMore(hasMoreResults);
        setPage((prev) => (reset ? 2 : prev + 1));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [category, page, searchQuery]
  );
  const lastBookElementRef = useCallback(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchBooks();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchBooks]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBooks(true);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, category]);

  useEffect(() => {
    fetchBooks(true);
  }, [category]);

  useEffect(() => {
    return () => abortController.current.abort();
  }, []);

  return (
    <div className="container bookcontainer">
      <h3
        className="text-primary fw-bold align-content-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <img src={Back} alt="back btn" /> {category?.toUpperCase()}
      </h3>

      <div className="position-relative">
        <input
          type="text"
          className="form-control ps-5 pe-5 fw-bold"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <img
          src={Search}
          alt="Search Icon"
          className="position-absolute"
          style={{
            top: "50%",
            left: "15px",
            transform: "translateY(-50%)",
            width: "20px",
            height: "20px",
          }}
        />
        {searchQuery && (
          <img
            src={Cancel}
            alt="Cancel Icon"
            className="position-absolute"
            onClick={() => setSearchQuery("")}
            style={{
              top: "50%",
              right: "15px",
              transform: "translateY(-50%)",
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
          />
        )}
      </div>

      <div className="books-grid">
        {books.map((book, index) => {
          if (index === books.length - 1) {
            return (
              <div ref={lastBookElementRef} key={book.id}>
                <BookCard
                  book={book}
                  title={book.title}
                  author={book.authors[0]?.name || "Unknown"}
                  image={book.formats["image/jpeg"]}
                />
              </div>
            );
          } else {
            return (
              <BookCard
                book={book}
                key={book.id}
                title={book.title}
                author={book.authors[0]?.name || "Unknown"}
                image={book.formats["image/jpeg"]}
              />
            );
          }
        })}
      </div>

      {isLoading && (
        <div className="text-center my-3">Loading more books...</div>
      )}
      {!hasMore && (
        <div className="text-center my-3">No more books to show</div>
      )}
    </div>
  );
};

export default BookListPage;


  /* {books.map((book) => (
          <BookCard
            book={book}
            key={book.id}
            title={book.title}
            author={book.authors[0]?.name || "Unknown"}
            image={book.formats["image/jpeg"]}
          />
        ))} */

