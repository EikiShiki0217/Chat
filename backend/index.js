require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/connectDatabase");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;
const socketio = require("socket.io");
const server = require("http").createServer(app);
const io = socketio(server, {
  cors: {
    origin: ["http://172.16.151.37:3000", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(cors(corsOptions));

app.use(express.json({ limit: "40mb" }));
app.use(express.urlencoded({ extended: true, limit: "40mb" }));

app.use(cookieParser());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("dataUpdated", (updatedData) => {
    try {
      io.emit("newChat", updatedData);

      io.emit("newConversation", updatedData);
    } catch (error) {
      console.error("Error saving data to the database:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
