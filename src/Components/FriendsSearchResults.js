// Function to calculate Levenshtein distance between two strings
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import AddFriendModal from "./AddFriendModal";
import {collection, doc, getDoc, setDoc} from "firebase/firestore";
import {fireBaseDB} from "../FirebaseConfig/FirebaseConfig";

function levenshteinDistance(a, b) {
    // Handle cases where a or b is null or undefined
    const aLength = a?.length || 0;
    const bLength = b?.length || 0;

    // Create a 2D array to store the distances
    const dp = Array.from({ length: aLength + 1 }, () => Array(bLength + 1).fill(0));

    for (let i = 0; i <= aLength; i++) {
        for (let j = 0; j <= bLength; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else {
                const cost = a[i - 1] !== b[j - 1] ? 1 : 0;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost
                );
            }
        }
    }

    return dp[aLength][bLength];
}

export default function FriendsSearchResults(props) {
    const { searchTerm, allUsers,updateFriends,setUpdateFriends,userInfo,handleFriendClick} = props;

    // Convert searchTerm to lowercase for case-insensitive comparison
    const searchTermLower = searchTerm.toLowerCase();

    // Filter users using Levenshtein distance
    const filteredUsers = allUsers?.filter((user) => {
        const nameLower = user?.data?.name?.toLowerCase();
        const surnameLower = user?.data?.surname?.toLowerCase();

        // Set a threshold for Levenshtein distance (adjust as needed)
        const distanceThreshold = 3;

        // Check if the distance between search term and name/surname is below the threshold
        return (
            levenshteinDistance(searchTermLower, nameLower) <= distanceThreshold ||
            levenshteinDistance(searchTermLower, surnameLower) <= distanceThreshold
        );
    });

    console.log(searchTerm);
    console.log(filteredUsers);

    const [displayCount, setDisplayCount] = useState(4);

    const handleShowMore = () => {
        setDisplayCount((prevCount) => prevCount + 4);
    };

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

    /* Format accountCreationDate */
    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return `Member since ${formattedDate}`;
    };

    /* */

    const [showAddFriendsModal,setShowFriendsModal] = useState(false);
    const [modalFriend,setModalFriend] = useState(null);

    const cancelAddFriendsModal = () =>{
        setShowFriendsModal(false);
    }

    const friendsListCollectionRef = collection(fireBaseDB, "friendsList");


    const addFriendHandler = async () => {
        try {
            if (userInfo?.userId && modalFriend?.userId) {
                const friendsListDocRef = doc(friendsListCollectionRef, userInfo.userId);
                const friendsListDocSnapshot = await getDoc(friendsListDocRef);

                if (friendsListDocSnapshot.exists()) {
                    const friendsListData = friendsListDocSnapshot.data();
                    const friendsListCopy = { ...friendsListData };

                    // Clone the friends array to avoid modifying the original
                    const updatedFriendsArray = [...friendsListCopy.friends, modalFriend.userId];

                    // Update the friends array in the copy
                    friendsListCopy.friends = updatedFriendsArray;

                    // Update the Firestore document with the modified copy
                    await setDoc(friendsListDocRef, friendsListCopy);

                    console.log("Friend added successfully!");
                    setUpdateFriends(true);
                }
            } else {
                console.log("No current user or modal friend");
            }
        } catch (error) {
            console.error("Error adding friend:", error);
        }

        // Make sure to call this function after the asynchronous operations are complete
        cancelAddFriendsModal();
    };

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
            <div>
                {filteredUsers?.slice(0, displayCount).map((friend) => {
                    const { backgroundColor, color } = generateRandomColor();
                    return (
                        <div className="row" key={friend?.id} style={{ marginBottom: "1rem" }}>
                            <div className="col-4" onClick={()=>handleFriendClick(friend?.data)}>
                                {friend?.data.avatar ? (
                                    <img
                                        src={friend?.data.avatar}
                                        className="img-fluid"
                                        style={{ borderRadius: "50%", height: "3rem", width: "3rem", display: "inline-block" }}
                                    />
                                ) : (
                                    <span
                                        className="titleFont"
                                        style={{
                                            borderRadius: "50%",
                                            height: "3rem",
                                            width: "3rem",
                                            display: "inline-flex",
                                            color,
                                            backgroundColor,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {friend?.data.name?.charAt(0)?.toUpperCase()}
                                        {friend?.data.surname?.charAt(0)?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="col-6 ps-0 pe-0" onClick={()=>handleFriendClick(friend?.data)}>
                                <div className="row" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                                    {friend?.data.name} {friend?.data.surname}
                                </div>
                                <div className="row billyGreyText" style={{ fontSize: "0.8rem", fontWeight: "400" }}>
                                    {formatDate(friend?.data.accountCreationDate)}
                                </div>
                            </div>
                            <div className="col-2 ps-0 text-start d-flex">
                                <FontAwesomeIcon
                                    icon={faUserPlus}
                                    style={{
                                        height: "1rem",
                                        width: "auto",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#196FFA",
                                    }}
                                    onClick={() => {
                                        setModalFriend(friend?.data);
                                        setShowFriendsModal(true);
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {displayCount < filteredUsers?.length && (
                <div className="row mt-2" style={{ cursor: "pointer" }} onClick={handleShowMore}>
                    <span style={{ color: "#196FFA", fontWeight: "600", fontSize: "0.8rem" }} className="text-decoration-underline">
                        Show more
                    </span>
                </div>
            )}
        </>
    );
}
