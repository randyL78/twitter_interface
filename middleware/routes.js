/* Middleware for handling url routing */

// Dependencies
const express = require('express');
const router = express.Router();

const twitData = require("./twitData");

/* handle the base route  */
router.get('/', twitData);

/* for any other route, display a 404-like page */
router.get('*', (req, res) => {
  const data =   req.data ||  {name: "User"}
  res.render('notFound', {data})
});

module.exports = router;