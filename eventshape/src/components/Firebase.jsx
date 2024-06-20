import React from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
function Firebase() {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBJBTwygFE0hewlg_IBIDADjEBFIpSzQ28",
    authDomain: "event-shape.firebaseapp.com",
    projectId: "event-shape",
    storageBucket: "event-shape.appspot.com",
    messagingSenderId: "106516300464",
    appId: "1:106516300464:web:8c7c9e0cb0af3ef9c7b175",
    measurementId: "G-4CLFTMTGFF",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const storage = getStorage(app);
  return <div>Firebase</div>;
}

export default Firebase;
