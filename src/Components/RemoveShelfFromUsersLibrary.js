import React from 'react';
import { Modal, ModalBody } from 'react-bootstrap';

export default function RemoveShelfFromUsersLibrary(props) {

    const { showRemoveModal, handleRemoveShelf, cancelRemoveShelf, selectedShelf } = props;

    return (
        <Modal show={showRemoveModal} onHide={cancelRemoveShelf} centered>
            <ModalBody>
                <p>Do you wish to remove the shelf <span className="fst-italic fw-bolder" style={{ color: "#196FFA" }}>{selectedShelf}</span>?</p>
                <div className="d-flex justify-content-between">
                    <button
                        className="rounded-pill billySecondaryButton col-4"
                        style={{ fontSize: "0.8rem" }}
                        onClick={() => handleRemoveShelf(selectedShelf)}
                    >
                        Confirm
                    </button>
                    <button
                        className="rounded-pill billyCancelButton col-4"
                        style={{ fontSize: "0.8rem" }}
                        onClick={cancelRemoveShelf}
                    >
                        Cancel
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
}
