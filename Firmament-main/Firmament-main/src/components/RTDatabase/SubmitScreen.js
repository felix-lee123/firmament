// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import { Redirect } from '@docusaurus/router';
import { rtdb } from '@site/src/components/FireBase/Wrapper';
import firebase from 'firebase/compat/app';
import { ref, set } from "firebase/database";

let userId;

function SubmitForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    set(ref(rtdb, 'users/' + userId), {
      name: event.target.name.value,
      email: event.target.email.value
    }).then(() => {
      // Data saved successfully!
      window.location.replace("/docs/Display");
    }).catch((e) => {
      console.error("Error adding to database: ", e);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 align="center">Submit</h2>
      <label htmlFor="name">Name: </label>
      <input type="text" id="name" name="name"></input><br></br>
      <label htmlFor="email">Email address: </label>
      <input type="email" id="email" name="email"></input><br></br>
      <button type="submit">Submit</button>
    </form>
  );
};

function SubmitScreen() {
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
        <SubmitForm />
      </div>
    );
  }
}

export default SubmitScreen;

