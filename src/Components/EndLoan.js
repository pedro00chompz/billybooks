import { ModalBody, Modal } from "react-bootstrap";
import React, { useEffect } from "react";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, fireBaseDB } from "../FirebaseConfig/FirebaseConfig";

export default function EndLoan(props) {
    const { selectedBook, selectedFriend, showEndModal, cancelEndModal, loanId, onLoanRemoved } = props;

    console.log("id: ", loanId);

    const loansCollectionRef = collection(fireBaseDB, "loans");

    const removeLoanEntry = async () => {
        const userId = auth.currentUser ? auth.currentUser.uid : null;

        try {
            if (userId) {
                const loansDocRef = doc(loansCollectionRef, userId);
                const loansDocSnapshot = await getDoc(loansDocRef);

                if (loansDocSnapshot.exists()) {
                    const loansData = loansDocSnapshot.data().loanDetails;

                    console.log("dados: ", loansData);

                    // Create a copy of loansData
                    const loansDataCopy = { ...loansData };

                    console.log("copia: ", loansDataCopy);

                    // Find the index of the loan with the specified loanId in loansDataCopy
                    const index = Object.values(loansDataCopy).findIndex((loan) => loan.loanId === loanId);

                    // Remove the loan entry if found
                    if (index !== -1) {
                        delete loansDataCopy[index];
                        console.log(`Loan with ID ${loanId} removed from loansDataCopy`);
                        onLoanRemoved(loansDataCopy);
                    } else {
                        console.log(`Loan with ID ${loanId} not found in loansDataCopy`);
                    }

                    // Update the user document with the modified copy
                    await updateDoc(loansDocRef, { loanDetails: loansDataCopy });
                    console.log("User document updated with modified loanDetails");
                }
            }
        } catch (error) {
            console.error(error);
        }

    };

    const handleConfirm = () => {
        // Call the function to remove the loan entry
        removeLoanEntry();

        // Close the modal or perform any other necessary actions
        cancelEndModal();
    };

    return (
        <Modal show={showEndModal} onHide={cancelEndModal} centered>
            <ModalBody>
                <p>
                    Do you wish to terminate the loan of{" "}
                    <span className="fst-italic fw-bolder" style={{ color: "#196FFA" }}>
            {selectedBook.title}
          </span>{" "}
                    with your friend{" "}
                    <span className="fst-italic fw-bolder" style={{ color: "#196FFA" }}>
            {selectedFriend.name} {selectedFriend.surname}
          </span>
                    ?
                </p>
                <div className="d-flex justify-content-between">
                    <button
                        className="rounded-pill billySecondaryButton col-4"
                        style={{ fontSize: "0.8rem" }}
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                    <button
                        className="rounded-pill billyCancelButton col-4"
                        style={{ fontSize: "0.8rem" }}
                        onClick={cancelEndModal}
                    >
                        Cancel
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
}
