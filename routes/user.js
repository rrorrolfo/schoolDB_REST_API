const express = require("express");
const router = express.Router();
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

        }); // Finished working with the user to authenticate

    } 

} // Finished authentication function


// returns the currently authenticated user
router.get("/users",authenticateUser, (req, res, next) => {
    const authenticatedUser = req.currentUser;

    // Authenticated user
    res.json( { user: `${authenticatedUser.firstName} ${authenticatedUser.lastName}` });
});


// Creates a user, sets the "Location" header to "/" and returns no content
router.post("/users", (req, res, next) => {
    
    // Creates a nuew user in the DB 
    const user = new User(req.body);

    // Checks if the email provided exists already in DB

    User.findOne( {emailAddress: user.emailAddress}, null, (err, userEmail) => {

        if (userEmail) {
            err = new Error("Email address already registered");
            err.status = 500;
            return next(err);

        } else {
            // Hashes the user´s password before saving user to DB
            user.password = bcryptjs.hashSync(user.password);

            user.save( (err, user) => {
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
        }
    }); // Finished middleware

});

module.exports = router;