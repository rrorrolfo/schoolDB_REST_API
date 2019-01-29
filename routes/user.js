const express = require("express");
const router = express.Router();
const { User } = require("../models");
const {authentication} = require("../js/authentication");


// returns the currently authenticated user
router.get("/users", authentication.authenticateUser, (req, res, next) => {
    const authenticatedUser = req.currentUser;

    // Authenticated user
    res.json( { user: `${authenticatedUser.firstName} ${authenticatedUser.lastName}` });
});


// Creates a user, sets the "Location" header to "/" and returns no content
router.post("/users", (req, res, next) => {
    
    // Creates a nuew user in the DB 
    const user = new User(req.body);

    // Checks if the email provided exists already in DB
    User.findOne( {emailAddress: user.emailAddress}, null, (error, userEmail) => {

        if (userEmail) {
            error = new Error("Email address already registered");
            error.status = 400;
            return next(error);

        }

    user.save( (err, user) => {

        //checks for validation errors
        if (err) {

            const errors = err.errors;
            const errorMessages = [];

            // Iterates every error object and pushes the error message to errorMessages array which is then sent to the client in json format
            Object.values(errors).forEach( key => errorMessages.push(key.message));
            
            return res.status(400).json({errors: errorMessages});

        } else {

            res.location("/");
            res.sendStatus(201);

            }
        
        }); // Finishes saving new user to DB
    
    }); // Finished middleware
    
});

module.exports = router;