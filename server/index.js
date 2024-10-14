require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");

const app = express();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL;

//#region  Connect to DB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
//#endregion

//#region Middlewares
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
//#endregion

//#region Routes
app.use("/api/auth/", userRoutes);
//#endregion

//#region Error Handler
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages[0] });
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(400).json({ message: "User already exists" });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.status(500).json({ message: "Server error" });
});
//#endregion

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
