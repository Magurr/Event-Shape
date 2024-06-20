import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  CardMedia,
  Box,
  Grid,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

function EventCard({ event }) {
  const db = getFirestore();

  if (!event) {
    return null; // event props'u null veya undefined ise, bileşen null döndürsün
  }

  const [currentEvent, setCurrentEvent] = useState(event);
  const [participantCount, setParticipantCount] = useState(
    event.joiners.length
  );

  useEffect(() => {
    // Event joiners güncellendiğinde participantCount güncelle
    setParticipantCount(event.joiners.length);
  }, [event.joiners.length]);

  const handleJoin = async (
    eventId,
    event,
    setParticipantCount,
    setCurrentEvent
  ) => {
    const loggedUser = localStorage.getItem("loggedUser");

    if (!loggedUser) {
      console.log("No logged user found");
      return;
    }

    try {
      const userRef = collection(db, "users");
      const snapshot = await getDocs(userRef);

      for (const docSnapshot of snapshot.docs) {
        const userData = docSnapshot.data();

        // Check if the user has the event with eventId in their events array
        const eventIndex = userData.events.findIndex(
          (event) => event.id === eventId
        );
        if (eventIndex !== -1) {
          const userEvent = userData.events[eventIndex];

          // Update joiners array if the loggedUser is not already in it
          if (!userEvent.joiners.includes(loggedUser)) {
            userEvent.joiners.push(loggedUser);
            const userDocRef = doc(db, "users", docSnapshot.id);
            await updateDoc(userDocRef, {
              events: userData.events,
            });

            setParticipantCount(userEvent.joiners.length);
            console.log(`User ${loggedUser} joined event ${eventId}`);

            // Reset event to null
            setCurrentEvent(null); // Assuming setCurrentEvent is used to update the current event state
            return;
          } else {
            console.log(`User ${loggedUser} already joined event ${eventId}`);
            return;
          }
        }
      }

      console.log(`Event with id ${eventId} not found for any user`);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div>
      <Card
        sx={{
          maxWidth: 600,
          margin: "20px auto",
          backgroundColor: "rgb(111, 102, 57)",
        }}
      >
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle2" component="div">
                {`${event.name} ${event.surName}`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                {dayjs(event.createdAt).format("YYYY-MM-DD HH:mm")}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        {event.exContent && (
          <CardMedia
            component="img"
            height="200"
            image={event.exContent}
            alt={event.eventName}
          />
        )}
        <CardContent>
          <Typography variant="h5" component="h2" align="center">
            {event.eventName}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} textAlign="left">
              <Typography variant="body2" component="p">
                {event.eventDesc}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Address: {event.address}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography variant="body2" color="textSecondary">
                Date: {dayjs(event.eventDateTime).format("YYYY-MM-DD HH:mm")}
              </Typography>
            </Grid>
            <Grid
              container
              item
              xs={12}
              justifyContent="center"
              alignItems="flex-end"
            >
              <Grid item xs={6} textAlign="left">
                <Typography variant="body2" color="textSecondary">
                  Participant: {participantCount}/{event.participant}
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2" color="textSecondary">
                  Friends Only
                  <FontAwesomeIcon
                    icon={event.onlyFriends ? faLock : faLockOpen}
                    style={{ marginLeft: 8 }}
                  />
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              item
              xs={12}
              justifyContent="right"
              alignItems="flex-end"
            >
              <Button
                variant="contained"
                onClick={() =>
                  handleJoin(
                    currentEvent.id,
                    currentEvent,
                    setParticipantCount,
                    setCurrentEvent
                  )
                }
              >
                JOIN
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default EventCard;
