const express = require("express");
const router = express.Router();

// root route
router.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the REST API project!',
    });
  });

module.exports = router;