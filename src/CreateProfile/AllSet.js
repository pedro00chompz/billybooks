import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrophy} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


export default function AllSet(props){

    const {handleProgress,handleShowAlert,handleComponentSwitch} = props;

    /* Handle Progress */
    handleProgress(100);

    const navigate = useNavigate();

    const goHome = () =>{
        navigate("/main");
    }

    const handleBack = () =>{
        handleShowAlert({ isError: false, message: 'Friends Added!' });
        if (handleComponentSwitch) {
            handleComponentSwitch("InitialLoans");
        }
    }

    return(
        <>
            <div className="row align-items-center" style={{ marginTop: "2rem" }}>
                <div className="col-10 mx-auto titleFont" style={{ fontSize: "1.8rem", textAlign: "left" }}>
                    All set!
                </div>
                <div
                    className="col-10 mx-auto billyGreyText"
                    style={{ fontWeight: "600", textAlign: "left", marginBottom: "4rem" }}
                >
                    Your shelves are ready! Now as you continue your reading saga, you can update your Billy Books to track all your favourite stories!
                </div>
                <div className="col-10 mx-auto">
                    <FontAwesomeIcon icon={faTrophy} style={{height:"6rem",color:"#196FFA", marginBottom: "4rem"}}/>

                    <button
                    className="rounded-pill w-100 billyPrimaryButton"
                    style={{ fontSize: "0.8rem"}}
                    onClick={goHome}
                    >
                    Go Home
                    </button>
                    <div onClick={handleBack} className="text-center text-decoration-underline" style={{fontSize:"0.8rem",fontWeight:"600",color:"#196FFA", marginTop:"1rem",cursor:"pointer"}}>
                        Back
                    </div>
                </div>
            </div>
        </>
    )
}