import AddNewLoan from "../Components/AddNewLoan";
import EndLoan from "../Components/EndLoan";
import React, {useEffect, useState} from "react";
import DisplayUserLoanedBooks from "../Components/DisplayUserLoanedBooks";
import {auth, fireBaseDB, useAuth} from "../FirebaseConfig/FirebaseConfig";
import {collection, doc, getDoc} from "firebase/firestore";

export default function MyLoans({handleBookClick}){

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
                <h1 className="titleFont col-12 text-start" style={{ fontSize: '1.2rem', marginLeft:"1.5rem" }}>My Loaned Books</h1>

                <div className="col-10 mx-auto">
                    <div style={{marginBottom:"6rem"}}>
                    <DisplayUserLoanedBooks
                        userLoans={userLoans}
                        generateRandomColor={generateRandomColor}
                        showEndModal={showEndModal}
                        handleBookClick = {handleBookClick}
                    />
                    </div>
                    <div
                        style={{
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            borderBottom: "0.08rem solid #d4d4d4",
                            height: "6rem",
                            padding: "0 1rem",
                            backdropFilter: "blur(5px)",
                            position:"fixed",
                        }}
                    >
                        <button
                            className="rounded-pill w-100 billySecondaryButton"
                            style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom:"2rem", marginTop:"2rem"}}
                            onClick={openShowModal}
                        >
                            Add new loan
                        </button>
                    </div>
                </div>
            </div>
            </>
    )
}