import express from "express";
import dotnev from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotnev.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

//this middleware allows to extract the json data
app.use(express.json());
//parse the cookies
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//Routes for authentication
app.use("/api/auth", authRoute);

//Routes for messages
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server is running port ", PORT);
  connectDB();
});
