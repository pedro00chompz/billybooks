import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserGroup, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import DisplayUserCurrentFriends from "../Components/DisplayUserCurrentFriends";
import SearchAndAddFriends from "../Components/SearchAndAddFriends";
import {collection, doc, getDoc} from "firebase/firestore";
import {auth, fireBaseDB} from "../FirebaseConfig/FirebaseConfig";

export default function MyFriends(props){

    const {userInfo,handleFriendClick} = props;
    const userId = userInfo?.userId;
    const [showAddFriends,setShowFriends] = useState(false);
    const usersCollectionRef = collection(fireBaseDB, "users");
    const friendsCollectionRef = collection(fireBaseDB,"friendsList");
    const [friendsList, setFriendsList] = useState(null);
    const [friendsData,setFriendsData] = useState(null);
    const [updateFriends, setUpdateFriends] = useState(false);

    // Trocar sub-componentes - ver amigos ou adicionar amigos

    const handleAddFriendsClick = ()=>{
        setShowFriends(!showAddFriends)
        console.log(showAddFriends);
    }

    // procurar lista de amigos e info dos amigos

    useEffect(() => {
        const fetchFriendsList = async () => {

            try {
                if (userId) {
                    const friendsDocRef = doc(friendsCollectionRef, userId);
                    const friendsDocSnapshot = await getDoc(friendsDocRef);

                    if (friendsDocSnapshot.exists()) {
                        // Document exists, obtain the friends array or other data
                        const friendsData = friendsDocSnapshot.data();
                        // Set friendsData to state
                        setFriendsList(friendsData);
                    } else {
                        console.log("Friends document does not exist for user:", userId);
                    }
                } else {
                    console.error("User ID is null or undefined.");
                }
                setUpdateFriends(false);
            } catch (error) {
                console.error("Error fetching friends document:", error);
            }
        };

        fetchFriendsList();
    }, [updateFriends]);

    console.log(friendsList);
    //

    useEffect(() => {
        const getFriendsData = async () => {
            try {
                if (friendsList && friendsList.friends && friendsList.friends.length > 0) {
                    const friendPromises = friendsList.friends.map(async (friendId) => {
                        const userDocRef = doc(usersCollectionRef, friendId);
                        const userDocSnapshot = await getDoc(userDocRef);

                        if (userDocSnapshot.exists()) {
                            // Return an object with friend's ID and user data
                            return { id: friendId, data: userDocSnapshot.data() };
                        } else {
                            console.log("User document does not exist for friend ID:", friendId);
                            return null;
                        }
                    });

                    // Wait for all promises to resolve
                    const friendsDataArray = await Promise.all(friendPromises);

                    // Set friendsData to state
                    setFriendsData(friendsDataArray.filter(Boolean));
                } else {
                    console.log("Friends list is empty or undefined.");
                }
            } catch (error) {
                console.error("Error fetching friends data:", error);
            }
        };

        getFriendsData();
    }, [friendsList]);

    //

    return(
        <>
            <div
                className="col-sm col-12 d-md-none d-flex align-items-center position-fixed"
                style={{
                    top: "3rem",
                    left: 0,
                    right: 0,
                    zIndex: 900,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderBottom: "0.08rem solid #d4d4d4",
                    height: "3rem",
                    padding: "0 1rem",
                    backdropFilter: "blur(5px)",
                }}
            >
                <div className="col-10">
                    {showAddFriends ? (
                        <div className="row titleFont text-start" style={{marginLeft:"0.05rem",fontSize:"0.8rem"}}>Add Friends
                        </div>
                    ) : (
                        <div className="row titleFont text-start" style={{marginLeft:"0.05rem",fontSize:"0.8rem"}}>My Friends
                        </div>
                    )}
                </div>
                <div className="col-2 text-end">
                    {showAddFriends ? (
                        <FontAwesomeIcon icon={faUserGroup}
                                         style={{ height: "1.2rem", width: "auto" }}
                                         onClick={handleAddFriendsClick}
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUserPlus}
                                         style={{ height: "1.2rem", width: "auto" }}
                                         onClick={handleAddFriendsClick}
                        />
                    )}
                </div>
            </div>
            <div style={{marginTop:"4rem"}}>
            {showAddFriends ? (
                <SearchAndAddFriends
                    friends={friendsData}
                    userInfo={userInfo}
                    updateFriends={updateFriends}
                    setUpdateFriends={setUpdateFriends}
                    handleFriendClick={handleFriendClick}
                />
            ) : (
                <DisplayUserCurrentFriends
                    friends={friendsData}
                    userInfo={userInfo}
                    updateFriends={updateFriends}
                    setUpdateFriends={setUpdateFriends}
                    handleFriendClick={handleFriendClick}
                />
            )}
            </div>
        </>
    )
}