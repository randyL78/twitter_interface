const express = require('express');
// const expressWs = require('express-ws')(express);
const router = express.Router();


// custom middleware
const twitData = require('./twitData');

/* route for ws socket */
// router.ws('/echo', (ws, req) => {
//   ws.on('message', msg => {
//     ws.send(msg);
//   })
// })

/* Main route, gathers data from twitter and displays page */
router.get('/', twitData.getData);

/* This route gets hit only if something goes wrong and will display an error page */
router.get('/', (req, res) => res.render('error', {data: "name: user"}));

/* This picks up all other routes and displays a 404-like error page */
router.get('*', (req, res) => res.render('notFound', {data: "name: user"}));

module.exports = router;