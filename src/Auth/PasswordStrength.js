import { useState } from "react";

export default function PasswordStrength(props) {
    const {password} = props;

    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;

    let score = 0;

    if (password.length > 5) {
        score++;
    }

    if (password.length > 10) {
        score++;
    }

    if (password.length > 15) {
        score++;
    }

    if (password.length > 20) {
        score++;
    }

    if (upperCaseRegex.test(password)) {
        score++;
    }

    if (lowerCaseRegex.test(password)) {
        score++;
    }

    if (numberRegex.test(password)) {
        score++;
    }

    if (specialCharRegex.test(password)) {
        score++;
    }



    // Check if the score is 0
    if (score === 0) {
        return (
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: "0%", backgroundColor: "#D1E2FE" }}
                    aria-valuenow="0"
                    aria-valuemax="100"
                ></div>
            </div>
        );
    } else if (score < 3) {
        return (
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: "20%", backgroundColor: "#D1E2FE" }}
                    aria-valuenow="10"
                    aria-valuemax="100"
                ></div>
            </div>
        );
    } else if (score < 6) {
        return (
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: "50%", backgroundColor: "#8CB7FC" }}
                    aria-valuenow="50"
                    aria-valuemax="100"
                ></div>
            </div>
        );
    } else if (score < 7) {
        return (
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: "80%", backgroundColor: "#669FFC1" }}
                    aria-valuenow="80"
                    aria-valuemax="100"
                ></div>
            </div>
        );
    } else {
        return (
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: "100%", backgroundColor: "#196FFA" }}
                    aria-valuenow="100"
                    aria-valuemax="100"
                ></div>
            </div>
        );
    }
}


