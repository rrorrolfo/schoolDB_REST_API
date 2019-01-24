const express = require("express");
const router = express.Router();

// Returns a list of courses - including the user that owns each course
router.get("/courses", (req, res) => {
    
});

//Returns a specific course - including the user that owns the course
router.get("/courses/:id", (req, res) => {
    
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