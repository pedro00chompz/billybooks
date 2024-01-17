import { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { fireBaseDB } from "../FirebaseConfig/FirebaseConfig";

export default function UserIsCurrentlyReading(props) {
    const { user, handleBookClick} = props;
    const userId = user?.userId;
    const librariesCollectionRef = collection(fireBaseDB, "libraries");
    const [userShelves, setUserShelves] = useState(null);
    const [currentlyReading, setCurrentlyReading] = useState(null);
    const [booksToShow, setBooksToShow] = useState(3);
    const [booksAddThisYear,setBooksAddThisYear] = useState(null);
    const [thisYearBooksToShow, setThisYearBToShow] = useState(3);
    const currentYear = new Date().getFullYear();

    console.log(currentYear);

    useEffect(() => {
        const getUserLibrary = async () => {
            try {
                if (userId) {
                    const libraryDocRef = doc(librariesCollectionRef, userId);
                    const libraryDocSnapshot = await getDoc(libraryDocRef);

                    if (libraryDocSnapshot.exists()) {
                        const userLibrary = libraryDocSnapshot.data();
                        setUserShelves(userLibrary);

                        // Extract books from Currently Reading shelf
                        const currentlyReadingShelf =
                            userLibrary?.CurrentlyReading?.books || {};
                        const currentlyReadingBooks = Object.values(
                            currentlyReadingShelf
                        );

                        // Set the currentlyReading state with the extracted books
                        setCurrentlyReading(currentlyReadingBooks);

                        // Extract books from all shelves
                        const allBooks = Object.values(userLibrary).reduce(
                            (accumulator, shelfData) => {
                                if (shelfData.books) {
                                    const shelfBooks = Object.values(
                                        shelfData.books
                                    );
                                    return accumulator.concat(shelfBooks);
                                }
                                return accumulator;
                            },
                            []
                        );

                        // Filter unique books added in the current year based on ID
                        const uniqueBooksAddedThisYear = [];
                        const uniqueBookIds = new Set();

                        allBooks.forEach((book) => {
                            if (
                                new Date(book.added).getFullYear() === currentYear &&
                                !uniqueBookIds.has(book.id)
                            ) {
                                uniqueBookIds.add(book.id);
                                uniqueBooksAddedThisYear.push(book);
                            }
                        });

                        // Set the booksAddThisYear state with unique books added in the current year
                        setBooksAddThisYear(uniqueBooksAddedThisYear);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        getUserLibrary();
    }, [userId, currentYear]);



    console.log(userShelves);
    console.log(currentlyReading);
    console.log(booksAddThisYear);

    console.log(userShelves);
    console.log(currentlyReading);



    return (
        <>
            <div className="row" style={{ marginTop: "1.5rem" }}>
                <h1 className="titleFont col-12 text-start" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{user?.name} is Currently Reading</h1>
                {currentlyReading && currentlyReading.length > 0 ? (
                    currentlyReading.slice(0, booksToShow).map((book, index) => (
                        <div key={book.id} className="col-4" style={{ marginBottom: "1rem" }} onClick={() => handleBookClick(book)}>
                            <img src={book.cover} alt={book.title} className="img-fluid" style={{ border: "0.05rem solid #D4D4D4" }} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center billyGreyText" style={{fontSize:"0.8rem"}}>No currently reading books</div>
                )}

                {currentlyReading && currentlyReading.length > booksToShow && (
                    <div
                        className="text-center text-decoration-underline"
                        onClick={() => setBooksToShow(booksToShow + 3)}
                        style={{ fontSize: "0.8rem", color: "#196FFA", cursor: "pointer" }}
                    >
                        See More
                    </div>
                )}
            </div>
            <div className="row" style={{ marginTop: "1.5rem" }}>
                <h1 className="titleFont col-12 text-start" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Books Added in {currentYear} ({booksAddThisYear?.length})</h1>
                {booksAddThisYear && booksAddThisYear.length > 0 ? (
                    booksAddThisYear.slice(0, thisYearBooksToShow).map((book, index) => (
                        <div key={book.id} className="col-4" style={{ marginBottom: "1rem" }} onClick={() => handleBookClick(book)}>
                            <img src={book.cover} alt={book.title} className="img-fluid" style={{ border: "0.05rem solid #D4D4D4" }} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center billyGreyText" style={{fontSize:"0.8rem"}}>No books added in {currentYear}</div>
                )}

                {booksAddThisYear && booksAddThisYear.length > thisYearBooksToShow && (
                    <div
                        className="text-center text-decoration-underline"
                        onClick={() => setThisYearBToShow(thisYearBooksToShow + 3)}
                        style={{ fontSize: "0.8rem", color: "#196FFA", cursor: "pointer" }}
                    >
                        See More
                    </div>
                )}
            </div>
        </>
    );
}
