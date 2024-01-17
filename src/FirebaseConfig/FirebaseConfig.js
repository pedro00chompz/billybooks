import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider,onAuthStateChanged} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import {getStorage,ref,uploadBytes} from "firebase/storage";
import {useState,useEffect} from "react";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA9bcuwb_3Df9gaX8yd4GhJSATPhyDbV0U",
    authDomain: "billybooks-fd184.firebaseapp.com",
    projectId: "billybooks-fd184",
    storageBucket: "billybooks-fd184.appspot.com",
    messagingSenderId: "49651883822",
    appId: "1:49651883822:web:eb24365686f64bc30c24bf",
    measurementId: "G-9QH9NH9ELG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()

//FireStore
export const fireBaseDB = getFirestore();
const storage = getStorage();

// Custom Hook

export function useAuth(){
    const [currentUser,setCurrentUser] = useState();

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,user=>setCurrentUser(user));
        return unsub;
    },[])
    return currentUser;
}

// Storage Function

export async function upload(file, currentUser) {
    // Check if currentUser is defined before proceeding
    if (!currentUser) {
        console.error("Current user is undefined");
        return;
    }

    const fileRef = ref(storage, `${currentUser.uid}.png`);

    try {
        const snapshot = await uploadBytes(fileRef, file);
        console.log("File uploaded successfully:", snapshot);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}