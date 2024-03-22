// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import { Redirect } from '@docusaurus/router';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getDatabase, ref, set } from "firebase/database";

// Configure Firebase.
const config = {
  apiKey: ,
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
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function ApppageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">Submit and Receive</p>
      </div>
    </header>
  );
}

let userId;

function SubmitForm() {
  let written = false;
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
      name: event.target.name.value,
      email: event.target.email.value
    }).then(() => {
      // Data saved successfully!
      window.location.replace("/display");
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

function SignInScreen() {
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

  const {siteConfig} = useDocusaurusContext();
  if (!isSignedIn) {
    return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <ApppageHeader />
      <main>
      <div align="center">
      <h2 align="center">Please sign-in:</h2>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
      </main>
    </Layout>
    );
  }
  else {
    userId = id;
    return (
      <Layout
        title={`${siteConfig.title}`}
        description="Description will go into a meta tag in <head />">
        <ApppageHeader />
        <main>
        <div align="center">
          <SubmitForm />
          <br></br>
          <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
        </div>
        </main>
      </Layout>
    );
  }
}

export default SignInScreen;

