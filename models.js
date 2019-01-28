'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema({
    firstName: { type: String,
      required: "First Name is required",
      trim: true},
    lastName: { type: String,
      required: "Last Name is required",
      trim: true},
    emailAddress: { type: String,
      required: "An Email is required",
      trim: true,
      validate: {
        validator: email => /^[^@]+@[^@.]+\.[a-z]+$/i.test(email),
        message: "Email needs to have one '@' and a domain"
      } },
    password: { type: String,
      required: "A Password is required"}
  });

// Course schema
const courseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User"},
    title: { type: String,
      required: "Title is required",
      trim: true},
    description: { type: String,
      required: "Description is required",
      trim: true},
    estimatedTime: { type: String,
      trim: true},
    materialsNeeded: {type: String,
      trim: true}
  });

// Models
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

//Exports
module.exports.User = User;
module.exports.Course = Course;