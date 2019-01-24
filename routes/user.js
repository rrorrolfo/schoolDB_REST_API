const express = require("express");
const router = express.Router();

// returns the currently aythenticated user
router.get("/users", (req, res) => {
    
});


// Creates a user, sets the "Location" header to "/" and returns no content
router.post("/users", (req, res) => {

})

module.exports = router;