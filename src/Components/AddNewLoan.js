import {collection, doc, getDoc,setDoc,updateDoc} from "firebase/firestore";
import {auth, fireBaseDB} from "../FirebaseConfig/FirebaseConfig";
import React, {useEffect, useState} from "react";
import {ModalBody,Modal} from "react-bootstrap";

export default function AddNewLoan(props){

    const {cancelModal,show} = props;

    const getRandomAlphanumericId = (length) => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            result += charset.charAt(randomIndex);
        }
        return result;
    };

    const [selectedFriendDetails, setSelectedFriendDetails] = useState(null);
    const [selectedBookDetails, setSelectedBookDetails] = useState(null);

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


    /* Algoritmo para gerar cores aleatórias no input de meter imagens */

    const [randomBackgroundColor, setRandomBackgroundColor] = useState("#196FFA");
    const [randomColor, setRandomColor] = useState("#D1E2FE");

    const generateRandomColor = () => {
        const colorsArray = [
            ["#196FFA", "#D1E2FE"],
            ["#70163C", "#FFBDD9"],
            ["#FAB019", "#FEEFD1"],
            ["#E03616", "#FFCBC2"],
            ["#21D775", "#BDFFDB"],
            ["#D77821", "#FFE5CE"],
            ["#9F32F4", "#EAD0FF"],
            ["#42E3C6", "#DDFFF9"],
            ["#E342CA", "#FFD0F8"],
        ];

        const randomNumber = Math.floor(Math.random() * colorsArray.length);

        const newRandomBackgroundColor = colorsArray[randomNumber][0];
        const newRandomColor = colorsArray[randomNumber][1];

        setRandomBackgroundColor(newRandomBackgroundColor);
        setRandomColor(newRandomColor);
    };

    useEffect(() => {
        generateRandomColor();
    }, []);

    /* */

    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [birthyear, setBirthyear] = useState("");
    const [birthday, setBirthday] = useState("");

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" });
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        setDay(currentDay.toString());
        setMonth(currentMonth);
        setBirthyear(currentYear.toString());
        setBirthday(`${currentDay} ${currentMonth} ${currentYear}`);
    }, []);



    /* Birthday set */


    useEffect(() => {
        setDay("");
    }, []);


    const handleDayChange = (value) => {
        console.log("Day is: ", value);
        setDay(value);
    };

    useEffect(() => {
        setMonth("");
    }, []);


    const handleMonthChange = (value) => {
        console.log("Month is: ", value);
        setMonth(value);
    };

    useEffect(() => {
        setBirthyear("");
    }, []);

    const handleYearChange = (value) => {
        console.log("Year is: ", value);
        setBirthyear(value);
    };



    console.log("data", birthday);

    /* */

    const onCancel = ()=>{
        cancelModal();
    }

    /* */

    const [confirmationError, setConfirmationError] = useState(null);


    // Function to handle confirmation button click
    const handleConfirm = async () => {
        try {

            const loanId = getRandomAlphanumericId(20);


            // Check if a user and a book are selected
            if (!selectedFriend || !selectedBook) {
                setConfirmationError("Please select a user and a book.");
                return;
            }

            let friendInfo;
            if (selectedFriend === 'Guest') {
                friendInfo = 'Guest';
            } else {
                friendInfo = friendDetails.find((friend) => friend.id === selectedFriend);
            }

            // Check if there is a document in the loans collection with the current user id
            const userId = auth.currentUser ? auth.currentUser.uid : null;
            if (!userId) {
                setConfirmationError("User ID is null or undefined.");
                return;
            }

            const loansCollectionRef = collection(fireBaseDB, "loans");
            const userLoanDocRef = doc(loansCollectionRef, userId);
            const userLoanDocSnapshot = await getDoc(userLoanDocRef);

            // Get the current timestamp
            const timestamp = new Date();

            let newLoanDetails = {};

            if (userLoanDocSnapshot.exists()) {
                // If the document exists, get the existing loan details
                const existingLoanDetails = userLoanDocSnapshot.data().loanDetails || {};

                // Find the next available index for the new loan
                const newIndex = Object.keys(existingLoanDetails).length;


                const selectedBookObject = userLibrary?.Read?.books[selectedBook];
                console.log(selectedBookObject);


                // Add the new loan details to the existing ones
                newLoanDetails = {
                    ...existingLoanDetails,
                    [newIndex]: {
                        friendInfo: friendInfo,
                        bookInfo: selectedBookObject,
                        loanDate: birthday, // Adjust this based on where the loan date is stored
                        operationDate: timestamp,
                        loanId: loanId,
                    },
                };

                // Update the document with the new loan details
                await updateDoc(userLoanDocRef, {
                    loanDetails: newLoanDetails,
                });
            } else {
                // If the document does not exist, create it with the new loan details

                const selectedBookObject = userLibrary?.Read?.books[selectedBook];

                console.log(selectedBookObject);

                newLoanDetails = {
                    0: {
                        friendInfo: friendInfo,
                        bookInfo: selectedBookObject,
                        loanDate: birthday, // Adjust this based on where the loan date is stored
                        operationDate: timestamp,
                        loanId: loanId,
                    },
                };

                await setDoc(userLoanDocRef, {
                    loanDetails: newLoanDetails,
                });
            }

            // Clear any previous confirmation errors
            setConfirmationError(null);

            // Add any additional logic or state updates after a successful confirmation here

            // Close the modal or perform any other necessary actions
            cancelModal();
        } catch (error) {
            console.error("Error handling confirmation:", error);
            setConfirmationError("An error occurred while processing the confirmation.");
        }
    };


    return(
        <>
            <Modal show={show} onHide={onCancel} centered>
                <ModalBody>
            <div className="col-12 mx-auto">
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
                    <div className="form-group text-start">
                        <label htmlFor="loan" style={{ marginTop: "1rem",marginBottom: "0.5rem", display: "block", fontSize:"0.9rem",fontWeight:"600"  }}>
                            Loan started
                        </label>
                        <div className="col-12">
                            <select
                                style={{ marginRight: "1rem" }}
                                className="billyInput rounded col-3"
                                id="day"
                                value={day}
                                onChange={(event) => handleDayChange(event.target.value)}
                            >
                                <option value={currentDay}>{currentDay}</option>
                                {Array.from({ length: 31 }, (_, index) => index + 1).map((dayNumber) => (
                                    <option key={dayNumber} value={dayNumber}>
                                        {dayNumber}
                                    </option>
                                ))}
                            </select>
                            <select
                                style={{ marginRight: "1rem", paddingLeft: "0.5rem" }}
                                className="billyInput rounded col-3"
                                id="month"
                                value={month}
                                onChange={(event) => handleMonthChange(event.target.value)}
                            >
                                <option value={currentMonth}>{currentMonth}</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                            <select
                                style={{ paddingLeft: "1rem" }}
                                className="billyInput rounded col-4"
                                id="year"
                                value={birthyear}
                                onChange={(event) => handleYearChange(event.target.value)}
                            >
                                <option value={currentYear}>{currentYear}</option>
                                {Array.from({ length: 101 }, (_, index) => currentYear - index).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
                <div className="text-start">
                    <div style={{ marginTop: "1rem", marginBottom: "0.5rem", display: "block", fontSize: "0.9rem", fontWeight: "600" }}>
                        Loan Data
                    </div>
                    <div className="row align-items-center" style={{marginBottom:"1rem"}}>
                        <div className="col-6">
                            {selectedFriend ? (
                                <>
                                    {selectedFriend === 'Guest' ? (
                                        <>
                                            <span
                                                className="titleFont"
                                                style={{
                                                    fontSize: '2rem',
                                                    width: '6rem',
                                                    height: '6rem',
                                                    borderRadius: '50%',
                                                    backgroundColor: `${randomBackgroundColor}`,
                                                    color: `${randomColor}`,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                    GS
                </span>
                                            <div className="billyGreyText text-center" style={{ fontSize: '0.8rem', fontWeight: '600', marginTop: '1rem' }}>
                                                Guest
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {friendDetails.map((friend) => (
                                                <div key={friend.id}>
                                                    {friend.id === selectedFriend ? (
                                                        <>
                                                            {friend.avatar !== null ? (
                                                                <>
                                                                    <img
                                                                        src={friend.avatar}
                                                                        alt={`${friend.name} ${friend.surname}`}
                                                                        style={{ width: 'auto', height: '6rem', objectFit: 'cover', borderRadius: '100%' }}
                                                                    />
                                                                    <div className="billyGreyText" style={{ fontSize: '0.8rem', fontWeight: '600', marginTop: '1rem' }}>
                                                                        {friend.name} {friend.surname}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                            <span
                                                className="titleFont"
                                                style={{
                                                    fontSize: '2rem',
                                                    width: '6rem',
                                                    height: '6rem',
                                                    borderRadius: '50%',
                                                    backgroundColor: `${randomBackgroundColor}`,
                                                    color: `${randomColor}`,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {friend.name ? friend.name.charAt(0).toUpperCase() : 'GS'}
                                                {friend.surname ? friend.surname.charAt(0).toUpperCase() : 'T'}
                                            </span>
                                                                    <div className="billyGreyText" style={{ fontSize: '0.8rem', fontWeight: '600', marginTop: '1rem' }}>
                                                                        {friend.name} {friend.surname}
                                                                    </div>
                                                                </>
                                                            )}
                                                            {/* ... Your existing friend code ... */}
                                                        </>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </>
                            ) : (
                                <><div style={{ fontSize: "0.9rem", color: "#FF0000" }}>User not selected</div></>
                            )}
                        </div>


                        <div className="col-6">
                            {selectedBook ? (
                                <>
                                    <img
                                        src={userLibrary?.Read?.books[selectedBook]?.cover}
                                        alt={userLibrary?.Read?.books[selectedBook]?.title}
                                        style={{ maxWidth: "100%", maxHeight: "150px", marginBottom: "1rem", border: "0.05rem solid #D4D4D4" }}
                                    />
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: "0.9rem", color: "#FF0000" }}>Book not selected</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
                    <div className="d-flex justify-content-between">
                        <button
                            className="rounded-pill billySecondaryButton col-4"
                            style={{ fontSize: '0.8rem' }}
                            onClick={handleConfirm}
                        >
                            Confirm
                        </button>
                        <button
                            className="rounded-pill billyCancelButton col-4"
                            style={{ fontSize: '0.8rem' }}
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}