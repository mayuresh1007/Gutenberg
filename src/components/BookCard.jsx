
import React from "react";
import "./BookCard.css";

const BookCard = ({ title, author, image, book }) => {
  const preferredFormats = ['text/html','application/pdf','text/plain','application/zip']
  const handleClick = () => {
        // Find the first available format among preferred ones.
        let selectedUrl = null;
        for (const fmt of preferredFormats) {
          if (book.formats[fmt]) {
            // As a bonus caveat, ignore zip files (or similar non-viewable types)
            if (!book.formats[fmt].toLowerCase().endsWith('.zip')) {
              selectedUrl = book.formats[fmt];
              break;
            }
          }
        }
        if (selectedUrl) {
          window.open(selectedUrl, '_blank');
        } else {
          alert('No viewable version available');
        }
      };
  console.log('title, author, image ',title, author, image )
  return (
    <div className="book-card" onClick={handleClick}>
      <img src={image} alt={title} className="book-cover" />
      <h3 className="book-title">{title}</h3>
      <p className="book-author">{author}</p>
      
    </div>
  );
};

export default BookCard;





