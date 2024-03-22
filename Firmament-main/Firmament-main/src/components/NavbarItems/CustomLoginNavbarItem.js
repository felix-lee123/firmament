// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
//import { Redirect } from '@docusaurus/router';
//import clsx from 'clsx';
//import Layout from '@theme/Layout';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
//import styles from '@site/src/pages/index.module.css';
//import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

// Configure Firebase.
const config = {
apiKey: "AIzaSyD8EcwY-enP40uMOK41581WZoflCPzU1sI",
authDomain: "firmament-a19df.firebaseapp.com",
databaseURL: "https://firmament-a19df-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "firmament-a19df",
storageBucket: "firmament-a19df.appspot.com",
messagingSenderId: "159820547097",
appId: "1:159820547097:web:09a3ee1677029d8f901688",
measurementId: "G-3SFMRPYT0B"
};
firebase.initializeApp(config);

// Configure FirebaseUI.
const uiConfig = {
// Popup signin flow rather than redirect flow.
signInFlow: 'popup',
// Display Google auth providers.
signInOptions: [
firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//firebase.auth.FacebookAuthProvider.PROVIDER_ID,
firebase.auth.EmailAuthProvider.PROVIDER_ID
],
callbacks: {
// Avoid redirects after sign-in.
signInSuccessWithAuthResult: () => false,
},
};

let userId;

function CustomLoginNavbarItem() {
const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
const [id, setId] = useState(); // Local userId
const [isHover, setIsHover] = useState(false);

// Listen to the Firebase Auth state and set the local state.
useEffect(() => {
const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
setIsSignedIn(!!user);
if(!!user) setId(user.uid);
});
return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
}, []);

if (!isSignedIn) {
return (
<div>
<a href="" onMouseEnter={()=>setIsHover(true)} onMouseLeave={()=>setIsHover(false)} className="navbar__item navbar__link">Log in</a>
<div style={{display:isHover?'block':'none',position:'absolute'}} onMouseEnter={()=>setIsHover(true)} onMouseLeave={()=>setIsHover(false)}>
<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
</div>
</div>
);
}
else {
userId = id;
return (
<a href="" onClick={() => firebase.auth().signOut()} className="navbar__item navbar__link">Log out</a>
);
}
}

export default CustomLoginNavbarItem;
