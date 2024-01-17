import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import {
    faBars,
    faBook,
    faDoorOpen,
    faHandshake,
    faMagnifyingGlass,
    faUserGroup
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import {auth} from "../FirebaseConfig/FirebaseConfig";

export default function NavBar(props) {
    const { userInfo, handleComponentChange } = props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuColor, setMenuColor] = useState("#262626");

    const navigate = useNavigate();


    useEffect(() => {
        // Update color based on menuOpen state
        setMenuColor(menuOpen ? "#196FFA" : "#262626");
    }, [menuOpen]);



    console.log(userInfo);

    /* avatar */

    const renderAvatar = () => {
        if (userInfo?.avatar) {
            // If the user has an avatar, render the avatar
            return (
                <div
                    className="avatar"
                    style={{
                        height: "1.5rem",
                        width: "1.5rem",
                        borderRadius: "50%",
                        overflow: "hidden",
                    }}
                    onClick={()=>handleOptionClick("MyProfile")}
                >
                    <img
                        src={userInfo?.avatar}
                        alt={`${userInfo?.name}'s Avatar`}
                        className="img-fluid"
                        style={{ height: "120%", width: "120%", objectFit: "cover" }}
                    />
                </div>
            );
        } else {
            // If the user doesn't have an avatar, render the default rounded div
            return (
                <div
                    className="titleFont"
                    style={{
                        color: "#196FFA",
                        backgroundColor: "#D1E2FE",
                        borderRadius: "50%",
                        height: "1.5rem",
                        width: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6rem",
                    }}
                    onClick={()=>handleOptionClick("MyProfile")}
                >
                    {userInfo?.name.charAt(0).toUpperCase()}{userInfo?.surname.charAt(0).toUpperCase()}
                </div>
            );
        }
    };

    const handleLogOut = async () =>{
        try {
            await auth.signOut();
            navigate("/");
            // After signing out, you may want to navigate to the sign-in page or perform other actions
            console.log('User signed out successfully');
            // Add any additional logic you need after sign out
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    }

    /* Options */

        const handleOptionClick = (option) => {
        console.log('Option clicked:', option);

        switch (option) {
            case "My Shelves":
                handleComponentChange("MyShelves");
                break;
            case "My Loans":
                handleComponentChange("MyLoans");
                break;
            case "Explore":
                handleComponentChange("Explore");
                break;
            case "MyFriends":
                handleComponentChange("MyFriends");
                break;
            case "MyProfile":
                handleComponentChange("MyProfile");
                break;
            default:
                break;
        }
    };



    return (
        <>
            {/* Small Screens */}
            <div
                className="col-sm-12 d-md-none d-flex align-items-center justify-content-between position-fixed"
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderBottom: "0.08rem solid #d4d4d4",
                    height: "3rem",
                    padding: "0 1rem",
                    backdropFilter: "blur(5px)",
                }}
            >

                <FontAwesomeIcon icon={faBars}
                                 color={menuColor}
                                 style={{ height: "1.2rem", width: "auto" }}
                                 onClick={() => setMenuOpen(!menuOpen)}

                />
                <div className="col-2 text-center mx-auto">
                    <img
                        src={process.env.PUBLIC_URL + '/myImgs/smallLogo.png'}
                        alt="Billy Books Logo"
                        className="img-fluid"
                        style={{ height: "1.5rem", width: "auto" }}
                        onClick={()=>handleOptionClick("My Shelves")}

                    />
                </div>
                {renderAvatar()}
            </div>
            {menuOpen && (
                <>
                    <div
                        className="col-sm-12 d-md-none px-0 position-fixed text-start"
                        style={{
                            top: "3rem",
                            left: 0,
                            right: 0,
                            zIndex: 999,
                            color: "black",
                            fontWeight: "400",
                            fontSize:"0.8rem"
                    }}
                    >
                        {/* Options for the menu */}
                        <div className="col-sm-12 d-flex align-items-center"
                             style={{ height: "3rem", backgroundColor: "rgba(255, 255, 255, 0.8)", borderBottom: "0.08rem solid #d4d4d4", paddingLeft:"1rem",backdropFilter: "blur(5px)", }}
                             onClick={() => {
                                 handleOptionClick("My Shelves")
                                 setMenuOpen(!menuOpen);
                             }}
                        >
                            <FontAwesomeIcon icon={faBook} style={{fontSize:"1rem", paddingRight:"1rem"}}/> My Shelves
                        </div>
                        <div className="col-sm-12 d-flex align-items-center"
                             style={{ height: "3rem", backgroundColor: "rgba(255, 255, 255, 0.8)", borderBottom: "0.08rem solid #d4d4d4", paddingLeft:"1rem",backdropFilter: "blur(5px)", }}
                             onClick={() => {
                                 handleOptionClick("My Loans")
                                 setMenuOpen(!menuOpen);
                             }}
                        >
                            <FontAwesomeIcon icon={faHandshake} style={{fontSize:"1rem", paddingRight:"1rem"}}/> My Loans
                        </div>
                        <div className="col-sm-12 d-flex align-items-center"
                             style={{ height: "3rem", backgroundColor: "rgba(255, 255, 255, 0.8)", borderBottom: "0.08rem solid #d4d4d4", paddingLeft:"1rem",backdropFilter: "blur(5px)", }}
                             onClick={() => {
                                 handleOptionClick("MyFriends")
                                 setMenuOpen(!menuOpen);
                             }}
                        >
                            <FontAwesomeIcon icon={faUserGroup} style={{fontSize:"1rem", paddingRight:"1rem"}}/> My Friends
                        </div>
                        <div className="col-sm-12 d-flex align-items-center"
                             style={{ height: "3rem", backgroundColor: "rgba(255, 255, 255, 0.8)", borderBottom: "0.08rem solid #d4d4d4", paddingLeft:"1rem",backdropFilter: "blur(5px)", }}
                             onClick={() => {
                                 handleOptionClick("Explore")
                                 setMenuOpen(!menuOpen);
                             }}
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{fontSize:"1rem", paddingRight:"1rem"}}/> Explore
                        </div>
                        <div className="col-sm-12 d-flex align-items-center"
                             style={{ height: "3rem", backgroundColor: "rgba(255, 255, 255, 0.8)", borderBottom: "0.08rem solid #d4d4d4", paddingLeft:"1rem",backdropFilter: "blur(5px)", }}
                             onClick={handleLogOut}
                        >
                            <FontAwesomeIcon icon={faDoorOpen} style={{fontSize:"1rem", paddingRight:"1rem"}}/> Log Out
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
