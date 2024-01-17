import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons/faGoogle";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {getAuth} from "firebase/auth";
import {signInWithEmailAndPassword} from "firebase/auth"
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

export default function LogIn(props){

    const {switchComponentHandler,handleShowAlert,handleGoogleLogin} = props;

    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const openRegister = (value) => {
        switchComponentHandler(value);
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);

            navigate('/main');

        } catch (error) {
            console.error(error);
            handleShowAlert({ isError: true, errorName: 'invalidCredentials' });
        }
    };

    const togglePasswordVisibility = (type) => {
        if (type === "password") {
            setShowPassword(!showPassword);
        }
    };

    return(
        <>
            <div>

                <div className="row align-items-start" style={{marginTop:"3rem"}}>
                    <div
                        className="col-10 mx-auto titleFont"
                        style={{ fontSize: "1.8rem", textAlign: "left" }}
                    >
                        Welcome back!
                    </div>
                    <div
                        className="col-10 mx-auto billyGreyText"
                        style={{ fontWeight: "600", textAlign: "left" }}
                    >
                        Sign in to keep track of your books
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
                            placeholder="Enter your email here"
                            onChange={(event)=>{(setEmail(event.target.value))}}
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
                                onBlur={()=>{console.log("pass worked")}}
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
                    <div style={{fontSize:"0.8rem", marginTop:"1rem", textDecoration:"underline", color:"#196FFA"}} className="text-start">
                        Forgot password? Click here
                    </div>
                    <div className="row" style={{ marginTop: "2rem" }}>
                        <div className="col-12 mx-auto">
                            <button
                                className="rounded-pill w-100 billyPrimaryButton"
                                style={{ fontSize: "0.8rem",}}
                                onClick={handleLogin}
                            >
                                Log In
                            </button>
                            <div className="billyGreyText text-center" style={{fontSize:"0.8rem", padding:"0.4rem"}}>or</div>
                            <button
                                className="rounded-pill w-100 billySecondaryButton"
                                style={{ fontSize: "0.8rem", fontWeight: "700"}}
                                onClick={handleGoogleLogin}
                            >
                                <FontAwesomeIcon icon={faGoogle} style={{marginRight:"1rem"}} />
                                Continue with Google
                            </button>
                        </div>
                    </div>
                </form>
                <div style={{marginTop:"3rem",fontSize:"0.8rem"}} className="text-center">
                    Don't have an account? <span className="text-decoration-underline" style={{color:"#196FFA", cursor:"pointer"}} onClick={()=>openRegister(true)}>Register here</span>
                </div>
            </div>
        </>
    )
}