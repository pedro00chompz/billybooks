import React, {useEffect, useState} from "react";
import {auth, fireBaseDB, useAuth} from "../FirebaseConfig/FirebaseConfig";
import {collection, doc, getDoc, setDoc} from "firebase/firestore";
import AddNewLoan from "../Components/AddNewLoan";
import RemoveShelfFromUsersLibrary from "../Components/RemoveShelfFromUsersLibrary";
import EndLoan from "../Components/EndLoan";
import DisplayUserLoanedBooks from "../Components/DisplayUserLoanedBooks";

export default function InitialLoans(props){

    const {handleProgress,handleShowAlert,handleComponentSwitch} = props;

    /* Handle Progress */
    handleProgress(75);

    const handleNext = () =>{
        handleShowAlert({ isError: false, message: 'Loans Done!' });
        if (handleComponentSwitch) {
            handleComponentSwitch("AllSet");
        }
    }

    const currentUser = useAuth();

    const loansCollectionRef = collection(fireBaseDB, "loans");
    const [userLoans, setUserLoans] = useState([]);
    const [showLoanModal,setShowLoanModal] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState("");
    const [selectedBook,setSelectedBook] = useState("");
    const [showEndLoanModal,setShowEndLoanModal] = useState(false);
    const [loanId,setLoanId] = useState("");
    const [temporaryLoans, setTemporaryLoans] = useState([]);


    /* Buscar empréstimos */

    const [loansData,setLoansData] = useState(null);

    useEffect(()=>{
        const loansList = async ()=>{
            const userId = auth.currentUser ? auth.currentUser.uid : null;

            try {
                if (userId){
                    const loansDocRef = doc(loansCollectionRef,userId);
                    const loansDocSnapshot = await getDoc(loansDocRef);

                    if (loansDocSnapshot.exists()){
                        const loansData = loansDocSnapshot.data().loanDetails;

                        setUserLoans(loansData);

                    }
                }
            } catch (error){
                console.error(error);
            }
        }
        loansList();
    }, [showLoanModal, temporaryLoans]);

    console.log("empréstimos do user: ",userLoans);

    /* modal de adicionar loan */

    const openShowModal = () => {
        setShowLoanModal(true);
        console.log("mostrar modal? ",showLoanModal);
    };

    const cancelModal = () =>{
        setShowLoanModal(false);
    }

    /* modal de acabar com loans */

    const showEndModal = (loan) => {
        setShowEndLoanModal(true);
        console.log("mostrar modal de acabar? ", showEndLoanModal);
        // Pass the loan information to the EndLoan component
        setSelectedBook(loan.bookInfo);
        setSelectedFriend(loan.friendInfo);
        setLoanId(loan.loanId);
    };

    const cancelEndModal = () =>{
        setShowEndLoanModal(false);
    }


    /* Get random color combination */
    const generateRandomColor = () => {
        const colorsArray = [
            ["#196FFA", "#D1E2FE"],
            ["#70163C", "#FFBDD9"],
            ["#FAB019", "#FEEFD1"],
            ["#E03616", "#FFCBC2"],
            ["#21D775", "#BDFFDB"],
            ["#D77821", "#FFE5CE"],
            ["#9F32F4", "#EAD0FF"],
            ["#42E3C6", "#DDFFF9"],
            ["#E342CA", "#FFD0F8"],
        ];

        const randomNumber = Math.floor(Math.random() * colorsArray.length);

        return {
            backgroundColor: colorsArray[randomNumber][0],
            color: colorsArray[randomNumber][1],
        };
    };


    const handleLoanRemoved = (updatedLoansData) => {
        setTemporaryLoans(updatedLoansData);
    };

    const handleBack = () =>{
        handleShowAlert({ isError: false, message: 'Books Added!' });
        if (handleComponentSwitch) {
            handleComponentSwitch("FindFriends");
        }
    }

    return(
        <>
            {showLoanModal && (
                <>
                    <AddNewLoan
                        show={showLoanModal}
                        cancelModal = {cancelModal}
                    />
                </>
            )}
            {showEndLoanModal && (
                <>
                    <EndLoan
                        loanId={loanId}
                        selectedBook={selectedBook}
                        selectedFriend={selectedFriend}
                        showEndModal={showEndModal}
                        cancelEndModal = {cancelEndModal}
                        onLoanRemoved={handleLoanRemoved}
                    />
                </>
            )}
            <div className="row align-items-center" style={{ marginTop: "2rem" }}>
                <div className="col-10 mx-auto titleFont" style={{ fontSize: "1.8rem", textAlign: "left" }}>
                    Keep Track of Your Books
                </div>
                <div className="col-10 mx-auto billyGreyText" style={{ fontWeight: "600", textAlign: "left", marginBottom: "2rem" }}>
                    If you have loaned books to your friends, you can easily keep track of them with Billy Books!
                </div>
                <div className="col-10 mx-auto">
                    <h1 className="text-start titleFont" style={{fontSize:"1rem"}}>Your Loans</h1>

                    <DisplayUserLoanedBooks
                        userLoans={userLoans}
                        generateRandomColor={generateRandomColor}
                        showEndModal={showEndModal}
                    />

                    <button
                    className="rounded-pill w-100 billySecondaryButton"
                    style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom:"2rem", marginTop:"2rem"}}
                    onClick={openShowModal}
                >
                    Add new loan
                </button>
                <button
                    className="rounded-pill w-100 billyPrimaryButton"
                    style={{ fontSize: "0.8rem"}}
                    onClick={handleNext}
                >
                    Continue
                </button>
                    <div onClick={handleBack} className="text-center text-decoration-underline" style={{fontSize:"0.8rem",fontWeight:"600",color:"#196FFA", marginTop:"1rem",cursor:"pointer",marginBottom:"2rem"}}>
                        Back
                    </div>
                </div>
            </div>
        </>
    )
}