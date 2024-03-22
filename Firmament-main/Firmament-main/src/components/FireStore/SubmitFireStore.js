import React, { useEffect, useState } from 'react';
import { db } from '@site/src/components/FireBase/Wrapper';
import firebase from 'firebase/compat/app';
import { collection, addDoc } from "firebase/firestore"; 

let userId;

function WriteToFirebase() {
  const handleSubmit = (event) => {
    event.preventDefault();
    addDoc(collection(db, "users"), {
      first: event.target.first.value,
      last: event.target.last.value,
      born: event.target.born.value
    }).then( (docRef) => {
      // Data saved successfully!
      window.location.replace("/docs/DisplayFirestore");  
    }).catch((e) => {
      console.error("Error adding document: ", e);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 align="center">Submit</h2>
      <label htmlFor="first">First name: </label>
      <input type="text" id="first" name="first"></input>
      <label style={{marginLeft:'5%'}} htmlFor="last">Last name: </label>
      <input type="text" id="last" name="last"></input><br></br>
      <label htmlFor="born">Year of birth: </label>
      <input type="text" id="born" name="born"></input><br></br>
      <button type="submit">Submit</button>
    </form>
  );
};

function SubmitFireStore() {
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
        <WriteToFirebase />
      </div>
    );
  }
}

export default SubmitFireStore;