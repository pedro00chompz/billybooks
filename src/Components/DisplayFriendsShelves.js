import {collection, doc, getDoc} from "firebase/firestore";
import {fireBaseDB} from "../FirebaseConfig/FirebaseConfig";
import {useEffect, useState} from "react";

export default function DisplayFriendsShelves(props){

    const {friend,handleBookClick} = props;

    console.log(friend);

    const userId = friend?.userId;
    const librariesCollectionRef = collection(fireBaseDB, "libraries");
    const [userShelves, setUserShelves] = useState(null);
    const [booksToShow, setBooksToShow] = useState({});

    useEffect(() => {
        const getUserLibrary = async () => {
            try {
                if (userId) {
                    const libraryDocRef = doc(librariesCollectionRef, userId);
                    const libraryDocSnapshot = await getDoc(libraryDocRef);

                    if (libraryDocSnapshot.exists()) {
                        const userLibrary = libraryDocSnapshot.data();
                        setUserShelves(userLibrary);

                        // Initialize booksToShow state for each shelf
                        const initialBooksToShow = {};
                        Object.keys(userLibrary).forEach((shelfName) => {
                            initialBooksToShow[shelfName] = 3;
                        });
                        setBooksToShow(initialBooksToShow);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        getUserLibrary();
    }, [userId]);

    console.log(userShelves);

    return (
        <>
            <div className="row text-start" style={{ paddingLeft: '1rem', paddingRight: '1rem', marginTop: '1rem' }}>
                {userShelves &&
                    Object.entries(userShelves)
                        .slice()
                        .filter(([key]) => key !== 'id')
                        .sort(([aKey, aData], [bKey, bData]) => {
                            // Move 'CurrentlyReading' shelf to the front
                            if (aKey === 'CurrentlyReading') return -1;
                            if (bKey === 'CurrentlyReading') return 1;

                            // Sort the rest based on the 'created' date
                            return new Date(bData.created) - new Date(aData.created);
                        })
                        .map(([shelfName, shelfData]) => (
                            <div key={shelfName} className="row text-start" style={{ paddingLeft: '1rem', paddingRight: '1rem', marginTop: '1rem' }}>
                                <h1 className="titleFont col-12" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{shelfData.shelfName}</h1>
                                {shelfData.books &&
                                    Object.values(shelfData.books)
                                        .slice(0, booksToShow[shelfName]) // Show only a limited number of books based on the shelf
                                        .map(book => (
                                            <div key={book.id} className="col-4" style={{ marginBottom: "1rem" }} onClick={() => handleBookClick(book)}>
                                                <img src={book.cover} alt={book.title} className="img-fluid" style={{ border: "0.05rem solid #D4D4D4" }} />
                                            </div>
                                        ))}

                                {Object.values(shelfData.books).length > booksToShow[shelfName] && (
                                    <div className="text-center text-decoration-underline"
                                         onClick={() => setBooksToShow(prev => ({ ...prev, [shelfName]: prev[shelfName] + 3 }))}
                                         style={{ fontSize: "0.8rem", color: "#196FFA", cursor: "pointer" }}
                                    >
                                        See More
                                    </div>
                                )}
                            </div>
                        ))}
            </div>
        </>
    );
}