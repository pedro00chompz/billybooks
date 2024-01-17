import React, {useEffect, useState} from "react";
import FriendsSuggestions from "./FriendsSuggestions";
import FriendsSearchResults from "./FriendsSearchResults";
import {collection, getDocs,query,where} from "firebase/firestore";
import {fireBaseDB} from "../FirebaseConfig/FirebaseConfig";

export default function SearchAndAddFriends(props) {
    const { friends, userInfo, updateFriends, setUpdateFriends,handleFriendClick } = props;

    console.log(friends);

    const [showCancelButton, setShowCancelButton] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions,setShowSuggestions] = useState(true);
    const [suggestions,setSuggestions] = useState(null);



    const handleBlur = () => {
        setTimeout(() => {
            // It seems that the issue might be related to the handleBlur and handleFocus functions.
            // If the input is losing focus before the handleCancel function is triggered, it could explain why
            // the input value is not being cleared.
            //
            // You can try adjusting the handleBlur function to include a delay using setTimeout.
            // This way, the cancel button has a brief moment to be clicked, and the input value can be cleared
            // before losing focus.

            setShowCancelButton(false);
        }, 100); // Add a short delay (e.g., 100 milliseconds)
    };

    const handleFocus = () => {
        setShowCancelButton(true);
        setShowSuggestions(false);
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        console.log(searchTerm);
    };

    const handleCancel = () => {
        setSearchTerm("");
        setShowCancelButton(false);
        setShowSuggestions(true);
    };

    // Sugerir amigos

    const usersCollectionRef = collection(fireBaseDB, "users");

    useEffect(() => {
        const getSuggestionsList = async () => {
            try {
                if (userInfo && userInfo.country) {
                    // Query users collection where the 'country' field is equal to userInfo.country
                    const querySnapshot = await getDocs(
                        query(usersCollectionRef, where("country", "==", userInfo.country))
                    );

                    // Extract the user data from the query snapshot
                    const suggestionsData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data(),
                    }));

                    // Exclude users whose IDs are in the friends array
                    const filteredSuggestions = suggestionsData.filter(
                        (suggestion) => !friends.some((friend) => friend.id === suggestion.id)
                    );

                    // Get at most 10 users from the filtered suggestions
                    const limitedSuggestions = filteredSuggestions.slice(0, 12);

                    // Set the limited suggestions to state
                    setSuggestions(limitedSuggestions);
                }
            } catch (error) {
                console.error("Error fetching suggestions data:", error);
            }
        };

        getSuggestionsList();
    }, [userInfo, friends]); // Trigger the effect when userInfo or friends change


    const [allUsers,setAllUsers]=useState(null);

    useEffect(() => {
        const getSearchResultList = async () => {
            try {
                const querySnapshot = await getDocs(usersCollectionRef);
                const usersData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }));

                const filteredUsers = usersData.filter(
                    (user) => user.id !== userInfo.userId && !friends.some((friend) => friend.id === user.id)
                );

                setAllUsers(filteredUsers);
                setUpdateFriends(false);
            } catch (error) {
                console.error("Error fetching search results data:", error);
            }
        };

        getSearchResultList();
    }, [updateFriends,friends]);



    return (
        <>
            <div className="row" style={{marginBottom:"2rem"}}>
                <label
                    htmlFor="search"
                    style={{
                        marginLeft: "1rem",
                        marginBottom: "0.5rem",
                        display: "block",
                        fontSize: "0.9rem",
                        fontWeight: "600"
                    }}
                    className="col-12 text-start"
                >
                    Search
                </label>
                <div className="col-9">
                    <div className="form-group text-start">
                        <input
                            type="text"
                            className="billyInput rounded d-block w-100"
                            id="search"
                            placeholder="Search users to befriend here"
                            style={{ marginLeft: "1rem" }}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onChange={handleChange}
                            value={searchTerm}
                        />
                    </div>
                </div>
                {showCancelButton && (
                    <div className="col-3 ps-0 d-flex align-items-center">
                        <div
                            className="w-100"
                            style={{ fontSize: "0.9rem", fontWeight: "600", color: "#EA242E" }}
                            onClick={handleCancel}
                        >
                            Cancel
                        </div>
                    </div>
                )}
            </div>
            {showSuggestions ? (
                <>
                    <div className="row titleFont" style={{marginLeft: "1rem",marginBottom:"1rem"}}>
                        Suggestions
                    </div>
                    <FriendsSuggestions
                        suggestions={suggestions}
                        userInfo={userInfo}
                        friends={friends}
                        updateFriends={updateFriends}
                        setUpdateFriends={setUpdateFriends}
                        handleFriendClick={handleFriendClick}
                    />
                </>
            ) : (
                <>
                    <div className="row titleFont" style={{marginLeft: "1rem",marginBottom:"1rem"}}>
                        Search Results
                    </div>
                    <FriendsSearchResults
                        allUsers={allUsers}
                        searchTerm={searchTerm}
                        updateFriends={updateFriends}
                        setUpdateFriends={setUpdateFriends}
                        userInfo={userInfo}
                        handleFriendClick={handleFriendClick}
                    />
                </>
            )}
        </>
    );
}
