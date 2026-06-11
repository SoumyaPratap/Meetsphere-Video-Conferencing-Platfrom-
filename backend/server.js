require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const meetingRoutes = require("./routes/meeting");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);

app.get("/", (req, res) => {
  res.send("MeetSphere Backend Running");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const roomUsers = {};

io.on("connection", (socket) => {
  console.log("✅ User Connected:", socket.id);

  socket.on("join-room", (meetingId) => {
    console.log(
      "🔥",
      socket.id,
      "joined room",
      meetingId
    );

    socket.join(meetingId);

    if (!roomUsers[meetingId]) {
      roomUsers[meetingId] = [];
    }

    if (
      !roomUsers[meetingId].includes(
        socket.id
      )
    ) {
      roomUsers[meetingId].push(socket.id);
    }

    socket.meetingId = meetingId;

    console.log(
      "👥 Room Users:",
      roomUsers[meetingId]
    );

    io.to(meetingId).emit(
      "room-users",
      roomUsers[meetingId]
    );

    io.to(meetingId).emit(
      "user-joined",
      "A participant joined the meeting"
    );

    const room =
      io.sockets.adapter.rooms.get(
        meetingId
      );

    const participants = room
      ? room.size
      : 0;

    console.log(
      "📊 Participants:",
      participants
    );

    io.to(meetingId).emit(
      "participants-count",
      participants
    );
  });

  // =====================
  // OFFER
  // =====================
  socket.on("offer", (data) => {
    console.log(
      "📤 Offer:",
      socket.id,
      "->",
      data.target
    );

    socket.to(data.target).emit(
      "offer",
      data
    );
  });

  // =====================
  // ANSWER
  // =====================
  socket.on("answer", (data) => {
    console.log(
      "📤 Answer:",
      socket.id,
      "->",
      data.target
    );

    socket.to(data.target).emit(
      "answer",
      data
    );
  });

  // =====================
  // ICE CANDIDATE
  // =====================
  socket.on("ice-candidate", (data) => {
    console.log(
      "🧊 ICE:",
      socket.id,
      "->",
      data.target
    );

    socket.to(data.target).emit(
      "ice-candidate",
      data
    );
  });

  // =====================
// CHAT MESSAGE
// =====================
socket.on("chat-message", (data) => {
  console.log(
    "💬 Chat:",
    data.message
  );

  io.to(data.meetingId).emit(
    "chat-message",
    {
      sender: socket.id,
      message: data.message,
    }
  );
});

  socket.on("disconnect", () => {
    const meetingId =
      socket.meetingId;

    if (
      meetingId &&
      roomUsers[meetingId]
    ) {
      roomUsers[meetingId] =
        roomUsers[meetingId].filter(
          (id) => id !== socket.id
        );

      console.log(
        "❌ Removed User:",
        socket.id
      );

      console.log(
        "👥 Remaining Users:",
        roomUsers[meetingId]
      );

      io.to(meetingId).emit(
        "room-users",
        roomUsers[meetingId]
      );

      const room =
        io.sockets.adapter.rooms.get(
          meetingId
        );

      const participants = room
        ? room.size
        : 0;

      io.to(meetingId).emit(
        "participants-count",
        participants
      );
    }

    console.log(
      "❌ User Disconnected:",
      socket.id
    );
  });
});

server.listen(5000, () => {
  console.log(
    "🚀 Server Running on Port 5000"
  );
});