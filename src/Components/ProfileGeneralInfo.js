import React, { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import {fireBaseDB, useAuth} from "../FirebaseConfig/FirebaseConfig";

export default function ProfileGeneralInfo(props) {
    const { user,handleComponentChange,showFriendShelves,setShowFriendShelves } = props;

    /* Get random color combination */
    const { backgroundColor, color } = generateRandomColor();

    /* buscar livros do user */

    const userId = user?.userId;
    const librariesCollectionRef = collection(fireBaseDB, "libraries");
    const friendsListCollectionRef = collection(fireBaseDB, "friendsList");
    const [userShelves, setUserShelves] = useState(null);
    const [userFriends,setUserFriends] = useState(null);
    const [uniqueBookCount, setUniqueBookCount] = useState(0);
    const [shelfCount, setShelfCount] = useState(0);
    const [friendsCount,setFriendsCount] = useState(0);
    const currentUser = useAuth();
    console.log("user atual",currentUser?.uid);
    console.log("amigo atual",userId);


    useEffect(() => {
        const getUserLibrary = async () => {
            try {
                if (userId) {
                    const libraryDocRef = doc(librariesCollectionRef, userId);
                    const libraryDocSnapshot = await getDoc(libraryDocRef);

                    if (libraryDocSnapshot.exists()) {
                        const userLibrary = libraryDocSnapshot.data();
                        setUserShelves(userLibrary);

                        // Collect unique book IDs
                        const uniqueBookIds = new Set();

                        // Count the shelves and exclude the one with key 'id'
                        let count = 0;
                        Object.entries(userLibrary).forEach(([key, shelf]) => {
                            if (key !== 'id') {
                                count++;
                                if (shelf.books) {
                                    Object.keys(shelf.books).forEach((bookId) => {
                                        uniqueBookIds.add(bookId);
                                    });
                                }
                            }
                        });

                        // Update the state with the count of unique book IDs and shelves
                        setUniqueBookCount(uniqueBookIds.size);
                        setShelfCount(count);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        getUserLibrary();
    }, [userId]);

    console.log(userShelves);

    useEffect(() => {
        const getFriendsList = async () => {
            try {
                if (userId) {
                    const friendsListDocRef = doc(friendsListCollectionRef, userId);
                    const friendsListDocSnapshot = await getDoc(friendsListDocRef);

                    if (friendsListDocSnapshot.exists()) {
                        const friendsList = friendsListDocSnapshot.data();
                        setUserFriends(friendsList);
                        console.log(friendsList.friends.length);
                        setFriendsCount(friendsList.friends.length);
}
                }
            } catch (error) {
                console.error(error);
            }
        };
        getFriendsList();
    }, [userId]);

    const handleBooksClick = () =>{
        if (currentUser?.uid === userId){
            handleComponentChange("MyShelves");
        } else {
            setShowFriendShelves(true);
        }
    }

    const handleShelfClick = () =>{
        if (currentUser?.uid === userId){
            handleComponentChange("EditMyShelves");
        } else {
            setShowFriendShelves(true);
        }
    }

    const handleFriendsClick = () =>{
        if(currentUser?.uid === userId){
            handleComponentChange("MyFriends");
        }
    }


    return (
        <>
            <div className="row d-flex align-items-center" style={{marginLeft:"1rem"}}>
                <div className="col-3 p-0">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            className="img-fluid"
                            style={{ borderRadius: "50%", height: "5rem", width: "5rem", display: "inline-block" }}
                        />
                    ) : (
                        <span
                            className="titleFont"
                            style={{
                                borderRadius: "50%",
                                height: "5rem",
                                width: "5rem",
                                display: "inline-flex",
                                color,
                                backgroundColor,
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize:"1.5rem",
                            }}
                        >
                    {user?.name?.charAt(0).toUpperCase()}
                            {user?.surname?.charAt(0).toUpperCase()}
                </span>
                    )}
                </div>
                <div className="col-8 text-center p-3">
                    <div className="row">
                        <div className="col-4">
                            <div className="row" style={{ fontWeight: "600" }} onClick={handleBooksClick}>
                                <div className="col">
                                    {uniqueBookCount}
                                </div>
                            </div>
                            <div className="row billyGreyText" style={{ fontSize: "0.8rem" }}>
                                <div className="col">
                                    Books
                                </div>
                            </div>
                        </div>
                        <div className="col-4" onClick={handleShelfClick}>
                            <div className="row" style={{ fontWeight: "600" }}>
                                <div className="col">
                                    {shelfCount}
                                </div>
                            </div>
                            <div className="row billyGreyText" style={{ fontSize: "0.8rem" }}>
                                <div className="col">
                                    Shelves
                                </div>
                            </div>
                        </div>
                        <div className="col-4" onClick={handleFriendsClick}>
                            <div className="row" style={{ fontWeight: "600" }}>
                                <div className="col">
                                    {friendsCount}
                                </div>
                            </div>
                            <div className="row billyGreyText" style={{ fontSize: "0.8rem" }}>
                                <div className="col">
                                    Friends
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

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



