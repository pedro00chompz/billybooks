// SearchAndDisplayBooks.js
import React from "react";

const SearchAndDisplayBooks = ({
                                   handleSearchBooks,
                                   displayedBooks,
                                   books,
                                   handleAddToShelf,
                                   handleShowMore,
                                   handleBookClick
                               }) => {
    return (
        <div className="col-10 mx-auto">
            <div className="form-group text-start">
                <label
                    htmlFor="search"
                    style={{ marginBottom: "0.5rem", display: "block", fontSize: "0.9rem", fontWeight: "600" }}
                >
                    Search
                </label>
                <input
                    type="text"
                    className="billyInput rounded d-block col-12"
                    id="search"
                    placeholder="Search for a book or an author here"
                    onChange={handleSearchBooks}
                />
            </div>

            <div className="col-10 mx-auto" style={{ marginTop: "2rem" }}>
                <div className="row">
                    {books.slice(0, displayedBooks).map((book) => (
                        <div key={book.id} className="col-12 col-md-4 mb-4">
                            <div className="titleFont col-10 mx-auto">{book.title}</div>
                            <div className="billyGreyText" style={{ marginBottom: "0.4rem", fontSize: "0.8rem" }}>
                                por {book.authors}
                            </div>
                            <img src={book.cover} alt={book.title} style={{ border: "0.05rem solid #6F6F6F" }}     onClick={() => handleBookClick && handleBookClick(book)}
                            />
                            <button
                                className="rounded-pill w-50 billySecondaryButton"
                                style={{ fontSize: "0.8rem", fontWeight: "700", marginTop: "0.4rem" }}
                                onClick={() => {
                                    handleAddToShelf(book);
                                }}
                            >
                                Add to shelf
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {displayedBooks < books.length && (
                <div className="text-center mt-3">
                    <button
                        className="rounded-pill w-100 billySecondaryButton"
                        style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom: "2rem" }}
                        onClick={handleShowMore}
                    >
                        Show more results
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchAndDisplayBooks;
