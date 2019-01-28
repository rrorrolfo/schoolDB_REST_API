const express = require("express");
const router = express.Router();
const { Course } = require("../models");
const { User } = require("../models");
const bcryptjs = require("bcryptjs");
const authenticator = require("basic-auth");

// Validation middleware
const authenticateUser = (req, res, next) => {

    // Parses users credentials from Authorization header.
    const credentials = authenticator(req);
    let message = "";

    if (credentials) {
        // Attemps to find one user from DB that matches the email provided
        User.findOne( {emailAddress: credentials.name}, null, (err, user) => {

                if (user) {
                    // Compares provided password with the one stored in DB for the user found 
                    const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

                    if(authenticated) {
                        // If the passwords match then the user is stored in the currentUser property of the req object
                        console.log(`Authentication successful for username: ${user.firstName}`);
                        req.currentUser = user;
                        
                    } else {
                        message = `Authentication failure for email ${user.emailAddress}`;
                    }

                } else {
                message = `User not found for ${credentials.name}`;
                }

            // If there is an error, a message is returned and logged to console, status 401 is sent
            if(message) {
                console.warn(message);
                res.status(401).json({message: "Access Denied"});
            } else {
                next();
            }

        });

    } 

}

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
router.post("/courses",authenticateUser, (req, res, next) => {
    const course = new Course(req.body);

    course.save( (err, course) => {

        if (err) {

            const errors = err.errors;
            const errorMessages = [];

            // Iterates every error object and pushes the error message to errorMessages array which is then sent to the client in json format
            Object.values(errors).forEach( key => errorMessages.push(key.message));

            return res.status(400).json({errors: errorMessages});

        } else {
            res.location(`/api/courses/${course.id}`);
            res.sendStatus(201);
        }

    });

});

// Updates a course and returns no content
router.put("/courses/:cID",authenticateUser, (req, res) => {

    req.course.updateOne(req.body, (err) => {

        if (err) {
            return next(err);
        } else {
            res.sendStatus(204);
        }

    });
    
});

// Deletes a course and returns no content
router.delete("/courses/:cID", authenticateUser, (req, res) => {
    
    req.course.remove( (err) => {
        if (err) {
            return next(err);
        } else {
            res.sendStatus(204);
        }
    });

});

module.exports = router;