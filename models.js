'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema({
    firstName: { type: String,
      required: "First Name is required"},
    lastName: { type: String,
      required: "Last Name is required"},
    emailAddress: { type: String,
      required: "An Email is required"},
    password: { type: String,
      required: "A Password is required"}
  });

// Course schema
const courseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User"},
    title: { type: String,
      required: "Title is required"},
    description: { type: String,
      required: "Description is required"},
    estimatedTime: String,
    materialsNeeded: String
  });

// Models
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

//Exports
module.exports.User = User;
module.exports.Course = Course;