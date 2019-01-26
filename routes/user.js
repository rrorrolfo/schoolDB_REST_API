const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { check, validationResult } = require('express-validator/check');
const bcryptjs = require("bcryptjs");

// returns the currently authenticated user
router.get("/users", (req, res) => {
    res.send("hello");
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