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
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.authors[0]?.name || "Unknown"}
            image={book.formats["image/jpeg"]}
          />
        ))}
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

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import BookCard from "../components/BookCard";
// import Back from "../assets/NewAssets/Back.svg";
// import Search from "../assets/NewAssets/Search.svg";
// import Cancel from "../assets/NewAssets/Cancel.svg";

// const API_ENDPOINT = "http://skunkworks.ignitesol.com:8000"; // Removed trailing slash

// const BookListPage = () => {
//   const navigate = useNavigate();
//   const { category } = useParams();
//   console.log(category)
//   const [books, setBooks] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const observer = useRef();
//   const abortController = useRef(new AbortController());

//   // Fixed API parameters and added cleanup
//   const fetchBooks = useCallback(
//     async (reset = false) => {
//       setIsLoading(true);
//       abortController.current.abort(); // Cancel previous request
//       abortController.current = new AbortController();

//       const params = new URLSearchParams({
//         // Changed to match typical API parameters
//         subjects: category,
//         page: reset ? 1 : page,
//         search: searchQuery,
//         has_cover: "true", // Common API parameter name
//         mime_type: "image/jpeg", // More specific MIME type
//       });

//       try {
//         const res = await fetch(`${API_ENDPOINT}/books?${params}`, {
//           signal: abortController.current.signal,
//         });

//         if (!res.ok) throw new Error(res.statusText);

//         const data = await res.json();
//         console.log(data)
//         // Adjusted for typical API response structure
//         const receivedBooks = data.results || [];
//         const hasMoreResults = data.next !== null;

//         setBooks((prev) =>
//           reset ? receivedBooks : [...prev, ...receivedBooks]
//         );
//         setHasMore(hasMoreResults);
//         setPage((prev) => (reset ? 2 : prev + 1));
//       } catch (error) {
//         if (error.name !== "AbortError") {
//           console.error("Fetch error:", error);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [category, page, searchQuery]
//   );

//   // Fixed infinite scroll implementation
//   const lastBookElementRef = useCallback(
//     (node) => {
//       if (isLoading || !hasMore) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting) {
//           fetchBooks();
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [isLoading, hasMore, fetchBooks]
//   );

//   // Added debounce for search input
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       if (searchQuery !== "" || books.length > 0) {
//         fetchBooks(true);
//       }
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [searchQuery, category]);

//   // Cleanup abort controller
//   useEffect(() => {
//     return () => abortController.current.abort();
//   }, []);

//   return (
//     <div className="container bookcontainer">
//       <h3
//         className="text-primary fw-bold align-content-center cursor-pointer"
//         onClick={() => navigate(-1)}
//       >
//         <img src={Back} alt="back btn" /> {category?.toUpperCase()}
//       </h3>

//       <div className="position-relative">
//         <input
//           type="text"
//           className="form-control ps-5 pe-5 fw-bold"
//           placeholder="Search"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           style={{ marginBottom: "1rem" }}
//         />
//         <img
//           src={Search}
//           alt="Search Icon"
//           className="position-absolute"
//           style={{
//             top: "50%",
//             left: "15px",
//             transform: "translateY(-50%)",
//             width: "20px",
//             height: "20px",
//           }}
//         />
//         {searchQuery && (
//           <img
//             src={Cancel}
//             alt="Cancel Icon"
//             className="position-absolute"
//             onClick={() => setSearchQuery("")}
//             style={{
//               top: "50%",
//               right: "15px",
//               transform: "translateY(-50%)",
//               width: "20px",
//               height: "20px",
//               cursor: "pointer",
//             }}
//           />
//         )}
//       </div>

//       {/* <div>
//         {books.map((book, index) => (
//           <div
//             key={book.id + index}
//             ref={index === books.length - 1 ? lastBookElementRef : null}
//           >
//             <BookCard book={book} />
//           </div>
//         ))}
//       </div> */}
//       <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
//         {books.map((book, index) => (
//           <div
//             key={book.id + index}
//             className="col"
//             ref={index === books.length - 1 ? lastBookElementRef : null}
//           >
//             <BookCard book={book} />
//           </div>
//         ))}
//       </div>
//       {isLoading && (
//         <div className="text-center my-3">Loading more books...</div>
//       )}
//       {!hasMore && (
//         <div className="text-center my-3">No more books to show</div>
//       )}
//     </div>
//   );
// };

