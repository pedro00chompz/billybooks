// DisplayUserLoanedBooks.jsx

import React from 'react';

const DisplayUserLoanedBooks = ({ userLoans, generateRandomColor, showEndModal, handleBookClick }) => {

    return (
        <>
            {userLoans && Object.keys(userLoans).length > 0 ? (
                Object.values(userLoans).map((loan, index) => {
                    const { backgroundColor, color } = generateRandomColor();

                    return (
                        <React.Fragment key={index}>
                            <div className="loan-item" style={{ marginTop: "1rem" }}>
                                {/* Display details of each loan here */}
                                <div className="loan-info text-start row">
                                    <div className="col-12" style={{ fontSize: "0.8rem", marginBottom: "1rem" }}>
                                        <span style={{ fontWeight: "700", color: "#196FFA" }}>{loan.bookInfo.title}</span>'s is loaned to{' '}
                                        {loan.friendInfo && loan.friendInfo.name ? (
                                            <span style={{ fontWeight: "700", color: "#196FFA" }}>
                                                {loan.friendInfo.name} {loan.friendInfo.surname}
                                            </span>
                                        ) : (
                                            <span style={{ fontWeight: "700", color: "#196FFA" }}>Guest</span>
                                        )}{' '}
                                        since {loan.loanDate}
                                    </div>
                                    <div className="col-6 d-flex align-items-center justify-content-center">
                                        <img src={loan.bookInfo.cover} className="img-fluid" style={{ height: "6rem", width: "auto", border: "0.05rem solid #D4D4D4" }} alt={`${loan.bookInfo.title}'s cover`}  onClick={() => handleBookClick && handleBookClick(loan.bookInfo)}/>
                                    </div>
                                    <div className="col-6 d-flex align-items-center justify-content-center">
                                        {loan.friendInfo && loan.friendInfo.avatar ? (
                                            <img src={loan.friendInfo.avatar} className="img-fluid" style={{ borderRadius: "50%", height: "4rem", width: "auto" }} alt={`${loan.friendInfo.name}'s avatar`}/>
                                        ) : (
                                            <span className="titleFont d-flex align-items-center justify-content-center" style={{ backgroundColor, color, height: "4rem", width: "4rem", borderRadius: "100%" }}>
                                                {loan.friendInfo ? (loan.friendInfo.name ? loan.friendInfo.name.charAt(0).toUpperCase() : 'GS') : 'GS'}
                                                {loan.friendInfo ? (loan.friendInfo.surname ? loan.friendInfo.surname.charAt(0).toUpperCase() : 'T') : 'T'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                className="rounded-pill billyCancelAlternativeButton"
                                style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom: "1rem", marginTop: "1rem" }}
                                onClick={() => showEndModal(loan)}
                            >
                                End loan
                            </button>
                        </React.Fragment>
                    );
                })
            ) : (
                <p
                    className="billyGreyText"
                    style={{ fontSize: "0.8rem", marginTop: "3rem" }}
                >
                    No books loaned currently.
                </p>
            )}
        </>
    );
};

export default DisplayUserLoanedBooks;
