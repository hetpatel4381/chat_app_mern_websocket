import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Box, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const socket = useMemo(
    () =>
      io("http://localhost:5000", {
        withCredentials: true,
      }),
    []
  );

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);

      socket.on("receive-message", (data) => {
        console.log(data);
        setMessages((messages) => [...messages, data]);
      });

      socket.on("welcome", (s) => {
        console.log(s);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  return (
    <Container maxWidth="sm">
      {/* <Box sx={{height: 500}}/> */}
      <Typography varient="h1" component="div" gutterBottom>
        {`Socket id: ${socketId}`}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          varient="outlined"
        />
        <button type="submit" varient="contained" color="primary">
          Join Room
        </button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          varient="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          varient="outlined"
        />
        <button type="submit" varient="contained" color="primary">
          Send
        </button>
      </form>

      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
