import React, {useEffect, useState} from "react";
import {auth, fireBaseDB} from "../FirebaseConfig/FirebaseConfig";
import {collection, doc, getDoc} from "firebase/firestore";

export default function InitialLoans(props){

    const {handleProgress} = props;

    /* Handle Progress */
    handleProgress(75);

    /* Find friends */
    const friendsCollectionRef = collection(fireBaseDB,"friendsList");
    const [friendsData, setFriendsData] = useState(null);

    useEffect(() => {
        const fetchFriendsList = async () => {
            const userId = auth.currentUser ? auth.currentUser.uid : null;

            try {
                if (userId) {
                    const friendsDocRef = doc(friendsCollectionRef, userId);
                    const friendsDocSnapshot = await getDoc(friendsDocRef);

                    if (friendsDocSnapshot.exists()) {
                        // Document exists, obtain the friends array or other data
                        const friendsData = friendsDocSnapshot.data();
                        console.log("Friends Data:", friendsData);

                        // Set friendsData to state
                        setFriendsData(friendsData);
                    } else {
                        console.log("Friends document does not exist for user:", userId);
                    }
                } else {
                    console.error("User ID is null or undefined.");
                }
            } catch (error) {
                console.error("Error fetching friends document:", error);
            }
        };

        fetchFriendsList();
    }, []);

    console.log(friendsData);

    /* */

    const usersCollectionRef = collection(fireBaseDB, "users");

    const [selectedFriend, setSelectedFriend] = useState("");
    const [friendDetails, setFriendDetails] = useState([]);

    useEffect(() => {
        const fetchFriendsInfo = async () => {
            try {
                if (friendsData) {
                    // Use Promise.all to fetch user data for all friends concurrently
                    const friendsPromises = friendsData.friends.map(async (friendId) => {
                        const userDocRef = doc(usersCollectionRef, friendId);
                        const userDocSnapshot = await getDoc(userDocRef);

                        if (userDocSnapshot.exists()) {
                            // Document exists, obtain the user data
                            const userData = userDocSnapshot.data();
                            console.log("User Data:", userData);
                            return { id: friendId, ...userData }; // Include friendId for reference
                        } else {
                            console.log("User document does not exist for user:", friendId);
                            return null;
                        }
                    });

                    // Wait for all promises to resolve
                    const friendsInfo = await Promise.all(friendsPromises);

                    console.log("Friends Info:", friendsInfo);
                    setFriendDetails(friendsInfo.filter(Boolean)); // Filter out null values
                } else {
                    console.error("No Friends to Show");
                }
            } catch (error) {
                console.error("Error fetching friends document:", error);
            }
        };

        fetchFriendsInfo();
    }, [friendsData]);

    console.log("detalhes",friendDetails);

    /* Buscar livros */

    const librariesCollectionRef = collection(fireBaseDB, "libraries");

    const [userLibrary, setUserLibrary] = useState(null);

    useEffect(() => {
        const fetchUserLibrary = async () => {
            try {
                const userId = auth.currentUser ? auth.currentUser.uid : null;

                if (userId) {
                    const userLibraryDocRef = doc(librariesCollectionRef, userId);
                    const userLibraryDocSnapshot = await getDoc(userLibraryDocRef);

                    if (userLibraryDocSnapshot.exists()) {
                        // Document exists, obtain the user's library data
                        const userLibraryData = userLibraryDocSnapshot.data();
                        console.log("User Library Data:", userLibraryData);

                        // Set userLibrary to state
                        setUserLibrary(userLibraryData);
                    } else {
                        console.log("User's library document does not exist for user:", userId);
                    }
                } else {
                    console.error("User ID is null or undefined.");
                }
            } catch (error) {
                console.error("Error fetching user's library document:", error);
            }
        };

        fetchUserLibrary();
    }, []);

    console.log(userLibrary);

    const [selectedBook,setSelectedBook] = useState("");

    console.log("amigo selec:",selectedFriend);
    console.log("livro selec:",selectedBook);


    return(
        <>
            <div className="row align-items-center" style={{ marginTop: "2rem" }}>
                <div className="col-10 mx-auto titleFont" style={{ fontSize: "1.8rem", textAlign: "left" }}>
                    Keep Track of Your Books
                </div>
                <div className="col-10 mx-auto billyGreyText" style={{ fontWeight: "600", textAlign: "left", marginBottom: "2rem" }}>
                    If you have loaned books to your friends, you can easily keep track of them with Billy Books!
                </div>
                <form className="col-10 mx-auto">
                    <div className="form-group text-start">
                        <label htmlFor="choose a friend" style={{ marginTop: "1rem", marginBottom: "0.5rem", display: "block", fontSize: "0.9rem", fontWeight: "600" }}>
                            Choose a Friend
                        </label>
                        <select
                            style={{ marginRight: "1rem" }}
                            className="billyInput rounded col-12"
                            id="friend"
                            value={selectedFriend}
                            onChange={(e) => setSelectedFriend(e.target.value)}
                        >
                            <option value="" disabled>Select your Friend</option>
                            {friendDetails.map((friend) => (
                                <option key={friend.id} value={friend.id}>
                                    {friend.name} {friend.surname}
                                </option>
                            ))}
                            <option value="Guest">Guest</option>
                        </select>
                        <div
                            onClick={(e) => setSelectedFriend("Guest")}
                            className="text-decoration-underline"
                            style={{ fontSize: "0.8rem", fontWeight: "600", marginTop: "1rem", color: "#196FFA", cursor: "pointer" }}>
                            Borrower doesn't have an account? Add Guest
                        </div>
                    </div>
                    <div className="form-group text-start">
                        <label htmlFor="choose a book" style={{ marginTop: "1rem", marginBottom: "0.5rem", display: "block", fontSize: "0.9rem", fontWeight: "600" }}>
                            Choose a Book
                        </label>
                        <select
                            style={{ marginRight: "1rem" }}
                            className="billyInput rounded col-12"
                            id="book"
                            value={selectedBook}
                            onChange={(e) => setSelectedBook(e.target.value)}
                        >
                            <option value="" disabled>Select a Book to Loan</option>
                            {Object.keys(userLibrary?.Read?.books || {}).map((bookId) => {
                                const book = userLibrary.Read.books[bookId];
                                return (
                                    <option key={bookId} value={bookId}>
                                        {book.title}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="text-start">
                        <div style={{ marginTop: "1rem", marginBottom: "0.5rem", display: "block", fontSize: "0.9rem", fontWeight: "600" }}>
                            Loan Data
                        </div>
                        <div className="row">
                            <div className="col-6">
                                {selectedFriend ? ( // se amigo seleciona vai mostrar foto e nome
                                    <>
                                        {/* ... Your existing code ... */}
                                    </>
                                ) : (
                                    <>

                                    </>
                                    )}
                            </div>
                            <div className="col-6">
                                {selectedBook ? ( // se amigo seleciona vai mostrar foto e nome
                                    <>
                                        {/* ... Your existing code ... */}
                                    </>
                                ) : (
                                    <>

                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </>
    )
}