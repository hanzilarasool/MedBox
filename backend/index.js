const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// routes
const boxRouter = require("./routes/box-routes");
const userRouter=require("./routes/user-routes");
const chatRouter = require("./routes/chat-routes");
// middleware

require("dotenv").config(); 

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(`${process.env.DATABASE_URL}`).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err,"database connection error"));
app.use((req,res,next)=>{
  console.log(`${req.method} ${req.originalUrl}`);

  next();
})
  app.use("/api/user",userRouter);
  app.use("/api/boxes", boxRouter);
  app.use("/api/chat", chatRouter);

app.get("/", (req, res) => res.send("Server is running!"));


app.listen(5000, "0.0.0.0", () => {
  console.log("Server is running on port 5000");
});

