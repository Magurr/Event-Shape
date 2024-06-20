import React, { useState, useEffect } from "react";
import styles from "./Login.module.css";
import User from "./User";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDocs,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";

const Login = ({ createUser }) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBJBTwygFE0hewlg_IBIDADjEBFIpSzQ28",
    authDomain: "event-shape.firebaseapp.com",
    projectId: "event-shape",
    storageBucket: "event-shape.appspot.com",
    messagingSenderId: "106516300464",
    appId: "1:106516300464:web:8c7c9e0cb0af3ef9c7b175",
    measurementId: "G-4CLFTMTGFF",
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  localStorage.setItem("loggedUser", "");

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage("");
      }, 3000); // 4 saniye sonra mesajı temizle
    }
    return () => clearTimeout(timer); // Bileşen unmount olduğunda veya message değiştiğinde timeout'u temizle
  }, [message]);

  const handleLogin = async () => {
    // Burada login işlemi yapılabilir
    try {
      const userRef = collection(db, "users"); // Kullanıcı koleksiyonu referansı
      const snapshot = await getDocs(userRef);

      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.userName === username && userData.passWord === password) {
          localStorage.setItem("loggedUser", username);
          console.log(username, "giriş yaptı.");
          navigate("/home");
          // console.log(localStorage.getItem("loggedUser"));
          throw new Error("Giriş Başarılı!");
        }
      });
      setMessage("Invalid Username or Password!");
      console.log("Invalid username or password");
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  const handleNewUser = async (e) => {
    e.preventDefault();
    console.log("handleNewUser çağrıldı");
    console.log("createUser fonksiyonu:", createUser);
    try {
      await createUser();
      console.log("Kullanıcı oluşturuldu.");
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div>
      <div className={styles.create_user}>
        <button className={styles.create_user_button} onClick={handleNewUser}>
          Create User
        </button>
      </div>
      <div className={styles.login_maindiv}>
        <div
          className={styles.login_message}
          style={{ backgroundColor: message ? "chocolate" : "transparent" }}
        >
          {message && <p>{message}</p>}
        </div>
        <div className={styles.login_subdiv}>
          <form
            className={styles.login_form}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              className={styles.login}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password" // Password alanı type="password" olmalı
              className={styles.login}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="button"
              value="Login"
              className={styles.login_button}
              onClick={handleLogin}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
