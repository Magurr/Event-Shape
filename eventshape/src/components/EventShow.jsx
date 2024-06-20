import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import EventCard from "./EventCard";

function EventShow() {
  const firebaseConfig = {
    apiKey: "AIzaSyBJBTwygFE0hewlg_IBIDADjEBFIpSzQ28",
    authDomain: "event-shape.firebaseapp.com",
    projectId: "event-shape",
    storageBucket: "event-shape.appspot.com",
    messagingSenderId: "106516300464",
    appId: "1:106516300464:web:8c7c9e0cb0af3ef9c7b175",
    measurementId: "G-4CLFTMTGFF",
  };

  const [events, setEvents] = useState([]);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchData = () => {
      const usersRef = collection(db, "users");

      const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
        const allEvents = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.events) {
            allEvents.push(...userData.events);
          }
        });
        setEvents(allEvents);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventShow;
