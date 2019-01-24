const express = require("express");
const router = express.Router();
const { Course } = require("../models");

// Returns a list of courses - including the user that owns each course
router.get("/courses", (req, res, next) => {
    Course.find({}, null, {sort: {title: 1}}, (err, courses) => {
        if(err) {
            return next(err);
        } else {
            res.status(200);
            res.json(courses);
        }
    });
});

//Returns a specific course - including the user that owns the course
router.get("/courses/:cID", (req, res, next) => {
    const course_to_find = req.params.cID;

    Course.findById(course_to_find, (err, course) => {
        if(err) {
            return next(err);
        } else {
            res.status(200);
            res.json(course);
        }
    });

});

// Creates a course, sets the Location header to the URI for the course, and returns no content
router.post("/courses/", (req, res) => {
    
});

// Updates a course and returns no content
router.put("/courses", (req, res) => {
    
});

// Deletes a course and returns no content
router.delete("/courses", (req, res) => {
    
});

module.exports = router;