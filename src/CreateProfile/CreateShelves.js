import React, { useState, useEffect } from "react";
import { useAuth, fireBaseDB } from "../FirebaseConfig/FirebaseConfig";
import { collection, getDoc, doc, deleteField, updateDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import RemoveShelfFromUsersLibrary from "../Components/RemoveShelfFromUsersLibrary";
import AddShelfToUsersLibrary from "../Components/AddShelfToUsersLibrary"
import DisplayUserShelves from "../Components/DisplayUserShelves";



export default function CreateShelves(props) {

    const {handleShowAlert,handleComponentSwitch,handleProgress} = props;

    const currentUser = useAuth();

    const librariesCollectionRef = collection(fireBaseDB, "libraries");
    const [userLibraries, setUserLibraries] = useState([]);

    const [selectedShelf, setSelectedShelf] = useState(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showAddModal,setShowAddModal] = useState(false);

    useEffect(() => {
        const fetchUserLibraries = async () => {
            if (currentUser) {
                try {
                    // Reference to the user's library document
                    const userLibraryDocRef = doc(librariesCollectionRef, currentUser.uid);

                    // Fetch the user's library data
                    const userLibraryDocSnapshot = await getDoc(userLibraryDocRef);

                    if (userLibraryDocSnapshot.exists()) {
                        // If the user's library document exists, extract the data
                        const userLibraryData = userLibraryDocSnapshot.data();

                        // Convert the properties of userLibraryData into an array
                        const librariesArray = Object.values(userLibraryData);

                        setUserLibraries(librariesArray);

                        // Log the user's library data to the console
                        console.log("User Library Data:", userLibraryData);
                    } else {
                        console.log("User library document does not exist.");
                    }
                } catch (error) {
                    console.error("Error fetching user libraries:", error);
                }
            }
        };

        fetchUserLibraries();
    }, [currentUser]);


    console.log("biblioteca",userLibraries)

    /* */

    /* Remover Shelf */

    const openRemoveModal = (shelfName) => {
        setSelectedShelf(shelfName);
        console.log("selected shelf: ",selectedShelf);
        setShowRemoveModal(true);
        console.log("mostrar modal? ",showRemoveModal);

    };

    const handleRemoveShelf = async (selectedShelf) => {
        console.log("Selected Shelf to Remove:", selectedShelf);

        const formattedName = selectedShelf
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .toLowerCase();

        const savedName = formattedName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');



        try {
            if (currentUser) {
                const userLibraryDocRef = doc(librariesCollectionRef, currentUser.uid);

                console.log("prateleira:",savedName);
                console.log("id do user:",currentUser.uid);

                await updateDoc(userLibraryDocRef, {
                    [savedName]: deleteField()
                });

                setShowRemoveModal(false);

                // Update the userLibraries state after removal
                const updatedUserLibraryData = (await getDoc(userLibraryDocRef)).data();
                const updatedLibrariesArray = Object.values(updatedUserLibraryData);
                setUserLibraries(updatedLibrariesArray);

            } else {
                console.log("No current user.");
            }
        } catch (error) {
            console.error("Error removing shelf:", error);
        }
    };



    const cancelRemoveShelf = () =>{
        setShowRemoveModal(false);
    }


    /* */

    /* Adicionar shelf */

    const [newShelfName,setNewShelfName] = useState("");
    const [newShelfDescription,setNewShelfDescription]= useState("");

    const maxLength = 250;

    const openAddModal = () => {
        setShowAddModal(true);
        console.log("mostrar modal? ",showAddModal);
    };

    const cancelAddShelf = () =>{
        setShowAddModal(false);
    }

    const handleAddShelf = async (name, description) => {
        console.log(name);
        console.log(name.length);
        console.log(description);

        if (name.length > 0) {
            const formattedName = name
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .toLowerCase();

            const savedName = formattedName
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join('');

            try {
                if (currentUser) {
                    // Reference to the user's library document
                    const userLibraryDocRef = doc(librariesCollectionRef, currentUser.uid);

                    // Fetch the user's library data
                    const userLibraryDocSnapshot = await getDoc(userLibraryDocRef);

                    if (userLibraryDocSnapshot.exists()) {
                        // If the user's library document exists, extract the data
                        const userLibraryData = userLibraryDocSnapshot.data();

                        // Create a copy of the existing libraries
                        const librariesCopy = { ...userLibraryData };

                        // Add the new shelf to the copied libraries
                        librariesCopy[savedName] = {
                            created: new Date().toISOString(),
                            shelfName: name,
                            description: description,
                            books: {},
                        };

                        // Update the user's library document with the modified libraries
                        await updateDoc(userLibraryDocRef, librariesCopy);

                        // Log the updated user's library data to the console
                        console.log("User Library Data Updated:", librariesCopy);

                        // Update the userLibraries state after removal
                        const updatedUserLibraryData = (await getDoc(userLibraryDocRef)).data();
                        const updatedLibrariesArray = Object.values(updatedUserLibraryData);
                        setUserLibraries(updatedLibrariesArray);
                        setNewShelfName("");
                        setNewShelfDescription("");
                        setShowAddModal(false);
                    }
                }
            } catch (error) {
                console.error("Error adding shelf:", error);
            }
        } else {

            setShowAddModal(false);
            handleShowAlert({ isError: true, message: 'ShelfNeedsName' });
        }
    };


    /* */

    const handleNext = () =>{
        handleShowAlert({ isError: false, message: 'Library Created!' });
        if (handleComponentSwitch) {
            handleComponentSwitch("FindBooks");
        }
    }

    const handleBack = () =>{
        handleShowAlert({ isError: false, message: 'Back' });
        if (handleComponentSwitch) {
            handleComponentSwitch("BasicInfo");
        }
    }

    /* Handle Progress */

    handleProgress(30);

    /* */
    return (
        <>
            {showRemoveModal && (
                <>
                    <RemoveShelfFromUsersLibrary
                        showRemoveModal={showRemoveModal}
                        handleRemoveShelf={handleRemoveShelf}
                        cancelRemoveShelf={cancelRemoveShelf}
                        selectedShelf={selectedShelf}
                    />
                </>
            )}
            {showAddModal && (
                <>
                    <AddShelfToUsersLibrary
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        newShelfName={newShelfName}
                        setNewShelfName={setNewShelfName}
                        setNewShelfDescription={setNewShelfDescription}
                        newShelfDescription = {newShelfDescription}
                        handleAddShelf={handleAddShelf}
                        maxLength={maxLength}
                        handleShowAlert={handleShowAlert}
                        cancelAddShelf={cancelAddShelf}
                    />
                </>
            )}
            <div className="row align-items-center" style={{ marginTop: "2rem" }}>
                <div className="col-10 mx-auto titleFont" style={{ fontSize: "1.8rem", textAlign: "left" }}>
                    Create Your Personalized Library
                </div>
                <div
                    className="col-10 mx-auto billyGreyText"
                    style={{ fontWeight: "600", textAlign: "left", marginBottom: "2rem" }}
                >
                    Let's create your shelves. We suggest you 3 different shelves, but you can remove and add shelves as you please.
                </div>
                <div className="col-10 mx-auto">
                    <DisplayUserShelves shelves={userLibraries} openRemoveModal={openRemoveModal} />
                    <button
                        className="rounded-pill w-100 billySecondaryButton"
                        style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom:"2rem"}}
                        onClick={openAddModal}
                    >
                        Add new shelf
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
    );
}
