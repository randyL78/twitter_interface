const express = require('express');
const router = express.Router();

// custom middleware
const twitData = require('./twitData');

router.get('/', twitData);

router.get('*', (req, res) => res.render('notFound', {data: "name: user"}));

module.exports = router;