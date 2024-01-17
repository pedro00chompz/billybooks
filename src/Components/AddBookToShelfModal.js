import { Modal, ModalBody } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { auth, fireBaseDB } from "../FirebaseConfig/FirebaseConfig";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";

export default function AddBookToShelfModal(props) {
    const {
        showAddBookToShelfModal,
        onHide,
        userLibrary,
        selectedBook,
    } = props;

    console.log("biblioteca: ", userLibrary);
    console.log("livro atual: ", selectedBook);

    console.log("0", userLibrary[0]);

    const [selectedShelves, setSelectedShelves] = useState([]);
    const librariesCollectionRef = collection(fireBaseDB, "libraries");
    const [temporaryShelves, setTemporaryShelves] = useState([]);
    const [checkedShelves, setCheckedShelves] = useState([]);

    const formatShelfName = (shelfName) => {
        return shelfName.replace(/([a-z])([A-Z])/g, '$1 $2');
    };

    const initialShelvesCopy = userLibrary[0]
        ? Object.keys(userLibrary[0]).map((shelfName) => {
            const formattedShowName = formatShelfName(shelfName);
            const shelf = userLibrary[0][shelfName];

            return {
                shelfName,
                ShowName: formattedShowName,
                checked: shelf.books && shelf.books[selectedBook.id] ? true : false,
                created: shelf.created,
            };
        })
        : [];

    console.log("forma inicial: ",initialShelvesCopy);

    useEffect(() => {
        const findShelfWithBook = async () => {
            const userId = auth.currentUser ? auth.currentUser.uid : null;

            try {
                console.log("Before reset: temporaryShelves", temporaryShelves);

                // Reset temporaryShelves before calling findShelfWithBook
                setTemporaryShelves([]);

                console.log("After reset: temporaryShelves", temporaryShelves);

                const librariesDocRef = doc(librariesCollectionRef, userId);
                const librariesDocSnapshot = await getDoc(librariesDocRef);

                if (librariesDocSnapshot.exists()) {
                    const userLibraryData = librariesDocSnapshot.data();

                    const shelvesWithBook = [];

                    // Iterate through each shelf
                    userLibraryData &&
                    Object.keys(userLibraryData).forEach((shelfName) => {
                        const formattedShowName = formatShelfName(shelfName);
                        const shelf = userLibraryData[shelfName];
                        const isBookInShelf = shelf.books && shelf.books[selectedBook.id];

                        // Check if the shelf is already in the result array
                        const existingShelfIndex = shelvesWithBook.findIndex(
                            (item) => item.shelfName === shelfName
                        );

                        if (isBookInShelf && existingShelfIndex === -1) {
                            // If the book is present in the shelf and not in the result array, add it
                            shelvesWithBook.push({
                                shelfName,
                                ShowName: formattedShowName,
                                checked: true,
                                created: shelf.created,
                            });
                        } else if (!isBookInShelf && existingShelfIndex === -1) {
                            // If the book is not present in the shelf and not in the result array, add it
                            shelvesWithBook.push({
                                shelfName,
                                showName: formattedShowName,
                                checked: false,
                                created: shelf.created,
                            });
                        } else if (existingShelfIndex !== -1) {
                            // If the shelf is already in the result array, update its checked status
                            shelvesWithBook[existingShelfIndex].checked = checkedShelves.includes(
                                shelfName
                            );
                        }
                    });

                    // Update the temporaryShelves state only once
                    setTemporaryShelves(shelvesWithBook);

                    console.log(
                        "After setTemporaryShelves: temporaryShelves",
                        temporaryShelves
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };

        // Call findShelfWithBook
        findShelfWithBook();
    }, []);

    // Remove duplicates from temporaryShelves
    const uniqueShelves = temporaryShelves.filter(
        (shelf, index, self) =>
            index === self.findIndex((s) => s.shelfName === shelf.shelfName)
    );

    console.log("biblioteca temporária: ", uniqueShelves);

    const handleCheckboxChange = (shelfName) => {
        setTemporaryShelves((prev) => {
            return prev.map((shelf) => {
                if (shelf.shelfName === shelfName) {
                    // Toggle the checked value
                    return { ...shelf, checked: !shelf.checked };
                }
                return shelf;
            });
        });
    };

    const handleConfirm = async () => {
        // Obtém o ID do usuário autenticado, se disponível
        const userId = auth.currentUser ? auth.currentUser.uid : null;

        try {
            // Referência ao documento da coleção de bibliotecas do usuário
            const librariesDocRef = doc(librariesCollectionRef, userId);

            // Detalhes do livro a ser adicionado
            const bookToAdd = {
                id: selectedBook.id,
                title: selectedBook.title,
                authors: selectedBook.authors,
                description: selectedBook.description,
                cover: selectedBook.cover,
                category: Array.isArray(selectedBook.categories) ? selectedBook.categories : [],
                publishedDate: selectedBook.publishedDate,
                added: new Date().toISOString(),
            };

            // Cria uma cópia atualizada da biblioteca do usuário
            const updatedLibrary = { ...userLibrary[0] };

            uniqueShelves.forEach((shelf) => {
                const { shelfName, checked } = shelf;

                if (checked) {
                    // Se a prateleira estiver marcada, adiciona o livro a ela
                    if (!updatedLibrary[shelfName].books) {
                        // Se a prateleira não tiver a propriedade books, crie-a
                        updatedLibrary[shelfName].books = {};
                    }

                    updatedLibrary[shelfName].books[bookToAdd.id] = bookToAdd;
                } else {
                    // Se a prateleira estiver desmarcada, remove o livro dela
                    if (updatedLibrary[shelfName].books) {
                        delete updatedLibrary[shelfName].books[bookToAdd.id];
                    }
                }
            });

            // Atualiza o documento da biblioteca na base de dados
            await updateDoc(librariesDocRef, updatedLibrary);

            console.log("Operação concluída com sucesso!");
        } catch (error) {
            console.error(error);
        }

        // Oculta o modal após o processamento
        onHide();
    };



    console.log("checked: ", checkedShelves);

    return (
        <>
            <Modal show={showAddBookToShelfModal} onHide={() => onHide()} centered>
                <ModalBody>
                    <div className="row">
                        <div className="col-3">
                            <img
                                src={selectedBook.cover}
                                alt={selectedBook.title}
                                style={{ width: "100%", height: "auto", objectFit: "cover", border:"0.05rem solid #6F6F6F" }}
                            />
                        </div>
                        <p className="col-9">
                            Where do you wish to save{" "}
                            <span
                                className="fst-italic fw-bolder"
                                style={{ color: "#196FFA" }}
                            >
                {selectedBook.title}
              </span>
                        </p>
                        <div style={{ maxHeight: '14rem', overflowY: 'auto', marginTop:"1rem" }}>
                            {userLibrary[0] &&
                                Object.entries(userLibrary[0])
                                    .filter(([key, value]) => key !== 'id')  // Exclude 'id' property
                                    .sort(([, shelfA], [, shelfB]) => new Date(shelfB.created) - new Date(shelfA.created))  // Sort by 'created' property
                                    .map(([shelfName, shelfInfo]) => {
                                        const correspondingShelf = uniqueShelves.find(
                                            (shelf) => shelf.shelfName === shelfName
                                        );
                                        const isChecked = correspondingShelf
                                            ? correspondingShelf.checked
                                            : false;

                                        return (
                                            <div
                                                key={shelfName}
                                                className="form-check"
                                                style={{ marginBottom: "1rem" }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={shelfName}
                                                    checked={isChecked}
                                                    onChange={() => handleCheckboxChange(shelfName)}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={shelfInfo.shelfName}
                                                    style={{}}
                                                >
                                                    <span className="titleFont">{shelfInfo.shelfName}</span>
                                                    <br />
                                                    <span className="billyGreyText" style={{ fontSize: "0.8rem" }}>
                            {shelfInfo.description}
                          </span>
                                                </label>
                                            </div>
                                        );
                                    })}
                        </div>
                    </div>
                    <div className="d-flex justify-content-between" style={{marginTop:"1rem"}}>
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
                            onClick={() => onHide()}
                        >
                            Cancel
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
