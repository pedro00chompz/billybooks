import {auth, fireBaseDB} from "../FirebaseConfig/FirebaseConfig";
import NavBar from "../Components/NavBar";
import {collection, doc, getDoc} from "firebase/firestore";
import {useEffect,useState} from "react";
import MyShelves from "./MyShelves";
import MyLoans from "./MyLoans";
import Explore from "./Explore";
import BookDetail from "./BookDetail";
import MyFriends from "./MyFriends";
import MyProfile from "./MyProfile";
import FriendProfileDetail from "./FriendProfileDetail";
import EditMyShelves from "./EditMyShelves";


export default function Main(){

    const [userInfo,setUserInfo] = useState(null);
    const [selectedBookId, setSelectedBookId] = useState(null);

    const userId = auth?.currentUser.uid;

    console.log(userId);

    const usersCollectionRef = collection(fireBaseDB, "users");

    useEffect(() => {
        const getUser = async ()=>{
            try {
                if (userId){
                    const usersDocRef = doc(usersCollectionRef,userId);
                    const usersDocSnapshot = await getDoc(usersDocRef);

                    if (usersDocSnapshot.exists()){
                        const user = usersDocSnapshot.data();

                        setUserInfo(user);

                    }
                }
            } catch (error){
                console.error(error);
            }
        }
        getUser();
    }, []);

    // Gerir Componentes

    const [currentComponent, setCurrentComponent] = useState("MyShelves");

    const handleComponentChange = (componentName) => {
        setPreviousComponent(currentComponent);
        console.log("Changing component to:", componentName);
        setCurrentComponent(componentName);
    };

    const [selectedBook,setSelectedBook] = useState("");
    const [previousComponent,setPreviousComponent] = useState(null);

    const handleBookClick = (book) => {
        setSelectedBook(book);
        setPreviousComponent(currentComponent);
        console.log("veio de ", previousComponent);
        setCurrentComponent("BookDetail");
    };

    const [selectedFriend,setSelectedFriend] = useState(null);

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);

        // Dynamically set previousComponent based on the friend's userId
        const friendDetailCode = `FriendProfileDetail${friend.userId}`;

        setPreviousComponent(currentComponent);
        setCurrentComponent(friendDetailCode);
    };

    console.log("amigo selec",selectedFriend);

    return(
        <>
            {/* Small Screens */}
            <div className="d-md-none fixed-sidebar" style={{marginBottom:"4rem"}}>
                <NavBar userInfo={userInfo} handleComponentChange={handleComponentChange} />
            </div>

            {/* Body */}

            <div className="d-md-none fixed-sidebar overflow-x-hidden">
                {currentComponent === "MyShelves" && <MyShelves userInfo={userInfo} handleBookClick={handleBookClick} />}
                {currentComponent === "MyLoans" && <MyLoans handleBookClick={handleBookClick} />}
                {currentComponent === "Explore" && <Explore handleBookClick={handleBookClick}/>}
                {currentComponent === "BookDetail" && <BookDetail selectedBook={selectedBook} setSelectedBook={setSelectedBook} handleComponentChange={handleComponentChange} previousComponent={previousComponent}/>}
                {currentComponent === "MyFriends" && <MyFriends userInfo={userInfo} handleFriendClick={handleFriendClick}/>}
                {currentComponent === "MyProfile" && <MyProfile userInfo={userInfo} handleComponentChange={handleComponentChange} previousComponent={previousComponent} handleBookClick={handleBookClick}/>}
                {currentComponent.startsWith("FriendProfileDetail") && (
                    <FriendProfileDetail
                        userInfo={userInfo}
                        friend={selectedFriend}
                        handleComponentChange={handleComponentChange}
                        previousComponent={previousComponent}
                        handleBookClick={handleBookClick}
                        handleFriendClick={handleFriendClick}
                    />
                )}
                {currentComponent === "EditMyShelves" && <EditMyShelves userInfo={userInfo}/>}
            </div>
        </>
    )
}