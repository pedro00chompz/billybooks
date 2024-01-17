import {Modal, ModalBody} from "react-bootstrap";
import React from "react";

export default function RemoveFriendModal(props){

    const {openRemoveFriendModal,cancelRemoveFriend,friend,handleRemoveFriend} = props;

    console.log(friend);


    return (
        <Modal show={openRemoveFriendModal} onHide={cancelRemoveFriend} centered>
            <ModalBody>
                <p>Do you wish to remove the user <span className="fst-italic fw-bolder" style={{ color: "#196FFA" }}>{friend?.name} {friend?.surname}</span> from your friend list?</p>
                <div className="d-flex justify-content-between">
                    <button
                        className="rounded-pill billySecondaryButton col-4"
                        style={{ fontSize: "0.8rem" }}
                        onClick={() => handleRemoveFriend(friend?.userId)}
                    >
                        Confirm
                    </button>
                    <button
                        className="rounded-pill billyCancelButton col-4"
                        style={{ fontSize: "0.8rem" }}
                        onClick={cancelRemoveFriend}
                    >
                        Cancel
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
}