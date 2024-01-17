import RemoveShelfFromUsersLibrary from "../Components/RemoveShelfFromUsersLibrary";
import AddShelfToUsersLibrary from "../Components/AddShelfToUsersLibrary";
import React, {useEffect, useState} from "react";
import {fireBaseDB, useAuth} from "../FirebaseConfig/FirebaseConfig";
import {collection, deleteField, doc, getDoc, updateDoc} from "firebase/firestore";
import DisplayUserShelves from "../Components/DisplayUserShelves";

export default function EditMyShelves(props){

    const {userInfo} = props;

    const userId = userInfo?.userId;

    const librariesCollectionRef = collection(fireBaseDB, "libraries");
    const [userLibraries, setUserLibraries] = useState([]);

    const [selectedShelf, setSelectedShelf] = useState(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showAddModal,setShowAddModal] = useState(false);

    const [showAlert,setShowAlert] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");

    const handleShowAlert = (errorInfo) => {
        console.log(errorInfo);
        console.log("antes: ", showAlert);

        // Use the callback form of setShowAlert to ensure you get the updated state
        setShowAlert((prevShowAlert) => {
            console.log("depois: ", !prevShowAlert);
            return errorInfo.isError;
        });

        setErrorMessage(errorInfo.errorName);




    };

    useEffect(() => {
        const fetchUserLibraries = async () => {
            if (userId) {
                try {
                    // Reference to the user's library document
                    const userLibraryDocRef = doc(librariesCollectionRef, userId);

                    // Fetch the user's library data
                    const userLibraryDocSnapshot = await getDoc(userLibraryDocRef);

                    if (userLibraryDocSnapshot.exists()) {
                        // If the user's library document exists, extract the data
                        const userLibraryData = userLibraryDocSnapshot.data();

                        // Exclude the 'id' property
                        const filteredLibraryData = Object.keys(userLibraryData)
                            .filter(key => key !== 'id' && userLibraryData.hasOwnProperty(key))
                            .reduce((obj, key) => {
                                obj[key] = userLibraryData[key];
                                return obj;
                            }, {});

                        // Convert the properties of filteredLibraryData into an array
                        const librariesArray = Object.values(filteredLibraryData);

                        setUserLibraries(librariesArray);

                        // Log the user's library data to the console
                        console.log("User Library Data:", filteredLibraryData);
                    } else {
                        console.log("User library document does not exist.");
                    }
                } catch (error) {
                    console.error("Error fetching user libraries:", error);
                }
            }
        };

        fetchUserLibraries();
    }, [userId]);



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
            if (userId) {
                const userLibraryDocRef = doc(librariesCollectionRef, userId);

                console.log("prateleira:",savedName);
                console.log("id do user:",userId);

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
                if (userId) {
                    // Reference to the user's library document
                    const userLibraryDocRef = doc(librariesCollectionRef, userId);

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


    return(
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
            <div className="row align-items-center" style={{ marginTop: "2rem"}}>
                <h1 className="titleFont col-12 text-start" style={{ fontSize: '1.2rem', marginLeft:"1.5rem" }}>My Shelves</h1>

                <div className="col-10 mx-auto">
                    <div style={{marginBottom:"2rem",marginTop:"2rem"}}>

                        <DisplayUserShelves shelves={userLibraries} openRemoveModal={openRemoveModal} />
                        <button
                            className="rounded-pill w-100 billySecondaryButton"
                            style={{ fontSize: "0.8rem", fontWeight: "700", marginBottom:"2rem"}}
                            onClick={openAddModal}
                        >
                        Add new shelf
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}