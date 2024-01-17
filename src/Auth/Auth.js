import React from "react";
import "../myStyles.css";
import LogIn from "./LogIn";
import {useState} from "react";
import Register from "./Register";
import {useLocation, useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {signInWithPopup} from "firebase/auth";
import {auth, fireBaseDB, googleProvider} from "../FirebaseConfig/FirebaseConfig";
import {collection, doc, setDoc, getDocs,query, where,} from "firebase/firestore";
import {getAuth} from "firebase/auth";



export default function Auth() {

    const navigate = useNavigate();

    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const usersCollectionRef = collection(fireBaseDB,"users");

    const switchComponentHandler = (value) =>{
        //ao clicar no texto de baixo, define se é para mostrar log in ou register

        setIsLoggedIn(value);
    }

    React.useEffect(() => {
        // consoante o estado anterior, define qual dos componentes mostra primeiro

        const componentType = location?.state?.component;
        if (componentType === 'login') {
            setIsLoggedIn(false);
        } else if (componentType === 'register') {
            setIsLoggedIn(true);
        }
    }, [location]);


    /* Lidar com erros e mensagens de erro */

    const [showAlert,setShowAlert] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");

    const handleShowAlert = (errorInfo) =>{
        //função que recebe infos do tipo de erro para o submeter

        setShowAlert(errorInfo.isError);
        setErrorMessage(errorInfo.errorName);
    }

    /* */

    /* Registo com Google */

    const signInWithGoogle = async (event) => {
        event.preventDefault();
        try {
            const response = await signInWithPopup(auth, googleProvider);

            const userId = auth.currentUser ? auth.currentUser.uid : null;
            const userEmail = auth.currentUser ? auth.currentUser.email : null;

            if (userId && userEmail) {
                // Check if the email is already in use
                const userQuery = query(usersCollectionRef, where('email', '==', userEmail));
                const querySnapshot = await getDocs(userQuery);

                if (querySnapshot.size > 0) {
                    // Email is already in use
                    handleShowAlert({ isError: true, errorName: 'emailInUse' });
                    return;
                }

                // If not in use, proceed with creating the account
                const userDocRef = doc(usersCollectionRef, userId);
                await setDoc(userDocRef, {
                    email: userEmail,
                    userId,
                    accountCreationDate: new Date().toISOString(),
                });

                navigate("/create-profile");
            } else {
                console.error("User not authenticated or authentication state still loading.");
            }
        } catch (error) {
            console.error("Google Sign In Error:", error);
        }
    };

    /* */

    /* Log In com Google */

    const handleGoogleLogin = async (event) => {
        event.preventDefault();

        try {
            const auth = getAuth();
            await signInWithPopup(auth, googleProvider);

            const userEmail = auth.currentUser.email;

            const userQuery = query(usersCollectionRef, where('email', '==', userEmail));
            //vamos confirmar se utilizador tem ou não tem conta
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.size > 0) {
                // Se user já existir, log in normal a ir para o main
                navigate('/main');
            } else {
                // se user não tiver conta, vamos adicionar os seus dados atuais ao fb e criar um documento para si
                try {
                    const userDocRef = doc(usersCollectionRef, auth.currentUser.uid);

                    await setDoc(userDocRef, {
                        email: auth.currentUser.email,
                        userId: auth.currentUser.uid,
                        accountCreationDate: new Date().toISOString(),
                    });
                } catch (error) {
                    console.error(error);
                }
                navigate('/create-profile');
            }

        } catch (error) {
            console.error(error);
        }
    };

    /* */


    return (

        <>
            {showAlert ? (
                <>
                    <div className="fixed-top row" style={{backgroundColor:"#EA242E",color:"white"}}>
                        {errorMessage === 'passwordMismatch' && (
                            <>
                            <div className="col-10 text-start" style={{padding:"0.5rem 1rem",fontSize:"0.8rem"}}><strong>Ups... something went wrong.</strong> Passwords do not match. Please try again.</div>
                            <div className="col-2 d-flex align-items-center" onClick={()=>setShowAlert(false)} style={{cursor:"pointer"}}>
                                <FontAwesomeIcon icon={faClose}/>
                            </div>
                            </>
                        )}
                        {errorMessage === 'providerError' && (
                            <>
                                <div className="col-10 text-start" style={{padding:"0.5rem 1rem",fontSize:"0.8rem"}}><strong>Ups... something went wrong.</strong> Please use a valid email provider.</div>
                                <div className="col-2 d-flex align-items-center" onClick={()=>setShowAlert(false)} style={{cursor:"pointer"}}>
                                    <FontAwesomeIcon icon={faClose}/>
                                </div>
                            </>
                        )}
                        {errorMessage === 'emailInUse' && (
                            <>
                                <div className="col-10 text-start" style={{padding:"0.5rem 1rem",fontSize:"0.8rem"}}><strong>Ups... something went wrong.</strong> Please use a valid email address.</div>
                                <div className="col-2 d-flex align-items-center" onClick={()=>setShowAlert(false)} style={{cursor:"pointer"}}>
                                    <FontAwesomeIcon icon={faClose}/>
                                </div>
                            </>
                        )}
                        {errorMessage === 'invalidCredentials' && (
                            <>
                                <div className="col-10 text-start" style={{padding:"0.5rem 1rem",fontSize:"0.8rem"}}><strong>Ups... something went wrong.</strong> Please check if you're using the correct credentials.</div>
                                <div className="col-2 d-flex align-items-center" onClick={()=>setShowAlert(false)} style={{cursor:"pointer"}}>
                                    <FontAwesomeIcon icon={faClose}/>
                                </div>
                            </>
                        )}
                    </div>
                </>
            ):(<></>)}
            <div className="d-block-small d-md-none overflow-hidden">
                <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                    <div className="row">
                        <div className="align-items-center">
                            <div className="row">
                                <div className="col-6 mx-auto text-center">
                                    <img
                                        src={process.env.PUBLIC_URL + '/myImgs/BillyBooks.png'}
                                        alt="Billy Books Logo"
                                        className="img-fluid"
                                        onClick={()=>{navigate("/")}}
                                    />
                                </div>
                            </div>
                            {isLoggedIn ? (
                                <Register
                                    switchComponentHandler = {switchComponentHandler}
                                    handleShowAlert = {handleShowAlert}
                                    signInWithGoogle={signInWithGoogle}
                                />
                            ) : (
                                <LogIn
                                    switchComponentHandler = {switchComponentHandler}
                                    handleShowAlert = {handleShowAlert}
                                    handleGoogleLogin ={handleGoogleLogin}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-none d-md-block overflow-hidden">
                <div className="row">
                    <div className="col-6 text-start" style={{paddingLeft:"2rem"}}>
                        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                            <div className="row">
                                <div className="align-items-center">
                                    <div className="row">
                                        <div className="col-6 mx-auto text-center">
                                            <img
                                                src={process.env.PUBLIC_URL + '/myImgs/BillyBooks.png'}
                                                alt="Billy Books Logo"
                                                className="img-fluid"
                                                onClick={()=>{navigate("/")}}
                                                style={{cursor:"pointer"}}
                                            />
                                        </div>
                                    </div>
                                    {isLoggedIn ? (
                                        <Register
                                            switchComponentHandler = {switchComponentHandler}
                                            handleShowAlert = {handleShowAlert}
                                            signInWithGoogle={signInWithGoogle}
                                        />
                                    ) : (
                                        <LogIn
                                            switchComponentHandler = {switchComponentHandler}
                                            handleGoogleLogin ={handleGoogleLogin}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 text-start vh-100">
                        <img
                            src={process.env.PUBLIC_URL + '/myImgs/introImg.jpg'}
                            alt="Billy Books Logo"
                            className="img-fluid"
                            style={{ objectFit: 'cover',height: '100%' }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
