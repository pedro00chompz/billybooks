import { auth } from "../FirebaseConfig/FirebaseConfig";
import React, {useState} from "react";
import BasicInfo from "./BasicInfo";
import FindBooks from "./FindBooks";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import CreateShelves from "./CreateShelves";
import FindFriends from "./FindFriends";
import InitialLoans from "./InitialLoans";
import AllSet from "./AllSet";

export default function CreateProfile() {
    const [currentComponent, setCurrentComponent] = useState("BasicInfo");
    const userEmail = auth?.currentUser.email;
    const [value,setValue] = useState(15);

    /* Lidar com erros e mensagens de erro */

    const [showAlert,setShowAlert] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");

    const handleShowAlert = (errorInfo) => {
        console.log(errorInfo);
        console.log("antes: ", showAlert);

        // Use the callback form of setShowAlert to ensure you get the updated state
        setShowAlert((prevShowAlert) => {
            console.log("depois: ", !prevShowAlert);
            return errorInfo.isError;
        });

        setErrorMessage(errorInfo.errorName);

        if (!errorInfo.isError && errorInfo.message === 'Back') {
            setCurrentComponent("BasicInfo");
            setValue(15);
        }

        if (!errorInfo.isError && errorInfo.message === 'User information updated successfully!') {
            setCurrentComponent("CreateShelves");
        }

        if (!errorInfo.isError && errorInfo.message === 'Library Created!') {
            setCurrentComponent("FindBooks");
        }

        if (!errorInfo.isError && errorInfo.message === 'Books Added!') {
            setCurrentComponent("FindFriends");
        }

        if (!errorInfo.isError && errorInfo.message === 'Friends Added!') {
            setCurrentComponent("InitialLoans");
        }

        if (!errorInfo.isError && errorInfo.message === 'Loans Done!') {
            setCurrentComponent("AllSet");
        }


    };

    /* */

    /* progress bar */

    const handleProgress = (newValue)=>{
        setValue(newValue);
    }

    /* */


    return (
        <>
            {showAlert ? (
                <>
                    <div className="fixed-top row" style={{backgroundColor:"#EA242E",color:"white", zIndex:"1000"}}>
                        {errorMessage === 'ShelfNeedsName' && (
                            <>
                                <div className="col-10 text-start" style={{padding:"0.5rem 1rem",fontSize:"0.8rem"}}><strong>Ups... something went wrong.</strong> A new shelf needs to have a name.</div>
                                <div className="col-2 d-flex align-items-center" onClick={()=>setShowAlert(false)} style={{cursor:"pointer"}}>
                                    <FontAwesomeIcon icon={faClose}/>
                                </div>
                            </>
                        )}
                    </div>
                </>
            ):(<></>)}
            <div className="fixed-top align-items-center" style={{ zIndex: "900", opacity: "1.0" }}>
                <div className="progress" style={{ borderRadius: "0", backgroundColor: "#D1E2FE", opacity: "1.0" }}>
                    <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuenow="0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: `${value}%`, backgroundColor: "#196FFA" }}
                    ></div>
                </div>
            </div>
            <div className="d-block-small d-md-none overflow-hidden">
                <div className="container">
                    <div className="row" style={{marginTop:"4rem"}}>
                        <div className="col-2 text-center mx-auto">
                            <img
                                src={process.env.PUBLIC_URL + '/myImgs/smallLogo.png'}
                                alt="Billy Books Logo"
                                className="img-fluid"
                            />
                        </div>
                    </div>
                    {currentComponent === "BasicInfo" && (
                        <BasicInfo handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={value}/>
                    )}
                    {currentComponent === "CreateShelves" && (
                        <CreateShelves handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress}/>
                    )}
                    {currentComponent === "FindBooks" && (
                        <FindBooks handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress}/>
                    )}
                    {currentComponent === "FindFriends" && (
                        <FindFriends handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress}/>
                    )}
                    {currentComponent === "InitialLoans" && (
                        <InitialLoans handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress} />
                    )}
                    {currentComponent === "AllSet" && (
                        <AllSet handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress}/>
                    )}
                </div>
            </div>
            <div className="d-none d-md-block overflow-hidden">
                <div className="container">
                    <div className="row" style={{marginTop:"4rem"}}>
                        <div className="col-2 text-center mx-auto">
                            <img
                                src={process.env.PUBLIC_URL + '/myImgs/BillyBooks.png'}
                                alt="Billy Books Logo"
                                className="img-fluid"
                            />
                        </div>
                    </div>
                    <div className="col-8 mx-auto">
                        {currentComponent === "BasicInfo" && (
                        <BasicInfo handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent}/>
                    )}
                        {currentComponent === "CreateShelves" && (
                        <CreateShelves handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress}/>
                    )}
                        {currentComponent === "FindBooks" && (
                        <FindBooks handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress}/>
                    )}
                        {currentComponent === "FindFriends" && (
                        <FindFriends handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress}/>
                    )}
                        {currentComponent === "InitialLoans" && (
                            <InitialLoans handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress} />
                        )}
                        {currentComponent === "AllSet" && (
                            <AllSet handleShowAlert={handleShowAlert} handleComponentSwitch={setCurrentComponent} handleProgress={handleProgress} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
