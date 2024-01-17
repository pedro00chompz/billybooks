import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useState} from "react";
import AddFriendModal from "./AddFriendModal";
import {collection, doc, getDoc,setDoc} from "firebase/firestore";
import {fireBaseDB} from "../FirebaseConfig/FirebaseConfig";


export default function FriendsSuggestions(props){

    const {suggestions,userInfo,friends,updateFriends,setUpdateFriends,handleFriendClick} = props;

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


    return(
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
                {suggestions?.slice(0, displayCount).map((friend) => {
                    const { backgroundColor, color } = generateRandomColor();
                    return(

                        <div className="row" key={friend.id} style={{marginBottom:"1rem"}}>
                            <div className="col-4" onClick={()=>handleFriendClick(friend.data)}>
                                {friend.data.avatar ? (
                                    <img src={friend.data.avatar} className="img-fluid" style={{borderRadius:"50%",height:"3rem",width:"3rem", display: "inline-block"}}/>
                                ): (
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
                                        {friend.data.name.charAt(0).toUpperCase()}
                                        {friend.data.surname.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="col-6 ps-0 pe-0" onClick={()=>handleFriendClick(friend.data)}>
                                <div className="row" style={{fontSize:"0.8rem",fontWeight:"600"}}>
                                    {friend.data.name} {friend.data.surname}
                                </div>
                                <div className="row billyGreyText" style={{fontSize:"0.8rem",fontWeight:"400"}}>
                                    {formatDate(friend.data.accountCreationDate)}
                                </div>
                            </div>
                            <div className="col-2 ps-0 text-start d-flex">
                                <FontAwesomeIcon icon={faUserPlus}
                                                 style={{ height: "1rem", width: "auto",display: "inline-flex",alignItems: "center",justifyContent: "center",color:"#196FFA"}}
                                                 onClick={() => {
                                                     setModalFriend(friend.data);
                                                     setShowFriendsModal(true);
                                                 }}


                                />
                            </div>
                        </div>
                    )
                })}
            </div>
            {displayCount < suggestions?.length && (
                <div className="row mt-2" style={{ cursor: "pointer" }} onClick={handleShowMore}>
                    <span style={{ color: "#196FFA", fontWeight: "600", fontSize:"0.8rem" }} className="text-decoration-underline">
                        Show more
                    </span>
                </div>
            )}
        </>
    );
}

