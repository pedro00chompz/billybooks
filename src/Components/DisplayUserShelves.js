// DisplayUserShelves.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const DisplayUserShelves = ({ shelves, openRemoveModal }) => {
    return (
        <>
            {shelves
                .slice()
                .sort((a, b) => new Date(b.created) - new Date(a.created))
                .map((shelf, index) => (
                    <div key={index} style={{ marginBottom: "2rem" }}>
                        <div className="row">
                            <p className="titleFont text-start col-10" style={{ marginBottom: "0.2rem" }}>{shelf.shelfName}</p>
                            <div className="col-2">
                                <FontAwesomeIcon
                                    icon={faClose}
                                    style={{ cursor: "pointer", color: "#EA242E" }}
                                    onClick={() => openRemoveModal(shelf.shelfName)}
                                />
                            </div>
                        </div>
                        <p className="billyGreyText text-start" style={{ fontSize: "0.8rem" }}>{shelf.description}</p>
                    </div>
                ))}
        </>
    );
};

export default DisplayUserShelves;
