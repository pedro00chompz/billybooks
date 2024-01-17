// SuggestFriendsToUser.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SuggestFriendsToUser = ({ users, generateRandomColor, setModalFriend, setShowFriendsModal, typeOfIcon }) => {
    return (
        <div style={{ maxHeight: '16rem', overflowY: 'auto', marginTop: "1rem" }}>
            <div>
                {users.length > 1 ? (
                    users.map((user, index) => {
                        const { backgroundColor, color } = generateRandomColor();

                        return (
                            <div key={index} style={{ marginBottom: "1rem", height: "3rem" }} className="row align-items-center">
                                <div className="col-4 text-start">
                                    {user.avatar ? (
                                        <img src={user.avatar} className="rounded-circle img-fluid" style={{ height: "3rem", width: "3rem" }} alt={`${user.name}'s avatar`} />
                                    ) : (
                                        <span className="titleFont d-flex align-items-center justify-content-center" style={{ backgroundColor, color, height: "3rem", width: "3rem", borderRadius: "100%" }}>{user.name ? user.name.charAt(0).toUpperCase() : 'B'}{user.surname ? user.surname.charAt(0).toUpperCase() : 'B'}</span>
                                    )}
                                </div>
                                <div className="col-6 text-start" style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                                    {user.name} {user.surname}
                                </div>
                                <div className="col-2">
                                    <FontAwesomeIcon
                                        icon={typeOfIcon}
                                        style={{ color: "#196FFA", cursor: "pointer" }}
                                        onClick={() => {
                                            setModalFriend(user);
                                            setShowFriendsModal(true);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="billyGreyText" style={{ fontSize: "0.8rem" }}>No users found.</div>
                )}
            </div>
        </div>
    );
};

export default SuggestFriendsToUser;
