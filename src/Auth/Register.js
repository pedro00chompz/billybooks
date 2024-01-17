import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons/faGoogle";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, {useState,useEffect} from "react";
import PasswordStrength from "./PasswordStrength";
import {auth, fireBaseDB} from "../FirebaseConfig/FirebaseConfig";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {collection, setDoc, doc} from "firebase/firestore"


export default function Register(props){

    const {switchComponentHandler,handleShowAlert,signInWithGoogle} = props;

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [validPassword,setValidPassword] = useState(false);


    const navigate = useNavigate();

    const usersCollectionRef = collection(fireBaseDB,"users");
    const librariesCollectionRef = collection(fireBaseDB,"libraries");
    const loansCollectionRef = collection(fireBaseDB,"loans");


    const togglePasswordVisibility = (type) => {
        if (type === "password") {
            setShowPassword(!showPassword);
        } else if (type === "confirmPassword") {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const openLogIn = (value) => {
        switchComponentHandler(value);
    };

    async function isValidEmailProvider(email) {
        //função para confirmar se o email é valido

        const [, domain] = email.split('@');
        const commonProviders = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "aol.com", "icloud.com", "protonmail.com", "mail.com", "live.com", "msn.com", "ua.pt"];

        // Confirmar se o dominio colocado está na lista dos commonProviders
        return commonProviders.includes(domain);
    }

    const handleRegistration = async (event) => {
        event.preventDefault();

        // Verificar se as pass's inseridas estão a bater certo
        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            handleShowAlert({ isError: true, errorName: 'passwordMismatch' });
            return;
        }

        // Verificar se o mail provider está certo
        const isEmailProviderValid = await isValidEmailProvider(email);
        if (!isEmailProviderValid) {
            handleShowAlert({ isError: true, errorName: 'providerError' });
            return;
        }

        // A pass passou os checks
        setValidPassword(true);
    };

    useEffect(() => {
        // verificar se a pass está validada
        if (validPassword) {
            try {
                createUserWithEmailAndPassword(auth, email, password)
                    .then(async () => {
                        console.log("Email registered with success:", email, password);

                        const userId = auth.currentUser ? auth.currentUser.uid : null;

                        if (userId) {
                            try {
                                const userDocRef = doc(usersCollectionRef, auth.currentUser.uid);

                                await setDoc(userDocRef, {
                                    email: email,
                                    userId: auth.currentUser.uid,
                                    accountCreationDate: new Date().toISOString(),
                                });

                            } catch (error) {
                                console.error(error);
                            }
                        } else {
                            console.error("User not authenticated or authentication state still loading.");
                        }

                        navigate("/create-profile");
                    })
                    .catch((error) => {
                        const errorCode = error.code;

                        if (errorCode === 'auth/email-already-in-use') {
                            // Lidar com a situação em que o erro é o facto do mail já estar no FB
                            handleShowAlert({ isError: true, errorName: 'emailInUse' });
                        } else {
                            console.error("Registration error:", error);
                        }
                    });
            } catch (error) {
                console.error("Registration error:", error);
            }
        }
    }, [validPassword, email, password]);



    return(
        <>
            <div>
                <div className="row align-items-start" style={{marginTop:"1rem"}}>
                    <div
                        className="col-10 mx-auto titleFont"
                        style={{ fontSize: "1.8rem", textAlign: "left" }}
                    >
                        Welcome to Billy Books!
                    </div>
                    <div
                        className="col-10 mx-auto billyGreyText"
                        style={{ fontWeight: "600", textAlign: "left" }}
                    >
                        Sign up to keep your shelves up to date
                    </div>
                </div>
                <form className="col-10 mx-auto" style={{marginTop:"1rem"}}>
                    <div className="form-group text-start">
                        <label htmlFor="email" style={{ marginBottom: "0.5rem", display: "block", fontSize:"0.9rem",fontWeight:"600"  }}>
                            Email
                        </label>
                        <input
                            type="text"
                            className="billyInput rounded d-block col-12"
                            id="email"
                            placeholder="Set your email here"
                            onChange={(event)=>{(setEmail(event.target.value))}}
                            onBlur={()=>{console.log("email",email)}}
                        />
                    </div>
                    <div className="form-group text-start" style={{ marginTop: "1rem" }}>
                        <label
                            htmlFor="password"
                            style={{
                                marginBottom: "0.5rem",
                                display: "block",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                            }}
                        >
                            Password
                        </label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control billyInput col-12"
                                style={{borderRadius:"0.5rem 0rem 0rem 0.5rem", fontSize: "0.8rem", border: "0.1rem solid #D4D4D4"}}
                                id="password"
                                placeholder="Create your password here"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                                onBlur={()=>{console.log("pass",password)}}
                            />
                            <div className="input-group-append">
                            <span
                                className="btn input-group-text"
                                style={{borderRadius:"0rem 0.5rem 0.5rem 0rem",color:"#196FFA",backgroundColor:"white",border:"0.1rem solid #196FFA"}}
                                onClick={() => togglePasswordVisibility("password")}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <PasswordStrength password={password} />
                    </div>
                    <div className="form-group text-start" style={{ marginTop: "1rem" }}>
                        <label
                            htmlFor="confirmPassword"
                            style={{
                                marginBottom: "0.5rem",
                                display: "block",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                            }}
                        >
                            Confirm Your Password
                        </label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control billyInput col-12"
                                style={{borderRadius:"0.5rem 0rem 0rem 0.5rem", fontSize: "0.8rem", border: "0.1rem solid #D4D4D4"}}
                                id="confirmPassword"
                                placeholder="Confirm your password here"
                                value={confirmPassword}
                                onChange={(event) => {
                                    setConfirmPassword(event.target.value);
                                }}
                                onBlur={()=>{console.log("confirm pass",confirmPassword)}}

                            />
                            <div className="input-group-append">
                            <span
                                className="btn input-group-text"
                                style={{borderRadius:"0rem 0.5rem 0.5rem 0rem",color:"#196FFA",backgroundColor:"white",border:"0.1rem solid #196FFA"}}
                                onClick={() => togglePasswordVisibility("confirmPassword")}
                            >
                                <FontAwesomeIcon
                                    icon={showConfirmPassword ? faEye : faEyeSlash}
                                />
                            </span>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "2rem" }}>
                        <div className="col-12 mx-auto">
                            <button
                                className="rounded-pill w-100 billyPrimaryButton"
                                style={{ fontSize: "0.8rem"}}
                                onClick={handleRegistration}
                            >
                                Register
                            </button>
                            <div className="billyGreyText text-center" style={{fontSize:"0.8rem", padding:"0.4rem"}}>or</div>
                            <button
                                className="rounded-pill w-100 billySecondaryButton"
                                style={{ fontSize: "0.8rem", fontWeight: "700"}}
                                onClick={signInWithGoogle} //callback para Auth.js
                            >
                                <FontAwesomeIcon icon={faGoogle} style={{marginRight:"1rem"}} />
                                Continue with Google
                            </button>
                        </div>
                    </div>
                </form>
                <div style={{marginTop:"1.5rem",fontSize:"0.8rem"}} className="text-center">
                    Already have an account? <span className="text-decoration-underline" style={{color:"#196FFA",cursor:"pointer"}} onClick={()=>openLogIn(false)}>Sign in here</span>
                </div>
            </div>
        </>
    )
}
