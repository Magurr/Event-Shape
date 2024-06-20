import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import {
  DialogTitle,
  Typography,
  TextField,
  Dialog,
  Checkbox,
  Button,
  Stack,
  Grid,
  InputLabel,
  FormControlLabel,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
  DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  arrayUnion,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

function Event(props) {
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
  // const analytics = getAnalytics(app);

  const initialEventId = parseInt(localStorage.getItem("eventId")) || 1;
  const [eventId, setEventId] = useState(initialEventId);
  const [formData, setFormData] = useState(null);
  const [eventDateTime, setEventDateTime] = useState(null);
  const [activeName, setActiveName] = useState("");
  const [activeSurname, setActiveSurname] = useState("");
  const [activeImgUrl, setActiveImgUrl] = useState("");
  const [joiners, setJoiners] = useState([]);
  const loggedUser = localStorage.getItem("loggedUser");

  useEffect(() => {
    localStorage.setItem("eventId", eventId);
  }, [eventId]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (loggedUser) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userName", "==", loggedUser));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]; // İlk belgeyi al
          const userData = userDoc.data(); // Verileri al
          setActiveName(userData.name);
          setActiveSurname(userData.surName);
        }
      }
    };

    fetchUserDetails();

    // localStorage değişikliklerini izlemek için event listener ekleyin
    const handleStorageChange = () => {
      fetchUserDetails();
    };
    window.addEventListener("storage", handleStorageChange);

    // cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loggedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const eventData = {
      name: activeName,
      surName: activeSurname,
      eventId: eventId,
      eventName: formData.get("eventName"),
      eventDesc: formData.get("eventDesc"),
      participant: formData.get("participant"),
      address: formData.get("address"),
      onlyFriends: formData.get("onlyFriends"),
      eventDateTime: dayjs(eventDateTime).format("YYYY-MM-DD HH:mm"),
      createdAt: dayjs().format("YYYY-MM-DD HH:mm"), // etkinliğin oluşturulma zamanı
      // eventDateTime: eventDateTime,
      joiners: joiners,
    };

    try {
      // await addDoc(collection(db, "users"), eventData);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userName", "==", loggedUser));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const file = formData.get("exContent");
        let fileURL = "";
        if (file && file.size > 0) {
          const storage = getStorage();
          const storageRef = ref(
            storage,
            `eventImages/${loggedUser}/${eventId}`
          ); // eventId'yi dosya yolunun bir parçası olarak ekliyoruz
          await uploadBytes(storageRef, file);
          fileURL = await getDownloadURL(storageRef);
          eventData.exContent = fileURL;
        }

        querySnapshot.forEach(async (doc) => {
          const userDocRef = doc.ref;
          await updateDoc(userDocRef, {
            events: arrayUnion(eventData),
          });
        });
        console.log("Event successfully added to the user's events!");
      } else {
        console.error("No matching user found");
      }

      // console.log("Document successfully written!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setFormData(eventData);
    console.log(eventDateTime);

    props.submitEvent(eventData);
    setEventId(eventId + 1);
    console.log(eventId);
    console.log("submitted");
  };

  return (
    <div>
      <Dialog open={props.isEventOpen} onClose={props.closeEvent}>
        <div className="form-popup">
          <form onSubmit={handleSubmit}>
            <DialogTitle>Create Event</DialogTitle>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Event Name" name="eventName" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Event Description"
                  name="eventDesc"
                  multiline
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Participant"
                  name="participant"
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Address" name="address" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    name="dateTime"
                    label="Event Date & Time"
                    value={eventDateTime}
                    onChange={(newValue) => setEventDateTime(newValue)}
                    // textField'i kullanarak renderInput'ı değiştirdik
                    slotProps={{
                      textField: {
                        fullWidth: true, // TextField'i tam genişliğe yayıyoruz
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="onlyFriends" />}
                  label="Only Friends"
                  labelPlacement="start"
                />
              </Grid>
              <Grid item xs={12}>
                <input type="file" name="exContent" />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={props.submitEvent}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Dialog>
      <div>{/* <EventCard event={formData} /> */}</div>
    </div>
  );
}

export default Event;
