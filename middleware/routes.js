/* Middleware for handling url routing */

// Dependencies
const express = require('express');
const router = express.Router();

// GET home route
router.get('/', (req, res, next)  => {
  const data =  req.data ||  {name: "User"};

  res.render('index', {data});
})

module.exports = router;