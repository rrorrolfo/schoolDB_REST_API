const express = require("express");
const router = express.Router();
const { User } = require("../models");

// returns the currently authenticated user
router.get("/users", (req, res) => {
    res.send("hello");
});


// Creates a user, sets the "Location" header to "/" and returns no content
router.post("/users", (req, res, next) => {
    
    const user = new User(req.body);
    
    user.save( (err, user) => {
        if (err) {
            return next(err);
        } else {
            res.status(201);
            res.json(user);
        }
    });

});

module.exports = router;