import React, { useEffect, useState } from "react";
import {useAuth, fireBaseDB, auth} from "../FirebaseConfig/FirebaseConfig";
import { collection, getDocs, doc } from "firebase/firestore";
import {Modal, ModalBody} from "react-bootstrap";
import AddBookToShelfModal from "../Components/AddBookToShelfModal";
import SearchAndDisplayBooks from "../Components/SearchAndDisplayBooks";

// Define handleAddToShelf function with setLibrary parameter
const handleAddToShelf = async (book, setLibrary, setSelectedBook, setShowAddBookToShelfModal) => {
    console.log(book);

    const userId = auth.currentUser ? auth.currentUser.uid : null;
    const librariesCollectionRef = collection(fireBaseDB, "libraries");

    try {
        const data = await getDocs(librariesCollectionRef);
        const userLibrary = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        })).filter((userLibrary) => userLibrary.id === userId);

        // Call the setLibrary function passed as a parameter
        setLibrary(userLibrary);
        setSelectedBook(book);
        setShowAddBookToShelfModal(true);
    } catch (error) {
        console.error("Error retrieving user shelves:", error);
    }
};


export default function FindBooks(props) {

    const {handleProgress, handleShowAlert, handleComponentSwitch} = props;

    /* Search Books */

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


    /* Handle Progress */

    handleProgress(45);

    /* */



// Use useEffect to log the updated state
    useEffect(() => {
        console.log(library);
    }, [library]);
    /* */

    /* Avançar */

    const handleNext = ()=>{
        handleShowAlert({ isError: false, message: 'Books Added!' });
        if (handleComponentSwitch) {
            handleComponentSwitch("FindFriends");
        }
    }

    const handleBack = () =>{
        handleShowAlert({ isError: false, message: 'User information updated successfully!' });
        if (handleComponentSwitch) {
            handleComponentSwitch("CreateShelves");
        }
    }


    return (
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
            <div className="row align-items-center" style={{ marginTop: "2rem" }}>
                <div className="col-10 mx-auto titleFont" style={{ fontSize: "1.8rem", textAlign: "left" }}>
                    Let’s Add Some Books
                </div>
                <div
                    className="col-10 mx-auto billyGreyText"
                    style={{ fontWeight: "600", textAlign: "left", marginBottom: "2rem" }}
                >
                    Billy Books has 3 different shelves: one for currently reading books, another for read books and a third for your favourites
                </div>
                <SearchAndDisplayBooks
                    handleSearchBooks={handleSearchBooks}
                    displayedBooks={displayedBooks}
                    books={books}
                    handleAddToShelf={(book) => handleAddToShelf(book, setLibrary, setSelectedBook, setShowAddBookToShelfModal)}
                    handleShowMore={handleShowMore}
                />

                <div className="col-10 mx-auto">
                    <button
                    className="rounded-pill w-100 billyPrimaryButton"
                    style={{ fontSize: "0.8rem"}}
                    onClick={handleNext}
                >
                    Continue
                    </button>
                    <div onClick={handleBack} className="text-center text-decoration-underline" style={{fontSize:"0.8rem",fontWeight:"600",color:"#196FFA", marginTop:"1rem",cursor:"pointer",marginBottom:"2rem"}}>
                        Back
                    </div>
                </div>
            </div>
        </>
    );
}

export {handleAddToShelf};