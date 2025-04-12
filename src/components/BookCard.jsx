
import React from "react";
import "./BookCard.css";

const BookCard = ({ title, author, image }) => {
  console.log('title, author, image ',title, author, image )
  return (
    <div className="book-card">
      <img src={image} alt={title} className="book-cover" />
      <h3 className="book-title">{title}</h3>
      <p className="book-author">{author}</p>
      
    </div>
  );
};

export default BookCard;





