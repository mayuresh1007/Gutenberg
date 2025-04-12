import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fiction from "../assets/NewAssets/Fiction.svg";
import Drama from "../assets/NewAssets/Drama.svg";
import Humour from "../assets/NewAssets/Humour.svg";
import Politics from "../assets/NewAssets/Politics.svg";
import Philosophy from "../assets/NewAssets/Philosophy.svg";
import History from "../assets/NewAssets/History.svg";
import Adventure from "../assets/NewAssets/Adventure.svg";
import Next from "../assets/NewAssets/Next.svg";

const genres = [
  "fiction",
  "drama",
  "humor",
  "politics",
  "philosophy",
  "history",
  "adventure",
];

const genreIcons = {
  fiction: Fiction,
  drama: Drama,
  humor: Humour,
  politics: Politics,
  philosophy: Philosophy,
  history: History,
  adventure: Adventure,
};

const HomePage = () => {
  const navigate = useNavigate();
  const handleCategoryClick = (genre) => {
    // navigate(`/books/${genre}`);
    navigate(`/category/${genre}`);

    // navigate("/books", { state: { genre } });
  };

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div class="container">
      {width >= 1024 ? (
        <div className=" haomepagebackground py-5">
          <h1 className="text-primary logohead">Gutenberg Project</h1>
          <p className="text-center body-text fw-bold">
            A social cataloging website that allows you to freely search its
            database of books, annotations, and reviews.
          </p>
        </div>
      ) : width >= 481 ? (
        <div className=" haomepagebackground py-5">
          <h1 className="text-primary logohead">Gutenberg Project</h1>
          <p className=" body-text fw-bold">
            A social cataloging website that allows you to freely search its
            database of books, annotations, and reviews.
          </p>
        </div>
      ) : (
        <div className="haomepagebackground ">
          <h1 className="text-primary text-start">Gutenberg Project</h1>
          <p className="body-text pb-2 fw-bold">
            A social cataloging website that allows you to freely search its
            database of books, annotations, and reviews.
          </p>
        </div>
      )}
      <div className="container py-md-5">
        <div className="row">
          <div className="col-md-6 d-flex flex-column gap-3 justify-content-evenly mobilegap">
            {genres.slice(0, 4).map((genre) => (
              <button
                key={genre}
                className="genre-card text-start d-flex justify-content-between align-items-center"
                onClick={() => handleCategoryClick(genre)}
              >
                <span className="d-flex align-items-center gap-2 fw-bold">
                  <img
                    src={genreIcons[genre]}
                    alt={`${genre} icon`}
                    className="img-fluid"
                    style={{ width: "24px", height: "24px" }}
                  />
                  {genre.toUpperCase()}
                </span>
                <img src={Next} alt="next icon" width="24" height="24" />
              </button>
            ))}
          </div>

          <div className="col-md-6 d-flex flex-column gap-3">
            {genres.slice(4).map((genre) => (
              <button
                key={genre}
                className="genre-card text-start d-flex justify-content-between align-items-center "
                onClick={() => handleCategoryClick(genre)}
              >
                <span className="d-flex align-items-center gap-2 fw-bold">
                  <img
                    src={genreIcons[genre]}
                    alt={`${genre} icon`}
                    className="img-fluid"
                    style={{ width: "24px", height: "24px" }}
                  />
                  {genre.toUpperCase()}
                </span>
                <img src={Next} alt="next icon" width="24" height="24" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
