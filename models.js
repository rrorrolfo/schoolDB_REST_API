'use strict'

const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema({
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string
  });

// Course schema
const courseSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "User"},
    title: string,
    description: string,
    estimatedtime: string,
    materialsNeeded: string
  });

// Models
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

//Exports
module.exports.User = User;
module.exports.Course = Course;