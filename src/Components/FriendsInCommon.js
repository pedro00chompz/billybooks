import {collection, doc, getDoc} from "firebase/firestore";
import {fireBaseDB} from "../FirebaseConfig/FirebaseConfig";
import {useEffect, useState} from "react";

export default function FriendsInCommon(props){

    const {user,friend,handleFriendClick,previousComponent} = props;
    const userId = user?.userId;
    const friendId = friend?.userId;
    const friendsCollectionRef = collection(fireBaseDB,"friendsList");
    const [myFriends,setMyFriends] = useState(null);
    const [friendFriends,setFriendFriends] = useState(null);
    const [friendsInCommon,setFriendsInCommon] = useState(null);
    const [friendsInCommonData,setFriendsInCommonData] = useState(null);
    const usersCollectionRef = collection(fireBaseDB, "users");
    const [friendsShow, setFriendsShow] = useState(3);



    console.log(userId);
    console.log(friendId);

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
                        setMyFriends(friendsData.friends);
                    } else {
                        console.log("Friends document does not exist for user:", userId);
                    }
                } else {
                    console.error("User ID is null or undefined.");
                }

                if (friendId){
                    const friendFriendsDocRef = doc(friendsCollectionRef, friendId);
                    const friendFriendsDocSnapshot = await getDoc(friendFriendsDocRef);

                    if (friendFriendsDocSnapshot.exists()) {
                        // Document exists, obtain the friends array or other data
                        const friendFriendsData = friendFriendsDocSnapshot.data();
                        // Set friendsData to state
                        setFriendFriends(friendFriendsData.friends);
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
    }, [friendId]);

    useEffect(() => {
        // Check if both myFriends and friendFriends are not null
        if (myFriends && friendFriends) {
            // Find common friends
            const commonFriends = myFriends.filter(friendId => friendFriends.includes(friendId));
            setFriendsInCommon(commonFriends);
        }
    }, [myFriends, friendFriends]);

    useEffect(() => {
        const fetchFriendsInCommonData = async () => {
            try {
                if (friendsInCommon) {
                    const friendsDataPromises = friendsInCommon.map(async (friendId) => {
                        const userDocRef = doc(usersCollectionRef, friendId);
                        const userDocSnapshot = await getDoc(userDocRef);
                        if (userDocSnapshot.exists()) {
                            return userDocSnapshot.data();
                        } else {
                            console.log("User document does not exist for user:", friendId);
                            return null;
                        }
                    });

                    const friendsDataArray = await Promise.all(friendsDataPromises);
                    setFriendsInCommonData(friendsDataArray);
                }
            } catch (error) {
                console.error("Error fetching user documents:", error);
            }
        };

        fetchFriendsInCommonData();
    }, [myFriends,friendFriends,friendsInCommon,friendId]);

    console.log(myFriends);
    console.log(friendFriends);
    console.log(friendsInCommon);
    console.log(friendsInCommonData);

    /* Get random color combination */
    const { backgroundColor, color } = generateRandomColor();

    return(
        <>
            <div className="row" style={{ marginTop: "1.5rem" }}>
                <h1 className="titleFont col-12 text-start" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Friends in Common</h1>
                {friendsInCommonData && friendsInCommonData.length > 0 ? (
                    friendsInCommonData.slice(0, friendsShow).map((friend, index) => (
                        <div key={friend?.userId} className="col-4" style={{ marginBottom: "1rem" }} onClick={()=>handleFriendClick(friend)}>
                            {friend?.avatar ? (
                                <img src={friend?.avatar} alt={friend?.name} className="img-fluid" style={{ border: "0.05rem solid #D4D4D4",borderRadius:"50%" }} />

                            ):(
                                <span
                                    className="titleFont"
                                    style={{
                                        borderRadius: "50%",
                                        height: "4.5rem",
                                        width: "4.5rem",
                                        display: "inline-flex",
                                        color,
                                        backgroundColor,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize:"1.5rem",
                                    }}
                                >
                                    {friend?.name.charAt(0).toUpperCase()}{friend?.surname.charAt(0).toUpperCase()}
                                </span>
                                )}
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center billyGreyText" style={{fontSize:"0.8rem"}}>No friends in common</div>
                )}

                {friendsInCommonData && friendsInCommonData.length > friendsShow && (
                    <div
                        className="text-center text-decoration-underline"
                        onClick={() => setFriendsShow(friendsShow+ 3)}
                        style={{ fontSize: "0.8rem", color: "#196FFA", cursor: "pointer" }}
                    >
                        See More
                    </div>
                )}
            </div>
        </>
    )
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