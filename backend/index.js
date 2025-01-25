const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter=require("./routes/user-routes");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/user",userRouter);
// Connect to MongoDB
mongoose.connect(`${process.env.DATABASE_URL}`).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err,"database connection error"));

app.get("/", (req, res) => res.send("Server is running!"));

app.listen(5000, () => console.log("Server running on port 5000"));
