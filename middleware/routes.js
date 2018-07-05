/* Middleware for handling url routing */

// Dependencies
const express = require('express');
const router = express.Router();

// GET home route
router.get('/', (req, res, next)  => {
  res.send(`<h1>Initial project started</h1>`);
})

module.exports = router;