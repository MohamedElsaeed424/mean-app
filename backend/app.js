const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const imagesLoader = require("./util/image-loader");

const postsRoutes = require('./routes/posts/posts');
const authRoutes = require('./routes/auth/auth');

const app = express();

// const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.myqomzt.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
const MONGODB_URI = "mongodb+srv://mohamedsmenshawy:Saeed!205505@cluster0.myqomzt.mongodb.net/";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Database connection failed: ",err);
  });


app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", imagesLoader);



//---to solve the problem of CORS (different ports) we should set some headers while connecting with Front end---
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE ,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type , Authorization , Accept, Origin, X-Requested-With"
  );
  next();
});

app.use("/posts",postsRoutes);
app.use("/auth",authRoutes);


app.use((error, req, res, next) => {
  console.log("Error: ",error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});



module.exports = app;

