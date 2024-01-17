import {faAngleLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import {handleAddToShelf} from "../CreateProfile/FindBooks";
import AddBookToShelfModal from "../Components/AddBookToShelfModal";

export default function BookDetail(props){
    const {selectedBook,handleComponentChange,previousComponent,setSelectedBook} = props;

    const [showAllDescription,setShowAllDescription] = useState(false);
    const [library,setLibrary] = useState();
    const [showAddBookToShelfModal, setShowAddBookToShelfModal] = useState(false);


    console.log(selectedBook);

    const truncateTitle = (title, maxLength) => {
        return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
    };

    // Use useEffect to log the updated state
    useEffect(() => {
        console.log(library);
    }, [library]);
    /* */

    return(
        <>
            <div
                className="col-sm col-12 d-md-none d-flex align-items-center position-fixed"
                style={{
                    top: "3rem",
                    left: 0,
                    right: 0,
                    zIndex: 900,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderBottom: "0.08rem solid #d4d4d4",
                    height: "3rem",
                    padding: "0 1rem",
                    backdropFilter: "blur(5px)",
                }}
            >
                <div className="col-1">
                    <FontAwesomeIcon icon={faAngleLeft}
                                     style={{ height: "1.2rem", width: "auto" }}
                                     onClick={()=>handleComponentChange(previousComponent)}
                    />
                </div>
                <div className="col-10">
                    <div className="row titleFont" style={{marginLeft:"2rem",fontSize:"0.8rem"}}>{truncateTitle(selectedBook.title, 26)}
                    </div>
                    <div className="row" style={{marginLeft:"2rem",fontSize:"0.7rem", color:"#6F6F6F"}}>{truncateTitle(selectedBook.authors[0], 26)}</div>
                </div>
            </div>
            {showAddBookToShelfModal && (
                <>
                    <AddBookToShelfModal
                        showAddBookToShelfModal={showAddBookToShelfModal}
                        onHide={() => setShowAddBookToShelfModal(false)} // Function to hide the modal
                        userLibrary={library} // Pass user libraries as a prop
                        selectedBook={selectedBook} // Pass the selected book as a prop
                    />
                </>
            )}
            <div style={{marginTop:"4rem"}}>
                <div className="row d-flex align-items-center text-center">
                    <div className="col-12">
                    <img src={selectedBook.cover} className="img-fluid" style={{border: "0.05rem solid #D4D4D4"}}/>
                    </div>
                </div>
            </div>
            <div className="row d-flex justify-content-center titleFont" style={{marginTop:"2rem",marginLeft:"2rem",marginRight:"2rem"}}>
                {selectedBook.title}
            </div>
            <div className="row d-flex justify-content-center " style={{fontSize:"0.7rem", color:"#6F6F6F", marginTop:"0.5rem"}}>
                by {selectedBook.authors[0]}
            </div>
            {selectedBook.description ? (
                <div className="col-10 text-start" style={{ fontSize: "0.7rem", margin: "2rem", marginTop:"1rem" }}>
                    {!showAllDescription ? (
                        <>
                            {truncateTitle(selectedBook.description, 220)}{" "}
                            <span
                                style={{ color: "#196FFA", cursor: "pointer", paddingLeft:"0.3rem" }}
                                onClick={() => setShowAllDescription(true)}
                                className="text-decoration-underline"
                            >
                    Show more
                </span>
                        </>
                    ) : (
                        <>
                        {selectedBook.description}
                        <span
                        style={{ color: "#196FFA", cursor: "pointer", paddingLeft:"0.3rem" }}
                        onClick={() => setShowAllDescription(false)}
                        className="text-decoration-underline"
                        >
                        Show less
                        </span>
                        </>
                    )}
                </div>
            ) : (
                <div className="row text-center" style={{ fontSize: "0.7rem", margin: "2rem", marginTop:"1rem"  }}>
                    No synopsis to show
                </div>
            )}
            <button
                className="rounded-pill w-50 billySecondaryButton"
                style={{ fontSize: "0.8rem", fontWeight: "700", marginTop: "0.4rem" }}
                onClick={() => handleAddToShelf(selectedBook, setLibrary, setSelectedBook, setShowAddBookToShelfModal)}
            >
                Add to shelf
            </button>
        </>
    )
}