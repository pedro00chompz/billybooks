// AddFriendModal.js
import React from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const AddFriendModal = ({ show, onCancel, onConfirm, friend }) => {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <ModalBody>
                <p>
                    Do you wish to add{' '}
                    {friend && (
                        <span className="fst-italic fw-bolder" style={{ color: '#196FFA' }}>
              {friend.name} {friend.surname}
            </span>
                    )}{' '}
                    to your friendslist?
                </p>
                <div className="d-flex justify-content-between">
                    <button
                        className="rounded-pill billySecondaryButton col-4"
                        style={{ fontSize: '0.8rem' }}
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                    <button
                        className="rounded-pill billyCancelButton col-4"
                        style={{ fontSize: '0.8rem' }}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default AddFriendModal;
