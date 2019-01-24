'use strict';

// load modules
const express = require('express');
const mongoose = require("mongoose");
const jsonParser = require("body-parser").json;
const morgan = require('morgan');
const { User } = require("./models");

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();
app.use(jsonParser());

// conection to mongoose
mongoose.connect("mongodb://localhost:27017/fsjstd-restapi", { useNewUrlParser: true });

const db = mongoose.connection;

// mongoose connection error handler
db.on("error", err => console.log("There was a connection error:", err));

//mongoose succesful connection handler
db.once("open", () => {
  console.log("Database connection successful");
});

// setup morgan which gives us http request logging
app.use(morgan('dev'));

////////  API routes  ///////// 

  // Requiring route modules
  const routes = require("./routes");
  const userRoutes = require("./routes/user");
  const courseRoutes = require("./routes/course");
  //root route
  app.use(routes);

  //user routes
  app.use("/api", userRoutes);

  //course routes
  app.use("/api", courseRoutes);


///////// ERRORS HANDLING /////////

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

/////// SERVER ////////

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
