const express = require("express");
const router = express.Router();
const { Course } = require("../models");

// Preloads course ID (cID) when URL parameter is present (:cID)

router.param("cID", (req, res, next, id) => {

    Course.findById(id, (err, course) => {
        if(err) {
            return next(err);
        } else if (!course) {
            err = new Error("Course not found");
            err.status = 404;
            return next(err);
        } else {
            // course found is assinged to course key in req object
            req.course = course;
            return next();
        }
    });

});

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
    
    res.status(200);
    res.json(req.course);

});

// Creates a course, sets the Location header to the URI for the course, and returns no content
router.post("/courses", (req, res, next) => {
    const course = new Course(req.body);

    course.save( (err, course) => {

        if (err) {
            
            const errors = err.errors;
            const errorMessages = [];

            Object.values(errors).forEach( key => errorMessages.push(key.message));

            return res.status(400).json({errors: errorMessages});

        } else {
            res.location(`/api/courses/${course.id}`);
            res.status(201);
        }

    });

});

// Updates a course and returns no content
router.put("/courses/:cID", (req, res) => {

    req.course.updateOne(req.body, (err) => {

        if (err) {
            return next(err);
        } else {
            res.sendStatus(204);
        }

    });
    
});

// Deletes a course and returns no content
router.delete("/courses/:cID", (req, res) => {
    
    req.course.remove( (err) => {
        if (err) {
            return next(err);
        } else {
            res.sendStatus(204);
        }
    });

});

module.exports = router;