const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { check, validationResult } = require('express-validator/check');

// returns the currently authenticated user
router.get("/users", (req, res) => {
    res.send("hello");
});


// Creates a user, sets the "Location" header to "/" and returns no content
router.post("/users", (req, res, next) => {

    // Creates a nuew user in the DB 
    const user = new User(req.body);
    
    user.save( (err, user) => {
        if (err) {
            return next(err);
        } else {
            res.location("/");
            res.status(201);
        }
    });

});

module.exports = router;