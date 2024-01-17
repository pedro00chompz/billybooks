import React from 'react';
import {useNavigate} from "react-router-dom";

export default function SplashScreen(){

    const navigate = useNavigate();

    const handleLoginClick = () => {
        //ao clicar no log in btn, dá state de login
        navigate('auth', { state: { component: 'login' } });
    };

    const handleCreateAccountClick = () => {
        //ao clicar no create account btn, dá state de register

        navigate('auth', { state: { component: 'register' } });
    };

    return(
        <>
            <div className="d-block-small d-md-none overflow-hidden">
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                <div>
                    <div className="row">
                        <div className="col-8 mx-auto text-center">
                            <img
                                src={process.env.PUBLIC_URL + '/myImgs/BillyBooks.png'}
                                alt="Billy Books Logo"
                                className="img-fluid"
                            />
                        </div>
                    </div>
                    <div className="row" style={{ fontWeight: "600", marginTop: "5rem", fontSize: "1.1rem" }}>
                        <div className="col-8 mx-auto text-start">
                            Ready to explore <span style={{color:"#196FFA"}}>fantastic</span> universes and <span style={{color:"#196FFA"}}>charismatic</span> characters?
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "2rem" }}>
                        <div className="col-10 mx-auto">
                            <button
                                className="rounded-pill w-100 billyPrimaryButton"
                                style={{ fontSize: "0.8rem",}}
                                onClick={handleLoginClick}
                            >
                                Log In
                            </button>
                            <button
                                className="rounded-pill w-100 billySecondaryButton"
                                style={{ fontSize: "0.8rem", fontWeight: "700", marginTop:"2rem" }}
                                onClick={handleCreateAccountClick}
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div className="d-none d-md-block overflow-hidden">
                <div className="row">
                    <div className="col-6 text-start" style={{paddingLeft:"2rem"}}>
                        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                            <div>
                                <div className="row">
                                    <div className="col-6 mx-auto text-center">
                                        <img
                                            src={process.env.PUBLIC_URL + '/myImgs/BillyBooks.png'}
                                            alt="Billy Books Logo"
                                            className="img-fluid"
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ fontWeight: "600", marginTop: "5rem", fontSize: "1.1rem" }}>
                                    <div className="col-6 mx-auto text-start">
                                        Ready to explore <span style={{color:"#196FFA"}}>fantastic</span> universes and <span style={{color:"#196FFA"}}>charismatic</span> characters?
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "2rem" }}>
                                    <div className="col-6 mx-auto">
                                        <button
                                            className="rounded-pill w-100 billyPrimaryButton"
                                            style={{ fontSize: "0.8rem",}}
                                            onClick={handleLoginClick}
                                        >
                                            Log In
                                        </button>
                                        <button
                                            className="rounded-pill w-100 billySecondaryButton"
                                            style={{ fontSize: "0.8rem", fontWeight: "700", marginTop:"2rem" }}
                                            onClick={handleCreateAccountClick}
                                        >
                                            Create Account
                                        </button>
                                    </div>
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
    )
}