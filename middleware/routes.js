/* Middleware for handling url routing */

// Dependencies
const express = require('express');
const router = express.Router();

const twitData = require("./twitData");

router.get('/', twitData);

router.get('*', (req, res, next) => {
  const data =   req.data ||  {name: "User"}
  res.render('notFound', {data})
});

module.exports = router;