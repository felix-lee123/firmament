import React, { useEffect, useState } from 'react';
import { rtdb } from '@site/src/components/FireBase/Wrapper';
import firebase from 'firebase/compat/app';
import { ref, child, get } from "firebase/database";

let userId;

function ReadFromFirebase() {  
  const [data, setData] = useState({
    name: "",
    email: ""
  });
  const dbRef = ref(rtdb);
  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      setData(snapshot.val());
    } else {
      console.log("User's data not found!")
    }
  }).catch((error) => {
    console.error(error);
  });
  if (data) {
    return (
      <div>
        {data["name"]}'s email is {data["email"]}
      </div>
    );
  }
  else {
    return (
      <div align="center">
        <p>User's data not found!</p>
      </div>
    );
  }
}
 
function DisplayScreen() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [id, setId] = useState(); // Local userId

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
      <div align="center">
        <h2 align="center">Please log in</h2>
      </div>
    );
  }
  else {
    userId = id;
    return (
      <div align="center">
        <h2 align="center">Display</h2>
        <ReadFromFirebase />
      </div>
    );
  }
}

export default DisplayScreen;