// export default BookListPage;

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import BookCard from "../components/BookCard";
// import Back from "../assets/NewAssets/Back.svg";
// import Search from "../assets/NewAssets/Search.svg";
// import Cancel from "../assets/NewAssets/Cancel.svg";

// const API_ENDPOINT = "http://skunkworks.ignitesol.com:8000/"; // Replace with your API endpoint

// const BookListPage = () => {
//   const navigate = useNavigate();
//   const { category } = useParams();
//   const [books, setBooks] = useState([]);
//   const [page, setPage] = useState(1); // for API pagination
//   const [hasMore, setHasMore] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const observer = useRef();
//   console.log("category", category);
//   // Fetch books from API based on category, page, and search query.
//   const fetchBooks = useCallback(
//     async (reset = false) => {
//       setIsLoading(true);
//       // Build query parameters:
//       // - include category filter (e.g., category applies to subjects or bookshelves)
//       // - include search query in title or authors if provided
//       // - Ensure API returns only books that have image mime types for covers.
//       const params = new URLSearchParams({
//         category,
//         page: reset ? 1 : page,
//         search: searchQuery, // Assume the API supports a `search` query param
//         // Additional query params to ensure books have covers:
//         hasCover: "true", // This might depend on your API
//         mimeType: "image", // or something similar that filters out non-image mime types
//       });

//       try {
//         const res = await fetch(`${API_ENDPOINT}/books?${params.toString()}`);
//         const data = await res.json();

//         // Assuming the API response contains:
//         // data.books: an array of book objects
//         // data.hasMore: a boolean flag whether more books can be loaded
//         setBooks((prevBooks) =>
//           reset ? data.books : [...prevBooks, ...data.books]
//         );
//         setHasMore(data.hasMore);
//         if (reset) setPage(2);
//         else setPage((prevPage) => prevPage + 1);
//       } catch (error) {
//         console.error("Error fetching books:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [category, page, searchQuery]
//   );

//   // Use useEffect to re-run API call when searchQuery or category changes
//   useEffect(() => {
//     // Reset list and page on search change or if navigating with a different category
//     fetchBooks(true);
//   }, [searchQuery, category, fetchBooks]);

//   // Infinite scrolling:
//   const lastBookElementRef = useCallback(
//     (node) => {
//       if (isLoading) return;
//       if (observer.current) observer.current.disconnect();
//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           // Load next page
//           fetchBooks();
//         }
//       });
//       if (node) observer.current.observe(node);
//     },
//     [isLoading, hasMore, fetchBooks]
//   );

//   return (
//     <div className="container bookcontainer">
//       <h3
//         className="text-primary fw-bold align-content-center cursor-pointer"
//         onClick={() => navigate(-1)}
//       >
//         {" "}
//         <img src={Back} alt="back btn" /> {category.toUpperCase()}
//       </h3>
//       <div className="position-relative">
//         <input
//           type="text"
//           className="form-control ps-5 pe-5 fw-bold"
//           placeholder="Search"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           style={{ marginBottom: "1rem" }}
//         />
//         <img
//           src={Search}
//           alt="Search Icon"
//           className="position-absolute"
//           style={{
//             top: "50%",
//             left: "15px",
//             transform: "translateY(-50%)",
//             width: "20px",
//             height: "20px",
//           }}
//         />
//         {searchQuery && (
//           <img
//             src={Cancel}
//             alt="Cancel Icon"
//             className="position-absolute"
//             onClick={() => setSearchQuery("")}
//             style={{
//               top: "50%",
//               right: "15px",
//               transform: "translateY(-50%)",
//               width: "20px",
//               height: "20px",
//               cursor: "pointer",
//             }}
//           />
//         )}
//       </div>
//       <div>
//         {books?.map((book, index) => {
//           // Attach ref to the last book element for infinite scrolling.
//           if (index === books.length - 1) {
//             return (
//               <div key={book.id} ref={lastBookElementRef}>
//                 <BookCard book={book} />
//               </div>
//             );
//           }
//           return (
//             <div key={book.id}>
//               <BookCard book={book} />
//             </div>
//           );
//         })}
//       </div>
//       {isLoading && <p>Loading...</p>}
//       {!hasMore && <p>No more books available.</p>}
//     </div>
//   );
// };

// export default BookListPage;
