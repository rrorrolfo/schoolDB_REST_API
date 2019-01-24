'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    password: String
  });

// Course schema
const courseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User"},
    title: String,
    description: String,
    estimatedTime: String,
    materialsNeeded: String
  });

// Models
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

//Exports
module.exports.User = User;
module.exports.Course = Course;