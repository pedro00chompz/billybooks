import React, { useState, useEffect } from "react";
import {collection, setDoc,getDoc,getDocs, where, query, getDocs as getAllDocs, doc} from "firebase/firestore";
import {auth, fireBaseDB, useAuth} from "../FirebaseConfig/FirebaseConfig";
import "../myStyles.css"
import {faUserPlus,faUserMinus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import RemoveShelfFromUsersLibrary from "../Components/RemoveShelfFromUsersLibrary";
import {Modal, ModalBody} from "react-bootstrap";
import AddFriendModal from "../Components/AddFriendModal";
import SuggestFriendsToUser from "../Components/SuggestFriendsToUser";


export default function FindFriends(props) {
    const { handleProgress, handleShowAlert, handleComponentSwitch } = props;
    const currentUser = useAuth();
    const usersCollectionRef = collection(fireBaseDB, "users");
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

    const [usersInSameCountry, setUsersInSameCountry] = useState([]);
    const [otherUsersList, setOtherUsersList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const userId = auth.currentUser ? auth.currentUser.uid : null;

            try {
                if (userId) {
                    const userQuery = query(usersCollectionRef, where("userId", "==", userId));
                    const userSnapshot = await getDocs(userQuery);
                    const currentUserData = userSnapshot.docs[0].data();
                    const currentUserCountry = currentUserData.country;

                    const countryQuery = query(usersCollectionRef, where("country", "==", currentUserCountry));
                    const countrySnapshot = await getDocs(countryQuery);

                    // Get user IDs from friendsData
                    const friendUserIds = friendsData ? friendsData.friends : [];

                    // Filter users based on country and exclude friends
                    const usersFromSameCountry = countrySnapshot.docs
                        .map((doc) => doc.data())
                        .filter((user) => user.userId !== userId && !friendUserIds.includes(user.userId));

                    if (usersFromSameCountry.length > 1) {
                        setUsersInSameCountry(usersFromSameCountry);
                    } else {
                        // If no users from the same country, fetch all users
                        const allUsersQuery = query(usersCollectionRef);
                        const allUsersSnapshot = await getAllDocs(allUsersQuery);

                        // Filter all users based on exclusion of friends
                        const allUsersData = allUsersSnapshot.docs
                            .map((doc) => doc.data())
                            .filter((user) => user.userId !== userId && !friendUserIds.includes(user.userId));

                        setOtherUsersList(allUsersData);
                    }
                } else {
                    // Handle the case where userId is null or undefined
                    console.error("User ID is null or undefined.");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchData();
    }, []);

    console.log(otherUsersList);

    /* Handle Progress */
    handleProgress(60);

    /* Get random color combination */
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

        return {
            backgroundColor: colorsArray[randomNumber][0],
            color: colorsArray[randomNumber][1],
        };
    };

    /* */

    const [typeOfIcon, setTypeOfIcon] = useState(faUserPlus);
    const [showAddFriendsModal,setShowFriendsModal] = useState(false);
    const [modalFriend,setModalFriend] = useState(null);

    const cancelAddFriendsModal = () =>{
        setShowFriendsModal(false);
    }


    const addFriendHandler = async () => {
        console.log(modalFriend);
        const userId = auth.currentUser ? auth.currentUser.uid : null;

        try {
            // Reference to the document with userId
            const friendsDocRef = doc(friendsCollectionRef, userId);

            // Check if the document exists
            const friendsDocSnapshot = await getDoc(friendsDocRef);

            if (friendsDocSnapshot.exists()) {
                // Document exists, update the array
                const existingFriendsArray = friendsDocSnapshot.data().friends || [];

                // Check if the friend is not already in the array
                if (!existingFriendsArray.includes(modalFriend.userId)) {
                    const updatedFriendsArray = [...existingFriendsArray, modalFriend.userId];

                    // Update the document with the new array
                    await setDoc(friendsDocRef, { friends: updatedFriendsArray }, { merge: true });
                    console.log("Document updated with new friend array:", updatedFriendsArray);

                    // Remove the friend from the UI state
                    setUsersInSameCountry(prevState => prevState.filter(user => user.userId !== modalFriend.userId));
                    setOtherUsersList(prevState => prevState.filter(user => user.userId !== modalFriend.userId));
                } else {
                    console.log("Friend already exists in the array");
                }
            } else {
                // Document doesn't exist, create a new one with the array
                const newFriendData = {
                    friends: [modalFriend.userId],  // Create an array with the friend's userId
                    // Add other friend-related data as needed
                };

                await setDoc(friendsDocRef, newFriendData);
                console.log("New document created for friend:", newFriendData);

                // Remove the friend from the UI state
                setUsersInSameCountry(prevState => prevState.filter(user => user.userId !== modalFriend.userId));
                setOtherUsersList(prevState => prevState.filter(user => user.userId !== modalFriend.userId));
            }
        } catch (error) {
            console.error("Error checking/creating friend document:", error);
        }
        cancelAddFriendsModal();
    };

    /* */

    const handleNext = () =>{
        handleShowAlert({ isError: false, message: 'Friends Added!' });
        if (handleComponentSwitch) {
            handleComponentSwitch("InitialLoans");
        }
    }

    const handleBack = () =>{
        handleShowAlert({ isError: false, message: 'Library Created!' });
        if (handleComponentSwitch) {
            handleComponentSwitch("FindBooks");
        }
    }

    return (
        <>
            {showAddFriendsModal && (
                <>
                    <AddFriendModal
                        show={showAddFriendsModal}
                        onCancel={cancelAddFriendsModal}
                        onConfirm={addFriendHandler}
                        friend={modalFriend}
                    />
                </>
            )}
            <div className="row align-items-center" style={{ marginTop: "2rem" }}>
                <div className="col-10 mx-auto titleFont" style={{ fontSize: "1.8rem", textAlign: "left" }}>
                    Find your community
                </div>
                <div className="col-10 mx-auto billyGreyText" style={{ fontWeight: "600", textAlign: "left", marginBottom: "2rem" }}>
                    Let's find some people based on your profile! You can add new friends later!
                </div>
                <div className="col-10 mx-auto overflow-y-hidden">
                <SuggestFriendsToUser
                    users={usersInSameCountry.length > 1 ? usersInSameCountry : otherUsersList}
                    generateRandomColor={generateRandomColor}
                    setModalFriend={setModalFriend}
                    setShowFriendsModal={setShowFriendsModal}
                    typeOfIcon={typeOfIcon}
                />
                </div>
                <div className="col-10 mx-auto" style={{marginTop:"2rem"}}>
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


