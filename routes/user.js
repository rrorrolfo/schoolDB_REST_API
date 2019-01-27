const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcryptjs = require("bcryptjs");
const authenticator = require("basic-auth");

// Validation middleware
const authenticateUser = (req, res, next) => {

    const credentials = authenticator(req);
    let message = "";
    console.log(credentials);

    if (credentials) {

        const userFound = User.findOne( {emailAddress: credentials.name}, null, {sort: {title: 1}}, (err, user) => {

            console.log(user, 1);
        
                if (user) {
                    console.log(user, 2);
                const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
                console.log(authenticated, "auth");

                    if(authenticated) {
                        console.log(`Authentication successful for username: ${user.firstName}`);
                        req.currentUser = user;
                        
                        console.log(req.currentUser,"req.currentUser");
                    } 

            } 

        });
    } 

    if(message) {
        console.warn(message);
        res.status(401).json({message: "Access Denied"});
    } else {
        next();
    }

    

}

// returns the currently authenticated user
router.get("/users", authenticateUser, (req, res) => {

    console.log(req.currentUser, "final");
    res.send("here");
});


// Creates a user, sets the "Location" header to "/" and returns no content
router.post("/users", (req, res, next) => {
    
    // Creates a nuew user in the DB 
    const user = new User(req.body);

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
    });

});

module.exports = router;