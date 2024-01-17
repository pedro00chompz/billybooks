import SearchAndDisplayBooks from "../Components/SearchAndDisplayBooks";
import React, {useEffect, useState} from "react";
import {auth, fireBaseDB} from "../FirebaseConfig/FirebaseConfig";
import {collection, getDocs} from "firebase/firestore";
import AddBookToShelfModal from "../Components/AddBookToShelfModal";

export default function Explore(props){

    const {handleBookClick} = props;

    const [search, setSearch] = useState("");
    const [books, setBooks] = useState([]);
    const [displayedBooks, setDisplayedBooks] = useState(4);
    const [showAddBookToShelfModal,setShowAddBookToShelfModal] = useState(false);
    const [library,setLibrary] = useState();
    const [selectedBook,setSelectedBook] = useState([]);

    const handleShowMore = () => {
        setDisplayedBooks((prevDisplayedBooks) => prevDisplayedBooks + 4);
    };

    const handleSearchBooks = async (event) => {
        const searchTerm = event.target.value;

        if (!searchTerm.trim()) {
            setBooks([]);
            setDisplayedBooks(4);
            return;
        }

        setSearch(searchTerm);

        try {
            // Make a request to the Google Books API
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}`
            );

            if (!response.ok) {
                throw new Error(`Google Books API request failed with status ${response.status}`);
            }

            const data = await response.json();

            console.log(data);

            // Extract relevant information from the API response
            const booksData = data.items.map((item) => ({
                id: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors || [],
                description: item.volumeInfo.description || "",
                cover: item.volumeInfo.imageLinks?.thumbnail || "",
                categories: item.volumeInfo.categories || [], // Add categories
                publishedDate: item.volumeInfo.publishedDate || "", // Add publishedDate
            }));

            // Filter out books without categories and sort by publishedDate
            const filteredBooksData = booksData
                .filter((book) => book.categories.length > 0)
                .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

            // Use a Set to keep track of unique titles
            const uniqueTitles = new Set();

            const removeAccents = (str) => {
                return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            };

            // Filter out books with duplicate titles
            const uniqueFilteredBooksData = filteredBooksData.filter((book) => {
                // Transforma os títulos para minúsculas e remove acentos
                const normalizedTitle = removeAccents(book.title.toLowerCase());

                // Verifica se o título do livro (após a normalização) é único e se o livro tem uma thumbnail
                if (!uniqueTitles.has(normalizedTitle) && book.cover) {
                    uniqueTitles.add(normalizedTitle);
                    return true;
                }
                return false;
            });

            // Update the state with the retrieved books
            setBooks(uniqueFilteredBooksData);
        } catch (error) {
            console.error("Error searching books:", error);
        }
    };

    /* Add to Shelf */
    const handleAddToShelf = async (book) => {
        console.log(book);

        const userId = auth.currentUser ? auth.currentUser.uid : null;
        const librariesCollectionRef = collection(fireBaseDB, "libraries");

        try {
            const data = await getDocs(librariesCollectionRef);
            const userLibrary = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            })).filter((userLibrary) => userLibrary.id === userId);

            setLibrary(userLibrary);
            setSelectedBook(book);
            setShowAddBookToShelfModal(true);
        } catch (error) {
            console.error("Error retrieving user shelves:", error);
        }
    };

// Use useEffect to log the updated state
    useEffect(() => {
        console.log(library);
    }, [library]);
    /* */

    return(
        <>
            {showAddBookToShelfModal && (
                <>
                    <AddBookToShelfModal
                        showAddBookToShelfModal={showAddBookToShelfModal}
                        onHide={() => setShowAddBookToShelfModal(false)} // Function to hide the modal
                        userLibrary={library} // Pass user libraries as a prop
                        selectedBook={selectedBook} // Pass the selected book as a prop
                    />
                </>
            )}
            <h1 className="titleFont col-12 text-start" style={{ fontSize: '1.2rem', marginLeft:"1.5rem", marginTop:"2rem", marginBottom:"2rem" }}>Explore new books</h1>

            <SearchAndDisplayBooks
                handleSearchBooks={handleSearchBooks}
                displayedBooks={displayedBooks}
                books={books}
                handleAddToShelf={handleAddToShelf}
                handleShowMore={handleShowMore}
                handleBookClick={handleBookClick}
            />
        </>
    )
}