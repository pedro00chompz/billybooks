import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import ProfileGeneralInfo from "../Components/ProfileGeneralInfo";
import UserIsCurrentlyReading from "../Components/UserIsCurrentlyReading";

export default function MyProfile(props){

    const {userInfo,previousComponent, handleComponentChange, handleBookClick} = props;

    console.log(userInfo);

    /* Format accountCreationDate */
    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return `Member since ${formattedDate}`;
    };

    /* */

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
                                     onClick={()=>handleComponentChange(previousComponent)}
                    />
                </div>
                <div className="col-10">
                    <div className="row titleFont" style={{marginLeft:"2rem",fontSize:"0.8rem"}}>{userInfo.name} {userInfo.surname}
                    </div>
                    <div className="row" style={{marginLeft:"2rem",fontSize:"0.7rem", color:"#6F6F6F"}}>{formatDate(userInfo.accountCreationDate)}</div>
                </div>
            </div>
            <div style={{marginTop:"3rem"}}>
                <ProfileGeneralInfo user={userInfo} handleComponentChange={handleComponentChange}/>
                <div className="col-10" style={{marginLeft:"1.5rem"}}>
                    <UserIsCurrentlyReading user={userInfo} handleBookClick={handleBookClick}/>
                </div>

            </div>
        </>
    )
}