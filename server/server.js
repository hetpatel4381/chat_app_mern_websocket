import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const jwtSecretKey = "HetPatel";
const port = 5000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello Het Patel");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "hetpatel4381" }, jwtSecretKey);

  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({ message: "Login Success" });
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    if (err) return next(err);

    const token = socket.request.cookies.token;

    if (!token) return next(new Error("Authentication Error"));

    const decoded = jwt.verify(token, jwtSecretKey);
    next();
  });
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("message", ({ message, room }) => {
    console.log({ message, room });
    // io.emit("receive-message", data);
    // socket.broadcast.emit("receive-message", data);
    // io.to(room).emit("receive-message", message);
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User Joined Room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
