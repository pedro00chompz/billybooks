import React from "react";
import "../myStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";

export default function LogIn() {
    return (
        <>
            <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                <div className="row">
                    <div className="align-items-center">
                        <div className="row" style={{ marginBottom: "3rem" }}>
                            <div className="col-6 mx-auto text-center">
                                <img
                                    src={process.env.PUBLIC_URL + '/myImgs/BillyBooks.png'}
                                    alt="Billy Books Logo"
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                        <div className="row align-items-start">
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
                                />
                            </div>
                            <div className="form-group text-start" style={{marginTop:"1rem"}}>
                                <label htmlFor="password" style={{ marginBottom: "0.5rem", display: "block", fontSize:"0.9rem",fontWeight:"600" }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="billyInput rounded d-block col-12"
                                    id="password"
                                    placeholder="Enter your password here"
                                />
                            </div>
                            <div style={{fontSize:"0.8rem", marginTop:"1rem", textDecoration:"underline", color:"#196FFA"}} className="text-start">
                                Forgot password? Click here
                            </div>
                            <div className="row" style={{ marginTop: "2rem" }}>
                                <div className="col-12 mx-auto">
                                    <button
                                        className="rounded-pill w-100 billyPrimaryButton"
                                        style={{ fontSize: "0.8rem",}}
                                    >
                                        Log In
                                    </button>
                                    <div className="billyGreyText" style={{fontSize:"0.8rem", padding:"0.4rem"}}>or</div>
                                    <button
                                        className="rounded-pill w-100 billySecondaryButton"
                                        style={{ fontSize: "0.8rem", fontWeight: "700"}}
                                    >
                                        <FontAwesomeIcon icon={faGoogle} style={{marginRight:"1rem"}} />
                                        Continue with Google
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div style={{marginTop:"3rem",fontSize:"0.8rem"}}>
                            Don't have an account? <span className="text-decoration-underline" style={{color:"#196FFA"}}>Register here</span>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
