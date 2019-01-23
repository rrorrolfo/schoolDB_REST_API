'use strict';

// load modules
const express = require('express');
const mongoose = require("mongoose");
const morgan = require('morgan');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// conection to mongoose
mongoose.connect("mongodb://localhost:27017/fsjstd-restapi");

const db = mongoose.connection;

// mongoose connection error handler
db.on("error", err => console.log("There was a connection error:", err));

//mongoose succesful connection handler
db.once("open", () => {
  console.log("Database connection successful");

  const userSchema = new mongoose.Schema({
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string
  });

  const courseSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "User"},
    title: string,
    description: string,
    estimatedtime: string,
    materialsNeeded: string
  });

  const User = mongoose.model("User", userSchema);
  const Course = mongoose.model("Course", courseSchema);

  db.close();
});

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
