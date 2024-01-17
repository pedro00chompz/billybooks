import React, { useState, useEffect } from "react";
import {auth, fireBaseDB, useAuth} from "../FirebaseConfig/FirebaseConfig";
import {collection, doc, setDoc, updateDoc} from "firebase/firestore";





export default function BasicInfo(props) {

    const {handleShowAlert,handleComponentSwitch} = props;

    const [name,setName] = useState("");
    const [surname,setSurname] = useState("");
    const [day,setDay] = useState("");
    const [month,setMonth] = useState("");
    const [birthyear,setBirthyear] = useState("");
    const [birthday,setBirthday] = useState("");
    const [country,setCountry] = useState("");
    const [countryList, setCountryList] = useState([]);

    const usersCollectionRef = collection(fireBaseDB,"users");
    const librariesCollectionRef = collection(fireBaseDB,"libraries");

    const currentUser = useAuth();


    /* Algoritmo para gerar cores aleatórias no input de meter imagens */

    const [randomBackgroundColor, setRandomBackgroundColor] = useState("#196FFA");
    const [randomColor, setRandomColor] = useState("#D1E2FE");

    const generateRandomColor = () => {
        const colorsArray = [
            ["#196FFA", "#D1E2FE"],
            ["#70163C", "#FFBDD9"],
            ["#FAB019", "#FEEFD1"],
            ["#E03616", "#FFCBC2"],
            ["#21D775", "#BDFFDB"],
            ["#D77821", "#FFE5CE"],
            ["#9F32F4", "#EAD0FF"],
            ["#42E3C6", "#DDFFF9"],
            ["#E342CA", "#FFD0F8"],
        ];

        const randomNumber = Math.floor(Math.random() * colorsArray.length);

        const newRandomBackgroundColor = colorsArray[randomNumber][0];
        const newRandomColor = colorsArray[randomNumber][1];

        setRandomBackgroundColor(newRandomBackgroundColor);
        setRandomColor(newRandomColor);
    };

    useEffect(() => {
        generateRandomColor();
    }, []);


    /* */

    /* Birthday set */


    useEffect(() => {
        setDay("");
    }, []);


    const handleDayChange = (value) => {
        console.log("Day is: ", value);
        setDay(value);
    };

    useEffect(() => {
        setMonth("");
    }, []);


    const handleMonthChange = (value) => {
        console.log("Month is: ", value);
        setMonth(value);
    };

    useEffect(() => {
        setBirthyear("");
    }, []);

    const handleYearChange = (value) => {
        console.log("Year is: ", value);
        setBirthyear(value);
    };

    useEffect(() => {
        setBirthday(`${day} ${month} ${birthyear}`);
    }, [day, month, birthyear]);

/* */
    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then((response) => response.json())
            .then((data) => {
                const countries = data.map((countryData) => countryData.name.common);
                setCountryList(countries);
            })
            .catch((error) => {
                console.error("Error fetching countries:", error);
            });
    }, []);

    const handleCountryChange = (value) => {
            setCountry(value);
            console.log(country);
    };

    /* */

    const handleBasicInfo = async (event) => {
        event.preventDefault();

        const userId = auth.currentUser ? auth.currentUser.uid : null;

        // Check if all required fields are filled
        if (!name || !surname || !birthday || !country) {
            handleShowAlert({ isError: true, errorName: 'missingFields' });
            return;
        }

        try {
            // Update the user document in Firestore
            const userDocRef = doc(usersCollectionRef, userId);

            await updateDoc(userDocRef, {
                name: name,
                surname: surname,
                birthday: birthday,
                country: country,
                avatar: isPhotoUploaded ? profileImage : null,
            });

            const librariesDocRef = doc(librariesCollectionRef,userId);

            await setDoc(librariesDocRef,{
                    Favourites: {
                        created: "2023-12-29T13:20:43.138Z",
                        shelfName: "Favourites",
                        description:"Your cherished reads find a home here. The Favorites Shelf holds the books that touched your heart, always ready for a revisit.",
                        books:{
                        },
                    },
                    Read:{
                        created: "2023-12-29T13:22:43.138Z",
                        shelfName: "Read",
                        description:"Completed tales reside here. The Read Shelf is a gallery of conquered books, a visual journey through stories once explored.",
                        books:{
                        },
                    },
                    CurrentlyReading:{
                        created: "2023-12-29T13:28:43.138Z",
                        shelfName: "Currently Reading",
                        description:"Your reading now lives here. The Currently Reading Shelf tracks your ongoing adventures, making multitasking a breeze.",
                        books:{
                        },
                    },
            })

            handleShowAlert({ isError: false, message: 'User information updated successfully!' });

            if (handleComponentSwitch) {
                handleComponentSwitch("CreateShelves");
            }

        } catch (error) {

            console.error("Error updating user information:", error);
            handleShowAlert({ isError: true, errorName: 'updateError' });
        }
    };

    /* */

    /* Handle Image */

    const [photoURL,setPhotoURL] = useState();
    const [photo,setPhoto] = useState(null);
    const [profileImage, setProfileImage] = useState();
    const [imageSizeError, setImageSizeError] = useState(false);
    const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);



    const handleImageChange = (event) => {
        const file = event.target.files[0];

        // Check if a file is selected
        if (!file) {
            return;
        }

        // Check the file size (in bytes)
        const fileSize = file.size;

        // Set the maximum allowed file size (in bytes)
        const maxFileSize = 1048487;

        if (fileSize > maxFileSize) {
            // Display an error message when the file size exceeds the limit
            setImageSizeError(true);
            // Optionally, you can clear the file input
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setProfileImage(reader.result);
            setIsPhotoUploaded(true); // Set to true when an image is uploaded
        };

        reader.readAsDataURL(file);

        setPhoto(file);
    };


    useEffect(()=>{
        if (currentUser){
            setPhotoURL(currentUser.photoURL);
        }
    },[currentUser])



    return (
        <>
            <div className="row align-items-center" style={{ marginTop: "2rem" }}>
                <div
                    className="col-10 col-md-12 text-md-center mx-auto titleFont"
                    style={{ fontSize: "1.8rem", textAlign: "left" }}
                >
                    Let’s Create Your Profile
                </div>
                <div
                    className="col-10 col-md-12 text-md-center mx-auto billyGreyText"
                    style={{ fontWeight: "600", textAlign: "left" }}
                >
                    First, let’s start with your general info
                </div>
                <div
                    className="d-flex justify-content-center align-items-center mx-auto"
                    style={{
                        width: '8rem',
                        height: '8rem',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        backgroundColor: `${randomBackgroundColor}`,
                        color: `${randomColor}`,
                        position: 'relative',
                        marginTop: "2rem",
                        marginBottom: "1rem",
                    }}
                >
                    {isPhotoUploaded ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            style={{ width: 'auto', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span className="titleFont" style={{ fontSize: "2rem" }}>
            {name ? name.charAt(0).toUpperCase() : 'B'}
                            {surname ? surname.charAt(0).toUpperCase() : 'B'}
        </span>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        id="profileImage"
                        onChange={handleImageChange}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                        }}
                    />
                </div>
                <p className="billyGreyText" style={{fontSize:"0.8rem", fontWeight:"600"}}>Click above to add your profile photo</p>
                <form className="col-10 mx-auto">
                    <div className="form-group text-start">
                        <label htmlFor="email" style={{ marginBottom: "0.5rem", display: "block", fontSize:"0.9rem",fontWeight:"600"  }}>
                            First Name
                        </label>
                        <input
                            type="text"
                            className="billyInput rounded d-block col-12"
                            id="firstName"
                            placeholder="Enter your first name here"
                            onChange={(event)=>{(setName(event.target.value)); console.log("name: ",name)}}
                        />
                    </div>
                    <div className="form-group text-start">
                        <label htmlFor="email" style={{ marginTop: "1rem",marginBottom: "0.5rem", display: "block", fontSize:"0.9rem",fontWeight:"600"  }}>
                            Last Name
                        </label>
                        <input
                            type="text"
                            className="billyInput rounded d-block col-12"
                            id="surname"
                            placeholder="Enter your last name here"
                            onChange={(event)=>{(setSurname(event.target.value)); console.log("surname: ",surname)}}
                        />
                    </div>
                    <div className="form-group text-start">
                        <label htmlFor="birthday" style={{ marginTop: "1rem",marginBottom: "0.5rem", display: "block", fontSize:"0.9rem",fontWeight:"600"  }}>
                            Birthday
                        </label>
                        <div className="col-12">
                            <select
                                style={{ marginRight: "1rem" }}
                                className="billyInput rounded col-3"
                                id="day"
                                value={day}
                                onChange={(event) => handleDayChange(event.target.value)}
                            >
                                <option value="" disabled>dd</option>
                                {Array.from({ length: 31 }, (_, index) => index + 1).map((dayNumber) => (
                                    <option key={dayNumber} value={dayNumber}>
                                        {dayNumber}
                                    </option>
                                ))}
                            </select>
                            <select
                                style={{marginRight:"1rem", paddingLeft:"0.5rem"}}
                                className="billyInput rounded col-3"
                                id="month"
                                value={month}
                                onChange={(event) => handleMonthChange(event.target.value)}
                            >
                                <option value="" disabled>mm</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                            <select
                                style={{ paddingLeft: "1rem" }}
                                className="billyInput rounded col-4"
                                id="year"
                                value={birthyear}
                                onChange={(event) => handleYearChange(event.target.value)}
                            >
                                <option value="" disabled>yyyy</option>
                                {Array.from({ length: 101 }, (_, index) => new Date().getFullYear() - index).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group text-start">
                        <label htmlFor="country" style={{ marginTop: "1rem",marginBottom: "0.5rem", display: "block", fontSize:"0.9rem",fontWeight:"600"  }}>
                            Country
                        </label>
                        <select
                            style={{ marginRight: "1rem" }}
                            className="billyInput rounded col-12"
                            id="day"
                            value={country}
                            onChange={(event) => handleCountryChange(event.target.value)}
                        >
                            <option value="" disabled>Select your Country</option>
                            {countryList.sort().map((countryName) => (
                                <option key={countryName} value={countryName}>
                                    {countryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="rounded-pill w-100 billyPrimaryButton"
                        style={{ marginTop: "1rem", marginBottom: "2rem", fontSize: "0.8rem"}}
                        onClick={handleBasicInfo}
                    >
                        Next
                    </button>
                </form>
            </div>
        </>
    );
}
