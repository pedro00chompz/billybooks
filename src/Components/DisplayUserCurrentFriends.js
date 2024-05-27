import React, {useState,useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserMinus, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import AddFriendModal from "./AddFriendModal";
import RemoveFriendModal from "./RemoveFriendModal";
import {collection, deleteField, doc, getDoc, updateDoc} from "firebase/firestore";
import {fireBaseDB} from "../FirebaseConfig/FirebaseConfig";

export default function DisplayUserCurrentFriends(props) {
    const {friends,userInfo,updateFriends,setUpdateFriends,handleFriendClick} = props;


    const [friendToBeRemoved,setFriendToBeRemoved] = useState(null);
    const [openRemoveFriendModal,setOpenRemoveFriendModal] = useState(false);
    const friendsListCollectionRef = collection(fireBaseDB, "friendsList");

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

    const handleRemoveFriendModal = (friend) => {
        setFriendToBeRemoved(friend);
        setOpenRemoveFriendModal(true);
    };

    const cancelRemoveFriend = () =>{
        setOpenRemoveFriendModal(false);
    }

    /* Remover amigo */

    const handleRemoveFriend = async (friendId) => {
        try {
            if (userInfo) {
                const friendsListDocRef = doc(friendsListCollectionRef, userInfo.userId);

                // Fetch the current document snapshot
                const friendsListDocSnapshot = await getDoc(friendsListDocRef);

                if (friendsListDocSnapshot.exists()) {
                    // Get the current data
                    const friendsListData = friendsListDocSnapshot.data();

                    // Find the index of friendId in the friends array
                    const friendIndex = friendsListData.friends.indexOf(friendId);

                    if (friendIndex !== -1) {
                        // Remove the friendId from the array
                        friendsListData.friends.splice(friendIndex, 1);

                        // Update the document with the modified data
                        await updateDoc(friendsListDocRef, {
                            friends: friendsListData.friends,
                        });

                        console.log("Friend removed successfully.");
                    } else {
                        console.log("Friend not found in the array.");
                    }
                } else {
                    console.log("Document does not exist for the current user.");
                }
            } else {
                console.log("No current user.");
            }
            setOpenRemoveFriendModal(false);
            setUpdateFriends(true);
        } catch (error) {
            console.error("Error removing friend:", error);
        }
    };

    return (
        <>
            {openRemoveFriendModal && (
                <>
                    <RemoveFriendModal
                        openRemoveFriendModal={openRemoveFriendModal}
                        cancelRemoveFriend={cancelRemoveFriend}
                        friend={friendToBeRemoved}
                        handleRemoveFriend={handleRemoveFriend}
                    />
                </>
            )}
            <div>
                {friends?.map((friend) => {
                    const { backgroundColor, color } = generateRandomColor();
                    console.log(friend); // Check the entire friend object
                    console.log(friend?.data); // Check the data property
                    console.log(friend?.data.name); // Check the name property

                    const firstNameInitial = friend?.data.name ? friend.data.name.charAt(0).toUpperCase() : '';
                    const surnameInitial = friend?.data.surname ? friend.data.surname.charAt(0).toUpperCase() : '';

                    return (
                        <div className="row" key={friend.id} style={{ marginBottom: "1rem" }}>
                            <div className="col-4" onClick={() => handleFriendClick(friend?.data)}>
                                {friend.data.avatar ? (
                                    <img src={friend.data.avatar} className="img-fluid" style={{ borderRadius: "50%", height: "3rem", width: "3rem", display: "inline-block" }} />
                                ) : (
                                    <span
                                        className="titleFont"
                                        style={{
                                            borderRadius: "50%",
                                            height: "3rem",
                                            width: "3rem",
                                            display: "inline-flex",  // Use inline-flex for inline display with flex properties
                                            color,
                                            backgroundColor,
                                            alignItems: "center",  // Center vertically
                                            justifyContent: "center",  // Center horizontally
                                        }}
                                    >
                                {firstNameInitial}
                                        {surnameInitial}
                            </span>
                                )}
                            </div>
                            <div className="col-6 ps-0 pe-0" onClick={() => handleFriendClick(friend?.data)}>
                                <div className="row" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                                    {friend.data.name} {friend.data.surname}
                                </div>
                                <div className="row billyGreyText" style={{ fontSize: "0.8rem", fontWeight: "400" }}>
                                    {formatDate(friend.data.accountCreationDate)}
                                </div>
                            </div>
                            <div className="col-2 ps-0 text-start d-flex">
                                <FontAwesomeIcon icon={faUserMinus}
                                                 style={{ height: "1rem", width: "auto", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#EA242E" }}
                                                 onClick={() => handleRemoveFriendModal(friend.data)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </>

    );
}
