import React from "react";
import { Modal, ModalBody } from "react-bootstrap";

const AddShelfToUsersLibrary = ({
                                    showAddModal,
                                    setShowAddModal,
                                    setNewShelfName,
                                    setNewShelfDescription,
                                    handleAddShelf,
                                    maxLength,
                                    handleShowAlert,
                                    cancelAddShelf,
                                    newShelfDescription,
                                    newShelfName
                                }) => {
    return (
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
            <ModalBody>
                <form>
                    <label
                        htmlFor="shelfName"
                        style={{
                            marginBottom: "0.5rem",
                            display: "block",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                        }}
                    >
                        Shelf Name
                    </label>
                    <input
                        type="text"
                        style={{ marginBottom: "1rem" }}
                        className="billyInput rounded d-block col-12"
                        id="newShelfNameId"
                        placeholder="Name this shelf"
                        onChange={(event) => {
                            setNewShelfName(event.target.value);
                        }}
                    />
                    <label
                        htmlFor="shelfName"
                        style={{
                            marginBottom: "0.5rem",
                            display: "block",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                        }}
                    >
                        Shelf Name
                    </label>
                    <textarea
                        rows="5"
                        style={{ marginBottom: "1rem" }}
                        className="billyInput rounded d-block col-12"
                        id="newShelfDescriptionId"
                        placeholder="Describe this shelf (max: 250 characters)"
                        maxLength={maxLength}
                        onChange={(event) => {
                            const description = event.target.value;
                            if (description.length <= maxLength) {
                                setNewShelfDescription(description);
                            } else {
                                handleShowAlert({
                                    isError: true,
                                    errorName: "descriptionTooLong",
                                });
                            }
                        }}
                    />
                    <div
                        style={{
                            marginTop: "0.5rem",
                            color: newShelfDescription.length > maxLength ? "red" : "inherit",
                        }}
                    >
                        {newShelfDescription.length}/{maxLength} characters
                    </div>
                </form>
                <div
                    className="d-flex justify-content-between"
                    style={{ marginTop: "2rem" }}
                >
                    <button
                        className="rounded-pill billySecondaryButton col-4"
                        style={{ fontSize: "0.8rem" }}
                        onClick={() =>
                            handleAddShelf(newShelfName, newShelfDescription)
                        }
                    >
                        Confirm
                    </button>
                    <button
                        className="rounded-pill billyCancelButton col-4"
                        style={{ fontSize: "0.8rem" }}
                        onClick={cancelAddShelf}
                    >
                        Cancel
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default AddShelfToUsersLibrary;
