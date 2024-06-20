import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDocs,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import Login from "./Login";
function User() {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [name, setName] = useState("");
  const [surName, setSurName] = useState("");
  const [userId, setUserId] = useState(null);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);

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
  const db = getFirestore(app);

  const initialUserId = parseInt(localStorage.getItem("userId")) || 1;
  const [PreuserId, setPreUserId] = useState(initialUserId);

  useEffect(() => {
    localStorage.setItem("userId", PreuserId);
  }, [PreuserId]);

  const createUser = async () => {
    const userProp = {
      userName: "user3",
      passWord: "user3",
      name: "Mert",
      surName: "Arslan",
      userId: PreuserId,
      events: events,
      posts: posts,
    };
    try {
      const userRef = collection(db, "users"); // Kullanıcı koleksiyonu referansı
      const snapshot = await getDocs(userRef);
      let isUserUnique = true;

      // Koleksiyon içinde dön
      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.userName === userProp.userName) {
          // Bu kullanıcı adı zaten var
          isUserUnique = false;
          return;
        }
      });
      if (isUserUnique) {
        await addDoc(userRef, { ...userProp });
        setPreUserId(PreuserId + 1);
        console.log("Kullanıcı başarıyla eklendi.");
      } else {
        console.log("Bu kullanıcı adı zaten var.");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div>
      <Login createUser={createUser} />
    </div>
  );
}

export default User;
