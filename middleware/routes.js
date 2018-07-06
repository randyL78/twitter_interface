/* Middleware for handling url routing */

// Dependencies
const express = require('express');
const router = express.Router();

// GET home route
router.get('/', (req, res, next)  => {
  res.render('index');
})

module.exports = router;