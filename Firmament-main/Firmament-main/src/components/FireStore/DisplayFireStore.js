import React, { useEffect, useState } from 'react';
import { db } from '@site/src/components/FireBase/Wrapper';
import firebase from 'firebase/compat/app';
import { collection, doc, getDocs } from "firebase/firestore"; 

let userId;

function ReadFromFirebase() {
  const [data, setData] = useState([]);
  getDocs(collection(db, "users")).then((querySnapshot) => {
    var arrData = [];
    querySnapshot.forEach((doc) => {
      //console.log(`${doc.id} => ${doc.data()}`);
      arrData.push(doc.data());
    });
    setData(arrData);
  }).catch((e) => {
    console.error("Error querying document: ", e);
  });
  //console.log(data);
  if (!!data) {
    var renderedTags = data.map((item, index) => <div key={index}> {item["first"]} {item["last"]} is born in {item["born"]} </div>)
    return (
      <div>
        {renderedTags}
      </div>
    );
  }
}
 
function DisplayFireStore() {
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

export default DisplayFireStore;