import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import ProfileGeneralInfo from "../Components/ProfileGeneralInfo";
import UserIsCurrentlyReading from "../Components/UserIsCurrentlyReading";
import FriendsInCommon from "../Components/FriendsInCommon";
import DisplayFriendsShelves from "../Components/DisplayFriendsShelves";

export default function FriendProfileDetail(props){

    const {friend, handleComponentChange, previousComponent, handleBookClick, userInfo, handleFriendClick} = props;
    const [showFriendShelves,setShowFriendShelves] = useState(false);

    console.log(friend);


    /* Format accountCreationDate */
    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return `Member since ${formattedDate}`;
    };

    /* */


    const handleBack = () =>{
        if (showFriendShelves === false){
            handleComponentChange(previousComponent);
        } else {
            setShowFriendShelves(false);
        }
    }
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
                <div className="col-1">
                    <FontAwesomeIcon icon={faAngleLeft}
                                     style={{ height: "1.2rem", width: "auto" }}
                                     onClick={handleBack}
                    />
                </div>
                <div className="col-10">
                    <div className="row titleFont" style={{marginLeft:"2rem",fontSize:"0.8rem"}}>{friend.name} {friend.surname}
                    </div>
                    <div className="row" style={{marginLeft:"2rem",fontSize:"0.7rem", color:"#6F6F6F"}}>{formatDate(friend.accountCreationDate)}</div>
                </div>
            </div>
            {showFriendShelves ? (
                <div style={{marginTop:"3rem"}}>
                    <DisplayFriendsShelves friend={friend} handleBookClick={handleBookClick}/>
                </div>
            ) : (
                <div style={{marginTop:"3rem"}}>
                    <ProfileGeneralInfo user={friend} showFriendShelves={showFriendShelves} setShowFriendShelves={setShowFriendShelves}/>
                    <div className="col-10" style={{marginLeft:"1.5rem"}}>
                        <UserIsCurrentlyReading user={friend} handleBookClick={handleBookClick}/>
                    </div>
                    <div className="col-10" style={{marginLeft:"1.5rem"}}>
                        <FriendsInCommon user={userInfo} friend={friend} handleFriendClick={handleFriendClick} previousComponent={previousComponent}/>
                    </div>
                </div>
            )}
        </>
    )
}